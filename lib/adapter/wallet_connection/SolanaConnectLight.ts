import { getWallets, Wallet, Wallets } from "@wallet-standard/core";
import { Adapter } from "@solana/wallet-adapter-base";
import {
  StandardWalletAdapter,
  isWalletAdapterCompatibleWallet,
} from "@solana/wallet-standard-wallet-adapter-base";
import { styleText } from "./WalletStyle";
import { createHtmlAdapter, createHtmlBase } from "./WalletHtmlGenerator";
import { SolanaConnectConfig } from "./SolanaConnectConfig";
import { WalletAdapterLight } from "../WalletAdapter";


const MODAL_ID: string = "swal-modal";
const CLOSE_BTN_ID: string = "swal-close-btn";
const ADAPTER_LIST_ID: string = "swal-adapter-list";

const CONNECTION_EVENT: string = "swal-connect-event";
const VISIBILITY_EVENT: string = "swal-visibility-event";

export enum OpenState {
  Open, Close
}

/* eslint-disable fp/no-this, fp/no-mutation, fp/no-class */
class SolanaConnectLight {
  isOpen: boolean;
  debug: boolean;
  activeWallet: string | null;
  private _adapterByName: Map<string, Adapter>;
  // private elmApp: ElmApp;
  private wallets: Wallets;

  private readonly _modal: HTMLElement;
  private readonly _closeBtn: HTMLButtonElement;
  private readonly _adapterList:HTMLUListElement;

  private _toggleModalCallback: (element:HTMLElement, state: OpenState) => void = (element, state) => {
    switch(state) {
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

  private _addAdapterCallback:(wl: Adapter) => {elementToAppend: HTMLElement, elementToBindConnectAction: HTMLElement} = createHtmlAdapter;

  private _generateStyleFunction = () => {

      const styleElement: HTMLStyleElement = document.createElement('style');

      styleElement.textContent = styleText;

      document.head.appendChild(styleElement);
    
  }

  constructor(config?: SolanaConnectConfig) {
    this.wallets = getWallets();
    this.isOpen = false;
    this.debug = config?.debug || false;
    this._adapterByName = new Map();
    this.activeWallet = null;
    if (config?.addAdapterCallback)
      this._addAdapterCallback = config?.addAdapterCallback;
    if (config?.toggleModalCallback)
      this._toggleModalCallback = config.toggleModalCallback;
    if (!config || config.generateHtml === undefined || config.generateHtml) 
      createHtmlBase();
    if (!config || config?.generateStyle === undefined || config.generateStyle) 
      this._generateStyleFunction();

    const modalTmp = document.getElementById(MODAL_ID);
    const closeTmp = document.getElementById(CLOSE_BTN_ID);
    const listTmp = document.getElementById(ADAPTER_LIST_ID);

    if (!listTmp || !closeTmp || !modalTmp) {
      throw new Error("One or more of these html element with these id is not found in the dom: [swal-modal, swal-close-btn, swal-adapter-list]."
      +"If you use property generateHtml=false, make sur to add the base html structure in your main HTML. You can find it on the readme page here https://github.com/Olive-fr/solana-wallet-adapter-light.");
    }
    this._modal = modalTmp as HTMLElement;
    this._closeBtn = closeTmp as HTMLButtonElement;
    this._adapterList = listTmp as HTMLUListElement
    

    this._closeBtn.addEventListener("click", (e) => {
      this.showMenu(false);
    })

    const processWallet = (wl: Adapter) => {
      if (this._adapterByName.has(wl.name)) {
        this.log("wallet duplicate:", wl.name);
        return;
      }
      this._adapterByName.set(wl.name, wl);

      let elementsCallback = this._addAdapterCallback(wl);

      elementsCallback.elementToBindConnectAction.addEventListener("click", (e) => 
        (async () => {
          const wallet = this._adapterByName.get(wl.name);

          if (!wallet) {
            throw new Error(`Wallet not found: ${wl.name}`);
          }

          await wallet.connect();

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

          
          const event = new CustomEvent(CONNECTION_EVENT, { detail: new WalletAdapterLight(wallet) });
          document.dispatchEvent(event);
          this.showMenu(false);
        })().catch((e) => {
          // this.elmApp.ports.connectCb.send(null);
          this.log(e);
        })
      );

      this._adapterList.appendChild(elementsCallback.elementToAppend)

    };

    const validateWallet = (wallet: Wallet) => {
      if (isWalletAdapterCompatibleWallet(wallet)) {
        processWallet(new StandardWalletAdapter({ wallet }));
      } else {
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

    if (config?.additionalAdapters) {
      config.additionalAdapters.forEach(processWallet);
    }

    // setTimeout(() => this.elmApp.ports.walletTimeout.send(null), 2500);
  }
  openMenu() {
    this.showMenu(true);
  }
  getWallet(): WalletAdapterLight | null {
    if (!this.activeWallet) {
      return null;
    }
    const adapter = this._adapterByName.get(this.activeWallet);
    if (adapter) {
      const w = new WalletAdapterLight(adapter);
      return w;
    }
    return null;
  }
  onWalletChange(callback: (_: WalletAdapterLight | null) => void) {
    document.addEventListener(CONNECTION_EVENT, (ev: any) => {
      callback(ev.detail);
    });
  }
  onVisibilityChange(callback: (_: boolean) => void) {
    document.addEventListener(VISIBILITY_EVENT, (ev: any) => {
      callback(ev.detail);
    });
  }
  private showMenu(val: boolean) {
    if (this._modal) {
      this._toggleModalCallback(this._modal, val?OpenState.Open:OpenState.Close);
      // this._modal.style.display = val ? "block" : "none";
    }

    this.isOpen = val;

    const event = new CustomEvent(VISIBILITY_EVENT, { detail: this.isOpen });

    document.dispatchEvent(event);
  }
  // eslint-disable-next-line fp/no-rest-parameters
  private log(...xs: any[]) {
    if (this.debug) {
      console.log(...xs);
    }
  }
}
/* eslint-enable fp/no-this, fp/no-mutation, fp/no-class */


export { SolanaConnectLight, SolanaConnectConfig };
