class TimerState {
    tick(state, activeColor) {
        throw new Error("This method should be overridden in derived classes");
    }

    updateTimer(state, activeColor, updates) {
        return {
            ...state,
            timers: {
                ...state.timers,
                [activeColor]: {
                    ...state.timers[activeColor],
                    ...updates
                }
            }
        };
    }
}

class CountdownMode extends TimerState {
    tick(state, activeColor) {
        const otherColor = activeColor === 'black' ? 'white' : 'black';

        if (state.timers[activeColor].basicTime > 1) {
            return this.updateTimer(state, activeColor, { basicTime: state.timers[activeColor].basicTime - 1 });
        } else if (state.timers[activeColor].repeats > 0 && state.timers[activeColor].seconds <= 1) {
            return this.updateTimer(state, activeColor, { repeats: state.timers[activeColor].repeats - 1, seconds: state.timerDefaults.seconds });
        } else if (state.timers[activeColor].repeats <= 0) {
            return {
                ...this.updateTimer(state, activeColor, { repeats: 0 }),
                winner: otherColor,
                isRunning: false
            };
        } else {
            return this.updateTimer(state, activeColor, { seconds: state.timers[activeColor].seconds - 1 });
        }
    }
}

class IncrementMode extends TimerState {
    tick(state, activeColor) {
        const otherColor = activeColor === 'black' ? 'white' : 'black';
        const incrementedTime = state.timers[activeColor].basicTime - 1;

        if (incrementedTime <= 0) {
            return {
                ...this.updateTimer(state, activeColor, { basicTime: 0 }),
                winner: otherColor,
                isRunning: false
            };
        } else {
            return this.updateTimer(state, activeColor, { basicTime: incrementedTime });
        }
    }
}

class FixedMode extends TimerState {
    tick(state, activeColor) {
        const otherColor = activeColor === 'black' ? 'white' : 'black';
        const newBasicTime = state.timers[activeColor].basicTime - 1;

        if (newBasicTime <= 0) {
            return {
                ...this.updateTimer(state, activeColor, { basicTime: 0 }),
                winner: otherColor,
                isRunning: false
            };
        } else {
            return this.updateTimer(state, activeColor, { basicTime: newBasicTime });
        }
    }
}

export const MODES = {
    countdown: new CountdownMode(),
    increment: new IncrementMode(),
    fixed: new FixedMode()
};