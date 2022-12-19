import { atom } from 'recoil';

const sessionStorageEffect = (key) => {
  return ({ setSelf, onSet }) => {
    const savedValue = sessionStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
          ? sessionStorage.removeItem(key)
          : sessionStorage.setItem(key, JSON.stringify(newValue));
    });
  };
};

export const RoomIdState = atom({
  key: 'RoomIdState',
  default: '',
  effects: [sessionStorageEffect('RoomNameState')],
});

export const RoomState = atom({
  key: 'RoomState',
  default: null,
  dangerouslyAllowMutability: true,
});