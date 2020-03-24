export type DFSCallbacks<Node> = {
  enterNode(node: Node): void;
  leaveNode(node: Node): void;
  shouldTraverse(nextNode: Node): boolean;
  getDependents(node: Node): Node[];
};

export const depthFirstSearch = <Node>(
  node: Node,
  callbacks: DFSCallbacks<Node>
) => {
  callbacks.enterNode(node);

  callbacks.getDependents(node).forEach(nextNode => {
    if (callbacks.shouldTraverse(nextNode)) {
      depthFirstSearch(nextNode, callbacks);
    }
  });

  callbacks.leaveNode(node);
};
