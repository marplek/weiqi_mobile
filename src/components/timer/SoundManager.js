import { Audio } from 'expo-av';
export const sounds = {
  s1: require('../../../assets/timer_sound/tw/1.mp3'),
  s2: require('../../../assets/timer_sound/tw/2.mp3'),
  s3: require('../../../assets/timer_sound/tw/3.mp3'),
  s4: require('../../../assets/timer_sound/tw/4.mp3'),
  s5: require('../../../assets/timer_sound/tw/5.mp3'),
  s6: require('../../../assets/timer_sound/tw/6.mp3'),
  s7: require('../../../assets/timer_sound/tw/7.mp3'),
  s8: require('../../../assets/timer_sound/tw/8.mp3'),
  s9: require('../../../assets/timer_sound/tw/9.mp3'),
  s10: require('../../../assets/timer_sound/tw/10.mp3'),
  s11: require('../../../assets/timer_sound/tw/11.mp3'),
  s12: require('../../../assets/timer_sound/tw/12.mp3'),
  s13: require('../../../assets/timer_sound/tw/13.mp3'),
  s14: require('../../../assets/timer_sound/tw/14.mp3'),
  s15: require('../../../assets/timer_sound/tw/15.mp3'),
  s16: require('../../../assets/timer_sound/tw/16.mp3'),
  s17: require('../../../assets/timer_sound/tw/17.mp3'),
  s18: require('../../../assets/timer_sound/tw/18.mp3'),
  s19: require('../../../assets/timer_sound/tw/19.mp3'),
  s20: require('../../../assets/timer_sound/tw/20.mp3'),
  s21: require('../../../assets/timer_sound/tw/21.mp3'),
  s22: require('../../../assets/timer_sound/tw/22.mp3'),
  s23: require('../../../assets/timer_sound/tw/23.mp3'),
  s24: require('../../../assets/timer_sound/tw/24.mp3'),
  s25: require('../../../assets/timer_sound/tw/25.mp3'),
  s26: require('../../../assets/timer_sound/tw/26.mp3'),
  s27: require('../../../assets/timer_sound/tw/27.mp3'),
  s28: require('../../../assets/timer_sound/tw/28.mp3'),
  s29: require('../../../assets/timer_sound/tw/29.mp3'),
  s30: require('../../../assets/timer_sound/tw/30.mp3'),
  s31: require('../../../assets/timer_sound/tw/31.mp3'),
  s32: require('../../../assets/timer_sound/tw/32.mp3'),
  s33: require('../../../assets/timer_sound/tw/33.mp3'),
  s34: require('../../../assets/timer_sound/tw/34.mp3'),
  s35: require('../../../assets/timer_sound/tw/35.mp3'),
  s36: require('../../../assets/timer_sound/tw/36.mp3'),
  s37: require('../../../assets/timer_sound/tw/37.mp3'),
  s38: require('../../../assets/timer_sound/tw/38.mp3'),
  s39: require('../../../assets/timer_sound/tw/39.mp3'),
  s40: require('../../../assets/timer_sound/tw/40.mp3'),
  s41: require('../../../assets/timer_sound/tw/41.mp3'),
  s42: require('../../../assets/timer_sound/tw/42.mp3'),
  s43: require('../../../assets/timer_sound/tw/43.mp3'),
  s44: require('../../../assets/timer_sound/tw/44.mp3'),
  s45: require('../../../assets/timer_sound/tw/45.mp3'),
  s46: require('../../../assets/timer_sound/tw/46.mp3'),
  s47: require('../../../assets/timer_sound/tw/47.mp3'),
  s48: require('../../../assets/timer_sound/tw/48.mp3'),
  s49: require('../../../assets/timer_sound/tw/49.mp3'),
  s50: require('../../../assets/timer_sound/tw/50.mp3'),
  s51: require('../../../assets/timer_sound/tw/51.mp3'),
  s52: require('../../../assets/timer_sound/tw/52.mp3'),
  s53: require('../../../assets/timer_sound/tw/53.mp3'),
  s54: require('../../../assets/timer_sound/tw/54.mp3'),
  s55: require('../../../assets/timer_sound/tw/55.mp3'),
  s56: require('../../../assets/timer_sound/tw/56.mp3'),
  s57: require('../../../assets/timer_sound/tw/57.mp3'),
  s58: require('../../../assets/timer_sound/tw/58.mp3'),
  s59: require('../../../assets/timer_sound/tw/59.mp3'),
  s60: require('../../../assets/timer_sound/tw/60.mp3'),
  black: require('../../../assets/timer_sound/tw/black.mp3'),
  byo: require('../../../assets/timer_sound/tw/byo.mp3'),
  countdown: require('../../../assets/timer_sound/tw/countdown.mp3'),
  last: require('../../../assets/timer_sound/tw/last.mp3'),
  lose: require('../../../assets/timer_sound/tw/lose.mp3'),
  min: require('../../../assets/timer_sound/tw/min.mp3'),
  sec: require('../../../assets/timer_sound/tw/sec.mp3'),
  start: require('../../../assets/timer_sound/tw/start.mp3'),
  times: require('../../../assets/timer_sound/tw/times.mp3'),
  white: require('../../../assets/timer_sound/tw/white.mp3'),
};

const loadedSounds = {};

export const loadSounds = async () => {
  try {
    for (const key in soundObjects) {
      const sound = new Audio.Sound();
      await sound.loadAsync(soundObjects[key]);
      loadedSounds[key] = sound;
    }
  } catch (error) {
    console.log('Error loading sound:', error);
  }
};
export const playSound = async (soundKey, delay = 0) => {
  if (loadedSounds[soundKey]) {
    try {
      await loadedSounds[soundKey].replayAsync();
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  } else {
    console.log('Sound not loaded');
  }
};