import { SolanaConnectLight } from "./adapter/wallet_connection/SolanaConnectLight"
import { SolanaConnectConfig } from "./adapter/wallet_connection/SolanaConnectConfig"
import { WalletAdapterLight, SignatureResult, ErrorAdapterNotConaintSignInMethod,ErrorUserDeclinedSignIn } from "./adapter/WalletAdapter";
import { Header, Signature } from "@web3auth/sign-in-with-solana";


export {
    SolanaConnectLight, 
    SolanaConnectConfig,
    Header, 
    Signature,

    ErrorUserDeclinedSignIn,
    ErrorAdapterNotConaintSignInMethod,
    SignatureResult,
    WalletAdapterLight, 
}

// console.log(module)

// module.exports = {
//     module: {
//         rules: [
//             {
//             test: /\.css$/,
//             use: ['style-loader', 'css-loader'],
//             }
//         ]
//     }
// }

