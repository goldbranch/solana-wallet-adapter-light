import { Adapter } from "@solana/wallet-adapter-base";
import type { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features';

import { encodeBase64 } from "tweetnacl-util";

export class ErrorAdapterNotConaintSignInMethod extends Error {
};
export class ErrorUserDeclinedSignIn extends Error {
    constructor(message: string) {
        super(message);
    }
};

export class SignatureResult {
    public readonly signature: Uint8Array;

    constructor(signature: Uint8Array) {
        this.signature = signature;
    }

    toBase64(): string {
        return encodeBase64(this.signature);
    }
}


export class WalletAdapterLight {
    public adapter: Adapter;


    constructor(adapter: Adapter) {
        this.adapter = adapter;
    }

    public getWallet(): string {
        if (this.adapter.publicKey) 
            return this.adapter.publicKey.toString();
        return "";
    }

    private createSignData(input: SolanaSignInInput): SolanaSignInInput {
        let domain = input.domain;
        if (!domain) {
            const uri = window.location.href;
            const currentUrl = new URL(uri);
            domain = currentUrl.host;
        }

        let signInData: SolanaSignInInput = {
            issuedAt: input.issuedAt?input.issuedAt:new Date().toISOString(),
            
            chainId: input.chainId?input.chainId:"mainnet",
            nonce: input.nonce,
            resources: input.resources?input.resources:[],
            version: input.version?input.version:"1",
            statement: input.statement?input.statement:"Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.",
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
    public async signInWithSolana(input: SolanaSignInInput): Promise<SolanaSignInOutput> {
        if (("signIn" in this.adapter)) {
            let inputReal = this.createSignData(input);
            try {
                const output: SolanaSignInOutput = await this.adapter.signIn(inputReal);
                return output;
            } catch (error) {
                throw new ErrorUserDeclinedSignIn(error as string);
            }
        };
        throw new ErrorAdapterNotConaintSignInMethod();
    }

    /**
     * Sign a message with the solana blockchain
     * @param message Your message in string or Uint8Array to sign. If your message is in string, it will be encoded using the text encoder.
     * @returns The message signed. most of the time, you will need to convert the signature to base64 using toBase64() method on the result.
     * @throws {Error} If you provide a message with the wrong type
     * @throws {ErrorUserDeclinedSignIn} If the user decline the sign in request
     * @throws {ErrorAdapterNotConaintSignInMethod} If the wallet adapter doesn't contain the signInMethod
     */
    public async signMessageWithSolana(message: string | Uint8Array): Promise<SignatureResult> {
        if (("signMessage" in this.adapter)) {
            try {
                let messageToSign: Uint8Array;
                if (message instanceof Uint8Array) {
                    messageToSign = message;
                } else if (typeof message  === "string") {
                    messageToSign = new TextEncoder().encode(message);
                } else {
                    throw new Error("Your message is not a string or Uint8Array");
                }
                const output = await this.adapter.signMessage(messageToSign);
                return new SignatureResult(output);
            } catch (error) {
                throw new ErrorUserDeclinedSignIn(error as string);
            }
        };
        throw new ErrorAdapterNotConaintSignInMethod();
    }
}