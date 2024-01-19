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
exports.SolanaConnectLight = void 0;
const core_1 = require("@wallet-standard/core");
const wallet_standard_wallet_adapter_base_1 = require("@solana/wallet-standard-wallet-adapter-base");
const MODAL_ID = "swal-modal";
const CLOSE_BTN_ID = "swal-close-btn";
const ADAPTER_LIST_ID = "swal-adapter-list";
const ELM_APP_ID = "__sc__elm_app";
const CONNECTION_EVENT = "swal-connect-event";
const VISIBILITY_EVENT = "swal-visibility-event";
/* eslint-disable fp/no-this, fp/no-mutation, fp/no-class */
class SolanaConnectLight {
    constructor(config) {
        this._modal = document.getElementById(MODAL_ID);
        this._closeBtn = document.getElementById(CLOSE_BTN_ID);
        this._adapterList = document.getElementById(ADAPTER_LIST_ID);
        this._defaultAddAdapterCallback = (wl) => {
            const liElement = document.createElement('li');
            const buttonElement = document.createElement('button');
            buttonElement.classList.add('wallet-adapter-button');
            buttonElement.tabIndex = 0;
            buttonElement.type = 'button';
            const iconElement = document.createElement('i');
            iconElement.classList.add('wallet-adapter-button-start-icon');
            const imgElement = document.createElement('img');
            imgElement.src = wl.icon;
            iconElement.appendChild(imgElement);
            buttonElement.appendChild(iconElement);
            buttonElement.appendChild(document.createTextNode(wl.name));
            const spanElement = document.createElement('span');
            if (wl.readyState == 'Installed')
                spanElement.appendChild(document.createTextNode('Detected'));
            buttonElement.appendChild(spanElement);
            liElement.appendChild(buttonElement);
            return {
                elementToAppend: liElement,
                elementToBindConnectAction: buttonElement
            };
        };
        this._addAdapterCallback = this._defaultAddAdapterCallback;
        this.wallets = (0, core_1.getWallets)();
        this.isOpen = false;
        this.debug = (config === null || config === void 0 ? void 0 : config.debug) || false;
        this._adapterByName = new Map();
        this.activeWallet = null;
        if (config === null || config === void 0 ? void 0 : config.addAdapterCallback)
            this._addAdapterCallback = config === null || config === void 0 ? void 0 : config.addAdapterCallback;
        // this.elmApp = Elm.Main.init({
        //   node: document.getElementById(ELM_APP_ID),
        //   flags: {},
        // });
        this._closeBtn.addEventListener("click", (e) => {
            this.showMenu(false);
        });
        // this.elmApp.ports.close.subscribe(() => {
        //   this.showMenu(false);
        // });
        // this.elmApp.ports.connect.subscribe((tag: string) =>
        //   (async () => {
        //     const wallet = this.options.get(tag);
        //     if (!wallet) {
        //       throw new Error(`Wallet not found: ${tag}`);
        //     }
        //     await wallet.connect();
        //     if (!wallet.connected || !wallet.publicKey) {
        //       throw new Error(`Wallet not connected: ${wallet.name}`);
        //     }
        //     wallet.on("disconnect", () => {
        //       wallet.removeListener("disconnect");
        //       this.log("disconnected");
        //       this.activeWallet = null;
        //       const event = new CustomEvent(CONNECTION_EVENT, { detail: null });
        //       document.dispatchEvent(event);
        //       // this.elmApp.ports.disconnectIn.send(null);
        //     });
        //     this.activeWallet = tag;
        //     // this.elmApp.ports.connectCb.send(wallet.publicKey.toString());
        //     const event = new CustomEvent(CONNECTION_EVENT, { detail: wallet });
        //     document.dispatchEvent(event);
        //     this.showMenu(false);
        //   })().catch((e) => {
        //     // this.elmApp.ports.connectCb.send(null);
        //     this.log(e);
        //   })
        // );
        // this.elmApp.ports.disconnect.subscribe((close: boolean) =>
        //   (async () => {
        //     if (close) {
        //       this.showMenu(false);
        //     }
        //     const wallet = this.getWallet();
        //     if (wallet) {
        //       this.log("disconnecting", wallet.name);
        //       await wallet.disconnect();
        //     }
        //   })().catch((e) => {
        //     this.log(e);
        //   })
        // );
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
            // this.elmApp.ports.walletCb.send({
            //   name: wl.name,
            //   icon: wl.icon,
            // });
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
            this._modal.style.display = val ? "block" : "none";
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
