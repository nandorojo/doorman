import React from 'react'
import { useNavigation } from 'react-navigation-hooks'
import Constants from 'expo-constants'
import {
	AuthFlow,
	ScreenBackground,
	H1,
	Paragraph,
	Page,
} from 'react-native-doorman'
import { Button, View, StyleSheet } from 'react-native'

export const Splash = () => {
	const { navigate } = useNavigation()

	return (
		<Page style={styles.page} background={() => <ScreenBackground />}>
			<H1
				style={styles.text}
			>{`Welcome to Doorman's React Navigation v4 test app`}</H1>
			<Paragraph
				style={styles.text}
			>{`😇 Doorman brings Firebase phone auth to Expo apps, effortlessly.`}</Paragraph>
			<Paragraph
				style={styles.text}
			>{`👀 See App.tsx & Auth-Screens.tsx to edit this flow.`}</Paragraph>
			<Paragraph
				style={styles.text}
			>{`🚪 Also, our website: doorman.cool`}</Paragraph>
			<View style={styles.button}>
				<Button
					title="Sign In With Phone Number"
					color="white"
					onPress={() => navigate('Phone')}
				/>
			</View>
		</Page>
	)
}

export const Phone = () => {
	const { navigate } = useNavigation()

	return (
		<AuthFlow.PhoneScreen
			onSmsSuccessfullySent={() => {
				navigate('Confirm')
			}}
			renderHeader={null}
			containerStyle={styles.page}
		/>
	)
}

export const Confirm = () => (
	<AuthFlow.ConfirmScreen renderHeader={null} containerStyle={styles.page} />
)

const styles = StyleSheet.create({
	page: {
		paddingTop: 50 + Constants.statusBarHeight,
	},
	text: { color: 'white', textAlign: 'center', marginBottom: 24 },
	button: {
		marginTop: 30,
		borderTopWidth: 1,
		borderColor: '#ffffff50',
		paddingTop: 30,
	},
})
