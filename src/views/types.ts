import { ReactNode } from 'react'
import { TextStyle, ViewStyle } from 'react-native'

export type CommonScreenProps = {
  /**
   * If `true`, the default app wrapper will no longer be a KeyboardAvoidingView. Note that this will face bugs if you have `buttonType` set to `fixed-bottom`.
   *
   * 🚨**Note:** 🚨 If you are using React Navigation's stack navigator for this screen, you may be facing bugs with the KeyboardAvoidingView.
   *
   * You have two options to fix it: 1) set the stactk's [headerTransparent](https://reactnavigation.org/docs/stack-navigator/#headertransparent) option to true, or set this prop to `true`. If you do not have `headerTransparent` set to true, then you will face bugs with a KeyboardAvoidingView.
   */
  disableKeyboardHandler?: boolean
  /**
   * Default: `left`.
   *
   * Set to `center` if you want the screen text and input to be centered by default.
   */
  textAlign?: TextStyle['textAlign']
  /**
   * The default text color. If you want more granular customization, see `titleColor`, `disclaimerColor` and `messageColor`.
   *
   * Default: `white`
   */
  textColor?: TextStyle['color']
  /**
   * Background color for the header at the top of the screen.
   *
   * Default: `transparent`.
   *
   * If you want a lot of customization, see the `renderHeader` prop.
   */
  headerBackgroundColor?: string
  /**
   * Optionally render a custom component in place of the header title. This useful if you want to render your logo, for instance.
   */
  renderHeaderTitle?: () => ReactNode
  /**
   * Optional custom color for the text and back icon in the header. If not set, it defaults to the value you set for the `textColor` prop.
   */
  headerTintColor?: string
  /**
   * (Optional) custom props to be passed to the header.
   *
   * See the `react-native-elements` docs for the `Header` props: https://react-native-elements.github.io/react-native-elements/docs/header.html
   */
  // headerProps?: ComponentPropsWithoutRef<typeof Header>
  /**
   * Custom styles for the title in the header.
   *
   * If you just want to edit the text color, see `headerTintColor`.
   */
  headerTitleStyle?: TextStyle
  /**
   * Style for the title of a screen (different from `headerTitleStyle`)
   */
  titleStyle?: TextStyle
  /**
   * Style for the message of a screen, under the title.
   */
  messageStyle?: TextStyle
  /**
   * Either a string or array of strings.
   *
   * If an array is passed, it will render a gradient.
   *
   * Make sure to memoize this prop if you're using a gradient using `useMemo`.
   * Or, place the array outside of the component code.
   *
   * @example
   * ```es6
   * export default () => {
   *   const backgroundColor = useMemo(() => ['blue', 'green' ],[])
   *   return <Phone.Stack backgroundColor={backgroundColor} {...otherProps} />
   * }
   * ```
   */
  backgroundColor?: string | string[]
  /**
   * A function that returns a custom component that will replace the default background.
   *
   * This View should have the `StyleSheet.absoluteFill` in its styles so that it covers the entire screen.
   */
  renderBackground?: () => ReactNode
  /**
   * Background color for the text input
   */
  inputBackgroundColor?: string
  /**
   * Text color for the text input
   */
  inputTextColor?: string
  /**
   * Define which premade style type for the input you would like.
   *
   * `elevated` has dropshadow and a colored background that contrasts with the screen background.
   * `flat` has a transparent background and is more subtle.
   */
  inputType?: 'elevated' | 'flat'
  /**
   * Optional function that renders a custom header. If `null`, will not return a header.
   *
   * Receives one argument: a dictionary with a `screen` field, which can be `code` or `phone`. This tells you which screen the header is currently on.
   *
   * @param info.screen - 'code' or 'phone', indicating which screen the header is currently being rendered on. Also receives a `goBack` function, which triggers the code screen to go back to the phone screen.
   */
  renderHeader?:
    | null
    | ((screen: { screen: 'code' | 'phone'; goBack: () => void }) => ReactNode)
  /**
   * (Optional) Style the view that contains the text input.
   */
  inputContainerStyle?: ViewStyle
}
