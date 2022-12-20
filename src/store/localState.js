import { atom } from 'recoil';

export const LocalMediaState = atom({
  key: 'LocalMediaState',
  default: '',
  dangerouslyAllowMutability: true,
});
