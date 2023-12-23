import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import SelectTimerMode from '../../components/timer/SelectTimerMode';
import {
  sounds,
  loadSounds,
  playSound,
} from '../../components/timer/SoundManager';

const { height } = Dimensions.get('window');
import { StatusBar, Keyboard } from 'react-native';
import Constants from 'expo-constants';

const TimerScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [hasStarted, setHasStarted] = useState(false);
  const [blackStarted, setBlackStarted] = useState(false);
  const [whiteStarted, setWhiteStarted] = useState(false);
  const [blackStartedByo, setBlackStartedByo] = useState(false);
  const [whiteStartedByo, setWhiteStartedByo] = useState(false);
  const [blackLastByo, setBlackLastByo] = useState(false);
  const [whiteLastByo, setWhiteLastByo] = useState(false);
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
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(20);
  const [repeats, setRepeats] = useState(2);
  const [modalVisible, setModalVisible] = useState(false);
  const [winner, setWinner] = useState(null);
  const [hideStatusBar, setHideStatusBar] = useState(false);
  const [sound, setSound] = useState();

  async function playSound(file) {
    return new Promise(async (resolve) => {
      const { sound } = await Audio.Sound.createAsync(file, {}, (status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
          resolve();
        }
      });

      setSound(sound);
      await sound.playAsync();
    });
  }

  async function playGoTimerSounds(...soundsToPlay) {
    for (const soundName of soundsToPlay) {
      await playSound(sounds[soundName]);
    }
  }

  useEffect(() => {
    // Only hide status bar on Android
    if (Platform.OS === 'android') {
      const { height } = Constants.statusBarHeight;
      const hasSoftKeys = height < 0;

      // Check if device has virtual keys
      if (hasSoftKeys) {
        setHideStatusBar(true);
      }
    }
  }, []);

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
    setBlackStartedByo(false);
    setWhiteStartedByo(false);
    setBlackLastByo(false);
    setWhiteLastByo(false);
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
  }, [hours, minutes, repeats, seconds, winner]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      if (!blackStarted && isBlackTurn) {
        setBlackStarted(true);
        playGoTimerSounds('black', 'start', 'countdown');
      } else if (!whiteStarted && !isBlackTurn) {
        setWhiteStarted(true);
        playGoTimerSounds('white', 'start', 'countdown');
      }

      if (selectedMode === 'countdown') {
        interval = setInterval(() => {
          if (isBlackTurn) {
            setBlackTime((prevTime) => {
              if (prevTime.basicTimeInSeconds > 0) {
                if (prevTime.basicTimeInSeconds - 1 === 600) {
                  playGoTimerSounds('black', 'last', 's10', 'min');
                } else if (prevTime.basicTimeInSeconds - 1 === 300) {
                  playGoTimerSounds('black', 'last', 's5', 'min');
                }
                return {
                  basicTimeInSeconds: prevTime.basicTimeInSeconds - 1,
                  secondsCountdown: prevTime.secondsCountdown,
                  seconds: prevTime.seconds,
                  repeats: prevTime.repeats,
                };
              } else {
                if (!blackStartedByo) {
                  setBlackStartedByo(true);
                  playGoTimerSounds('black', 'start', 'byo');
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
                } else if (prevTime.seconds === 1) {
                  if (prevTime.repeats - 1 === 1 && !blackLastByo) {
                    setBlackLastByo(true);
                    playGoTimerSounds('black', 'last', 's1', 'times', 'byo');
                  } else if (prevTime.repeats === 1 && blackLastByo) {
                    playGoTimerSounds('black', 'lose');
                  }

                  return {
                    basicTimeInSeconds: prevTime.basicTimeInSeconds,
                    secondsCountdown: prevTime.secondsCountdown,
                    seconds: prevTime.secondsCountdown,
                    repeats: prevTime.repeats - 1,
                  };
                } else {
                  if (prevTime.repeats === 1) {
                    if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      11
                    ) {
                      playGoTimerSounds('s9');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      12
                    ) {
                      playGoTimerSounds('s8');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      13
                    ) {
                      playGoTimerSounds('s7');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      14
                    ) {
                      playGoTimerSounds('s6');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      15
                    ) {
                      playGoTimerSounds('s5');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      16
                    ) {
                      playGoTimerSounds('s4');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      17
                    ) {
                      playGoTimerSounds('s3');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      18
                    ) {
                      playGoTimerSounds('s2');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      19
                    ) {
                      playGoTimerSounds('s1');
                    }
                  } else {
                    if (prevTime.secondsCountdown === '20') {
                      if (
                        prevTime.secondsCountdown - prevTime.seconds + 1 ===
                        10
                      ) {
                        playGoTimerSounds('s10', 'sec');
                      } else if (
                        prevTime.secondsCountdown - prevTime.seconds + 1 ===
                        15
                      ) {
                        playGoTimerSounds('s15', 'sec');
                      } else if (
                        prevTime.secondsCountdown - prevTime.seconds + 1 ===
                        18
                      ) {
                        playGoTimerSounds('s18', 'sec');
                      }
                    }
                  }
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
                if (prevTime.basicTimeInSeconds - 1 === 600) {
                  playGoTimerSounds('white', 'last', 's10', 'min');
                } else if (prevTime.basicTimeInSeconds - 1 === 300) {
                  playGoTimerSounds('white', 'last', 's15', 'min');
                }
                return {
                  basicTimeInSeconds: prevTime.basicTimeInSeconds - 1,
                  secondsCountdown: prevTime.secondsCountdown,
                  seconds: prevTime.seconds,
                  repeats: prevTime.repeats,
                };
              } else {
                if (!whiteStartedByo) {
                  setWhiteStartedByo(true);
                  playGoTimerSounds('white', 'start', 'byo');
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
                } else if (prevTime.seconds === 1) {
                  if (prevTime.repeats - 1 === 1 && !whiteLastByo) {
                    setWhiteLastByo(true);
                    playGoTimerSounds('white', 'last', 's1', 'times', 'byo');
                  } else if (prevTime.repeats === 1 && whiteLastByo) {
                    playGoTimerSounds('white', 'lose');
                  }
                  return {
                    basicTimeInSeconds: prevTime.basicTimeInSeconds,
                    secondsCountdown: prevTime.secondsCountdown,
                    seconds: prevTime.secondsCountdown,
                    repeats: prevTime.repeats - 1,
                  };
                } else {
                  if (prevTime.repeats === 1) {
                    if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      11
                    ) {
                      playGoTimerSounds('s9');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      12
                    ) {
                      playGoTimerSounds('s8');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      13
                    ) {
                      playGoTimerSounds('s7');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      14
                    ) {
                      playGoTimerSounds('s6');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      15
                    ) {
                      playGoTimerSounds('s5');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      16
                    ) {
                      playGoTimerSounds('s4');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      17
                    ) {
                      playGoTimerSounds('s3');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      18
                    ) {
                      playGoTimerSounds('s2');
                    } else if (
                      prevTime.secondsCountdown - prevTime.seconds + 1 ===
                      19
                    ) {
                      playGoTimerSounds('s1');
                    }
                  } else {
                    if (prevTime.secondsCountdown === '20') {
                      if (
                        prevTime.secondsCountdown - prevTime.seconds + 1 ===
                        10
                      ) {
                        playGoTimerSounds('s10', 'sec');
                      } else if (
                        prevTime.secondsCountdown - prevTime.seconds + 1 ===
                        15
                      ) {
                        playGoTimerSounds('s15', 'sec');
                      }
                    }
                  }
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
              if (prevTime.basicTimeInSeconds - 1 === 600) {
                playGoTimerSounds('black', 'last', 's10', 'min');
              } else if (prevTime.basicTimeInSeconds - 1 === 300) {
                playGoTimerSounds('black', 'last', 's5', 'min');
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
              if (prevTime.basicTimeInSeconds - 1 === 600) {
                playGoTimerSounds('white', 'last', 's10', 'min');
              } else if (prevTime.basicTimeInSeconds - 1 === 300) {
                playGoTimerSounds('white', 'last', 's5', 'min');
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
              if (prevTime.basicTimeInSeconds - 1 === 600) {
                playGoTimerSounds('black', 'last', 's10', 'min');
              } else if (prevTime.basicTimeInSeconds - 1 === 300) {
                playGoTimerSounds('black', 'last', 's5', 'min');
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
              if (prevTime.basicTimeInSeconds - 1 === 600) {
                playGoTimerSounds('white', 'last', 's10', 'min');
              } else if (prevTime.basicTimeInSeconds - 1 === 300) {
                playGoTimerSounds('white', 'last', 's5', 'min');
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
    blackStarted,
    whiteStarted,
    blackLastByo,
    whiteLastByo,
  ]);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View style={{ flex: 4.25 }}>
        <TouchableOpacity
          onPress={() => {
            if (selectedMode === 'increment' && isBlackTurn && isRunning) {
              setBlackTime((prevTime) => ({
                basicTimeInSeconds:
                  parseInt(prevTime.basicTimeInSeconds) +
                  parseInt(prevTime.seconds),
                seconds: prevTime.seconds,
              }));
            }
            if (
              selectedMode === 'countdown' &&
              isBlackTurn &&
              isRunning &&
              blackTime.basicTimeInSeconds === 0
            ) {
              setBlackTime((prevTime) => ({
                basicTimeInSeconds: 0,
                secondsCountdown: prevTime.secondsCountdown,
                seconds: prevTime.secondsCountdown,
                repeats: prevTime.repeats,
              }));
            }
            if (isRunning) {
              setIsBlackTurn(false);
            }
          }}
          style={styles.blackTouchable}>
          <View style={styles.blackClickableArea}>
            {winner === 'black' && <Text style={styles.blackText}>黑方勝</Text>}
            {winner === 'white' && <Text style={styles.blackText}>黑方負</Text>}
            {selectedMode === 'countdown' && (
              <Text
                style={
                  blackTime.basicTimeInSeconds === 0
                    ? styles.blackText
                    : styles.smallerBlackText
                }>
                {blackTime.repeats} : {blackTime.seconds}
              </Text>
            )}
            <Text
              style={
                blackTime.basicTimeInSeconds === 0 &&
                selectedMode === 'countdown'
                  ? styles.smallerBlackText
                  : styles.blackText
              }>
              {formatTime(blackTime.basicTimeInSeconds)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="ios-arrow-back" size={height / 12} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePressTimer}>
          <Ionicons
            name={isRunning ? 'ios-pause' : 'ios-play'}
            size={height / 12}
            color="gray"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="ios-settings" size={height / 12} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleResetTimer}>
          <Ionicons name="ios-refresh" size={height / 12} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 4.25 }}>
        <TouchableOpacity
          onPress={() => {
            if (selectedMode === 'increment' && !isBlackTurn && isRunning) {
              setWhiteTime((prevTime) => ({
                basicTimeInSeconds:
                  parseInt(prevTime.basicTimeInSeconds) +
                  parseInt(prevTime.seconds),
                seconds: prevTime.seconds,
              }));
              handleStartTimer();
            }
            if (
              selectedMode === 'countdown' &&
              !isBlackTurn &&
              isRunning &&
              whiteTime.basicTimeInSeconds === 0
            ) {
              setWhiteTime((prevTime) => ({
                basicTimeInSeconds: 0,
                secondsCountdown: prevTime.secondsCountdown,
                seconds: prevTime.secondsCountdown,
                repeats: prevTime.repeats,
              }));
              handleStartTimer();
            }
            if (isRunning) {
              setIsBlackTurn(true);
              handleStartTimer();
            }
            if (!hasStarted) {
              setIsBlackTurn(true);
              setHasStarted(true);
              handleStartTimer();
            }
          }}
          style={styles.whiteTouchable}>
          <View style={styles.whiteClickableArea}>
            <Text
              style={
                whiteTime.basicTimeInSeconds === 0 &&
                selectedMode === 'countdown'
                  ? styles.smallerWhiteText
                  : styles.whiteText
              }>
              {formatTime(whiteTime.basicTimeInSeconds)}
            </Text>
            {selectedMode === 'countdown' && (
              <Text
                style={
                  whiteTime.basicTimeInSeconds === 0
                    ? styles.whiteText
                    : styles.smallerWhiteText
                }>
                {whiteTime.repeats} : {whiteTime.seconds}
              </Text>
            )}

            {winner === 'black' && <Text style={styles.whiteText}>白方負</Text>}
            {winner === 'white' && <Text style={styles.whiteText}>白方勝</Text>}
          </View>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <SelectTimerMode
          visible={modalVisible}
          onClose={handleTimerModeClose}
          onSubmit={handleTimerModeSubmit}
          optionTextStyle={{ color: 'black' }}
          selectedItemTextStyle={{ color: 'black' }}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blackTouchable: {
    flex: 4.6,
    height: '100%',
    width: '100%',
  },
  whiteTouchable: {
    flex: 4.6,
    height: '100%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  iconContainer: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blackClickableArea: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteClickableArea: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  blackText: {
    fontSize: 60,
    color: 'white',
    transform: [{ rotate: '180deg' }],
  },
  whiteText: {
    fontSize: 60,
    color: 'black',
  },
  smallerBlackText: {
    fontSize: 30,
    color: 'white',
    transform: [{ rotate: '180deg' }],
  },
  smallerWhiteText: {
    fontSize: 30,
    color: 'black',
  },
});

export default TimerScreen;
// export default SettingsScreen;
