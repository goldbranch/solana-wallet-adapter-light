# Solana Wallet Connector
Solana wallet connector for your typescript app. You can change the design of the modal. 


[npm](https://www.npmjs.com/package/solana-connect)

![wallet menu](assets/preview.png)

---

### __Usage:__
```
npm i @aiternate/solana-wallet-adapter-light
```

```typescript
import { SolanaConnectLight } from "@aiternate/solana-wallet-adapter-light";
import { Adapter } from "@solana/wallet-adapter-base";

const solConnect = new SolanaConnectLight();

solConnect.openMenu();

solConnect.onWalletChange((adapter: Adapter | null) =>
  adapter
    ? console.log("connected:", adapter.name, adapter.publicKey.toString())
    : console.log("disconnected")
);

solConnect.onVisibilityChange((isOpen: boolean) => {
  console.log("menu visible:", isOpen);
});

const wallet: Adapter | null = solConnect.getWallet();
```
or use with [unpkg](https://www.unpkg.com/):
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://www.unpkg.com/@aiternate/solana-wallet-adapter-light"></script>
  </head>
  <body>
    <script>
      const solConnect = new window.SolanaConnectLight();
      solConnect.openMenu();
    </script>
  </body>
</html>
```

###  __Adding more adapters:__
By default, only wallets that support the [Wallet Standard](https://github.com/wallet-standard/wallet-standard) will appear, but additional options can be provided.
```typescript
import {
  SolanaMobileWalletAdapter,
  createDefaultAuthorizationResultCache,
  createDefaultAddressSelector,
  createDefaultWalletNotFoundHandler,
} from "@solana-mobile/wallet-adapter-mobile";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-unsafe-burner";

const solConnect = new SolanaConnectLight({
  additionalAdapters: [
    new SolflareWalletAdapter(),
    new UnsafeBurnerWalletAdapter(),
    new SolanaMobileWalletAdapter({
      addressSelector: createDefaultAddressSelector(),
      appIdentity: {
        name: "Supercorp",
        uri: "https://supercorp.app/",
        icon: "icon.png",
      },
      authorizationResultCache: createDefaultAuthorizationResultCache(),
      cluster: "mainnet-beta",
      onWalletNotFound: createDefaultWalletNotFoundHandler(),
    }),
  ],
});
```
