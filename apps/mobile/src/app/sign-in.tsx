import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { FREE_CARD_LIMIT } from "@outlyne/core";
import { Button, Field, Screen, Subtitle, Title } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { theme } from "@/theme";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Two steps: email, then the 6-digit code Supabase emails. */
export default function SignInScreen() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function sendCode() {
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    setError("");
    const { error: sendError } = await supabase.auth.signInWithOtp({ email: trimmed });
    setBusy(false);
    if (sendError) {
      setError(sendError.message);
      return;
    }
    setEmail(trimmed);
    setStep("code");
  }

  async function verifyCode() {
    setBusy(true);
    setError("");
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });
    setBusy(false);
    if (verifyError) {
      setError("That code didn't work. Check it, or send a new one.");
      return;
    }
    router.back();
  }

  return (
    <Screen>
      <Title>{step === "email" ? "Sign in" : "Check your email"}</Title>
      <Subtitle>
        {step === "email"
          ? `Save up to ${FREE_CARD_LIMIT} cards and find them on any device.`
          : `We sent a 6-digit code to ${email}.`}
      </Subtitle>

      {step === "email" ? (
        <Field
          label="Email"
          placeholder="you@example.com"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={sendCode}
        />
      ) : (
        <Field
          label="Code"
          placeholder="123456"
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          maxLength={6}
          value={code}
          onChangeText={setCode}
          onSubmitEditing={verifyCode}
        />
      )}

      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      {step === "email" ? (
        <Button title={busy ? "Sending…" : "Send code"} onPress={sendCode} disabled={busy} />
      ) : (
        <>
          <Button
            title={busy ? "Checking…" : "Sign in"}
            onPress={verifyCode}
            disabled={busy || code.trim().length < 6}
          />
          <Button
            title="Use a different email"
            variant="outline"
            onPress={() => {
              setStep("email");
              setCode("");
              setError("");
            }}
            style={{ marginTop: theme.space.sm }}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: { color: "#b3261e", textAlign: "center", marginBottom: theme.space.md },
});
