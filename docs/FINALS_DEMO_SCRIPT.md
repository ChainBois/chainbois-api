# ChainBois Finals — Demo Video Script & Recording Guide

**Total Duration Target: 6-7 minutes** (max 7 min allowed)
**Format: Screen recording with voiceover + slides between sections**

---

## PRE-RECORDING CHECKLIST

Before you start recording, make sure:
- [ ] MetaMask installed with Fuji testnet configured
- [ ] A **fresh wallet** that has NOT claimed a starter pack (for the faucet demo)
- [ ] Fund that wallet with ~5 AVAX from the [Avalanche Fuji Faucet](https://faucet.avax.network/)
- [ ] Game downloaded and installed (Windows build)
- [ ] Game account created (email + password)
- [ ] Website loaded: https://chainbois-true.vercel.app
- [ ] Faucet loaded: https://chainbois-testnet-faucet.vercel.app
- [ ] Have some pre-recorded gameplay clips ready (30-60 sec of action)
- [ ] Discord open to show webhook notifications (optional but impressive)
- [ ] Snowtrace Fuji explorer open in a tab: https://testnet.snowtrace.io
- [ ] Screen recording software running (OBS, Loom, etc.)
- [ ] Microphone tested

---

## SECTION 1: INTRO SLIDE (0:00 - 0:30)

**[SHOW SLIDE 1: Title]**

**Voiceover:**
> "Hey judges, we're ChainBois — a Web3 competitive shooter built on Avalanche. We're not pitching a concept. Everything you're about to see is live, deployed on Fuji testnet, and playable right now. Let me walk you through the full player experience."

**[SHOW SLIDE 2: Problem/Solution — 10 sec]**

> "Gaming is a $230 billion market, but players own nothing. In ChainBois, your NFT character evolves as you play — leveling up on-chain, unlocking characters, and competing in tournaments for real prizes. Your skill has real value."

---

## SECTION 2: DOWNLOAD THE GAME (0:30 - 1:00)

**[SCREEN: Show the ChainBois website landing page]**

**Voiceover:**
> "First — the game. Players visit our website and download the game directly. We have Windows and mobile builds."

**Actions:**
1. Show the landing page hero section with the download buttons
2. Click "Download Desktop Build" — show the download starting
3. Quick scroll through the landing page to show features, leaderboard preview, roadmap

> "While the game downloads, let's get our wallet set up with some assets."

---

## SECTION 3: TESTNET FAUCET — CLAIM STARTER PACK (1:00 - 2:00)

**[SCREEN: Navigate to https://chainbois-testnet-faucet.vercel.app]**

**Voiceover:**
> "We built a testnet faucet that gives new players everything they need to start — 2 ChainBoi NFTs, 8 weapons across every category, and 1,000 $BATTLE tokens. All free, one click."

**Actions:**
1. Show the faucet page — point out the "What You Get" cards
2. Click "Connect Wallet" — show wallet selector (EIP-6963 multi-wallet discovery)
3. Select MetaMask → approve connection
4. Show it auto-switches to Avalanche Fuji if needed
5. Click "Claim Starter Pack"
6. **Show the progress bar** as 10 transactions execute in real-time
7. Point out each step completing: NFT mints, weapon mints, $BATTLE transfer
8. Show the success screen with NFT images and weapon thumbnails

> "That's 10 on-chain transactions — all handled by our backend. The player just clicks one button. Every transaction is verifiable on Snowtrace."

**[Optional: Quick flash to Snowtrace showing a transaction]**

---

## SECTION 4: REGISTER & CONNECT WALLET ON WEBSITE (2:00 - 2:45)

**[SCREEN: Back to the main website]**

**Voiceover:**
> "Now the player creates their account. We support both Web2 and Web3 players. Web3 players connect their wallet on our website."

**Actions:**
1. Click "Play Now" or the wallet connect button
2. Show the Request Access page
3. Connect wallet via Thirdweb — show the wallet chooser modal
4. Fill in email, username, password
5. Click Sign Up / Login
6. Show the redirect to the Battleground page (logged in state)
7. Point out the wallet address and $BATTLE balance in the navbar

> "Our backend automatically checks what NFTs and weapons you own on-chain, then syncs that data to Firebase — which is how the Unity game knows what to unlock for you."

---

## SECTION 5: GAME — PLAY & EARN (2:45 - 3:45)

**[SCREEN: Show game launching OR pre-recorded gameplay clips]**

**Voiceover:**
> "Now for the fun part. ChainBois is a third-person competitive shooter built in Unity. We have seven game modes — Frontline, Team Deathmatch, Kill Confirmed, Battle Royale, and more."

**Actions:**
1. Show the game main menu
2. Show choosing "Play as Web3 Player" (or the web3 flow)
3. Show 20-30 seconds of actual gameplay footage — shooting, scoring, action
4. Show the score screen at the end of a match

> "As you play, the game writes your scores to Firebase in real-time. Our backend polls every 5 minutes, validates scores through our anti-cheat system — plausibility checks, velocity limits, threat scoring — then updates the leaderboard. No direct API calls from the game needed."

**[SHOW SLIDE: Architecture diagram — Game → Firebase → Backend → MongoDB → Leaderboard]**

> "This Firebase bridge pattern means game developers don't need to change anything. The backend handles all the complexity."

---

## SECTION 6: TRAINING ROOM — LEVEL UP NFTs (3:45 - 4:30)

**[SCREEN: Navigate to Training Room on the website]**

**Voiceover:**
> "Back on the website — the Training Room. This is where players level up their ChainBoi NFTs."

**Actions:**
1. Show the Training Room page with your ChainBoi NFT collection
2. Click on an NFT card to open the detail modal
3. Point out the current level (e.g., "Level 0 — Private")
4. Show the "Level Up" button with cost (1 AVAX)
5. Click Level Up → show the wallet transaction prompt
6. Approve the transaction
7. Show the level updating to Level 1 — Corporal
8. Mention: "Each level unlocks 4 new characters in-game — up to 32 total at Field Marshal rank"

> "Leveling up is an on-chain operation. The backend verifies your AVAX payment, then calls setLevel on the smart contract. The NFT metadata updates dynamically — including a new badge overlay generated through Cloudinary and pinned to IPFS. Marketplaces like Joepegs automatically refresh via EIP-4906."

---

## SECTION 7: ARMORY — BUY WEAPONS (4:30 - 5:15)

**[SCREEN: Navigate to the Armory page]**

**Voiceover:**
> "The Armory is our weapon shop. 13 weapons across 8 categories — assault rifles, SMGs, marksman rifles, shotguns, and more."

**Actions:**
1. Show the Armory grid with weapon cards
2. Scroll through to show different categories
3. Click on a weapon — show the detail with price in $BATTLE
4. Click "Buy" → show the $BATTLE token transfer
5. Approve the transaction
6. Show the weapon appearing in your collection

> "Weapons are purchased with $BATTLE tokens. When the weapon store accumulates enough tokens, our tokenomics sweep job kicks in every 6 hours — burning a percentage on-chain and recycling the rest back to the rewards pool. This makes $BATTLE genuinely deflationary."

**[SHOW SLIDE: Tokenomics diagram — Health Tiers, Burn/Recycle cycle]**

> "We have 5 health tiers — from Abundant to Critical — that dynamically adjust conversion rates, burn percentages, and airdrop amounts. The system is asymptotically sustainable — it slows down but never stops."

---

## SECTION 8: INVENTORY — VIEW YOUR ASSETS (5:15 - 5:30)

**[SCREEN: Navigate to the Inventory page]**

**Voiceover:**
> "The Inventory page shows everything you own — ChainBoi NFTs, weapons, $BATTLE balance, and full transaction history. All pulled directly from the blockchain."

**Actions:**
1. Quick scroll through the Inventory showing NFTs and weapons
2. Point out transaction history entries

---

## SECTION 9: LEADERBOARD & TOURNAMENTS (5:30 - 6:15)

**[SCREEN: Navigate to the Battleground page]**

**Voiceover:**
> "This is where it gets competitive. We have 7 tournament tiers — one for each player level. Tournaments run on 5-day cycles with automatic prize distribution."

**Actions:**
1. Show Active Tournaments with live leaderboards
2. Point out the countdown timer
3. Show prize pool info (AVAX for 1st/2nd, $BATTLE for 3rd)
4. Show Completed Tournaments with past winners
5. Show Upcoming Tournaments with start countdowns

> "When a tournament ends, our backend automatically snapshots the leaderboard, calculates winners, and distributes prizes — AVAX to first and second place, $BATTLE to third. No manual claiming needed. Winners get a Discord notification instantly."

**[Optional: Show Discord webhook notification of a tournament result]**

---

## SECTION 10: TECHNICAL DEPTH & CLOSING (6:15 - 7:00)

**[SHOW SLIDE: Technical Overview]**

**Voiceover:**
> "Under the hood: 3 smart contracts on Avalanche C-Chain — an ERC-20 with a hard 10 million cap, and two ERC-721s with on-chain level storage and weapon names. 50+ API endpoints. 10 automated cron jobs handling everything from score syncing to wallet health monitoring to platform solvency audits. 268 passing tests."

**[SHOW SLIDE: What's Next]**

> "Post-hackathon, we're targeting mainnet deployment, a loot box system, battle passes, mythic weapon upgrades, and ultimately an Avalanche Subnet for zero-gas gameplay at scale."

**[SHOW SLIDE: Team / Final]**

> "We built this in 8 days. The game is live, the contracts are deployed, the economy works. ChainBois — competitive gaming where your skill has real on-chain value. Thanks for watching."

---

## RECORDING TIPS

1. **Keep transitions snappy** — don't wait for pages to fully load on camera; cut in post
2. **Pre-load all pages** in separate tabs so you can switch quickly
3. **Use a fresh wallet** for the faucet demo so the claim flow is genuine
4. **Pre-record gameplay** separately — splice in the best 30-sec action clips
5. **Slides should be brief** — 5-10 seconds each, just enough for the voiceover
6. **Show real transactions** — the on-chain verification is your credibility
7. **Energy matters** — speak with confidence, this is a competition
8. **Time yourself** — practice once at 1.5x pace, then slow down for the real recording
