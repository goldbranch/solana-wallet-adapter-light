import { SolanaConnectConfig } from "./SolanaConnectConfig";
import { WalletAdapterLight } from "../WalletAdapter";
export declare enum OpenState {
    Open = 0,
    Close = 1
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
    private _toggleModalCallback;
    private _addAdapterCallback;
    private _generateStyleFunction;
    constructor(config?: SolanaConnectConfig);
    openMenu(): void;
    getWallet(): WalletAdapterLight | null;
    onWalletChange(callback: (_: WalletAdapterLight | null) => void): void;
    onVisibilityChange(callback: (_: boolean) => void): void;
    private showMenu;
    private log;
}
export { SolanaConnectLight, SolanaConnectConfig };
