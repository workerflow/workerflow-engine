import { ITask, IWorkflow } from "../../src/types";

export default class Workflow implements IWorkflow {
  name: string;
  version: string;
  constructor() {
    this.name = "example2";
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
      func: (): Promise<string> => {
        return new Promise((resolve) => {
          setTimeout(() => {
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
        return Promise.resolve("hello");
      },
      requires: [
        "step2",
      ],
    } as ITask,
  ];
}
