import type { ComponentProps } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { icons, type IconDefinition } from '@/theme/icons';

export type IconName = keyof typeof icons;

type Props = {
  name: IconName;
  size?: number;
  color: string;
  active?: boolean;
  accessibilityLabel?: string;
};

export function Icon({ name, size = 20, color, active = false, accessibilityLabel }: Props) {
  const definition: IconDefinition = icons[name];
  const iconName = active && definition.activeName ? definition.activeName : definition.name;

  if (definition.library === 'Ionicons') {
    return (
      <Ionicons
        name={iconName as ComponentProps<typeof Ionicons>['name']}
        size={size}
        color={color}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  return (
    <MaterialCommunityIcons
      name={iconName as ComponentProps<typeof MaterialCommunityIcons>['name']}
      size={size}
      color={color}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
