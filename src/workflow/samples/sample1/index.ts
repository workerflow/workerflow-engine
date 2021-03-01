import { ITask, IWorkflow } from "../../model";

export class Workflow implements IWorkflow {
  name: string;
  apiVersion: string;
  private step6Num: number;
  constructor() {
    this.name = "example1";
    this.apiVersion = "v1";

    this.step6Num = 0;
  }
  tasks = (): ITask[] => {
    return [
      {
        name: "step1",
        func: () => {
          console.log(`${this.name}: step1`);
        },
        output: () => {},
      } as ITask,
      {
        name: "step2",
        func: () => {
          console.log(`${this.name}: step2`);
        },
        output: () => {},
      } as ITask,
      new step3() as ITask,
      {
        name: "step4",
        fif: (): boolean => {
          return true;
        },
        func: () => {
          console.log(`${this.name}: step4, if condition is true`);
        },
        output: () => {},
      } as ITask,
      {
        name: "step5",
        fif: (): boolean => {
          return false;
        },
        else: () => {
          console.log(`${this.name}: step5, if condition is false`);
        },
        func: () => {
          console.log(`${this.name}: step5, if condition is true`);
        },
        output: () => {},
      } as ITask,
      {
        name: "step6",
        repeat: 4,
        func: () => {
          this.step6Num++;
          console.log(`${this.name}: step6, num is ${this.step6Num}`);
        },
        output: () => {},
      } as ITask,
    ];
  };
}

class step3 implements ITask {
  name: string;
  constructor() {
    this.name = "example1";
  }
  func = () => {
    console.log(`another step: ${this.name}`);
  };
  output = () => {};
}
