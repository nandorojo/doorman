import React from 'react'
import { useNavigation } from 'react-navigation-hooks'
import { createStackNavigator } from 'react-navigation-stack'

import { AuthFlow } from 'react-native-doorman'

const Phone = () => {
	const { navigate } = useNavigation()

	return (
		<AuthFlow.PhoneScreen
			onSmsSuccessfullySent={() => {
				navigate('Confirm')
			}}
			renderHeader={null}
			message="This is a test app, so it can only sent to test numbers. Try sending a message to +15553155589"
		/>
	)
}

const Confirm = () => <AuthFlow.ConfirmScreen renderHeader={null} />

const AuthStack = createStackNavigator({
	Phone,
	Confirm,
})

export default AuthStack
