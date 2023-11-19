import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

const BoardSettingsModal = ({ visible, onRequestClose, onOptionSelected }) => {
  const { t } = useTranslation();
  const options = [
    { label: t("markLastMove"), value: "last_move" },
    { label: t("markAllMoves"), value: "all_moves" },
    { label: t("markLastMoveNumber"), value: "last_move_number" },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t("moveMarks")}</Text>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => onOptionSelected(option.value)}
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onRequestClose}
          >
            <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
          </TouchableOpacity>
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
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  option: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#ff5c5c",
    borderRadius: 10,
    padding: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
});

export default BoardSettingsModal;
