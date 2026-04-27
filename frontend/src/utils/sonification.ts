// Utility to convert data into sound for visually impaired students (Data-to-Sonification)

let audioContext: AudioContext | null = null;

export const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
};

/**
 * Plays a tone representing a value.
 * @param value The current value (e.g., height of the bar)
 * @param minVal The minimum possible value in the current array
 * @param maxVal The maximum possible value in the current array
 * @param index The position of the bar (to handle panning)
 * @param arrayLength The total number of items
 * @param durationMs How long the note should play
 */
export const playNote = (
  value: number,
  minVal: number,
  maxVal: number,
  index: number = 0,
  arrayLength: number = 1,
  durationMs: number = 100
) => {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const panner = audioContext.createStereoPanner();

  // Map value to frequency (e.g., 200Hz to 1200Hz)
  const minFreq = 200;
  const maxFreq = 1200;
  const freq = minVal === maxVal 
    ? minFreq 
    : minFreq + ((value - minVal) / (maxVal - minVal)) * (maxFreq - minFreq);
  
  oscillator.type = 'sine'; // Smooth tone
  oscillator.frequency.value = freq;

  // Map index to pan (-1 to 1)
  const pan = arrayLength > 1 
    ? -1 + (index / (arrayLength - 1)) * 2 
    : 0;
  panner.pan.value = pan;

  // Simple envelope to avoid clicking
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + (durationMs / 1000));

  oscillator.connect(panner);
  panner.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + (durationMs / 1000) + 0.05);
};

export const playArraySonification = async (array: number[], delayMs: number = 100) => {
  initAudioContext();
  const min = Math.min(...array);
  const max = Math.max(...array);

  for (let i = 0; i < array.length; i++) {
    playNote(array[i], min, max, i, array.length, delayMs);
    await new Promise(res => setTimeout(res, delayMs));
  }
};
