import { atom } from 'recoil';

export const HostState = atom({
  key: 'HostState',
  default: false,
  dangerouslyAllowMutability: true,
});