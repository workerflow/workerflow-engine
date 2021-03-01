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
        console.log("test step1");

        return Promise.resolve("hello");
      },
      requires: [],
    } as ITask,
    {
      name: "step2",
      func: (): Promise<string> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log("test step2");
            resolve("hello");
          }, 3000);
        });
      },
      requires: [
        "step1",
      ],
    } as ITask,
    {
      name: "step3",
      func: (): Promise<string> => {
        console.log("test step3");
        return Promise.resolve("hello");
      },
      requires: [
        "step2",
      ],
    } as ITask,
  ];
}
