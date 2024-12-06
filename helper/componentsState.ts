import type { COMPONENT_STATE } from "~/types/components";
import {
  ComponentsStateKeys,
  SubComponentStateKeys,
} from "../types/components";
export default function changeComponentState(
  componentKey: string,
  subComponent: boolean = false,
): COMPONENT_STATE {
  const componentsState: COMPONENT_STATE = subComponent
    ? {
      [SubComponentStateKeys.LOADING]: true,
      [SubComponentStateKeys.LOCATION]: false,
      [SubComponentStateKeys.FAVS]: false,
      [SubComponentStateKeys.ROUTE]: false,
    }
    : {
      [ComponentsStateKeys.WELCOME]: false,
      [ComponentsStateKeys.LOADBUSINFO]: false,
      [ComponentsStateKeys.LOADING]: true,
      [ComponentsStateKeys.LOCATIONLOADING]: false,
      [ComponentsStateKeys.LOGIN]: false,
    };
  for (const [k, v] of Object.entries(componentsState)) {
    if (k === componentKey) {
      componentsState[componentKey] = true;
    } else {
      componentsState[k] = false;
    }
  }
  return componentsState;
}
