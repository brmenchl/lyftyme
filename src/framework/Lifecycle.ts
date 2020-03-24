import { useState, useCallback } from "react";
import { Dependency, DependencyState, dependencyUnknown } from "./Dependency";
import { run } from "./runner";

export type Lifecycle = {
  enter: () => any;
  leave: () => void;
  dependencyState: DependencyState;
};

export const useLifecycle = (dependencies: Dependency[]): Lifecycle => {
  const [dependencyState, setDependencyState] = useState<DependencyState>(
    dependencyUnknown
  );

  const enter = useCallback(() => run(dependencies, setDependencyState), [
    dependencies,
    setDependencyState
  ]);

  const leave = useCallback(() => ({}), []);

  return {
    enter,
    leave,
    dependencyState
  };
};
