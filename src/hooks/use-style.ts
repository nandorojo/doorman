import { TextStyle } from '../style/text'
import { useBreakpoints } from './use-breakpoints'
import { useMemo } from 'react'
import { Platform } from 'react-native'

export const useTextStyle = () => {
	const { phone } = useBreakpoints()

	const style = useMemo<typeof TextStyle>(
		() => ({
			...TextStyle,
			h1: {
				...TextStyle.h1,
				// fontSize: phone ? TextStyle.h1.fontSize : 32,
			},
			subtitle: {
				...TextStyle.subtitle,
				// fontSize: 18,
			},
			disclaimer: {
				...TextStyle.disclaimer,
				// fontSize: 18,
			},
		}),
		[]
	)
	if (Platform.OS !== 'web') return TextStyle

	return style
}
