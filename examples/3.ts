import { ITask, IWorkflow, TaskType } from "../src/types";

export class Workflow implements IWorkflow {
  name: string;
  version: string;

  testNum: number = 0;

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
      type: TaskType.repeat,
      repeat: (): boolean => {
        return this.testNum < 3;
      },
      func: (): Promise<string> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.testNum++;
            console.log("test step2");
            resolve("hello");
          }, 1000);
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
