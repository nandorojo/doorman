import React, {
	useState,
	ComponentPropsWithoutRef,
	useRef,
	useEffect,
} from 'react'
import {
	Transitioning,
	Transition,
	TransitioningView,
} from 'react-native-reanimated'
import firebase from 'firebase/app'
import ControlledPhoneAuth from './PhoneAuth'
import ControlledConfirmPhone from './ConfirmPhone'
import { Appbar } from 'react-native-paper'
import { empty } from '../../utils/empty'
import { useDoormanTheme } from '../../hooks/use-doorman-theme'

type Props = {
	onCodeVerified?: ComponentPropsWithoutRef<
		typeof ControlledConfirmPhone
	>['onCodeVerified']
	// tintColor?: string
	phoneScreenProps?: Omit<
		ComponentPropsWithoutRef<typeof ControlledPhoneAuth>,
		'onSmsSuccessfullySent' | 'tintColor'
	>
	codeScreenProps?: Omit<
		ComponentPropsWithoutRef<typeof ControlledConfirmPhone>,
		'phoneNumber' | 'tintColor' | 'onCodeVerified'
	>
	/**
	 * Test phone numbers array.
	 *
	 * Example: ['+15555555555']
	 */
	testNumbers?: string[]
	headerProps?: ComponentPropsWithoutRef<typeof Appbar.Header>
	/**
	 * Text that shows in the header bar at the top for the phone auth screen. Default: `Sign In`
	 */
	phoneScreenHeaderText?: string
	/**
	 * Text that shows in the header bar at the top for the code verification screen. Default: `Confirm Number`
	 */
	codeScreenHeaderText?: string
}

export default function PhoneAuthStack(props: Props) {
	const [phoneNumber, setPhoneNumber] = useState('')
	const { tintColor } = useDoormanTheme()

	const {
		phoneScreenProps = empty.object,
		codeScreenProps = empty.object,
		testNumbers,
		headerProps = empty.object,
		phoneScreenHeaderText = 'Sign In',
		codeScreenHeaderText = 'Confirm Number',
	} = props

	const transitionRef = useRef<TransitioningView>(null)
	useEffect(() => {
		transitionRef.current?.animateNextTransition()
	}, [phoneNumber])

	return (
		<Transitioning.View
			ref={transitionRef}
			transition={
				<Transition.Together>
					{/* <Transition.Out type="fade" durationMs={100} /> */}
					<Transition.Change interpolation="easeInOut" />
					<Transition.In type="fade" />
				</Transition.Together>
			}
			style={{ flex: 1 }}
		>
			{!phoneNumber ? (
				<>
					<Appbar.Header
						{...headerProps}
						style={{ backgroundColor: tintColor }}
					>
						<Appbar.Content title={phoneScreenHeaderText} />
					</Appbar.Header>
					<ControlledPhoneAuth
						{...phoneScreenProps}
						onSmsSuccessfullySent={({ phoneNumber }) => {
							setPhoneNumber(phoneNumber)
						}}
						tintColor={tintColor}
						testNumbers={testNumbers}
					/>
				</>
			) : (
				<>
					<Appbar.Header style={{ backgroundColor: tintColor }}>
						<Appbar.BackAction onPress={() => setPhoneNumber('')} />
						<Appbar.Content title={codeScreenHeaderText} />
					</Appbar.Header>
					<ControlledConfirmPhone
						{...codeScreenProps}
						phoneNumber={phoneNumber}
						tintColor={tintColor}
						onCodeVerified={async info => {
							if (props?.onCodeVerified) props?.onCodeVerified?.(info)
							else {
								const { token } = info
								if (token) {
									// sign the user in
									const { user } = await firebase
										.auth()
										.signInWithCustomToken(token)
									console.log('oooooo', { user })

									// if the user doesn't exist in the DB yet, add the user to the DB
									// if (user && !(await doorman.doesUserExist({ uid: user.uid }))) {
									// 	// you might also use this logic to navigate to a new user onboarding screen
									// 	doorman.addUserToDb(user)
									// }
								} else {
									console.warn('oooo no token lol')
								}
							}
						}}
					/>
				</>
			)}
		</Transitioning.View>
	)

	// if (!phoneNumber)
	// 	return (
	// 		<>
	// 			<Appbar.Header style={{ backgroundColor: props?.tintColor }}>
	// 				<Appbar.Content title="Sign in" />
	// 			</Appbar.Header>
	// 			<ControlledPhoneAuth
	// 				{...phoneScreenProps}
	// 				onSmsSuccessfullySent={({ phoneNumber }) => {
	// 					console.log('seeeent', { phoneNumber })
	// 					setPhoneNumber(phoneNumber)
	// 				}}
	// 				tintColor={props?.tintColor}
	// 				testNumbers={testNumbers}
	// 			/>
	// 		</>
	// 	)

	// return (
	// 	<>
	// 		<Appbar.Header style={{ backgroundColor: props?.tintColor }}>
	// 			<Appbar.BackAction onPress={() => setPhoneNumber('')} />
	// 			<Appbar.Content title="Confirm number" />
	// 		</Appbar.Header>
	// 		<ControlledConfirmPhone
	// 			{...codeScreenProps}
	// 			phoneNumber={phoneNumber}
	// 			tintColor={props?.tintColor}
	// 			onCodeVerified={async info => {
	// 				if (props?.onCodeVerified) props?.onCodeVerified?.(info)
	// 				else {
	// 					const { token } = info
	// 					if (token) {
	// 						// sign the user in
	// 						const { user } = await firebase
	// 							.auth()
	// 							.signInWithCustomToken(token)
	// 						console.log('oooooo', { user })

	// 						// if the user doesn't exist in the DB yet, add the user to the DB
	// 						// if (user && !(await doorman.doesUserExist({ uid: user.uid }))) {
	// 						// 	// you might also use this logic to navigate to a new user onboarding screen
	// 						// 	doorman.addUserToDb(user)
	// 						// }
	// 					} else {
	// 						console.warn('oooo no token lol')
	// 					}
	// 				}
	// 			}}
	// 		/>
	// 	</>
	// )
}
