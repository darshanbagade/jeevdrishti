import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { PropsWithChildren } from 'react';
import { radius, spacing, useTheme } from '@/theme';

type Props = PropsWithChildren<{
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  accessibilityLabel?: string;
}>;

export function Card({ children, onPress, style, padding = spacing.md, accessibilityLabel }: Props) {
  const { colors } = useTheme();
  const cardStyle = [
    styles.card,
    { backgroundColor: colors.surface, borderColor: colors.border, padding },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && { opacity: 0.85 }]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.large,
    gap: spacing.sm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
});
