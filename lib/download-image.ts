import { toBlob } from "html-to-image";
import { STORY_EXPORT } from "@/lib/customize";

type CaptureOptions = {
  transparentBackground?: boolean;
};

function isLikelyMobile() {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function canShareFiles(file: File) {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  );
}

async function capturePngBlob(
  node: HTMLElement,
  options: CaptureOptions = {},
): Promise<Blob> {
  const pixelRatio = Math.min(
    STORY_EXPORT.width / Math.max(node.offsetWidth, 1),
    3,
  );

  const exportOptions = {
    cacheBust: true,
    pixelRatio: Math.max(pixelRatio, 2),
    backgroundColor: options.transparentBackground
      ? ("transparent" as const)
      : undefined,
  };

  // Safari often returns a blank/tiny canvas on the first pass.
  await toBlob(node, exportOptions);
  await new Promise((resolve) => setTimeout(resolve, 120));

  let blob = await toBlob(node, exportOptions);
  let attempts = 0;

  while ((!blob || blob.size < 2_000) && attempts < 4) {
    attempts += 1;
    await new Promise((resolve) => setTimeout(resolve, 200));
    blob = await toBlob(node, exportOptions);
  }

  if (!blob || blob.size < 2_000) {
    throw new Error("Export produced an empty image");
  }

  return blob;
}

/**
 * Save a PNG in a way that works on desktop and iOS/Android.
 * Prefer the system share sheet on mobile; fall back to a real file download.
 */
export async function downloadCardPng(
  node: HTMLElement,
  filename: string,
  options: CaptureOptions = {},
): Promise<"shared" | "downloaded" | "opened"> {
  const blob = await capturePngBlob(node, options);
  const file = new File([blob], filename, { type: "image/png" });

  if (isLikelyMobile() && canShareFiles(file)) {
    try {
      await navigator.share({
        files: [file],
        title: "Outlyne",
      });
      return "shared";
    } catch (error) {
      // User dismissed the sheet — treat as success (no error toast).
      if (error instanceof DOMException && error.name === "AbortError") {
        return "shared";
      }
      // Fall through to download / open fallbacks.
    }
  }

  const objectUrl = URL.createObjectURL(blob);

  try {
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();

    // iOS often ignores download= — open the image so the user can Save to Photos.
    if (isLikelyMobile()) {
      const opened = window.open(objectUrl, "_blank", "noopener,noreferrer");
      if (!opened) {
        // Popup blocked: navigate as last resort.
        window.location.href = objectUrl;
      }
      // Delay revoke so the new tab can load the blob.
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
      return "opened";
    }

    setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
    return "downloaded";
  } catch {
    URL.revokeObjectURL(objectUrl);
    throw new Error("Could not save image");
  }
}
