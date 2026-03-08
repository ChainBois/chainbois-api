# Phase 5: Armory + Points

## Scope
Weapon AND ChainBoi NFT purchases from platform wallets + points-to-$BATTLE conversion.

## Key Design Decisions

1. **No auth required** — wallet address identifies the user (from MongoDB, stored during Phase 1 login)
2. **ChainBoi NFTs sold on armory page** (same as weapons) — no separate claim flow
3. **NFT price in AVAX** (configurable in Settings.nftPrice, default 0.001 for testnet)
4. **Weapon price in $BATTLE** (stored on WeaponNft model)
5. **Points → $BATTLE is a transfer** from rewards wallet (not mint) at 1:1 ratio
6. **Points accumulate incrementally** via syncScoresJob (delta, not overwrite)
7. **On-chain tx verification** proves the buyer is who they say they are

## What Already Exists
- WeaponNFT contract deployed
- WeaponNft model with price field
- ChainboiNft model (no price field — uses Settings.nftPrice)
- contractUtils: transferNft, transferWeaponNft, getBattleBalance, transferBattleTokens
- Transaction model with relevant types
- User model with pointsBalance
- Wallet roles: weapon_store, nft_store, rewards

## Endpoints

### Armory (all public)
| Method | Path | Purpose |
|--------|------|---------|
| GET | /armory/weapons | List weapons grouped by category |
| GET | /armory/weapons/:category | Weapons in one category |
| GET | /armory/weapon/:weaponId | Weapon detail + payment address |
| GET | /armory/nfts | ChainBoi NFTs for sale + price |
| GET | /armory/nft/:tokenId | Single NFT detail + payment address |
| POST | /armory/purchase/weapon | Verify $BATTLE payment, transfer weapon |
| POST | /armory/purchase/nft | Verify AVAX payment, transfer NFT |
| GET | /armory/balance/:address | Points + $BATTLE balance |

### Points (all public)
| Method | Path | Purpose |
|--------|------|---------|
| GET | /points/:address | Points balance + conversion info |
| POST | /points/convert | Convert points to $BATTLE |
| GET | /points/history/:address | Conversion + purchase history |

## Purchase Flow
1. Frontend shows item with price and paymentAddress
2. User sends payment via Thirdweb wallet (AVAX for NFTs, $BATTLE for weapons)
3. Frontend receives txHash from wallet
4. Frontend POSTs { address, txHash, ... } to purchase endpoint
5. Backend verifies payment on-chain (sender, recipient, amount)
6. Backend transfers asset from platform wallet to user
7. Backend records Transaction, updates ownership, syncs to Firebase

## Testnet Pricing
- ChainBoi NFT: 0.001 AVAX
- Weapons: 1-5 $BATTLE
- Points conversion: 1:1
