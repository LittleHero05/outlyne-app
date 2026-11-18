import * as ImagePicker from "expo-image-picker";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Label } from "@/components/ui";
import { theme } from "@/theme";

type PhotoFieldProps = {
  uri: string | null;
  onChange: (uri: string | null) => void;
};

/** Optional background photo, picked from the library. No permission prompt needed on iOS. */
export function PhotoField({ uri, onChange }: PhotoFieldProps) {
  async function pick() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      // iPhone photos are often HEIC, which only Safari can show. "Compatible"
      // makes iOS hand back a JPEG so saved cards open in every browser.
      preferredAssetRepresentationMode:
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
    });
    if (!result.canceled) onChange(result.assets[0].uri);
  }

  return (
    <View style={styles.wrap}>
      <Label>Photo (optional)</Label>
      {uri ? (
        <View style={styles.row}>
          <Image source={{ uri }} style={styles.thumb} accessibilityIgnoresInvertColors />
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" onPress={pick} hitSlop={8}>
              <Text style={styles.link}>Change photo</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => onChange(null)} hitSlop={8}>
              <Text style={styles.remove}>Remove</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={pick}
          style={({ pressed }) => [styles.picker, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.pickerText}>Choose a photo</Text>
          <Text style={styles.hint}>It fills the card behind your stats.</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: theme.space.md },
  picker: {
    minHeight: 60,
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(239,239,238,0.85)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "center",
  },
  pickerText: { fontSize: 18, color: theme.colors.text },
  hint: { fontSize: 13, color: theme.colors.muted, marginTop: 2 },
  row: { flexDirection: "row", alignItems: "center", gap: theme.space.md },
  thumb: { width: 72, height: 128, borderRadius: 12 },
  actions: { gap: theme.space.sm },
  link: { fontSize: 16, fontWeight: "600", color: theme.colors.maroon },
  remove: { fontSize: 16, color: theme.colors.muted },
});
