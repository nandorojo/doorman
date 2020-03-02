"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let configuration = {
    hasInitialized: false,
    endpoint: 'https://expophone.com',
};
function configurationHasKey(config) {
    return !!config.hasInitialized;
}
const Constants = {
    signIn: 'signIn',
    verify: 'verify',
};
exports.initialize = ({ key }) => {
    configuration = Object.assign(Object.assign({}, configuration), { key, hasInitialized: true });
};
exports.initializeWithCustomEndpoint = (endpoint) => {
    configuration = Object.assign(Object.assign({}, configuration), { hasInitialized: true, endpoint });
};
const getEndpoint = (ending) => {
    if (configurationHasKey(configuration)) {
        return `${configuration.endpoint}/${configuration.key}/${(ending !== null && ending !== void 0 ? ending : '')}`;
    }
    else {
        return `${configuration.endpoint}/${(ending !== null && ending !== void 0 ? ending : '')}`;
    }
};
exports.signInWithPhoneNumber = async (info) => {
    try {
        if (!configuration.hasInitialized) {
            throw new Error('initialize() or initializeWithCustomEndpoint() method was never called. Call one of these functions at the root of your app, usually in App.js, to use phone auth.');
        }
        const response = await fetch(`${getEndpoint(Constants.signIn)}`, {
            body: JSON.stringify({
                phoneNumber: info.phoneNumber,
            }),
            method: 'POST',
        }).then(r => r.json());
        return response;
    }
    catch (e) {
        console.error('Error using signInWithPhoneNumber: ', e);
        return { error: e, success: false };
    }
};
exports.verifyCode = async ({ code, }) => {
    try {
        if (!configuration.hasInitialized) {
            throw new Error('initialize() or initializeWithCustomEndpoint() method was never called. Call one of these functions at the root of your app, usually in App.js, to use phone auth.');
        }
        const response = await fetch(`${getEndpoint(Constants.verify)}`, {
            body: JSON.stringify({
                code,
            }),
            method: 'POST',
        }).then(res => res.json());
        return response;
    }
    catch (e) {
        console.error('Error using verifyToken: ', e);
        return { token: null, success: false };
    }
};
