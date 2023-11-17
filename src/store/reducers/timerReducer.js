import {
  START_TIMER,
  RESET_TIMER,
  SWITCH_TIMER,
  TICK,
  PAUSE_TIMER,
  SET_TIMER,
  SWITCH_MODE,
  SET_TIMER_MODE,
  SET_SETTING,
} from "../actions/timerActions";
import { MODES } from "../states/TimeState";

const initialTimerDefaults = {
  basicTime: 1200, // in seconds
  seconds: 20, // in seconds
  repeats: 2,
};

const initialState = {
  mode: "countdown",
  timerDefaults: initialTimerDefaults,
  timers: {
    black: { ...initialTimerDefaults },
    white: { ...initialTimerDefaults },
  },
  turn: "black",
  isRunning: false,
  hasStarted: false,
  winner: null,
};

export default function timerReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TIMER_MODE:
      return {
        ...state,
        mode: action.payload,
      };

    case SET_SETTING:
      return {
        ...state,
        mode: action.payload.selectedMode,
        timerDefaults: {
          ...state.timerDefaults,
          basicTime: action.payload.basicTime,
          seconds: action.payload.seconds,
          repeats: action.payload.repeats,
        },
      };
    case START_TIMER:
      return {
        ...state,
        hasStarted: true,
        isRunning: true,
        turn: "black",
      };
    case SWITCH_TIMER:
      return {
        ...state,
        turn: state.turn === "black" ? "white" : "black",
      };
    case PAUSE_TIMER:
      return {
        ...state,
        isRunning: false,
      };

    case SET_TIMER: {
      const { color, ...settings } = action.payload;
      return {
        ...state,
        timers: {
          ...state.timers,
          [color]: {
            ...state.timers[color],
            ...settings,
          },
        },
      };
    }
    case RESET_TIMER:
      return {
        ...state,
        timers: {
          black: { ...state.timerDefaults },
          white: { ...state.timerDefaults },
        },
        turn: "black",
        isRunning: false,
        winner: null,
        hasStarted: false,
      };

    case SWITCH_MODE:
      return {
        ...state,
        currentMode: action.payload.newMode,
      };
    case TICK:
      const activeColor = state.turn;
      return MODES[state.mode].tick(state, activeColor);
    default:
      return state;
  }
}
