export interface ICallback {
  (...args: any[]): any;
}

export interface ICallbackBoolean {
  (...args: any[]): boolean;
}

export interface ITask {
  name: string;

  start: boolean;

  input?: ICallback;

  // repeat times
  repeat?: number | boolean;

  // while
  while?: ICallbackBoolean | boolean;

  // if
  if?: ICallbackBoolean | boolean;
  else?: ICallback;

  func: ICallback;

  output: ICallback;

  requires: string[];
}

export interface IWorkflow {
  name: string;
  version: string;
  tasks: ITask[];
}
