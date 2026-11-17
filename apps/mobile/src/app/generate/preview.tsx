import { Redirect, router } from "expo-router";
import { useRef, useState, type ComponentRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { StoryCard } from "@/components/story-card";
import { Button, Screen, Title } from "@/components/ui";
import { saveCard } from "@/lib/cards";
import { captureStoryPng, saveStoryPng, shareStoryPng, storyFileName } from "@/lib/export";
import { useAuth } from "@/store/auth";
import { useDraft } from "@/store/draft";
import { theme } from "@/theme";

const CARD_WIDTH = 280;

export default function PreviewScreen() {
  const { draft, outlineColorId, reset } = useDraft();
  const cardRef = useRef<ComponentRef<typeof View>>(null);
  const { session } = useAuth();
  const [busy, setBusy] = useState<"save" | "share" | "keep" | null>(null);
  const [kept, setKept] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (!draft) return <Redirect href="/" />;
  const fileName = storyFileName(draft.activity, draft.details.title);

  async function run(kind: "save" | "share") {
    if (busy) return;
    setBusy(kind);
    setMessage(null);
    try {
      const uri = await captureStoryPng(cardRef, fileName);
      if (kind === "save") {
        const result = await saveStoryPng(uri);
        setMessage(
          result === "saved"
            ? { text: "Saved to Photos. Add it to your Story as a sticker." }
            : { text: "Photos access was declined. You can still Share it.", error: true },
        );
      } else {
        const result = await shareStoryPng(uri);
        if (result === "unavailable") {
          setMessage({ text: "Sharing isn't available on this device.", error: true });
        }
      }
    } catch (error) {
      console.error("Export failed", error);
      setMessage({ text: "Could not export the card. Please try again.", error: true });
    } finally {
      setBusy(null);
    }
  }

  async function keepCard() {
    if (!draft || busy) return;
    if (!session) {
      router.push("/sign-in");
      return;
    }
    setBusy("keep");
    setMessage(null);
    const result = await saveCard(draft, outlineColorId);
    setBusy(null);
    if (result.ok) {
      setKept(true);
      setMessage({ text: "Saved to My cards." });
    } else {
      setMessage({ text: result.message, error: true });
    }
  }

  function newCard() {
    reset();
    router.dismissAll();
    router.replace("/");
  }

  return (
    <Screen>
      <Title>All achievements deserve to be shared…</Title>

      {/* Checkerboard-ish backdrop stays outside the captured node so the PNG is transparent. */}
      <View style={styles.preview}>
        <View ref={cardRef} collapsable={false}>
          <StoryCard draft={draft} outlineColorId={outlineColorId} width={CARD_WIDTH} />
        </View>
      </View>

      <Text style={styles.note}>Story-sized transparent PNG (1080 × 1920).</Text>
      {message ? (
        <Text style={[styles.message, message.error && styles.messageError]} accessibilityRole="alert">
          {message.text}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <Button
          title={busy === "save" ? "Saving…" : "Save to Photos"}
          onPress={() => run("save")}
          disabled={busy !== null}
        />
        <Button
          title={busy === "share" ? "Preparing…" : "Share"}
          variant="outline"
          onPress={() => run("share")}
          disabled={busy !== null}
        />
        <Button
          title={
            kept
              ? "Saved to My cards"
              : busy === "keep"
                ? "Saving…"
                : session
                  ? "Save to my cards"
                  : "Sign in to save"
          }
          variant="outline"
          onPress={keepCard}
          disabled={busy !== null || kept}
        />
        <View style={styles.row}>
          <Button title="Customize" variant="outline" onPress={() => router.back()} style={styles.small} />
          <Button title="New card" variant="outline" onPress={newCard} style={styles.small} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  preview: {
    alignSelf: "center",
    borderRadius: theme.radius.xl,
    backgroundColor: "#d7e8f8",
    overflow: "hidden",
  },
  note: { marginTop: theme.space.lg, textAlign: "center", color: theme.colors.muted, fontSize: 14 },
  message: { marginTop: theme.space.sm, textAlign: "center", color: theme.colors.text, fontSize: 14 },
  messageError: { color: "#b3261e" },
  actions: { marginTop: theme.space.lg, gap: theme.space.sm, alignItems: "center" },
  row: { flexDirection: "row", gap: theme.space.sm },
  small: { minWidth: 0, flex: 1 },
});
