import React, { ReactNode, useMemo, ComponentPropsWithoutRef } from 'react'
import {
	View,
	ViewStyle,
	ScrollView,
	StyleProp,
	StyleSheet,
	KeyboardAvoidingView,
} from 'react-native'
import { useBreakpoints } from '../hooks/use-breakpoints'
import { empty } from '../utils/empty'
import { ScreenStyle } from '../style/screen'

type Props = {
	children: ReactNode
	style?: ViewStyle
	/**
	 * Props for the scroll view containing the whole screen. For styles, see `containerStyle`
	 */
	containerProps?: Omit<ComponentPropsWithoutRef<typeof ScrollView>, 'style'>
	header?: () => ReactNode
	background?: () => ReactNode
	disableKeyboardHandler?: boolean
	footer?: () => ReactNode
}

export function Page(props: Props) {
	const {
		children,
		style,
		containerProps = empty.object,
		header,
		background,
		disableKeyboardHandler,
		footer,
	} = props
	const { phone } = useBreakpoints()
	const memoStyle = useMemo<StyleProp<ViewStyle>>(
		() => [
			{ alignSelf: 'center', maxWidth: !phone ? 800 : '100%', paddingTop: 16 },
			style,
		],
		[style, phone]
	)

	const Container = disableKeyboardHandler ? View : KeyboardAvoidingView

	return (
		<Container behavior="padding" style={styles.container}>
			{background?.()}
			{header?.()}
			<ScrollView
				keyboardShouldPersistTaps="handled"
				style={ScreenStyle.container}
				keyboardDismissMode="on-drag"
				// scrollEnabled={false}
				bounces={false}
				// overScrollMode="never"
				{...containerProps}
			>
				<View style={memoStyle}>{children}</View>
			</ScrollView>
			{footer?.()}
		</Container>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})
