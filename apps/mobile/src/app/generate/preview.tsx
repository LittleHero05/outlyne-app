import { Redirect, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { StoryCard } from "@/components/story-card";
import { Button, Screen, Title } from "@/components/ui";
import { useDraft } from "@/store/draft";
import { theme } from "@/theme";

const CARD_WIDTH = 280;

export default function PreviewScreen() {
  const { draft, outlineColorId, reset } = useDraft();
  if (!draft) return <Redirect href="/" />;

  function newCard() {
    reset();
    router.dismissAll();
    router.replace("/");
  }

  return (
    <Screen>
      <Title>All achievements deserve to be shared…</Title>
      <View style={styles.preview}>
        <StoryCard draft={draft} outlineColorId={outlineColorId} width={CARD_WIDTH} />
      </View>
      <Text style={styles.note}>
        Story-sized PNG export and the share sheet land in the next step.
      </Text>
      <View style={styles.actions}>
        <Button title="Customize" variant="outline" onPress={() => router.back()} />
        <Button title="Save / Share" onPress={() => {}} disabled />
        <Button title="New card" variant="outline" onPress={newCard} />
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
  actions: { marginTop: theme.space.lg, gap: theme.space.sm, alignItems: "center" },
});
