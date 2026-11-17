import { PixelRatio } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { Asset, requestPermissionsAsync } from "expo-media-library";
import { STORY_EXPORT } from "@outlyne/core";

/**
 * Capture a native view as a transparent Story-sized PNG (1080×1920) and
 * return a file:// URI in the app's cache directory.
 *
 * view-shot takes the target size in points, so divide the pixel target by
 * the device pixel ratio. The captured view must have no background of its
 * own; the preview's checkerboard lives outside the captured node.
 */
export async function captureStoryPng(
  view: React.RefObject<unknown>,
  fileName: string,
): Promise<string> {
  const ratio = PixelRatio.get();
  return captureRef(view as never, {
    format: "png",
    quality: 1,
    result: "tmpfile",
    fileName,
    width: STORY_EXPORT.width / ratio,
    height: STORY_EXPORT.height / ratio,
  });
}

/** Open the system share sheet (Instagram, AirDrop, Save Image, …). */
export async function shareStoryPng(uri: string): Promise<"shared" | "unavailable"> {
  if (!(await Sharing.isAvailableAsync())) return "unavailable";
  await Sharing.shareAsync(uri, {
    UTI: "public.png",
    mimeType: "image/png",
    dialogTitle: "Share your Outlyne card",
  });
  return "shared";
}

/** Save straight to the photo library with add-only permission. */
export async function saveStoryPng(uri: string): Promise<"saved" | "denied"> {
  const permission = await requestPermissionsAsync(true, ["photo"]);
  if (!permission.granted) return "denied";
  await Asset.create(uri);
  return "saved";
}

export function storyFileName(activity: string, title: string): string {
  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || activity;
  return `outlyne-${activity}-${slug}`;
}
