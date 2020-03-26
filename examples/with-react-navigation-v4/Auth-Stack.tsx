import { createAppContainer } from 'react-navigation'

import { createStackNavigator } from 'react-navigation-stack'
import { Splash, Phone, Confirm } from './Auth-Screens'

const AuthStack = createStackNavigator(
	{
		Splash,
		Phone,
		Confirm,
	},
	{
		defaultNavigationOptions: {
			headerTransparent: true,
			headerTintColor: 'white',
		},
	}
)

// create react navigation container
export const Auth = createAppContainer(AuthStack)
