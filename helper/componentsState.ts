import type { COMPONENT_STATE } from "~/types/components";
import { ComponentsStateKeys } from "../types/components";
export default function changeComponentState(
  componentKey: string,
): COMPONENT_STATE {
  const componentsState: COMPONENT_STATE = {
    [ComponentsStateKeys.WELCOME]: false,
    [ComponentsStateKeys.LOADBUSINFO]: false,
    [ComponentsStateKeys.LOADING]: false,
    [ComponentsStateKeys.LOGIN]: false,
  };
  for (const [k, v] of Object.entries(componentsState)) {
    if (k === componentKey) {
      componentsState[componentKey] = true;
    } else {
      componentsState[k] = false;
    }
  }
  console.log(componentsState);
  return componentsState;
}
