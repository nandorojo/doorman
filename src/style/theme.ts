import { empty } from '../utils/empty'
import { TextStyle } from 'react-native'

type Theme = {
	tintColor: string
	buttonTextColor: string
	inputBackgroundColor: string
	inputTextColor: string
	textColor: string
	grayColor: string
	backgroundColor: string
	backgroundGradient: string[]
	textAlign: TextStyle['textAlign']
}

export const theme = (
	customTheme: Partial<Theme> = empty.object
): Partial<Theme> => {
	return {
		tintColor: 'blue',
		buttonTextColor: 'white',
		inputBackgroundColor: 'gray',
		backgroundColor: 'white',
		grayColor: 'gray',
		inputTextColor: 'black',
		textColor: 'black',
		backgroundGradient: [],
		textAlign: 'center',
		...customTheme,
	}
}
