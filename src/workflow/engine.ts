import * as process from 'process'

import { ITask } from './model'

function main() {
  if (process.argv.length <= 2) {
    console.log('Please set sample num')
    return
  }
  let sample = process.argv[2]
  let workflow = require(`./samples/${sample}`).Workflow
  let w = new workflow()
  console.log(`Running workflow ${w.name}`)
  console.log(`ApiVersion: ${w.apiVersion}`)

  let dataFlow: Map<string, any> = new Map()
  let dataCurrent: any

  w.tasks().forEach((task: ITask) => {
    if (task.fif !== undefined || task.bif != undefined) {
      if ((task.fif !== undefined && task.fif()) || (task.bif !== undefined && task.bif)) {
        task.func(dataFlow)
      } else if (task.else != undefined) {
        task.else(dataFlow)
      } else {
        task.func(dataFlow)
      }
    } else if (task.repeat !== undefined) {
      for (let i = 0; i < task.repeat; i++) {
        task.func()
      }
    } else {
      if (task.input !== undefined) {
        dataCurrent = task.func(task.input(dataFlow), dataFlow)
      } else {
        dataCurrent = task.func(dataFlow)
      }
    }
    dataFlow.set(task.name, task.output(dataCurrent))
  })
  console.log(dataFlow)
}

main()
