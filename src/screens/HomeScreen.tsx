import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SettingsButton } from '../components/TopBar';
import { selectionHaptic } from '../utils/haptics';
import { playClickSound } from '../utils/sound';
import { FONTS } from '../utils/fonts';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';

interface HomeScreenProps {
  onSelectStagesJourney: () => void;
  onOpenSettings: () => void;
}

export default function HomeScreen({
  onSelectStagesJourney,
  onOpenSettings,
}: HomeScreenProps) {
  function showComingSoon() {
    selectionHaptic();
    playClickSound();
    Alert.alert('בקרוב', 'האפשרות הזו עוד לא זמינה.');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <SettingsButton onPress={onOpenSettings} />
      <Text style={styles.title}>בול פגיעה</Text>
      <Text style={styles.subtitle}>איך תרצו לשחק?</Text>

      <View style={styles.list}>
        <Pressable
          style={styles.card}
          onPress={() => {
            selectionHaptic();
            playClickSound();
            onSelectStagesJourney();
          }}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="map-outline" size={26} color={colors.accent} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>שלבים</Text>
            <Text style={styles.cardSubtitle}>התקדמו שלב אחרי שלב</Text>
          </View>
          <Ionicons name="chevron-back" size={22} color={colors.accent} />
        </Pressable>

        <Pressable style={styles.card} onPress={showComingSoon}>
          <View style={styles.cardIcon}>
            <Ionicons name="shuffle-outline" size={26} color={colors.accent} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>שלב אקראי</Text>
            <Text style={styles.cardSubtitle}>מילה אקראית לניחוש</Text>
          </View>
          <Ionicons name="chevron-back" size={22} color={colors.accent} />
        </Pressable>

        <Pressable style={styles.card} onPress={showComingSoon}>
          <View style={styles.cardIcon}>
            <Ionicons name="calendar-outline" size={26} color={colors.accent} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>אתגר יומי</Text>
            <Text style={styles.cardSubtitle}>אתגר חדש בכל יום</Text>
          </View>
          <Ionicons name="chevron-back" size={22} color={colors.accent} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 64,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: 18,
    color: colors.textMuted,
    marginTop: 8,
    marginBottom: 28,
    textAlign: 'center',
  },
  list: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 14,
  },
  card: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    width: '100%',
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 14,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: colors.text,
    textAlign: 'right',
  },
  cardSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: 2,
  },
});
