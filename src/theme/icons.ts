export type IconLibrary = 'Ionicons' | 'MaterialCommunityIcons';
export type IconDefinition = {
  library: IconLibrary;
  name: string;
  activeName?: string;
};

export const icons = {
  home: { library: 'Ionicons', name: 'home-outline', activeName: 'home' },
  animals: { library: 'MaterialCommunityIcons', name: 'paw-outline', activeName: 'paw' },
  tracks: { library: 'MaterialCommunityIcons', name: 'map-marker-path' },
  identify: { library: 'Ionicons', name: 'scan-outline', activeName: 'scan' },
  settings: { library: 'Ionicons', name: 'settings-outline', activeName: 'settings' },
  camera: { library: 'Ionicons', name: 'camera-outline', activeName: 'camera' },
  search: { library: 'Ionicons', name: 'search-outline' },
  location: { library: 'MaterialCommunityIcons', name: 'map-marker-outline' },
  sync: { library: 'Ionicons', name: 'sync-outline' },
  offline: { library: 'Ionicons', name: 'cloud-offline-outline' },
  close: { library: 'Ionicons', name: 'close' },
  back: { library: 'Ionicons', name: 'chevron-back' },
  check: { library: 'Ionicons', name: 'checkmark-circle-outline' },
  clock: { library: 'Ionicons', name: 'time-outline' },
  unknown: { library: 'Ionicons', name: 'help-circle-outline' },
  upload: { library: 'Ionicons', name: 'cloud-upload-outline' },
  alert: { library: 'Ionicons', name: 'alert-circle-outline' },
  plus: { library: 'Ionicons', name: 'add' },
  image: { library: 'Ionicons', name: 'image-outline' },
  filter: { library: 'Ionicons', name: 'filter-outline' },
  language: { library: 'Ionicons', name: 'language-outline' },
  shield: { library: 'Ionicons', name: 'shield-checkmark-outline' },
  leaf: { library: 'Ionicons', name: 'leaf-outline' },
  forward: { library: 'Ionicons', name: 'chevron-forward' },
} as const satisfies Record<string, IconDefinition>;
