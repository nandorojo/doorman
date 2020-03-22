// import React, { FunctionComponent } from 'react'
// import { TouchableOpacity } from 'react-native-gesture-handler'
// import TrueText from '../../TrueText'
// import useColors from '../../../hooks/useColors'
// import { StyleSheet, ActivityIndicator, View } from 'react-native'
// import StyleGuidelines from '../../../styles'
// import { getBottomSpace } from '../../../styles/MediaQueries'
// import { BlurView } from 'expo-blur'
// import useKeyboardOpen from '../../../hooks/useKeyboardOpen'

// const AuthButton: FunctionComponent<{
// 	onPress: () => void
// 	title?: string
// 	loading?: boolean
// 	disabled?: boolean
// }> = props => {
// 	const { colors, theme } = useColors()
// 	const keyboardOpen = useKeyboardOpen()
// 	const paddingBottom = keyboardOpen
// 		? padding * 3
// 		: padding * 3 + getBottomSpace()
// 	const textOpacity = props.loading ? 0 : 1
// 	return (
// 		<View style={{ opacity: props.disabled ? 0.25 : 1 }}>
// 			<TouchableOpacity
// 				disabled={!!props.disabled}
// 				onPress={props.onPress}
// 				style={[styles.button, { paddingBottom }]}
// 			>
// 				<BlurView
// 					intensity={50}
// 					tint={theme}
// 					style={StyleSheet.absoluteFillObject}
// 				/>
// 				<TrueText
// 					style={[
// 						styles.buttonText,
// 						{ color: colors.background, opacity: textOpacity },
// 					]}
// 				>
// 					{props.title || props.children}
// 				</TrueText>
// 				<View
// 					style={[
// 						StyleSheet.absoluteFillObject,
// 						{
// 							opacity: props.loading ? 1 : 0,
// 							alignItems: 'center',
// 							justifyContent: 'center',
// 						},
// 					]}
// 				>
// 					{!!props.loading && (
// 						<ActivityIndicator size="large" color={colors.label} />
// 					)}
// 				</View>
// 			</TouchableOpacity>
// 		</View>
// 	)
// }

// export default AuthButton

// const { padding } = StyleGuidelines

// const styles = StyleSheet.create({
// 	button: {
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 		paddingHorizontal: padding * 2,
// 		paddingTop: padding * 3,
// 	},
// 	buttonText: {
// 		fontWeight: 'bold',
// 		fontSize: 25,
// 		textAlign: 'center',
// 	},
// })
