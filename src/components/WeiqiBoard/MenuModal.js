import React from "react";
import { Modal, View, Button, StyleSheet } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { useTranslation } from "react-i18next";

const MenuModal = ({ visible, onRequestClose, onMenuItemPress }) => {
  const { t } = useTranslation();
  const menuItems = [
    {
      title: t("newRecord"),
      icon: "note-add",
      action: "new_record",
      onPress: () => {
        onMenuItemPress("new_record");
      },
    },
    {
      title: t("editMessage"),
      icon: "edit",
      action: "edit_message",
      onPress: () => {
        onMenuItemPress("edit_message");
      },
    },
    {
      title: t("boardSettings"),
      icon: "settings",
      action: "board_settings",
      onPress: () => {
        onMenuItemPress("board_settings");
      },
    },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setvisible(false);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              onPress={() => onMenuItemPress(item.action)}
              bottomDivider
            >
              <Icon name={item.icon} type="material" />
              <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
          <Button
            title={t("cancel")}
            onPress={onRequestClose}
            color="#ff5c5c"
          />
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
});
export default MenuModal;
