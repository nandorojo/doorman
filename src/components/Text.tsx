import React, { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Text as RNText, TextStyle, StyleProp } from 'react-native'
import { useTextStyle } from '../hooks/use-style'

type Props = Omit<ComponentPropsWithoutRef<typeof RNText>, 'style'> & {
	style?: StyleProp<TextStyle>
	children: ReactNode
	centered?: boolean
}

const styleProp = (base: TextStyle, added?: StyleProp<TextStyle>) => {
	if (Array.isArray(added)) return [base, ...added]

	return [base, added]
}

export const H1 = React.forwardRef<RNText, Props>(function H1(props, ref) {
	const { style, children, centered, ...p } = props
	const textStyle = useTextStyle()
	return (
		<RNText
			{...p}
			style={styleProp(textStyle.h1, [
				style,
				centered && { textAlign: 'center' },
			])}
			ref={ref}
		>
			{children}
		</RNText>
	)
})

export const Paragraph = React.forwardRef<RNText, Props>(function Paragraph(
	props,
	ref
) {
	const { style, children, centered, ...p } = props
	const textStyle = useTextStyle()
	return (
		<RNText
			{...p}
			style={styleProp(textStyle.subtitle, [
				style,
				centered && { textAlign: 'center' },
			])}
			ref={ref}
		>
			{children}
		</RNText>
	)
})

export const Text = {
	H1,
	Paragraph,
}
