import { Audio } from "expo-av";

const cues = {
  correct: require("../assets/correct.wav") as number,
  incorrect: require("../assets/wrong.wav") as number,
  complete: require("../assets/complete.wav") as number,
};

let audioModeReady = false;

export async function playFeedbackSound(kind: keyof typeof cues, enabled: boolean) {
  if (!enabled) return;
  try {
    if (!audioModeReady) {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, shouldDuckAndroid: true });
      audioModeReady = true;
    }
    const { sound } = await Audio.Sound.createAsync(cues[kind], { shouldPlay: true, volume: 0.45 });
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) sound.unloadAsync().catch(() => {});
    });
  } catch {
    audioModeReady = false;
  }
}
