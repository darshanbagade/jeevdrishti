import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { radius, spacing, useTheme } from '@/theme';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { colors } = useTheme();

  const currentLanguage = (
    i18n.resolvedLanguage ?? i18n.language
  ).split('-')[0];

  return (
    <View
      accessibilityLabel="Choose app language"
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {languages.map((language) => {
        const selected = currentLanguage === language.code;

        return (
          <Pressable
            key={language.code}
            accessibilityRole="button"
            accessibilityLabel={language.label}
            accessibilityState={{ selected }}
            onPress={() => {
              void i18n.changeLanguage(language.code);
            }}
            style={[
              styles.option,
              selected && {
                backgroundColor: colors.primaryStrong,
              },
            ]}
          >
            <AppText
              strong
              style={{
                color: selected ? colors.onStrong : colors.textMuted,
              }}
            >
              {language.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 4,
    borderWidth: 1,
    borderRadius: radius.pill,
    gap: 4,
  },
  option: {
    minHeight: 40,
    minWidth: 44,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
});