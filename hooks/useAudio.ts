import { useState, useEffect, useRef, useCallback } from "react";
import { Audio, AVPlaybackStatus } from "expo-av";

interface UseAudioReturn {
  isPlaying: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  playbackSpeed: number;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seek: (seconds: number) => Promise<void>;
  skipForward: () => Promise<void>;
  skipBackward: () => Promise<void>;
  setSpeed: (rate: number) => void;
}

export function useAudio(audioUri: string | null): UseAudioReturn {
  const sound = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });
  }, []);

  useEffect(() => {
    if (!audioUri) return;

    let mounted = true;

    async function loadAudio() {
      setIsLoading(true);
      try {
        if (sound.current) {
          await sound.current.unloadAsync();
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: false, rate: playbackSpeed, shouldCorrectPitch: true },
          (status: AVPlaybackStatus) => {
            if (!mounted || !status.isLoaded) return;
            setPosition(Math.floor((status.positionMillis || 0) / 1000));
            setDuration(Math.floor((status.durationMillis || 0) / 1000));
            setIsPlaying(status.isPlaying);
          }
        );

        sound.current = newSound;
      } catch (error) {
        console.error("Failed to load audio:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadAudio();

    return () => {
      mounted = false;
      sound.current?.unloadAsync();
    };
  }, [audioUri]);

  const play = useCallback(async () => {
    await sound.current?.playAsync();
  }, []);

  const pause = useCallback(async () => {
    await sound.current?.pauseAsync();
  }, []);

  const seek = useCallback(async (seconds: number) => {
    await sound.current?.setPositionAsync(seconds * 1000);
  }, []);

  const skipForward = useCallback(async () => {
    const newPos = Math.min(position + 15, duration);
    await seek(newPos);
  }, [position, duration, seek]);

  const skipBackward = useCallback(async () => {
    const newPos = Math.max(position - 15, 0);
    await seek(newPos);
  }, [position, seek]);

  const setSpeed = useCallback(
    (rate: number) => {
      setPlaybackSpeed(rate);
      sound.current?.setRateAsync(rate, true);
    },
    []
  );

  return {
    isPlaying,
    isLoading,
    position,
    duration,
    playbackSpeed,
    play,
    pause,
    seek,
    skipForward,
    skipBackward,
    setSpeed,
  };
}
