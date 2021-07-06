import { ITask, IWorkflow, TaskType } from "../../src/types";

export default class Workflow implements IWorkflow {
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
        return Promise.resolve("hello");
      },
      requires: [
        "step2",
        "step3",
      ],
    } as ITask,
  ];
}
