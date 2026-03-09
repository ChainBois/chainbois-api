Got it! My mistake—I've pivoted all the research and context to **Avalanche (AVAX)**.

Since you're working in the **Build Games 2026** competition on Avalanche, the judges will be looking specifically for how you utilize the **C-Chain** (or Subnets), **Fuji Testnet**, and ecosystem tools like **Avalanche-CLI** or **Core Wallet**.

Here is your updated document with the questions, placeholders, and the detailed research summary at the bottom tailored for an Avalanche build.

---

## Stage 2: MVP Submission Form — Avalanche Build

**1. Question:** GitHub Repository
**Suggestion/Placeholder:** `https://github.com/username/repo` | Link to your project's GitHub repository.
**Answer:** ---

**2. Question:** Technical Documentation
**Suggestion/Placeholder:** Describe your tech stack (e.g., Solidity, Hardhat/Foundry, AvalancheJS), architecture decisions, and implementation approach.
**Answer:** ---

**3. Question:** Architecture design overview
**Suggestion/Placeholder:** Outline the main components, workflows, and technical structure. Describe your system architecture: key components, data flow, integrations, on-chain (C-Chain/Subnet) vs off-chain logic.
**Answer:** ---

**4. Question:** How does a user interact with your solution from start to finish?
**Suggestion/Placeholder:** Walk us through the full user journey step by step. Step 1: User lands on site... Step 2: User connects Core/Metamask wallet... Step 3: User triggers transaction on Fuji...
**Answer:** ---

**5. Question:** MoSCoW Framework — Feature Prioritization
**Suggestion/Placeholder:** Analyze the most important features using the MoSCoW framework: **Must Have, Should Have, Could Have, Won't Have.**

- **Must Have:** - ...
- **Should Have:** - ...
- **Could Have:** - ...
- **Won't Have:** - ...
  **Answer:** ---

**6. Question:** Walkthrough Video
**Suggestion/Placeholder:** `https://loom.com/share/...` | Link to a product walkthrough video (max 5 minutes) demonstrating key features on the Avalanche network.
**Answer:** ---

**7. Question:** Live Prototype Links
**Suggestion/Placeholder:** `https://your-app-on-avax.com`
**Answer:** ---

### GAMING MVP SECTION

**8. Question:** What is currently playable?
**Suggestion/Placeholder:** Describe the state of your MVP. Which core mechanics are live? (e.g., "Players can mint a character on Fuji and battle a boss.")
**Answer:** ---

**9. Question:** Smart contracts deployed
**Suggestion/Placeholder:** Which contracts are live? Are they on Fuji Testnet or Mainnet? Link to the Snowtrace explorer.
**Answer:** ---

**10. Question:** New player onboarding flow
**Suggestion/Placeholder:** How do you handle wallet setup? Do you use a Subnet? Social login? Walk through the first session.
**Answer:** ---

**11. Question:** Playtesting results
**Suggestion/Placeholder:** Share what Avalanche users loved and where they struggled (e.g., "Users found switching to Fuji Testnet difficult, so we added an 'Add Network' button.")
**Answer:** ---

---

## Detailed Explanation & Research Summary

### 1. MoSCoW Framework — Feature Prioritization

This is a strategy to ensure you ship a working product by the deadline. It forces you to categorize your "to-do" list:

- **Must Have:** The "deal-breakers." If the smart contract doesn't mint the game item, you don't have a game.
- **Should Have:** Important but can be manually handled for now. (e.g., a "Claim Rewards" button vs. automatic distribution).
- **Could Have:** "Polishing" features like fancy animations or secondary marketplace filters.
- **Won't Have:** High-effort features you've decided to skip for this competition (e.g., a full mobile app version).

### 2. Architecture: On-chain vs. Off-chain

On Avalanche, you have to decide what goes on the **C-Chain** (or your own **Subnet**) and what stays on your server.

- **On-chain:** High-value or "trustless" actions. _Example:_ "Storing the player's high score as a verified transaction on the Fuji Testnet."
- **Off-chain:** Fast or data-heavy actions. _Example:_ "Using a Node.js backend to generate the game's map graphics so the user doesn't pay gas for every tree rendered."

### 3. Smart Contracts Deployed (Fuji vs. Mainnet)

- **Fuji Testnet:** This is where you should be for Stage 2. It’s a sandbox where you use "fake" AVAX to test.
- **Mainnet:** Where real money is involved. Most MVP submissions stay on Fuji, but showing a successful Fuji deployment with a **Snowtrace** link is vital.

### 4. New Player Onboarding Flow

Gaming on-chain is notoriously hard for "normies." Judges want to see how you make it easy.

- **The "Aha!" Moment:** How quickly can a player start playing?
- **Examples:** Do you provide a "Faucet" link for testnet tokens? Do you use **Social Login** (like Particle or Web3Auth) so they don't need a seed phrase immediately?

### 5. Playtesting & Friction Points

A "Friction Point" is anything that makes a user close the tab.

- **Avalanche-Specific Example:** "Users didn't have Fuji Testnet configured in their wallet, so we implemented a one-click 'Switch to Fuji' button using AvalancheJS."
