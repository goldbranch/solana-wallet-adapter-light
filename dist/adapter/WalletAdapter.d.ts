import { Adapter } from "@solana/wallet-adapter-base";
import { SolanaConnectConfig } from "./SolanaConnectConfig";
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
    getWallet(): Adapter | null;
    onWalletChange(callback: (_: Adapter | null) => void): void;
    onVisibilityChange(callback: (_: boolean) => void): void;
    private showMenu;
    private log;
}
export { SolanaConnectLight, SolanaConnectConfig };
