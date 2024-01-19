import { Adapter } from "@solana/wallet-adapter-base";
import { OpenState } from "./WalletAdapter";
/**
 * Configuration object for the SolanaConnectLight object
 */
export interface SolanaConnectConfig {
    debug?: boolean;
    /**
     * By default, only wallets that support the [Wallet Standard](https://github.com/wallet-standard/wallet-standard) will appear, but additional options can be provided.
     * You can inspire you from this following example if you want to add more:
     * ```typescript
     * import {
     *   SolanaMobileWalletAdapter,
     *   createDefaultAuthorizationResultCache,
     *   createDefaultAddressSelector,
     *   createDefaultWalletNotFoundHandler,
     * } from "@solana-mobile/wallet-adapter-mobile";
     * import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
     * import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-unsafe-burner";
     *
     * const solConnect = new SolanaConnectLight({
     *   additionalAdapters: [
     *     new SolflareWalletAdapter(),
     *     new UnsafeBurnerWalletAdapter(),
     *     new SolanaMobileWalletAdapter({
     *       addressSelector: createDefaultAddressSelector(),
     *       appIdentity: {
     *         name: "Supercorp",
     *         uri: "https://supercorp.app/",
     *         icon: "icon.png",
     *       },
     *       authorizationResultCache: createDefaultAuthorizationResultCache(),
     *       cluster: "mainnet-beta",
     *       onWalletNotFound: createDefaultWalletNotFoundHandler(),
     *     }),
     *   ],
     * });
     * ```
     */
    additionalAdapters?: Adapter[];
    /**
     * Called when an adapter will be appened to the adapter list in the modal.
     * By default, if you don't specify any value, the callback will use the following code:
     * ```typescript
     * (wl) => {
     *        const liElement: HTMLElement = document.createElement('li');
     *
     *        const buttonElement = document.createElement('button');
     *        buttonElement.classList.add('swal-button');
     *        buttonElement.tabIndex = 0;
     *        buttonElement.type = 'button';
     *
     *        const iconElement = document.createElement('i');
     *        iconElement.classList.add('swal-button-start-icon');
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
     * ```
     */
    addAdapterCallback?: (wl: Adapter) => {
        elementToAppend: HTMLElement;
        elementToBindConnectAction: HTMLElement;
    };
    /**
     * Callback when the modal will be shown. By default, the following code will be used.
     * ```typescript
     * (element, state) => {
     *      switch(state) {
     *        case OpenState.Open:
     *          element.style.display = "block";
     *          setTimeout(() => {
     *            element.classList.add('swal-modal-fade-in');
     *          }, 1);
     *          break;
     *        case OpenState.Close:
     *          element.classList.remove('swal-modal-fade-in');
     *          setTimeout(() => {
     *            element.style.display = "none";
     *          }, 500);
     *          break;
     *      }
     *    }
     * ```
     */
    toggleModalCallback?: (element: HTMLElement, state: OpenState) => void;
    /**
     * If you set to false, no html will be generated. So you will need to add html by yourself in you application.
     * Otherwise, the same HTML as the following example will be generated at the end of the body node.
     * You are advised to start with this structure and modify as you want after you have something working:
     * ```html
     * <div id="swal-modal" class="swal-modal ">
     *      <div class="swal-modal-container">
     *          <div class="swal-modal-wrapper">
     *              <button id="swal-close-btn" class="swal-modal-button-close">
     *                  <svg width="14" height="14">
     *                      <path d="M14 12.461 8.3 6.772l5.234-5.233L12.006 0 6.772 5.234 1.54 0 0 1.539l5.234 5.233L0 12.006l1.539 1.528L6.772 8.3l5.69 5.7L14 12.461z"></path>
     *                  </svg>
     *              </button>
     *              <h1 class="swal-modal-title">Connect a wallet on Solana to continue</h1>
     *              <ul id="swal-adapter-list" class="swal-modal-list">
     *              </ul>
     *          </div>
     *      </div>
     *      <div class="swal-modal-overlay"></div>
     *  </div>
     * ```
     */
    generateHtml?: boolean;
    /**
     * If you set to false, no style will be generated. So you will need to add style by yourself in you application.
     * Otherwise, the same style as the following example will be generated in a style node.
     *
     * ```css
     * @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
     *
     * .swal-button {
     *     background-color: transparent;
     *     border: none;
     *     color: #fff;
     *     cursor: pointer;
     *     display: flex;
     *     align-items: center;
     *     font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
     *     font-size: 16px;
     *     font-weight: 600;
     *     height: 48px;
     *     line-height: 48px;
     *     padding: 0 24px;
     *     border-radius: 4px;
     * }
     *
     * .swal-button:not([disabled]):focus-visible {
     *     outline-color: white;
     * }
     *
     * .swal-button:not([disabled]):hover {
     *     background-color: #1a1f2e;
     * }
     *
     * .swal-button[disabled] {
     *     background: #404144;
     *     color: #999;
     *     cursor: not-allowed;
     * }
     *
     * .swal-button-start-icon,
     * .swal-button-start-icon img {
     *     display: flex;
     *     align-items: center;
     *     justify-content: center;
     *     width: 24px;
     *     height: 24px;
     * }
     *
     * .swal-button-start-icon {
     *     margin-right: 12px;
     * }
     *
     * .swal-modal {
     *     display: none;
     *     position: fixed;
     *     top: 0;
     *     left: 0;
     *     right: 0;
     *     bottom: 0;
     *     opacity: 0;
     *     transition: opacity linear 150ms;
     *     background: rgba(0, 0, 0, 0.5);
     *     z-index: 1040;
     *     overflow-y: auto;
     * }
     *
     * .swal-modal.swal-modal-fade-in {
     *     opacity: 1;
     * }
     *
     * .swal-modal-button-close {
     *     display: flex;
     *     align-items: center;
     *     justify-content: center;
     *     position: absolute;
     *     top: 18px;
     *     right: 18px;
     *     padding: 12px;
     *     cursor: pointer;
     *     background: #1a1f2e;
     *     border: none;
     *     border-radius: 50%;
     * }
     *
     * .swal-modal-button-close:focus-visible {
     *     outline-color: white;
     * }
     *
     * .swal-modal-button-close svg {
     *     fill: #777;
     *     transition: fill 200ms ease 0s;
     * }
     *
     * .swal-modal-button-close:hover svg {
     *     fill: #fff;
     * }
     *
     * .swal-modal-overlay {
     *     background: rgba(0, 0, 0, 0.5);
     *     position: fixed;
     *     top: 0;
     *     left: 0;
     *     bottom: 0;
     *     right: 0;
     * }
     *
     * .swal-modal-container {
     *     display: flex;
     *     margin: 3rem;
     *     min-height: calc(100vh - 6rem);
     *     align-items: center;
     *     justify-content: center;
     * }
     *
     * @media (max-width: 480px) {
     *     .swal-modal-container {
     *         margin: 1rem;
     *         min-height: calc(100vh - 2rem);
     *     }
     * }
     *
     * .swal-modal-wrapper {
     *     box-sizing: border-box;
     *     position: relative;
     *     display: flex;
     *     align-items: center;
     *     flex-direction: column;
     *     z-index: 1050;
     *     max-width: 400px;
     *     border-radius: 10px;
     *     background: #10141f;
     *     box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.6);
     *     font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
     *     flex: 1;
     * }
     *
     * .swal-modal-wrapper .swal-button {
     *     width: 100%;
     * }
     *
     * .swal-modal-title {
     *     font-weight: 500;
     *     font-size: 24px;
     *     line-height: 36px;
     *     margin: 0;
     *     padding: 64px 48px 48px 48px;
     *     text-align: center;
     *     color: #fff;
     * }
     *
     * @media (max-width: 374px) {
     *     .swal-modal-title {
     *         font-size: 18px;
     *     }
     * }
     *
     * .swal-modal-list {
     *     margin: 0 0 12px 0;
     *     padding: 0;
     *     width: 100%;
     *     list-style: none;
     * }
     *
     * .swal-modal-list .swal-button {
     *     font-weight: 400;
     *     border-radius: 0;
     *     font-size: 18px;
     * }
     *
     * .swal-modal-list .swal-button-start-icon,
     * .swal-modal-list .swal-button-start-icon img {
     *     width: 28px;
     *     height: 28px;
     * }
     *
     * .swal-modal-list .swal-button span {
     *     margin-left: auto;
     *     font-size: 14px;
     *     opacity: .6;
     * }
     *
     * ```
     */
    generateStyle?: boolean;
}
