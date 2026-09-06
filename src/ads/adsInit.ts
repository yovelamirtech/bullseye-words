import { Platform } from 'react-native';
import { getTrackingPermissionsAsync, requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { isExpoGo } from './isExpoGo';

/**
 * מריץ פעם אחת בעליית האפליקציה, לפני שמוצגת הפרסומת הראשונה:
 * 1. איסוף הסכמת GDPR - גוגל דורשת את זה מכל מפרסם, גם כזה שלא ממוקם
 *    באירופה, אם יש סיכוי שמשתמשים מהאיחוד האירופי/בריטניה/שווייץ ישחקו.
 * 2. בקשת הרשאת מעקב (ATT) באייפון - נדרשת ע"י אפל כדי לגשת למזהה
 *    הפרסום של המכשיר. בלעדיה גוגל פשוט תציג פרסומות לא-מותאמות אישית.
 * כל שלב עטוף ב-try/catch כדי שכשל ברשת או בהרשאות לא יקרוס את האפליקציה -
 * במקרה הגרוע ביותר הפרסומות פשוט יוצגו במצב לא-מותאם אישית.
 */
export async function initializeAds(): Promise<void> {
  // ב-Expo Go אין את המודול הנייטיבי של react-native-google-mobile-ads בכלל
  // (הוא קיים רק ב-dev client מותאם אישית / build עצמאי) - אפילו ה-import
  // שלו יקרוס עם "RNGoogleMobileAdsModule could not be found".
  if (isExpoGo) return;

  const { AdsConsent, AdsConsentStatus, MobileAds } = await import('react-native-google-mobile-ads');

  try {
    const consentInfo = await AdsConsent.requestInfoUpdate();
    if (consentInfo.isConsentFormAvailable && consentInfo.status === AdsConsentStatus.REQUIRED) {
      await AdsConsent.showForm();
    }
  } catch {
    // ממשיכים בלי הסכמה מפורשת - עדיף להציג פרסומות לא-מותאמות מאשר לתקוע את האפליקציה
  }

  if (Platform.OS === 'ios') {
    try {
      const { status } = await getTrackingPermissionsAsync();
      if (status === 'undetermined') {
        await requestTrackingPermissionsAsync();
      }
    } catch {
      // אין תמיכה או שהבקשה נכשלה - ממשיכים בלי הרשאת מעקב
    }
  }

  await MobileAds().initialize();
}
