import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dependency } from "./framework/Dependency";
import { useLifecycle } from "./framework/Lifecycle";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const one = function*() {
  console.log("1-start");
  yield delay(5000);
  console.log("1-end");
};

const two = function*() {
  console.log("2-start");
  // yield Promise.reject("uh oh");
  // throw new Error('uh oh error');
  yield delay(40);
  console.log("2-end");
};

const three = function*() {
  console.log("3-start");
  yield delay(2000);
  console.log("3-end");
};

const dependencies: Dependency[] = [
  {
    key: "three",
    resolve: three,
    dependsOn: ["two", "one"]
  },
  {
    key: "one",
    resolve: one,
    dependsOn: []
  },
  {
    key: "two",
    resolve: two,
    dependsOn: ["one"]
  }
];

const RenderContext: React.FC = () => {
  const { enter, leave, dependencyState } = useLifecycle(dependencies);

  React.useEffect(() => {
    enter();
    return () => {
      leave();
    };
  }, [enter, leave]);

  return <div>{JSON.stringify(dependencyState)}</div>;
};

ReactDOM.render(<RenderContext />, document.getElementById("root"));
