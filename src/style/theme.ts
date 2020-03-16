import { empty } from '../utils/empty'

type Theme = {
	tintColor: string
	buttonTextColor: string
	inputBackgroundColor: string
	inputTextColor: string
	textColor: string
	grayColor: string
	backgroundColor: string
	backgroundGradient: string[]
}

export const theme = (customTheme: Partial<Theme> = empty.object): Theme => {
	return {
		tintColor: 'blue',
		buttonTextColor: 'white',
		inputBackgroundColor: 'gray',
		backgroundColor: 'white',
		grayColor: 'gray',
		inputTextColor: 'black',
		textColor: 'black',
		backgroundGradient: [],
		...customTheme,
	}
}
