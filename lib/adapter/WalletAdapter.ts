import { getWallets, Wallet, Wallets } from "@wallet-standard/core";
import { Adapter } from "@solana/wallet-adapter-base";
import {
  StandardWalletAdapter,
  isWalletAdapterCompatibleWallet,
} from "@solana/wallet-standard-wallet-adapter-base";

const MODAL_ID: string = "swal-modal";
const CLOSE_BTN_ID: string = "swal-close-btn";
const ADAPTER_LIST_ID: string = "swal-adapter-list";
const ELM_APP_ID: string = "__sc__elm_app";
const CONNECTION_EVENT: string = "swal-connect-event";
const VISIBILITY_EVENT: string = "swal-visibility-event";

interface SolanaConnectConfig {
  debug?: boolean;
  additionalAdapters?: Adapter[];
  /**
   * Called when an adapter will be appened to the adapter list in the modal.
   * By default, if you don't specify any value, the callback will use the following code:
   * @example
   * (wl) => {
   *        const liElement: HTMLElement = document.createElement('li');
   *
   *        const buttonElement = document.createElement('button');
   *        buttonElement.classList.add('wallet-adapter-button');
   *        buttonElement.tabIndex = 0;
   *        buttonElement.type = 'button';
   *
   *        const iconElement = document.createElement('i');
   *        iconElement.classList.add('wallet-adapter-button-start-icon');
   *
   *        const imgElement = document.createElement('img');
   *        imgElement.src = wl.icon;
   *        iconElement.appendChild(imgElement);
   *
   *        buttonElement.appendChild(iconElement);
   *        buttonElement.appendChild(document.createTextNode(wl.name));
   *        const spanElement = document.createElement('span');
   *
   *        if (wl.readyState == 'Installed')
   *          spanElement.appendChild(document.createTextNode('Detected'));
   *        buttonElement.appendChild(spanElement);
   *
   *        liElement.appendChild(buttonElement);
   *
   *        return {
   *          elementToAppend: liElement,
   *          elementToBindConnectAction: buttonElement
   *        }
   *      }
   */
  addAdapterCallback?: (wl: Adapter) => {elementToAppend: HTMLElement, elementToBindConnectAction: HTMLElement};
}

/* eslint-disable fp/no-this, fp/no-mutation, fp/no-class */
class SolanaConnectLight {
  isOpen: boolean;
  debug: boolean;
  activeWallet: string | null;
  private _adapterByName: Map<string, Adapter>;
  // private elmApp: ElmApp;
  private wallets: Wallets;

  private readonly _modal = document.getElementById(MODAL_ID);
  private readonly _closeBtn = document.getElementById(CLOSE_BTN_ID) as HTMLButtonElement;
  private readonly _adapterList = document.getElementById(ADAPTER_LIST_ID) as HTMLUListElement;

  private readonly _defaultAddAdapterCallback: (wl: Adapter) => {elementToAppend: HTMLElement, elementToBindConnectAction: HTMLElement} = (wl) => {
    const liElement: HTMLElement = document.createElement('li');

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
    }
  }

  private _addAdapterCallback:(wl: Adapter) => {elementToAppend: HTMLElement, elementToBindConnectAction: HTMLElement} = this._defaultAddAdapterCallback;

  constructor(config?: SolanaConnectConfig) {
    this.wallets = getWallets();
    this.isOpen = false;
    this.debug = config?.debug || false;
    this._adapterByName = new Map();
    this.activeWallet = null;
    if (config?.addAdapterCallback)
      this._addAdapterCallback = config?.addAdapterCallback;
    

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

          const event = new CustomEvent(CONNECTION_EVENT, { detail: wallet });
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
  getWallet(): Adapter | null {
    if (!this.activeWallet) {
      return null;
    }
    const w = this._adapterByName.get(this.activeWallet);
    return w || null;
  }
  onWalletChange(callback: (_: Adapter | null) => void) {
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
      this._modal.style.display = val ? "block" : "none";
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
