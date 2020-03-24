export type GraphNode = {
  key: string;
  dependsOn: string[];
};

export class Graph<T extends GraphNode> {
  private dependents: Record<string, string[]> = {};
  private nodes: Record<string, T> = {};

  constructor(nodeList: T[]) {
    nodeList.forEach(node => {
      this.nodes[node.key] = node;
      if (!Array.isArray(this.dependents[node.key])) {
        this.dependents[node.key] = [];
      }

      node.dependsOn.forEach(dependency => {
        if (!Array.isArray(this.dependents[node.key])) {
          this.dependents[node.key] = [];
        }
        this.dependents[node.key].push(dependency);
      });
    });
  }

  getKeys = () => Object.keys(this.nodes);

  getNode = (key: string) => this.nodes[key];

  getDependents = (node: T) => {
    if (!this.nodes[node.key]) {
      throw new Error(`Node ${node.key} does not exist`);
    }

    return this.dependents[node.key].map(dKey => {
      if (!this.nodes[dKey]) {
        throw new Error(
          `Node ${node.key} has dependency on missing node ${dKey}`
        );
      }
      return this.nodes[dKey];
    });
  };
}
