import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import GameTypesScreen from './src/screens/GameTypesScreen';
import StagesScreen from './src/screens/StagesScreen';
import GameScreen from './src/screens/GameScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AnimatedModal from './src/components/AnimatedModal';
import BottomBannerAd from './src/components/BottomBannerAd';
import { initializeAds } from './src/ads/adsInit';
import { loadProgress, saveProgress, type Progress } from './src/state/progress';
import { getStageCount } from './src/data/words';
import { loadSettings, saveSettings, type Settings } from './src/state/settings';
import { setHapticEnabled } from './src/utils/haptics';
import { setSoundEnabled } from './src/utils/sound';
import { useAppFonts } from './src/utils/fonts';

SplashScreen.preventAutoHideAsync().catch(() => {});

type Screen = 'types' | 'stages' | 'game';

export default function App() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [wordLength, setWordLength] = useState<number | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [screen, setScreen] = useState<Screen>('types');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const fontsReady = useAppFonts();

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
    setScreen('stages');
    if (progress) {
      const next = { ...progress, wordLength: length };
      setProgress(next);
      saveProgress(next);
    }
  }

  function handleSelectStage(index: number) {
    setStageIndex(index);
    setScreen('game');
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
    setScreen('stages');
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
          {screen === 'types' && (
            <GameTypesScreen
              completedStages={progress.completedStages}
              onSelect={handleSelectGameType}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          )}
          {screen === 'stages' && (
            <StagesScreen
              wordLength={wordLength}
              completedCount={completedForLength}
              onSelectStage={handleSelectStage}
              onBack={() => setScreen('types')}
            />
          )}
          {screen === 'game' && (
            <GameScreen
              wordLength={wordLength}
              stageIndex={stageIndex}
              totalStages={getStageCount(wordLength)}
              onCompleteStage={handleCompleteStage}
              onBackToStages={() => setScreen('stages')}
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
