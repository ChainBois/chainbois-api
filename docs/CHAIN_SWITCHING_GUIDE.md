# Avalanche Network Auto-Switch & Wallet Connect Guide

## Overview

This guide covers two features:
1. **Auto chain switching** — automatically prompt users to add/switch to Avalanche Fuji (testnet) or mainnet
2. **Wallet Connect on faucet** — replace manual address input with a proper wallet connection

Both use the same underlying Web3 standards (EIP-3085 + EIP-3326) and work across MetaMask, Core Wallet, Phantom, Coinbase Wallet, Trust Wallet, etc.

> **This is frontend-only.** The wallet provider (`window.ethereum`) only exists in the user's browser — there is no backend API for chain switching.

---

## Part 1: Chain Parameters

### Avalanche Fuji Testnet (Current)

```javascript
const AVALANCHE_FUJI = {
  chainId: '0xA869',           // 43113 in decimal
  chainName: 'Avalanche Fuji C-Chain',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowscan.xyz'],
};
```

### Avalanche C-Chain Mainnet (For Production)

```javascript
const AVALANCHE_MAINNET = {
  chainId: '0xA86A',           // 43114 in decimal
  chainName: 'Avalanche C-Chain',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://snowscan.xyz'],
};
```

---

## Part 2: How It Works (EIP-3085 + EIP-3326)

The standard pattern across ALL EVM wallets (MetaMask, Core, Phantom EVM, Coinbase, Trust):

1. **Try `wallet_switchEthereumChain`** — asks the wallet to switch to a chain it already knows
2. **If error 4902** (chain not found) — call `wallet_addEthereumChain` to add it, which also switches to it
3. **If error 4001** — user rejected, show a message

```javascript
async function switchToAvalanche(testnet = true) {
  const params = testnet ? AVALANCHE_FUJI : AVALANCHE_MAINNET;

  // Detect available wallet provider
  const provider = window.ethereum || window.avalanche;
  if (!provider) {
    throw new Error('No wallet detected. Please install MetaMask or Core Wallet.');
  }

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: params.chainId }],
    });
  } catch (error) {
    if (error.code === 4902 || error.message?.includes('Unrecognized chain')) {
      // Chain not added — add it (this also switches to it)
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      });
    } else if (error.code === 4001) {
      throw new Error('You rejected the network switch. Please switch to Avalanche Fuji manually.');
    } else {
      throw error;
    }
  }
}
```

### Wallet Compatibility

| Wallet | `wallet_switchEthereumChain` | `wallet_addEthereumChain` | Provider Object |
|--------|------|------|------|
| MetaMask | Yes | Yes | `window.ethereum` |
| Core Wallet | Yes | Yes | `window.ethereum` or `window.avalanche` |
| Phantom (EVM) | Yes | Yes | `window.ethereum` (when EVM mode selected) |
| Coinbase Wallet | Yes | Yes | `window.ethereum` |
| Trust Wallet | Yes | Yes | `window.ethereum` |
| WalletConnect | Yes (via modal) | Yes (via modal) | Via WalletConnect provider |

All major EVM wallets implement these EIPs. The code above works universally.

---

## Part 3: Frontend Integration (ChainBois Website)

### Current Setup

The frontend uses **Thirdweb v5** with these key files:
- `src/context/ThirdwebProviders.js` — wraps app with `ThirdwebProvider`, hardcodes `avalancheFuji`
- `src/lib/thirdwebWallets.js` — wallet list (MetaMask, Keplr, Phantom, Coinbase, Trust)
- `src/components/ConnectWalletButton/ConnectWalletButton.jsx` — renders `<ConnectButton>`

### What Thirdweb v5 Already Handles

Thirdweb v5's `<ConnectButton>` with the `chain` prop **already handles chain switching automatically** for supported wallets. When you set `chain={avalancheFuji}`, the ConnectButton:
1. Detects the user's current chain after connection
2. If not on Fuji, prompts them to switch
3. If Fuji isn't added, adds it first

**This means the main frontend likely already works.** However, to add an explicit network toggle (mainnet ↔ testnet), or to handle edge cases where auto-switch fails, add this:

### Option A: Add a Network Switch Button (Recommended)

Create a new component `src/components/NetworkSwitcher/NetworkSwitcher.jsx`:

```jsx
'use client';

import { useActiveWalletChain, useSwitchActiveWalletChain } from 'thirdweb/react';
import { avalancheFuji, avalanche } from 'thirdweb/chains';

const NETWORKS = [
  { chain: avalancheFuji, label: 'Fuji Testnet', color: '#e74c3c' },
  { chain: avalanche, label: 'Mainnet', color: '#2ecc71' },
];

export default function NetworkSwitcher() {
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();

  const isTestnet = activeChain?.id === avalancheFuji.id;
  const isMainnet = activeChain?.id === avalanche.id;
  const isWrongNetwork = activeChain && !isTestnet && !isMainnet;

  const handleSwitch = async (chain) => {
    try {
      await switchChain(chain);
    } catch (err) {
      console.error('Failed to switch network:', err);
      // Fallback to raw EIP-3085/3326 if thirdweb fails
      await rawSwitchChain(chain.id === avalancheFuji.id);
    }
  };

  if (!activeChain) return null; // No wallet connected

  return (
    <div className="network-switcher">
      {isWrongNetwork && (
        <div className="wrong-network-banner">
          Wrong network detected. Please switch to Avalanche.
          <button onClick={() => handleSwitch(avalancheFuji)}>
            Switch to Fuji Testnet
          </button>
        </div>
      )}
      {!isWrongNetwork && (
        <div className="network-indicator">
          <span className="network-dot" style={{ backgroundColor: isTestnet ? '#e74c3c' : '#2ecc71' }} />
          {isTestnet ? 'Fuji Testnet' : 'Mainnet'}
        </div>
      )}
    </div>
  );
}

// Fallback for wallets where thirdweb's switchChain doesn't work
async function rawSwitchChain(testnet = true) {
  const params = testnet
    ? {
        chainId: '0xA869',
        chainName: 'Avalanche Fuji C-Chain',
        nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
        rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
        blockExplorerUrls: ['https://testnet.snowscan.xyz'],
      }
    : {
        chainId: '0xA86A',
        chainName: 'Avalanche C-Chain',
        nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
        rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
        blockExplorerUrls: ['https://snowscan.xyz'],
      };

  const provider = window.ethereum || window.avalanche;
  if (!provider) throw new Error('No wallet detected');

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: params.chainId }],
    });
  } catch (error) {
    if (error.code === 4902 || error.message?.includes('Unrecognized chain')) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      });
    } else {
      throw error;
    }
  }
}
```

### Option B: Ensure ThirdwebProviders.js Forces Chain Switch

Update `src/context/ThirdwebProviders.js` to include `switchActiveWalletChain` in a useEffect:

```jsx
'use client';

import { ThirdwebProvider, AutoConnect, ChainProvider, useActiveWalletChain, useSwitchActiveWalletChain } from 'thirdweb/react';
import { avalancheFuji } from 'thirdweb/chains';
import { thirdwebClient } from '@/lib';
import { thirdwebWallets, thirdwebAppMetadata } from '@/lib/thirdwebWallets';
import { useEffect } from 'react';

function ChainEnforcer({ children }) {
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();

  useEffect(() => {
    if (activeChain && activeChain.id !== avalancheFuji.id) {
      switchChain(avalancheFuji).catch(console.error);
    }
  }, [activeChain, switchChain]);

  return children;
}

export default function ThirdwebProviders({ children }) {
  return (
    <ThirdwebProvider>
      <AutoConnect
        client={thirdwebClient}
        wallets={thirdwebWallets}
        appMetadata={thirdwebAppMetadata}
        chain={avalancheFuji}
      />
      <ChainProvider chain={avalancheFuji}>
        <ChainEnforcer>
          {children}
        </ChainEnforcer>
      </ChainProvider>
    </ThirdwebProvider>
  );
}
```

This automatically switches the user to Fuji whenever they connect on a different chain.

---

## Part 4: Faucet — Add Wallet Connect + Chain Switching

The faucet is a single vanilla HTML file. We'll add wallet connection using **ethers.js v6 via CDN** (lightweight, no framework needed).

### Changes to `/testnet-faucet/index.html`

#### Step 1: Add ethers.js CDN

Add this in the `<head>` section, after the Google Fonts link:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.4/ethers.umd.min.js"
        integrity="sha512-MnL/RLBFjLMRG/sPGvJPsSOXEHwSJCQcOWTlLJo0IBk/nRl+q/vqJFi7VkAbFqoP4GtZcJJFBo6bPIJEHEvzg=="
        crossorigin="anonymous"></script>
```

#### Step 2: Add Connect Wallet Button

Replace the wallet address input section. Currently:

```html
<input type="text" class="form-input" id="walletAddress" placeholder="0x..." ...>
```

Replace with:

```html
<div class="wallet-section">
  <div class="wallet-row">
    <button id="connectWalletBtn" class="btn btn-connect" onclick="connectWallet()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
      </svg>
      <span id="connectBtnText">Connect Wallet</span>
    </button>
    <span class="network-badge" id="networkBadge" style="display:none;">
      <span class="network-dot"></span>
      <span id="networkName">—</span>
    </span>
  </div>
  <div id="connectedAddress" class="connected-address" style="display:none;">
    <span id="displayAddress"></span>
    <button class="btn-disconnect" onclick="disconnectWallet()" title="Disconnect">✕</button>
  </div>
  <div class="manual-fallback">
    <button class="link-btn" onclick="toggleManualInput()">Or enter address manually</button>
    <div id="manualInputSection" style="display:none;">
      <input type="text" class="form-input" id="walletAddress" placeholder="0x..."
             maxlength="42" spellcheck="false" autocomplete="off">
    </div>
  </div>
</div>
```

#### Step 3: Add CSS Styles

Add these styles inside the existing `<style>` block:

```css
.wallet-section {
  margin-bottom: 1.5rem;
}
.wallet-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.btn-connect {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
}
.btn-connect:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(231,76,60,0.3); }
.btn-connect:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
.btn-connect.connected {
  background: linear-gradient(135deg, #27ae60, #229954);
}
.network-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  background: rgba(255,255,255,0.08);
  border-radius: 20px;
  font-size: 0.8rem;
  color: #ccc;
  white-space: nowrap;
}
.network-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #e74c3c;
}
.network-dot.correct { background: #2ecc71; }
.connected-address {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(39,174,96,0.1);
  border: 1px solid rgba(39,174,96,0.3);
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.85rem;
  color: #2ecc71;
  margin-bottom: 0.75rem;
}
.connected-address span { flex: 1; overflow: hidden; text-overflow: ellipsis; }
.btn-disconnect {
  background: none; border: none; color: #e74c3c; cursor: pointer;
  font-size: 1.1rem; padding: 0 0.25rem; opacity: 0.7;
}
.btn-disconnect:hover { opacity: 1; }
.manual-fallback { text-align: center; }
.link-btn {
  background: none; border: none; color: #888; cursor: pointer;
  font-size: 0.85rem; text-decoration: underline; padding: 0.25rem;
}
.link-btn:hover { color: #bbb; }
```

#### Step 4: Add JavaScript

Add this script block before the closing `</body>` tag (or inside the existing `<script>`):

```javascript
// --- Avalanche Fuji chain parameters ---
const FUJI_CHAIN = {
  chainId: '0xA869',
  chainName: 'Avalanche Fuji C-Chain',
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowscan.xyz'],
};
const FUJI_CHAIN_ID = 43113;

let connectedProvider = null;
let connectedAddress = null;

// Detect wallet provider (MetaMask, Core, Phantom, etc.)
function getProvider() {
  if (window.ethereum) return window.ethereum;
  if (window.avalanche) return window.avalanche;
  return null;
}

async function connectWallet() {
  const provider = getProvider();
  if (!provider) {
    showError('No wallet detected. Please install MetaMask, Core Wallet, or Phantom.');
    return;
  }

  const btn = document.getElementById('connectWalletBtn');
  const btnText = document.getElementById('connectBtnText');
  btn.disabled = true;
  btnText.textContent = 'Connecting...';

  try {
    // Request account access
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) throw new Error('No accounts returned');

    connectedProvider = provider;
    connectedAddress = accounts[0];

    // Switch to Fuji if not already on it
    await ensureFujiNetwork();

    // Update UI
    updateWalletUI();

    // Populate the hidden input for the claim flow
    const input = document.getElementById('walletAddress');
    if (input) {
      input.value = connectedAddress;
      input.dispatchEvent(new Event('input'));
    }

    // Listen for chain/account changes
    provider.on('chainChanged', handleChainChanged);
    provider.on('accountsChanged', handleAccountsChanged);

  } catch (err) {
    if (err.code === 4001) {
      btnText.textContent = 'Connect Wallet';
    } else {
      console.error('Wallet connection failed:', err);
      btnText.textContent = 'Connect Wallet';
      showError('Failed to connect wallet: ' + (err.message || 'Unknown error'));
    }
  } finally {
    btn.disabled = false;
  }
}

async function ensureFujiNetwork() {
  if (!connectedProvider) return;

  const chainId = await connectedProvider.request({ method: 'eth_chainId' });
  const currentChainId = parseInt(chainId, 16);

  if (currentChainId === FUJI_CHAIN_ID) return; // Already on Fuji

  try {
    await connectedProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: FUJI_CHAIN.chainId }],
    });
  } catch (error) {
    // Chain not added — add it (error 4902, or some wallets use different codes)
    if (error.code === 4902 || error.data?.originalError?.code === 4902 ||
        error.message?.includes('Unrecognized chain') || error.message?.includes('wallet_addEthereumChain')) {
      await connectedProvider.request({
        method: 'wallet_addEthereumChain',
        params: [FUJI_CHAIN],
      });
    } else if (error.code === 4001) {
      showError('Please switch to Avalanche Fuji Testnet to use the faucet.');
      throw error;
    } else {
      throw error;
    }
  }
}

function handleChainChanged(chainIdHex) {
  const chainId = parseInt(chainIdHex, 16);
  updateNetworkBadge(chainId);
  if (chainId !== FUJI_CHAIN_ID) {
    showError('Please switch to Avalanche Fuji Testnet.');
    ensureFujiNetwork().catch(console.error);
  }
}

function handleAccountsChanged(accounts) {
  if (!accounts || accounts.length === 0) {
    disconnectWallet();
    return;
  }
  connectedAddress = accounts[0];
  updateWalletUI();
  const input = document.getElementById('walletAddress');
  if (input) {
    input.value = connectedAddress;
    input.dispatchEvent(new Event('input'));
  }
}

function disconnectWallet() {
  if (connectedProvider) {
    connectedProvider.removeListener('chainChanged', handleChainChanged);
    connectedProvider.removeListener('accountsChanged', handleAccountsChanged);
  }
  connectedProvider = null;
  connectedAddress = null;

  document.getElementById('connectBtnText').textContent = 'Connect Wallet';
  document.getElementById('connectWalletBtn').classList.remove('connected');
  document.getElementById('connectedAddress').style.display = 'none';
  document.getElementById('networkBadge').style.display = 'none';

  const input = document.getElementById('walletAddress');
  if (input) {
    input.value = '';
    input.dispatchEvent(new Event('input'));
  }
}

function updateWalletUI() {
  if (!connectedAddress) return;

  const btn = document.getElementById('connectWalletBtn');
  const btnText = document.getElementById('connectBtnText');
  const addrDisplay = document.getElementById('connectedAddress');
  const displayAddr = document.getElementById('displayAddress');

  btn.classList.add('connected');
  btnText.textContent = 'Connected';
  displayAddr.textContent = connectedAddress.slice(0, 6) + '...' + connectedAddress.slice(-4);
  addrDisplay.style.display = 'flex';

  // Update network badge
  if (connectedProvider) {
    connectedProvider.request({ method: 'eth_chainId' }).then(chainIdHex => {
      updateNetworkBadge(parseInt(chainIdHex, 16));
    });
  }
}

function updateNetworkBadge(chainId) {
  const badge = document.getElementById('networkBadge');
  const dot = badge.querySelector('.network-dot');
  const name = document.getElementById('networkName');

  badge.style.display = 'inline-flex';

  if (chainId === FUJI_CHAIN_ID) {
    dot.classList.add('correct');
    name.textContent = 'Fuji Testnet';
  } else if (chainId === 43114) {
    dot.classList.remove('correct');
    name.textContent = 'Mainnet (wrong)';
  } else {
    dot.classList.remove('correct');
    name.textContent = 'Wrong Network';
  }
}

function toggleManualInput() {
  const section = document.getElementById('manualInputSection');
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// Show error helper (integrate with existing showError if it exists)
function showError(msg) {
  const existing = document.querySelector('.error-card');
  if (existing) existing.remove();
  // Use existing error display mechanism or console
  console.error('[Wallet]', msg);
  alert(msg); // Replace with your toast/notification system
}
```

#### Step 5: Update `handleClaim()` to use connected wallet

In the existing `handleClaim()` function, change the address retrieval:

```javascript
// Before:
const address = document.getElementById('walletAddress').value.trim();

// After:
const address = connectedAddress || document.getElementById('walletAddress').value.trim();
```

---

## Part 5: Testing Checklist

### Frontend (ChainBois Website)

- [ ] Connect with MetaMask on Ethereum mainnet → should auto-switch to Fuji
- [ ] Connect with MetaMask that has never seen Fuji → should prompt to add network
- [ ] Connect with Core Wallet → should work identically
- [ ] Connect with Phantom (EVM mode) → should work
- [ ] Connect with Coinbase Wallet → should work
- [ ] Switch to wrong network while connected → should prompt to switch back
- [ ] Reject the switch prompt → should show "wrong network" indicator

### Faucet

- [ ] Click "Connect Wallet" with MetaMask → should connect and populate address
- [ ] Connect on wrong network → should prompt to switch to Fuji
- [ ] Switch accounts in wallet → address should update
- [ ] Click disconnect → should clear address
- [ ] Use "enter address manually" fallback → should work as before
- [ ] Claim with connected wallet → should use connected address
- [ ] Page reload → wallet should not auto-reconnect (stateless)

---

## Part 6: Production Toggle (Mainnet vs Testnet)

For production, change the chain config based on environment:

### Frontend (Next.js)

In `src/context/ThirdwebProviders.js`:
```javascript
import { avalanche, avalancheFuji } from 'thirdweb/chains';

const activeChain = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? avalanche : avalancheFuji;
```

### Faucet

The faucet is testnet-only by design, so no mainnet toggle needed.

---

## Summary

| Feature | Frontend (Thirdweb v5) | Faucet (Vanilla JS) |
|---------|----------------------|---------------------|
| Auto chain switch on connect | Already handled by `<ConnectButton chain={avalancheFuji}>` + add `ChainEnforcer` component for edge cases | New: `ensureFujiNetwork()` after `eth_requestAccounts` |
| Wrong network detection | Add `NetworkSwitcher` component using `useActiveWalletChain()` | New: `handleChainChanged` listener + badge UI |
| Add network if missing | Handled by Thirdweb internally | New: fallback from `wallet_switchEthereumChain` error 4902 to `wallet_addEthereumChain` |
| Wallet Connect button | Already exists (`<ConnectButton>`) | New: replace text input with Connect button + manual fallback |
| Works with MetaMask | Yes | Yes |
| Works with Core Wallet | Yes | Yes |
| Works with Phantom | Yes | Yes |
| Works with Coinbase | Yes | Yes |
| Works with Trust | Yes | Yes |
