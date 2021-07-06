import { ITask, IWorkflow, TaskStatus, TaskType } from "./types";
import logger from "./logger";
import {
  EngineError,
  ReasonMultiStart,
  ReasonNoStart,
  ReasonStepNameNotUnique,
  ReasonIfNoCondition,
  ReasonIfNotSupport,
  ReasonWhileNoCondition,
  ReasonWhileNotSupport,
  ReasonRepeatNotSupport,
  ReasonTaskTypeNotSupport,
  ReasonNoFunction,
  ReasonIfNoElseFunction,
  ReasonRepeatNoCondition
} from "./err";

export default class Engine {
  public dataFlow: Map<string, any> = new Map();
  private statusFlow: Map<string, TaskStatus> = new Map();
  private workflow: IWorkflow = { name: "", version: "", tasks: [] };
  private starterTask: ITask = { name: "" };
  constructor(workflow: IWorkflow) {
    this.workflow = workflow;
    this.initStatus();
    let startChecker = this.checkStart();
    if (startChecker != null) {
      throw startChecker;
    }
    let nameUniqueChecker = this.checkNameUnique();
    if (nameUniqueChecker != null) {
      throw nameUniqueChecker;
    }
  }

  private initStatus() {
    for (let task of this.workflow.tasks) {
      this.statusFlow.set(task.name, TaskStatus.pending);
    }
  }

  private checkStart(): EngineError | null {
    let start: boolean = false;
    for (let task of this.workflow.tasks) {
      if (task.start) {
        this.starterTask = task;
        if (!start) {
          start = true;
        } else {
          return new EngineError(ReasonMultiStart, "multi start is not allow");
        }
      }
    }
    if (start) {
      return null;
    }
    return new EngineError(ReasonNoStart, "no task to start");
  }

  private checkNameUnique(): EngineError | null {
    let names: string[] = [];
    for (let entry of this.workflow.tasks) {
      if (names.indexOf(entry.name) === -1) {
        names.push(entry.name);
      } else {
        return new EngineError(ReasonStepNameNotUnique, `task name is not unique: ${entry.name}`);
      }
    }
    return null;
  }

  start(): Promise<EngineError | null> {
    return this.runner(this.starterTask);
  }

  async runner(task: ITask): Promise<EngineError | null> {
    let res = await this.core(task);

    if (res == null) {
      for (let t of this.getRequires(task)) {
        if (this.statusFlow.get(t.name) === TaskStatus.pending) {
          this.runner(t);
        }
      }
      return Promise.resolve(null);
    } else {
      return Promise.resolve(res);
    }
  }

  getRequires(task: ITask): ITask[] {
    let tasks: ITask[] = [];
    for (let t of this.workflow.tasks) {
      if (t.requires && t.requires.indexOf(task.name) != -1) {
        tasks.push(t);
      }
    }
    return tasks;
  }

  async checkRequiresStatus(task: ITask): Promise<null> {
    if (task.requires !== undefined) {
      let requires = task.requires;

      for (let i = 0; i < requires.length; i++) {
        let status = false;
        while (true) {
          await new Promise(resolve => {
            if (this.statusFlow.get(requires[i]) === TaskStatus.failure || this.statusFlow.get(requires[i]) === TaskStatus.success) {
              status = true;
              resolve(null);
            } else {
              setTimeout(resolve, 100, null);
              logger.debug("[%s] wait for task [%s]", task.name, requires[i]);
            }
          })
          if (status) {
            break;
          }
        }
      }
    }
    return Promise.resolve(null);
  }

  async core(task: ITask): Promise<EngineError | null> {
    this.statusFlow.set(task.name, TaskStatus.waiting);
    await this.checkRequiresStatus(task);
    this.statusFlow.set(task.name, TaskStatus.running);
    if (task.type == undefined || task.type == TaskType.simple) {
      return this.functionRunner(task);
    } else {
      switch (task.type) {
        case TaskType.if:
          if (task.if === undefined) {
            return Promise.resolve(
              new EngineError(ReasonIfNoCondition, `task if is not set if condition: ${task.name}`),
            );
          } else if (typeof task.if == "function") {
            if (task.if()) {
              return this.functionRunner(task);
            } else {
              return this.elseRunner(task);
            }
          }
          return Promise.resolve(
            new EngineError(ReasonIfNotSupport, `task if condition is not support: ${task.name}`),
          );
        case TaskType.while:
          if (task.while === undefined) {
            return Promise.resolve(
              new EngineError(ReasonWhileNoCondition, `task while is not set while condition: ${task.name}`),
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
            new EngineError(ReasonWhileNotSupport, `task while condition is not support: ${task.name}`),
          );
        case TaskType.repeat:
          if (task.repeat === undefined) {
            return Promise.resolve(new EngineError(ReasonRepeatNoCondition, `task repeat is not set repeat condition: ${task.name}`));
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
            new EngineError(ReasonRepeatNotSupport, `task repeat condition is not support: ${task.name}`),
          );
        default:
          return Promise.resolve(new EngineError(ReasonTaskTypeNotSupport, `task type is not support: ${task.name}`));
      }
    }
  }

  private async functionRunner(task: ITask): Promise<EngineError | null> {
    if (task.func == undefined) {
      return Promise.resolve(new EngineError(ReasonNoFunction, `task should set func: ${task.name}`));
    } else {
      try {
        const data = await task.func();
        this.dataFlow.set(task.name, data);
        this.statusFlow.set(task.name, TaskStatus.success);
      } catch (err) {
        this.dataFlow.set(task.name, err);
        this.statusFlow.set(task.name, TaskStatus.failure);
      }
      return Promise.resolve(null);
    }
  }

  private async elseRunner(task: ITask): Promise<EngineError | null> {
    if (task.else == undefined) {
      return Promise.resolve(new EngineError(ReasonIfNoElseFunction, `task should set else: ${task.name}`));
    } else {
      try {
        const data = await task.else();
        this.dataFlow.set(task.name, data);
        this.statusFlow.set(task.name, TaskStatus.success);
      } catch (err) {
        this.dataFlow.set(task.name, err);
        this.statusFlow.set(task.name, TaskStatus.failure);
      }
      return Promise.resolve(null);
    }
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
