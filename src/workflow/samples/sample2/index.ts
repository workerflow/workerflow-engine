import { IWorkflow, ITask } from '../../model'

export class Workflow implements IWorkflow {
  name: string
  apiVersion: string
  constructor() {
    this.name = 'example2'
    this.apiVersion = 'v1'
  }
  tasks = (): ITask[] => {
    return [
      {
        name: 'step1',
        func: (): any => {
          console.log(`${this.name}: step1`)
          return { something: 'hello' }
        },
        output: (params: any) => {
          return params
        },
      } as ITask,
      {
        name: 'step2',
        input: (dataFlow: Map<string, any>): any => {
          return dataFlow.get('step1')
        },
        func: (input: any, dataFlow: Map<string, any>) => {
          console.log(`${this.name}: step2`)
          return { something: input.something + ' world' }
        },
        output: (params: any) => {
          return params
        },
      } as ITask,
    ]
  }
}
