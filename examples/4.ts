import { ITask, IWorkflow, TaskType } from "../src/types";

export class Workflow implements IWorkflow {
  name: string;
  version: string;

  constructor() {
    this.name = "example4";
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
      type: TaskType.simple,
      func: (): Promise<string> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log("test step2");
            resolve("hello");
          }, 5000);
        });
      },
      requires: [
        "step1",
      ],
    } as ITask,
    {
      name: "step3",
      type: TaskType.simple,
      func: (): Promise<string> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log("test step3");
            resolve("hello");
          }, 1000);
        });
      },
      requires: [
        "step1",
      ],
    } as ITask,
    {
      name: "step4",
      func: (): Promise<string> => {
        console.log("test step4");
        return Promise.resolve("hello");
      },
      requires: [
        "step2",
        "step3",
      ],
    } as ITask,
  ];
}
