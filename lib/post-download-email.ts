const STORAGE_KEY = "outlyne_post_download_email";

export type EmailCapturePromptState = "signed_up" | "dismissed";

/** Shared across download + new-card prompts so we only ask once. */
export function shouldAskForEmailCapture(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return true;
  }
}

export function markEmailCaptureDone(state: EmailCapturePromptState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, state);
  } catch {
    // Ignore private-mode / storage failures.
  }
}

/** @deprecated use shouldAskForEmailCapture */
export const shouldAskForEmailAfterDownload = shouldAskForEmailCapture;

/** @deprecated use markEmailCaptureDone */
export const markPostDownloadEmailDone = markEmailCaptureDone;
