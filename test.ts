import Engine from "./src/workerflow-engine";

function main() {
  if (process.argv.length <= 2) {
    console.log("Please set sample num");
    return;
  }
  let sample = process.argv[2];
  let workflow = require(`./examples/${sample}`).Workflow;
  let w = new workflow();

  let engine = new Engine(w);
  engine.start();
}

main();
