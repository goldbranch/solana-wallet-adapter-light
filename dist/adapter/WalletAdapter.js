"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletAdapterLight = exports.SignatureResult = exports.ErrorUserDeclinedSignIn = exports.ErrorAdapterNotConaintSignInMethod = void 0;
const tweetnacl_util_1 = require("tweetnacl-util");
class ErrorAdapterNotConaintSignInMethod extends Error {
}
exports.ErrorAdapterNotConaintSignInMethod = ErrorAdapterNotConaintSignInMethod;
;
class ErrorUserDeclinedSignIn extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ErrorUserDeclinedSignIn = ErrorUserDeclinedSignIn;
;
class SignatureResult {
    constructor(signature) {
        this.signature = signature;
    }
    toBase64() {
        return (0, tweetnacl_util_1.encodeBase64)(this.signature);
    }
}
exports.SignatureResult = SignatureResult;
class WalletAdapterLight {
    constructor(adapter) {
        this.adapter = adapter;
    }
    getWallet() {
        if (this.adapter.publicKey)
            return this.adapter.publicKey.toString();
        return "";
    }
    createSignData(input) {
        let domain = input.domain;
        if (!domain) {
            const uri = window.location.href;
            const currentUrl = new URL(uri);
            domain = currentUrl.host;
        }
        let signInData = {
            issuedAt: input.issuedAt ? input.issuedAt : new Date().toISOString(),
            chainId: input.chainId ? input.chainId : "mainnet",
            nonce: input.nonce,
            resources: input.resources ? input.resources : [],
            version: input.version ? input.version : "1",
            statement: input.statement ? input.statement : "Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.",
            domain: domain,
        };
        return signInData;
    }
    /**
     * Method not tested in a production environment.
     * @param input
     * @returns
     * @throws {ErrorUserDeclinedSignIn} If the user decline the sign in request
     * @throws {ErrorAdapterNotConaintSignInMethod} If the wallet adapter doesn't contain the signInMethod
     */
    signInWithSolana(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (("signIn" in this.adapter)) {
                let inputReal = this.createSignData(input);
                try {
                    const output = yield this.adapter.signIn(inputReal);
                    return output;
                }
                catch (error) {
                    throw new ErrorUserDeclinedSignIn(error);
                }
            }
            ;
            throw new ErrorAdapterNotConaintSignInMethod();
        });
    }
    /**
     * Sign a message with the solana blockchain
     * @param message Your message in string or Uint8Array to sign. If your message is in string, it will be encoded using the text encoder.
     * @returns The message signed. most of the time, you will need to convert the signature to base64 using toBase64() method on the result.
     * @throws {Error} If you provide a message with the wrong type
     * @throws {ErrorUserDeclinedSignIn} If the user decline the sign in request
     * @throws {ErrorAdapterNotConaintSignInMethod} If the wallet adapter doesn't contain the signInMethod
     */
    signMessageWithSolana(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (("signMessage" in this.adapter)) {
                try {
                    let messageToSign;
                    if (message instanceof Uint8Array) {
                        messageToSign = message;
                    }
                    else if (typeof message === "string") {
                        messageToSign = new TextEncoder().encode(message);
                    }
                    else {
                        throw new Error("Your message is not a string or Uint8Array");
                    }
                    const output = yield this.adapter.signMessage(messageToSign);
                    return new SignatureResult(output);
                }
                catch (error) {
                    throw new ErrorUserDeclinedSignIn(error);
                }
            }
            ;
            throw new ErrorAdapterNotConaintSignInMethod();
        });
    }
}
exports.WalletAdapterLight = WalletAdapterLight;
