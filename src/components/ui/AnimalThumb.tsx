import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Icon } from './Icon';
import { radius, useTheme } from '@/theme';

export function AnimalThumb({ size = 64 }: { size?: number }) {
  const { colors } = useTheme();

  return (
    <View
      accessibilityLabel="Wildlife profile illustration placeholder"
      style={[
        styles.thumb,
        {
          width: size,
          height: size,
          borderRadius: Math.min(radius.large, size / 3),
          backgroundColor: colors.surfaceRaised,
          borderColor: colors.border,
        },
      ]}
    >
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
        <Path
          d="M0 8 L18 0 M0 28 L42 0 M0 50 L64 8 M8 64 L64 28 M32 64 L64 48"
          stroke={colors.primary}
          strokeWidth={3}
          opacity={0.34}
          fill="none"
        />
      </Svg>
      <Icon name="animals" color={colors.primary} size={Math.round(size * 0.4)} />
    </View>
  );
}

const styles = StyleSheet.create({
  thumb: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1 },
});
