export type AnimalRecord = {
  id: string;
  displayName?: string;
  species: 'Tiger' | 'Leopard';
  status: 'active' | 'archived';
  zone: 'core' | 'buffer';
  firstSeen: string;
  lastSeenDaysAgo: number;
  sightings: number;
  source: 'camera' | 'field';
  cameraCode?: string;
  sex?: 'female' | 'male';
  ageClass?: 'adult' | 'subadult';
  notes?: string;
};