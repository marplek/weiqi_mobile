export const START_TIMER = "START_TIMER";
export const RESET_TIMER = "RESET_TIMER";
export const SWITCH_TIMER = "SWITCH_TIMER";
export const PAUSE_TIMER = "PAUSE_TIMER";
export const TICK = "TICK";
export const SET_BLACK_TIME = "SET_BLACK_TIME";
export const SET_WHITE_TIME = "SET_WHITE_TIME";
export const SET_TIMER_DEFAULTS = "SET_TIMER_DEFAULTS";
export const SET_TIMER = "SET_TIMER";
export const SET_TIMER_MODE = "SET_TIMER_MODE";
export const SET_SETTING = "SET_BASIC_TIME";

export const setTimerMode = (mode) => ({
  type: SET_TIMER_MODE,
  payload: mode,
});

export const setSetting = (selectedMode, basicTime, seconds, repeats) => ({
  type: SET_SETTING,
  payload: {
    selectedMode,
    basicTime,
    seconds,
    repeats,
  },
});

export const setTimerDefaults = (newDefaults) => ({
  type: SET_TIMER_DEFAULTS,
  payload: newDefaults,
});

export const setTimer = (color, settings) => ({
  type: SET_TIMER,
  payload: {
    color,
    ...settings,
  },
});

export const setBlackTime = (time) => ({
  type: SET_BLACK_TIME,
  payload: time,
});

export const setWhiteTime = (time) => ({
  type: SET_WHITE_TIME,
  payload: time,
});

export const tick = () => ({
  type: TICK,
});

export const startTimer = () => ({
  type: START_TIMER,
});

export const resetTimer = () => ({
  type: RESET_TIMER,
});

export const pauseTimer = () => ({
  type: PAUSE_TIMER,
});

export const switchTimer = () => ({
  type: SWITCH_TIMER,
});
