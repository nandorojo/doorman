import React, { ReactNode, useMemo, ComponentPropsWithoutRef } from 'react'
import { View, ViewStyle, ScrollView, StyleProp } from 'react-native'
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
}

export function Page(props: Props) {
	const { children, style, containerProps = empty.object } = props
	const { phone } = useBreakpoints()
	const memoStyle = useMemo<StyleProp<ViewStyle>>(
		() => [{ alignSelf: 'center', maxWidth: !phone ? 800 : '100%' }, style],
		[style, phone]
	)

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			style={ScreenStyle.container}
			keyboardDismissMode="on-drag"
			{...containerProps}
		>
			<View style={memoStyle}>{children}</View>
		</ScrollView>
	)
}
