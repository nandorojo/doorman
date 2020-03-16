import { Dimensions } from 'react-native'

const Sizes = {
	sm: 768,
	md: 992,
	lg: 1170,
}

export const useBreakpoints = () => {
	const { width } = Dimensions.get('window')
	const phone = width < Sizes.sm
	const tablet = width < Sizes.lg
	const desktop = width > Sizes.lg
	return {
		phone,
		tablet,
		desktop,
	}
}
