---
title: The Avalanche Builder’s Toolkit
description: Everything you need to build on Avalanche, from documentation and integration tools to AI-assisted workflows. Use this guide as a reference to help you go from idea to launch.
image: https://substackcdn.com/image/fetch/$s_!LFjE!,w_1200,h_675,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fca4258c1-117a-47be-a703-303a52469c9d_1456x1048.png
---

[](/)

# [](/)

SubscribeSign in

# The Avalanche Builder’s Toolkit

### Everything you need to build on Avalanche, from documentation and integration tools to AI-assisted workflows. Use this guide as a reference to help you go from idea to launch.

[](https://substack.com/@avaxteam1)

[Avalanche Team1](https://substack.com/@avaxteam1)

Feb 11, 2026

10

4

Share

[](https://substackcdn.com/image/fetch/$s%5F!LFjE!,f%5Fauto,q%5Fauto:good,fl%5Fprogressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fca4258c1-117a-47be-a703-303a52469c9d%5F1456x1048.png)

Whether you’ve already applied to [Build Games](https://go.team1.network/buildgames), are working towards the February 13 application deadline, or are building independently on Avalanche and seeking support, many resources are available to help you move forward.

This piece is a practical reference for builders who are already in motion or ready to get started. It brings together the programs, tools, documentation, integrations, and community support across the Avalanche ecosystem. You can use this whether you’re applying to Build Games, preparing a demo, or continuing development on something that’s already live.

Want to keep up with the latest in the Avalanche ecosystem? Subscribe to the Team1 blog and get our updates in your inbox weekly.

Subscribe

## **Two programs to support builders**

### **Build Games**

Build Games is a six-week builder sprint focused on shipping a working product with mentorship and milestone check-ins. Over the course of the program, builders submit structured deliverables, receive feedback on their pitch and prototype, and participate in workshops and office hours to refine both the product and the go-to-market strategy.

[](https://substackcdn.com/image/fetch/$s%5F!057K!,f%5Fauto,q%5Fauto:good,fl%5Fprogressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0524889e-b6f7-4450-b4cd-c87695089655%5F1500x1500.png)

The program is built around execution. Builders share progress publicly, get direct input from mentors, and move through defined checkpoints that keep momentum high. It is designed for solo developers and small teams who want accountability, structured feedback, and visibility as they ship.

Learn more about Build Games below or [apply today](https://go.team1.network/buildgames). Act quickly, the deadline to apply is Feb 13!

[Build Games Offers $1M to Crypto Builders](https://www.team1.blog/p/build-games-offers-1m-to-crypto-builders)[Avalanche Team1](https://substack.com/profile/282103738-avalanche-team1) and [Cryptomancer](https://substack.com/profile/88327778-cryptomancer)

·

Jan 20

[Read full story](https://www.team1.blog/p/build-games-offers-1m-to-crypto-builders)

### **Retro9000**

Retro9000 (C-Chain edition) supports projects after they are live, with funding tied directly to real onchain usage. Projects are ranked publicly based on AVAX burned through gas fees, meaning the community effectively “votes” through usage. Funding is awarded after performance, not before.

[.png")](https://substackcdn.com/image/fetch/$s%5F!e02h!,f%5Fauto,q%5Fauto:good,fl%5Fprogressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fffc8df00-5792-4f3d-8f2e-0e27f714ce83%5F1600x900.png)

This structure rewards builders who can attract real activity. Instead of pitching projections, teams show impact through measurable engagement onchain. The leaderboard model creates transparency, and the funding model aligns incentives around shipping and adoption.

Learn more about Retro9000 below or [apply today](https://go.team1.network/retro9000). Applications end on March 18 so don’t delay.

[New Retro9000 Round Targets Real Usage on Avalanche](https://www.team1.blog/p/new-retro9000-round-targets-real)[Avalanche Team1](https://substack.com/profile/282103738-avalanche-team1) and [BKL1023](https://substack.com/profile/59124280-bkl1023)

·

Jan 26

[Read full story](https://www.team1.blog/p/new-retro9000-round-targets-real)

### **You can participate in both!**

Build Games and Retro9000 are not mutually exclusive.

A team can apply to both programs, use Build Games to structure development and ship a product, and receive funding via Retro9000 once that product is live and generating usage. Each program supports a different stage of the same journey.

## **Builder Hub**

[Builder Hub](https://build.avax.network/) is where most teams spend time once they are building seriously. It combines documentation with practical tools that support development, testing, and deployment.

### **Software Development Kit (SDK)**

At the core of Builder Hub is the [Avalanche SDK](https://build.avax.network/docs/tooling/avalanche-sdk) for TypeScript, a modular suite of tools for building applications that interact directly with Avalanche networks. It supports RPC calls, wallet integration, and transaction management, provides typed access to indexed data and network metrics, and enables cross-L1 messaging through ICM and Teleporter. Whether you are building DeFi, NFTs, or cross-chain infrastructure, this is the foundation for programmatic interaction with Avalanche.

### **Command Line Interface (CLI)**

The [Avalanche-CLI](https://build.avax.network/docs/tooling/avalanche-cli) is the command-line tool for building, deploying, and managing Avalanche L1s. It allows you to create and deploy L1s locally, to testnet, or to mainnet, manage validators, configure cross-chain messaging with Teleporter, and handle core network operations. If you are launching an L1 or running validators, this is the primary interface you will use.

### **Application Programming Interface (API)**

Builder Hub provides structured access to Avalanche data through the [Data API](https://build.avax.network/docs/api-reference/data-api), [Metrics API](https://build.avax.network/docs/api-reference/metrics-api), and [Webhook API](https://build.avax.network/docs/api-reference/webhook-api). The Data API provides access to blockchain data, the Metrics API surfaces network and validator statistics, and the Webhook API supports real-time notifications. These APIs integrate with the broader SDK ecosystem and support analytics, monitoring, and application logic at scale.

### **API Testing**

Builder Hub provides an [Avalanche Postman](https://build.avax.network/docs/tooling/avalanche-postman) collection that includes public API calls available on an AvalancheGo instance. Instead of crafting curl commands manually, you can import the collection, configure your node environment, and issue formatted API calls directly. It is a practical way to inspect node state, validate responses, and troubleshoot during development.

### **Local Network Testing**

[tmpnet](https://build.avax.network/docs/tooling/tmpnet) lets you create temporary multi-node Avalanche networks on your local machine for development and testing. It spins up a full network with consensus, P2P communication, and pre-funded test keys, all running as native processes. This is especially useful for testing custom VMs, staking flows, subnet configurations, or validator behavior before moving to Fuji or mainnet.

## **AI & LLM Integration**

Builder Hub documentation is available in [AI-friendly formats](https://build.avax.network/docs/tooling/ai-llm) designed for programmatic access. Teams can access a structured index via llms.txt, load the full documentation set via llms-full.txt, retrieve clean Markdown by appending .md to any page URL, or connect directly to the MCP server endpoint for dynamic search and retrieval.

[](https://substackcdn.com/image/fetch/$s%5F!fiJa!,f%5Fauto,q%5Fauto:good,fl%5Fprogressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8f988ce6-aa19-47a7-ac6b-2595cdf9caf3%5F1600x612.png)

For builders using Claude Code, OpenCode, OpenClaw, or other AI tools, this makes a real difference. You can connect your development environment to the official Avalanche documentation through the MCP server and query it directly from your coding workflow. Instead of relying on scraped or partial content, your AI tools can search and fetch structured documentation in real time.

[](https://substackcdn.com/image/fetch/$s%5F!tQIM!,f%5Fauto,q%5Fauto:good,fl%5Fprogressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F95f3adb5-a462-418a-aef1-b68411b9d776%5F1600x876.png)

If you are building AI-native products, this also enables you to ground assistants, bots, or developer copilots in official Avalanche documentation without building your own ingestion pipeline.

## **Integrations**

The [Integrations](https://build.avax.network/integrations) section of Builder Hub shows the breadth of infrastructure already connected to Avalanche. This is one of the most practical advantages for builders.

Instead of building every component from scratch, you can integrate with existing providers across:

- **RPC and infrastructure**: Alchemy, Infura, QuickNode, Chainstack, Pocket Network
- **Indexing and data**: The Graph, Subsquid, GoldRush (Covalent), Envio
- **Wallets and account abstraction**: Core, Safe, Privy, Turnkey, ZeroDev
- **Oracles**: Chainlink, API3, Pyth Network
- **Security audits and tooling**: OpenZeppelin, Trail of Bits, Zellic, Nethermind
- **Stablecoins and payments**: Circle (USDC), Stripe onramp, MoonPay, Ramp
- **Cross-chain infrastructure**: LayerZero, Wormhole, Axelar, Synapse

The integrations directory is organized by category and searchable, which makes it straightforward to map your product requirements to existing infrastructure. If you are launching a token, custody and wallet support already exist. If you are building a DeFi protocol, oracle networks and indexing services are available. If you are shipping an application with embedded wallets or account abstraction, those solutions are already integrated into the ecosystem.

Using what is already available reduces development overhead and shortens time to launch. During a tight build window, that efficiency compounds.

[](https://substackcdn.com/image/fetch/$s%5F!Phk6!,f%5Fauto,q%5Fauto:good,fl%5Fprogressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8b143896-d231-44af-8fdf-76674e80173f%5F1600x687.png)

## **Avalanche Academy**

[Avalanche Academy](https://build.avax.network/academy) is a free, self-paced learning platform designed to help builders understand how to deploy dApps, [launch L1s](https://build.avax.network/academy/avalanche-l1?path=avalanche-l1), and scale web3 products on Avalanche. It includes courses on [blockchain fundamentals](https://build.avax.network/academy/blockchain?path=blockchain), Solidity, NFT deployment, privacy-focused applications, and payment integrations, along with deeper tracks on L1 development, interchain messaging, token bridging, custom tokenomics, and EVM customization.

[](https://substackcdn.com/image/fetch/$s%5F!6MSB!,f%5Fauto,q%5Fauto:good,fl%5Fprogressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8c937477-aeea-4bbf-9422-332eec8da186%5F1219x818.png)

For founders, the [Entrepreneur Path](https://build.avax.network/academy/entrepreneur?path=entrepreneur) covers go-to-market strategy, community building, and web3 fundraising. Each course is structured to be concise and practical, making it useful when you need to quickly understand a specific concept while building.

Learn more about the Avalanche Academy here:

[Introduction to Avalanche Academy: The Ultimate Learning Hub on Avalanche](https://www.team1.blog/p/introduction-to-avalanche-academy)[Avalanche Team1](https://substack.com/profile/282103738-avalanche-team1) and [Keenye The Unusual](https://substack.com/profile/113130665-keenye-the-unusual)

·

Jan 31

[Read full story](https://www.team1.blog/p/introduction-to-avalanche-academy)

## **Community support**

Mentorship, workshops, and builder interaction are part of the Build Games experience. Even before approvals, applicants are already connecting in shared spaces.

The **[Build Games Telegram](https://t.me/avaxbuildgames)** is a focused environment for applicants and builders tracking the program. Builders share progress, ask clarifying questions, and get updates tied to milestones.

The **[Builder Hub Telegram](https://t.me/avalancheacademy)** provides broader support for Avalanche developers. These are useful for SDK questions, tooling issues, or architecture discussions that go beyond a specific program.

[](https://substackcdn.com/image/fetch/$s%5F!sxTL!,f%5Fauto,q%5Fauto:good,fl%5Fprogressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa1009813-1b4a-421c-b8b9-595a8d403716%5F1374x236.png)

## **Let’s Ship!**

Avalanche provides builders with documentation, SDKs, integrations, structured programs, and direct access to other developers building alongside them.

If you are already building, stay focused and keep moving. The tools are here. The support is active. What matters now is execution.

Let’s ship!

[Avalanche Builder Hub](https://build.avax.network/) | [Build Games Website](https://go.team1.network/buildgames)|[Retro9000 Website](https://go.team1.network/retro9000) | [AI Tooling](https://build.avax.network/docs/tooling/ai-llm) | [Integrations](https://build.avax.network/integrations)

Want to keep up with the latest in the Avalanche ecosystem? Subscribe to the Team1 blog and get our updates in your inbox weekly.

Subscribe

10

4

Share

PreviousNext

#### Discussion about this post

CommentsRestacks

TopLatestDiscussions

No posts

### Ready for more?

Subscribe

© 2026 Avalanche Team1 · [Privacy](https://substack.com/privacy) ∙ [Terms](https://substack.com/tos) ∙ [Collection notice](https://substack.com/ccpa#personal-data-collected)

[ Start your Substack](https://substack.com/signup?utm%5Fsource=substack&utm%5Fmedium=web&utm%5Fcontent=footer)[Get the app](https://substack.com/app/app-store-redirect?utm%5Fcampaign=app-marketing&utm%5Fcontent=web-footer-button)

[Substack](https://substack.com) is the home for great culture

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "url": "https://www.team1.blog/p/the-avalanche-builders-toolkit",
  "mainEntityOfPage": "https://www.team1.blog/p/the-avalanche-builders-toolkit",
  "headline": "The Avalanche Builder\u2019s Toolkit",
  "description": "Everything you need to build on Avalanche, from documentation and integration tools to AI-assisted workflows. Use this guide as a reference to help you go from idea to launch.",
  "image": [
    {
      "@type": "ImageObject",
      "url": "https://substackcdn.com/image/fetch/$s_!LFjE!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fca4258c1-117a-47be-a703-303a52469c9d_1456x1048.png"
    }
  ],
  "datePublished": "2026-02-11T13:53:26+00:00",
  "dateModified": "2026-02-11T13:53:26+00:00",
  "isAccessibleForFree": true,
  "author": [
    {
      "@type": "Person",
      "name": "Avalanche Team1",
      "url": "https://substack.com/@avaxteam1",
      "description": "Avalanche Team1 is a global network of builders, developers, creatives, and community members dedicated to growing Avalanche. ",
      "identifier": "user:282103738",
      "image": {
        "@type": "ImageObject",
        "contentUrl": "https://substackcdn.com/image/fetch/$s_!GhLP!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5d74b518-eb84-43de-b26a-a6700cf8fa0a_784x784.jpeg",
        "thumbnailUrl": "https://substackcdn.com/image/fetch/$s_!GhLP!,w_128,h_128,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5d74b518-eb84-43de-b26a-a6700cf8fa0a_784x784.jpeg"
      }
    }
  ],
  "publisher": {
    "@type": "Organization",
    "name": "Avalanche Team1 Blog",
    "url": "https://www.team1.blog",
    "description": "Your guide to Avalanche\u2019s latest updates, projects, and the community shaping the ecosystem.",
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "name": "Subscribers",
      "interactionType": "https://schema.org/SubscribeAction",
      "userInteractionCount": 100
    },
    "identifier": "pub:3475487",
    "logo": {
      "@type": "ImageObject",
      "url": "https://substackcdn.com/image/fetch/$s_!bSZF!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F85e81fcd-8f87-49bc-b018-4f3d4c0cef33_1080x1080.png",
      "contentUrl": "https://substackcdn.com/image/fetch/$s_!bSZF!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F85e81fcd-8f87-49bc-b018-4f3d4c0cef33_1080x1080.png",
      "thumbnailUrl": "https://substackcdn.com/image/fetch/$s_!bSZF!,w_128,h_128,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F85e81fcd-8f87-49bc-b018-4f3d4c0cef33_1080x1080.png"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://substackcdn.com/image/fetch/$s_!bSZF!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F85e81fcd-8f87-49bc-b018-4f3d4c0cef33_1080x1080.png",
      "contentUrl": "https://substackcdn.com/image/fetch/$s_!bSZF!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F85e81fcd-8f87-49bc-b018-4f3d4c0cef33_1080x1080.png",
      "thumbnailUrl": "https://substackcdn.com/image/fetch/$s_!bSZF!,w_128,h_128,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F85e81fcd-8f87-49bc-b018-4f3d4c0cef33_1080x1080.png"
    }
  },
  "interactionStatistic": [
    {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/LikeAction",
      "userInteractionCount": 10
    },
    {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/ShareAction",
      "userInteractionCount": 4
    },
    {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/CommentAction",
      "userInteractionCount": 0
    }
  ]
}
```
