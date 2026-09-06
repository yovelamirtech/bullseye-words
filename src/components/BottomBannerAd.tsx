import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { BannerAd as BannerAdType, BannerAdSize as BannerAdSizeType } from 'react-native-google-mobile-ads';
import { BANNER_AD_UNIT_ID } from '../ads/adUnitIds';
import { isExpoGo } from '../ads/isExpoGo';

// טעינה דינמית של react-native-google-mobile-ads: ב-Expo Go המודול הנייטיבי
// לא קיים בכלל, ואפילו ה-import הסטטי שלו יקרוס עם
// "RNGoogleMobileAdsModule could not be found".
export default function BottomBannerAd() {
  const [ads, setAds] = useState<{ BannerAd: typeof BannerAdType; BannerAdSize: typeof BannerAdSizeType } | null>(
    null
  );

  useEffect(() => {
    if (isExpoGo) return;
    import('react-native-google-mobile-ads').then(({ BannerAd, BannerAdSize }) => {
      setAds({ BannerAd, BannerAdSize });
    });
  }, []);

  if (!ads) return null;

  const { BannerAd, BannerAdSize } = ads;

  return (
    <View style={styles.container}>
      <BannerAd unitId={BANNER_AD_UNIT_ID} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FDF3E7',
  },
});
