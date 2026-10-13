import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { env } from "@/config/env";
import { useAuthStore } from "@/store/authStore";
import { radius, spacing, useTheme } from "@/theme";
import type { UserRole } from "@/types/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const signIn = useAuthStore((state) => state.signIn);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("field");

  const handleSignIn = async () => {
    try {
      await signIn(username, password, role);
      router.replace("/");
    } catch {
      // The auth store provides the message displayed on this screen.
    }
  };

  return (
    <ScreenContainer stripes style={styles.page}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.content}
      >
        <View style={styles.languageRow}>
          <LanguageSwitcher />
        </View>
        <View style={styles.brand}>
          <View
            style={[
              styles.brandIcon,
              { backgroundColor: colors.surfaceRaised },
            ]}
          >
            <Icon name="leaf" color={colors.primary} size={30} />
          </View>

          <AppText variant="title" strong>
            JeevDrishti
          </AppText>
          <AppText variant="caption" muted>
            {t("auth.badge")}
          </AppText>
        </View>

        <View style={styles.heading}>
          <AppText variant="display" strong>
            {t("auth.title")}
          </AppText>
          <AppText muted>{t("auth.subtitle")}</AppText>
        </View>

        <View
          style={[
            styles.form,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.field}>
            <AppText strong>{t("auth.username")}</AppText>
            <TextInput
              value={username}
              onChangeText={(value) => {
                setUsername(value);
                clearError();
              }}
              placeholder={t("auth.usernamePlaceholder")}
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              returnKeyType="next"
              accessibilityLabel={t("auth.username")}
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            />
          </View>

          <View style={styles.field}>
            <AppText strong>{t("auth.password")}</AppText>
            <TextInput
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                clearError();
              }}
              placeholder={t("auth.passwordPlaceholder")}
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="current-password"
              returnKeyType="done"
              onSubmitEditing={() => void handleSignIn()}
              accessibilityLabel={t("auth.password")}
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            />
          </View>

          {env.demo && (
            <View style={styles.field}>
              <AppText strong>{t("auth.demoRole")}</AppText>
              <View style={styles.roles}>
                {(
                  [
                    ["field", t("auth.fieldRole")],
                    ["reviewer", t("auth.reviewerRole")],
                    ["admin", t("auth.adminRole")],
                  ] as const
                ).map(([value, label]) => (
                  <Pressable
                    key={value}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: role === value }}
                    onPress={() => setRole(value)}
                    style={[
                      styles.roleOption,
                      {
                        backgroundColor:
                          role === value
                            ? colors.primaryStrong
                            : colors.background,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <AppText
                      strong
                      style={{
                        color: role === value ? colors.onStrong : colors.text,
                      }}
                    >
                      {label}
                    </AppText>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {error ? (
            <AppText accessibilityRole="alert" style={{ color: colors.danger }}>
              {error}
            </AppText>
          ) : null}

          <View style={styles.submit}>
            <Button
              variant="accent"
              icon="shield"
              onPress={() => void handleSignIn()}
              disabled={isLoading}
            >
              {isLoading ? t("auth.signingIn") : t("auth.signIn")}
            </Button>
          </View>

          {env.useMock && (
            <AppText variant="caption" muted>
              Development demo login only. No backend authentication is
              connected yet.
            </AppText>
          )}
        </View>

        <AppText variant="caption" muted style={styles.footer}>
          {t("auth.footer")}
        </AppText>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.xl,
  },
  brand: {
    alignItems: "center",
    gap: spacing.xs,
  },
  brandIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  heading: {
    gap: spacing.xs,
  },
  form: {
    borderWidth: 1,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  field: {
    gap: spacing.sm,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: radius.medium,
    paddingHorizontal: spacing.md,
    fontSize: 16,
  },
  roles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  roleOption: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderRadius: radius.medium,
  },
  submit: {
    width: "100%",
  },
  footer: {
    textAlign: "center",
  },
  languageRow: {
    alignItems: "flex-end",
  },
});
