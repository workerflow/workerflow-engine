import { ITask, IWorkflow } from "../../src/types";

export default class Workflow implements IWorkflow {
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
        return Promise.resolve("hello");
      },
      output: () => { },
      requires: [],
    } as ITask,
  ];
}
