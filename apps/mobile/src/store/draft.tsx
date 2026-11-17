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
  /**
   * Storage path of the photo when this draft was reopened from My cards.
   * Lets a re-save copy the stored photo instead of re-uploading it.
   */
  savedPhotoPath: string | null;
  setSavedPhotoPath: (path: string | null) => void;
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
  const [savedPhotoPath, setSavedPhotoPath] = useState<string | null>(null);

  const value = useMemo<DraftStore>(
    () => ({
      draft,
      outlineColorId,
      savedPhotoPath,
      setSavedPhotoPath,
      start: (activity) => {
        setSavedPhotoPath(null);
        setDraft(createEmptyDraft(activity));
      },
      setDraft,
      setOutlineColorId,
      reset: () => {
        setSavedPhotoPath(null);
        setDraft(null);
        setOutlineColorId(DEFAULT_OUTLINE_COLOR_ID);
      },
    }),
    [draft, outlineColorId, savedPhotoPath],
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useDraft(): DraftStore {
  const store = useContext(DraftContext);
  if (!store) throw new Error("useDraft must be used inside DraftProvider");
  return store;
}
