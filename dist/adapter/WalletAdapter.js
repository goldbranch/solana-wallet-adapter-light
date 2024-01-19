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
exports.SolanaConnectLight = exports.OpenState = void 0;
const core_1 = require("@wallet-standard/core");
const wallet_standard_wallet_adapter_base_1 = require("@solana/wallet-standard-wallet-adapter-base");
const WalletStyle_1 = require("./WalletStyle");
const WalletHtmlGenerator_1 = require("./WalletHtmlGenerator");
const MODAL_ID = "swal-modal";
const CLOSE_BTN_ID = "swal-close-btn";
const ADAPTER_LIST_ID = "swal-adapter-list";
const CONNECTION_EVENT = "swal-connect-event";
const VISIBILITY_EVENT = "swal-visibility-event";
var OpenState;
(function (OpenState) {
    OpenState[OpenState["Open"] = 0] = "Open";
    OpenState[OpenState["Close"] = 1] = "Close";
})(OpenState || (exports.OpenState = OpenState = {}));
/* eslint-disable fp/no-this, fp/no-mutation, fp/no-class */
class SolanaConnectLight {
    constructor(config) {
        this._toggleModalCallback = (element, state) => {
            switch (state) {
                case OpenState.Open:
                    element.style.display = "block";
                    setTimeout(() => {
                        element.classList.add('swal-modal-fade-in');
                    }, 1);
                    break;
                case OpenState.Close:
                    element.classList.remove('swal-modal-fade-in');
                    setTimeout(() => {
                        element.style.display = "none";
                    }, 500);
                    break;
            }
        };
        this._addAdapterCallback = WalletHtmlGenerator_1.createHtmlAdapter;
        this._generateStyleFunction = () => {
            const styleElement = document.createElement('style');
            styleElement.textContent = WalletStyle_1.styleText;
            document.head.appendChild(styleElement);
        };
        this.wallets = (0, core_1.getWallets)();
        this.isOpen = false;
        this.debug = (config === null || config === void 0 ? void 0 : config.debug) || false;
        this._adapterByName = new Map();
        this.activeWallet = null;
        if (config === null || config === void 0 ? void 0 : config.addAdapterCallback)
            this._addAdapterCallback = config === null || config === void 0 ? void 0 : config.addAdapterCallback;
        if (config === null || config === void 0 ? void 0 : config.toggleModalCallback)
            this._toggleModalCallback = config.toggleModalCallback;
        if (!config || config.generateHtml === undefined || config.generateHtml)
            (0, WalletHtmlGenerator_1.createHtmlBase)();
        if (!config || (config === null || config === void 0 ? void 0 : config.generateStyle) === undefined || config.generateStyle)
            this._generateStyleFunction();
        const modalTmp = document.getElementById(MODAL_ID);
        const closeTmp = document.getElementById(CLOSE_BTN_ID);
        const listTmp = document.getElementById(ADAPTER_LIST_ID);
        if (!listTmp || !closeTmp || !modalTmp) {
            throw new Error("One or more of these html element with these id is not found in the dom: [swal-modal, swal-close-btn, swal-adapter-list]."
                + "If you use property generateHtml=false, make sur to add the base html structure in your main HTML. You can find it on the readme page here https://github.com/Olive-fr/solana-wallet-adapter-light.");
        }
        this._modal = modalTmp;
        this._closeBtn = closeTmp;
        this._adapterList = listTmp;
        this._closeBtn.addEventListener("click", (e) => {
            this.showMenu(false);
        });
        const processWallet = (wl) => {
            if (this._adapterByName.has(wl.name)) {
                this.log("wallet duplicate:", wl.name);
                return;
            }
            this._adapterByName.set(wl.name, wl);
            let elementsCallback = this._addAdapterCallback(wl);
            elementsCallback.elementToBindConnectAction.addEventListener("click", (e) => (() => __awaiter(this, void 0, void 0, function* () {
                const wallet = this._adapterByName.get(wl.name);
                if (!wallet) {
                    throw new Error(`Wallet not found: ${wl.name}`);
                }
                yield wallet.connect();
                if (!wallet.connected || !wallet.publicKey) {
                    throw new Error(`Wallet not connected: ${wallet.name}`);
                }
                wallet.on("disconnect", () => {
                    wallet.removeListener("disconnect");
                    this.log("disconnected");
                    this.activeWallet = null;
                    const event = new CustomEvent(CONNECTION_EVENT, { detail: null });
                    document.dispatchEvent(event);
                    // this.elmApp.ports.disconnectIn.send(null);
                });
                this.activeWallet = wl.name;
                // this.elmApp.ports.connectCb.send(wallet.publicKey.toString());
                const event = new CustomEvent(CONNECTION_EVENT, { detail: wallet });
                document.dispatchEvent(event);
                this.showMenu(false);
            }))().catch((e) => {
                // this.elmApp.ports.connectCb.send(null);
                this.log(e);
            }));
            this._adapterList.appendChild(elementsCallback.elementToAppend);
        };
        const validateWallet = (wallet) => {
            if ((0, wallet_standard_wallet_adapter_base_1.isWalletAdapterCompatibleWallet)(wallet)) {
                processWallet(new wallet_standard_wallet_adapter_base_1.StandardWalletAdapter({ wallet }));
            }
            else {
                this.log("wallet not compatible:", wallet.name);
            }
        };
        this.wallets.get().forEach((newWallet) => {
            this.log("wallet read:", newWallet.name);
            validateWallet(newWallet);
        });
        this.wallets.on("register", (newWallet) => {
            this.log("wallet registered:", newWallet.name);
            validateWallet(newWallet);
        });
        if (config === null || config === void 0 ? void 0 : config.additionalAdapters) {
            config.additionalAdapters.forEach(processWallet);
        }
        // setTimeout(() => this.elmApp.ports.walletTimeout.send(null), 2500);
    }
    openMenu() {
        this.showMenu(true);
    }
    getWallet() {
        if (!this.activeWallet) {
            return null;
        }
        const w = this._adapterByName.get(this.activeWallet);
        return w || null;
    }
    onWalletChange(callback) {
        document.addEventListener(CONNECTION_EVENT, (ev) => {
            callback(ev.detail);
        });
    }
    onVisibilityChange(callback) {
        document.addEventListener(VISIBILITY_EVENT, (ev) => {
            callback(ev.detail);
        });
    }
    showMenu(val) {
        if (this._modal) {
            this._toggleModalCallback(this._modal, val ? OpenState.Open : OpenState.Close);
            // this._modal.style.display = val ? "block" : "none";
        }
        this.isOpen = val;
        const event = new CustomEvent(VISIBILITY_EVENT, { detail: this.isOpen });
        document.dispatchEvent(event);
    }
    // eslint-disable-next-line fp/no-rest-parameters
    log(...xs) {
        if (this.debug) {
            console.log(...xs);
        }
    }
}
exports.SolanaConnectLight = SolanaConnectLight;
