import { Platform } from 'react-native';

// Google's official public test ad unit IDs (same values as the library's
// TestIds.BANNER) - always show real test ads that are safe to click, never
// live ads. Hardcoded here (instead of importing TestIds from
// react-native-google-mobile-ads) so this module stays free of the native
// package's top-level import, which crashes when there's no native module
// registered (e.g. Expo Go).
const TEST_BANNER_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/2934735716',
  android: 'ca-app-pub-3940256099942544/6300978111',
  default: 'ca-app-pub-3940256099942544/6300978111',
});

// Replace with the real banner IDs from your own AdMob account before
// publishing (see README instructions).
const REAL_BANNER_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-4185202215539389/8857683661',
  android: 'ca-app-pub-4185202215539389/6918644986',
  default: TEST_BANNER_AD_UNIT_ID,
});

export const BANNER_AD_UNIT_ID = __DEV__ ? TEST_BANNER_AD_UNIT_ID : REAL_BANNER_AD_UNIT_ID;
