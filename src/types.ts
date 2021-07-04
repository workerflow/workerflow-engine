export enum TaskType {
  simple,
  if,
  while,
  repeat,
}

export enum TaskStatus {
  pending,
  waiting,
  running,
  success,
  failure,
}

export interface ITask {
  name: string;

  start?: boolean;

  type?: TaskType;

  repeat?: (...args: any[]) => boolean | number;

  while?: (...args: any[]) => boolean;

  if?: (...args: any[]) => boolean;
  else?: (...args: any[]) => Promise<any>;

  func?: (...args: any[]) => Promise<any>;

  externalFunc?: {
    headers: Map<string, string>;
    method: string;
    url: string;
  };

  requires?: string[];
}

export interface IWorkflow {
  name: string;
  version: string;
  tasks: ITask[];
}
