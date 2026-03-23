# Wallet Connect & Chain Switching — How It Works

> **Purpose:** Reference for the frontend developer explaining how wallet connection and Avalanche Fuji network enforcement work on the ChainBois website. Read this to understand the wallet UX, debug connection issues, modify wallet behavior, or prepare for mainnet.

---

## Architecture

The website uses Thirdweb v5 (`^5.105.41`) with chain enforcement built into the React provider tree:

```
ContextWrapper.jsx
  └─ ThirdwebProviders.js (exported as `Providers`)
       ├─ <ThirdwebProvider>
       ├─ <AutoConnect chain={avalancheFuji} wallets={...} />
       ├─ <ChainProvider chain={avalancheFuji}>
       │    └─ <ChainEnforcer>        ← auto-switches to Fuji
       │         └─ <SessionContextProvider>
       │              └─ <AuthContextProvider>
       │                   └─ <MainContextProvider>
       │                        └─ app content
       └─ </ThirdwebProvider>
```

Target chain: **Avalanche Fuji** (chain ID 43113 / `0xA869`), hardcoded via `import { avalancheFuji } from 'thirdweb/chains'`.

---

## Key Files

**`src/context/ThirdwebProviders.js`** — Chain configuration + ChainEnforcer

```javascript
import { avalancheFuji } from 'thirdweb/chains'

// Auto-switches to Fuji if user connects on any other chain
function ChainEnforcer({ children }) {
  const activeChain = useActiveWalletChain()
  const switchChain = useSwitchActiveWalletChain()

  useEffect(() => {
    if (activeChain && activeChain.id !== avalancheFuji.id) {
      switchChain(avalancheFuji).catch((err) => {
        console.error('Failed to auto-switch to Fuji:', err)
      })
    }
  }, [activeChain, switchChain])

  return children
}
```

Chain is hardcoded to `avalancheFuji` in three places: `<AutoConnect>`, `<ChainProvider>`, and `<ChainEnforcer>`. There is no env var override — see "Mainnet Transition" below for how to change this.

**`src/lib/thirdwebWallets.js`** — Wallet list + app metadata

```javascript
export const thirdwebWallets = [
  createWallet('io.metamask'),
  createWallet('app.keplr'),
  createWallet('app.phantom'),
  createWallet('com.coinbase.wallet'),
  createWallet('com.trustwallet.app'),
]

export const thirdwebAppMetadata = {
  name: 'ChainBois',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://chain-bois.vercel.app',
  description: 'ChainBois gaming platform',
  logoUrl: 'https://chain-bois.vercel.app/img/CB.svg',
}
```

**`src/components/ConnectWalletButton/ConnectWalletButton.jsx`** — Connect button UI

- Renders Thirdweb's `<ConnectButton>` with `chain={avalancheFuji}`
- Shows `$BATTLE` token balance via `useWalletBalance()` on Fuji
- `BATTLE_TOKEN` address: `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` (from `src/constants/index.js`)

**`src/context/Auth.js`** — Uses `useActiveAccount().address` for all API calls

**`src/components/AuthGate/AuthGate.jsx`** — Requires both NextAuth session AND wallet connection

---

## User Experience Flow

1. User clicks the ConnectWalletButton
2. Thirdweb modal shows supported wallets (MetaMask, Phantom, Coinbase, Trust, Keplr)
3. User selects wallet → wallet popup: "Connect to this site?" → user approves
4. Thirdweb detects current chain automatically
5. If not on Fuji → `ChainEnforcer` fires `useSwitchActiveWalletChain(avalancheFuji)`
   - Under the hood: `wallet_switchEthereumChain` (EIP-3326)
   - If Fuji unknown to wallet: `wallet_addEthereumChain` (EIP-3085)
   - Wallet popup: "Switch network?" or "Add network?" → user approves
6. User is now on Fuji with address available via `useActiveAccount()`
7. If user manually switches to wrong chain mid-session → `ChainEnforcer` auto-prompts back

---

## What Does NOT Exist

- **No `NetworkSwitcher` component** — there is no manual network toggle UI. Chain enforcement is fully automatic via `ChainEnforcer`.
- **No raw `window.ethereum` calls** — all wallet interaction goes through Thirdweb hooks.
- **No env var for chain selection** — Fuji is hardcoded (see "Mainnet Transition" below).

---

## Wallet Compatibility (Tested)

| Wallet | Supported | Notes |
|--------|-----------|-------|
| MetaMask | Yes | Most common, full EIP support |
| Core Wallet | Yes | Avalanche's native wallet |
| Phantom | Yes | Needs EVM mode (auto-detects for EVM chains) |
| Coinbase Wallet | Yes | Browser extension + mobile |
| Trust Wallet | Yes | Mobile + browser extension |
| Keplr | Yes | Cosmos wallet, limited EVM support |
| WalletConnect | Yes | QR code modal for mobile wallets — handled by Thirdweb |

---

## Mainnet Transition

When ready to move from Fuji testnet to Avalanche mainnet:

### Avalanche Mainnet Parameters

```javascript
// Chain ID: 43114 / 0xA86A
import { avalanche } from 'thirdweb/chains'
```

### Files to Change

**`src/context/ThirdwebProviders.js`** — Make chain env-driven:

```javascript
import { avalanche, avalancheFuji } from 'thirdweb/chains'
const activeChain = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? avalanche : avalancheFuji
```

Replace all 3 references to `avalancheFuji` with `activeChain`:
1. `<AutoConnect chain={activeChain} ...>`
2. `<ChainProvider chain={activeChain}>`
3. `ChainEnforcer` comparison: use `activeChain` variable instead of the hardcoded import

**`src/components/ConnectWalletButton/ConnectWalletButton.jsx`:**
- `<ConnectButton chain={activeChain} ...>`
- `useWalletBalance({ chain: activeChain, ... })`

**`src/constants/index.js`:**
- `BATTLE_TOKEN` → mainnet contract address (different from testnet)

---

## Testing Checklist

- [ ] Connect with MetaMask on Ethereum mainnet → should auto-prompt switch to Fuji
- [ ] Connect with wallet that has never seen Fuji → should prompt to add + switch
- [ ] Connect with Core Wallet → should work identically to MetaMask
- [ ] Connect with Phantom (EVM mode) → should work
- [ ] Connect with Coinbase Wallet → should work
- [ ] Switch to wrong network mid-session → `ChainEnforcer` should auto-prompt switch back
- [ ] Reject the switch prompt → should log error to console (no user-facing crash)
- [ ] Disconnect wallet → auth state should clear
- [ ] Reload page → should auto-reconnect via `<AutoConnect>`
