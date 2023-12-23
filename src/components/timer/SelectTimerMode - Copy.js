import React, { useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ModalSelector from 'react-native-modal-selector';

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
    key: hour.toString(),
    label: hour.toString(),
  }));
  const minutesData = Array.from(Array(60).keys()).map((minute) => ({
    key: minute.toString(),
    label: minute.toString(),
  }));
  const secondsData = Array.from(Array(60).keys(), (x) => x + 1).map(
    (second) => ({
      key: second.toString(),
      label: second.toString(),
    })
  );
  const repeatsData = Array.from(Array(20).keys(), (x) => x + 1).map(
    (repeat) => ({
      key: repeat.toString(),
      label: repeat.toString(),
    })
  );

  console.log(minutes);
  return (
    <Modal visible={visible} transparent={true}>
      // <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Select Timer Mode</Text>
            {Platform.OS === 'android' ? (
              <ModalSelector
                data={timerModes}
                textStyle={{ color: '#000' }}
                selectedKey={selectedMode}
                onChange={(option) => handleModeChange(option.key)}
                optionTextStyle={{ color: 'black' }}
                selectedItemTextStyle={{ color: 'black' }}
                textColor="black"
              />
            ) : (
              <RNPickerSelect
                onValueChange={(value) => handleModeChange(value)}
                items={timerModes.map((mode) => ({
                  label: mode.label,
                  value: mode.key,
                }))}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: styles.inputIOS,
                  inputAndroid: styles.inputAndroid,
                }}
                value={selectedMode}
                pickerProps={{ mode: 'dropdown' }}
              />
            )}
            {selectedMode === 'countdown' && (
              <>
                <Text style={styles.title}>基本時間</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {Platform.OS === 'android' ? (
                    <ModalSelector
                      style={styles.timePicker}
                      data={hoursData}
                      selectedKey={hours}
                      initValue={hours}
                      onChange={(option) => setHours(option.key)}
                      optionTextStyle={{ color: 'black' }}
                      selectedItemTextStyle={{ color: 'black' }}
                      textColor="black" // 添加這一行
                    />
                  ) : (
                  <RNPickerSelect
                    onValueChange={(value) => setHours(value)}
                    items={hoursData.map((hour) => ({
                      label: hour.label,
                      value: hour.key,
                    }))}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.inputIOS,
                      inputAndroid: styles.inputAndroid,
                    }}
                    value={hours}
                    fixAndroidTouchableBug={true}
                  />
                  )}
                  <Text style={styles.timeSeparator}>時</Text>
                  {Platform.OS === 'android' ? (
                    <ModalSelector
                      style={styles.timePicker}
                      data={minutesData}
                      selectedKey={minutes}
                      initValue={minutes}
                      onChange={(option) => setMinutes(option.key)}
                      optionTextStyle={{ color: 'black' }}
                      selectedItemTextStyle={{ color: 'black' }}
                    />
                  ) : (
                  <RNPickerSelect
                    onValueChange={(value) => setMinutes(value)}
                    items={minutesData.map((minute) => ({
                      label: minute.label,
                      value: minute.key,
                    }))}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.inputIOS,
                      inputAndroid: styles.inputAndroid,
                    }}
                    value={minutes}
                    fixAndroidTouchableBug={true}
                  />
                  )}
                  <Text style={styles.timeSeparator}>分</Text>
                </View>
                <Text style={styles.title}>讀秒</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {Platform.OS === 'android' ? (
                    <ModalSelector
                      style={styles.timePicker}
                      data={secondsData}
                      selectedKey={seconds}
                      initValue={seconds}
                      onChange={(option) => setSeconds(option.key)}
                      optionTextStyle={{ color: 'black' }}
                      selectedItemTextStyle={{ color: 'black' }}
                    />
                  ) : (
                  <RNPickerSelect
                    onValueChange={(value) => setSeconds(value)}
                    items={secondsData.map((second) => ({
                      label: second.label,
                      value: second.key,
                    }))}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.inputIOS,
                      inputAndroid: styles.inputAndroid,
                    }}
                    value={seconds}
                    fixAndroidTouchableBug={true}
                  />
                  )}
                  <Text style={styles.timeSeparator}>秒</Text>
                  {Platform.OS === 'android' ? (
                    <ModalSelector
                      style={styles.repeatPicker}
                      data={repeatsData}
                      selectedKey={repeats}
                      initValue={repeats}
                      onChange={(option) => setRepeats(option.key)}
                      optionTextStyle={{ color: 'black' }}
                      selectedItemTextStyle={{ color: 'black' }}
                    />
                  ) : (
                  <RNPickerSelect
                    onValueChange={(value) => setRepeats(value)}
                    items={repeatsData.map((repeat) => ({
                      label: repeat.label,
                      value: repeat.key,
                    }))}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.inputIOS,
                      inputAndroid: styles.inputAndroid,
                    }}
                    value={repeats}
                    fixAndroidTouchableBug={true}
                  />
                  )}
                  <Text style={styles.timeSeparator}>次</Text>
                </View>
              </>
            )}
            {selectedMode === 'fixed' && (
              <>
                <Text style={styles.title}>基本時間</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {Platform.OS === 'android' ? (
                    <ModalSelector
                      style={styles.timePicker}
                      data={hoursData}
                      selectedKey={hours}
                      initValue={hours}
                      onChange={(option) => setHours(option.key)}
                      optionTextStyle={{ color: 'black' }}
                      selectedItemTextStyle={{ color: 'black' }}
                      textColor="black" // 添加這一行
                    />
                  ) : (
                  <RNPickerSelect
                    onValueChange={(value) => setHours(value)}
                    items={hoursData.map((hour) => ({
                      label: hour.label,
                      value: hour.key,
                    }))}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.inputIOS,
                      inputAndroid: styles.inputAndroid,
                    }}
                    value={hours}
                    fixAndroidTouchableBug={true}
                  />
                  )}
                  <Text style={styles.timeSeparator}>時</Text>
                  {Platform.OS === 'android' ? (
                    <ModalSelector
                      style={styles.timePicker}
                      data={minutesData}
                      selectedKey={minutes}
                      initValue={minutes}
                      onChange={(option) => setMinutes(option.key)}
                      optionTextStyle={{ color: 'black' }}
                      selectedItemTextStyle={{ color: 'black' }}
                    />
                  ) : (
                  <RNPickerSelect
                    onValueChange={(value) => setMinutes(value)}
                    items={minutesData.map((minute) => ({
                      label: minute.label,
                      value: minute.key,
                    }))}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.inputIOS,
                      inputAndroid: styles.inputAndroid,
                    }}
                    value={minutes}
                    fixAndroidTouchableBug={true}
                  />
                  )}
                  <Text style={styles.timeSeparator}>分</Text>
                </View>
              </>
            )}
            {selectedMode === 'increment' && (
              <>
                <Text style={styles.title}>基本時間</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {Platform.OS === 'android' ? (
                    <ModalSelector
                      style={styles.timePicker}
                      data={hoursData}
                      selectedKey={hours}
                      initValue={hours}
                      onChange={(option) => setHours(option.key)}
                      optionTextStyle={{ color: 'black' }}
                      selectedItemTextStyle={{ color: 'black' }}
                      textColor="black" // 添加這一行
                    />
                  ) : (
                  <RNPickerSelect
                    onValueChange={(value) => setHours(value)}
                    items={hoursData.map((hour) => ({
                      label: hour.label,
                      value: hour.key,
                    }))}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.inputIOS,
                      inputAndroid: styles.inputAndroid,
                    }}
                    value={hours}
                    fixAndroidTouchableBug={true}
                  />
                  )}
                  <Text style={styles.timeSeparator}>時</Text>
                  {Platform.OS === 'android' ? (
                    <ModalSelector
                      style={styles.timePicker}
                      data={minutesData}
                      selectedKey={minutes}
                      initValue={minutes}
                      onChange={(option) => setMinutes(option.key)}
                      optionTextStyle={{ color: 'black' }}
                      selectedItemTextStyle={{ color: 'black' }}
                    />
                  ) : (
                  <RNPickerSelect
                    onValueChange={(value) => setMinutes(value)}
                    items={minutesData.map((minute) => ({
                      label: minute.label,
                      value: minute.key,
                    }))}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.inputIOS,
                      inputAndroid: styles.inputAndroid,
                    }}
                    value={minutes}
                    fixAndroidTouchableBug={true}
                  />
                  )}
                  <Text style={styles.timeSeparator}>分</Text>
                </View>
                <Text style={styles.title}>加秒</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {Platform.OS === 'android' ? (
                    <ModalSelector
                      style={styles.timePicker}
                      data={secondsData}
                      selectedKey={seconds}
                      initValue={seconds}
                      onChange={(option) => setSeconds(option.key)}
                      optionTextStyle={{ color: 'black' }}
                      selectedItemTextStyle={{ color: 'black' }}
                    />
                  ) : (
                  <RNPickerSelect
                    onValueChange={(value) => setSeconds(value)}
                    items={secondsData.map((second) => ({
                      label: second.label,
                      value: second.key,
                    }))}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.inputIOS,
                      inputAndroid: styles.inputAndroid,
                    }}
                    value={seconds}
                    fixAndroidTouchableBug={true}
                  />
                  )}
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
      // </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  timePicker: {},
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
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default SelectTimerMode;
