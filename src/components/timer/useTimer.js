// useTimers.js
import { useState, useEffect } from 'react';
import sounds from './SoundManager'; // 假設音效文件在 'sounds.js'

const useTimers = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [blackStarted, setBlackStarted] = useState(false);
  const [whiteStarted, setWhiteStarted] = useState(false);
  const [blackStartedByo, setBlackStartedByo] = useState(false);
  const [whiteStartedByo, setWhiteStartedByo] = useState(false);
  const [isBlackTurn, setIsBlackTurn] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [blackTime, setBlackTime] = useState({
    basicTimeInSeconds: 1200,
    secondsCountdown: 20,
    seconds: 20,
    repeats: 2,
  });
  const [whiteTime, setWhiteTime] = useState({
    basicTimeInSeconds: 1200,
    secondsCountdown: 20,
    seconds: 20,
    repeats: 2,
  });
  const [selectedMode, setSelectedMode] = useState('countdown');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(20);
  const [seconds, setSeconds] = useState(20);
  const [repeats, setRepeats] = useState(2);
  const [modalVisible, setModalVisible] = useState(false);
  const [winner, setWinner] = useState(null);

  const playSound = async (sound) => {
    const { sound: soundObject } = await Audio.Sound.createAsync(sound);
    await soundObject.playAsync();
  };

  const handleStartTimer = () => {
    setIsRunning(true);
  };

  const handlePauseTimer = () => {
    setIsRunning(false);
  };

  const handleResetTimer = () => {
    setBlackTime({
      basicTimeInSeconds: hours * 3600 + minutes * 60,
      secondsCountdown: seconds,
      seconds: seconds,
      repeats: repeats,
    });
    setWhiteTime({
      basicTimeInSeconds: hours * 3600 + minutes * 60,
      secondsCountdown: seconds,
      seconds: seconds,
      repeats: repeats,
    });
    setSelectedMode(selectedMode);
    setIsRunning(false);
    setWinner(null);
    setHasStarted(false);
    setBlackStarted(false);
    setWhiteStarted(false);
  };

  const handlePressTimer = () => {
    if (isRunning) {
      handlePauseTimer();
    } else {
      if (!hasStarted) {
        setIsBlackTurn(true);
        setHasStarted(true);
      }
      handleStartTimer();
    }
  };

  const handleTimerModeSubmit = (params) => {
    setHours(params.hours);
    setMinutes(params.minutes);
    setSeconds(params.seconds);
    setRepeats(params.repeats);

    setModalVisible(false);
    handleResetTimer();
    setSelectedMode(params.selectedMode);
  };

  const handleTimerModeClose = () => {
    setModalVisible(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  };

  useEffect(() => {
    setBlackTime({
      basicTimeInSeconds: hours * 3600 + minutes * 60,
      secondsCountdown: seconds,
      seconds: seconds,
      repeats: repeats,
    });
    setWhiteTime({
      basicTimeInSeconds: hours * 3600 + minutes * 60,
      secondsCountdown: seconds,
      seconds: seconds,
      repeats: repeats,
    });
    if (winner === 'black') {
      playSound(sounds.blacklose);
    } else if (winner === 'white') {
      playSound(sounds.whitelose);
    }
  }, [hours, minutes, repeats, seconds, winner]);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      if (!blackStarted && isBlackTurn) {
        setBlackStarted(true);
        playSound(sounds.blackstart);
      } else if (!whiteStarted && !isBlackTurn) {
        setWhiteStarted(true);
        playSound(sounds.whitestart);
      }

      if (selectedMode === 'countdown') {
        interval = setInterval(() => {
          if (isBlackTurn) {
            setBlackTime((prevTime) => {
              if (prevTime.basicTimeInSeconds > 0) {
                return {
                  basicTimeInSeconds: prevTime.basicTimeInSeconds - 1,
                  secondsCountdown: prevTime.secondsCountdown,
                  seconds: prevTime.seconds,
                  repeats: prevTime.repeats,
                };
              } else {
                if (prevTime.repeats === 1) {
                  if (prevTime.seconds - 1 === 9) {
                    playSound(sounds.s9);
                  } else if (prevTime.seconds - 1 === 8) {
                    playSound(sounds.s8);
                  } else if (prevTime.seconds - 1 === 7) {
                    playSound(sounds.s7);
                  } else if (prevTime.seconds - 1 === 6) {
                    playSound(sounds.s6);
                  } else if (prevTime.seconds - 1 === 5) {
                    playSound(sounds.s5);
                  } else if (prevTime.seconds - 1 === 4) {
                    playSound(sounds.s4);
                  } else if (prevTime.seconds - 1 === 3) {
                    playSound(sounds.s3);
                  } else if (prevTime.seconds - 1 === 2) {
                    playSound(sounds.s2);
                  } else if (prevTime.seconds - 1 === 1) {
                    playSound(sounds.s1);
                  }
                }
                if (!blackStartedByo) {
                  setBlackStartedByo(true);
                  playSound(sounds.blackstartbyo);
                }
                if (prevTime.repeats === 0) {
                  handlePauseTimer(); // 停止计时器
                  setWinner('white');
                  return {
                    basicTimeInSeconds: 0,
                    secondsCountdown: prevTime.secondsCountdown,
                    seconds: prevTime.secondsCountdown,
                    repeats: 0,
                  };
                } else if (prevTime.seconds === 0) {
                  return {
                    basicTimeInSeconds: prevTime.basicTimeInSeconds,
                    secondsCountdown: prevTime.secondsCountdown,
                    seconds: prevTime.secondsCountdown,
                    repeats: prevTime.repeats - 1,
                  };
                } else {
                  return {
                    basicTimeInSeconds: prevTime.basicTimeInSeconds,
                    secondsCountdown: prevTime.secondsCountdown,
                    seconds: prevTime.seconds - 1,
                    repeats: prevTime.repeats,
                  };
                }
              }
            });
          } else {
            setWhiteTime((prevTime) => {
              if (prevTime.basicTimeInSeconds > 0) {
                return {
                  basicTimeInSeconds: prevTime.basicTimeInSeconds - 1,
                  secondsCountdown: prevTime.secondsCountdown,
                  seconds: prevTime.seconds,
                  repeats: prevTime.repeats,
                };
              } else {
                if (!blackStartedByo) {
                  setWhiteStartedByo(true);
                  playSound(sounds.whitestartbyo);
                }

                if (prevTime.repeats === 0) {
                  handlePauseTimer(); // 停止计时器
                  setWinner('black');
                  return {
                    basicTimeInSeconds: 0,
                    secondsCountdown: prevTime.secondsCountdown,
                    seconds: prevTime.secondsCountdown,
                    repeats: 0,
                  };
                } else if (prevTime.seconds === 0) {
                  return {
                    basicTimeInSeconds: prevTime.basicTimeInSeconds,
                    secondsCountdown: prevTime.secondsCountdown,
                    seconds: prevTime.secondsCountdown,
                    repeats: prevTime.repeats - 1,
                  };
                } else {
                  return {
                    basicTimeInSeconds: prevTime.basicTimeInSeconds,
                    secondsCountdown: prevTime.secondsCountdown,
                    seconds: prevTime.seconds - 1,
                    repeats: prevTime.repeats,
                  };
                }
              }
            });
          }
        }, 1000);
      } else if (selectedMode === 'fixed') {
        interval = setInterval(() => {
          if (isBlackTurn) {
            setBlackTime((prevTime) => {
              if (prevTime.basicTimeInSeconds <= 0) {
                handlePauseTimer(); // 停止计时器
                setWinner('white');
                return {
                  basicTimeInSeconds: 0,
                };
              }
              return {
                basicTimeInSeconds: prevTime.basicTimeInSeconds - 1,
              };
            });
          } else {
            setWhiteTime((prevTime) => {
              if (prevTime.basicTimeInSeconds <= 0) {
                handlePauseTimer(); // 停止计时器
                setWinner('black');
                return {
                  basicTimeInSeconds: 0,
                };
              }
              return {
                basicTimeInSeconds: prevTime.basicTimeInSeconds - 1,
              };
            });
          }
        }, 1000);
      } else if (selectedMode === 'increment') {
        interval = setInterval(() => {
          if (isBlackTurn) {
            setBlackTime((prevTime) => {
              if (prevTime.basicTimeInSeconds <= 0) {
                handlePauseTimer();
                setWinner('white');
                return {
                  basicTimeInSeconds: 0,
                  seconds: prevTime.seconds,
                };
              }
              return {
                basicTimeInSeconds: prevTime.basicTimeInSeconds - 1,
                seconds: prevTime.seconds,
              };
            });
          } else {
            setWhiteTime((prevTime) => {
              if (prevTime.basicTimeInSeconds <= 0) {
                handlePauseTimer();
                setWinner('black');
                return {
                  basicTimeInSeconds: 0,
                  seconds: prevTime.seconds,
                };
              }
              return {
                basicTimeInSeconds: prevTime.basicTimeInSeconds - 1,
                seconds: prevTime.seconds,
              };
            });
          }
        }, 1000);
      }
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [
    isRunning,
    isBlackTurn,
    selectedMode,
    hasStarted,
    blackStartedByo,
    whiteStartedByo,
  ]);
  return {
    blackStartedByo,
    blackStarted,
    whiteStarted,
    isBlackTurn,
    whiteStartedByo,
    blackTime,
    whiteTime,
    selectedMode,
    hours,
    minutes,
    seconds,
    repeats,
    hasStarted,
    isRunning,
    handleStartTimer,
    handlePauseTimer,
    handleResetTimer,
    handlePressTimer,
    handleTimerModeClose,
    handleTimerModeSubmit,
    winner,
    formatTime,
    modalVisible,
    // ...
  };
};

export default useTimers;
