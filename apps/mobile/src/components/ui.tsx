import type { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/theme";

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: theme.space.lg,
    paddingBottom: insets.bottom + theme.space.xl,
    paddingHorizontal: theme.space.lg,
  };
  if (!scroll) {
    return <View style={[styles.screen, padding]}>{children}</View>;
  }
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={padding}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

export function Title({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Subtitle({ children }: { children: ReactNode }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

export function Label({ children }: { children: ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function Field({ label, ...input }: TextInputProps & { label: string }) {
  return (
    <View style={styles.field}>
      <Label>{label}</Label>
      <TextInput
        placeholderTextColor={theme.colors.muted}
        style={styles.input}
        {...input}
      />
    </View>
  );
}

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ title, onPress, variant = "primary", disabled, style }: ButtonProps) {
  const primary = variant === "primary";
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary ? styles.buttonPrimary : styles.buttonOutline,
        pressed && { opacity: 0.85 },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Text style={[styles.buttonText, primary ? styles.buttonTextPrimary : styles.buttonTextOutline]}>
        {title}
      </Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function ChipRow({ children }: { children: ReactNode }) {
  return <View style={styles.chipRow}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.blue },
  title: {
    fontSize: 34,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.space.lg,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.muted,
    textAlign: "center",
    marginTop: -theme.space.md,
    marginBottom: theme.space.lg,
  },
  label: { fontSize: 20, fontWeight: "500", color: theme.colors.text, marginBottom: theme.space.xs },
  field: { marginBottom: theme.space.md },
  input: {
    height: 60,
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(239,239,238,0.85)",
    paddingHorizontal: 20,
    fontSize: 18,
    color: theme.colors.text,
  },
  button: {
    height: 58,
    borderRadius: theme.radius.md,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    minWidth: 180,
  },
  buttonPrimary: { backgroundColor: theme.colors.maroon },
  buttonOutline: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "rgba(17,2,41,0.2)",
  },
  buttonText: { fontSize: 20, fontWeight: "500" },
  buttonTextPrimary: { color: theme.colors.white },
  buttonTextOutline: { color: theme.colors.text },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: theme.space.sm },
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(239,239,238,0.85)",
    justifyContent: "center",
  },
  chipSelected: { backgroundColor: theme.colors.maroon },
  chipText: { fontSize: 16, fontWeight: "500", color: theme.colors.text },
  chipTextSelected: { color: theme.colors.white },
});
