# Doorman 🚪🔥

> this is no longer actively maintained.

<img src="https://gblobscdn.gitbook.com/assets%2F-M2lDpPbJsb_nHH5pJG0%2F-M2ok9XEmtOjgeUUWgN1%2F-M2ole43XtPbBnxWTahm%2Fcarbon%20(39).png?alt=media&token=94d828b0-5f36-41b6-9f46-8f9ba057c3fe" />

<img src="https://gblobscdn.gitbook.com/assets%2F-M2lDpPbJsb_nHH5pJG0%2F-M2oEU_90gruqVYYM49_%2F-M2oEZ8mrfBxl3VrI17c%2Fjohannes-plenio-sPt5RIjKfpk-unsplash.jpg?alt=media&token=743c4f1d-9045-4d54-bb3a-852e45c6704f" />

## v6

Makes UI much more headless.

- Removes `react-native-elements`
- Removes `react-native-reanimated`
- Removes `react-native-redash`

Animations are gone from the button and input. The header and button need to be rendered custom now.

```sh
yarn add react-native-doorman@next
```

## v5

Made for Expo SDK 44.

`expo-linear-gradient` is now a peer dependency: `expo install expo-linear-gradient`

## v4

Made for Firebase v9.

## v2

If you're using v2, you need to use Firebase 8.

For Firebase v9, you need v4. This version also works with `react-native-firebase` via the `makeHeadless` function

## Headless Auth

If you want to use `firebase@9`, or React Native Firebase, use the `makeHeadless` function from `react-doorman`.

`doorman.native.ts`

```ts
import auth from '@react-native-firebase/auth'
import { makeHeadless } from 'react-doorman'

const initFirebase = () => {
  makeHeadless({
    signInWithCustomToken: async token => {
      return await auth().signInWithCustomToken(token)
    },
    signOut: () => {
      return auth().signOut()
    },
    idTokenListener: callback => {
      return auth().onIdTokenChanged(callback)
    },
  })
}

initFirebase()
```

Meanwhile, for Web, your `doorman.ts` file would have Firebase JS v9 initialization in it:

`doorman.ts`

```ts
import { initializeApp } from 'firebase/app'
initializeApp({
  // ...
})
```

And then import `doorman.ts` before you use `withPhoneAuth` or `DoormanProvider`:

```tsx
import './doorman'
import App from './app'

export default withPhoneAuth(App)
```

## Use your own server

Since Doorman's backend is no longer maintained, if you want to use the front-end, you need to override these functions.

### First, import Doorman

<img width="457" alt="Screen Shot 2021-12-02 at 1 46 50 PM" src="https://user-images.githubusercontent.com/13172299/145464670-845adbf2-84cb-44eb-ba6c-79cff0046fa5.png">

The following steps should make requests to your own server.

<img width="944" alt="Screen Shot 2021-12-02 at 1 41 48 PM" src="https://user-images.githubusercontent.com/13172299/145464723-c1e3de1a-ff53-46a8-80a5-557b6171e1ff.png">

<img width="895" alt="Screen Shot 2021-12-02 at 1 43 10 PM" src="https://user-images.githubusercontent.com/13172299/145464744-52753b37-9ad4-488e-b5b5-0bdde3b1f9fa.png">

Your server should use Twilio OTP and Firebase Admin to verify phone numbers, create an auth user (if it doesn't yet exist on Firebase), and then return the auth token.

<img width="915" alt="IMG_4869" src="https://user-images.githubusercontent.com/13172299/145464889-0f53e94b-f673-4595-9aad-0d2d0836a546.png">

<img width="904" alt="Screen Shot 2021-12-09 at 2 32 38 PM" src="https://user-images.githubusercontent.com/13172299/145464956-ad24bd85-f78b-4c5c-adbb-983f83acc583.png">

### React 17 Usage

First, be sure to properly configure `patch-package`.

You'll need to patch `react-native-phone-input` to use React 17. Add this to your `patches` folder:

`patches/react-native-phone-input+0.2.4.patch`

```diff
diff --git a/node_modules/react-native-phone-input/lib/countryPicker.js b/node_modules/react-native-phone-input/lib/countryPicker.js
index 46659fc..805268d 100644
--- a/node_modules/react-native-phone-input/lib/countryPicker.js
+++ b/node_modules/react-native-phone-input/lib/countryPicker.js
@@ -33,7 +33,7 @@ export default class CountryPicker extends Component {
     this.onValueChange = this.onValueChange.bind(this);
   }

-  componentWillReceiveProps(nextProps) {
+  UNSAFE_componentWillReceiveProps(nextProps) {
     this.setState({
       selectedCountry: nextProps.selectedCountry,
     });
diff --git a/node_modules/react-native-phone-input/lib/index.js b/node_modules/react-native-phone-input/lib/index.js
index 75630fd..8f54405 100644
--- a/node_modules/react-native-phone-input/lib/index.js
+++ b/node_modules/react-native-phone-input/lib/index.js
@@ -38,13 +38,13 @@ export default class PhoneInput extends Component {
     };
   }

-  componentWillMount() {
+  UNSAFE_componentWillMount() {
     if (this.props.value) {
       this.updateFlagAndFormatNumber(this.props.value);
     }
   }

-  componentWillReceiveProps(nextProps) {
+  UNSAFE_componentWillReceiveProps(nextProps) {
     const { value, disabled } = nextProps;
     this.setState({ disabled });
```

## 🧐 What is Doorman?

Doorman lets React Native developers add phone authentication to their apps with ease. It works perfectly with **Firebase Auth and Expo**.

**We handle the backend and provide UI components** 😇 for Firebase phone auth. That means you can spend less time worrying about the auth flow, and more time building your actual features.

Our mission is to help you create **incredible apps** that **your users will love**. And that all starts with the first impression they make with your app – your auth flow.

## 😎 With Doorman, you can...

- 👟Build a phone authentication flow in a few lines of code.

- 💅Fully customize the design to fit your app.

* 👩‍💻Avoid maintaining a complex server.

* 🔥Keep using Firebase Auth with Expo.

* 🕺Create a native auth experience, without web views or popups.

## 👾 Docs

We have great [documentation](https://docs.doorman.cool). Check out our [setup guide](https://docs.doorman.cool/introduction/getting-started).

## 🤖 Examples

- See our [examples repo](https://github.com/nandorojo/doorman-examples)

## 👩‍💻 Website

Check out [doorman.cool](https://doorman.cool).

## 🚨 For issues

Please use this repository to notify us of any issues and track ones we're working on.

You can also live chat us on [our website](https://doorman.cool) with any tight concerns. That said, we prefer that you make an issue here so that everyone else can fix problems you might have.
