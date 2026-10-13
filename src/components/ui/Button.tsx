import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { PropsWithChildren } from 'react';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { radius, spacing, useTheme } from '@/theme';

type Props = PropsWithChildren<{
  onPress?: () => void;
  variant?: 'primary' | 'accent' | 'ghost' | 'danger';
  disabled?: boolean;
  icon?: IconName;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}>;

export function Button({ children, onPress, variant = 'primary', disabled = false, icon, accessibilityLabel, style }: Props) {
  const { colors } = useTheme();
  const background = variant === 'primary' ? colors.primaryStrong
    : variant === 'accent' ? colors.accent
      : variant === 'danger' ? colors.dangerStrong : 'transparent';
  const foreground = variant === 'accent' ? colors.accentText
    : variant === 'ghost' ? colors.text : colors.onStrong;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        style,
        {
          backgroundColor: background,
          borderColor: variant === 'ghost' ? colors.border : background,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.content}>
        {icon ? <Icon name={icon} size={18} color={foreground} /> : null}
        <AppText numberOfLines={1} strong style={{ color: foreground }}>{children}</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.medium,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
