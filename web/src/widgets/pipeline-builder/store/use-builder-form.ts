import { create } from "zustand";

export type BuilderStep = {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  expanded: boolean;
  config: Record<string, string>;
};

export type SourceType = "topic" | "url" | "file" | "text";
export type TriggerType = "once" | "schedule";
export type ApprovalMode = "autopilot" | "review_before_publish" | "per_platform";

export type BuilderFormState = {
  currentStep: number;
  name: string;
  templateId: string;
  sourceType: SourceType;
  sourceInput: string;
  steps: BuilderStep[];
  brandId: string;
  styleProfileId: string;
  trigger: TriggerType;
  scheduleFrequency: string;
  scheduleTime: string;
  approvalMode: ApprovalMode;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setName: (name: string) => void;
  setTemplateId: (id: string) => void;
  setSourceType: (type: SourceType) => void;
  setSourceInput: (input: string) => void;
  setSteps: (steps: BuilderStep[]) => void;
  toggleStepExpanded: (stepId: string) => void;
  removeStep: (stepId: string) => void;
  addStep: (step: BuilderStep) => void;
  moveStepUp: (stepId: string) => void;
  moveStepDown: (stepId: string) => void;
  setBrandId: (id: string) => void;
  setStyleProfileId: (id: string) => void;
  setTrigger: (trigger: TriggerType) => void;
  setScheduleFrequency: (freq: string) => void;
  setScheduleTime: (time: string) => void;
  setApprovalMode: (mode: ApprovalMode) => void;
  reset: () => void;
};

const initialState = {
  currentStep: 0,
  name: "",
  templateId: "",
  sourceType: "topic" as SourceType,
  sourceInput: "",
  steps: [] as BuilderStep[],
  brandId: "",
  styleProfileId: "",
  trigger: "once" as TriggerType,
  scheduleFrequency: "daily",
  scheduleTime: "09:00",
  approvalMode: "review_before_publish" as ApprovalMode,
};

export const useBuilderForm = create<BuilderFormState>()((set) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

  setName: (name) => set({ name }),
  setTemplateId: (templateId) => set({ templateId }),
  setSourceType: (sourceType) => set({ sourceType }),
  setSourceInput: (sourceInput) => set({ sourceInput }),

  setSteps: (steps) => set({ steps }),
  toggleStepExpanded: (stepId) =>
    set((state) => ({
      steps: state.steps.map((s) =>
        s.id === stepId ? { ...s, expanded: !s.expanded } : s
      ),
    })),
  removeStep: (stepId) =>
    set((state) => ({
      steps: state.steps.filter((s) => s.id !== stepId),
    })),
  addStep: (step) =>
    set((state) => ({
      steps: [...state.steps, step],
    })),
  moveStepUp: (stepId) =>
    set((state) => {
      const index = state.steps.findIndex((s) => s.id === stepId);
      if (index <= 0) return state;
      const newSteps = [...state.steps];
      const prev = newSteps[index - 1];
      const curr = newSteps[index];
      if (!prev || !curr) return state;
      newSteps[index - 1] = curr;
      newSteps[index] = prev;
      return { steps: newSteps };
    }),
  moveStepDown: (stepId) =>
    set((state) => {
      const index = state.steps.findIndex((s) => s.id === stepId);
      if (index === -1 || index >= state.steps.length - 1) return state;
      const newSteps = [...state.steps];
      const curr = newSteps[index];
      const next = newSteps[index + 1];
      if (!curr || !next) return state;
      newSteps[index] = next;
      newSteps[index + 1] = curr;
      return { steps: newSteps };
    }),

  setBrandId: (brandId) => set({ brandId }),
  setStyleProfileId: (styleProfileId) => set({ styleProfileId }),
  setTrigger: (trigger) => set({ trigger }),
  setScheduleFrequency: (scheduleFrequency) => set({ scheduleFrequency }),
  setScheduleTime: (scheduleTime) => set({ scheduleTime }),
  setApprovalMode: (approvalMode) => set({ approvalMode }),

  reset: () => set(initialState),
}));
