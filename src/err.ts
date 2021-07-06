export const ReasonStepNameNotUnique = "StepNameNotUnique";
export const ReasonNoStart = "NoStart";
export const ReasonMultiStart = "MultiStart";
export const ReasonIfNoCondition = "IfNoCondition";
export const ReasonIfNotSupport = "IfNotSupport";
export const ReasonIfNoElseFunction = "IfNoElseFunction";
export const ReasonWhileNoCondition = "WhileNoCondition";
export const ReasonWhileNotSupport = "WhileNotSupport";
export const ReasonRepeatNoCondition = "RepeatNoCondition";
export const ReasonRepeatNotSupport = "RepeatNotSupport";
export const ReasonTaskTypeNotSupport = "TaskTypeNotSupport";
export const ReasonNoFunction = "NoFunction";

export class EngineError extends Error {
  constructor(public reason: string, public message: string) {
    super();
  }
}
