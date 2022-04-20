import { ValueOf } from './TypeUtils';

export const Madhab = {
  Shafi: 'shafi',
  Hanafi: 'hanafi',
} as const;

export function shadowLength(madhab: ValueOf<typeof Madhab>) {
  switch (madhab) {
    case Madhab.Shafi:
      return 1;
    case Madhab.Hanafi:
      return 2;
    default:
      throw 'Invalid Madhab';
  }
}
