import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Settings } from '../state/settings';
import ReportModal from '../components/ReportModal';
import Dialog from '../components/Dialog';
import { tapHaptic, toggleHaptic } from '../utils/haptics';
import { playClickSound } from '../utils/sound';
import { tapFeedback } from '../utils/pressFeedback';
import { submitToWeb3Forms } from '../utils/web3forms';
import { FONTS } from '../utils/fonts';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';

// עמוד מדיניות הפרטיות מתארח כקובץ README מוצג ב-GitHub, כדי שלא יהיה
// צורך באחסון ותחזוקה של דף אינטרנט נפרד. אפל דורשת קישור נגיש מתוך
// האפליקציה עצמה (לא רק במטא-דאטה של החנות) לאפליקציות שמציגות פרסומות.
const PRIVACY_POLICY_URL = 'https://github.com/yovelamirtech/bullseye-words/blob/main/PRIVACY.md';

interface SettingsScreenProps {
  settings: Settings;
  onBack: () => void;
  onToggleSound: (value: boolean) => void;
  onToggleHaptic: (value: boolean) => void;
}

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

/** כותרת מקטע + כרטיס עוטף, חוזר על עצמו לכל מקטע הגדרות (סאונד, משוב, עזרה, מידע). */
function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </>
  );
}

const TOGGLE_TRAVEL = 20;

// מתג מותאם אישית במקום ה-Switch המובנה: על אנדרואיד ה-Switch המובנה
// מתעלם לפעמים מ-trackColor ומציג את צבע ה-accent הירוק של המערכת.
function Toggle({ value, onValueChange }: ToggleProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const trackBackground = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.accent],
  });
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TOGGLE_TRAVEL],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
    >
      <Animated.View style={[styles.toggleTrack, { backgroundColor: trackBackground }]}>
        <Animated.View style={[styles.toggleThumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen({
  settings,
  onBack,
  onToggleSound,
  onToggleHaptic,
}: SettingsScreenProps) {
  const [bugReportVisible, setBugReportVisible] = useState(false);

  // בניגוד למתג הרטט: כשמכבים את הצליל אסור להשמיע כלום (גם לא לפני
  // העדכון), רק כשמדליקים משמיעים צליל בתור משוב.
  function handleToggleSound(value: boolean) {
    tapHaptic();
    onToggleSound(value);
    if (value) playClickSound();
  }

  // המשוב עצמו הוא התצוגה המקדימה של המתג: בכיבוי מרטטים לפני העדכון (בזמן
  // שהרטט עוד פעיל), ובהפעלה אחריו — כדי שהמשתמש ירגיש מיד מה בחר.
  function handleToggleHaptic(value: boolean) {
    if (!value) toggleHaptic(false);
    onToggleHaptic(value);
    if (value) toggleHaptic(true);
  }

  function handleOpenPrivacyPolicy() {
    tapFeedback();
    Linking.openURL(PRIVACY_POLICY_URL);
  }

  function handleDismiss() {
    tapHaptic();
    playClickSound();
    onBack();
  }

  return (
    <>
      <Dialog onDismiss={handleDismiss} cardStyle={styles.dialog}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              tapFeedback();
              onBack();
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={18} color={colors.textMuted} />
          </Pressable>
          <Text style={styles.title}>הגדרות</Text>
        </View>

        <SettingsSection title="סאונד">
          <View style={styles.row}>
            <Text style={styles.rowLabel}>אפקטים קוליים</Text>
            <Toggle value={settings.soundEnabled} onValueChange={handleToggleSound} />
          </View>
        </SettingsSection>

        <SettingsSection title="משוב">
          <View style={styles.row}>
            <Text style={styles.rowLabel}>רטט (משוב הפטי)</Text>
            <Toggle
              value={settings.hapticEnabled}
              onValueChange={(value) => {
                playClickSound();
                handleToggleHaptic(value);
              }}
            />
          </View>
        </SettingsSection>

        <SettingsSection title="עזרה">
          <Pressable
            style={styles.row}
            onPress={() => {
              tapFeedback();
              setBugReportVisible(true);
            }}
          >
            <Text style={styles.rowLabel}>דיווח על באג</Text>
            <Ionicons name="chevron-back" size={18} color={colors.textFaint} />
          </Pressable>
        </SettingsSection>

        <SettingsSection title="מידע">
          <Pressable style={styles.row} onPress={handleOpenPrivacyPolicy}>
            <Text style={styles.rowLabel}>מדיניות פרטיות</Text>
            <Ionicons name="chevron-back" size={18} color={colors.textFaint} />
          </Pressable>
        </SettingsSection>
      </Dialog>

      <ReportModal
        visible={bugReportVisible}
        title="דיווח על באג"
        intro="נתקלתם במשהו שלא עובד כמו שצריך? ספרו לנו ונתקן."
        fields={[
          {
            key: 'title',
            label: 'כותרת',
            placeholder: 'תיאור קצר של הבעיה',
            required: true,
          },
          {
            key: 'description',
            label: 'מה קרה?',
            placeholder: 'ספרו לנו מה קרה, ואיך אפשר לשחזר את הבעיה',
            multiline: true,
          },
        ]}
        onClose={() => setBugReportVisible(false)}
        onSubmit={(values) =>
          submitToWeb3Forms(`דיווח על באג: ${values.title}`, 'בול-מילה - באג', {
            כותרת: values.title,
            'מה קרה': values.description.trim() || 'לא צורף תיאור',
          })
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  dialog: {
    paddingVertical: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: colors.text,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowLabel: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: colors.text,
  },
  toggleTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.textOnAccent,
  },
});
