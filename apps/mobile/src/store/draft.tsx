import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_OUTLINE_COLOR_ID,
  createEmptyDraft,
  type ActivityDraft,
  type ActivityType,
  type OutlineColorId,
} from "@outlyne/core";

type DraftStore = {
  draft: ActivityDraft | null;
  outlineColorId: OutlineColorId;
  start: (activity: ActivityType) => void;
  setDraft: (draft: ActivityDraft) => void;
  setOutlineColorId: (id: OutlineColorId) => void;
  reset: () => void;
};

const DraftContext = createContext<DraftStore | null>(null);

/** Same shape as GenerateFlow on web: one in-progress card plus its outline color. */
export function DraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<ActivityDraft | null>(null);
  const [outlineColorId, setOutlineColorId] = useState<OutlineColorId>(
    DEFAULT_OUTLINE_COLOR_ID,
  );

  const value = useMemo<DraftStore>(
    () => ({
      draft,
      outlineColorId,
      start: (activity) => setDraft(createEmptyDraft(activity)),
      setDraft,
      setOutlineColorId,
      reset: () => {
        setDraft(null);
        setOutlineColorId(DEFAULT_OUTLINE_COLOR_ID);
      },
    }),
    [draft, outlineColorId],
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useDraft(): DraftStore {
  const store = useContext(DraftContext);
  if (!store) throw new Error("useDraft must be used inside DraftProvider");
  return store;
}
