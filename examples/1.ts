import { ITask, IWorkflow } from "../src/workflow";

export class Workflow implements IWorkflow {
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
      func: () => {
        console.log(`${this.name}: step1`);
      },
      output: () => {},
      requires: [],
    } as ITask,
  ];
}
