import { TextStyle, StyleProp, TextInput } from 'react-native'
import { MutableRefObject, CSSProperties } from 'react'
import ReactNativePhoneInput, {
	ReactNativePhoneInputProps,
} from '@nandorojo/react-native-phone-input'

export type PhoneInputRef = {
	isValidNumber(): boolean
	getValue(): boolean
	focus(): void
	blur(): void
	getFlag(iso2: string): object
	getAllCountries(): object
	getPickerData(): object
	selectCountry(iso2: string): void
	getCountryCode(): string
	getISOCode(): string
}
export type PhoneInputProps = {
	value: string
	onChangePhoneNumber: (info: { phoneNumber: string }) => void
	textStyle?: StyleProp<TextStyle>
	inputRef?: MutableRefObject<ReactNativePhoneInput>
	inputProps?: TextInput['props']
	disabled?: boolean
	style?: TextInput['props']['style'] | CSSProperties
	/**
	 * **Mobile only** Props to customize the phoneInput. **Not** the same as `inputProps`, see that prop if you want to edit normal React Native `TextInput` props.
	 *
	 * For a list of all of them, see: https://www.npmjs.com/package/react-native-phone-input#configuration
	 */
	phoneInputProps?: Partial<ReactNativePhoneInputProps>
	// {
	// 	/**
	// 	 * Prop called to override the normal `onPressFlag` function. If set, the default flag picker will not open.
	// 	 *
	// 	 * Doesn't get called on web. Must be used with a custom `inputRef` prop
	// 	 *
	// 	 * @example
	// 	 * ```jsx
	// 	 * import React, { useRef } from 'react'
	// 	 * import { AuthFlow } from 'react-native-doorman'
	// 	 * import CountryPicker from 'react-native-country-picker'
	// 	 *
	// 	 * export default () => {
	// 	 *   const countryPicker = useRef()
	// 	 * 	 const inputRef = useRef()
	// 	 * 	 const [cca2, setCca2] = useState('us') // <-- country code
	// 	 *
	// 	 * 	 const selectCountry = useCallback((country) => {
	// 	 *     setCca2(country.cca2.toLowerCase())
	// 	 *   }, [])
	// 	 *
	// 	 *   return (
	// 	 *     <>
	// 	 *       <AuthFlow.PhoneScreen
	// 	 *         phoneInputProps={{
	// 	 *           onPressFlag: () =>  countryPicker.openModal()
	// 	 *         }}
	// 	 * 		   inputRef={inputRef}
	// 	 *       />
	// 	 * 		 <CountryPicker
	// 	 * 		 	ref={countryPicker}
	// 	 * 			translation="eng"
	// 	 * 			onChange={selectCountry}
	// 	 * 			cca2={cca2}
	// 	 * 		 />
	// 	 *    </>
	// 	 *   )
	// 	 * }
	// 	 * ```
	// 	 */
	// 	onPressFlag?: () => void
	// }
}
