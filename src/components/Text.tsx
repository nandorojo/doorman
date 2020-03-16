import React, { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Text as RNText, TextStyle, StyleSheet, StyleProp } from 'react-native'
import { useTextStyle } from '../hooks/use-style'

type Props = Omit<ComponentPropsWithoutRef<typeof RNText>, 'style'> & {
	style?: StyleProp<TextStyle>
	children: ReactNode
}

const styleProp = (base: TextStyle, added?: StyleProp<TextStyle>) => {
	if (Array.isArray(added)) return [base, ...added]

	return [base, added]
}

export const H1 = React.forwardRef<RNText, Props>(function H1(props, ref) {
	const { style, children, ...p } = props
	const textStyle = useTextStyle()
	return (
		<RNText {...p} style={styleProp(textStyle.h1, style)} ref={ref}>
			{children}
		</RNText>
	)
})

export const Paragraph = React.forwardRef<RNText, Props>(function Paragraph(
	props,
	ref
) {
	const { style, children, ...p } = props
	const textStyle = useTextStyle()
	return (
		<RNText {...p} style={styleProp(textStyle.subtitle, style)} ref={ref}>
			{children}
		</RNText>
	)
})

export const Text = {
	H1,
	Paragraph,
}

const styles = StyleSheet.create({
	h1: {
		fontSize: 32,
		fontWeight: '500',
		marginBottom: 12,
	},
	paragraph: {
		fontSize: 18,
		marginBottom: 8,
	},
})
