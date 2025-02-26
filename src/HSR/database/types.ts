export type HSRElement =
  | 'Lightning'
  | 'Fire'
  | 'Ice'
  | 'Imaginary'
  | 'Quantum'
  | 'Wind'
  | 'Physical';

export type HSRPath =
  | 'Destruction'
  | 'The Hunt'
  | 'Erudution'
  | 'Harmony'
  | 'Nihility'
  | 'Preservation'
  | 'Abundance'
  | 'Remembrance';

export interface HSRCharacter {
  id: number;
  name: string;
  image_path: string;
  stars: 4 | 5;
  elements: HSRElement;
  path: HSRPath;
  selected: boolean;
}
