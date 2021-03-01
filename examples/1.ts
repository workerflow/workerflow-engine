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
      func: (): Promise<string> => {
        console.log(`${this.name}: step1`);
        return Promise.resolve("hello");
      },
      output: () => {},
      requires: [],
    } as ITask,
  ];
}
