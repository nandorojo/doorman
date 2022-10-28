import { TextStyle, StyleProp, TextInput } from 'react-native'
import { MutableRefObject, CSSProperties } from 'react'

export type PhoneInputRef = {
  isValidNumber(): boolean
  getValue(): boolean
  focus(): void
  blur(): void
}
export type PhoneInputProps = {
  value: string
  onChangePhoneNumber: (info: { phoneNumber: string; valid: boolean }) => void
  textStyle?: StyleProp<TextStyle>
  inputRef?: MutableRefObject<PhoneInputRef | null>
  inputProps?: TextInput['props']
  disabled?: boolean
  style?: TextInput['props']['style'] | CSSProperties
  onSubmit?: (value: string) => void
}
