export function isTestPhoneNumber(phoneNumber?: string) {
	return !!(phoneNumber?.includes('+1555') && phoneNumber?.length === 12)
}
