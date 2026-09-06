import Constants, { ExecutionEnvironment } from 'expo-constants';

/**
 * react-native-google-mobile-ads ships a native module that only exists in a
 * custom dev client / standalone build - it isn't bundled into the Expo Go
 * app. Loading it there throws "RNGoogleMobileAdsModule could not be found",
 * so ad init/rendering must be skipped while running inside Expo Go.
 */
export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
