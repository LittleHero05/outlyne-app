import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { FREE_CARD_LIMIT, rowToDraft, type SavedCardRow } from "@outlyne/core";
import { CardThumb } from "@/components/card-thumb";
import { Button, Screen, Subtitle, Title } from "@/components/ui";
import { deleteCard, listCards } from "@/lib/cards";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";
import { useDraft } from "@/store/draft";
import { theme } from "@/theme";

const THUMB_WIDTH = 160;

export default function SavedCardsScreen() {
  const { session } = useAuth();
  const { setDraft, setOutlineColorId } = useDraft();
  const [cards, setCards] = useState<SavedCardRow[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    if (!session) return;
    setError("");
    listCards()
      .then(setCards)
      .catch(() => setError("Could not load your cards."));
  }, [session]);

  useFocusEffect(load);

  function open(row: SavedCardRow) {
    setDraft(rowToDraft(row));
    setOutlineColorId(row.outline_color);
    router.push({ pathname: "/generate/preview", params: { from: "saved" } });
  }

  function confirmDelete(row: SavedCardRow) {
    Alert.alert("Delete this card?", "This removes it from your saved cards.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCard(row.id);
            setCards((current) => current?.filter((card) => card.id !== row.id) ?? null);
          } catch {
            setError("Could not delete the card.");
          }
        },
      },
    ]);
  }

  if (!session) {
    return (
      <Screen>
        <Title>My cards</Title>
        <Subtitle>Sign in to save cards and see them here.</Subtitle>
        <Button title="Sign in" onPress={() => router.push("/sign-in")} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Title>My cards</Title>
      <Subtitle>
        {cards ? `${cards.length} of ${FREE_CARD_LIMIT} saved` : "Loading…"}
      </Subtitle>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {cards && cards.length === 0 ? (
        <Text style={styles.empty}>
          No saved cards yet. Make one, then tap Save to my cards on the preview.
        </Text>
      ) : null}

      <View style={styles.grid}>
        {cards?.map((row) => (
          <Pressable
            key={row.id}
            accessibilityRole="button"
            accessibilityLabel={`Open ${row.activity} card ${row.details.title || "Untitled"}`}
            accessibilityHint="Long press to delete"
            onPress={() => open(row)}
            onLongPress={() => confirmDelete(row)}
            style={({ pressed }) => [styles.thumb, pressed && { opacity: 0.85 }]}
          >
            <CardThumb
              draft={rowToDraft(row)}
              outlineColorId={row.outline_color}
              width={THUMB_WIDTH}
            />
          </Pressable>
        ))}
      </View>

      <Text style={styles.account}>Signed in as {session.user.email}</Text>
      <Button title="Sign out" variant="outline" onPress={() => supabase.auth.signOut()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: theme.space.md, justifyContent: "center" },
  thumb: { borderRadius: 20, overflow: "hidden", backgroundColor: "#d7e8f8" },
  empty: { textAlign: "center", color: theme.colors.text, marginVertical: theme.space.lg },
  error: { textAlign: "center", color: "#b3261e", marginBottom: theme.space.md },
  account: {
    textAlign: "center",
    color: theme.colors.muted,
    marginTop: theme.space.xl,
    marginBottom: theme.space.sm,
  },
});
