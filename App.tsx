import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import HomeScreen from './src/screens/HomeScreen';
import GameTypesScreen from './src/screens/GameTypesScreen';
import StagesScreen from './src/screens/StagesScreen';
import GameScreen from './src/screens/GameScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AnimatedModal from './src/components/AnimatedModal';
import BottomBannerAd from './src/components/BottomBannerAd';
import { initializeAds } from './src/ads/adsInit';
import { loadProgress, saveProgress, type Progress } from './src/state/progress';
import { drawNextRandomLength } from './src/state/randomBag';
import { getStageCount, getRandomTarget } from './src/data/words';
import { loadSettings, saveSettings, type Settings } from './src/state/settings';
import { setHapticEnabled } from './src/utils/haptics';
import { setSoundEnabled } from './src/utils/sound';
import { useAppFonts } from './src/utils/fonts';

SplashScreen.preventAutoHideAsync().catch(() => {});

type Screen = 'home' | 'types' | 'stages' | 'game' | 'random';

interface RandomChallenge {
  wordLength: number;
  word: string;
  clue: string;
}

export default function App() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [wordLength, setWordLength] = useState<number | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [randomChallenge, setRandomChallenge] = useState<RandomChallenge | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [screenStack, setScreenStack] = useState<Screen[]>(['home']);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const fontsReady = useAppFonts();
  const screen = screenStack[screenStack.length - 1];

  function navigateTo(next: Screen) {
    setScreenStack((prev) => [...prev, next]);
  }

  function navigateBack() {
    setScreenStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }

  useEffect(() => {
    initializeAds();
  }, []);

  useEffect(() => {
    if (!fontsReady) return;
    Promise.all([loadProgress(), loadSettings()]).then(([loadedProgress, loadedSettings]) => {
      setProgress(loadedProgress);
      setWordLength(loadedProgress.wordLength);
      setHapticEnabled(loadedSettings.hapticEnabled);
      setSoundEnabled(loadedSettings.soundEnabled);
      setSettings(loadedSettings);
      SplashScreen.hideAsync();
    });
  }, [fontsReady]);

  function handleSelectGameType(length: number) {
    setWordLength(length);
    navigateTo('stages');
    if (progress) {
      const next = { ...progress, wordLength: length };
      setProgress(next);
      saveProgress(next);
    }
  }

  function handleSelectStage(index: number) {
    setStageIndex(index);
    navigateTo('game');
  }

  async function refreshRandomChallenge() {
    const length = await drawNextRandomLength();
    const target = getRandomTarget(length);
    setRandomChallenge({ wordLength: length, word: target?.word ?? '', clue: target?.clue ?? '' });
  }

  async function handleSelectRandomStage() {
    await refreshRandomChallenge();
    navigateTo('random');
  }

  function handleCompleteStage() {
    if (progress === null || wordLength === null) return;
    const completed = progress.completedStages[wordLength] ?? 0;
    if (stageIndex === completed) {
      const next: Progress = {
        ...progress,
        completedStages: {
          ...progress.completedStages,
          [wordLength]: completed + 1,
        },
      };
      setProgress(next);
      saveProgress(next);
    }
    navigateBack();
  }

  function updateSettings(next: Settings) {
    setSettings(next);
    setHapticEnabled(next.hapticEnabled);
    setSoundEnabled(next.soundEnabled);
    saveSettings(next);
  }

  if (!fontsReady || wordLength === null || settings === null || progress === null) {
    return null;
  }

  const completedForLength = Math.min(
    progress.completedStages[wordLength] ?? 0,
    getStageCount(wordLength)
  );

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'height' : undefined}
      >
        <View style={styles.content}>
          {screen === 'home' && (
            <HomeScreen
              onSelectStagesJourney={() => navigateTo('types')}
              onSelectRandomStage={handleSelectRandomStage}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          )}
          {screen === 'types' && (
            <GameTypesScreen
              completedStages={progress.completedStages}
              onSelect={handleSelectGameType}
              onOpenSettings={() => setSettingsOpen(true)}
              onBack={navigateBack}
            />
          )}
          {screen === 'stages' && (
            <StagesScreen
              wordLength={wordLength}
              completedCount={completedForLength}
              onSelectStage={handleSelectStage}
              onBack={navigateBack}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          )}
          {screen === 'game' && (
            <GameScreen
              wordLength={wordLength}
              stageIndex={stageIndex}
              totalStages={getStageCount(wordLength)}
              onCompleteStage={handleCompleteStage}
              onBackToStages={navigateBack}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          )}
          {screen === 'random' && randomChallenge && (
            <GameScreen
              wordLength={randomChallenge.wordLength}
              stageIndex={0}
              totalStages={1}
              isRandomMode
              randomTarget={{ word: randomChallenge.word, clue: randomChallenge.clue }}
              onNewRandomStage={refreshRandomChallenge}
              onCompleteStage={navigateBack}
              onBackToStages={navigateBack}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          )}

          <AnimatedModal visible={settingsOpen} onRequestClose={() => setSettingsOpen(false)}>
            <SettingsScreen
              settings={settings}
              onBack={() => setSettingsOpen(false)}
              onToggleSound={(value) => updateSettings({ ...settings, soundEnabled: value })}
              onToggleHaptic={(value) => updateSettings({ ...settings, hapticEnabled: value })}
            />
          </AnimatedModal>

          <StatusBar style="auto" />
        </View>

        <BottomBannerAd />
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
