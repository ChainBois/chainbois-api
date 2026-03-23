# Chain Switching — Technical Reference

> **Purpose:** Copy-paste-ready chain parameters and code patterns for Avalanche network switching. Use as a quick reference when building new components or tools. For the full website wallet architecture, see [WALLET_CONNECT_FLOW.md](./WALLET_CONNECT_FLOW.md).

---

## Chain Parameters

### Avalanche Fuji Testnet (current)

```javascript
// Thirdweb v5 (used in the website)
import { avalancheFuji } from 'thirdweb/chains'  // chain ID 43113

// EIP-3085 format (for raw provider calls)
const AVALANCHE_FUJI = {
  chainId: '0xA869',                    // 43113 decimal
  chainName: 'Avalanche Fuji C-Chain',
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowscan.xyz'],
};
```

### Avalanche C-Chain Mainnet (for production)

```javascript
import { avalanche } from 'thirdweb/chains'  // chain ID 43114

const AVALANCHE_MAINNET = {
  chainId: '0xA86A',                    // 43114 decimal
  chainName: 'Avalanche C-Chain',
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://snowscan.xyz'],
};
```

---

## Pattern: Chain Enforcement (Thirdweb v5 / React)

Already implemented in `src/context/ThirdwebProviders.js` — wraps the entire app and auto-switches to Fuji:

```javascript
import { useActiveWalletChain, useSwitchActiveWalletChain } from 'thirdweb/react'
import { avalancheFuji } from 'thirdweb/chains'

function ChainEnforcer({ children }) {
  const activeChain = useActiveWalletChain()
  const switchChain = useSwitchActiveWalletChain()

  useEffect(() => {
    if (activeChain && activeChain.id !== avalancheFuji.id) {
      switchChain(avalancheFuji).catch(console.error)
    }
  }, [activeChain, switchChain])

  return children
}
```

Uses EIP-3085/3326 under the hood via Thirdweb.

---

## Pattern: Switch or Add Chain (Vanilla JS)

For standalone pages or tools outside of the Thirdweb React app (e.g., the testnet faucet uses this pattern):

```javascript
async function ensureChain(provider, chainParams, expectedChainId) {
  const currentHex = await provider.request({ method: 'eth_chainId' });
  if (parseInt(currentHex, 16) === expectedChainId) return;

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainParams.chainId }],
    });
  } catch (error) {
    if (error.code === 4902 ||
        error.data?.originalError?.code === 4902 ||
        error.message?.includes('Unrecognized chain')) {
      // Chain not in wallet — add it (also switches automatically)
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [chainParams],
      });
    } else if (error.code === 4001) {
      throw new Error('User rejected the network switch.');
    } else {
      throw error;
    }
  }
}

// Usage:
await ensureChain(window.ethereum, AVALANCHE_FUJI, 43113);
```

### Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| `4001` | User rejected | Show message, don't retry |
| `4902` | Chain not in wallet | Fall back to `wallet_addEthereumChain` |
| `-32002` | Request already pending | Wallet has an open popup — wait |

---

## Wallet Compatibility

| Wallet | Switch | Add | Provider |
|--------|:---:|:---:|------|
| MetaMask | Yes | Yes | `window.ethereum` |
| Core Wallet | Yes | Yes | `window.ethereum` or `window.avalanche` |
| Phantom (EVM) | Yes | Yes | `window.phantom.ethereum` |
| Coinbase Wallet | Yes | Yes | `window.ethereum` |
| Trust Wallet | Yes | Yes | `window.ethereum` |
| WalletConnect | Yes | Yes | Via WalletConnect provider |

All major EVM wallets support EIP-3085/3326. The patterns above work universally.
