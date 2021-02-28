export interface ICallback {
  (...args: any[]): any
}
export interface ICallbackBoolean {
  (...args: any[]): boolean
}

export interface ITask {
  name: string

  input?: ICallback

  // repeat
  repeat?: number

  // while
  fwhile?: ICallbackBoolean
  bwhile?: boolean // just a expr must return boolean

  // if
  fif?: ICallbackBoolean
  bif?: boolean
  else?: ICallback

  func: ICallback

  output: ICallback
}

export interface IWorkflow {
  name: string
  apiVersion: string
  tasks(): ITask[]
}
