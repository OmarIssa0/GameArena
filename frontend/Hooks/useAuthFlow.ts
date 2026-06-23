import { authFlow } from "@/lib/authflow";
import { useState } from "react";

export function useAuthFlow() {
  const [flow, setFlowState] = useState(authFlow.get());

  const setFlow = (data: any) => {
    authFlow.set(data);
    setFlowState(authFlow.get());
  };

  const clear = () => {
    authFlow.clear();
    setFlowState({});
  };

  return {
    flow,
    setFlow,
    clear,
  };
}
