import { strictEqual } from "assert";

import Engine from "../src/engine";

import simple from "./samples/simple";
import flow from "./samples/flow";
import repeat from "./samples/repeat";
import requires from "./samples/requires";
import notuniquestep from "./samples/notuniquestep";
import { EngineError, ReasonStepNameNotUnique } from "../src/err";

describe("engine test", () => {
  it("simple test", async () => {
    let workflow = new simple();
    let engine = new Engine(workflow);
    let result = await engine.start();
    strictEqual(result, null);
  });
  it("flow test", async () => {
    let workflow = new flow();
    let engine = new Engine(workflow);
    let result = await engine.start();
    strictEqual(result, null);
  });
  it("repeat test", async () => {
    let workflow = new repeat();
    let engine = new Engine(workflow);
    let result = await engine.start();
    strictEqual(result, null);
  });
  it("requires test", async () => {
    let workflow = new requires();
    let engine = new Engine(workflow);
    let result = await engine.start();
    strictEqual(result, null);
  });
  it("notuniquestep test", async () => {
    let workflow = new notuniquestep();
    try {
      new Engine(workflow);
    } catch (error: any) {
      strictEqual(error.reason, ReasonStepNameNotUnique);
    }
  });
});
