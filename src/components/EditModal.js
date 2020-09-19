import React, { useState } from 'react'
import { View, StyleSheet, TextInput, Modal, Alert } from 'react-native'
import { AppButton } from './ui/AppButton'
import { THEME } from '../theme.js'

export const EditModal = ({ visible, onCancel, value, onSave }) => {
  const [title, setTitle] = useState(value)
  
  const saveHandler = () => {
    if (title.trim().length < 3) {
      Alert.alert('Ошибка', `Минимальная длина названия 3 символа, сейчас ${title.trim().length} символа(ов)`)
    } else {
      onSave(title)
    }
  }
  
  const cancelHandler = () => {
    setTitle(value)
    onCancel()
  }
  
  return (
    <Modal visible={visible} animationType='slide'>
      <View style={styles.wrap}>
        <TextInput 
          value={title}
          onChangeText={setTitle}
          style={styles.input} 
          placeholder='Введите название' 
          autoCapitalize='none' 
          autoCorrect={false} 
          maxLength={64}
        />
        <View style={styles.button}>
          <AppButton onPress={cancelHandler} color={THEME.DANGER_COLOR}>Отменить</AppButton>
          <AppButton onPress={saveHandler}>Сохранить</AppButton>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    padding: 10,
    borderBottomColor: THEME.MAIN_COLOR,
    borderBottomWidth: 2,
    width: '80%'
  },
  button: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
})