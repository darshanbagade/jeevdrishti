import { Text, type TextProps } from 'react-native';
import { useTranslation } from 'react-i18next';
import { typography, useTheme } from '@/theme';

type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'caption';

export function AppText({
  variant = 'body',
  muted = false,
  strong = false,
  style,
  ...props
}: TextProps & { variant?: Variant; muted?: boolean; strong?: boolean }) {
  const { colors } = useTheme();
  const { i18n } = useTranslation();
  const devanagari = ['hi', 'mr'].includes(i18n.resolvedLanguage ?? i18n.language);

  const sizes = {
    display: typography.size.display,
    title: typography.size.title,
    subtitle: typography.size.subtitle,
    body: typography.size.body,
    caption: typography.size.caption,
  };
  const lines = {
    display: typography.lineHeight.display,
    title: typography.lineHeight.title,
    subtitle: typography.lineHeight.subtitle,
    body: typography.lineHeight.body,
    caption: typography.lineHeight.caption,
  };

  const fontFamily = devanagari
    ? strong ? typography.family.devanagariBold : typography.family.devanagari
    : variant === 'display' || variant === 'title'
      ? typography.family.heading
      : strong ? typography.family.bodySemiBold : typography.family.body;

  return (
    <Text
      {...props}
      style={[
        {
          color: muted ? colors.textMuted : colors.text,
          fontFamily,
          fontSize: sizes[variant],
          lineHeight: lines[variant],
        },
        style,
      ]}
    />
  );
}
