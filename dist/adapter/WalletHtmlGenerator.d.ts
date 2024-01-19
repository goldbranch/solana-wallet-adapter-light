import { Adapter } from "@solana/wallet-adapter-base";
export declare const createHtmlAdapter: (wl: Adapter) => {
    elementToAppend: HTMLElement;
    elementToBindConnectAction: HTMLElement;
};
export declare const createHtmlBase: () => void;
