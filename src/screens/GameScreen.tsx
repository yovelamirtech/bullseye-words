import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { scoreGuess, isWinningGuess, type GuessResult } from '../logic/game';
import { isValidWord, getStageTarget } from '../data/words';
import GuessRow from '../components/GuessRow';
import LetterBoxInput from '../components/LetterBoxInput';
import ReportModal from '../components/ReportModal';
import { submitToWeb3Forms } from '../utils/web3forms';
import { errorHaptic, selectionHaptic, successHaptic, tapHaptic } from '../utils/haptics';
import { FONTS } from '../utils/fonts';
import { colors } from '../theme/colors';
import { radii } from '../theme/radii';
import { maxContentWidth } from '../theme/layout';
import { BackButton, SettingsButton } from '../components/TopBar';
import {
  playClickSound,
  playCorrectSound,
  playGuessSound,
  playIncorrectSound,
  playLetterClickSound,
} from '../utils/sound';

interface GuessEntry {
  guess: string;
  result: GuessResult;
}

interface GameScreenProps {
  wordLength: number;
  stageIndex: number;
  totalStages: number;
  isRandomMode?: boolean;
  randomTarget?: { word: string; clue: string } | null;
  onNewRandomStage?: () => void;
  onCompleteStage: () => void;
  onBackToStages: () => void;
  onOpenSettings: () => void;
}

export default function GameScreen({
  wordLength,
  stageIndex,
  totalStages,
  isRandomMode = false,
  randomTarget = null,
  onNewRandomStage,
  onCompleteStage,
  onBackToStages,
  onOpenSettings,
}: GameScreenProps) {
  // App.tsx מרנדר מחדש GameScreen עם key שונה בכל שלב חדש, כך שה-state
  // הבא מאותחל ישירות מה-props ואין הבזק של הסיבוב הקודם.
  const round = isRandomMode ? randomTarget : getStageTarget(wordLength, stageIndex);
  const [target] = useState(round?.word ?? '');
  const [clue] = useState(round?.clue ?? '');
  const [clueVisible, setClueVisible] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<GuessEntry[]>([]);
  const [won, setWon] = useState(false);
  const [error, setError] = useState('');
  // דיווח על מילה שגויה: המילה שנדחתה נטענת מראש לטופס
  const [reportVisible, setReportVisible] = useState(false);
  const [reportedWord, setReportedWord] = useState('');
  const inputRef = useRef<TextInput>(null);

  function openReport(word: string) {
    tapHaptic();
    setReportedWord(word);
    setReportVisible(true);
  }

  function confirmNewRandomStage() {
    tapHaptic();
    playClickSound();
    Alert.alert(
      'שלב חדש',
      'לעבור לשלב אקראי חדש? ההתקדמות בשלב הנוכחי לא תישמר.',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'קדימה',
          onPress: () => {
            selectionHaptic();
            playClickSound();
            onNewRandomStage?.();
          },
        },
      ]
    );
  }

  const canSubmit = useMemo(
    () => input.length === wordLength && !won && target.length > 0,
    [input, wordLength, won, target]
  );

  function handleSubmit() {
    if (!canSubmit) return;
    if (!isValidWord(input)) {
      errorHaptic();
      playIncorrectSound();
      setError('זו לא מילה תקנית בעברית');
      inputRef.current?.focus();
      return;
    }
    setError('');
    const result = scoreGuess(input, target);
    setHistory((prev) => [{ guess: input, result }, ...prev]);
    setInput('');
    if (isWinningGuess(input, target)) {
      successHaptic();
      playCorrectSound();
      setWon(true);
    } else {
      tapHaptic();
      playGuessSound();
    }
  }

  const [sortByScore, setSortByScore] = useState(false);

  const sortedHistory = useMemo(() => {
    if (!sortByScore) return history;
    return [...history].sort(
      (a, b) =>
        b.result.bulls - a.result.bulls || b.result.hits - a.result.hits
    );
  }, [history, sortByScore]);

  return (
    <SafeAreaView style={styles.safe}>
      <SettingsButton onPress={onOpenSettings} />
      <BackButton onPress={onBackToStages} />
      <Pressable
        style={styles.reportButton}
        onPress={() => openReport('')}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel="דיווח על מילה שגויה"
      >
        <Ionicons name="flag-outline" size={18} color={colors.accent} />
      </Pressable>
      <View style={styles.flex}>
        <Text style={styles.title}>בול פגיעה</Text>
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            {isRandomMode
              ? `שלב אקראי · ${wordLength} אותיות`
              : `שלב ${stageIndex + 1} מתוך ${totalStages} · ${wordLength} אותיות`}
          </Text>
          {isRandomMode && (
            <Pressable style={styles.newRandomButton} onPress={confirmNewRandomStage}>
              <Ionicons name="shuffle-outline" size={15} color={colors.accent} />
              <Text style={styles.newRandomButtonText}>שלב חדש</Text>
            </Pressable>
          )}
        </View>
        {clue.length > 0 &&
          (clueVisible ? (
            <Text style={styles.clue}>רמז: {clue}</Text>
          ) : (
            <Pressable
              style={styles.hintButton}
              onPress={() => {
                tapHaptic();
                playClickSound();
                setClueVisible(true);
              }}
            >
              <Text style={styles.hintButtonText}>הצג רמז</Text>
            </Pressable>
          ))}

        {won ? (
          <View style={styles.winBox}>
            <Text style={styles.winText}>כל הכבוד! פגעת במילה: {target}</Text>
            <Pressable
              style={styles.button}
              onPress={() => {
                tapHaptic();
                playClickSound();
                onCompleteStage();
              }}
            >
              <Text style={styles.buttonText}>
                {isRandomMode
                  ? 'חזרה לתפריט'
                  : stageIndex + 1 < totalStages
                    ? 'לשלב הבא'
                    : 'חזרה למסלול'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.inputArea}>
            <LetterBoxInput
              ref={inputRef}
              value={input}
              wordLength={wordLength}
              onChangeText={(text) => {
                if (text.length > input.length) {
                  selectionHaptic();
                  playLetterClickSound();
                }
                if (error && text.length > input.length) {
                  const typed = text.slice(input.length);
                  setInput(typed.slice(0, wordLength));
                } else {
                  setInput(text.slice(0, wordLength));
                }
                setError('');
              }}
              onSubmit={handleSubmit}
            />
            <Pressable
              style={[styles.button, !canSubmit && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              <Text style={styles.buttonText}>הגש</Text>
            </Pressable>
          </View>
        )}

        {error.length > 0 && (
          <View style={styles.errorBox}>
            <Text style={styles.error}>{error}</Text>
            <Pressable onPress={() => openReport(input)}>
              <Text style={styles.errorReportLink}>בטוחים שהמילה תקנית? דווחו לנו</Text>
            </Pressable>
          </View>
        )}

        {history.length > 0 && (
          <Pressable
            style={styles.sortButton}
            onPress={() => {
              tapHaptic();
              setSortByScore((prev) => !prev);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={sortByScore ? 'trophy-outline' : 'time-outline'}
              size={14}
              color={colors.accent}
            />
            <Text style={styles.sortButtonText}>
              {sortByScore ? 'מיון: הכי הרבה בול' : 'מיון: אחרון'}
            </Text>
          </Pressable>
        )}

        <FlatList
          style={styles.flex}
          data={sortedHistory}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item }) => (
            <GuessRow guess={item.guess} result={item.result} />
          )}
          ListEmptyComponent={
            <Text style={styles.hint}>הניחושים שלך יופיעו כאן</Text>
          }
        />
      </View>

      <ReportModal
        visible={reportVisible}
        title="דיווח על מילה שגויה"
        intro="ניסיתם מילה שאתם בטוחים שהיא תקנית, אבל המשחק לא זיהה אותה? ספרו לנו ונבדוק."
        fields={[
          {
            key: 'word',
            label: 'מה המילה?',
            placeholder: 'לדוגמה: שולחן',
            required: true,
            initialValue: reportedWord,
          },
          {
            key: 'meaning',
            label: 'מה הפירוש שלה?',
            placeholder: 'הסבר קצר על משמעות המילה',
            multiline: true,
          },
        ]}
        onClose={() => setReportVisible(false)}
        onSubmit={(values) =>
          submitToWeb3Forms(`דיווח על מילה שגויה: ${values.word}`, 'בול-מילה - מילה', {
            המילה: values.word,
            הפירוש: values.meaning.trim() || 'לא צורף פירוש',
            'אורך המילה': String(wordLength),
            שלב: String(stageIndex + 1),
          })
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
  },
  reportButton: {
    position: 'absolute',
    top: 58,
    left: 68,
    width: 40,
    height: 40,
    borderRadius: radii.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
    marginTop: 24,
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    textAlign: 'center',
    color: colors.textMuted,
  },
  newRandomButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  newRandomButtonText: {
    fontFamily: FONTS.medium,
    color: colors.accent,
    fontSize: 13,
  },
  clue: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  hintButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.lg,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 8,
  },
  hintButtonText: {
    fontFamily: FONTS.medium,
    color: colors.accent,
    fontSize: 14,
  },
  inputArea: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: 24,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.cardDisabled,
  },
  buttonText: {
    fontFamily: FONTS.bold,
    color: colors.textOnAccent,
    fontSize: 16,
  },
  winBox: {
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  winText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: colors.success,
    marginBottom: 8,
    textAlign: 'center',
  },
  hint: {
    fontFamily: FONTS.regular,
    textAlign: 'center',
    color: colors.textFaint,
    marginTop: 24,
  },
  errorBox: {
    alignItems: 'center',
    marginBottom: 8,
  },
  error: {
    fontFamily: FONTS.regular,
    textAlign: 'center',
    color: colors.error,
  },
  errorReportLink: {
    fontFamily: FONTS.regular,
    marginTop: 4,
    fontSize: 13,
    color: colors.accent,
    textDecorationLine: 'underline',
  },
  sortButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radii.lg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  sortButtonText: {
    fontFamily: FONTS.medium,
    color: colors.accent,
    fontSize: 12,
  },
});
