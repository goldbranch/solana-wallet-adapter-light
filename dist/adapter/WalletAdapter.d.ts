import { Adapter } from "@solana/wallet-adapter-base";
import type { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features';
export declare class ErrorAdapterNotConaintSignInMethod extends Error {
}
export declare class ErrorUserDeclinedSignIn extends Error {
    constructor(message: string);
}
export declare class SignatureResult {
    readonly signature: Uint8Array;
    constructor(signature: Uint8Array);
    toBase64(): string;
}
export declare class WalletAdapterLight {
    adapter: Adapter;
    constructor(adapter: Adapter);
    getWallet(): string;
    private createSignData;
    /**
     * Method not tested in a production environment.
     * @param input
     * @returns
     * @throws {ErrorUserDeclinedSignIn} If the user decline the sign in request
     * @throws {ErrorAdapterNotConaintSignInMethod} If the wallet adapter doesn't contain the signInMethod
     */
    signInWithSolana(input: SolanaSignInInput): Promise<SolanaSignInOutput>;
    /**
     * Sign a message with the solana blockchain
     * @param message Your message in string or Uint8Array to sign. If your message is in string, it will be encoded using the text encoder.
     * @returns The message signed. most of the time, you will need to convert the signature to base64 using toBase64() method on the result.
     * @throws {Error} If you provide a message with the wrong type
     * @throws {ErrorUserDeclinedSignIn} If the user decline the sign in request
     * @throws {ErrorAdapterNotConaintSignInMethod} If the wallet adapter doesn't contain the signInMethod
     */
    signMessageWithSolana(message: string | Uint8Array): Promise<SignatureResult>;
}
