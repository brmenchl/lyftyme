import { Graph, topologicalSort } from "../graph";
import { CancelToken, cancellable } from "../cancellable";
import {
  Dependency,
  DependencyState,
  dependencyError,
  dependencyPending,
  dependencyOk,
  isOk
} from "./Dependency";

const isGeneratorFunction = (func: Function): func is GeneratorFunction =>
  func.constructor.name === "GeneratorFunction";

export const run = async (
  dependencies: Dependency[],
  setDependencyState: (dependencyState: DependencyState) => void
) => {
  setDependencyState(dependencyPending);
  const cancelToken = new CancelToken();
  const runOrder = topologicalSort(new Graph(dependencies));

  for (const dependency of runOrder) {
    const dependencyFunc = dependency.resolve;
    const cancellableFunc = cancellable(
      isGeneratorFunction(dependencyFunc)
        ? dependencyFunc
        : function*(token) {
            yield dependencyFunc(token);
          }
    ).bind(null, cancelToken);
    try {
      if (dependency.nonBlocking) {
        cancellableFunc();
      } else {
        await cancellableFunc();
      }
    } catch (e) {
      cancelToken.abort(e);
      setDependencyState(dependencyError(e));
      return;
    }
  }
  setDependencyState(dependencyOk);
};
