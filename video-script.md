# ChainBois — 5-Minute Video Script

**Target length: ~4:30** (leaves buffer under 5 min)

---

## INTRO (0:00 - 0:30)

> What if your kills, your wins, and your grind in a shooter game actually meant something — something you truly own?

> That's ChainBois. A play-to-earn third-person shooter built on Avalanche, where your characters are NFTs, your weapons are NFTs, and every match you play earns you real tokens.

> We built this for the Avalanche Build Games Hackathon, and in this video I'll walk you through what we've built, how it works, and where we're headed.

---

## THE GAME (0:30 - 1:15)

> ChainBois is a full multiplayer third-person shooter — it's already playable on both PC and Android.

> We have seven game modes:
> - **Frontline** — large-scale team combat
> - **Team Deathmatch** — classic team vs team
> - **Kill Confirmed** — collect dog tags to score
> - **Gun Fight** — tight, tactical small-team fights
> - **Battle Royale** — last player standing
> - And two more in development: **Capture the Flag** and **Search and Destroy**

> The game is built in Unity. Players download it, create an account, and they're in. But the magic happens when they connect a wallet — that's when their blockchain assets come to life inside the game.

---

## THE BLOCKCHAIN LAYER — WHAT WE BUILT (1:15 - 2:45)

> Under the hood, we deployed three smart contracts on Avalanche's Fuji Testnet:

> **ChainBoisNFT** — an ERC-721 contract for player characters. Each NFT has an on-chain level from 0 to 7, with army ranks from Private all the way up to Field Marshal. Every level unlocks four new playable characters — that's up to 32 unique characters at max level.

> **WeaponNFT** — another ERC-721 for weapons across 8 categories: Assault Rifles, SMGs, LMGs, Marksman Rifles, Handguns, Launchers, Shotguns, and Melee.

> **BattleToken** — our ERC-20 token with a hard cap of 10 million. This is a fixed supply — no new tokens can ever be minted. And the economy is deflationary: when players spend $BATTLE on weapons, a portion is permanently burned.

> The backend API is the brain of the platform — over 50 endpoints handling everything from game sync to tournaments to tokenomics. It talks to the blockchain, manages five encrypted platform wallets, runs nine automated cron jobs, and syncs game state through Firebase so the Unity game never needs to make direct API calls.

> One thing we're proud of is the **dynamic tokenomics** system. The conversion rate from game points to $BATTLE adjusts automatically based on how healthy the rewards pool is. When there's plenty of $BATTLE, rates are generous. As it depletes, rates tighten. And the burn rate on weapon purchases adjusts too — it's a self-regulating economy.

---

## HOW IT ALL WORKS TOGETHER (2:45 - 3:30)

> Let me walk you through the player journey:

> A new player visits our site, connects MetaMask on Fuji Testnet, and claims a free starter pack — 2 ChainBoi NFTs, 8 weapons, and 1,000 $BATTLE tokens. No gas needed — the platform covers everything.

> They download the game, create an account, and connect the same wallet. The backend reads their on-chain NFTs, verifies ownership, and pushes their characters and weapons to Firebase. The game picks it up automatically.

> Now they play. They earn points in matches — those scores sync from Firebase to our backend every five minutes, with anti-cheat validation running on every sync.

> They can level up their NFT in the Training Room by paying a small amount of AVAX. The level is stored on-chain, and the NFT metadata updates dynamically — you can see it change in real-time on explorers.

> They can spend $BATTLE on new weapons in the Armory. And if a purchase ever gets stuck — maybe there's a network issue — our purchase failsafe system automatically retries or refunds.

> Then there are tournaments. Seven tiers, one for each player level. Five-day cycles. At the end, prizes are distributed automatically — AVAX to first and second, $BATTLE to third. No claim buttons. It just hits your wallet.

---

## WHAT'S LIVE NOW (3:30 - 3:55)

> So what's live right now?

> The game is fully playable — seven game modes, PC and Android.

> The backend is deployed and running — all 50+ API endpoints, all nine cron jobs, all three smart contracts verified on Snowtrace.

> The testnet faucet is live at chainbois-testnet-faucet.vercel.app — anyone can claim a starter pack and jump in.

> The frontend is deployed with wallet connection and game download. Integration with the backend APIs for the Training Room, Armory, Tournaments, and Inventory is actively in progress — all those endpoints are built, documented, and have Postman collections ready.

---

## WHAT'S NEXT (3:55 - 4:25)

> After the hackathon, we're taking this to mainnet.

> The full 4,032 NFT collection goes live. The $BATTLE token launches for real.

> We'll add armor and loot boxes — a whole new equipment layer. A battle pass system with seasonal content. And a mythic upgrade system for rare NFT evolution.

> On the economy side — $BATTLE to AVAX cashout via DEX integration, an in-house marketplace for trading NFTs and weapons, and cross-chain expansion to other networks.

> The foundation is solid. The smart contracts are deployed. The economy is running. Now it's about scaling the experience.

---

## CLOSE (4:25 - 4:35)

> ChainBois — a real game with a real on-chain economy, built on Avalanche. Thanks for watching.

---

**Total estimated runtime: ~4:30**

### Speaker Notes

- Show the faucet page during the "claim starter pack" section
- Show Snowtrace contract pages when mentioning smart contracts
- Show the game running during the game modes section
- Show the API health endpoint or Postman collection during the backend section
- Keep energy up — this is a gaming project, it should feel exciting
- Consider screen recording gameplay footage as B-roll throughout
