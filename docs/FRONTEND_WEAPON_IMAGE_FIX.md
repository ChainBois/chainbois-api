# Frontend Weapon Image Fix Guide

> **Purpose:** Weapon images were not loading on the frontend. This document explains the root cause, what was already fixed on the API side, and what the frontend developer needs to change. Includes exact before/after code and a data flow diagram.

---

## TL;DR

The API now returns two new fields on every weapon object: `name` and `imageUrl`. The simplest fix is to use `weapon.imageUrl` as the image source directly — it's a ready-to-use HTTP URL that works in `<img>` / Next.js `<Image>` tags with no conversion needed.

---

## Root Cause

There were two issues causing weapon images to fail:

### 1. Field name mismatch (critical — images never load)

The API returned `weaponName` but the frontend reads `weapon.name`.

```
API response:    { "weaponName": "AR M4 MK18", ... }
Frontend reads:  weapon.name  →  undefined
```

Since `weapon.name` was always `undefined`, `getWeaponImageCandidates()` in `ipfsAssetUrls.js` returned an empty array. With no image URLs to try, `InventoryCard` fell back to static placeholder images every time.

This also affected the card **title** — `InventoryCard.jsx` line 47 renders `weapon?.name || 'Weapon NFT'`, so every weapon card showed "Weapon NFT" instead of the actual name.

### 2. API returned `imageUri` as `ipfs://` (not directly usable)

The `imageUri` field contained raw IPFS URIs like `ipfs://bafybeigab.../02-AR-M4-MK18.jpeg`. Browsers can't render `ipfs://` URLs — they need to be converted to HTTP gateway URLs first. The frontend has its own conversion logic in `ipfsAssetUrls.js`, but it never ran because of issue #1 above.

---

## What Changed on the API (already done)

All weapon endpoints now return two new fields on every weapon object:

| New Field  | Type   | Example | Description |
|------------|--------|---------|-------------|
| `name`     | string | `"AR M4 MK18"` | Alias for `weaponName` — both fields are always identical |
| `imageUrl` | string | `"https://gateway.pinata.cloud/ipfs/bafybeigabwclqqsu4xz6konsq6dav3wva3xh3vlxcjw72vkoo6wxllxjfe/02-AR-M4-MK18.jpeg"` | Pre-resolved HTTP URL — use directly in `<img src>` |

**Full example — API weapon object now looks like:**
```json
{
  "tokenId": 2,
  "weaponName": "AR M4 MK18",
  "name": "AR M4 MK18",
  "category": "assault",
  "tier": "base",
  "imageUri": "ipfs://bafybeigabwclqqsu4xz6konsq6dav3wva3xh3vlxcjw72vkoo6wxllxjfe/02-AR-M4-MK18.jpeg",
  "imageUrl": "https://gateway.pinata.cloud/ipfs/bafybeigabwclqqsu4xz6konsq6dav3wva3xh3vlxcjw72vkoo6wxllxjfe/02-AR-M4-MK18.jpeg",
  "contractAddress": "0xa2AFf3105668124A187b1212Ab850bf8b98dD07d",
  "metadataUri": ""
}
```

**Affected endpoints** (all return the new fields):
| Endpoint | Where weapons appear |
|----------|---------------------|
| `GET /armory/weapons` | Grouped by category: `data.assault[0]`, `data.smg[0]`, etc. |
| `GET /armory/weapons/:category` | `data[0]`, `data[1]`, etc. |
| `GET /armory/weapon/:weaponId` | Single weapon in `data` |
| `GET /inventory/:address` | `data.weapons[0]`, `data.weapons[1]`, etc. |
| `GET /inventory/:address/weapons` | `data[0]`, `data[1]`, etc. |
| `POST /auth/login` | `data.weapons[0]`, `data.weapons[1]`, etc. |
| `POST /game/verify-assets` | `data.ownedWeaponNfts[0]`, etc. |

---

## What Needs to Change on the Frontend

### Option A: Use `imageUrl` directly (recommended — simplest fix)

Since the API now provides a ready-to-use HTTP URL, you can skip all the client-side IPFS gateway logic.

**File: `src/components/InventoryCard/InventoryCard.jsx`**

Replace the image candidate logic (lines 29-44) and handleImageError (lines 57-61):

```jsx
// ❌ BEFORE (lines 3, 29-44, 57-61)
import { cf, getWeaponImageCandidates } from '@/utils'
// ...
const imageCandidates = useMemo(
  () =>
    getWeaponImageCandidates({
      tokenId: weapon?.tokenId,
      name: weapon?.name,
    }),
  [weapon?.name, weapon?.tokenId],
)

const [imageIndex, setImageIndex] = useState(0)

useEffect(() => {
  setImageIndex(0)
}, [weapon?.name, weapon?.tokenId])

const imageSrc = imageCandidates[imageIndex] ?? showcase
// ...
const handleImageError = () => {
  if (imageIndex < imageCandidates.length - 1) {
    setImageIndex((current) => current + 1)
  }
}
```

Here's the complete simplified component after the change:

```jsx
// ✅ AFTER — src/components/InventoryCard/InventoryCard.jsx
'use client'

import { cf } from '@/utils'
import s from '@/styles'
import i from './InventoryCard.module.css'
import Image from 'next/image'
import Inventory_1 from '@/assets/img/Inventory_1.png'
import Inventory_2 from '@/assets/img/Inventory_2.png'
import Inventory_3 from '@/assets/img/Inventory_3.png'
import Inventory_4 from '@/assets/img/Inventory_4.png'
import BuyButton from '../BuyButton'
import { useMemo } from 'react'

export default function InventoryCard({ pseudoIndex = 0, weapon = {} }) {
  const showcase = useMemo(() => {
    const index = (pseudoIndex + 1) % 3
    switch (index) {
      case 0: return Inventory_1
      case 1: return Inventory_2
      case 2: return Inventory_3
      case 3: return Inventory_4
    }
  }, [pseudoIndex])

  const imageSrc = weapon?.imageUrl || showcase

  const title = useMemo(() => {
    return weapon?.name || 'Weapon NFT'
  }, [weapon?.name])

  const description = useMemo(() => {
    if (Number.isInteger(weapon?.tokenId)) {
      return `Weapon token #${weapon.tokenId}`
    }
    return 'Weapon NFT linked to your wallet.'
  }, [weapon?.tokenId])

  return (
    <section className={cf(s.flex, s.flexCenter, i.inventoryCard)}>
      <div className={cf(s.wMax, s.flex, s.flexCenter, i.cardWrapper)}>
        <figure className={cf(s.wMax, s.flex, s.flexCenter, i.showcase)}>
          <Image
            src={imageSrc}
            alt={title}
            fill
            unoptimized={typeof imageSrc === 'string'}
            className={cf(s.wMax, s.hMax, s.flex, s.flexCenter, i.img)}
          />
        </figure>
        <div className={cf(s.wMax, s.flex, s.flexCenter, i.content)}>
          <header className={cf(s.wMax, s.flex, s.flexCenter, i.header)}>
            <h3 className={cf(s.wMax, s.tLeft, i.title)}>{title}</h3>
            <p className={cf(s.wMax, s.tLeft, i.description)}>
              {description}
            </p>
          </header>
          <footer className={cf(s.wMax, s.flex, s.flexCenter, i.footer)}>
            <BuyButton buyButton={i.buyButton} sell />
          </footer>
        </div>
      </div>
    </section>
  )
}
```

**What changed vs the original:**
- Removed `getWeaponImageCandidates` import (no longer needed)
- Removed `useState` and `useEffect` imports (no longer needed)
- Removed `imageCandidates` useMemo, `imageIndex` state, and `setImageIndex` effect
- Replaced `imageCandidates[imageIndex] ?? showcase` with `weapon?.imageUrl || showcase`
- Removed `onError={handleImageError}` from `<Image>` — if the URL fails, the `showcase` fallback shows
- Everything else (title, description, layout, BuyButton) stays the same

**Why `unoptimized` still works:** When `imageSrc` is a remote URL string → `typeof` is `'string'` → `unoptimized={true}` → Next.js passes through the URL as-is. When it's a static import fallback → `typeof` is `'object'` → `unoptimized={false}` → Next.js optimizes it. This is the correct behavior, no change needed.

**Next.js Image note:** Your `next.config.mjs` already has `gateway.pinata.cloud` whitelisted in `remotePatterns` (line 25), so the `imageUrl` will work with Next.js `<Image>` component.

### Option B: Keep existing multi-gateway fallback logic

If you want to keep the 3-gateway fallback strategy in `getWeaponImageCandidates`, the `name` field from the API now makes it work without any component changes. The title display also works now.

**However**, there are two bugs in `src/utils/ipfsAssetUrls.js` that need fixing if you keep this approach:

#### Bug 1: `normalizeWeaponFileName` corrupts "M-9 Bayonet"

**File: `src/utils/ipfsAssetUrls.js`, line 16**

```js
// ❌ CURRENT — the replace on line 16 turns "M-9-Bayonet" into "M9-Bayonet"
const normalizeWeaponFileName = (name = '') =>
  String(name)
    .trim()
    .replace(/\s/g, '-')       // "M-9 Bayonet" → "M-9-Bayonet" ✅
    .replace(/-9-/g, '9-')     // "M-9-Bayonet" → "M9-Bayonet"  ❌ WRONG
    .replace(/&/g, '')
```

The actual IPFS filename is `08-M-9-Bayonet.jpeg`. The extra `.replace(/-9-/g, '9-')` produces `08-M9-Bayonet.jpeg`, which doesn't exist on IPFS. Remove line 16:

```js
// ✅ FIXED
const normalizeWeaponFileName = (name = '') =>
  String(name)
    .trim()
    .replace(/\s/g, '-')
    .replace(/&/g, '')
```

This matches the normalization used by the API.

#### Bug 2: `tokenId` used as IPFS file number (will break if weapons are minted out of order)

**File: `src/utils/ipfsAssetUrls.js`, line 39**

```js
// CURRENT — uses tokenId as the file number prefix
`${gateway}/${WEAPONS_CID}/${String(tokenId).padStart(2, '0')}-${normalizedName}.jpeg`
```

The IPFS filenames use a fixed numbering (01 = AM-18, 02 = AR M4 MK18, etc.) from a `WEAPON_FILE_MAP`, not the on-chain token ID. Right now they happen to match because the 13 weapons were minted in the same order, but this assumption will break if weapons are ever added, removed, or minted in a different sequence.

If keeping Option B, either:
- Maintain a local `WEAPON_FILE_MAP` matching the API's (the mapping is: AM-18=01, AR M4 MK18=02, SPAS-12=03, H&K MP5=04, Barrett M82=05, Sawed-Off Shotgun=06, M32A1 MSGL=07, M-9 Bayonet=08, Stoner 96=09, AK74M=10, SRS99G-S6 AM=11, Colt M1911=12, UMP 45=13), or
- Use `imageUrl` from the API where available and keep `getWeaponImageCandidates` only as a last-resort fallback

---

## Armory Page (when wiring to API)

The armory page (`src/app/armory/page.jsx`) currently uses hardcoded mock data with static imports (`AR.png`, `MKR.png`, `SMG.png`). When you connect it to the API's `GET /armory/weapons` endpoint, the response fields map to `ArmoryCard` props like this:

```jsx
<ArmoryCard
  image={weapon.imageUrl}    // HTTP URL
  name={weapon.name}         // "AR M4 MK18"
  description={weapon.description}  // from GET /armory/weapon/:weaponId
  price={weapon.price}       // number in $BATTLE
/>
```

**Next.js Image gotcha:** `ArmoryCard.jsx` currently uses `<Image src={image} ... />` without `fill` or explicit `width`/`height`. This works with static imports (Next.js infers dimensions), but **remote URL strings require explicit sizing**. When you switch from static imports to `imageUrl`, you'll need to either:
- Add `fill` to the `<Image>` tag (and make sure the parent has `position: relative` + defined dimensions), or
- Add explicit `width` and `height` props, or
- Use `unoptimized` and set dimensions via CSS

**Note on `description`:** This field is only available from the weapon detail endpoint (`GET /armory/weapon/:weaponId`), not the list endpoints. On the list view, you could show `weapon.category` or `weapon.tier` instead, or fetch details per weapon.

---

## Data Flow Reference

For context, here's how weapon data flows from the API to the components:

```
API (auth/login or game/verify-assets)
  ↓
Auth.js context (applyUserPayload / verifyAssets)
  ↓  stores in:  user.weapons = [ { tokenId, weaponName, name, imageUrl, ... }, ... ]
  ↓
Inventory page (src/app/inventory/page.jsx)
  ↓  reads:  user?.weapons
  ↓
InventoryCard component
  ↓  reads:  weapon.name (title), weapon.imageUrl (image), weapon.tokenId (description)
  ↓
Next.js <Image> component
  ↓  src={imageUrl}  →  "https://gateway.pinata.cloud/ipfs/..."
  ↓
Browser renders weapon image ✅
```

---

## Quick Test

After deploying the API changes, you can verify the new fields by hitting the inventory endpoint directly in your browser or with curl:

```
GET /api/v1/inventory/<your-wallet-address>/weapons
```

Every weapon in the response should now have both `name` and `imageUrl` populated. You can paste the `imageUrl` value directly into your browser to confirm the image loads.

---

## Summary

| Item | Status |
|------|--------|
| API returns `name` field (alias for `weaponName`) | Done |
| API returns `imageUrl` (HTTP gateway URL) | Done |
| Phase 5 & 6 FRONTEND_API.md updated with new fields | Done |
| Frontend: use `weapon.imageUrl` as image source | **Action needed** |
| Frontend: card title now shows real name via `weapon.name` | Works automatically (no code change needed) |
| Frontend: fix `normalizeWeaponFileName` bug (Option B only) | **Action needed if keeping IPFS logic** |
| Frontend: fix tokenId-as-file-number assumption (Option B only) | **Action needed if keeping IPFS logic** |
