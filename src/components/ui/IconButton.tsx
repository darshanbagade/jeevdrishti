import { Pressable, StyleSheet } from 'react-native';
import { Icon, type IconName } from './Icon';
import { radius, useTheme } from '@/theme';

export function IconButton({
  name,
  label,
  onPress,
  size = 48,
}: {
  name: IconName;
  label: string;
  onPress?: () => void;
  size?: number;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <Icon name={name} color={colors.text} size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
