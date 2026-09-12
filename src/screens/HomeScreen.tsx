import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SettingsButton } from '../components/TopBar';
import ScreenContainer, { ScreenContent } from '../components/ScreenContainer';
import { selectionFeedback } from '../utils/pressFeedback';
import { FONTS } from '../utils/fonts';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';

interface HomeScreenProps {
  onSelectStagesJourney: () => void;
  onSelectRandomStage: () => void;
  onOpenSettings: () => void;
}

interface MenuCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}

/** כרטיס אפשרות בתפריט הראשי: אייקון, כותרת+תת-כותרת, וחץ. */
function MenuCard({ icon, title, subtitle, onPress }: MenuCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        selectionFeedback();
        onPress();
      }}
    >
      <View style={styles.cardIcon}>
        <Ionicons name={icon} size={26} color={colors.accent} />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-back" size={22} color={colors.accent} />
    </Pressable>
  );
}

export default function HomeScreen({
  onSelectStagesJourney,
  onSelectRandomStage,
  onOpenSettings,
}: HomeScreenProps) {
  function showComingSoon() {
    Alert.alert('בקרוב', 'האפשרות הזו עוד לא זמינה.');
  }

  return (
    <ScreenContainer style={styles.safe}>
      <SettingsButton onPress={onOpenSettings} />
      <Text style={styles.title}>בול פגיעה</Text>
      <Text style={styles.subtitle}>איך תרצו לשחק?</Text>

      <ScreenContent style={styles.list}>
        <MenuCard
          icon="map-outline"
          title="שלבים"
          subtitle="התקדמו שלב אחרי שלב"
          onPress={onSelectStagesJourney}
        />
        <MenuCard
          icon="shuffle-outline"
          title="שלב אקראי"
          subtitle="מילה אקראית לניחוש"
          onPress={onSelectRandomStage}
        />
        <MenuCard
          icon="calendar-outline"
          title="אתגר יומי"
          subtitle="אתגר חדש בכל יום"
          onPress={showComingSoon}
        />
      </ScreenContent>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  safe: {
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
