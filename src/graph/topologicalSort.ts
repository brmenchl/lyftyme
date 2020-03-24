import { Graph, GraphNode } from "./Graph";
import { depthFirstSearch } from "./DFS";

export const topologicalSort = <T extends GraphNode>(graph: Graph<T>) => {
  const unvisited = graph.getKeys().reduce<Record<string, T>>(
    (acc, key) => ({
      ...acc,
      [key]: graph.getNode(key)
    }),
    {}
  );

  const visited: Record<string, T> = {};
  const sorted: T[] = [];

  while (Object.keys(unvisited).length) {
    const currentTask = unvisited[Object.keys(unvisited)[0]];
    depthFirstSearch(currentTask, {
      enterNode: currentNode => {
        visited[currentNode.key] = currentNode;
        delete unvisited[currentNode.key];
      },
      leaveNode: currentNode => {
        sorted.push(currentNode);
      },
      shouldTraverse: nextNode => !visited[nextNode.key],
      getDependents: graph.getDependents
    });
  }

  return sorted;
};
