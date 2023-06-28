Tapjoy React Native SDK
======================
React Native plugin for Tapjoy Offerwall SDK which supports Android & iOS platforms.

You can find the end user integration document [here](https://dev.tapjoy.com/en/reactnative-plugin/Quickstart). 

## Module Development
### Setup Environment
- Please check first [this general react-native setup document](https://reactnative.dev/docs/environment-setup).
- Nodejs version 18.15.0
- Ruby version 2.7.6
- Highly recommend to use [`asdf`](https://asdf-vm.com/) for the runtime management.
```shell
asdf install  #this command will install ruby, nodejs
```
- Yarn install
```shell
npm install --global yarn
```
- ios-deploy tool
```shell
brew install ios-deploy
```

### Install Dependency

`yarn bootstrap` command will install all dependencies including pod dependency.
```shell
yarn bootstrap
```
### Running Example

For iOS
```shell
yarn example ios
```
For Android
```shell
yarn example android
```

### Javascript
`./src/index.ts` is the typescript module entry point.

### iOS
You can find `./ios/TapjoyReactNativeSdk.swift` and `./ios/TapjoyReactNativeSdk.m` for the iOS bridge logic.

### Android
You can find `./android/src/main/java/com/tapjoy/tapjoyreactnativesdk/TapjoyReactNativeSdkModule.kt` for the Android bridge logic.

## Debugging

### Javascript
Press 'D' while the app is running. And select `Debug with Chrome`. Debug in Chrome inspector.

### iOS
In Xcode, use `Debug > Attach to Process` feature

### Android
In Android Studio, use `Run > Attach Debugger to Android Process` feature.

## Integration Document
[Tapjoy React Native SDK Integration Document](https://dev.tapjoy.com/en/reactnative-plugin/Quickstart).

## Resources
###  Environment setup
https://reactnative.dev/docs/environment-setup

### React Native iOS module
https://reactnative.dev/docs/native-modules-ios

### React Native Android Doc
https://reactnative.dev/docs/native-modules-android
