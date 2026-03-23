# Wallet Connect & Chain Switch — Full Flow Document

## How It Works (Non-Technical)

When a user visits the faucet or the ChainBois website, they click **"Connect Wallet"**. Everything that follows is automatic — the user just clicks "Approve" on wallet popups. No manual configuration needed.

---

## Faucet Flow (chainbois-testnet-faucet.vercel.app)

### Step 1: User Clicks "Connect Wallet"

The faucet page shows a red **Connect Wallet** button with a wallet icon. The Claim Starter Pack button is disabled until a wallet is connected.

### Step 2: Wallet Selection

**If only one wallet is installed:** The wallet connects directly — no extra steps.

**If multiple wallets are installed (e.g., MetaMask + Core + Phantom):** A chooser modal appears showing all detected wallets with their icons and names. The user clicks their preferred wallet.

Wallet detection uses **EIP-6963** (Multi Injected Provider Discovery) — the modern standard supported by MetaMask, Core, Phantom, Coinbase Wallet, and others. Legacy fallback detection catches older wallets that don't support EIP-6963.

### Step 3: Wallet Connect Popup

The chosen wallet shows its connection popup:
> **"chainbois-testnet-faucet.vercel.app wants to connect to your wallet"**
> → User clicks **Connect**

### Step 3: Automatic Network Check

Immediately after connecting, the faucet checks which network the wallet is on.

**Scenario A — Already on Fuji:**
- Green dot + "Fuji Testnet" badge appears
- Wallet address shows as `0x8e63...C2B`
- User can claim immediately
- No extra popups

**Scenario B — On wrong network (e.g., Ethereum, Avalanche Mainnet):**
- Wallet popup appears automatically:
  > **"Allow this site to switch the network?"**
  > Network: Avalanche Fuji C-Chain
  > → User clicks **Switch Network** (one click)
- Network switches instantly, green badge appears

**Scenario C — Fuji not in wallet at all (first time):**
- Wallet popup appears automatically:
  > **"Allow this site to add a network?"**
  > Network name: Avalanche Fuji C-Chain
  > RPC URL: https://api.avax-test.network/ext/bc/C/rpc
  > Chain ID: 43113
  > Currency: AVAX
  > Block Explorer: https://testnet.snowscan.xyz
  > → User clicks **Approve** (one click)
- Fuji is added to their wallet AND auto-switched
- User never types anything — all details are sent programmatically

### Step 4: Ready to Claim

Once connected + on Fuji:
- The wallet address displays as `0x8e63...C2B` with a disconnect (×) button
- Network badge shows green "Fuji Testnet"
- The **Claim Starter Pack** button becomes active (it is disabled until a wallet is connected)
- If this wallet has already claimed, the "Already Claimed" view is shown automatically

### Step 5: Claim Starter Pack

User clicks "Claim Starter Pack" — the button shows a live timer while assets are being sent on-chain. Results display each asset with its name, image, token ID, and transaction hash (linked to Snowtrace explorer). Weapons are shown individually with images and tx links.

### Ongoing Monitoring

- If the user **switches accounts** in their wallet → address auto-updates, claim status re-checked
- If the user **switches to wrong network** in their wallet → auto-prompts to switch back to Fuji
- If the user **disconnects** from wallet → UI resets, Claim button disabled

---

## Frontend Flow (ChainBois Website — chain-bois.vercel.app)

### How Thirdweb v5 Handles It

The main website uses Thirdweb v5 SDK which has **built-in chain enforcement**:

1. `<ConnectButton chain={avalancheFuji}>` — tells Thirdweb that Fuji is the target chain
2. `<AutoConnect chain={avalancheFuji}>` — on page reload, auto-reconnects to Fuji
3. `<ChainProvider chain={avalancheFuji}>` — all chain-aware hooks default to Fuji
4. `<ChainEnforcer>` — custom component that auto-switches if user drifts to wrong chain

### User Experience

1. User clicks the ConnectWalletButton → Thirdweb modal shows supported wallets
2. User selects MetaMask/Core/Phantom/Coinbase/Trust → wallet popup for connection
3. Thirdweb automatically:
   - Detects current chain
   - If not Fuji → sends `wallet_switchEthereumChain` (popup: "Switch network?")
   - If Fuji unknown → sends `wallet_addEthereumChain` (popup: "Add network?")
   - Switches to Fuji
4. `ChainEnforcer` component monitors for chain changes during the session:
   - If user manually switches to Ethereum in MetaMask → auto-prompts back to Fuji
5. User is now on Fuji with their address available throughout the app

---

## Technical Details

### What Happens Under the Hood

```
User clicks "Connect"
  ↓
Browser calls: window.ethereum.request({ method: 'eth_requestAccounts' })
  ↓
Wallet shows: "Connect to this site?" → User clicks Approve
  ↓
Browser calls: window.ethereum.request({ method: 'eth_chainId' })
  ↓
Returns: "0x1" (Ethereum) — NOT Fuji (0xA869)
  ↓
Browser calls: window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0xA869' }]
})
  ↓
Wallet shows: "Switch to Avalanche Fuji C-Chain?" → User clicks Switch
  ↓
  ↓ (OR if Fuji not in wallet → error 4902)
  ↓
Browser calls: window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0xA869',
    chainName: 'Avalanche Fuji C-Chain',
    nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowscan.xyz']
  }]
})
  ↓
Wallet shows: "Add Avalanche Fuji C-Chain?" → User clicks Approve
  ↓
Network added + switched automatically
  ↓
Done — user is on Fuji, address available
```

### Wallet Compatibility

| Wallet | Tested | Notes |
|--------|--------|-------|
| MetaMask | ✅ | Full support, most common |
| Core Wallet | ✅ | Avalanche's native wallet, also uses `window.ethereum` |
| Phantom | ✅ | Needs EVM mode enabled (auto-detects for EVM chains) |
| Coinbase Wallet | ✅ | Browser extension + mobile both work |
| Trust Wallet | ✅ | Mobile + browser extension |
| Keplr | ⚠️ | Cosmos wallet, limited EVM support |
| WalletConnect | ✅ | Works via QR code modal (mobile wallets) |

### Error Handling

| Error Code | Meaning | What We Do |
|------------|---------|------------|
| 4001 | User rejected the popup | Show message, don't retry |
| 4902 | Chain not in wallet | Fall back to `wallet_addEthereumChain` |
| -32002 | Request already pending | Wallet has an open popup, wait |
| -32602 | Invalid parameters | Should never happen (our params are correct) |

---

## For the Frontend Developer

### Files Modified

**Faucet (`testnet-faucet/index.html`):**
- Added ethers.js v6 via CDN for wallet provider detection
- Added Connect Wallet button with auto chain switch
- Added network badge (green/red indicator)
- Added account/chain change listeners
- Kept manual address input as fallback

**Frontend (`chainbois-frontend/src/context/ThirdwebProviders.js`):**
- Added `ChainEnforcer` component
- Uses `useActiveWalletChain()` + `useSwitchActiveWalletChain()` from Thirdweb v5
- Auto-switches when user drifts to wrong chain mid-session

### No Changes Needed

- `ConnectWalletButton.jsx` — already passes `chain={avalancheFuji}` to `<ConnectButton>`
- `thirdwebWallets.js` — wallet list already includes MetaMask, Phantom, Coinbase, Trust
- Backend — no changes needed (chain switching is entirely frontend)

---

## For Production (Mainnet Switch)

When ready to go to mainnet:

**Faucet:** The faucet is testnet-only — no mainnet version needed.

**Frontend:** Change `avalancheFuji` to `avalanche` in:
1. `src/context/ThirdwebProviders.js` — import and all 3 references
2. `src/components/ConnectWalletButton/ConnectWalletButton.jsx` — import and all references
3. `src/constants/index.js` — update `BATTLE_TOKEN` to mainnet contract address

Or better, make it environment-driven:
```javascript
import { avalanche, avalancheFuji } from 'thirdweb/chains'
const activeChain = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? avalanche : avalancheFuji
```
