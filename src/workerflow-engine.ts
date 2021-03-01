import { ITask, IWorkflow } from "./workflow";
import { TaskStatus } from "./types";

export default class Engine {
  private dataFlow: Map<string, any> = new Map();
  private statusFlow: Map<string, TaskStatus> = new Map();
  private workflow: IWorkflow = { name: "", version: "", tasks: [] };
  constructor(workflow: IWorkflow) {
    this.workflow = workflow;
    this.initStatus();
    let startChecker = this.checkStart();
    if (startChecker != null) {
      throw startChecker;
    }
  }

  private initStatus() {
    for (let task of this.workflow.tasks) {
      this.statusFlow.set(task.name, TaskStatus.pending);
    }
  }

  private checkStart(): Error | null {
    let start: boolean = false;
    for (let task of this.workflow.tasks) {
      if (task.start) {
        if (!start) {
          start = true;
          return null;
        } else {
          return new Error("multi start is not allow");
        }
      }
    }
    return new Error("no task to start");
  }

  start() {
    for (let task of this.workflow.tasks) {
      return this.runner(task);
    }
  }

  runner(task: ITask): void {
    console.log(task.name);
    for (let t of this.analyzeDependencies(task)) {
      this.runner(t);
    }
  }

  analyzeDependencies(task: ITask): ITask[] {
    let tasks: ITask[] = [];
    for (let t of this.workflow.tasks) {
      if (t.requires.indexOf(task.name)) {
        tasks.push(t);
      }
    }
    return tasks;
  }

  stop() {
  }

  observ(): string[] {
    let names: string[] = [];
    for (const [key, value] of Object.entries(this.statusFlow)) {
      if (value == TaskStatus.running) {
        names.push(key);
      }
    }
    return names;
  }
}
