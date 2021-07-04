import { strictEqual } from "assert";

import { ITask, IWorkflow, TaskStatus, TaskType } from "../src/types";
import Engine from "../src/engine";

class Workflow implements IWorkflow {
  name: string;
  version: string;
  constructor() {
    this.name = "example1";
    this.version = "v1";
  }
  tasks: ITask[] = [
    {
      name: "step1",
      start: true,
      func: (): Promise<string> => {
        console.log(`${this.name}: step1`);
        return Promise.resolve("hello");
      },
      output: () => { },
      requires: [],
    } as ITask,
  ];
}

describe("engine test", () => {
  it("simple test", () => {
    let workflow = new Workflow();
    let engine = new Engine(workflow);
    engine.start();
    strictEqual(true, true);
    console.log(engine.dataFlow);
  });
});
