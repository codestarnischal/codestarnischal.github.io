"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSensoryFeedback } from "@/hooks/useSensoryFeedback";
import { usePredictivePrefetch } from "@/hooks/usePredictivePrefetch";

const SensoryContext = createContext<{ triggerInteraction: () => void }>({
  triggerInteraction: () => {},
});

export function useSensory() {
  return useContext(SensoryContext);
}

export function SensoryProvider({ children }: { children: ReactNode }) {
  const { triggerInteraction } = useSensoryFeedback();
  usePredictivePrefetch();

  return (
    <SensoryContext.Provider value={{ triggerInteraction }}>
      {children}
    </SensoryContext.Provider>
  );
}
