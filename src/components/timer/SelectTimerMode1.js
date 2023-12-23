import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const SelectTimerMode = ({ visible, onClose, onSubmit }) => {
  const [selectedMode, setSelectedMode] = useState('countdown');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('20');
  const [seconds, setSeconds] = useState('20');
  const [repeats, setRepeats] = useState('2');

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
  };

  const handleSubmit = () => {
    const params = {
      selectedMode,
      hours,
      minutes,
      seconds,
      repeats,
    };

    onSubmit(params);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    visible = false;
  };

  const timerModes = [
    { key: 'countdown', label: '讀秒' },
    { key: 'fixed', label: '包干' },
    { key: 'increment', label: '加秒' },
  ];

  const hoursData = Array.from(Array(24).keys()).map((hour) => ({
    label: hour.toString(),
    value: hour.toString(),
  }));
  const minutesData = Array.from(Array(60).keys()).map((minute) => ({
    label: minute.toString(),
    value: minute.toString(),
  }));
  const secondsData = Array.from(Array(60).keys(), (x) => x + 1).map(
    (second) => ({
      label: second.toString(),
      value: second.toString(),
    })
  );
  const repeatsData = Array.from(Array(20).keys(), (x) => x + 1).map(
    (repeat) => ({
      label: repeat.toString(),
      value: repeat.toString(),
    })
  );
  return (
    <Modal visible={visible} onBackdropPress={onClose} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Timer Mode</Text>
          <RNPickerSelect
            items={timerModes}
            onValueChange={(value) => handleModeChange(value)}
            value={selectedMode}
            style={pickerSelectStyles}
          />
          {selectedMode === 'countdown' && (
            <>
              <Text style={styles.title}>基本時間</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RNPickerSelect
                  items={hoursData}
                  onValueChange={(value) => setHours(value)}
                  value={hours}
                  style={pickerSelectStyles}
                />
                <Text style={styles.timeSeparator}>時</Text>
                <RNPickerSelect
                  items={minutesData}
                  onValueChange={(value) => setMinutes(value)}
                  value={minutes}
                  style={pickerSelectStyles}
                />
                <Text style={styles.timeSeparator}>分</Text>
              </View>
              <Text style={styles.title}>讀秒</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RNPickerSelect
                  items={secondsData}
                  onValueChange={(value) => setSeconds(value)}
                  value={seconds}
                  style={pickerSelectStyles}
                />
                <Text style={styles.timeSeparator}>秒</Text>

                <RNPickerSelect
                  items={repeatsData}
                  onValueChange={(value) => setRepeats(value)}
                  value={repeats}
                  style={pickerSelectStyles}
                />
                <Text style={styles.timeSeparator}>次</Text>
              </View>
            </>
          )}
          {selectedMode === 'fixed' && (
            <>
              <Text style={styles.title}>基本時間</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RNPickerSelect
                  items={hoursData}
                  onValueChange={(value) => setHours(value)}
                  value={hours}
                  style={pickerSelectStyles}
                />
                <Text style={styles.timeSeparator}>時</Text>
                <RNPickerSelect
                  items={minutesData}
                  onValueChange={(value) => setMinutes(value)}
                  value={minutes}
                  style={pickerSelectStyles}
                />
                <Text style={styles.timeSeparator}>分</Text>
              </View>
            </>
          )}
          {selectedMode === 'increment' && (
            <>
              <Text style={styles.title}>基本時間</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RNPickerSelect
                  items={hoursData}
                  onValueChange={(value) => setHours(value)}
                  value={hours}
                  style={pickerSelectStyles}
                />
                <Text style={styles.timeSeparator}>時</Text>
                <RNPickerSelect
                  items={minutesData}
                  onValueChange={(value) => setMinutes(value)}
                  value={minutes}
                  style={pickerSelectStyles}
                />
                <Text style={styles.timeSeparator}>分</Text>
              </View>
              <Text style={styles.title}>加秒</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RNPickerSelect
                  items={secondsData}
                  onValueChange={(value) => setSeconds(value)}
                  value={seconds}
                  style={pickerSelectStyles}
                />
                <Text style={styles.timeSeparator}>秒</Text>
              </View>
            </>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    minWidth: 100,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    minWidth: 100,
  },
});
const styles = StyleSheet.create({
  timeSeparator: {
    fontSize: 18,
    marginHorizontal: 5, // 增加水平距離
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SelectTimerMode;
