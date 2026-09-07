jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadSettings, saveSettings } from '../settings';

describe('settings storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns defaults when nothing has been saved', async () => {
    expect(await loadSettings()).toEqual({
      soundEnabled: true,
      hapticEnabled: true,
    });
  });

  it('round-trips saved settings', async () => {
    await saveSettings({ soundEnabled: false, hapticEnabled: true });
    expect(await loadSettings()).toEqual({
      soundEnabled: false,
      hapticEnabled: true,
    });
  });

  it('falls back to defaults for malformed stored JSON', async () => {
    await AsyncStorage.setItem('bullseye-words:settings', 'not json');
    expect(await loadSettings()).toEqual({
      soundEnabled: true,
      hapticEnabled: true,
    });
  });

  it('falls back per-field when a stored value has the wrong type', async () => {
    await AsyncStorage.setItem(
      'bullseye-words:settings',
      JSON.stringify({ soundEnabled: 'nope', hapticEnabled: false })
    );
    expect(await loadSettings()).toEqual({
      soundEnabled: true,
      hapticEnabled: false,
    });
  });
});
