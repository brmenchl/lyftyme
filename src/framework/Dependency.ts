import { CancellableFunction } from "../cancellable";

export type Dependency = {
  dependsOn: string[];
  key: string;
  resolve: CancellableFunction;
  nonBlocking?: boolean;
};

export const dependencyError = (error: any) => ({
  type: "DEPENDENCY_ERROR" as const,
  value: error
});

type DependencyError = ReturnType<typeof dependencyError>;

export const dependencyPending = {
  type: "DEPENDENCY_PENDING" as const
};

type DependencyPending = typeof dependencyPending;

export const dependencyOk = {
  type: "DEPENDENCY_OK" as const
};

type DependencyOk = typeof dependencyOk;

export const isOk = (
  dependencyState: DependencyState
): dependencyState is DependencyOk => dependencyState.type === "DEPENDENCY_OK";

export const dependencyUnknown = {
  type: "DEPENDENCY_UNKNOWN" as const
};

type DependencyUnknown = typeof dependencyUnknown;

export type DependencyState =
  | DependencyError
  | DependencyPending
  | DependencyOk
  | DependencyUnknown;
