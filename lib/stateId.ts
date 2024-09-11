// utils/stateId.ts
import { v4 as uuidv4 } from "uuid";

interface StateData {
  customerId: string;
  fcId?: string;
  [key: string]: any;
}

const STATE_PREFIX = "financialConnectionsState_";

export function generateStateId(data: StateData): string {
  const stateId = uuidv4();
  const state = {
    id: stateId,
    ...data,
  };
  sessionStorage.setItem(STATE_PREFIX + stateId, JSON.stringify(state));
  return stateId;
}

export function updateStateData(
  stateId: string,
  data: Partial<StateData>
): void {
  const currentState = getStateData(stateId);
  if (currentState) {
    const updatedState = { ...currentState, ...data };
    sessionStorage.setItem(
      STATE_PREFIX + stateId,
      JSON.stringify(updatedState)
    );
  }
}

export function getStateData(stateId: string): StateData | null {
  const data = sessionStorage.getItem(STATE_PREFIX + stateId);
  return data ? JSON.parse(data) : null;
}

export function clearStateData(stateId: string): void {
  sessionStorage.removeItem(STATE_PREFIX + stateId);
}

export function getAllStateIds(): string[] {
  return Object.keys(sessionStorage)
    .filter((key) => key.startsWith(STATE_PREFIX))
    .map((key) => key.replace(STATE_PREFIX, ""));
}
