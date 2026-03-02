import * as FileSystem from "expo-file-system";

const API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || "placeholder-key";
const VOICE_ID = process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID || "pNInz6obpgDQGcFmaJgB";
const BASE_URL = "https://api.elevenlabs.io/v1";

const AUDIO_CACHE_DIR = `${FileSystem.documentDirectory}audio/`;

async function ensureCacheDir() {
  const dirInfo = await FileSystem.getInfoAsync(AUDIO_CACHE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(AUDIO_CACHE_DIR, { intermediates: true });
  }
}

export async function getCachedAudioUri(storyId: string): Promise<string | null> {
  const path = `${AUDIO_CACHE_DIR}${storyId}.mp3`;
  const info = await FileSystem.getInfoAsync(path);
  return info.exists ? path : null;
}

export async function generateStoryAudio(
  storyId: string,
  script: string
): Promise<string> {
  await ensureCacheDir();

  const cached = await getCachedAudioUri(storyId);
  if (cached) return cached;

  const response = await fetch(`${BASE_URL}/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: script,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  const audioPath = `${AUDIO_CACHE_DIR}${storyId}.mp3`;
  const blob = await response.blob();

  const reader = new FileReader();
  const base64 = await new Promise<string>((resolve) => {
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.readAsDataURL(blob);
  });

  await FileSystem.writeAsStringAsync(audioPath, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return audioPath;
}

export async function transcribeVoice(audioUri: string): Promise<string> {
  // TODO: Implement ElevenLabs Speech-to-Text
  return "";
}

export async function askQuestion(
  question: string,
  storyTitle: string,
  storyScript: string
): Promise<string> {
  // TODO: Implement ElevenLabs Conversational AI
  return "";
}
