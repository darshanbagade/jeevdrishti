import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { spacing, useTheme } from '@/theme';

type Props = PropsWithChildren<{
  scroll?: boolean;
  stripes?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export function ScreenContainer({ children, scroll = true, stripes = false, style }: Props) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.root}>
        <LinearGradient
          colors={[colors.background, colors.surface]}
          style={StyleSheet.absoluteFill}
        />
        {stripes && (
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
            <Path
              d="M0 180 L320 0 M0 300 L520 0 M0 420 L720 0 M120 600 L920 0"
              stroke={colors.primary}
              strokeWidth={2}
              opacity={0.08}
              fill="none"
            />
          </Svg>
        )}
        {scroll ? (
          <ScrollView
            contentContainerStyle={[styles.content, style]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content, styles.fill, style]}>{children}</View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  root: { flex: 1 },
  content: { padding: spacing.md, gap: spacing.lg, flexGrow: 1 },
  fill: { flex: 1 },
});
