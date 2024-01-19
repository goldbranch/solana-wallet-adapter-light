import { Adapter } from "@solana/wallet-adapter-base";
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
    addAdapterCallback?: (wl: Adapter) => {
        elementToAppend: HTMLElement;
        elementToBindConnectAction: HTMLElement;
    };
}
declare class SolanaConnectLight {
    isOpen: boolean;
    debug: boolean;
    activeWallet: string | null;
    private _adapterByName;
    private wallets;
    private readonly _modal;
    private readonly _closeBtn;
    private readonly _adapterList;
    private readonly _defaultAddAdapterCallback;
    private _addAdapterCallback;
    constructor(config?: SolanaConnectConfig);
    openMenu(): void;
    getWallet(): Adapter | null;
    onWalletChange(callback: (_: Adapter | null) => void): void;
    onVisibilityChange(callback: (_: boolean) => void): void;
    private showMenu;
    private log;
}
export { SolanaConnectLight, SolanaConnectConfig };
