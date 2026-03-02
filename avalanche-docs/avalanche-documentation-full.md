# Primary Network (/docs/primary-network)

---

title: Primary Network
description: Learn about the Avalanche Primary Network and its three blockchains.

---

import { Network, Layers, Terminal, ArrowRight, Database, Package } from 'lucide-react';

Avalanche is a heterogeneous network of blockchains. As opposed to homogeneous networks, where all applications reside in the same chain, heterogeneous networks allow separate chains to be created for different applications.

![Primary Network Architecture](https://qizat5l3bwvomkny.public.blob.vercel-storage.com/builders-hub/course-images/multi-chain-architecture/multi-chain.png)

The Primary Network is a special [Avalanche L1](/docs/avalanche-l1s) that runs three blockchains:

- The Contract Chain [(C-Chain)](/docs/primary-network#c-chain-contract-chain)
- The Platform Chain [(P-Chain)](/docs/primary-network#p-chain-platform-chain)
- The Exchange Chain [(X-Chain)](/docs/primary-network#x-chain-exchange-chain)

<Callout title="Note">
Avalanche Mainnet is comprised of the Primary Network and all deployed Avalanche L1s.
</Callout>

A node can become a validator for the Primary Network by staking at least **2,000 AVAX**.

### C-Chain (Contract Chain)

The **C-Chain** is an implementation of the Ethereum Virtual Machine (EVM). The [C-Chain's API](/docs/rpcs/c-chain) supports Geth's API and supports the deployment and execution of smart contracts written in Solidity.

The C-Chain is an instance of the [Coreth](https://github.com/ava-labs/avalanchego/tree/master/graft/coreth) Virtual Machine.

| Property          | Mainnet                                      | Fuji Testnet                                     |
| ----------------- | -------------------------------------------- | ------------------------------------------------ |
| **Network Name**  | Avalanche C-Chain                            | Avalanche Fuji C-Chain                           |
| **Chain ID**      | 43114 (0xA86A)                               | 43113 (0xA869)                                   |
| **Currency**      | AVAX                                         | AVAX                                             |
| **RPC URL**       | https://api.avax.network/ext/bc/C/rpc        | https://api.avax-test.network/ext/bc/C/rpc       |
| **Explorer**      | https://subnets.avax.network/c-chain         | https://subnets-test.avax.network/c-chain        |
| **Faucet**        | -                                            | [Get Test AVAX](/console/primary-network/faucet) |
| **Add to Wallet** | <AddNetworkButtonInline network="mainnet" /> | <AddNetworkButtonInline network="fuji" />        |

### P-Chain (Platform Chain)

The **P-Chain** is responsible for all validator and Avalanche L1-level operations. The [P-Chain API](/docs/rpcs/p-chain) supports the creation of new blockchains and Avalanche L1s, the addition of validators to Avalanche L1s, staking operations, and other platform-level operations.

The P-Chain is an instance of the [Platform Virtual Machine](https://github.com/ava-labs/avalanchego/tree/master/vms/platformvm).

| Property     | Mainnet                              | Fuji Testnet                              |
| ------------ | ------------------------------------ | ----------------------------------------- |
| **RPC URL**  | https://api.avax.network/ext/bc/P    | https://api.avax-test.network/ext/bc/P    |
| **Currency** | AVAX                                 | AVAX                                      |
| **Explorer** | https://subnets.avax.network/p-chain | https://subnets-test.avax.network/p-chain |

### X-Chain (Exchange Chain)

The **X-Chain** is responsible for operations on digital smart assets known as **Avalanche Native Tokens**. A smart asset is a representation of a real-world resource (for example, equity, or a bond) with sets of rules that govern its behavior, like "can't be traded until tomorrow." The [X-Chain API](/docs/rpcs/x-chain) supports the creation and trade of Avalanche Native Tokens.

One asset traded on the X-Chain is AVAX. When you issue a transaction to a blockchain on Avalanche, you pay a fee denominated in AVAX.

The X-Chain is an instance of the Avalanche Virtual Machine (AVM).

| Property     | Mainnet                              | Fuji Testnet                              |
| ------------ | ------------------------------------ | ----------------------------------------- |
| **RPC URL**  | https://api.avax.network/ext/bc/X    | https://api.avax-test.network/ext/bc/X    |
| **Currency** | AVAX                                 | AVAX                                      |
| **Explorer** | https://subnets.avax.network/x-chain | https://subnets-test.avax.network/x-chain |

## Explore More

<div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
  <a
    href="/docs/avalanche-l1s"
    className="group block p-6 rounded-lg transition-all duration-150 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 hover:border-zinc-300/50 dark:hover:border-zinc-700/50"
  >
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Layers className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
          Avalanche L1s
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Discover how to build sovereign networks with custom rules and token economics.
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
      </div>
    </div>
  </a>

<a
href="/docs/api-reference/data-api"
className="group block p-6 rounded-lg transition-all duration-150 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 hover:border-zinc-300/50 dark:hover:border-zinc-700/50"

>

    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Database className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
          Data APIs
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Access data APIs for the C-Chain, P-Chain, and X-Chain.
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
      </div>
    </div>

  </a>
  <a
    href="/console"
    className="group block p-6 rounded-lg transition-all duration-150 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 hover:border-zinc-300/50 dark:hover:border-zinc-700/50"
  >
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Terminal className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
          Console
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Access developer tools, deploy contracts, and manage your blockchain infrastructure.
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
      </div>
    </div>
  </a>
</div>

# Snowman Consensus (/docs/primary-network/avalanche-consensus)

---

title: Snowman Consensus
description: Learn about the Snowman Consensus protocol.

---

Consensus is the task of getting a group of computers (a.k.a. nodes) to come to an agreement on a decision. In blockchain, this means that all the participants in a network have to agree on the changes made to the shared ledger.

This agreement is reached through a specific process, a consensus protocol, that ensures that everyone sees the same information and that the information is accurate and trustworthy.

## Snowman Consensus

Snowman Consensus is a consensus protocol that is scalable, robust, and decentralized. It combines features of both classical and Nakamoto consensus mechanisms to achieve high throughput, fast finality, and energy efficiency. For the whitepaper, see [here](https://www.avalabs.org/whitepapers).

Key Features Include:

- Speed: Snowman Consensus provides sub-second, immutable finality, ensuring that transactions are quickly confirmed and irreversible.
- Scalability: Snowman Consensus enables high network throughput while ensuring low latency.
- Energy Efficiency: Unlike other popular consensus protocols, participation in Snowman Consensus is neither computationally intensive nor expensive.
- Adaptive Security: Snowman Consensus is designed to resist various attacks, including sybil attacks, distributed denial-of-service (DDoS) attacks, and collusion attacks. Its probabilistic nature ensures that the consensus outcome converges to the desired state, even when the network is under attack.

## Conceptual Overview

Consensus protocols in the Avalanche family operate through repeated sub-sampled voting. When a node is determining whether a [transaction](http://support.avalabs.org/en/articles/4587384-what-is-a-transaction) should be accepted, it asks a small, random subset of [validator nodes](http://support.avalabs.org/en/articles/4064704-what-is-a-blockchain-validator) for their preference. Each queried validator replies with the transaction that it prefers, or thinks should be accepted.

<Callout title="Note">
Consensus will never include a transaction that is determined to be **invalid**. For example, if you were to submit a transaction to send 100 AVAX to a friend, but your wallet only has 2 AVAX, this transaction is considered **invalid** and will not participate in consensus.
</Callout>

If a sufficient majority of the validators sampled reply with the same preferred transaction, this becomes the preferred choice of the validator that inquired.

In the future, this node will reply with the transaction preferred by the majority.

The node repeats this sampling process until the validators queried reply with the same answer for a sufficient number of consecutive rounds.

- The number of validators required to be considered a "sufficient majority" is referred to as "α" (_alpha_).
- The number of consecutive rounds required to reach consensus, a.k.a. the "Confidence Threshold," is referred to as "β" (_beta_).
- Both α and β are configurable.

When a transaction has no conflicts, finalization happens very quickly. When conflicts exist, honest validators quickly cluster around conflicting transactions, entering a positive feedback loop until all correct validators prefer that transaction. This leads to the acceptance of non-conflicting transactions and the rejection of conflicting transactions.

![How Snowman Consensus Works](/images/avalanche-consensus1.png)

Snowman Consensus guarantees that if any honest validator accepts a transaction, all honest validators will come to the same conclusion.

<Callout title="Note">
For a great visualization, check out [this demo](https://tedyin.com/archive/snow-bft-demo/#/snow).
</Callout>

## Deep Dive Into Snowman Consensus

<YouTube id="ZUF9sIu-D_k" fullSize={false}/>

### Intuition

First, let's develop some intuition about the protocol. Imagine a room full of people trying to agree on what to get for lunch. Suppose it's a binary choice between pizza and barbecue. Some people might initially prefer pizza while others initially prefer barbecue. Ultimately, though, everyone's goal is to achieve **consensus**.

Everyone asks a random subset of the people in the room what their lunch preference is. If more than half say pizza, the person thinks, "OK, looks like things are leaning toward pizza. I prefer pizza now." That is, they adopt the _preference_ of the majority. Similarly, if a majority say barbecue, the person adopts barbecue as their preference.

Everyone repeats this process. Each round, more and more people have the same preference. This is because the more people that prefer an option, the more likely someone is to receive a majority reply and adopt that option as their preference. After enough rounds, they reach consensus and decide on one option, which everyone prefers.

### Snowball

The intuition above outlines the Snowball Algorithm, which is a building block of Snowman Consensus. Let's review the Snowball algorithm.

#### Parameters

- _n_: number of participants
- _k_ (sample size): between 1 and _n_
- α (quorum size): between 1 and _k_
- β (decision threshold): >= 1

#### Algorithm

```
preference := pizza
consecutiveSuccesses := 0
while not decided:
  ask k random people their preference
  if >= α give the same response:
    preference := response with >= α
    if preference == old preference:
      consecutiveSuccesses++
    else:
      consecutiveSuccesses = 1
  else:
    consecutiveSuccesses = 0
  if consecutiveSuccesses > β:
    decide(preference)
```

#### Algorithm Explained

Everyone has an initial preference for pizza or barbecue. Until someone has _decided_, they query _k_ people (the sample size) and ask them what they prefer. If α or more people give the same response, that response is adopted as the new preference. α is called the _quorum size_. If the new preference is the same as the old preference, the `consecutiveSuccesses` counter is incremented. If the new preference is different then the old preference, the `consecutiveSuccesses` counter is set to `1`. If no response gets a quorum (an α majority of the same response) then the `consecutiveSuccesses` counter is set to `0`.

Everyone repeats this until they get a quorum for the same response β times in a row. If one person decides pizza, then every other person following the protocol will eventually also decide on pizza.

Random changes in preference, caused by random sampling, cause a network preference for one choice, which begets more network preference for that choice until it becomes irreversible and then the nodes can decide.

In our example, there is a binary choice between pizza or barbecue, but Snowball can be adapted to achieve consensus on decisions with many possible choices.

The liveness and safety thresholds are parameterizable. As the quorum size, α, increases, the safety threshold increases, and the liveness threshold decreases. This means the network can tolerate more byzantine (deliberately incorrect, malicious) nodes and remain safe, meaning all nodes will eventually agree whether something is accepted or rejected. The liveness threshold is the number of malicious participants that can be tolerated before the protocol is unable to make progress.

These values, which are constants, are quite small on the Avalanche Network. The sample size, _k_, is `20`. So when a node asks a group of nodes their opinion, it only queries `20` nodes out of the whole network. The quorum size, α, is `14`. So if `14` or more nodes give the same response, that response is adopted as the querying node's preference. The decision threshold, β, is `20`. A node decides on choice after receiving `20` consecutive quorum (α majority) responses.

Snowball is very scalable as the number of nodes on the network, _n_, increases. Regardless of the number of participants in the network, the number of consensus messages sent remains the same because in a given query, a node only queries `20` nodes, even if there are thousands of nodes in the network.

Everything discussed to this point is how Avalanche is described in [the Avalanche white-paper](https://assets-global.website-files.com/5d80307810123f5ffbb34d6e/6009805681b416f34dcae012_Avalanche%20Consensus%20Whitepaper.pdf). The implementation of the Snowman Consensus protocol by Ava Labs (namely in AvalancheGo) has some optimizations for latency and throughput.

### Blocks

A block is a fundamental component that forms the structure of a blockchain. It serves as a container or data structure that holds a collection of transactions or other relevant information. Each block is cryptographically linked to the previous block, creating a chain of blocks, hence the term "blockchain."

In addition to storing a reference of its parent, a block contains a set of transactions. These transactions can represent various types of information, such as financial transactions, smart contract operations, or data storage requests.

If a node receives a vote for a block, it also counts as a vote for all of the block's ancestors (its parent, the parents' parent, etc.).

### Finality

Snowman Consensus is probabilistically safe up to a safety threshold. That is, the probability that a correct node accepts a transaction that another correct node rejects can be made arbitrarily low by adjusting system parameters. In Nakamoto consensus protocol (as used in Bitcoin and Ethereum, for example), a block may be included in the chain but then be removed and not end up in the canonical chain. This means waiting an hour for transaction settlement. In Avalanche, acceptance/rejection are **final and irreversible** and only take a few seconds.

### Optimizations

It's not safe for nodes to just ask, "Do you prefer this block?" when they query validators. In Ava Labs' implementation, during a query a node asks, "Given that this block exists, which block do you prefer?" Instead of getting back a binary yes/no, the node receives the other node's preferred block.

Nodes don't only query upon hearing of a new block; they repeatedly query other nodes until there are no blocks processing.

Nodes may not need to wait until they get all _k_ query responses before registering the outcome of a poll. If a block has already received _alpha_ votes, then there's no need to wait for the rest of the responses.

### Validators

If it were free to become a validator on the Avalanche network, that would be problematic because a malicious actor could start many, many nodes which would get queried very frequently. The malicious actor could make the node act badly and cause a safety or liveness failure. The validators, the nodes which are queried as part of consensus, have influence over the network. They have to pay for that influence with real-world value in order to prevent this kind of ballot stuffing. This idea of using real-world value to buy influence over the network is called Proof of Stake.

To become a validator, a node must **bond** (stake) something valuable (**AVAX**). The more AVAX a node bonds, the more often that node is queried by other nodes. When a node samples the network it's not uniformly random. Rather, it's weighted by stake amount. Nodes are incentivized to be validators because they get a reward if, while they validate, they're sufficiently correct and responsive.

Avalanche doesn't have slashing. If a node doesn't behave well while validating, such as giving incorrect responses or perhaps not responding at all, its stake is still returned in whole, but with no reward. As long as a sufficient portion of the bonded AVAX is held by correct nodes, then the network is safe, and is live for virtuous transactions.

### Big Ideas

Two big ideas in Avalanche are **subsampling** and **transitive voting**.

Subsampling has low message overhead. It doesn't matter if there are twenty validators or two thousand validators; the number of consensus messages a node sends during a query remains constant.

Transitive voting, where a vote for a block is a vote for all its ancestors, helps with transaction throughput. Each vote is actually many votes in one.

### Loose Ends

Transactions are created by users which call an API on an [AvalancheGo](https://github.com/ava-labs/avalanchego) full node or create them using a library such as [AvalancheJS](https://github.com/ava-labs/avalanchejs).

### Other Observations

Conflicting transactions are not guaranteed to be live. That's not really a problem because if you want your transaction to be live then you should not issue a conflicting transaction.

Snowman is the name of Ava Labs' implementation of the Snowman Consensus protocol for linear chains.

If there are no undecided transactions, the Snowman Consensus protocol _quiesces_. That is, it does nothing if there is no work to be done. This makes Avalanche more sustainable than Proof-of-work where nodes need to constantly do work.

Avalanche has no leader. Any node can propose a transaction and any node that has staked AVAX can vote on every transaction, which makes the network more robust and decentralized.

## Why Do We Care?

Avalanche is a general consensus engine. It doesn't matter what type of application is put on top of it. The protocol allows the decoupling of the application layer from the consensus layer. If you're building a dapp on Avalanche then you just need to define a few things, like how conflicts are defined and what is in a transaction. You don't need to worry about how nodes come to an agreement. The consensus protocol is a black box that put something into it and it comes back as accepted or rejected.

Avalanche can be used for all kinds of applications, not just P2P payment networks. Avalanche's Primary Network has an instance of the Ethereum Virtual Machine, which is backward compatible with existing Ethereum Dapps and dev tooling. The Ethereum consensus protocol has been replaced with Snowman Consensus to enable lower block latency and higher throughput.

Avalanche is very performant. It can process thousands of transactions per second with ~1 second acceptance latency.

## Summary

Snowman Consensus is a radical breakthrough in distributed systems. It represents as large a leap forward as the classical and Nakamoto consensus protocols that came before it. Now that you have a better understanding of how it works, check out other documentations for building game-changing Dapps and financial instruments on Avalanche.

# AVAX Token (/docs/primary-network/avax-token)

---

title: AVAX Token
description: Learn about the native token of Avalanche Primary Network.

---

AVAX is the native utility token of Avalanche. It's a hard-capped, scarce asset that is used to pay for fees, secure the platform through staking, and provide a basic unit of account between the multiple Avalanche L1s created on Avalanche.

<Callout title="Note">
`1 nAVAX` is equal to `0.000000001 AVAX`. Use the [AVAX Unit Converter](/console/primary-network/unit-converter) to convert between different AVAX denominations.
</Callout>

## Utility

AVAX is a capped-supply (up to 720M) resource in the Avalanche ecosystem that's used to power the
network. AVAX is used to secure the ecosystem through staking and for day-to-day operations like
issuing transactions.

AVAX represents the weight that each node has in network decisions. No single actor owns
the Avalanche Network, so each validator in the network is given a proportional weight in the
network's decisions corresponding to the proportion of total stake that they own through proof
of stake (PoS).

Any entity trying to execute a transaction on Avalanche Primary Network pays a corresponding fee (commonly known as
"gas") to run it on the network. The fees used to execute a transaction on Avalanche is burned,
or permanently removed from circulating supply.

## Tokenomics

A fixed amount of 360M AVAX was minted at genesis, but a small amount of AVAX is constantly minted
as a reward to validators. The protocol rewards validators for good behavior by minting them AVAX
rewards at the end of their staking period. The minting process offsets the AVAX burned by
transactions fees. While AVAX is still far away from its supply cap, it will almost always remain an
inflationary asset.

Avalanche does not take away any portion of a validator's already staked tokens (commonly known as
"slashing") for negligent/malicious staking periods, however this behavior is disincentivized as
validators who attempt to do harm to the network would expend their node's computing resources
for no reward.

AVAX is minted according to the following formula, where $R_j$ is the total number of tokens at
year $j$, with $R_1 = 360M$, and $R_l$ representing the last year that the values of
$\gamma,\lambda \in \R$ were changed; $c_j$ is the yet un-minted supply of coins to reach $720M$ at
year $j$ such that $c_j \leq 360M$; $u$ represents a staker, with $u.s_{amount}$ representing the
total amount of stake that $u$ possesses, and $u.s_{time}$ the length of staking for $u$.

AVAX is minted according to the following formula, where $R_j$ is the total number of tokens at:

$$
R_j = R_l + \sum_{\forall u} \rho(u.s_{amount}, u.s_{time}) \times \frac{c_j}{L} \times \left( \sum_{i=0}^{j}\frac{1}{\left(\gamma + \frac{1}{1 + i^\lambda}\right)^i} \right)
$$

where,

$$
L = \left(\sum_{i=0}^{\infty} \frac{1}{\left(\gamma + \frac{1}{1 + i^\lambda} \right)^i} \right)
$$

At genesis, $c_1 = 360M$. The values of $\gamma$ and $\lambda$ are governable, and if changed,
the function is recomputed with the new value of $c_*$. We have that $\sum_{*}\rho(*) \le 1$.
$\rho(*)$ is a linear function that can be computed as follows ($u.s_{time}$ is measured in weeks,
and $u.s_{amount}$ is measured in AVAX tokens):

$$
\rho(u.s_{amount}, u.s_{time}) = (0.002 \times u.s_{time} + 0.896) \times \frac{u.s_{amount}}{R_j}
$$

If the entire supply of tokens at year $j$ is staked for the maximum amount of staking time (one
year, or 52 weeks), then $\sum_{\forall u}\rho(u.s_{amount}, u.s_{time}) = 1$. If, instead,
every token is staked continuously for the minimal stake duration of two weeks, then
$\sum_{\forall u}\rho(u.s_{amount}, u.s_{time}) = 0.9$. Therefore, staking for the maximum
amount of time incurs an additional 11.11% of tokens minted, incentivizing stakers to stake
for longer periods.

Due to the capped-supply, the above function guarantees that
AVAX will never exceed a total of $720M$ tokens, or $\lim_{j \to \infty} R(j) = 720M$.

# Virtual Machines (/docs/primary-network/virtual-machines)

---

title: Virtual Machines
description: Learn about blockchain VMs and how you can build a custom VM-enabled blockchain in Avalanche.

---

A **Virtual Machine** (VM) is the blueprint for a blockchain, meaning it defines a blockchain's complete application logic by specifying the blockchain's state, state transitions, transaction rules, and API interface.

Developers can use the same VM to create multiple blockchains, each of which follows identical rules but is independent of all others.

All Avalanche validators of the **Avalanche Primary Network** are required to run three VMs:

- **Coreth**: Defines the Contract Chain (C-Chain); supports smart contract functionality and is EVM-compatible.
- **Platform VM**: Defines the Platform Chain (P-Chain); supports operations on staking and Avalanche L1s.
- **Avalanche VM**: Defines the Exchange Chain (X-Chain); supports operations on Avalanche Native Tokens.

All three can easily be run on any computer with [AvalancheGo](/docs/nodes).

## Custom VMs on Avalanche

Developers with advanced use-cases for utilizing distributed ledger technology are often forced to build everything from scratch - networking, consensus, and core infrastructure - before even starting on the actual application.

Avalanche eliminates this complexity by:

- Providing VMs as simple blueprints for defining blockchain behavior
- Supporting development in any programming language with familiar tools
- Handling all low-level infrastructure automatically

This lets developers focus purely on building their dApps, ecosystems, and communities, rather than wrestling with blockchain fundamentals.

### How Custom VMs Work

Customized VMs can communicate with Avalanche over a language agnostic request-response protocol known as [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call). This allows the VM framework to open a world of endless possibilities, as developers can implement their dApps using the languages, frameworks, and libraries of their choice.

Validators can install additional VMs on their node to validate additional [Avalanche L1s](/docs/avalanche-l1s) in the Avalanche ecosystem. In exchange, validators receive staking rewards in the form of a reward token determined by the Avalanche L1s.

## Building a Custom VM

You can start building your first custom virtual machine in two ways:

1. Use the ready-to-deploy Subnet-EVM for Solidity-based development
2. Create a custom VM in Golang, Rust, or your preferred language

The choice depends on your needs. Subnet-EVM provides a quick start with Ethereum compatibility, while custom VMs offer maximum flexibility.

### Golang Examples

<Cards>
  <Card
    href="https://github.com/ava-labs/timestampvm"
    title="TimestampVM"
    description="A decentralized timestamp blockchain written in Golang (recommended for beginners)"
  />
  <Card
    href="https://github.com/ava-labs/avalanchego/tree/master/graft/coreth"
    title="Coreth"
    description="An implementation of EVM that powers the Avalanche C-Chain and supports Solidity smart contracts"
  />
  <Card
    href="https://github.com/ava-labs/subnet-evm"
    title="Subnet-EVM"
    description="An implementation of EVM that can be deployed to a custom Avalanche L1"
  />
  <Card
    href="https://github.com/ava-labs/xsvm"
    title="XSVM"
    description="An example of Interchain Messaging that implements Cross-Avalanche L1 asset transfers"
  />
</Cards>

See here for a tutorial on [How to Build a Simple Golang VM](/docs/avalanche-l1s/golang-vms/simple-golang-vm).

### Rust Examples

<Cards>
  <Card
    href="https://github.com/ava-labs/timestampvm-rs"
    title="TimestampVM RS"
    description="A Rust implementation of TimestampVM"
  />
</Cards>

See here for a tutorial on [How to Build a Simple Rust VM](/docs/avalanche-l1s/rust-vms/setting-up-environment).

# Coreth Architecture (/docs/primary-network/coreth-architecture)

---

title: Coreth Architecture
description: How the C-Chain EVM (Coreth) runs inside AvalancheGo, including consensus, execution, and cross-chain transfers.

---

Coreth is the EVM implementation that powers the C-Chain. It is shipped with AvalancheGo under [`graft/coreth`](https://github.com/ava-labs/avalanchego/tree/master/graft/coreth) and wrapped by Snowman++ ([`vms/proposervm`](https://github.com/ava-labs/avalanchego/tree/master/vms/proposervm)) for block production.

At a glance:

- Snowman++ engine calls into Coreth’s block builder and execution pipeline.
- Coreth executes EVM bytecode, maintains state (trie over Pebble/LevelDB), and exposes JSON-RPC/WS.
- Atomic import/export uses shared UTXO memory and writes to the node database.

## Consensus & Block Production

- Runs **Snowman++** via the ProposerVM wrapper; a stake-weighted proposer list gates each 5s window before falling back to anyone building.
- Blocks are built by Coreth's block builder ([`graft/coreth/plugin/evm/block_builder.go`](https://github.com/ava-labs/avalanchego/blob/master/graft/coreth/plugin/evm/block_builder.go)), which applies EIP-1559 base fee rules and proposer-specific metadata.
- Chain ID: Mainnet `43114`, Fuji `43113`. JSON-RPC is exposed at `/ext/bc/C/rpc` with optional WebSocket at `/ext/bc/C/ws`.

## Execution Pipeline

- **Execution**: Standard go-ethereum VM with Avalanche-specific patches (fee handling, atomic tx support, bootstrapping/state sync) in [`graft/coreth`](https://github.com/ava-labs/avalanchego/tree/master/graft/coreth).
- **State**: Uses PebbleDB/LevelDB via AvalancheGo's database interface; state pruning and state-sync are configurable.
- **APIs**: Supports `eth`, `net`, `web3`, `debug` (optional), `txpool` (optional) namespaces. Enable/disable via chain config.

## Cross-Chain (Atomic) Transfers

- Coreth supports **atomic import/export** to the X-Chain and P-Chain using shared UTXO memory ([`graft/coreth/plugin/evm/atomic`](https://github.com/ava-labs/avalanchego/tree/master/graft/coreth/plugin/evm/atomic)).
- Exports lock AVAX into an atomic UTXO set; imports consume those UTXOs to credit balance on the destination chain.
- Wallet helpers and SDKs build these atomic txs against the C-Chain RPC; on-chain they show up as `ImportTx`/`ExportTx` wrapping atomic inputs/outputs.

## Configuration

Chain-specific config lives at:

```json title="~/.avalanchego/configs/chains/C/config.json"
{
  "eth-apis": ["eth", "net", "web3", "eth-filter"],
  "pruning-enabled": true,
  "state-sync-enabled": true
}
```

Key knobs:

- `eth-apis`: List of RPC namespaces to serve.
- `pruning-enabled`: Enable state trie pruning.
- `state-sync-enabled`: Allow state sync bootstrap instead of full replay.
- P-chain fee recipient and other advanced options are also supported; see [`graft/coreth/plugin/evm/config.go`](https://github.com/ava-labs/avalanchego/blob/master/graft/coreth/plugin/evm/config.go).

## Developer Tips

- Use **chain configs** to toggle RPC namespaces instead of patching code.
- When running local devnets, use `--chain-config-content` to pass base64 configs inline.
- For cross-chain AVAX moves, call the P-Chain/X-Chain import/export endpoints; Coreth handles the atomic mempool internally.

# Streaming Asynchronous Execution (/docs/primary-network/streaming-async-execution)

---

title: Streaming Asynchronous Execution
description: ACP-194 decouples consensus from execution, enabling parallel processing and dramatically improving C-Chain throughput.
full: true

---

<TransactionLifecycle />

# Using Explorer (/docs/primary-network/verify-contract/explorer)

---

title: Using Explorer
description: Learn how to verify a smart contract using the official Avalanche Explorer.

---

This document outlines the process of verifying a Smart Contract deployed on the Avalanche Network using the official explorer.

## Contract Deployment

1. Compile the smart contract using the tooling of your choice.

2. Deploy the compiled smart contract to the Avalanche network.
   - This can be done on either the mainnet or testnet (depending on your RPC configuration)

3. Upon successful deployment, you will receive:
   - A transaction hash
   - A contract address

<Callout title="Note">
Ensure you save the contract address as it will be required for the verification process.
</Callout>

## Contract Verification

1. Navigate to the official [Avalanche Explorer](https://subnets.avax.network/) and click on **Tools** dropdown menu to select **Smart Contract Verification** interface. You may need to open the [Testnet Explorer](https://subnets-test.avax.network/) in case the contract is deployed on Fuji Testnet.

![](/images/verification-portal.png)

2. Prepare the following files:
   - The contract's Solidity file (`.sol`)
   - The `metadata.json` file containing the ABI and metadata

3. Upload the required files:
   - Upload the contract's Solidity file
   - Upload the `metadata.json` file

4. Enter the contract address:
   - Paste the contract address obtained from the deployment step into the designated input field.

![](/images/contract-addr-input.png)

5. Initiate verification:
   - Click on the **Submit Contract** button to start the verification process.

## Next Steps

After submitting the contract for verification, your request will be processed shortly and you will see the below message.

![](/images/verification-success.png)

For any issues during deployment or verification, please reach out to the DevRel/Support team on Discord/Telegram/Slack.

# Using HardHat (/docs/primary-network/verify-contract/hardhat)

---

title: Using HardHat
description: Learn how to verify a smart contract using Hardhat.

---

{/_
EVM Version Warning - TEMPORARY
Remove this section when Avalanche adds Pectra support (after SAE implementation)
Last reviewed: December 2025
_/}

<Callout type="warn" title="Solidity Compiler EVM Version">
Avalanche C-Chain and Subnet-EVM currently support the **Cancun** EVM version and do not yet support newer hardforks like **Pectra**. Since Solidity v0.8.30 changed its default target to Pectra, you must explicitly set `evmVersion` to `cancun` in your Hardhat config.

See the [sample configuration](#verifying-with-hardhat-verify) below which includes the required `evmVersion: "cancun"` setting.
</Callout>

This tutorial assumes that the contract was deployed using Hardhat and that all Hardhat dependencies are properly installed.

After deploying a smart contract one can verify the smart contract on Snowtrace in three steps:

1.  Flatten the Smart Contract
2.  Clean up the flattened contract
3.  Verify using the Snowtrace GUI

## Flatten Smart Contract using Hardhat

To flatten the contract, run the command: `npx hardhat flatten <path-to-contract> >> <flat-contract-name>.sol`

## Cleanup the Flattened Smart Contract

Some clean-up may be necessary to get the code to compile properly in the Snowtrace Contract Verifier

- Remove all but the top SPDX license.
- If the contract uses multiple SPDX licenses, use both licenses by adding **AND**: `SPDX-License-Identifier: MIT AND BSD-3-Clause`

## Verify Smart Contract using Snowtrace UI

Snowtrace is currently working on a new user interface (UI) for smart contract verification. Meanwhile, you may consider using their API for a seamless smart contract verification experience.

## Verify Smart Contract Programmatically Using APIs

Ensure you have Postman or any other API platform installed on your computer (or accessible through online services), along with your contract's source code and the parameters utilized during deployment.

Here is the API call URL to use for a POST request: `https://api.snowtrace.io/api?module=contract&action=verifysourcecode`

Please note that this URL is specifically configured for verifying contracts on the Avalanche C-Chain Mainnet. If you intend to verify on the Fuji Testnet, use: `https://api-testnet.snowtrace.io/api?module=contract&action=verifysourcecode`

Here's the body of the API call with the required parameters:

```json
{
  "contractaddress": "YOUR_CONTRACT_ADDRESS",
  "sourceCode": "YOUR_FLATTENED_SOURCE_CODE",
  "codeformat": "solidity-single-file",
  "contractname": "YOUR_CONTRACT_NAME",
  "compilerversion": "YOUR_COMPILER_VERSION",
  "optimizationUsed": "YOUR_OPTIMIZATION_VALUE", // 0 if not optimized, 1 if optimized
  "runs": "YOUR_OPTIMIZATION_RUNS", // remove if not applicable
  "licenseType": "YOUR_LICENSE_TYPE", // 1 if not specified
  "apikey": "API_KEY_PLACEHOLDER", // you don't need an API key, use a placeholder
  "evmversion": "YOUR_EVM_VERSION_ON_REMIX",
  "constructorArguments": "YOUR_CONSTRUCTOR_ARGUMENTS" // Remove if not applicable
}
```

## Verifying with Hardhat-Verify

This part of the tutorial assumes that the contract was deployed using Hardhat and that all Hardhat dependencies are properly installed to include `'@nomiclabs/hardhat-etherscan'`.

You will need to create a `.env.json` with your _Wallet Seed Phrase_. You don't need an API key to verify on Snowtrace.

Example `.env.json`:

```json title=".env.json"
{
  "MNEMONIC": "your-wallet-seed-phrase"
}
```

Below is a sample `hardhat.config.ts` used for deployment and verification:

```ts title="hardhat.config.ts"
import { task } from "hardhat/config";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-etherscan";
import { MNEMONIC, APIKEY } from "./.env.json";

// When using the hardhat network, you may choose to fork Fuji or Avalanche Mainnet
// This will allow you to debug contracts using the hardhat network while keeping the current network state
// To enable forking, turn one of these booleans on, and then run your tasks/scripts using ``--network hardhat``
// For more information go to the hardhat guide
// https://hardhat.org/hardhat-network/
// https://hardhat.org/guides/mainnet-forking.html
const FORK_FUJI = false;
const FORK_MAINNET = false;
const forkingData = FORK_FUJI
  ? {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
    }
  : FORK_MAINNET
    ? {
        url: "https://api.avax.network/ext/bc/C/rpc",
      }
    : undefined;

task(
  "accounts",
  "Prints the list of accounts",
  async (args, hre): Promise<void> => {
    const accounts: SignerWithAddress[] = await hre.ethers.getSigners();
    accounts.forEach((account: SignerWithAddress): void => {
      console.log(account.address);
    });
  },
);

task(
  "balances",
  "Prints the list of AVAX account balances",
  async (args, hre): Promise<void> => {
    const accounts: SignerWithAddress[] = await hre.ethers.getSigners();
    for (const account of accounts) {
      const balance: BigNumber = await hre.ethers.provider.getBalance(
        account.address,
      );
      console.log(`${account.address} has balance ${balance.toString()}`);
    }
  },
);
export default {
  etherscan: {
    // Your don't need an API key for Snowtrace
  },

  solidity: {
    version: "0.8.30",
    settings: {
      evmVersion: "cancun", // Required for Avalanche
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      gasPrice: 225000000000,
      chainId: 43114, //Only specify a chainId if we are not forking
      // forking: {
      //   url: 'https://api.avax.network/ext/bc/C/rpc',
      // },
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: { mnemonic: MNEMONIC },
    },
    mainnet: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: { mnemonic: MNEMONIC },
    },
  },
};
```

Once the contract is deployed, verify with hardhat verify by running the following:

```bash
npx hardhat verify <contract address> <arguments> --network <network>
```

Example:

```bash
npx hardhat verify 0x3972c87769886C4f1Ff3a8b52bc57738E82192D5 MockNFT Mock ipfs://QmQ2RFEmZaMds8bRjZCTJxo4DusvcBdLTS6XuDbhp5BZjY 100 --network fuji
```

You can also verify contracts programmatically via script. Example:

```ts title="verify.ts"
import console from "console";
const hre = require("hardhat");

// Define the NFT
const name = "MockNFT";
const symbol = "Mock";
const _metadataUri = "ipfs://QmQ2RFEmZaMds8bRjZCTJxo4DusvcBdLTS6XuDbhp5BZjY";
const _maxTokens = "100";

async function main() {
  await hre.run("verify:verify", {
    address: "0x3972c87769886C4f1Ff3a8b52bc57738E82192D5",
    constructorArguments: [name, symbol, _metadataUri, _maxTokens],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

First create your script, then execute it via hardhat by running the following:

```bash
npx hardhat run scripts/verify.ts --network fuji
```

Verifying via terminal will not allow you to pass an array as an argument, however, you can do this when verifying via script by including the array in your _Constructor Arguments_. Example:

```ts
import console from "console";
const hre = require("hardhat");

// Define the NFT
const name = "MockNFT";
const symbol = "Mock";
const _metadataUri =
  "ipfs://QmQn2jepp3jZ3tVxoCisMMF8kSi8c5uPKYxd71xGWG38hV/Example";
const _royaltyRecipient = "0xcd3b766ccdd6ae721141f452c550ca635964ce71";
const _royaltyValue = "50000000000000000";
const _custodians = [
  "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "0xdd2fd4581271e230360230f9337d5c0430bf44c0",
];
const _saleLength = "172800";
const _claimAddress = "0xcd3b766ccdd6ae721141f452c550ca635964ce71";

async function main() {
  await hre.run("verify:verify", {
    address: "0x08bf160B8e56899723f2E6F9780535241F145470",
    constructorArguments: [
      name,
      symbol,
      _metadataUri,
      _royaltyRecipient,
      _royaltyValue,
      _custodians,
      _saleLength,
      _claimAddress,
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

# PlatformVM Architecture (/docs/primary-network/platformvm-architecture)

---

title: PlatformVM Architecture
description: How the P-Chain manages validators, staking, and Avalanche L1 creation inside AvalancheGo.

---

PlatformVM (P-Chain) runs on Snowman++ and controls validators, staking rewards, subnet membership, and chain creation. Source lives in [`vms/platformvm`](https://github.com/ava-labs/avalanchego/tree/master/vms/platformvm) and its block/tx types in [`vms/platformvm/txs`](https://github.com/ava-labs/avalanchego/tree/master/vms/platformvm/txs).

At a glance:

- Snowman++ engine drives PlatformVM block production; mempool feeds Standard/Proposal/Atomic blocks.
- Validator registry, subnet membership, warp signing, and atomic UTXOs are persisted in the node database.
- P-Chain APIs expose validator state, subnet/chain creation, staking ops, and block fetch.

## Responsibilities

- **Validator registry & staking**: Tracks Primary Network validators and delegators, uptime, staking rewards, and validator fees.
- **Subnet/L1 orchestration**: Creates Subnets and chains (`CreateSubnetTx`, `CreateChainTx`), maintains Subnet validator sets (including permissionless add/remove).
- **Warp messaging**: Signs warp messages for cross-chain communication on Avalanche L1s.
- **Atomic transfers**: Handles import/export of AVAX to/from other chains via shared memory.

## Consensus & Blocks

- Uses **Snowman++** via the ProposerVM (single proposer windows with fallback).
- Blocks are built by [`vms/platformvm/block/builder`](https://github.com/ava-labs/avalanchego/tree/master/vms/platformvm/block/builder); block types include **Standard**, **Proposal** (with **Commit/Abort** options), and **Atomic** blocks.
- State sync is supported for faster bootstrap; bootstrapping peers can be overridden via `CustomBeacons` in the P-Chain `ChainParameters`.

## Key Transaction Types

| Transaction                                                     | Purpose                                                         |
| --------------------------------------------------------------- | --------------------------------------------------------------- |
| `AddValidatorTx`, `AddDelegatorTx`                              | Join the Primary Network validator set / delegate stake         |
| `AddSubnetValidatorTx`                                          | Add a validator to a Subnet (validator must also be on Primary) |
| `AddPermissionlessValidatorTx` / `AddPermissionlessDelegatorTx` | Permissionless validation on Subnets that allow it              |
| `CreateSubnetTx`                                                | Create a new Subnet and owner controls                          |
| `CreateChainTx`                                                 | Launch a new blockchain (VM + genesis) on a Subnet              |
| `ImportTx` / `ExportTx`                                         | Move AVAX to/from other chains via atomic UTXOs                 |
| `RewardValidatorTx`                                             | Mint rewards after successful staking periods                   |
| `TransformSubnetTx`                                             | Legacy subnet transform (disabled post-Etna)                    |

## P-Chain APIs

- Exposed at `/ext/bc/P` with namespaces such as `platform.getBlock`, `platform.getCurrentValidators`, `platform.issueTx`, `platform.getSubnets`, `platform.getBlockchains`.
- Health and metrics are surfaced via the node-level `/ext/health` and `/ext/metrics`.

## Configuration

Default chain config location:

```json title="~/.avalanchego/configs/chains/P/config.json"
{
  "state-sync-enabled": true,
  "pruning-enabled": true
}
```

- Subnet and chain aliases can be set in `~/.avalanchego/configs/chains/aliases.json`.
- Upgrade rules and Subnet parameters are read from the chain config and network upgrade settings (`upgrade/`).

## Developer Tips

- When testing new Subnets/VMs, pass `CreateChainTx` genesis bytes and VM IDs via `platform.issueTx`.
- For permissionless Subnets, ensure the Subnet’s config enables the relevant validator/delegator transactions before issuing them.
- Use `platform.getBlock` to inspect Proposal/Commit/Abort flow if debugging staking or subnet updates.

# AVAX Staking for Professionals (/docs/primary-network/validate/staking-for-finance-professionals)

---

title: AVAX Staking for Professionals
description: A comprehensive guide to Avalanche staking for financial professionals who need to understand the mechanics, risks, and operational considerations without deep technical knowledge.

---

# AVAX Staking for Professionals

A comprehensive guide to Avalanche staking designed for financial professionals who need to understand the mechanics, risks, and operational considerations of staking without deep technical knowledge.

## Executive Summary

Staking on Avalanche allows token holders to earn rewards by participating in network security. Unlike traditional investments, staked tokens remain under your custody but are time-locked for a predetermined period (2 weeks to 1 year). At the end of the staking period, your original principal is returned along with earned rewards.

<Callout type="error" title="Critical Risk Considerations">
**Before staking, understand these key risks:**

- **No Slashing** - Avalanche does NOT have slashing. Your staked principal is never at risk of being taken by the protocol or validators, regardless of validator performance. The worst-case scenario is earning zero rewards, not losing your principal.

- **Assets Are Locked** - Once assets are staked, they must remain staked until the end of the staking period. You set the maturity date, but your assets are completely illiquid until that date.

- **Irreversible Transaction** - Once a staking transaction is confirmed on the P-Chain, it cannot be changed. There is NO mechanism for early withdrawal or changing transaction settings. Plan your liquidity accordingly and double-check all inputs.
  </Callout>

---

## Understanding Staking

Staking is the process of locking up cryptocurrency holdings to support a blockchain network's security and validate transactions. Stakers earn rewards (similar to interest) for helping secure the network.

On Avalanche, there are two types of staking:

- **Validation Staking** - Running node infrastructure and staking to become a validator
- **Delegation Staking** - Staking assets to someone else's existing validator

---

## Validator vs. Delegator Comparison

| Aspect                  | Validator                                                            | Delegator                                                             |
| ----------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **Role**                | Operates node infrastructure and stakes to make the node a validator | Stakes assets to an existing validator without running infrastructure |
| **Category**            | Advanced                                                             | User-Friendly                                                         |
| **Minimum Capital**     | 2,000 AVAX                                                           | 25 AVAX                                                               |
| **Maximum Stake**       | 3,000,000 AVAX                                                       | Dependent on validator's available capacity                           |
| **Hardware Required**   | Yes (8-core CPU, 16GB RAM, 1TB SSD)                                  | No                                                                    |
| **Technical Knowledge** | High (Linux, networking, DevOps)                                     | None required                                                         |
| **Operational Burden**  | Monitoring and maintenance of infrastructure                         | Zero operational burden                                               |
| **Providers**           | Can contract node providers to manage infrastructure externally      | Select from public marketplace through most staking apps              |
| **Risk Profile**        | Operational and reputational risk                                    | Minimal (validator selection risk only)                               |
| **Revenue Stream**      | Own validator rewards + delegation fees from delegators              | Own delegation rewards minus delegation fee                           |
| **Operational Costs**   | Infrastructure cost of maintaining nodes                             | N/A (validator's responsibility)                                      |
| **Fees**                | Trivial transaction fee at onset                                     | Transaction fee + delegation fee to validator                         |
| **Uptime Requirements** | Must maintain >80% uptime for rewards                                | N/A (validator's responsibility)                                      |
| **Liquidity**           | Locked during staking period                                         | Locked during staking period                                          |

---

## Preparation: Set Up Your Wallet and Assets

Before staking (for either validating or delegating), you need to prepare the following.

<Callout type="info" title="Non-Custodial Design">
At every stage, you retain ownership of your private keys. The validator never has access to your funds for either form of staking. The time-lock is enforced by the Avalanche protocol, not by any third party.

**Note:** If you are using a third-party intermediary, you're subject to their restrictions and functions.
</Callout>

### Asset Requirements

| Aspect             | Applies To                | Details                                                         |
| ------------------ | ------------------------- | --------------------------------------------------------------- |
| **Asset Location** | Validators and Delegators | AVAX tokens should reside in your P-Chain wallet address        |
| **Ownership**      | Validators and Delegators | You hold the private keys; you have full control of your assets |
| **Liquidity**      | Validators and Delegators | Fully liquid. Time-vested assets are eligible to be staked      |

### Required Addresses

All addresses below are P-Chain addresses:

| Address                         | Staking Type    | Purpose                                             | Details                                                               |
| ------------------------------- | --------------- | --------------------------------------------------- | --------------------------------------------------------------------- |
| **Validator Principal Address** | Validators Only | Source of funds to be staked                        | Chosen by validator. In most setups, this is where principal returns. |
| **Validator Rewards Address**   | Validators Only | Where validator rewards are sent after staking ends | Chosen by validator                                                   |
| **Delegation Fee Address**      | Validators Only | Where fees from delegators are sent                 | Chosen by validator                                                   |
| **Delegator Principal Address** | Delegators Only | Source of funds to be staked                        | Chosen by delegator. In most setups, this is where principal returns. |
| **Delegator Rewards Address**   | Delegators Only | Where delegator rewards are sent after staking ends | Chosen by delegator                                                   |

### P-Chain vs. C-Chain

<Callout type="warn" title="Important: Staking Requires P-Chain">
Staking occurs on the **P-Chain** (Platform Chain), not the C-Chain. If your AVAX is on the C-Chain (used for DeFi/smart contracts), you must first transfer it to the P-Chain.
</Callout>

### Cross-Chain Transfer: C-Chain → P-Chain

If your AVAX is on the C-Chain (common for exchange withdrawals and DeFi), transfer it to the P-Chain before staking.

**Fees:** Each transaction costs approximately 0.001 AVAX. Total transfer cost: ~0.002 AVAX.

| Step   | Transaction Type | Chain   | What It Does               |
| ------ | ---------------- | ------- | -------------------------- |
| Export | `ExportTx`       | C-Chain | Assets move out of C-Chain |
| Import | `ImportTx`       | P-Chain | Assets move into P-Chain   |

**Wallets Supporting Cross-Chain:** [Core Wallet](https://core.app/) and most Avalanche-compatible wallets provide a single "Cross-Chain Transfer" button that executes both transactions automatically.

---

## Steps for Validating

<Callout type="info" title="Prerequisites">
You should have a node selected and prepared before creating a staking transaction—either one you're operating yourself or one provided by a contracted node provider.
</Callout>

### Validation Transaction Parameters

Create a staking transaction by providing the following:

| Parameter                        | Description                                                     | Example                   |
| -------------------------------- | --------------------------------------------------------------- | ------------------------- |
| **Node ID**                      | Unique identifier of the validator node                         | `NodeID-A1B2C3D4E5F6...`  |
| **Node BLS Public Key**          | 48-byte hex representation used to create verifiable signatures | `0x87772ac7668d78d...`    |
| **Node BLS Proof of Possession** | 96-byte hex signature proving control of the private key        | `0x969d9ffbe8d00ed83b...` |
| **Stake Amount**                 | Amount of AVAX to stake (minimum 2,000 AVAX)                    | `2,500 AVAX`              |
| **Delegation Fee %**             | Fee charged to delegators (must be 2%–100%)                     | `2.0%`                    |
| **Start Time**                   | When staking begins (usually immediately upon transaction)      | `2026-02-01 00:00:00 UTC` |
| **End Time**                     | When staking ends (2 weeks to 1 year from start)                | `2026-08-01 00:00:00 UTC` |
| **Stake Return Address**         | Where original principal returns                                | `P-avax1abc123...`        |
| **Validator Rewards Address**    | Where validator rewards are sent                                | `P-avax1abc123...`        |
| **Delegation Fee Address**       | Where delegation fees are sent                                  | `P-avax1abc123...`        |

### After Submitting the Transaction

- Once the transaction completes, the node is considered **active** until the maturity date
- The node must maintain **greater than 80% uptime** to receive rewards
- Once active, others may delegate to the node
- Delegators can stake to your validator up until the last two weeks of your validation period

### Validator Delegation Capacity

Validators can accept delegations up to a calculated capacity:

```
Validator Delegation Capacity = ((3,000,000 AVAX - (5 × Validator Stake Amount)) - Validator Stake Amount) - Active Delegation Stake
```

---

## Steps for Delegating

You can only delegate to a node that already has an active validation stake. Delegation is limited by the validator you select:

- **Maximum delegation amount** depends on validator capacity
- **Delegation period** must end before the validator's staking period ends

<Callout type="warn" title="Validator Selection Risk">
When you delegate, your rewards depend on the validator's uptime. If it falls below 80% during the staking period, you risk receiving zero rewards.

Choose a validator you're familiar with or one that has trustworthy indicators such as healthy uptime and a history of successful validation periods.
</Callout>

### Delegation Transaction Parameters

| Parameter                     | Description                                                     | Example                   |
| ----------------------------- | --------------------------------------------------------------- | ------------------------- |
| **Node ID**                   | Unique identifier of the validator you're delegating to         | `NodeID-A1B2C3D4E5F6...`  |
| **Stake Amount**              | Amount to delegate (min 25 AVAX, max set by validator capacity) | `30 AVAX`                 |
| **Start Time**                | When staking begins (usually immediately)                       | `2026-02-01 00:00:00 UTC` |
| **End Time**                  | When staking ends (must be before validator's end time)         | `2026-08-01 00:00:00 UTC` |
| **Stake Return Address**      | Where original principal returns                                | `P-avax1abc123...`        |
| **Delegator Rewards Address** | Where rewards are sent (minus delegation fee)                   | `P-avax1abc123...`        |

---

## Monitoring Your Stake

You can monitor active or historical stakes through your wallet app (such as [Core Wallet](https://core.app/)).

Public explorer tools also provide monitoring:

- [Example Staking Transaction](https://subnets.avax.network/p-chain/tx/to2MDTr7HBkmex6q1QiCHHZa4oZaJjmp36vJjdLjQLpPQXRF2)
- [Example Delegation Transaction](https://subnets.avax.network/p-chain/tx/2DF6kRMCtpeLmx7TGaoj9PbQTWwU775c7ULU9UUuzbeizGm5h6)
- [Example Active Validator Node](https://subnets.avax.network/validators/NodeID-38NGnT4q4MXLv9vBGw72vwBgyX2Wf35iu)

---

## Rewards Distribution

<Callout type="info" title="Rewards Timing">
Rewards are **NOT** distributed incrementally during the staking period. Instead:

- Protocol calculates potential rewards based on stake amount and duration
- Actual reward is determined **ONLY** at the end of the period
- Reward depends on validator meeting 80% uptime threshold
- No "accrued but not yet received" rewards exist during the period
  </Callout>

For the detailed reward calculation formula, see [Rewards Formula](/docs/primary-network/validate/rewards-formula).

Rewards are automatically distributed at the end of the staking period, and principal is sent to the predesignated address.

### Validator Rewards

| Component                   | Amount                                           | Destination               | When                                         |
| --------------------------- | ------------------------------------------------ | ------------------------- | -------------------------------------------- |
| **Gross Validator Rewards** | Calculated by protocol                           | Validator Rewards Address | End of validator's staking period            |
| **Delegation Fee Rewards**  | Gross Delegation Rewards × Delegation Fee Rate   | Delegation Fee Address    | Batched at end of validator's staking period |
| **Net Validator Revenue**   | Gross Validator Rewards + Delegation Fee Rewards | —                         | —                                            |

Validator principal returns to the original principal address immediately at the end of the staking period.

### Delegator Rewards

| Component                   | Amount                              | Destination               | When                                  |
| --------------------------- | ----------------------------------- | ------------------------- | ------------------------------------- |
| **Gross Delegator Rewards** | Calculated by protocol              | —                         | —                                     |
| **Delegation Fee**          | Gross Rewards × Delegation Fee Rate | Validator's Fee Address   | End of validator's staking period     |
| **Net Delegator Revenue**   | Gross Rewards − Delegation Fee      | Delegator Rewards Address | End of **delegator's** staking period |

Delegator principal returns to the original principal address immediately at the end of the **delegator's** staking period (not the validator's).

---

## Technical Implementation

For detailed technical implementation support, refer to the [How to Stake](/docs/primary-network/validate/how-to-stake) guide.

---

## Coming Soon: Continuous Staking (ACP-236)

<Callout type="info" title="Proposed — Not Yet Live">
[ACP-236: Continuous Staking](/docs/acps/236-continuous-staking) is currently in **Proposed** status. The features below will require a network upgrade to implement. This section is provided for planning purposes.
</Callout>

### What Is Continuous Staking?

ACP-236 proposes a mechanism allowing validators to remain staked indefinitely without manually resubmitting staking transactions at each period's end. Instead of committing to a fixed end time, validators would specify a **cycle duration** and an **auto-renew policy**.

### Key Changes from Current System

| Aspect                 | Current System                         | With ACP-236                                 |
| ---------------------- | -------------------------------------- | -------------------------------------------- |
| **Staking Duration**   | Fixed end time; must re-stake manually | Automatic renewal at cycle end               |
| **Reward Handling**    | All rewards returned at period end     | Configurable: auto-compound or withdraw      |
| **Exit Process**       | Delegation simply ends                 | Submit `SetAutoRenewPolicyTx` to signal exit |
| **Transaction Burden** | New transaction every staking period   | One transaction, runs indefinitely           |
| **Uptime Tracking**    | Measured over entire period            | Reset each cycle                             |

### New Transaction Types

ACP-236 introduces three new P-Chain transactions:

| Transaction                   | Purpose                                                                 |
| ----------------------------- | ----------------------------------------------------------------------- |
| `AddContinuousValidatorTx`    | Create a continuous validator with cycle duration and auto-renew policy |
| `SetAutoRenewPolicyTx`        | Modify the auto-renew policy or signal exit at cycle end                |
| `RewardContinuousValidatorTx` | Issued by block builders to process cycle rewards                       |

### Auto-Renew Rewards Policy

The `AutoRenewRewardsShares` field (expressed in millionths) controls what happens to rewards at each cycle end:

| Value       | Behavior                                         |
| ----------- | ------------------------------------------------ |
| `0`         | Restake principal only; withdraw 100% of rewards |
| `300,000`   | Restake 30% of rewards; withdraw 70%             |
| `1,000,000` | Restake 100% of rewards (full compounding)       |
| `MaxUint64` | Signal to exit at current cycle end              |

### Benefits for Financial Professionals

- **Reduced Operational Burden** — Fewer transactions to sign and manage
- **Automatic Compounding** — Rewards can auto-restake each cycle
- **Enhanced Security** — Less frequent key signing reduces exposure risk
- **Flexible Exit** — Can signal exit mid-cycle; takes effect at cycle end
- **Simpler Treasury Management** — Set-and-forget staking operations

### Impact on Delegators

<Callout type="warn" title="No Continuous Delegation">
ACP-236 applies to **validators only**. Delegators cannot delegate continuously because there is no guarantee a validator will continue beyond their current cycle. Delegation constraints remain unchanged: your delegation period must fit within the validator's current cycle.
</Callout>

# Validate vs. Delegate (/docs/primary-network/validate/validate-vs-delegate)

---

title: Validate vs. Delegate
description: Understand the difference between validation and delegation.

---

## Validation[​](#validation "Direct link to heading")

Validation in the context of staking refers to the act of running a node on the blockchain network to validate transactions and secure the network.

- **Stake Requirement**: To become a validator on the Avalanche network, one must stake a minimum amount of 2,000 AVAX tokens on the Mainnet (1 AVAX on the Fuji Testnet).
- **Process**: Validators participate in achieving consensus by repeatedly sampling other validators. The probability of being sampled is proportional to the validator's stake, meaning the more tokens a validator stakes, the more influential they are in the consensus process.
- **Rewards**: Validators are eligible to receive rewards for their efforts in securing the network. To receive rewards, a validator must be online and responsive for more than 80% of their validation period.

## Delegation[​](#delegation "Direct link to heading")

Delegation allows token holders who do not wish to run their own validator node to still participate in staking by "delegating" their tokens to an existing validator node.

- **Stake Requirement**: To delegate on the Avalanche network, a minimum of 25 AVAX tokens is required on the Mainnet (1 AVAX on the Fuji Testnet).
- **Process**: Delegators choose a specific validator node to delegate their tokens to, trusting that the validator will behave correctly and help secure the network on their behalf.
- **Rewards**: Delegators are also eligible to receive rewards for their stake. The validator they delegate to shares a portion of the reward with them, according to the validator's delegation fee rate.

## Key Differences[​](#key-differences "Direct link to heading")

- **Responsibilities**: Validators actively run a node, validate transactions, and actively participate in securing the network. Delegators, on the other hand, do not run a node themselves but entrust their tokens to a validator to participate on their behalf.
- **Stake Requirement**: Validators have a higher minimum stake requirement compared to delegators, as they take on more responsibility in the network.
- **Rewards Distribution**: Validators receive rewards directly for their validation efforts. Delegators receive rewards indirectly through the validator they delegate to, sharing a portion of the validator's reward.

In summary, validation involves actively participating in securing the network by running a node, while delegation allows token holders to participate passively by trusting their stake to a chosen validator. Both validators and delegators can earn rewards, but validators have higher stakes and more direct involvement in the Avalanche network.

# Rewards Formula (/docs/primary-network/validate/rewards-formula)

---

title: Rewards Formula
description: Learn about the rewards formula for the Avalanche Primary Network validator

---

## Primary Network Validator Rewards

Consider a Primary Network validator which stakes a $Stake$ amount of `AVAX` for $StakingPeriod$ seconds.

The potential reward is calculated **at the beginning of the staking period**. At the beginning of the staking period there is a $Supply$ amount of `AVAX` in the network. The maximum amount of `AVAX` is $MaximumSupply$. At the end of its staking period, a responsive Primary Network validator receives a reward.

$$
Potential Reward = \left(MaximumSupply - Supply \right) \times \frac{Stake}{Supply} \times \frac{Staking Period}{Minting Period} \times EffectiveConsumptionRate
$$

where,

$$
MaximumSupply - Supply = \text{the number of AVAX tokens left to emit in the network}
$$

$$
\frac{Stake}{Supply} = \text{the individual's stake as a percentage of all available AVAX tokens in the network}
$$

$$
\frac{StakingPeriod}{MintingPeriod} = \text{time tokens are locked up divided by the $MintingPeriod$}
$$

$$
\text{$MintingPeriod$ is one year as configured by the network).}
$$

$$
EffectiveConsumptionRate =
$$

$$
\frac{MinConsumptionRate}{PercentDenominator} \times \left(1- \frac{Staking Period}{Minting Period}\right) + \frac{MaxConsumptionRate}{PercentDenominator} \times \frac{Staking Period}{Minting Period}
$$

Note that $StakingPeriod$ is the staker's entire staking period, not just the staker's uptime, that is the aggregated time during which the staker has been responsive. The uptime comes into play only to decide whether a staker should be rewarded; to calculate the actual reward only the staking period duration is taken into account.

$EffectiveConsumptionRate$ is the rate at which the Primary Network validator is rewarded based on $StakingPeriod$ selection.

$MinConsumptionRate$ and $MaxConsumptionRate$ bound $EffectiveConsumptionRate$:

$$
MinConsumptionRate \leq EffectiveConsumptionRate \leq MaxConsumptionRate
$$

The larger $StakingPeriod$ is, the closer $EffectiveConsumptionRate$ is to $MaxConsumptionRate$. The smaller $StakingPeriod$ is, the closer $EffectiveConsumptionRate$ is to $MinConsumptionRate$.

A staker achieves the maximum reward for its stake if $StakingPeriod$ = $Minting Period$. The reward is:

$$
Max Reward = \left(MaximumSupply - Supply \right) \times \frac{Stake}{Supply} \times \frac{MaxConsumptionRate}{PercentDenominator}
$$

Note that this formula is the same as the reward formula at the top of this section because $EffectiveConsumptionRate$ = $MaxConsumptionRate$.

For reference, you can find all the Primary network parameters in [the section below](#primary-network-parameters-on-mainnet).

## Delegators Weight Checks

There are bounds set of the maximum amount of delegators' stake that a validator can receive.

The maximum weight $MaxWeight$ a validator $Validator$ can have is:

$$
MaxWeight = \min(Validator.Weight \times MaxValidatorWeightFactor, MaxValidatorStake)
$$

where $MaxValidatorWeightFactor$ and $MaxValidatorStake$ are the Primary Network Parameters described above.

A delegator won't be added to a validator if the combination of their weights and all other validator's delegators' weight is larger than $MaxWeight$. Note that this must be true at any point in time.

Note that setting $MaxValidatorWeightFactor$ to 1 disables delegation since the $MaxWeight = Validator.Weight$.

## Notes on Percentages

`PercentDenominator = 1_000_000` is the denominator used to calculate percentages.

It allows you to specify percentages up to 4 digital positions. To denominate your percentage in `PercentDenominator` just multiply it by `10_000`. For example:

- `100%` corresponds to `100 * 10_000 = 1_000_000`
- `1%` corresponds to `1* 10_000 = 10_000`
- `0.02%` corresponds to `0.002 * 10_000 = 200`
- `0.0007%` corresponds to `0.0007 * 10_000 = 7`

## Primary Network Parameters on Mainnet

For reference we list below the Primary Network parameters on Mainnet:

- `AssetID = Avax`
- `InitialSupply = 240_000_000 Avax`
- `MaximumSupply = 720_000_000 Avax`.
- `MinConsumptionRate = 0.10 * reward.PercentDenominator`.
- `MaxConsumptionRate = 0.12 * reward.PercentDenominator`.
- `Minting Period = 365 * 24 * time.Hour`.
- `MinValidatorStake = 2_000 Avax`.
- `MaxValidatorStake = 3_000_000 Avax`.
- `MinStakeDuration = 2 * 7 * 24 * time.Hour`.
- `MaxStakeDuration = 365 * 24 * time.Hour`.
- `MinDelegationFee = 20000`, that is `2%`.
- `MinDelegatorStake = 25 Avax`.
- `MaxValidatorWeightFactor = 5`. This is a platformVM parameter rather than a genesis one, so it's shared across networks.
- `UptimeRequirement = 0.8`, that is `80%`.

### Interactive Graph

The graph below demonstrates the reward as a function of the length of time
staked. The x-axis depicts $\frac{StakingPeriod}{MintingPeriod}$ as a percentage
while the y-axis depicts $Reward$ as a percentage of $MaximumSupply - Supply$,
the amount of tokens left to be emitted.

Graph variables correspond to those defined above:

- `h` (high) = $MaxConsumptionRate$
- `l` (low) = $MinConsumptionRate$
- `s` = $\frac{Stake}{Supply}$

<iframe src="https://www.desmos.com/calculator/uqtank2gcn" width="100%" height="400px"></iframe>

# How to Stake (/docs/primary-network/validate/how-to-stake)

---

title: How to Stake
description: Learn how to stake on Avalanche.

---

## Staking Parameters on Avalanche[​](#staking-parameters-on-avalanche "Direct link to heading")

When a validator is done validating the [Primary Network](http://support.avalabs.org/en/articles/4135650-what-is-the-primary-network), it receives back the AVAX tokens it staked. It may receive a reward for helping to secure the network. A validator only receives a [validation reward](http://support.avalabs.org/en/articles/4587396-what-are-validator-staking-rewards) if it is sufficiently responsive and correct during the time it validates. Read the [Avalanche token white paper](https://www.avalabs.org/whitepapers) to learn more about AVAX and the mechanics of staking.

<Callout type="warn">
Staking rewards are sent to your wallet address at the end of the staking term **as long as all of these parameters are met**.
</Callout>

### Mainnet[​](#mainnet "Direct link to heading")

- The minimum amount that a validator must stake is 2,000 AVAX
- The minimum amount that a delegator must delegate is 25 AVAX
- The minimum amount of time one can stake funds for validation is 2 weeks
- The maximum amount of time one can stake funds for validation is 1 year
- The minimum amount of time one can stake funds for delegation is 2 weeks
- The maximum amount of time one can stake funds for delegation is 1 year
- The minimum delegation fee rate is 2%
- The maximum weight of a validator (their own stake + stake delegated to them) is the minimum of 3 million AVAX and 5 times the amount the validator staked. For example, if you staked 2,000 AVAX to become a validator, only 8000 AVAX can be delegated to your node total (not per delegator)

A validator will receive a staking reward if they are online and response for more than 80% of their validation period, as measured by a majority of validators, weighted by stake. **You should aim for your validator be online and responsive 100% of the time.**

You can call API method `info.uptime` on your node to learn its weighted uptime and what percentage of the network currently thinks your node has an uptime high enough to receive a staking reward. See [here.](/docs/rpcs/other/info-rpc#infouptime) You can get another opinion on your node's uptime from Avalanche's [Validator Health dashboard](https://stats.avax.network/dashboard/validator-health-check/). If your reported uptime is not close to 100%, there may be something wrong with your node setup, which may jeopardize your staking reward. If this is the case, please see [here](#why-is-my-uptime-low) or contact us on [Discord](https://discord.gg/avax/) so we can help you find the issue. Note that only checking the uptime of your validator as measured by non-staking nodes, validators with small stake, or validators that have not been online for the full duration of your validation period can provide an inaccurate view of your node's true uptime.

### Fuji Testnet[​](#fuji-testnet "Direct link to heading")

On Fuji Testnet, all staking parameters are the same as those on Mainnet except the following ones:

- The minimum amount that a validator must stake is 1 AVAX
- The minimum amount that a delegator must delegate is 1 AVAX
- The minimum amount of time one can stake funds for validation is 24 hours
- The minimum amount of time one can stake funds for delegation is 24 hours

## Validators[​](#validators "Direct link to heading")

**Validators** secure Avalanche, create new blocks, and process transactions. To achieve consensus, validators repeatedly sample each other. The probability that a given validator is sampled is proportional to its stake.

When you add a node to the validator set, you specify:

- Your node's ID
- Your node's BLS key and BLS signature
- When you want to start and stop validating
- How many AVAX you are staking
- The address to send any rewards to
- Your delegation fee rate (see below)

<Callout title="Note">
The minimum amount that a validator must stake is 2,000 AVAX.
</Callout>

<Callout type="warn">
Note that once you issue the transaction to add a node as a validator, there is no way to change the parameters. **You can't remove your stake early or change the stake amount, node ID, or reward address.**

Please make sure you're using the correct values in the API calls below. If you're not sure, ask for help on [Discord](https://discord.gg/avax/). If you want to add more tokens to your own validator, you can delegate the tokens to this node - but you cannot increase the base validation amount (so delegating to yourself goes against your delegation cap).
</Callout>

### Running a Validator[​](#running-a-validator "Direct link to heading")

If you're running a validator, it's important that your node is well connected to ensure that you receive a reward.

When you issue the transaction to add a validator, the staked tokens and transaction fee (which is 0) are deducted from the addresses you control. When you are done validating, the staked funds are returned to the addresses they came from. If you earned a reward, it is sent to the address you specified when you added yourself as a validator.

#### Allow API Calls[​](#allow-api-calls "Direct link to heading")

To make API calls to your node from remote machines, allow traffic on the API port (`9650` by default), and run your node with argument `--http-host=`

You should disable all APIs you will not use via command-line arguments. You should configure your network to only allow access to the API port from trusted machines (for example, your personal computer.)

#### Why Is My Uptime Low?[​](#why-is-my-uptime-low "Direct link to heading")

Every validator on Avalanche keeps track of the uptime of other validators. Every validator has a weight (that is the amount staked on it.) The more weight a validator has, the more influence they have when validators vote on whether your node should receive a staking reward. You can call API method `info.uptime` on your node to learn its weighted uptime and what percentage of the network stake currently thinks your node has an uptime high enough to receive a staking reward.

You can also see the connections a node has by calling `info.peers`, as well as the uptime of each connection. **This is only one node's point of view**. Other nodes may perceive the uptime of your node differently. Just because one node perceives your uptime as being low does not mean that you will not receive staking rewards.

If your node's uptime is low, make sure you're setting config option `--public-ip=[NODE'S PUBLIC IP]` and that your node can receive incoming TCP traffic on port 9651.

#### Secret Management[​](#secret-management "Direct link to heading")

The only secret that you need on your validating node is its Staking Key, the TLS key that determines your node's ID. The first time you start a node, the Staking Key is created and put in `$HOME/.avalanchego/staking/staker.key`. You should back up this file (and `staker.crt`) somewhere secure. Losing your Staking Key could jeopardize your validation reward, as your node will have a new ID.

You do not need to have AVAX funds on your validating node. In fact, it's best practice to **not** have a lot of funds on your node. Almost all of your funds should be in "cold" addresses whose private key is not on any computer.

#### Monitoring[​](#monitoring "Direct link to heading")

Follow this [tutorial](/docs/nodes/maintain/monitoring) to learn how to monitor your node's uptime, general health, etc.

### Reward Formula[​](#reward-formula "Direct link to heading")

Consider a validator which stakes a $Stake$ amount of Avax for $StakingPeriod$ seconds.

Assume that at the start of the staking period there is a $Supply$ amount of Avax in the Primary Network.

The maximum amount of Avax is $MaximumSupply$ . Then at the end of its staking period, a responsive validator receives a reward calculated as follows:

$$
Reward = \left(MaximumSupply - Supply \right) \times \frac{Stake}{Supply} \times \frac{Staking Period}{Minting Period} \times EffectiveConsumptionRate
$$

where,

$$
EffectiveConsumptionRate =
$$

$$
\frac{MinConsumptionRate}{PercentDenominator} \times \left(1- \frac{Staking Period}{Minting Period}\right) + \frac{MaxConsumptionRate}{PercentDenominator} \times \frac{Staking Period}{Minting Period}
$$

<Callout title="Note">
Note that $StakingPeriod$ is the staker's entire staking period, not just the staker's uptime, that is the aggregated time during which the staker has been responsive. The uptime comes into play only to decide whether a staker should be rewarded; to calculate the actual reward, only the staking period duration is taken into account.
</Callout>

$EffectiveConsumptionRate$ is a linear combination of $MinConsumptionRate$ and $MaxConsumptionRate$.
$MinConsumptionRate$ and $MaxConsumptionRate$ bound $EffectiveConsumptionRate$ because

$$
MinConsumptionRate \leq EffectiveConsumptionRate \leq MaxConsumptionRate
$$

The larger $StakingPeriod$ is, the closer $EffectiveConsumptionRate$ is to $MaxConsumptionRate$.

A staker achieves the maximum reward for its stake if $StakingPeriod$ = $Minting Period$.

The reward is:

$$
Max Reward = \left(MaximumSupply - Supply \right) \times \frac{Stake}{Supply} \times \frac{MaxConsumptionRate}{PercentDenominator}
$$

## Delegators[​](#delegators "Direct link to heading")

A delegator is a token holder, who wants to participate in staking, but chooses to trust an existing validating node through delegation.

When you delegate stake to a validator, you specify:

- The ID of the node you're delegating to
- When you want to start/stop delegating stake (must be while the validator is validating)
- How many AVAX you are staking
- The address to send any rewards to

<Callout title="Note">
The minimum amount that a delegator must delegate is 25 AVAX.
</Callout>

<Callout type="warn">
Note that once you issue the transaction to add your stake to a delegator, there is no way to change the parameters. **You can't remove your stake early or change the stake amount, node ID, or reward address.** If you're not sure, ask for help on [Discord](https://discord.gg/avax/).
</Callout>

### Delegator Rewards[​](#delegator-rewards "Direct link to heading")

If the validator that you delegate tokens to is sufficiently correct and responsive, you will receive a reward when you are done delegating. Delegators are rewarded according to the same function as validators. However, the validator that you delegate to keeps a portion of your reward specified by the validator's delegation fee rate.

When you issue the transaction to delegate tokens, the staked tokens and transaction fee are deducted from the addresses you control. When you are done delegating, the staked tokens are returned to your address. If you earned a reward, it is sent to the address you specified when you delegated tokens. Rewards are sent to delegators right after the delegation ends with the return of staked tokens, and before the validation period of the node they're delegating to is complete.

## FAQ[​](#faq "Direct link to heading")

### Is There a Tool to Check the Health of a Validator?[​](#is-there-a-tool-to-check-the-health-of-a-validator "Direct link to heading")

Yes, just enter your node's ID in the Avalanche Stats [Validator Health Dashboard](https://stats.avax.network/dashboard/validator-health-check/?nodeid=NodeID-Jp4dLMTHd6huttS1jZhqNnBN9ZMNmTmWC).

### How Is It Determined Whether a Validator Receives a Staking Reward?[​](#how-is-it-determined-whether-a-validator-receives-a-staking-reward "Direct link to heading")

When a node leaves the validator set, the validators vote on whether the leaving node should receive a staking reward or not. If a validator calculates that the leaving node was responsive for more than the required uptime (currently 80%), the validator will vote for the leaving node to receive a staking reward. Otherwise, the validator will vote that the leaving node should not receive a staking reward. The result of this vote, which is weighted by stake, determines whether the leaving node receives a reward or not.

Each validator only votes "yes" or "no." It does not share its data such as the leaving node's uptime.

Each validation period is considered separately. That is, suppose a node joins the validator set, and then leaves. Then it joins and leaves again. The node's uptime during its first period in the validator set does not affect the uptime calculation in the second period, hence, has no impact on whether the node receives a staking reward for its second period in the validator set.

### How Are Delegation Fees Distributed To Validators?[​](#how-are-delegation-fees-distributed-to-validators "Direct link to heading")

If a validator is online for 80% of a delegation period, they receive a % of the reward (the fee) earned by the delegator. The P-Chain used to distribute this fee as a separate UTXO per delegation period. After the [Cortina Activation](https://medium.com/avalancheavax/cortina-x-chain-linearization-a1d9305553f6), instead of sending a fee UTXO for each successful delegation period, fees are now batched during a node's entire validation period and are distributed when it is unstaked.

### Error: Couldn't Issue TX: Validator Would Be Over Delegated[​](#error-couldnt-issue-tx-validator-would-be-over-delegated "Direct link to heading")

This error occurs whenever the delegator can not delegate to the named validator. This can be caused by the following.

- The delegator `startTime` is before the validator `startTime`
- The delegator `endTime` is after the validator `endTime`
- The delegator weight would result in the validator total weight exceeding its maximum weight

# How to Stake (/docs/primary-network/validate/how-to-stake)

---
title: How to Stake
description: Learn how to stake on Avalanche.
---

Staking Parameters on Avalanche[​](#staking-parameters-on-avalanche "Direct link to heading")
---------------------------------------------------------------------------------------------

When a validator is done validating the [Primary Network](http://support.avalabs.org/en/articles/4135650-what-is-the-primary-network), it receives back the AVAX tokens it staked. It may receive a reward for helping to secure the network. A validator only receives a [validation reward](http://support.avalabs.org/en/articles/4587396-what-are-validator-staking-rewards) if it is sufficiently responsive and correct during the time it validates. Read the [Avalanche token white paper](https://www.avalabs.org/whitepapers) to learn more about AVAX and the mechanics of staking.

<Callout type="warn">
Staking rewards are sent to your wallet address at the end of the staking term **as long as all of these parameters are met**.
</Callout>

### Mainnet[​](#mainnet "Direct link to heading")

- The minimum amount that a validator must stake is 2,000 AVAX
- The minimum amount that a delegator must delegate is 25 AVAX
- The minimum amount of time one can stake funds for validation is 2 weeks
- The maximum amount of time one can stake funds for validation is 1 year
- The minimum amount of time one can stake funds for delegation is 2 weeks
- The maximum amount of time one can stake funds for delegation is 1 year
- The minimum delegation fee rate is 2%
- The maximum weight of a validator (their own stake + stake delegated to them) is the minimum of 3 million AVAX and 5 times the amount the validator staked. For example, if you staked 2,000 AVAX to become a validator, only 8000 AVAX can be delegated to your node total (not per delegator)

A validator will receive a staking reward if they are online and response for more than 80% of their validation period, as measured by a majority of validators, weighted by stake. **You should aim for your validator be online and responsive 100% of the time.**

You can call API method `info.uptime` on your node to learn its weighted uptime and what percentage of the network currently thinks your node has an uptime high enough to receive a staking reward. See [here.](/docs/rpcs/other/info-rpc#infouptime) You can get another opinion on your node's uptime from Avalanche's [Validator Health dashboard](https://stats.avax.network/dashboard/validator-health-check/). If your reported uptime is not close to 100%, there may be something wrong with your node setup, which may jeopardize your staking reward. If this is the case, please see [here](#why-is-my-uptime-low) or contact us on [Discord](https://discord.gg/avax/) so we can help you find the issue. Note that only checking the uptime of your validator as measured by non-staking nodes, validators with small stake, or validators that have not been online for the full duration of your validation period can provide an inaccurate view of your node's true uptime.

### Fuji Testnet[​](#fuji-testnet "Direct link to heading")

On Fuji Testnet, all staking parameters are the same as those on Mainnet except the following ones:

- The minimum amount that a validator must stake is 1 AVAX
- The minimum amount that a delegator must delegate is 1 AVAX
- The minimum amount of time one can stake funds for validation is 24 hours
- The minimum amount of time one can stake funds for delegation is 24 hours

Validators[​](#validators "Direct link to heading")
---------------------------------------------------

**Validators** secure Avalanche, create new blocks, and process transactions. To achieve consensus, validators repeatedly sample each other. The probability that a given validator is sampled is proportional to its stake.

When you add a node to the validator set, you specify:

- Your node's ID
- Your node's BLS key and BLS signature
- When you want to start and stop validating
- How many AVAX you are staking
- The address to send any rewards to
- Your delegation fee rate (see below)

<Callout title="Note">
The minimum amount that a validator must stake is 2,000 AVAX.
</Callout>

<Callout type="warn">
Note that once you issue the transaction to add a node as a validator, there is no way to change the parameters. **You can't remove your stake early or change the stake amount, node ID, or reward address.**

Please make sure you're using the correct values in the API calls below. If you're not sure, ask for help on [Discord](https://discord.gg/avax/). If you want to add more tokens to your own validator, you can delegate the tokens to this node - but you cannot increase the base validation amount (so delegating to yourself goes against your delegation cap).
</Callout>

### Running a Validator[​](#running-a-validator "Direct link to heading")

If you're running a validator, it's important that your node is well connected to ensure that you receive a reward.

When you issue the transaction to add a validator, the staked tokens and transaction fee (which is 0) are deducted from the addresses you control. When you are done validating, the staked funds are returned to the addresses they came from. If you earned a reward, it is sent to the address you specified when you added yourself as a validator.

#### Allow API Calls[​](#allow-api-calls "Direct link to heading")

To make API calls to your node from remote machines, allow traffic on the API port (`9650` by default), and run your node with argument `--http-host=`

You should disable all APIs you will not use via command-line arguments. You should configure your network to only allow access to the API port from trusted machines (for example, your personal computer.)

#### Why Is My Uptime Low?[​](#why-is-my-uptime-low "Direct link to heading")

Every validator on Avalanche keeps track of the uptime of other validators. Every validator has a weight (that is the amount staked on it.) The more weight a validator has, the more influence they have when validators vote on whether your node should receive a staking reward. You can call API method `info.uptime` on your node to learn its weighted uptime and what percentage of the network stake currently thinks your node has an uptime high enough to receive a staking reward.

You can also see the connections a node has by calling `info.peers`, as well as the uptime of each connection. **This is only one node's point of view**. Other nodes may perceive the uptime of your node differently. Just because one node perceives your uptime as being low does not mean that you will not receive staking rewards.

If your node's uptime is low, make sure you're setting config option `--public-ip=[NODE'S PUBLIC IP]` and that your node can receive incoming TCP traffic on port 9651.

#### Secret Management[​](#secret-management "Direct link to heading")

The only secret that you need on your validating node is its Staking Key, the TLS key that determines your node's ID. The first time you start a node, the Staking Key is created and put in `$HOME/.avalanchego/staking/staker.key`. You should back up this file (and `staker.crt`) somewhere secure. Losing your Staking Key could jeopardize your validation reward, as your node will have a new ID.

You do not need to have AVAX funds on your validating node. In fact, it's best practice to **not** have a lot of funds on your node. Almost all of your funds should be in "cold" addresses whose private key is not on any computer.

#### Monitoring[​](#monitoring "Direct link to heading")

Follow this [tutorial](/docs/nodes/maintain/monitoring) to learn how to monitor your node's uptime, general health, etc.

### Reward Formula[​](#reward-formula "Direct link to heading")

Consider a validator which stakes a $Stake$ amount of Avax for $StakingPeriod$ seconds.

Assume that at the start of the staking period there is a $Supply$ amount of Avax in the Primary Network.

The maximum amount of Avax is $MaximumSupply$ . Then at the end of its staking period, a responsive validator receives a reward calculated as follows:

$$
Reward = \left(MaximumSupply - Supply \right) \times \frac{Stake}{Supply} \times \frac{Staking Period}{Minting Period} \times EffectiveConsumptionRate
$$

where,

$$
EffectiveConsumptionRate = 
$$

$$
\frac{MinConsumptionRate}{PercentDenominator} \times \left(1- \frac{Staking Period}{Minting Period}\right) + \frac{MaxConsumptionRate}{PercentDenominator} \times \frac{Staking Period}{Minting Period}
$$

<Callout title="Note">
Note that $StakingPeriod$ is the staker's entire staking period, not just the staker's uptime, that is the aggregated time during which the staker has been responsive. The uptime comes into play only to decide whether a staker should be rewarded; to calculate the actual reward, only the staking period duration is taken into account.
</Callout>

$EffectiveConsumptionRate$ is a linear combination of $MinConsumptionRate$ and $MaxConsumptionRate$.
$MinConsumptionRate$ and $MaxConsumptionRate$ bound $EffectiveConsumptionRate$ because 

$$
MinConsumptionRate \leq EffectiveConsumptionRate \leq MaxConsumptionRate
$$

The larger $StakingPeriod$ is, the closer $EffectiveConsumptionRate$ is to $MaxConsumptionRate$.

A staker achieves the maximum reward for its stake if $StakingPeriod$ = $Minting Period$.

The reward is:

$$
Max Reward = \left(MaximumSupply - Supply \right) \times \frac{Stake}{Supply} \times \frac{MaxConsumptionRate}{PercentDenominator}
$$

Delegators[​](#delegators "Direct link to heading")
---------------------------------------------------

A delegator is a token holder, who wants to participate in staking, but chooses to trust an existing validating node through delegation.

When you delegate stake to a validator, you specify:

- The ID of the node you're delegating to
- When you want to start/stop delegating stake (must be while the validator is validating)
- How many AVAX you are staking
- The address to send any rewards to

<Callout title="Note">
The minimum amount that a delegator must delegate is 25 AVAX.
</Callout>

<Callout type="warn">
Note that once you issue the transaction to add your stake to a delegator, there is no way to change the parameters. **You can't remove your stake early or change the stake amount, node ID, or reward address.** If you're not sure, ask for help on [Discord](https://discord.gg/avax/).
</Callout>

### Delegator Rewards[​](#delegator-rewards "Direct link to heading")

If the validator that you delegate tokens to is sufficiently correct and responsive, you will receive a reward when you are done delegating. Delegators are rewarded according to the same function as validators. However, the validator that you delegate to keeps a portion of your reward specified by the validator's delegation fee rate.

When you issue the transaction to delegate tokens, the staked tokens and transaction fee are deducted from the addresses you control. When you are done delegating, the staked tokens are returned to your address. If you earned a reward, it is sent to the address you specified when you delegated tokens. Rewards are sent to delegators right after the delegation ends with the return of staked tokens, and before the validation period of the node they're delegating to is complete.

FAQ[​](#faq "Direct link to heading")
-------------------------------------

### Is There a Tool to Check the Health of a Validator?[​](#is-there-a-tool-to-check-the-health-of-a-validator "Direct link to heading")

Yes, just enter your node's ID in the Avalanche Stats [Validator Health Dashboard](https://stats.avax.network/dashboard/validator-health-check/?nodeid=NodeID-Jp4dLMTHd6huttS1jZhqNnBN9ZMNmTmWC).

### How Is It Determined Whether a Validator Receives a Staking Reward?[​](#how-is-it-determined-whether-a-validator-receives-a-staking-reward "Direct link to heading")

When a node leaves the validator set, the validators vote on whether the leaving node should receive a staking reward or not. If a validator calculates that the leaving node was responsive for more than the required uptime (currently 80%), the validator will vote for the leaving node to receive a staking reward. Otherwise, the validator will vote that the leaving node should not receive a staking reward. The result of this vote, which is weighted by stake, determines whether the leaving node receives a reward or not.

Each validator only votes "yes" or "no." It does not share its data such as the leaving node's uptime.

Each validation period is considered separately. That is, suppose a node joins the validator set, and then leaves. Then it joins and leaves again. The node's uptime during its first period in the validator set does not affect the uptime calculation in the second period, hence, has no impact on whether the node receives a staking reward for its second period in the validator set.

### How Are Delegation Fees Distributed To Validators?[​](#how-are-delegation-fees-distributed-to-validators "Direct link to heading")

If a validator is online for 80% of a delegation period, they receive a % of the reward (the fee) earned by the delegator. The P-Chain used to distribute this fee as a separate UTXO per delegation period. After the [Cortina Activation](https://medium.com/avalancheavax/cortina-x-chain-linearization-a1d9305553f6), instead of sending a fee UTXO for each successful delegation period, fees are now batched during a node's entire validation period and are distributed when it is unstaked.

### Error: Couldn't Issue TX: Validator Would Be Over Delegated[​](#error-couldnt-issue-tx-validator-would-be-over-delegated "Direct link to heading")

This error occurs whenever the delegator can not delegate to the named validator. This can be caused by the following.

- The delegator `startTime` is before the validator `startTime`
- The delegator `endTime` is after the validator `endTime`
- The delegator weight would result in the validator total weight exceeding its maximum weight

# Exchange Integration (/docs/primary-network/exchange-integration)

---
title: Exchange Integration
description: Learn how to integrate your exchange with the EVM-Compatible Avalanche C-Chain.
---

## Overview

The objective of this document is to provide a brief overview of how to
integrate with the EVM-Compatible Avalanche C-Chain.

For teams that already
support ETH, supporting the C-Chain is as straightforward as spinning up an
Avalanche node (which has the [same API](https://ethereum.org/en/developers/docs/apis/json-rpc/) as
[`go-ethereum`](https://geth.ethereum.org/docs/rpc/server)) and populating
Avalanche's ChainID (43114) when constructing transactions.

Additionally, Ava Labs maintains an implementation of the [Rosetta
API](https://docs.cdp.coinbase.com/mesh/docs/welcome) for the C-Chain called
[avalanche-rosetta](https://github.com/ava-labs/avalanche-rosetta). You can
learn more about this standardized integration path on the attached Rosetta API
website.

## Integration Using EVM Endpoints

### Running an Avalanche Node

If you want to build your node form source or include it in a docker image,
reference the [AvalancheGo GitHub
repository](https://github.com/ava-labs/avalanchego). To quickly get up and
running, you can use the [node installation script](/docs/nodes/run-a-node/using-install-script/installing-avalanche-go) that automates installing
and updating AvalancheGo node as a `systemd` service on Linux, using prebuilt
binaries.

### Configuring an Avalanche Node

All configuration options and their default values are described [here](/docs/nodes/configure/configs-flags).

You can supply configuration options on the command line, or use a config file,
which can be easier to work with when supplying many options. You can specify
the config file location with `—config-file=config.json`, where `config.json` is
a JSON file whose keys and values are option names and values.

Individual chains, including the C-Chain, have their own configuration options
which are separate from the node-level options. These can also be specified in a
config file. For more details, see
[here](/docs/nodes/chain-configs/primary-network/c-chain).

The C-Chain config file should be at
`$HOME/.avalanchego/configs/chains/C/config.json`. You can also tell AvalancheGo
to look somewhere else for the C-Chain config file with option
`--chain-config-dir`. An example C-Chain config file:

<Callout type="warn">
If you need Ethereum's [Archive
Node](https://ethereum.org/en/developers/docs/nodes-and-clients/#archive-node)
functionality, you need to disable C-Chain pruning, which has been enabled by
default since AvalancheGo v1.4.10. To disable pruning, include
`"pruning-enabled": false` in the C-Chain config file as shown below.
</Callout>

```json
{
  "snowman-api-enabled": false,
  "coreth-admin-api-enabled": false,
  "local-txs-enabled": true,
  "pruning-enabled": false,
  "eth-apis": [
    "internal-eth",
    "internal-blockchain",
    "internal-transaction",
    "internal-tx-pool",
    "internal-account",
    "internal-personal",
    "debug-tracer",
    "web3",
    "eth",
    "eth-filter",
    "admin",
    "net"
  ]
}
```

### Interacting with the C-Chain

Interacting with the C-Chain is identical to interacting with
[`go-ethereum`](https://geth.ethereum.org/). You can find the reference material
for C-Chain API [here](/docs/rpcs/c-chain).

Please note that `personal_` namespace is turned off by default. To turn it on,
you need to pass the appropriate command line switch to your node, like in the
above config example.

## Integration Using Rosetta

[Rosetta](https://docs.cdp.coinbase.com/mesh/docs/welcome) is an open-source specification and set
of tools that makes integrating with different blockchain networks easier by
presenting the same set of APIs for every network. The Rosetta API is made up of
2 core components, the [Data
API](https://docs.cdp.coinbase.com/mesh/docs/api-data) and the
[Construction
API](https://docs.cdp.coinbase.com/mesh/docs/api-construction).

Together, these APIs allow for anyone to read and write to blockchains in a
standard format over a standard communication protocol. The specifications for
these APIs can be found in the
[rosetta-specifications](https://github.com/coinbase/rosetta-specifications)
repository.

You can find the Rosetta server implementation for Avalanche C-Chain
[here](https://github.com/ava-labs/avalanche-rosetta), all you need to do is
install and run the server with proper configuration. It comes with a `Dockerfile`
that packages both the server and the Avalanche client. Detailed instructions
can be found in the linked repository.

## Constructing Transactions

Avalanche C-Chain transactions are identical to standard EVM transactions with 2 exceptions:

- They must be signed with Avalanche's ChainID (43114).
- The detailed dynamic gas fee can be found [here](/docs/rpcs/other/guides/txn-fees#c-chain-fees).

For development purposes, Avalanche supports all the popular tooling for
Ethereum, so developers familiar with Ethereum and Solidity can feel right at
home. Popular development environments include:

- [Remix IDE](https://remix.ethereum.org/)
- [thirdweb](https://thirdweb.com/)
- [Hardhat](https://hardhat.org/)

## Ingesting On-Chain Data

You can use any standard way of ingesting on-chain data you use for Ethereum network.

### Determining Finality

Avalanche consensus provides fast and irreversible finality with ~1 second. To
query the most up-to-date finalized block, query any value (that is block, balance,
state, etc) with the `latest` parameter. If you query above the last finalized
block (that is eth_blockNumber returns 10 and you query 11), an error will be
thrown indicating that unfinalized data cannot be queried (as of
`avalanchego@v1.3.2`).

### (Optional) Custom Golang SDK

If you plan on extracting data from the C-Chain into your own systems using
Golang, we recommend using our custom
[`ethclient`](https://github.com/ava-labs/avalanchego/tree/master/graft/coreth/ethclient). The
standard `go-ethereum` Ethereum client does not compute block hashes correctly
(when you call `block.Hash()`) because it doesn't take into account the added
[ExtDataHash](https://github.com/ava-labs/avalanchego/blob/master/graft/coreth/core/types/block.go#L98)
header field in Avalanche C-Chain blocks, which is used move AVAX between chains
(X-Chain and P-Chain). You can read more about our multi-chain abstraction
[here](/docs/primary-network) (out of scope for a
normal C-Chain integration).

If you plan on reading JSON responses directly or use web3.js (doesn't recompute
hash received over the wire) to extract on-chain transaction data/logs/receipts,
you shouldn't have any issues!

## Support

If you have any problems or questions, reach out either directly to our
developers, or on our public [Discord](https://chat.avalabs.org/) server.
