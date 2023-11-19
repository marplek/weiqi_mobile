import React, { useState, useEffect } from "react";
import { View, Modal, Text, TextInput, Button, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

const MessageModal = ({ visible, onRequestClose, onSave, defaultValues }) => {
  const { t } = useTranslation();
  const [gameName, setGameName] = useState(defaultValues.gameName);
  const [date, setDate] = useState(defaultValues.date);
  const [blackPlayer, setBlackPlayer] = useState(defaultValues.blackPlayer);
  const [blackRank, setBlackRank] = useState(defaultValues.blackRank);
  const [whitePlayer, setWhitePlayer] = useState(defaultValues.whitePlayer);
  const [whiteRank, setWhiteRank] = useState(defaultValues.whiteRank);
  const [komi, setKomi] = useState(defaultValues.komi);
  const [handicap, setHandicap] = useState(defaultValues.handicap);
  const [result, setResult] = useState(defaultValues.result);
  const [notes, setNotes] = useState(defaultValues.notes);
  const [localMetaData, setLocalMetaData] = useState(defaultValues);

  useEffect(() => {
    setLocalMetaData(defaultValues);
  }, [defaultValues]);
  const handleSave = () => {
    onSave({
      gameName,
      date,
      blackPlayer,
      blackRank,
      whitePlayer,
      whiteRank,
      komi,
      handicap,
      result,
      notes,
    });
  };

  const resetForm = () => {
    setGameName(defaultValues.gameName);
    setDate(defaultValues.date);
    setBlackPlayer(defaultValues.blackPlayer);
    setBlackRank(defaultValues.blackRank);
    setWhitePlayer(defaultValues.whitePlayer);
    setWhiteRank(defaultValues.whiteRank);
    setHandicap(defaultValues.handicap);
    setKomi(defaultValues.komi);
    setResult(defaultValues.result);
    setNotes(defaultValues.notes);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t("editMessage")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("gameName")}
            value={gameName}
            onChangeText={setGameName}
          />
          <TextInput
            style={styles.input}
            placeholder={t("time")}
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={styles.input}
            placeholder={t("blackPlayer")}
            value={blackPlayer}
            onChangeText={setBlackPlayer}
          />
          <TextInput
            style={styles.input}
            placeholder={t("blackRank")}
            value={blackRank}
            onChangeText={setBlackRank}
          />
          <TextInput
            style={styles.input}
            placeholder={t("whitePlayer")}
            value={whitePlayer}
            onChangeText={setWhitePlayer}
          />
          <TextInput
            style={styles.input}
            placeholder={t("whiteRank")}
            value={whiteRank}
            onChangeText={setWhiteRank}
          />
          <TextInput
            style={styles.input}
            placeholder={t("komi")}
            value={komi}
            onChangeText={setKomi}
          />
          <TextInput
            style={styles.input}
            placeholder={t("handicap")}
            value={handicap}
            onChangeText={setHandicap}
          />
          <TextInput
            style={styles.input}
            placeholder={t("result")}
            value={result}
            onChangeText={setResult}
          />
          <TextInput
            style={styles.input}
            placeholder={t("remarks")}
            value={notes}
            onChangeText={setNotes}
          />
          <Button
            title={t("cancel")}
            onPress={() => {
              resetForm();
              onRequestClose();
            }}
            color="#ff5c5c"
          />
          <Button title={t("save")} onPress={handleSave} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
});

export default MessageModal;
