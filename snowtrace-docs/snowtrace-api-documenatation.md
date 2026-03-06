---
description: Snowtrace Explorer allows you to explore and search for transactions, addresses, tokens, prices and other activities taking place across the Avalanche ecosystem.
title: Documentation - Snowtrace Testnet Multichain Blockchain Explorer
image: https://testnet.routescan.io/api/og?chainid=all&amp;ecosystem=avalanche&amp;version=0.4817996810747148
---

# Documentation - Snowtrace Explorer

Getting Started

Getting Started

Routescan APIs

APIs (9)

Contract Verification

Verify Contract

Documentation ›Getting Started

## Welcome to the Routescan APIs documentation 🚀

Routescan is the first multichain ecosystem explorer, search, API, and analytics platform for all major EVM (Ethereum Virtual Machine) chains, including Ethereum, Avalanche, Metis, Boba and others. With its comprehensive tools and user-friendly interface, Routescan offers unparalleled insights into various blockchain networks, enhancing transparency and promoting a deeper understanding of decentralized ecosystems.

To ensure equal access to blockchain information, we've designed the **Routescan Developer APIs**. This allows developers to tap directly into Routescan's block explorer data and services through **GET/POST requests**.

Routescan's APIs are provided as a **community service** and **without warranty**, so please use what you need and no more.

## Fast APIs

At Routescan, we've engineered high-speed REST APIs that offer results in near real-time. Whether you're aiming to retrieve ERC20 transfers, NFT movements, or the latest transactions with minimal latency and delay, our REST APIs are the go-to solution. Additionally, you can fetch balances, token holdings, and more with ease.

## Etherscan compatibility

At Routescan, we understand the importance of seamless transitions and the value of pre-existing code. Therefore, to assist developers and facilitate smoother migrations of dApps, we've structured our data from all EVM chains indexed by Routescan to align with Etherscan's API format.

This compatibility ensures that developers can effortlessly recycle older codebases and integrate them into new or expanding projects, eliminating the need to start from scratch and thereby optimizing development time and resources.

## API Plans

### Free Tier

Our free tier allows you to access blockchain data without needing an API key at all. This tier supports up to **2 requests per second (rps) and a daily limit of 10,000 calls**, making it perfect for developers or users starting out or working on projects with moderate API usage.

You can also get higher limits by registering on routescan.io and get a Free API key with up to \\\*5 calls/second (rps) and a daily limit of 100,000 call.\*

> Note: Normally, requests will go through even without any placeholders. Placeholders are only necessary for certain integrations where including a key parameter in the query, config files, or similar is required. You can use any API key value in query parameters: `&apikey=placeholder`. Or in configs: `apiKey: { routescan: "placeholder" }`.

Please be aware that not all chains are fully indexed, which could result in incomplete data. For the most current information on indexing, see our chain list: <https://docs.routescan.io/indexing-status>.

### Paid Plans

For higher usage volumes and priority support, we offer paid plans that require an API key.

With one API key, you can:

- Access all chains we index\*
- Use the `/all` parameter to retrieve data across all supported chains
- Benefit from increased rate limits, higher daily call volumes, and priority support
- Simplify your development process with seamless multichain integration

Monthly Quarterly (15% off)Yearly (20% off)

Free$0/mo5 calls/secondup to 100,000 calls/dayAccess to ALL endpointsGeneral supportAPI Key requiredActive

Standard $160/mo

$2400$1920/yr

10 calls/second up to 200.000 calls/day Priority supportAccess to ALL endpointsUpgrade

Advanced $240/mo

$3600$2880/yr

20 calls/second up to 500.000 calls/day Priority supportAccess to ALL endpointsUpgrade

Recommended

Professional $320/mo

$4800$3840/yr

30 calls/second up to 1.000.000 calls/day Priority supportAccess to ALL endpointsUpgrade

Pro Plus $440/mo

$6600$5280/yr

30 calls/second up to 1.500.000 calls/day Priority supportAccess to ALL endpointsUpgrade

Source attribution via a backlink or a mention that your app is "Powered by Routescan.io APIs" is required for FREE plan except for personal/private usage

You can manage your API keys and subscription plans directly within your Profile Settings.  
Custom plans with enhanced limits and features are also available. Contact us at [\[email protected\]](/cdn-cgi/l/email-protection#cba3aea7a7a48bb9a4bebfaeb8a8aaa5e5a2a4) for more details.

## Already have an API plan?

Log in to the portal with your associated email address and a one-time passcode to manage your subscription.  
<https://billing.stripe.com/p/login/7sI2bvgk22LS10s9AA>

\* Please note that some chains may not be fully indexed and could return incomplete data. For the latest details on indexing status, please refer to the list at the following link: <https://docs.routescan.io/indexing-status>

---

description: Snowtrace Explorer allows you to explore and search for transactions, addresses, tokens, prices and other activities taking place across the Avalanche ecosystem.
title: Etherscan-like APIs - Snowtrace Testnet Multichain Blockchain Explorer
image: https://testnet.routescan.io/api/og?chainid=all&amp;ecosystem=avalanche&amp;version=0.613075819050229

---

# Documentation - Snowtrace Explorer

APIs \> Account

Getting Started

Routescan APIs

APIs (9)

Account

Block

Contract

Geth/Parity Proxy

Logs

Nametags

Stats

Tokens

Transactions

Contract Verification

Verify Contract

Documentation ›APIs > Account

No sign-up or API key required for free tier access (up to 2 requests per second, with a daily limit of 10,000 calls).

Get Ether Balance for a Single Address

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=account&action=balance&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&tag=latest&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=account&action=balance&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&tag=latest&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `string` representing the address to check for balance

tag

the `string` pre-defined block parameter, either `earliest`, `pending` or `latest`

Get Ether Balance for Multiple Addresses in a Single Call

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=account&action=balancemulti&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a,0x63a9975ba31b0b9626b34300f7f627147df1f526,0x198ef1ec325a96cc354c7266a038be8b5c558f67&tag=latest&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=account&action=balancemulti&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a,0x63a9975ba31b0b9626b34300f7f627147df1f526,0x198ef1ec325a96cc354c7266a038be8b5c558f67&tag=latest&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `strings` representing the addresses to check for balance, separated by, up to **20 addresses** per call

tag

the `integer` pre-defined block parameter, either `earliest`, `pending` or `latest`

Get a list of 'Normal' Transactions By Address

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=account&action=txlist&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=account&action=txlist&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `string` representing the addresses to check for balance

startblock

the `integer` block number to start searching for transactions

endblock

the `integer` block number to stop searching for transactions

page

the `integer` page number, if pagination is enabled

offset

the number of transactions displayed per page

sort

the sorting preference, use `asc` to sort by ascending and `desc` to sort by descending. **Tip**: Specify a smaller startblock and endblock range for faster search results.

Get a list of 'Internal' Transactions by Address

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=account&action=txlistinternal&address=0x2c1ba59d6f58433fb1eaee7d20b26ed83bda51a3&startblock=0&endblock=2702578&page=1&offset=10&sort=asc&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=account&action=txlistinternal&address=0x2c1ba59d6f58433fb1eaee7d20b26ed83bda51a3&startblock=0&endblock=2702578&page=1&offset=10&sort=asc&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `string` representing the addresses to check for balance

startblock

the `integer` block number to start searching for transactions

endblock

the `integer` block number to stop searching for transactions

page

the `integer` page number, if pagination is enabled

offset

the number of transactions displayed per page

sort

the sorting preference, use `asc` to sort by ascending and `desc` to sort by descending

Get 'Internal Transactions' by Transaction Hash

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=account&action=txlistinternal&txhash=0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=account&action=txlistinternal&txhash=0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

txhash

the `string` representing the transaction hash to check for internal transactions

Get "Internal Transactions" by Block Range

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=account&action=txlistinternal&startblock=13481773&endblock=13491773&page=1&offset=10&sort=asc&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=account&action=txlistinternal&startblock=13481773&endblock=13491773&page=1&offset=10&sort=asc&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

startblock

the `integer` block number to start searching for transactions

endblock

the `integer` block number to stop searching for transactions

page

the `integer` page number, if pagination is enabled

offset

the number of transactions displayed per page

sort

the sorting preference, use `asc` to sort by ascending and `desc` to sort by descending

Get a list of 'ERC20 - Token Transfer Events' by Address

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=account&action=tokentx&contractaddress=0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7&address=0x77134cbC06cB00b66F4c7e623D5fdBF6777635EC&page=1&offset=100&startblock=34372864&endblock=34472864&sort=asc&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=account&action=tokentx&contractaddress=0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7&address=0x77134cbC06cB00b66F4c7e623D5fdBF6777635EC&page=1&offset=100&startblock=34372864&endblock=34472864&sort=asc&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `string` representing the address to check for balance

contractaddress

the `string` representing the token contract address to check for balance

page

the `integer` page number, if pagination is enabled

offset

the number of transactions displayed per page

startblock

the `integer` block number to start searching for transactions

endblock

the `integer` block number to stop searching for transactions

sort

the sorting preference, use `asc` to sort by ascending and `desc` to sort by descending

Get a list of 'ERC721 - Token Transfer Events' by Address

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=account&action=tokennfttx&contractaddress=0x3025c5c2aa6eb7364555aac0074292195701bbd6&address=0x6f50142e432b0f6cb851d93430fd5afaafa0734a&page=1&offset=100&startblock=25176525&endblock=35676525&sort=desc&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=account&action=tokennfttx&contractaddress=0x3025c5c2aa6eb7364555aac0074292195701bbd6&address=0x6f50142e432b0f6cb851d93430fd5afaafa0734a&page=1&offset=100&startblock=25176525&endblock=35676525&sort=desc&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `string` representing the address to check for balance

contractaddress

the `string` representing the token contract address to check for balance

page

the `integer` page number, if pagination is enabled

offset

the number of transactions displayed per page

startblock

the `integer` block number to start searching for transactions

endblock

the `integer` block number to stop searching for transactions

sort

the sorting preference, use `asc` to sort by ascending and `desc` to sort by descending

Get a list of 'ERC1155 - Token Transfer Events' by Address

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=account&action=token1155tx&contractaddress=0xa695ea0c90d89a1463a53fa7a02168bc46fbbf7e&address=0xd550d3fa339f8a6ba2957c83e379d7d7da0fd529&page=1&offset=100&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=account&action=token1155tx&contractaddress=0xa695ea0c90d89a1463a53fa7a02168bc46fbbf7e&address=0xd550d3fa339f8a6ba2957c83e379d7d7da0fd529&page=1&offset=100&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `string` representing the address to check for balance

contractaddress

the `string` representing the token contract address to check for balance

page

the `integer` page number, if pagination is enabled

offset

the number of transactions displayed per page

startblock

the `integer` block number to start searching for transactions

endblock

the `integer` block number to stop searching for transactions

sort

the sorting preference, use `asc` to sort by ascending and `desc` to sort by descending

Get Historical Ether Balance for a Single Address By BlockNo

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=account&action=balancehistory&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&blockno=8000000&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=account&action=balancehistory&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&blockno=8000000&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `string` representing the address to check for balance

blockno

the `integer` block number to check balance.

Get Gas Oracle

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

---

description: Snowtrace Explorer allows you to explore and search for transactions, addresses, tokens, prices and other activities taking place across the Avalanche ecosystem.
title: Etherscan-like APIs - Snowtrace Testnet Multichain Blockchain Explorer
image: https://testnet.routescan.io/api/og?chainid=all&amp;ecosystem=avalanche&amp;version=0.3147276562846426

---

# Documentation - Snowtrace Explorer

APIs \> Block

Getting Started

Routescan APIs

APIs (9)

Account

Block

Contract

Geth/Parity Proxy

Logs

Nametags

Stats

Tokens

Transactions

Contract Verification

Verify Contract

Documentation ›APIs > Block

No sign-up or API key required for free tier access (up to 2 requests per second, with a daily limit of 10,000 calls).

Get Estimated Block Countdown Time by BlockNo

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=block&action=getblockcountdown&blockno=16701588&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=block&action=getblockcountdown&blockno=16701588&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

blockno

the `integer` block number to estimate time remaining to be mined.

Get Block Number by Timestamp

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=block&action=getblocknobytime×tamp=1619638524&closest=before&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=block&action=getblocknobytime&timestamp=1619638524&closest=before&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

timestamp

the `integer` representing the Unix timestamp in seconds.

closest

the closest available block to the provided timestamp, either `before` or `after`

---

description: Snowtrace Explorer allows you to explore and search for transactions, addresses, tokens, prices and other activities taking place across the Avalanche ecosystem.
title: Etherscan-like APIs - Snowtrace Testnet Multichain Blockchain Explorer
image: https://testnet.routescan.io/api/og?chainid=all&amp;ecosystem=avalanche&amp;version=0.18641126639769656

---

# Documentation - Snowtrace Explorer

APIs \> Contract

Getting Started

Routescan APIs

APIs (9)

Account

Block

Contract

Geth/Parity Proxy

Logs

Nametags

Stats

Tokens

Transactions

Contract Verification

Verify Contract

Documentation ›APIs > Contract

No sign-up or API key required for free tier access (up to 2 requests per second, with a daily limit of 10,000 calls).

Get Contract Creator and Creation Tx Hash

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=contract&action=getcontractcreation&contractaddresses=0xB83c27805aAcA5C7082eB45C868d955Cf04C337F,0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45,0xe4462eb568E2DFbb5b0cA2D3DbB1A35C9Aa98aad,0xdAC17F958D2ee523a2206206994597C13D831ec7,0xf5b969064b91869fBF676ecAbcCd1c5563F591d0&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=contract&action=getcontractcreation&contractaddresses=0xB83c27805aAcA5C7082eB45C868d955Cf04C337F,0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45,0xe4462eb568E2DFbb5b0cA2D3DbB1A35C9Aa98aad,0xdAC17F958D2ee523a2206206994597C13D831ec7,0xf5b969064b91869fBF676ecAbcCd1c5563F591d0&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

contractaddresses

the contract address , up to 5 at a time

Get Contract ABI for Verified Contract Source Codes

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=contract&action=getabi&address=0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=contract&action=getabi&address=0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `contract address` that has a verified source code

Get Contract Source Code for Verified Contract Source Codes

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=contract&action=getsourcecode&address=0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=contract&action=getsourcecode&address=0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `contract address` that has a verified source code

Verify Source Code

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=contract&action=verifysourcecode&contractaddress=0x2A1D1C87d18dd13d7a1e91A42C9fFEc486EB6433&sourceCode=// SPDX-License-Identifier: MIT// compiler version must be greater than or equal to 0.8.10 and less than 0.9.0pragma solidity ^0.8.10;contract HelloWorld { string public greet = "Hello World!";}&codeformat=solidity-single-file&contractname=HelloWorld&compilerversion=v0.8.10 commit.fc410830&optimizationUsed=0&runs=200&licenseType=1&apikey=YourApiKeyToken

Requests must be sent using HTTP POST, limited to 250 verifications/day

- Request
- Response

Query Parameters

Parameter

Description

module

contract

action

verifysourcecode

contractaddress

0x2A1D1C87d18dd13d7a1e91A42C9fFEc486EB6433

sourceCode

// SPDX-License-Identifier: MIT // compiler version must be greater than or equal to 0.8.10 and less than 0.9.0 pragma solidity ^0.8.10; contract HelloWorld { string public greet = "Hello World!"; }

constructorArguments

// for contracts that were created with constructor parameters, using ABI encoding.

codeformat

// solidity-single-file | solidity-standard-json-input

contractname

HelloWorld

compilerversion

v0.8.10+commit.fc410830

evmversion

// shangai for the latest version, otherwise choose from the older versions

optimizationUsed

// use 0 for no optimization, and 1 if optimization was used

runs

200

licenseType

1

Check Source Code Verification Submission Status

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=contract&action=checkverifystatus&guid=ezq878u486pzijkvvmerl6a9mzwhv6sefgvqi5tkwceejc7tvn&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=contract&action=checkverifystatus&guid=ezq878u486pzijkvvmerl6a9mzwhv6sefgvqi5tkwceejc7tvn&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

guid

ezq878u486pzijkvvmerl6a9mzwhv6sefgvqi5tkwceejc7tvn

---

description: Snowtrace Explorer allows you to explore and search for transactions, addresses, tokens, prices and other activities taking place across the Avalanche ecosystem.
title: Etherscan-like APIs - Snowtrace Testnet Multichain Blockchain Explorer
image: https://testnet.routescan.io/api/og?chainid=all&amp;ecosystem=avalanche&amp;version=0.06908509289488307

---

# Documentation - Snowtrace Explorer

APIs \> Geth/Parity Proxy

Getting Started

Routescan APIs

APIs (9)

Account

Block

Contract

Geth/Parity Proxy

Logs

Nametags

Stats

Tokens

Transactions

Contract Verification

Verify Contract

Documentation ›APIs > Geth/Parity Proxy

No sign-up or API key required for free tier access (up to 2 requests per second, with a daily limit of 10,000 calls).

eth_blockNumber

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=proxy&action=eth_blockNumber&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=proxy&action=eth%5FblockNumber&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

eth_getBlockByNumber

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=proxy&action=eth_getBlockByNumber&tag=0x10d4f&boolean=true&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=proxy&action=eth%5FgetBlockByNumber&tag=0x10d4f&boolean=true&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

tag

the block number, in hex eg. `0xC36B3C`

boolean

the boolean value to show full transaction objects. when `true`, returns full transaction objects and their information, when `false` only returns a list of transactions.

eth_getUncleByBlockNumberAndIndex

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=proxy&action=eth_getUncleByBlockNumberAndIndex&tag=0xC63276&index=0x0&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=proxy&action=eth%5FgetUncleByBlockNumberAndIndex&tag=0xC63276&index=0x0&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

tag

the block number, in hex eg. `0xC36B3C`

index

the position of the uncle's index in the block, in hex eg. `0x5`

eth_getBlockTransactionCountByNumber

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=proxy&action=eth_getBlockTransactionCountByNumber&tag=0x10FB78&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=proxy&action=eth%5FgetBlockTransactionCountByNumber&tag=0x10FB78&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

tag

the block number, in hex eg. `0x10FB78`

eth_getTransactionByHash

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=proxy&action=eth_getTransactionByHash&txhash=0xbc78ab8a9e9a0bca7d0321a27b2c03addeae08ba81ea98b03cd3dd237eabed44&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=proxy&action=eth%5FgetTransactionByHash&txhash=0xbc78ab8a9e9a0bca7d0321a27b2c03addeae08ba81ea98b03cd3dd237eabed44&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

txhash

the `string` representing the hash of the transaction

eth_getTransactionByBlockNumberAndIndex

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=proxy&action=eth_getTransactionByBlockNumberAndIndex&tag=0xC6331D&index=0x11A&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=proxy&action=eth%5FgetTransactionByBlockNumberAndIndex&tag=0xC6331D&index=0x11A&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

tag

the block number, in hex eg. `0xC36B3C`

index

the position of the uncle's index in the block, in hex eg. `0x5`

eth_getTransactionCount

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=proxy&action=eth_getTransactionCount&address=0x4bd5900Cb274ef15b153066D736bf3e83A9ba44e&tag=latest&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=proxy&action=eth%5FgetTransactionCount&address=0x4bd5900Cb274ef15b153066D736bf3e83A9ba44e&tag=latest&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `string` representing the address to get transaction count

tag

the string pre-defined block parameter, either `earliest`, `pending` or `latest`

eth_getTransactionReceipt

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=proxy&action=eth_getTransactionReceipt&txhash=0xadb8aec59e80db99811ac4a0235efa3e45da32928bcff557998552250fa672eb&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=proxy&action=eth%5FgetTransactionReceipt&txhash=0xadb8aec59e80db99811ac4a0235efa3e45da32928bcff557998552250fa672eb&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

txhash

the `string` representing the hash of the transaction

eth_call

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=proxy&action=eth_call&to=0xAEEF46DB4855E25702F8237E8f403FddcaF931C0&data=0x70a08231000000000000000000000000e16359506c028e51f16be38986ec5746251e9724&tag=latest&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=proxy&action=eth%5Fcall&to=0xAEEF46DB4855E25702F8237E8f403FddcaF931C0&data=0x70a08231000000000000000000000000e16359506c028e51f16be38986ec5746251e9724&tag=latest&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

to

the `string` representing the address to interact with

data

the hash of the method signature and encoded parameters

tag

the string pre-defined block parameter, either `earliest`, `pending` or `latest`

eth_getCode

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=proxy&action=eth_getCode&address=0xf75e354c5edc8efed9b59ee9f67a80845ade7d0c&tag=latest&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=proxy&action=eth%5FgetCode&address=0xf75e354c5edc8efed9b59ee9f67a80845ade7d0c&tag=latest&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `string` representing the address to get code

tag

the string pre-defined block parameter, either `earliest`, `pending` or `latest`

eth_getStorageAt

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=proxy&action=eth_getStorageAt&address=0x6e03d9cce9d60f3e9f2597e13cd4c54c55330cfd&position=0x0&tag=latest&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=proxy&action=eth%5FgetStorageAt&address=0x6e03d9cce9d60f3e9f2597e13cd4c54c55330cfd&position=0x0&tag=latest&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `string` representing the address to get code

position

the hex code of the position in storage, eg `0x0`

tag

the string pre-defined block parameter, either `earliest`, `pending` or `latest`

eth_gasPrice

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=proxy&action=eth_gasPrice&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=proxy&action=eth%5FgasPrice&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

eth_estimateGas

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=proxy&action=eth_estimateGas&data=0x4e71d92d&to=0xf0160428a8552ac9bb7e050d90eeade4ddd52843&value=0xff22&gasPrice=0x51da038cc&gas=0x5f5e0ff&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=proxy&action=eth%5FestimateGas&data=0x4e71d92d&to=0xf0160428a8552ac9bb7e050d90eeade4ddd52843&value=0xff22&gasPrice=0x51da038cc&gas=0x5f5e0ff&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

data

the hash of the method signature and encoded parameters

to

the `string` representing the address to interact with

value

the value sent in this transaction, in hex eg. `0xff22`

gasPrice

the gas price paid for each unit of gas, in wei post EIP-1559, the `gasPrice` has to be higher than the block's `baseFeePerGas`

gas

the amount of gas provided for the transaction, in hex eg. `0x5f5e0ff`

---

description: Snowtrace Explorer allows you to explore and search for transactions, addresses, tokens, prices and other activities taking place across the Avalanche ecosystem.
title: Etherscan-like APIs - Snowtrace Testnet Multichain Blockchain Explorer
image: https://testnet.routescan.io/api/og?chainid=all&amp;ecosystem=avalanche&amp;version=0.32330721629696

---

# Documentation - Snowtrace Explorer

APIs \> Logs

Getting Started

Routescan APIs

APIs (9)

Account

Block

Contract

Geth/Parity Proxy

Logs

Nametags

Stats

Tokens

Transactions

Contract Verification

Verify Contract

Documentation ›APIs > Logs

No sign-up or API key required for free tier access (up to 2 requests per second, with a daily limit of 10,000 calls).

Get Event Logs by Address

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=logs&action=getLogs&address=0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7&fromBlock=37000000&toBlock=37200000&page=1&offset=1000&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=logs&action=getLogs&address=0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7&fromBlock=37000000&toBlock=37200000&page=1&offset=1000&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `string` representing the address to check for logs

fromBlock

the `integer` block number to start searching for logs eg. `37000000`

toBlock

the `integer` block number to stop searching for logs eg. `37200000`

page

the `integer` page number, if pagination is enabled

offset

the number of transactions displayed per page

Get Event Logs by Topics

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=logs&action=getLogs&fromBlock=37000000&toBlock=37200000&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0_1_opr=and&topic1=0x0000000000000000000000000000000000000000000000000000000000000000&page=1&offset=1000&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=logs&action=getLogs&fromBlock=37000000&toBlock=37200000&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0%5F1%5Fopr=and&topic1=0x0000000000000000000000000000000000000000000000000000000000000000&page=1&offset=1000&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

fromBlock

the `integer` block number to start searching for logs eg. `37000000`

toBlock

the `integer` block number to stop searching for logs eg. `37200000`

topic0

the topic numbers to search for limited to `topic0`, `topic1`, `topic2`, `topic3`

topic0_1_opr

the topic operator when multiple topic combinations are used limited to `and` or `or`

topic1

the topic numbers to search for limited to `topic0`, `topic1`, `topic2`, `topic3`

page

the `integer` page number, if pagination is enabled

offset

the number of transactions displayed per page

Get Event Logs by Address filtered by Topics

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=logs&action=getLogs&fromBlock=37000000&toBlock=37200000&address=0x9e66eba102b77fc75cd87b5e60141b85573bc8e8&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0_1_opr=and&topic1=0x0000000000000000000000000000000000000000000000000000000000000000&page=1&offset=1000&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=logs&action=getLogs&fromBlock=37000000&toBlock=37200000&address=0x9e66eba102b77fc75cd87b5e60141b85573bc8e8&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0%5F1%5Fopr=and&topic1=0x0000000000000000000000000000000000000000000000000000000000000000&page=1&offset=1000&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

fromBlock

the `integer` block number to start searching for logs eg. `37000000`

toBlock

the `integer` block number to stop searching for logs eg. `37200000`

address

the `string` representing the address to check for logs

topic0

the topic numbers to search for limited to `topic0`, `topic1`, `topic2`, `topic3`

topic0_1_opr

the topic operator when multiple topic combinations are used limited to `and` or `or`

topic1

the topic numbers to search for limited to `topic0`, `topic1`, `topic2`, `topic3`

page

the `integer` page number, if pagination is enabled

offset

the number of transactions displayed per page

---

description: Snowtrace Explorer allows you to explore and search for transactions, addresses, tokens, prices and other activities taking place across the Avalanche ecosystem.
title: Etherscan-like APIs - Snowtrace Testnet Multichain Blockchain Explorer
image: https://testnet.routescan.io/api/og?chainid=all&amp;ecosystem=avalanche&amp;version=0.05940270420413496

---

# Documentation - Snowtrace Explorer

APIs \> Nametags

Getting Started

Routescan APIs

APIs (9)

Account

Block

Contract

Geth/Parity Proxy

Logs

Nametags

Stats

Tokens

Transactions

Contract Verification

Verify Contract

Documentation ›APIs > Nametags

No sign-up or API key required for free tier access (up to 2 requests per second, with a daily limit of 10,000 calls).

Get Nametag (Metadata) for an Address

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?action=getaddresstag&module=nametag&address=0xF977814e90dA44bFA03b6295A0616a897441aceC&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?action=getaddresstag&module=nametag&address=0xF977814e90dA44bFA03b6295A0616a897441aceC&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

address

The address to query.

module

Set to `nametag` for this endpoint.

action

Set to `getaddresstag` for this endpoint.

---

description: Snowtrace Explorer allows you to explore and search for transactions, addresses, tokens, prices and other activities taking place across the Avalanche ecosystem.
title: Etherscan-like APIs - Snowtrace Testnet Multichain Blockchain Explorer
image: https://testnet.routescan.io/api/og?chainid=all&amp;ecosystem=avalanche&amp;version=0.9290397008953398

---

# Documentation - Snowtrace Explorer

APIs \> Tokens

Getting Started

Routescan APIs

APIs (9)

Account

Block

Contract

Geth/Parity Proxy

Logs

Nametags

Stats

Tokens

Transactions

Contract Verification

Verify Contract

Documentation ›APIs > Tokens

No sign-up or API key required for free tier access (up to 2 requests per second, with a daily limit of 10,000 calls).

Get ERC20-Token TotalSupply by ContractAddress

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=stats&action=tokensupply&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=stats&action=tokensupply&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

contractaddress

the `contract address` of the ERC-20 token

Get ERC20-Token Account Balance for TokenContractAddress

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=account&action=tokenbalance&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&address=0xe04f27eb70e025b78871a2ad7eabe85e61212761&tag=latest&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=account&action=tokenbalance&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&address=0xe04f27eb70e025b78871a2ad7eabe85e61212761&tag=latest&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

contractaddress

the `contract address` of the ERC-20 token

address

the `string` representing the address to check for token balance

tag

the string pre-defined block parameter, either `earliest`, `pending` or `latest`

Get Historical ERC20-Token TotalSupply by ContractAddress & BlockNo

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=stats&action=tokensupplyhistory&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&blockno=8000000&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=stats&action=tokensupplyhistory&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&blockno=8000000&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

contractaddress

the `contract address` of the ERC-20 token

blockno

the `integer` block number to check total supply for eg. `12697906`

Get Historical ERC20-Token Account Balance for TokenContractAddress by BlockNo

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=account&action=tokenbalancehistory&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&address=0xe04f27eb70e025b78871a2ad7eabe85e61212761&blockno=8000000&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=account&action=tokenbalancehistory&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&address=0xe04f27eb70e025b78871a2ad7eabe85e61212761&blockno=8000000&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

contractaddress

the `contract address` of the ERC-20 token

address

the `string` representing the address to check for balance

blockno

the `integer` block number to check total supply for eg. `12697906`

Get Token Holder List by Contract Address

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=token&action=tokenholderlist&contractaddress=0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d&page=1&offset=10&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=token&action=tokenholderlist&contractaddress=0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d&page=1&offset=10&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

contractaddress

the `contract address` of the ERC-20 token

page

the `integer` page number, if pagination is enabled

offset

the number of transactions displayed per page

Get Token Holder Count by Contract Address

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=token&action=tokenholdercount&contractaddress=0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d&apikey=YourApiKeyToken&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=token&action=tokenholdercount&contractaddress=0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d&apikey=YourApiKeyToken&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

contractaddress

the `contract address` of the ERC-20 token

Get Token Info by ContractAddress

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=token&action=tokeninfo&contractaddress=0x0e3a2a1f2146d86a604adc220b4967a898d7fe07&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=token&action=tokeninfo&contractaddress=0x0e3a2a1f2146d86a604adc220b4967a898d7fe07&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

contractaddress

the `contract address` of the ERC-20 token

Get Address ERC20 Token Holding

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=account&action=addresstokenbalance&address=0x983e3660c0bE01991785F80f266A84B911ab59b0&page=1&offset=100&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=account&action=addresstokenbalance&address=0x983e3660c0bE01991785F80f266A84B911ab59b0&page=1&offset=100&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `string` representing the address to check for balance

page

the `integer` page number, if pagination is enabled

offset

the number of transactions displayed per page

Get Address ERC721 Token Holding

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=account&action=addresstokennftbalance&address=0x0000000000000000000000000000000000000000&page=1&offset=100&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=account&action=addresstokennftbalance&address=0x0000000000000000000000000000000000000000&page=1&offset=100&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `string` representing the address to check for balance

page

the `integer` page number, if pagination is enabled

offset

the number of transactions displayed per page

Get Address ERC721 Token Inventory By Contract Address

https://api.routescan.io/v2/network/testnet/evm/ /etherscan/api?module=account&action=addresstokennftinventory&address=0x6B59918Cfa9a4A360482b98E32bd0EBC61AEe89e&contractaddress=0x41fc45DCaaeAc616590f32E09E08294762aF0DB8&page=1&offset=100&apikey=YourApiKeyToken

Try this endpoint in your [**browser**](https://api.routescan.io/v2/network/testnet/evm//etherscan/api?module=account&action=addresstokennftinventory&address=0x6B59918Cfa9a4A360482b98E32bd0EBC61AEe89e&contractaddress=0x41fc45DCaaeAc616590f32E09E08294762aF0DB8&page=1&offset=100&apikey=YourApiKeyToken) 🔗

- Request
- Response

Query Parameters

Parameter

Description

module

`string`

action

`string`

address

the `string` representing the address to check for inventory

contractaddress

the `string` representing the ERC-721 token contractaddress to check for inventory

page

the `integer` page number, if pagination is enabled

offset

the number of transactions displayed per page
