import { ReactNode } from 'react'
import { TextStyle } from 'react-native'
import { InputProps } from 'chat/lib/typescript/components/Chat/types'

export type CommonScreenProps = {
	/**
	 * Default: `left`.
	 *
	 * Set to `center` if you want the screen text and input to be centered by default.
	 */
	textAlign?: TextStyle['alignItems']
	headerColor?: string
	messageColor?: string
	/**
	 * Either a string or array of strings.
	 *
	 * If an array is passed, it will render a gradient.
	 *
	 * Make sure to memoize this prop if you're using a gradient using `useMemo`.
	 *
	 * @example
	 * ```
	 * const backgroundColor = useMemo(() => ['blue', 'green' ],[])
	 * <Phone.Stack backgroundColor={backgroundColor} />
	 * ```
	 */
	backgroundColor?: string | string[]
	/**
	 * A function that returns a custom component that will replace the default background color.
	 *
	 * Note that this View should have the `StyleSheet.absoluteFill` in its styles so that it covers the entire screen.
	 */
	renderBackground?: () => ReactNode
	/**
	 * Function that renders a custom TextInput component
	 */
	renderInput?: (info: { onChangeText: string; text: string }) => ReactNode
	/**
	 * Background color for the text input
	 */
	inputBackgroundColor?: string
	/**
	 * Text color for the text input
	 */
	inputTextColor?: string
	/**
	 * Input style. Can either be a style prop directly, or a pure function that receives the default styles as its only argument and returns your updated styles.
	 */
	inputStyle?:
		| InputProps['style']
		| ((defaultStyle: InputProps['style']) => InputProps['style'])

	/**
	 * Define which premade style type for the input you would like.
	 *
	 * `elevated` has dropshadow and a colored background that contrasts with the screen background.
	 * `flat` has a transparent background and is more subtle.
	 */
	inputType?: 'elevated' | 'flat'
}
