import { ITask, IWorkflow, TaskType } from "./workflow";
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
    for (let t of this.workflow.tasks) {
      if (t.start) {
        this.runner(t);
        break;
      }
    }
  }

  async runner(task: ITask): Promise<Error | null> {
    let res = await this.core(task);

    if (res == null) {
      for (let t of this.analyzeDependencies(task)) {
        this.runner(t);
      }
      return Promise.resolve(null);
    } else {
      return Promise.resolve(res);
    }
  }

  async core(task: ITask): Promise<Error | null> {
    this.statusFlow.set(task.name, TaskStatus.running);
    if (task.type == undefined || task.type == TaskType.simple) {
      return this.functionRunner(task);
    } else {
      switch (task.type) {
        case TaskType.if:
          if (task.if === undefined) {
            return Promise.resolve(
              new Error(`task if is not set if condition: ${task.name}`),
            );
          } else if (typeof task.if == "function") {
            if (task.if()) {
              return this.functionRunner(task);
            } else {
              return this.elseRunner(task);
            }
          }
          return Promise.resolve(
            new Error(`task if condition is not support: ${task.name}`),
          );
        case TaskType.while:
          if (task.while === undefined) {
            return Promise.resolve(
              new Error(`task while is not set while condition: ${task.name}`),
            );
          } else if (typeof task.while === "function") {
            while (task.while()) {
              let res = await this.functionRunner(task);
              if (res !== null) {
                Promise.resolve(res);
              }
            }
            return Promise.resolve(null);
          }
          return Promise.resolve(
            new Error(`task while condition is not support: ${task.name}`),
          );
        case TaskType.repeat:
          if (task.repeat === undefined) {
            return Promise.resolve(
              new Error(
                `task repeat is not set repeat condition: ${task.name}`,
              ),
            );
          } else if (typeof task.repeat === "function") {
            while (task.repeat()) {
              let res = await this.functionRunner(task);
              if (res !== null) {
                Promise.resolve(res);
              }
            }
            return Promise.resolve(null);
          } else if (typeof task.repeat === "number") {
            for (let i = 0; i < task.repeat; i++) {
              let res = await this.functionRunner(task);
              if (res !== null) {
                Promise.resolve(res);
              }
            }
            return Promise.resolve(null);
          }
          return Promise.resolve(
            new Error(`task while condition is not support: ${task.name}`),
          );
      }
    }
    return Promise.resolve(new Error(`task type is not support: ${task.name}`));
  }

  private async functionRunner(task: ITask): Promise<Error | null> {
    if (task.func == undefined) {
      return Promise.resolve(new Error(`task should set func: ${task.name}`));
    } else {
      try {
        const data = await task.func();
        this.dataFlow.set(task.name, data);
        this.statusFlow.set(task.name, TaskStatus.success);
      } catch (err) {
        this.dataFlow.set(task.name, err);
        this.statusFlow.set(task.name, TaskStatus.fail);
      }
      return Promise.resolve(null);
    }
  }

  private async elseRunner(task: ITask): Promise<Error | null> {
    if (task.else == undefined) {
      return Promise.resolve(new Error(`task should set else: ${task.name}`));
    } else {
      try {
        const data = await task.else();
        this.dataFlow.set(task.name, data);
        this.statusFlow.set(task.name, TaskStatus.success);
      } catch (err) {
        this.dataFlow.set(task.name, err);
        this.statusFlow.set(task.name, TaskStatus.fail);
      }
      return Promise.resolve(null);
    }
  }

  analyzeDependencies(task: ITask): ITask[] {
    let tasks: ITask[] = [];
    for (let t of this.workflow.tasks) {
      if (t.requires && t.requires.indexOf(task.name) != -1) {
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
