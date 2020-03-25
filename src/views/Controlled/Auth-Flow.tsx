import React, {
	ComponentPropsWithoutRef,
	useRef,
	useEffect,
	useCallback,
} from 'react'
import {
	Transitioning,
	Transition,
	TransitioningView,
} from 'react-native-reanimated'
import ControlledPhoneAuth from './Controlled-Phone-Screen'
import ControlledConfirmPhone from './Controlled-Confirm-Screen'
import { empty } from '../../utils/empty'
import { useDoormanTheme } from '../../hooks/use-doorman-theme'
import { CommonScreenProps } from '../types'
import { StyleSheet, Platform } from 'react-native'
import { useAuthFlowState } from '../../hooks/use-auth-flow-state'

type Props = {
	phoneScreenProps?: Omit<
		ComponentPropsWithoutRef<typeof ControlledPhoneAuth>,
		'onSmsSuccessfullySent'
	>
	confirmScreenProps?: Omit<
		ComponentPropsWithoutRef<typeof ControlledConfirmPhone>,
		'tintColor' | 'onCodeVerified'
	>
	onCodeVerified?: ComponentPropsWithoutRef<
		typeof ControlledConfirmPhone
	>['onCodeVerified']
	onSmsSuccessfullySent?: ComponentPropsWithoutRef<
		typeof ControlledPhoneAuth
	>['onSmsSuccessfullySent']
} & CommonScreenProps

export function AuthFlow(props: Props) {
	const { tintColor } = useDoormanTheme()
	const { setCodeScreenReady, ready } = useAuthFlowState()

	const {
		phoneScreenProps = empty.object,
		confirmScreenProps = empty.object,
		onCodeVerified,
		onSmsSuccessfullySent: onSent,
		...otherProps
	} = props

	const commonScreenProps: CommonScreenProps = {
		...otherProps,
	}

	const transitionRef = useRef<TransitioningView>(null)
	useEffect(() => {
		if (Platform.OS !== 'web') transitionRef.current?.animateNextTransition()
	}, [ready])

	const sendCallback = useRef(onSent)
	useEffect(() => {
		sendCallback.current = onSent
	})

	const onSmsSuccessfullySent = useCallback(
		(info: { phoneNumber: string }) => {
			sendCallback.current?.(info)
			setCodeScreenReady(true)
		},
		[setCodeScreenReady]
	)
	const onGoBack = useCallback(() => setCodeScreenReady(false), [
		setCodeScreenReady,
	])

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
			style={styles.container}
		>
			{!ready ? (
				<>
					<ControlledPhoneAuth
						{...commonScreenProps}
						{...phoneScreenProps}
						onSmsSuccessfullySent={onSmsSuccessfullySent}
						tintColor={tintColor}
					/>
				</>
			) : (
				<>
					<ControlledConfirmPhone
						{...commonScreenProps}
						{...confirmScreenProps}
						onGoBack={onGoBack}
						onCodeVerified={onCodeVerified}
					/>
				</>
			)}
		</Transitioning.View>
	)
}

AuthFlow.PhoneScreen = ControlledPhoneAuth
AuthFlow.ConfirmScreen = ControlledConfirmPhone

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})
