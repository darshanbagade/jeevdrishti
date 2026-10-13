import { demoAnimals } from './demoData';
import type { AnimalRecord } from './types';

export interface AnimalDataSource {
  listAnimals(): Promise<AnimalRecord[]>;
  getAnimalById(id: string): Promise<AnimalRecord | null>;
}

const demoDataSource: AnimalDataSource = {
  async listAnimals() {
    return demoAnimals.map((animal) => ({ ...animal }));
  },

  async getAnimalById(id) {
    const animal = demoAnimals.find((item) => item.id === id);
    return animal ? { ...animal } : null;
  },
};

let activeDataSource: AnimalDataSource = demoDataSource;

/**
 * Replace the demo source with an API-backed source during backend integration.
 * The screen components do not need to change when the source is replaced.
 */
export function configureAnimalDataSource(source: AnimalDataSource): void {
  activeDataSource = source;
}

export const animalRepository = {
  listAnimals: (): Promise<AnimalRecord[]> =>
    activeDataSource.listAnimals(),

  getAnimalById: (id: string): Promise<AnimalRecord | null> =>
    activeDataSource.getAnimalById(id),
};