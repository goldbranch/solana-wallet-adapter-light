"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletAdapterLight = exports.SignatureResult = exports.ErrorAdapterNotConaintSignInMethod = exports.ErrorUserDeclinedSignIn = exports.Signature = exports.Header = exports.SolanaConnectLight = void 0;
const SolanaConnectLight_1 = require("./adapter/wallet_connection/SolanaConnectLight");
Object.defineProperty(exports, "SolanaConnectLight", { enumerable: true, get: function () { return SolanaConnectLight_1.SolanaConnectLight; } });
const WalletAdapter_1 = require("./adapter/WalletAdapter");
Object.defineProperty(exports, "WalletAdapterLight", { enumerable: true, get: function () { return WalletAdapter_1.WalletAdapterLight; } });
Object.defineProperty(exports, "SignatureResult", { enumerable: true, get: function () { return WalletAdapter_1.SignatureResult; } });
Object.defineProperty(exports, "ErrorAdapterNotConaintSignInMethod", { enumerable: true, get: function () { return WalletAdapter_1.ErrorAdapterNotConaintSignInMethod; } });
Object.defineProperty(exports, "ErrorUserDeclinedSignIn", { enumerable: true, get: function () { return WalletAdapter_1.ErrorUserDeclinedSignIn; } });
const sign_in_with_solana_1 = require("@web3auth/sign-in-with-solana");
Object.defineProperty(exports, "Header", { enumerable: true, get: function () { return sign_in_with_solana_1.Header; } });
Object.defineProperty(exports, "Signature", { enumerable: true, get: function () { return sign_in_with_solana_1.Signature; } });
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
