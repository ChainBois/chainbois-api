# Overview (/docs/tooling/avalanche-sdk)

---

title: Overview
description: Build applications and interact with Avalanche networks programmatically
icon: Rocket

---

The **Avalanche SDK for TypeScript** is a modular suite of tools designed for building powerful applications on the Avalanche ecosystem. Whether you're building DeFi applications, NFT platforms, or cross-chain bridges, our SDKs provide everything you need.

<img src="https://mintcdn.com/avalabs-47ea3976/Wi87V1LwXev8P44s/images/avalanche_sdk.jpg?fit=max&auto=format&n=Wi87V1LwXev8P44s&q=85&s=1e10ff983be444a989bf30e2dedf1cb8" data-og-width="1984" width="1984" data-og-height="604" height="604" data-path="images/avalanche_sdk.jpg" data-optimize="true" data-opv="3" srcSet="https://mintcdn.com/avalabs-47ea3976/Wi87V1LwXev8P44s/images/avalanche_sdk.jpg?w=280&fit=max&auto=format&n=Wi87V1LwXev8P44s&q=85&s=ddf429244d37623020bd754cd793dc92 280w, https://mintcdn.com/avalabs-47ea3976/Wi87V1LwXev8P44s/images/avalanche_sdk.jpg?w=560&fit=max&auto=format&n=Wi87V1LwXev8P44s&q=85&s=57ad5a44d41025b567fc1564894e80ca 560w, https://mintcdn.com/avalabs-47ea3976/Wi87V1LwXev8P44s/images/avalanche_sdk.jpg?w=840&fit=max&auto=format&n=Wi87V1LwXev8P44s&q=85&s=5b51ef1d5cf23ccce207b632610d12df 840w, https://mintcdn.com/avalabs-47ea3976/Wi87V1LwXev8P44s/images/avalanche_sdk.jpg?w=1100&fit=max&auto=format&n=Wi87V1LwXev8P44s&q=85&s=c986a3608d6e29b7ad0c4f1f29df7845 1100w, https://mintcdn.com/avalabs-47ea3976/Wi87V1LwXev8P44s/images/avalanche_sdk.jpg?w=1650&fit=max&auto=format&n=Wi87V1LwXev8P44s&q=85&s=55b096c77f3dc0505293b8308974a2b9 1650w, https://mintcdn.com/avalabs-47ea3976/Wi87V1LwXev8P44s/images/avalanche_sdk.jpg?w=2500&fit=max&auto=format&n=Wi87V1LwXev8P44s&q=85&s=f15b10a3cc43b734a0777b239511af74 2500w" />

### Core Capabilities

- **Direct Chain Access** - RPC calls, wallet integration, and transaction management.
- **Indexed Data & Metrics** - Access Glacier Data API & Metrics API with type safety.
- **Interchain Messaging** - Build cross-L1 applications with ICM/Teleporter.

<Callout type="warning">
  **Developer Preview**: This suite of SDKs is currently in beta and is subject to change. Use in production at your own risk.
</Callout>

<Callout>
  We'd love to hear about your experience! **<a href="https://forms.gle/kpunVSkA9nuCa1wM9" target="_blank" rel="noopener noreferrer">Please share your feedback here</a>.**
</Callout>

<Cards>
  <Card title="Open Source on GitHub" icon="github" href="https://github.com/ava-labs/avalanche-sdk-typescript">
    Check out the code, contribute, or report issues. The Avalanche SDK TypeScript is fully open source.
  </Card>
</Cards>

## Which SDK Should I Use?

Choose the right SDK based on your specific needs:

| SDK Package                                                                  | Description                                                      |
| :--------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| [`@avalanche-sdk/client`](/avalanche-sdk/client-sdk/getting-started)         | Direct blockchain interaction - transactions, wallets, RPC calls |
| [`@avalanche-sdk/chainkit`](/avalanche-sdk/chainkit-sdk/getting-started)     | Complete suite: Data, Metrics and Webhooks API                   |
| [`@avalanche-sdk/interchain`](/avalanche-sdk/interchain-sdk/getting-started) | Send messages between Avalanche L1s using ICM/Teleporter         |

## Quick Start

<Tabs items={['npm', 'yarn', 'pnpm']}>
<Tab value="npm">
`bash  theme={null}
    npm install @avalanche-sdk/client
    `
</Tab>

  <Tab value="yarn">
    ```bash  theme={null}
    yarn add @avalanche-sdk/client
    ```
  </Tab>

  <Tab value="pnpm">
    ```bash  theme={null}
    pnpm add @avalanche-sdk/client
    ```
  </Tab>
</Tabs>

### Basic Example

```typescript theme={null}
import { createClient } from "@avalanche-sdk/client";

// Initialize the client
const client = createClient({
  network: "mainnet",
});

// Get balance
const balance = await client.getBalance({
  address: "0x...",
  chainId: 43114,
});

console.log("Balance:", balance);
```

## Available SDKs

### Client SDK

The main Avalanche client SDK for interacting with Avalanche nodes and building blockchain applications.

**Key Features:**

- **Complete API coverage** for P-Chain, X-Chain, and C-Chain.
- **Full viem compatibility** - anything you can do with viem works here.
- **TypeScript-first design** with full type safety.
- **Smart contract interactions** with first-class APIs.
- **Wallet integration** and transaction management.
- **Cross-chain transfers** between X, P and C chains.

**Common Use Cases:**

- Retrieve balances and UTXOs for addresses
- Build, sign, and issue transactions to any chain
- Add validators and delegators
- Create subnets and blockchains.
- Convert subnets to L1s.

<Card title="Get Started with Client SDK" icon="arrow-right" href="/avalanche-sdk/client-sdk/getting-started">
  Learn how to integrate blockchain functionality into your application
</Card>

### ChainKit SDK

Combined SDK with full typed coverage of Avalanche Data (Glacier) and Metrics APIs.

**Key Features:**

- **Full endpoint coverage** for Glacier Data API and Metrics API
- **Strongly-typed models** with automatic TypeScript inference
- **Built-in pagination** helpers and automatic retries/backoff
- **High-level helpers** for transactions, blocks, addresses, tokens, NFTs
- **Metrics insights** including network health, validator stats, throughput
- **Webhook support** with payload shapes and signature verification

**API Endpoints:**

- Glacier API: <a href="https://glacier-api.avax.network/api" target="_blank" rel="noopener noreferrer">[https://glacier-api.avax.network/api](https://glacier-api.avax.network/api)</a>
- Metrics API: <a href="https://metrics.avax.network/api" target="_blank" rel="noopener noreferrer">[https://metrics.avax.network/api](https://metrics.avax.network/api)</a>

<Card title="Get Started with ChainKit SDK" icon="arrow-right" href="/avalanche-sdk/chainkit-sdk/getting-started">
  Access comprehensive blockchain data and analytics
</Card>

### Interchain SDK

SDK for building cross-L1 applications and bridges.

**Key Features:**

- **Type-safe ICM client** for sending cross-chain messages
- **Seamless wallet integration** with existing wallet clients
- **Built-in support** for Avalanche C-Chain and custom subnets
- **Message tracking** and delivery confirmation
- **Gas estimation** for cross-chain operations

**Use Cases:**

- Cross-chain token bridges
- Multi-L1 governance systems
- Interchain data oracles
- Cross-subnet liquidity pools

<Card title="Get Started with Interchain SDK" icon="arrow-right" href="/avalanche-sdk/interchain-sdk/getting-started">
  Build powerful cross-chain applications
</Card>

## Support

### Community & Help

- <a href="https://discord.gg/avax" target="_blank" rel="noopener noreferrer">Discord</a> - Get real-time help in the #avalanche-sdk channel
- <a href="https://t.me/+KDajA4iToKY2ZjBk" target="_blank" rel="noopener noreferrer">Telegram</a> - Join discussions
- <a href="https://x.com/AvaxDevelopers" target="_blank" rel="noopener noreferrer">Twitter</a> - Stay updated

### Feedback Sessions

- <a href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1RkNFpny9hBimkOmBXghLkGJ8RXV0GgHZb2tfrIRoZ9Su3s1wYZOP2R_OjXpwG2aQw_zlHf2JQ?gv=true" target="_blank" rel="noopener noreferrer">Book a Google Meet Feedback Session</a> - Schedule a 1-on-1 session to share your feedback and suggestions

### Issue Tracking

- <a href="https://github.com/ava-labs/avalanche-sdk-typescript/issues/new?template=bug_report.md" target="_blank" rel="noopener noreferrer">Report a Bug</a>
- <a href="https://github.com/ava-labs/avalanche-sdk-typescript/issues/new?template=feature_request.md" target="_blank" rel="noopener noreferrer">Request a Feature</a>
- <a href="https://github.com/ava-labs/avalanche-sdk-typescript/issues" target="_blank" rel="noopener noreferrer">View All Issues</a>

### Direct Support

- Technical Issues: <a href="https://github.com/ava-labs/avalanche-sdk-typescript/issues" target="_blank" rel="noopener noreferrer">GitHub Issues</a>
- Security Issues: <a href="mailto:security@avalabs.org">[security@avalabs.org](mailto:security@avalabs.org)</a>
- General Inquiries: <a href="mailto:data-platform@avalabs.org">[data-platform@avalabs.org](mailto:data-platform@avalabs.org)</a>

# Authentication (/docs/tooling/avalanche-sdk/chainkit/authentication)

---

title: Authentication
description: Authentication for the ChainKit SDK
icon: Lock

---

### Per-Client Security Schemes

This SDK supports the following security scheme globally:

| Name     | Type   | Scheme  |
| -------- | ------ | ------- |
| `apiKey` | apiKey | API key |

The ChainKit SDK can be used without an API key, but rate limits will be lower. Adding an API key allows for higher rate limits. To get an API key, create one via [Builder Console](/console/utilities/data-api-keys) and securely store it. Whether or not you use an API key, you can still interact with the SDK effectively, but the API key provides performance benefits for higher request volumes.

```javascript
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalancheSDK = new Avalanche({
  apiKey: "<YOUR_API_KEY_HERE>",
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalancheSDK.metrics.healthCheck();

  // Handle the result
  console.log(result);
}

run();
```

<Callout type="warning">
  Never hardcode your API key directly into your code. Instead, securely store
  it and retrieve it from an environment variable, a secrets manager, or a
  dedicated configuration storage mechanism. This ensures that sensitive
  information remains protected and is not exposed in version control or
  publicly accessible code.
</Callout>

# Global Parameters (/docs/tooling/avalanche-sdk/chainkit/global-parameters)

---

title: Global Parameters
description: Global parameters for the ChainKit SDK
icon: Globe

---

Certain parameters are configured globally. These parameters may be set on the SDK client instance itself during initialization. When configured as an option during SDK initialization, These global values will be used as defaults on the operations that use them. When such operations are called, there is a place in each to override the global value, if needed.

For example, you can set `chainId` to `43114` at SDK initialization and then you do not have to pass the same value on calls to operations like getBlock. But if you want to do so you may, which will locally override the global setting. See the example code below for a demonstration.

### Available Globals

The following global parameters are available.

| Name      | Type                          | Required | Description                                              |
| :-------- | :---------------------------- | :------- | :------------------------------------------------------- |
| `chainId` | string                        | No       | A supported EVM chain id, chain alias, or blockchain id. |
| `network` | components.GlobalParamNetwork | No       | A supported network type, either mainnet or a testnet.   |

Example

```javascript
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalancheSDK = new Avalanche({
  apiKey: "<YOUR_API_KEY_HERE>",
  chainId: "43114", // Sets chainId globally, will be used if not passed during method call.
  network: "mainnet",
});

async function run() {
  const result = await avalancheSDK.data.evm.blocks.get({
    blockId:
      "0x17533aeb5193378b9ff441d61728e7a2ebaf10f61fd5310759451627dfca2e7c",
    chainId: "<YOUR_CHAIN_ID>", // Override the globally set chain id.
  });

  // Handle the result
  console.log(result);
}

run();
```

# Retries (/docs/tooling/avalanche-sdk/chainkit/retries)

---

title: Retries
description: Retries for the ChainKit SDK
icon: RotateCcw

---

Some of the endpoints in this SDK support retries. If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API. However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:

```javascript
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalancheSDK = new Avalanche({
  apiKey: "<YOUR_API_KEY_HERE>",
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalancheSDK.metrics.healthCheck({
    retries: {
      strategy: "backoff",
      backoff: {
        initialInterval: 1,
        maxInterval: 50,
        exponent: 1.1,
        maxElapsedTime: 100,
      },
      retryConnectionErrors: false,
    },
  });

  // Handle the result
  console.log(result);
}

run();
```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:

```javascript
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalancheSDK = new Avalanche({
  retryConfig: {
    strategy: "backoff",
    backoff: {
      initialInterval: 1,
      maxInterval: 50,
      exponent: 1.1,
      maxElapsedTime: 100,
    },
    retryConnectionErrors: false,
  },
  apiKey: "<YOUR_API_KEY_HERE>",
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalancheSDK.metrics.healthCheck();

  // Handle the result
  console.log(result);
}

run();
```

# Pagination (/docs/tooling/avalanche-sdk/chainkit/pagination)

---

title: Pagination
description: Pagination for the ChainKit SDK
icon: StickyNote

---

Some of the endpoints in this SDK support pagination. To use pagination, you make your SDK calls as usual, but the returned response object will also be an async iterable that can be consumed using the `for await...of` syntax.

Here's an example of one such pagination call:

```javascript
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalancheSDK = new Avalanche({
  apiKey: "<YOUR_API_KEY_HERE>",
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalancheSDK.metrics.chains.list({
    network: "mainnet",
  });

  for await (const page of result) {
    // Handle the page
    console.log(page);
  }
}

run();
```

# Error Handling (/docs/tooling/avalanche-sdk/chainkit/errors)

---

title: Error Handling
description: Error Handling for the ChainKit SDK
icon: Bug

---

All SDK methods return a response object or throw an error. If Error objects are specified in your OpenAPI Spec, the SDK will throw the appropriate Error type.

| Error Object               | Status Code | Content Type     |
| :------------------------- | :---------- | :--------------- |
| errors.BadRequest          | 400         | application/json |
| errors.Unauthorized        | 401         | application/json |
| errors.Forbidden           | 403         | application/json |
| errors.NotFound            | 404         | application/json |
| errors.TooManyRequests     | 429         | application/json |
| errors.InternalServerError | 500         | application/json |
| errors.BadGateway          | 502         | application/json |
| errors.ServiceUnavailable  | 503         | application/json |
| errors.SDKError            | 4xx-5xx     | /                |

Validation errors can also occur when either method arguments or data returned from the server do not match the expected format. The SDKValidationError that is thrown as a result will capture the raw value that failed validation in an attribute called `rawValue`. Additionally, a `pretty()` method is available on this error that can be used to log a nicely formatted string since validation errors can list many issues and the plain error string may be difficult read when debugging.

```javascript
import { Avalanche } from "@avalanche-sdk/chainkit";
import {
  BadGateway,
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFound,
  SDKValidationError,
  ServiceUnavailable,
  TooManyRequests,
  Unauthorized,
} from "@avalanche-sdk/chainkit/models/errors";

const avalancheSDK = new Avalanche({
  apiKey: "<YOUR_API_KEY_HERE>",
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  try {
    await avalancheSDK.data.nfts.reindex({
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      tokenId: "145",
    });
  } catch (err) {
    switch (true) {
      case err instanceof SDKValidationError: {
        // Validation errors can be pretty-printed
        console.error(err.pretty());
        // Raw value may also be inspected
        console.error(err.rawValue);
        return;
      }
      case err instanceof BadRequest: {
        // Handle err.data$: BadRequestData
        console.error(err);
        return;
      }
      case err instanceof Unauthorized: {
        // Handle err.data$: UnauthorizedData
        console.error(err);
        return;
      }
      case err instanceof Forbidden: {
        // Handle err.data$: ForbiddenData
        console.error(err);
        return;
      }
      case err instanceof NotFound: {
        // Handle err.data$: NotFoundData
        console.error(err);
        return;
      }
      case err instanceof TooManyRequests: {
        // Handle err.data$: TooManyRequestsData
        console.error(err);
        return;
      }
      case err instanceof InternalServerError: {
        // Handle err.data$: InternalServerErrorData
        console.error(err);
        return;
      }
      case err instanceof BadGateway: {
        // Handle err.data$: BadGatewayData
        console.error(err);
        return;
      }
      case err instanceof ServiceUnavailable: {
        // Handle err.data$: ServiceUnavailableData
        console.error(err);
        return;
      }
      default: {
        throw err;
      }
    }
  }
}

run();
```

# Custom HTTP Client (/docs/tooling/avalanche-sdk/chainkit/custom-http)

---

title: Custom HTTP Client
description: Custom HTTP Client for the ChainKit SDK
icon: Server

---

The TypeScript SDK makes API calls using an HTTPClient that wraps the native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This client is a thin wrapper around `fetch` and provides the ability to attach hooks around the request lifecycle that can be used to modify the request or handle errors and response.

The `HTTPClient` constructor takes an optional `fetcher` argument that can be used to integrate a third-party HTTP client or when writing tests to mock out the HTTP client and feed in fixtures.

The following example shows how to use the `beforeRequest` hook to to add a custom header and a timeout to requests and how to use the `requestError` hook to log errors:

```javascript
import { Avalanche } from "@avalanche-sdk/chainkit";
import { HTTPClient } from "@avalanche-sdk/chainkit/lib/http";

const httpClient = new HTTPClient({
  // fetcher takes a function that has the same signature as native `fetch`.
  fetcher: (request) => {
    return fetch(request);
  },
});

httpClient.addHook("beforeRequest", (request) => {
  const nextRequest = new Request(request, {
    signal: request.signal || AbortSignal.timeout(5000),
  });

  nextRequest.headers.set("x-custom-header", "custom value");

  return nextRequest;
});

httpClient.addHook("requestError", (error, request) => {
  console.group("Request Error");
  console.log("Reason:", `${error}`);
  console.log("Endpoint:", `${request.method} ${request.url}`);
  console.groupEnd();
});

const sdk = new Avalanche({ httpClient });
```

# Getting Started (/docs/tooling/avalanche-sdk/client/getting-started)

---

title: Getting Started
icon: Rocket
description: Get started with the Avalanche Client SDK - your gateway to building on Avalanche with TypeScript.

---

## Overview

The Avalanche Client SDK provides a TypeScript interface for interacting with Avalanche. Built on [viem](https://viem.sh), it offers full Ethereum compatibility plus native support for P-Chain, X-Chain, and C-Chain operations.

<Cards>
  <Card title="NPM Package">
    [https://www.npmjs.com/package/@avalanche-sdk/client](https://www.npmjs.com/package/@avalanche-sdk/client)
  </Card>
  <Card title="GitHub Repository">
    [https://github.com/ava-labs/avalanche-sdk-typescript](https://github.com/ava-labs/avalanche-sdk-typescript)
  </Card>
</Cards>

## Installation

Install the Avalanche Client SDK using your preferred package manager:

<InstallTabs items={['npm', 'yarn', 'bun']}>
<Tab value="npm">

```bash
npm install @avalanche-sdk/client
```

</Tab>
<Tab value="yarn">

```bash
yarn add @avalanche-sdk/client
```

</Tab>
<Tab value="bun">

```bash
bun add @avalanche-sdk/client
```

</Tab>
</InstallTabs>

### Requirements

- Node.js >= 20.0.0
- TypeScript >= 5.0.0 (recommended)
- Modern browsers: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+

## Quick Start

### Public Client

Create a read-only client:

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

// Read operations
const pChainHeight = await client.pChain.getHeight();
const balance = await client.getBalance({
  address: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
});
```

### Wallet Client

Create a wallet client for transactions:

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalanche } from "@avalanche-sdk/client/chains";
import { avaxToWei } from "@avalanche-sdk/client/utils";

const account = privateKeyToAvalancheAccount("0x...");

const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: { type: "http" },
});

// Send AVAX
const hash = await walletClient.send({
  to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  amount: avaxToWei(0.001),
});
```

## Account Creation

### Private Key

```typescript
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = privateKeyToAvalancheAccount("0x...");
```

### Mnemonic

```typescript
import { mnemonicsToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = mnemonicsToAvalancheAccount("test test test...");
```

### HD Key

```typescript
import { hdKeyToAvalancheAccount, HDKey } from "@avalanche-sdk/client/accounts";

const hdKey = HDKey.fromMasterSeed(seed);
const account = hdKeyToAvalancheAccount(hdKey);
```

[Learn more about accounts →](accounts)

## Transport Configuration

### HTTP

```typescript
const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});
```

### WebSocket

```typescript
const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "ws" },
});
```

### Custom Endpoint

```typescript
const client = createAvalancheClient({
  chain: avalanche,
  transport: {
    type: "http",
    url: "https://your-custom-rpc-endpoint.com/ext/bc/C/rpc",
  },
});
```

[Learn more about transports →](clients-transports)

## Avalanche Chains

Avalanche has three primary chains:

- **P-Chain (Platform Chain)**: Validators, staking, subnets
- **X-Chain (Exchange Chain)**: Asset transfers (UTXO model)
- **C-Chain (Contract Chain)**: Smart contracts (Ethereum-compatible)

```typescript
// P-Chain
const validators = await client.pChain.getCurrentValidators({});

// X-Chain
const balance = await client.xChain.getBalance({
  address: "X-avax1example...",
  assetID: "AVAX",
});

// C-Chain
const balance = await client.getBalance({ address: "0x..." });
```

## Using viem Features

The SDK is built on viem, so you have access to all viem functionality:

```typescript
import { formatEther, parseEther } from "@avalanche-sdk/client/utils";

const valueInWei = parseEther("1.0");
const valueInAvax = formatEther(1000000000000000000n);
const receipt = await walletClient.waitForTransactionReceipt({ hash });
```

See the [viem documentation](https://viem.sh/docs/getting-started) for more utilities.

## Next Steps

- **[Clients & Transports](clients-transports)** - Understanding clients and transports
- **[Account Management](accounts)** - Creating and managing accounts
- **[Wallet Operations](methods/wallet-methods/wallet)** - Sending transactions
- **[P-Chain Operations](methods/public-methods/p-chain)** - Validator and staking
- **[X-Chain Operations](methods/public-methods/x-chain)** - Asset transfers
- **[C-Chain Operations](methods/public-methods/c-chain)** - EVM operations

## Need Help?

- [Discord community](https://discord.gg/avax)
- [GitHub examples](https://github.com/ava-labs/avalanche-sdk-typescript/tree/main/client/examples)
- [Open an issue](https://github.com/ava-labs/avalanche-sdk-typescript/issues)

# Client & Transports (/docs/tooling/avalanche-sdk/client/clients-transports)

---

title: Client & Transports
icon: Plug

---

## Overview

Clients provide type-safe interfaces for interacting with Avalanche. Transports handle the communication layer. This separation lets you switch between HTTP, WebSocket, or custom providers without changing your code.

The SDK is built on [viem](https://viem.sh), so you get full Ethereum compatibility plus native support for P-Chain, X-Chain, and C-Chain operations.

## Clients

Clients are TypeScript interfaces that abstract RPC calls and provide type-safe APIs.

### Avalanche Client (Public Client)

The read-only client for querying blockchain data across all Avalanche chains.

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const client = createAvalancheClient({
  chain: avalanche,
  transport: {
    type: "http",
  },
});

// Access different chains
const pChainHeight = await client.pChain.getHeight();
const cChainBalance = await client.getBalance({
  address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
});
```

### Avalanche Wallet Client

Extends the public client with transaction signing and sending capabilities.

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalanche } from "@avalanche-sdk/client/chains";
import { avaxToWei } from "@avalanche-sdk/client/utils";

const account = privateKeyToAvalancheAccount("0x...");

const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: {
    type: "http",
  },
});

// Send AVAX
const hash = await walletClient.send({
  to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  amount: avaxToWei(0.001),
});
```

### Chain-Specific Clients

Access chain-specific operations through sub-clients:

- `client.pChain` - Validator operations, staking, subnet management
- `client.xChain` - Asset transfers, UTXO operations
- `client.cChain` - Atomic transactions
- API clients - Admin, Info, Health, Index API, Proposervm operations

## Transports

Transports handle data transmission between your application and Avalanche nodes. They abstract RPC protocol implementation.

### HTTP Transport

Uses standard HTTP/HTTPS connections. Most common choice for production applications.

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const client = createAvalancheClient({
  chain: avalanche,
  transport: {
    type: "http",
    // Optional: specify custom URL
    // url: "https://api.avax.network/ext/bc/C/rpc",
  },
});
```

### WebSocket Transport

Maintains a persistent connection for real-time subscriptions and event streaming.

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const client = createAvalancheClient({
  chain: avalanche,
  transport: {
    type: "ws",
    // Optional: specify custom WebSocket URL
    // url: "wss://api.avax.network/ext/bc/C/ws",
  },
});
```

### Custom Transport (EIP-1193)

Supports custom transport implementations, including EIP-1193 providers (MetaMask, WalletConnect, etc.).

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";
import "@avalanche-sdk/client/window";
// Using window.ethereum (Core, MetaMask, etc.)
const walletClient = createAvalancheWalletClient({
  account: account,
  chain: avalanche,
  transport: {
    type: "custom",
    provider: window.ethereum,
    // Or
    // provider: window.avalanche,
  },
});
```

## Transport Configuration

### Mainnet/Testnet

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche, avalancheFuji } from "@avalanche-sdk/client/chains";

// Mainnet
const mainnetClient = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

// Testnet (Fuji)
const testnetClient = createAvalancheClient({
  chain: avalancheFuji,
  transport: { type: "http" },
});
```

### Custom Endpoints

```typescript
const client = createAvalancheClient({
  chain: avalanche,
  transport: {
    type: "http",
    url: "https://your-custom-rpc-endpoint.com/ext/bc/C/rpc",
    // Optional: Add headers for authentication
    // fetchOptions: {
    //   headers: {
    //     Authorization: `Bearer ${apiKey}`,
    //   },
    // },
  },
});
```

### Switching Transports

Switch between transports without changing your application logic:

```typescript
// HTTP client
const httpClient = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

// WebSocket client
const wsClient = createAvalancheClient({
  chain: avalanche,
  transport: { type: "ws" },
});

// Both have the same API
const height1 = await httpClient.pChain.getHeight();
const height2 = await wsClient.pChain.getHeight();
```

## Client Selection

### Public Client vs Wallet Client

| Feature                 | Public Client | Wallet Client         |
| ----------------------- | ------------- | --------------------- |
| **Read Operations**     | ✅ Yes        | ✅ Yes (inherits all) |
| **Transaction Signing** | ❌ No         | ✅ Yes                |
| **Transaction Sending** | ❌ No         | ✅ Yes                |
| **Account Required**    | ❌ No         | ✅ Yes                |

**Use Public Client for:** Reading blockchain data, querying balances, fetching validator info, reading smart contract state.

**Use Wallet Client for:** Sending transactions, signing messages, transferring assets, interacting with smart contracts.

### Chain-Specific Clients

The main client provides access to all chains. You can also create standalone chain-specific clients:

```typescript
// Main client - access all chains
const client = createAvalancheClient({ ... });
await client.pChain.getHeight();
await client.xChain.getBalance({ ... });

// Chain-specific client
import { createPChainClient } from "@avalanche-sdk/client";
const pChainOnly = createPChainClient({ ... });
await pChainOnly.getHeight();
```

**Use chain-specific clients when:** Your app only interacts with one chain, you want smaller bundle size, or need specialized configuration.

**Use main client when:** Your app uses multiple chains or you want unified configuration.

## Next Steps

- **[Avalanche Client](clients/avalanche-client)** - Read-only operations
- **[Avalanche Wallet Client](clients/wallet-client)** - Transaction operations
- **[Chain-Specific Clients](clients/p-chain-client)** - P-Chain, X-Chain, and C-Chain clients
- **[Public Actions](methods/public-methods/p-chain)** - Read operations reference
- **[Wallet Actions](methods/wallet-methods/wallet)** - Write operations reference

The SDK follows the same transport patterns as [viem](https://viem.sh/docs/clients/public.html#transport) for compatibility.

# Account Management (/docs/tooling/avalanche-sdk/client/accounts)

---

title: Account Management
icon: users
description: Learn how to create and manage accounts in the Avalanche Client SDK with support for EVM, X-Chain, and P-Chain operations.

---

## Overview

Avalanche accounts work across all three chains—P-Chain, X-Chain, and C-Chain—with a single account. Each account provides both EVM addresses (for C-Chain) and XP addresses (for X/P-Chain), so you can interact with the entire Avalanche network without managing separate accounts.

## Account Structure

Every Avalanche account has an EVM account for C-Chain and an optional XP account for X/P-Chain:

```typescript
type AvalancheAccount = {
  evmAccount: Account; // C-Chain
  xpAccount?: XPAccount; // X/P-Chain
  getEVMAddress: () => Address;
  getXPAddress: (chain?: "X" | "P" | "C", hrp?: string) => XPAddress;
};
```

### Quick Start

```typescript
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const account = privateKeyToAvalancheAccount("0x...");

const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: { type: "http" },
});

// Get addresses for all chains
const evmAddress = account.getEVMAddress(); // 0x742d35Cc...
const xChainAddress = account.getXPAddress("X"); // X-avax1...
const pChainAddress = account.getXPAddress("P"); // P-avax1...
```

## Account Types

### Local Accounts

Local accounts store keys on your machine and sign transactions before broadcasting. Use these for server-side apps, bots, or when you need full control.

- [Private Key Accounts](accounts/local/private-key) - Simple and direct
- [Mnemonic Accounts](accounts/local/mnemonic) - Easy recovery with seed phrases
- [HD Key Accounts](accounts/local/hd-key) - Advanced key derivation

### JSON-RPC Accounts

JSON-RPC accounts use external wallets (MetaMask, Core, etc.) for signing. Perfect for browser-based dApps where users control their own keys.

[Learn more about JSON-RPC accounts →](accounts/json-rpc)

## Working with Accounts

### EVM Account

The `evmAccount` handles all C-Chain operations—smart contracts, ERC-20 transfers, and standard EVM interactions.

```typescript
const evmAccount = account.evmAccount;
console.log(evmAccount.address); // 0x742d35Cc...
```

### XP Account

The `xpAccount` handles X-Chain and P-Chain operations—UTXO transactions, asset transfers, and staking.

```typescript
if (account.xpAccount) {
  const xpAccount = account.xpAccount;
  console.log(xpAccount.publicKey);
}
```

### Getting Addresses

```typescript
// C-Chain address
const evmAddress = account.getEVMAddress(); // 0x742d35Cc...

// X/P-Chain addresses
const xChainAddress = account.getXPAddress("X"); // X-avax1...
const pChainAddress = account.getXPAddress("P"); // P-avax1...

// Network-specific (mainnet vs testnet)
const mainnet = account.getXPAddress("X", "avax");
const testnet = account.getXPAddress("X", "fuji");
```

## Creating Accounts

### Private Key

```typescript
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = privateKeyToAvalancheAccount("0x...");
```

[Private Key Accounts →](accounts/local/private-key)

### Mnemonic

```typescript
import { mnemonicsToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = mnemonicsToAvalancheAccount("abandon abandon abandon...");
```

[Mnemonic Accounts →](accounts/local/mnemonic)

### HD Key

```typescript
import { hdKeyToAvalancheAccount, HDKey } from "@avalanche-sdk/client/accounts";

const hdKey = HDKey.fromMasterSeed(seed);
const account = hdKeyToAvalancheAccount(hdKey, { accountIndex: 0 });
```

[HD Key Accounts →](accounts/local/hd-key)

## Address Formats

- **C-Chain:** `0x...` (Ethereum-compatible)
- **X/P-Chain:** `avax1...` or `X-avax1...` / `P-avax1...` (Bech32-encoded)

[Network-Specific Addresses →](accounts/local/addresses)

## Security

<Callout>
  **Never expose private keys or mnemonics in client-side code or commit them to
  version control. Use environment variables.**
</Callout>

```typescript
// ✅ Good
const account = privateKeyToAvalancheAccount(process.env.PRIVATE_KEY!);

// ❌ Bad
const account = privateKeyToAvalancheAccount("0x1234...");
```

## Comparison Table

| Feature           | Private Key | Mnemonic  | HD Key   | JSON-RPC     |
| ----------------- | ----------- | --------- | -------- | ------------ |
| **Ease of Use**   | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐  | ⭐⭐⭐   | ⭐⭐⭐⭐⭐   |
| **Recovery**      | ❌          | ✅        | ✅       | ❌           |
| **Multi-Account** | ❌          | ✅        | ✅       | ❌           |
| **Security**      | ⚠️ High     | ✅ High   | ✅ High  | ✅ Very High |
| **Use Case**      | Server/Bots | User Apps | Advanced | User Apps    |

## Next Steps

- [Private Key Accounts](accounts/local/private-key) - Simple and direct
- [Mnemonic Accounts](accounts/local/mnemonic) - Easy recovery
- [HD Key Accounts](accounts/local/hd-key) - Advanced key derivation
- [JSON-RPC Accounts](accounts/json-rpc) - Browser wallet integration
- [Account Utilities](accounts/local/utilities) - Helper functions
- [Wallet Operations](methods/wallet-methods/wallet) - Send transactions

# Local Accounts (/docs/tooling/avalanche-sdk/client/accounts/local)

---

title: Local Accounts
icon: shield
description: Learn how to create and manage local accounts in the Avalanche Client SDK with private keys, mnemonics, and HD keys.

---

## Overview

Local accounts store keys on your machine and sign transactions before broadcasting. Use these for server-side apps, bots, or when you need full control.

<Callout>
  **Security:** Never expose private keys or mnemonics in client-side code or
  commit them to version control. Use environment variables.
</Callout>

## Quick Start

```typescript
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = privateKeyToAvalancheAccount(process.env.PRIVATE_KEY!);

console.log(account.getEVMAddress()); // 0x742d35Cc...
console.log(account.getXPAddress("X")); // X-avax1...
```

## Account Types

### Private Key

Simplest option—create an account directly from a private key.

```typescript
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = privateKeyToAvalancheAccount("0x...");
```

[Private Key Accounts →](local/private-key)

### Mnemonic

User-friendly option—create an account from a seed phrase.

```typescript
import { mnemonicsToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = mnemonicsToAvalancheAccount("abandon abandon abandon...");
```

[Mnemonic Accounts →](local/mnemonic)

### HD Key

Advanced option—create accounts from HD keys with custom derivation paths.

```typescript
import { hdKeyToAvalancheAccount, HDKey } from "@avalanche-sdk/client/accounts";

const hdKey = HDKey.fromMasterSeed(seed);
const account = hdKeyToAvalancheAccount(hdKey, { accountIndex: 0 });
```

[HD Key Accounts →](local/hd-key)

## Instantiation

### Setup Wallet Client

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avaxToWei } from "@avalanche-sdk/client/utils";

const account = privateKeyToAvalancheAccount(process.env.PRIVATE_KEY!);

const walletClient = createAvalancheWalletClient({
  account, // Hoist account to avoid passing it to each method
  chain: avalanche,
  transport: { type: "http" },
});

// Use wallet methods
const txHash = await walletClient.send({
  to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  amount: avaxToWei(0.001),
});

// Use public methods
const balance = await walletClient.getBalance({
  address: account.getEVMAddress(),
});
```

## Account Generation

### Generate Private Key

```typescript
import {
  generatePrivateKey,
  privateKeyToAvalancheAccount,
} from "@avalanche-sdk/client/accounts";
import type { AvalancheAccount } from "@avalanche-sdk/client/accounts";

const privateKey: string = generatePrivateKey();
const account: AvalancheAccount = privateKeyToAvalancheAccount(privateKey);
```

### Generate Mnemonic

```typescript
import {
  generateMnemonic,
  mnemonicsToAvalancheAccount,
} from "@avalanche-sdk/client/accounts";
import type { AvalancheAccount } from "@avalanche-sdk/client/accounts";

const mnemonic: string = generateMnemonic();
const account: AvalancheAccount = mnemonicsToAvalancheAccount(mnemonic);
```

## Address Management

### Get All Addresses

```typescript
const addresses = {
  evm: account.getEVMAddress(),
  xChain: account.getXPAddress("X"),
  pChain: account.getXPAddress("P"),
};

console.log("EVM Address:", addresses.evm);
console.log("X-Chain Address:", addresses.xChain);
console.log("P-Chain Address:", addresses.pChain);
```

<Callout>
  **Learn more:** For network-specific addresses and detailed address management
  examples, see [Network-Specific Addresses](local/addresses).
</Callout>

## Security

<Callout>
  **Never expose private keys or mnemonics in client-side code or commit them to
  version control. Always use environment variables.**
</Callout>

```typescript
// ✅ Good: Use environment variables
const account = privateKeyToAvalancheAccount(process.env.PRIVATE_KEY!);

// ❌ Bad: Hardcoded private key
const account = privateKeyToAvalancheAccount("0x1234...");
```

## Learn More

- [Account Generation](#account-generation) - Create secure accounts
- [Address Management](#address-management) - Multi-network addresses
- [Using with Clients](local/clients) - Client integration
- [HD Key Accounts](local/hd-key) - Hierarchical deterministic accounts
- [Account Utilities](local/utilities) - Validation and helpers
- [Network-Specific Addresses](local/addresses) - Advanced address management

# Private Key Accounts (/docs/tooling/avalanche-sdk/client/accounts/local/private-key)

---

title: "Private Key Accounts"
icon: "key"

---

## Overview

Private Key Accounts provide the simplest way to create an Avalanche account from a single private key. They support both EVM (C-Chain) and X/P (X-Chain/P-Chain) operations with unified address management.

**Best for:**

- Server-side applications
- Automated bots and services
- Testing and development
- Scripts and tools

<Callout>
  **Security:** Private keys must be kept secure. Never expose private keys in
  client-side code or commit them to version control. Use environment variables
  in production.
</Callout>

## Creating Private Key Accounts

### Basic Usage

```typescript
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import type { AvalancheAccount } from "@avalanche-sdk/client/accounts";

const privateKey = "0x1234...your_private_key_here";
const account: AvalancheAccount = privateKeyToAvalancheAccount(privateKey);

console.log("EVM Address:", account.getEVMAddress());
console.log("X-Chain Address:", account.getXPAddress("X"));
console.log("P-Chain Address:", account.getXPAddress("P"));
```

### Working with Environment Variables

```typescript
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = privateKeyToAvalancheAccount(process.env.PRIVATE_KEY!);
```

## Generating Private Keys

### Generate Random Private Key

```typescript
import {
  generatePrivateKey,
  privateKeyToAvalancheAccount,
} from "@avalanche-sdk/client/accounts";
import type { AvalancheAccount } from "@avalanche-sdk/client/accounts";

const privateKey: string = generatePrivateKey();
console.log("Generated private key:", privateKey);

const account: AvalancheAccount = privateKeyToAvalancheAccount(privateKey);

console.log("EVM Address:", account.getEVMAddress());
console.log("X-Chain Address:", account.getXPAddress("X"));
console.log("P-Chain Address:", account.getXPAddress("P"));
```

## Account Properties

### EVM Account

Each Avalanche account contains an EVM account for C-Chain operations:

```typescript
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import type { AvalancheAccount } from "@avalanche-sdk/client/accounts";

const account: AvalancheAccount = privateKeyToAvalancheAccount("0x...");

// Access EVM account properties
const evmAccount = account.evmAccount;

console.log("Address:", evmAccount.address);
console.log("Type:", evmAccount.type); // "local"
console.log("Source:", evmAccount.source); // "privateKey"

// Get public key (if available)
if (evmAccount.publicKey) {
  console.log("Public Key:", evmAccount.publicKey);
}
```

### XP Account

Each Avalanche account contains an XP account for X-Chain and P-Chain operations:

```typescript
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import type {
  AvalancheAccount,
  LocalXPAccount,
} from "@avalanche-sdk/client/accounts";

const account: AvalancheAccount = privateKeyToAvalancheAccount("0x...");

// Access XP account properties
if (account.xpAccount) {
  const xpAccount: LocalXPAccount = account.xpAccount;

  console.log("Public Key:", xpAccount.publicKey);
  console.log("Type:", xpAccount.type); // "local"
  console.log("Source:", xpAccount.source); // "privateKey"
}
```

## Address Management

### Get All Addresses

```typescript
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import type { AvalancheAccount } from "@avalanche-sdk/client/accounts";

const account: AvalancheAccount = privateKeyToAvalancheAccount("0x...");

// Get all addresses
const addresses = {
  evm: account.getEVMAddress(), // "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
  xChain: account.getXPAddress("X"), // "X-avax1..."
  pChain: account.getXPAddress("P"), // "P-avax1..."
  base: account.getXPAddress(), // "avax1..." (without chain prefix)
};

console.log("All Addresses:", addresses);
```

### Network-Specific Addresses

```typescript
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import type { AvalancheAccount } from "@avalanche-sdk/client/accounts";

const account: AvalancheAccount = privateKeyToAvalancheAccount("0x...");

// Mainnet addresses (default)
const mainnetAddresses = {
  evm: account.getEVMAddress(),
  xChain: account.getXPAddress("X", "avax"),
  pChain: account.getXPAddress("P", "avax"),
};

// Testnet (Fuji) addresses
const testnetAddresses = {
  evm: account.getEVMAddress(),
  xChain: account.getXPAddress("X", "fuji"),
  pChain: account.getXPAddress("P", "fuji"),
};

console.log("Mainnet:", mainnetAddresses);
console.log("Testnet:", testnetAddresses);
```

## Using with Wallet Client

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = privateKeyToAvalancheAccount(process.env.PRIVATE_KEY!);

const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: { type: "http" },
});

// C-Chain transaction
const txHash = await walletClient.send({
  to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  amount: 0.001,
});

// X/P-Chain transaction
const xpTx = await walletClient.xChain.prepareBaseTxn({
  outputs: [{ addresses: [account.getXPAddress("X")], amount: 1 }],
});
await walletClient.sendXPTransaction(xpTx);
```

## Message Signing

```typescript
import { signMessage } from "@avalanche-sdk/client/accounts";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = privateKeyToAvalancheAccount("0x...");

// EVM message signing
const evmSignature = await signMessage({
  account: account.evmAccount,
  message: "Hello Avalanche!",
});

// XP message signing
if (account.xpAccount) {
  const xpSignature = await account.xpAccount.signMessage("Hello Avalanche!");
  const isValid = account.xpAccount.verify("Hello Avalanche!", xpSignature);
}
```

## Security

<Callout>
  **Never expose private keys in client-side code or commit them to version
  control. Use environment variables.**
</Callout>

```typescript
// ✅ Good
const account = privateKeyToAvalancheAccount(process.env.PRIVATE_KEY!);

// ❌ Bad
const account = privateKeyToAvalancheAccount("0x1234...");
```

## Next Steps

- **[Mnemonic Accounts](mnemonic)** - Learn about mnemonic-based accounts
- **[HD Key Accounts](hd-key)** - Learn about hierarchical deterministic accounts
- **[Account Utilities](utilities)** - Account validation and utilities
- **[Network-Specific Addresses](addresses)** - Working with different network addresses

# Mnemonic Accounts (/docs/tooling/avalanche-sdk/client/accounts/local/mnemonic)

---

title: "Mnemonic Accounts"
icon: "seedling"

---

## Overview

Mnemonic Accounts create Avalanche accounts from mnemonic phrases (seed words). Mnemonics provide a human-readable way to backup and restore accounts, making them ideal for user-facing applications.

**Best for:**

- User-facing applications
- Mobile wallets
- Desktop wallets
- Applications requiring easy account recovery

## Creating Mnemonic Accounts

### Basic Usage

```typescript
import { mnemonicsToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import type { AvalancheAccount } from "@avalanche-sdk/client/accounts";

const mnemonic =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const account: AvalancheAccount = mnemonicsToAvalancheAccount(mnemonic);

console.log("EVM Address:", account.getEVMAddress());
console.log("X-Chain Address:", account.getXPAddress("X"));
console.log("P-Chain Address:", account.getXPAddress("P"));
```

### Parameters

- **`mnemonic: string`** - The mnemonic phrase (required)
- **`options?: MnemonicToAccountOptions`** - Optional derivation path configuration

### Options Interface

```typescript
interface MnemonicToAccountOptions {
  accountIndex?: number; // Account index (default: 0)
  addressIndex?: number; // Address index (default: 0)
  changeIndex?: number; // Change index (default: 0)
  xpAccountIndex?: number; // XP account index (default: 0)
  xpAddressIndex?: number; // XP address index (default: 0)
  xpChangeIndex?: number; // XP change index (default: 0)
  path?: string; // Custom derivation path for EVM Account
  xpPath?: string; // Custom derivation path for XP Account
}
```

## Generating Mnemonics

### Generate Random Mnemonic

```typescript
import {
  generateMnemonic,
  mnemonicsToAvalancheAccount,
} from "@avalanche-sdk/client/accounts";
import type { AvalancheAccount } from "@avalanche-sdk/client/accounts";

const mnemonic: string = generateMnemonic();
console.log("Generated mnemonic:", mnemonic);

const account: AvalancheAccount = mnemonicsToAvalancheAccount(mnemonic);

console.log("EVM address:", account.getEVMAddress());
console.log("X-Chain address:", account.getXPAddress("X"));
console.log("P-Chain address:", account.getXPAddress("P"));

// ⚠️ IMPORTANT: Store mnemonic securely
// Never log it in production or commit to version control
```

### Generate Mnemonic in Different Languages

```typescript
import {
  generateMnemonic,
  english,
  spanish,
  japanese,
} from "@avalanche-sdk/client/accounts";

// Generate mnemonic in different languages
const englishMnemonic = generateMnemonic(english);
const spanishMnemonic = generateMnemonic(spanish);
const japaneseMnemonic = generateMnemonic(japanese);
// Also available: french, italian, portuguese, czech, korean, simplifiedChinese, traditionalChinese
```

## Derivation Paths

### Default Derivation Paths

The Avalanche Client SDK uses different derivation paths for EVM and XP accounts:

```typescript
// EVM (C-Chain) derivation path
// Standard BIP44 path for Ethereum
const evmPath = "m/44'/60'/0'/0/0"; // m/44'/60'/{accountIndex}'/{changeIndex}/{addressIndex}

// XP (X/P-Chain) derivation path
// Standard BIP44 path for Avalanche
const xpPath = "m/44'/9000'/0'/0/0"; // m/44'/9000'/{xpAccountIndex}'/{xpChangeIndex}/{xpAddressIndex}
```

### Custom Derivation Paths

```typescript
import { mnemonicsToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import type { AvalancheAccount } from "@avalanche-sdk/client/accounts";

const mnemonic = "abandon abandon abandon...";

// Create account with custom derivation paths
const account: AvalancheAccount = mnemonicsToAvalancheAccount(mnemonic, {
  accountIndex: 0,
  addressIndex: 0,
  changeIndex: 0,
  path: "m/44'/60'/0'/0/0", // Custom path
});
```

### Multiple Accounts from Same Mnemonic

```typescript
import { mnemonicsToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const mnemonic = "abandon abandon abandon...";

// Different account indices
const account0 = mnemonicsToAvalancheAccount(mnemonic, { accountIndex: 0 });
const account1 = mnemonicsToAvalancheAccount(mnemonic, { accountIndex: 1 });

// Different address indices
const addr0 = mnemonicsToAvalancheAccount(mnemonic, { addressIndex: 0 });
const addr1 = mnemonicsToAvalancheAccount(mnemonic, { addressIndex: 1 });
```

## Getting Addresses

```typescript
const account = mnemonicsToAvalancheAccount(mnemonic);

// All chain addresses
const evmAddress = account.getEVMAddress();
const xChainAddress = account.getXPAddress("X");
const pChainAddress = account.getXPAddress("P");

// Network-specific
const mainnet = account.getXPAddress("X", "avax");
const testnet = account.getXPAddress("X", "fuji");
```

## Using with Wallet Client

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";
import { mnemonicsToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = mnemonicsToAvalancheAccount(process.env.MNEMONIC!);

const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: { type: "http" },
});

// C-Chain transaction
const txHash = await walletClient.send({
  to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  amount: 0.001,
});

// X/P-Chain transaction
const xpTx = await walletClient.xChain.prepareBaseTxn({
  outputs: [{ addresses: [account.getXPAddress("X")], amount: 1 }],
});
await walletClient.sendXPTransaction(xpTx);
```

## Security

<Callout>
  **Never expose mnemonics in client-side code or commit them to version
  control. Use environment variables.**
</Callout>

```typescript
// ✅ Good
const account = mnemonicsToAvalancheAccount(process.env.MNEMONIC!);

// ❌ Bad
const account = mnemonicsToAvalancheAccount("abandon abandon abandon...");
```

## Next Steps

- **[HD Key Accounts](accounts/local/hd-key)** - Learn about hierarchical deterministic accounts
- **[Account Utilities](accounts/local/utilities)** - Account validation and utilities
- **[Using Accounts with Clients](accounts/local/clients)** - Client integration patterns
- **[Network-Specific Addresses](accounts/local/addresses)** - Multi-network support

# HD Key Accounts (/docs/tooling/avalanche-sdk/client/accounts/local/hd-key)

---

title: "HD Key Accounts"
icon: "tree"

---

## Overview

HD Key Accounts create Avalanche accounts from hierarchical deterministic (HD) keys with custom derivation paths. This allows for advanced key management and multiple account generation from a single seed.

## Creating HD Key Accounts

### Basic Usage

```typescript
import { hdKeyToAvalancheAccount, HDKey } from "@avalanche-sdk/client/accounts";
import type { AvalancheAccount } from "@avalanche-sdk/client/accounts";

const seed: Uint8Array = new Uint8Array(64); // Your seed
const hdKey: HDKey = HDKey.fromMasterSeed(seed);

const account: AvalancheAccount = hdKeyToAvalancheAccount(hdKey);
```

### Parameters

- **`hdKey: HDKey`** - The HD key instance (required)
- **`options?: HDKeyToAvalancheAccountOptions`** - Custom derivation path options (optional)

### Options

```typescript
interface HDKeyToAvalancheAccountOptions {
  accountIndex?: number; // Account index (default: 0)
  addressIndex?: number; // Address index (default: 0)
  changeIndex?: number; // Change index (default: 0)
  xpAccountIndex?: number; // XP account index (default: 0)
  xpAddressIndex?: number; // XP address index (default: 0)
  xpChangeIndex?: number; // XP change index (default: 0)
  path?: string; // Custom derivation path for EVM Account
  xpPath?: string; // Custom derivation path for XP Account
}
```

## Derivation Paths

### Default Derivation Paths

HD Key accounts use BIP-44 derivation paths to generate deterministic keys from a seed. By default, the SDK uses separate paths for EVM (C-Chain) and XP (X/P-Chain) accounts:

**EVM (C-Chain) Path:**

```
m/44'/60'/{accountIndex}'/{changeIndex}/{addressIndex}
```

**XP (X/P-Chain) Path:**

```
m/44'/9000'/{xpAccountIndex}'/{xpChangeIndex}/{xpAddressIndex}
```

**Path Components:**

- `m` - Master key
- `44'` - BIP-44 purpose (hardened)
- `60'` (EVM) or `9000'` (XP) - Coin type (hardened)
  - `60` is the standard Ethereum coin type (used for C-Chain)
  - `9000` is the Avalanche coin type (used for X/P-Chain)
- `{accountIndex}'` - Account index (hardened, default: 0)
- `{changeIndex}` - Change index (default: 0)
  - `0` is typically used for external addresses
  - `1` is typically used for change addresses
- `{addressIndex}` - Address index (default: 0)

**Default Values:**
When no options are provided, both paths default to `m/44'/60'/0'/0/0` (EVM) and `m/44'/9000'/0'/0/0` (XP).

### How Index Options Affect Paths

The following table shows how different index combinations affect the derivation paths:

| Option                             | EVM Path           | XP Path              | Notes                           |
| ---------------------------------- | ------------------ | -------------------- | ------------------------------- |
| Default (no options)               | `m/44'/60'/0'/0/0` | `m/44'/9000'/0'/0/0` | Both use index 0                |
| `accountIndex: 1`                  | `m/44'/60'/1'/0/0` | `m/44'/9000'/1'/0/0` | Both use account index 1        |
| `addressIndex: 2`                  | `m/44'/60'/0'/0/2` | `m/44'/9000'/0'/0/2` | Both use address index 2        |
| `changeIndex: 1`                   | `m/44'/60'/0'/1/0` | `m/44'/9000'/0'/1/0` | Both use change index 1         |
| `accountIndex: 1, addressIndex: 2` | `m/44'/60'/1'/0/2` | `m/44'/9000'/1'/0/2` | Combined indices                |
| `xpAccountIndex: 2`                | `m/44'/60'/0'/0/0` | `m/44'/9000'/2'/0/0` | XP uses different account index |
| `xpAddressIndex: 3`                | `m/44'/60'/0'/0/0` | `m/44'/9000'/0'/0/3` | XP uses different address index |
| `xpChangeIndex: 1`                 | `m/44'/60'/0'/0/0` | `m/44'/9000'/0'/1/0` | XP uses different change index  |

**Important Notes:**

- When you specify `accountIndex`, `addressIndex`, or `changeIndex`, they apply to EVM path.
- XP-specific options (`xpAccountIndex`, `xpAddressIndex`, `xpChangeIndex`) only affect the XP path, allowing you to use different indices for XP accounts while keeping EVM indices separate.

### Custom Path Override

<Callout type="warning">
  **Important Limitation**: When the `path` or `xpPath` option is provided, it
  overrides the EVM or XP derivation paths.
</Callout>

When you provide a custom `path` or `xpPath`, it completely replaces the default path calculation for EVM and XP accounts:

```typescript
import { hdKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import type { AvalancheAccount } from "@avalanche-sdk/client/accounts";

// ⚠️ WARNING: This path will be used for EVM accounts
const account: AvalancheAccount = hdKeyToAvalancheAccount(hdKey, {
  path: "m/44'/60'/0'/0/0", // EVM will use this path
});

// ⚠️ WARNING: This path will be used for XP accounts
const account: AvalancheAccount = hdKeyToAvalancheAccount(hdKey, {
  xpPath: "m/44'/60'/0'/0/0", // XP Account will use this path
});

// The following options are IGNORED when path is provided:
// accountIndex, addressIndex, changeIndex
// xpAccountIndex, xpAddressIndex, xpChangeIndex
```

**When to Use Custom Paths:**

- When you need to match a specific wallet's derivation path
- When migrating from another wallet implementation
- When you need full control over the derivation path

**When NOT to Use Custom Paths:**

- When you want different paths for EVM and XP accounts (use index options instead)
- When you want to leverage the default BIP-44 compliant paths
- In most standard use cases

### Examples

```typescript
import { hdKeyToAvalancheAccount, HDKey } from "@avalanche-sdk/client/accounts";

const hdKey = HDKey.fromMasterSeed(seed);

// Default paths (EVM: m/44'/60'/0'/0/0, XP: m/44'/9000'/0'/0/0)
const account = hdKeyToAvalancheAccount(hdKey);

// Different indices
const account1 = hdKeyToAvalancheAccount(hdKey, { accountIndex: 1 });
const account2 = hdKeyToAvalancheAccount(hdKey, { addressIndex: 1 });

// Separate EVM and XP indices
const account3 = hdKeyToAvalancheAccount(hdKey, {
  accountIndex: 0, // EVM
  xpAccountIndex: 2, // XP
});

// Custom path (⚠️ applies to both EVM and XP)
const account4 = hdKeyToAvalancheAccount(hdKey, {
  path: "m/44'/60'/0'/0/0",
});
```

## Multiple Accounts

Generate multiple accounts from the same HD key:

```typescript
import { hdKeyToAvalancheAccount, HDKey } from "@avalanche-sdk/client/accounts";

const hdKey = HDKey.fromMasterSeed(seed);

const account1 = hdKeyToAvalancheAccount(hdKey, { addressIndex: 0 });
const account2 = hdKeyToAvalancheAccount(hdKey, { addressIndex: 1 });
const account3 = hdKeyToAvalancheAccount(hdKey, { addressIndex: 2 });
```

## Using with Wallet Client

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: { type: "http" },
});

const txHash = await walletClient.send({
  to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  amount: avaxToWei(0.001),
});
```

## Security

<Callout>
  **Never expose seeds in client-side code or commit them to version control.
  Use environment variables.**
</Callout>

```typescript
// ✅ Good
const seed = new Uint8Array(Buffer.from(process.env.SEED!, "hex"));
const hdKey = HDKey.fromMasterSeed(seed);

// ❌ Bad
const seed = new Uint8Array(64); // Hardcoded seed
```

## Next Steps

- **[Account Utilities](utilities)** - Account validation and utilities
- **[Using Accounts with Clients](clients)** - Client integration patterns

# Network-Specific Addresses (/docs/tooling/avalanche-sdk/client/accounts/local/addresses)

---

title: "Network-Specific Addresses"
icon: "map-pin"

---

## Overview

Avalanche uses different address formats for each chain. EVM addresses work the same across networks, but XP addresses use network-specific HRPs (Human-Readable Prefixes).

## Address Formats

### EVM Addresses (C-Chain)

EVM addresses are the same across all networks:

```typescript
const evmAddress = account.getEVMAddress(); // 0x742d35Cc...
```

### XP Addresses (X/P-Chain)

XP addresses use network-specific HRPs:

```typescript
// Mainnet
const mainnetX = account.getXPAddress("X", "avax"); // X-avax1...
const mainnetP = account.getXPAddress("P", "avax"); // P-avax1...

// Testnet (Fuji)
const fujiX = account.getXPAddress("X", "fuji"); // X-fuji1...
const fujiP = account.getXPAddress("P", "fuji"); // P-fuji1...
```

## Network Configuration

```typescript
// Mainnet addresses
const mainnet = {
  evm: account.getEVMAddress(),
  xChain: account.getXPAddress("X", "avax"),
  pChain: account.getXPAddress("P", "avax"),
};

// Testnet addresses
const testnet = {
  evm: account.getEVMAddress(),
  xChain: account.getXPAddress("X", "fuji"),
  pChain: account.getXPAddress("P", "fuji"),
};
```

## Next Steps

- **[Account Utilities](accounts/local/utilities)** - Account validation and utilities
- **[Using Accounts with Clients](accounts/local/clients)** - Client integration patterns

# Account Utilities (/docs/tooling/avalanche-sdk/client/accounts/local/utilities)

---

title: "Account Utilities"
icon: "hammer"

---

## Overview

Account utilities provide validation, parsing, and helper functions for working with Avalanche accounts and addresses.

## Account Validation

### Parse Avalanche Account

```typescript
function parseAvalancheAccount(
  account: Address | AvalancheAccount | undefined,
): AvalancheAccount | undefined;
```

**Parameters:**

- `account` (`Address | AvalancheAccount | undefined`): The account or address to parse. Can be an EVM address string, an existing `AvalancheAccount`, or `undefined`.

**Returns:**

- `AvalancheAccount | undefined`: Returns an `AvalancheAccount` when an address or account is provided, or `undefined` when the input is `undefined`.

**Behavior:**

The function behaves differently based on the input type:

1. **When an address string is passed**: Returns an `AvalancheAccount` with only `evmAccount` populated. The `xpAccount` property will be `undefined` because an address string alone doesn't contain the private key information needed to derive XP account details.

2. **When an AvalancheAccount is passed**: Returns the account as-is without modification. This is useful for normalizing function parameters that accept both addresses and accounts.

3. **When undefined is passed**: Returns `undefined`. This allows for optional account parameters in functions.

**Limitations:**

- When parsing from an address string, the returned account will only have `evmAccount` populated. The `xpAccount` property will be `undefined`, which means:
  - You cannot perform X-Chain or P-Chain operations that require signing (e.g., `account.xpAccount.signMessage()`)
  - You can still use the account for read-only operations or C-Chain (EVM) operations
  - To get XP account functionality, you need to create an account from a private key or mnemonic or use a custom provider

**Example:**

```typescript
import { parseAvalancheAccount } from "@avalanche-sdk/client/accounts";
import type { AvalancheAccount, Address } from "@avalanche-sdk/client/accounts";

// Parse from address string (only evmAccount populated)
const address: Address = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";
const account = parseAvalancheAccount(address);
// account.xpAccount is undefined - can only use for C-Chain operations

// Parse existing account (returns as-is)
const fullAccount: AvalancheAccount = /* ... */;
const normalized = parseAvalancheAccount(fullAccount); // Returns as-is

// Handle undefined
const optional = parseAvalancheAccount(undefined); // Returns undefined
```

## Address Utilities

### Private Key to XP Address

```typescript
function privateKeyToXPAddress(privateKey: string, hrp: string): XPAddress;
```

**Parameters:**

- `privateKey` (`string`): The private key with `0x` prefix.
- `hrp` (`string`): The human-readable prefix for the address. Use `"avax"` for mainnet or `"fuji"` for testnet.

**Returns:**

- `XPAddress`: The Bech32-encoded XP address as a string.

**Example:**

```typescript
import { privateKeyToXPAddress } from "@avalanche-sdk/client/accounts";

const mainnet = privateKeyToXPAddress("0x...", "avax");
const testnet = privateKeyToXPAddress("0x...", "fuji");
```

### Public Key to XP Address

```typescript
function publicKeyToXPAddress(publicKey: string, hrp: string): XPAddress;
```

**Parameters:**

- `publicKey` (`string`): The public key with `0x` prefix.
- `hrp` (`string`): The human-readable prefix for the address. Use `"avax"` for mainnet or `"fuji"` for testnet.

**Returns:**

- `XPAddress`: The Bech32-encoded XP address as a string.

**Example:**

```typescript
import { publicKeyToXPAddress } from "@avalanche-sdk/client/accounts";

const xpAddress = publicKeyToXPAddress("0x...", "avax");
```

### Private Key to XP Public Key

```typescript
function privateKeyToXPPublicKey(privateKey: string): string;
```

**Parameters:**

- `privateKey` (`string`): The private key with `0x` prefix.

**Returns:**

- `string`: The compressed public key in hex format with `0x` prefix.

**Example:**

```typescript
import {
  privateKeyToXPPublicKey,
  publicKeyToXPAddress,
} from "@avalanche-sdk/client/accounts";

const publicKey = privateKeyToXPPublicKey("0x...");
const xpAddress = publicKeyToXPAddress(publicKey, "avax");
```

## Message Signing

### XP Message Signing

```typescript
function xpSignMessage(message: string, privateKey: string): Promise<string>;
```

**Parameters:**

- `message` (`string`): The message to sign.
- `privateKey` (`string`): The private key with `0x` prefix to sign with.

**Returns:**

- `Promise<string>`: A promise that resolves to a base58-encoded signature string.

**Example:**

```typescript
import { xpSignMessage } from "@avalanche-sdk/client/accounts";

const signature = await xpSignMessage("Hello Avalanche!", "0x...");
// Returns base58-encoded signature (e.g., "2k5Jv...")
```

### XP Transaction Signing

```typescript
function xpSignTransaction(
  txHash: string | Uint8Array,
  privateKey: string | Uint8Array,
): Promise<string>;
```

**Parameters:**

- `txHash` (`string | Uint8Array`): The transaction hash to sign. Can be a hex string with `0x` prefix or a `Uint8Array`.
- `privateKey` (`string | Uint8Array`): The private key to sign with. Can be a hex string with `0x` prefix or a `Uint8Array`.

**Returns:**

- `Promise<string>`: A promise that resolves to a hex-encoded signature string with `0x` prefix.

**Example:**

```typescript
import { xpSignTransaction } from "@avalanche-sdk/client/accounts";

const signature = await xpSignTransaction("0x...", "0x...");
// Returns hex-encoded signature (e.g., "0x1234...")
```

### Signature Verification

```typescript
function xpVerifySignature(
  signature: string,
  message: string,
  publicKey: string,
): boolean;
```

**Parameters:**

- `signature` (`string`): The signature to verify in hex format with `0x` prefix.
- `message` (`string`): The message that was signed.
- `publicKey` (`string`): The public key to verify with in hex format with `0x` prefix.

**Returns:**

- `boolean`: `true` if the signature is valid, `false` otherwise.

**Note:** This function expects hex format signatures. For base58 signatures created with `xpSignMessage`, use `xpAccount.verify()` instead.

**Example:**

```typescript
import { xpVerifySignature } from "@avalanche-sdk/client/accounts";

const isValid = xpVerifySignature("0x...", "Hello Avalanche!", "0x...");

// For base58 signatures from xpSignMessage, use xpAccount.verify() instead
```

### Public Key Recovery

```typescript
function xpRecoverPublicKey(message: string, signature: string): string;
```

**Parameters:**

- `message` (`string`): The message that was signed.
- `signature` (`string`): The signature in hex format with `0x` prefix.

**Returns:**

- `string`: The recovered public key as a hex string with `0x` prefix.

**Example:**

```typescript
import { xpRecoverPublicKey } from "@avalanche-sdk/client/accounts";

const publicKey = xpRecoverPublicKey("Hello Avalanche!", "0x...");
```

## XP Account Creation

### Private Key to XP Account

```typescript
function privateKeyToXPAccount(privateKey: string): XPAccount;
```

**Parameters:**

- `privateKey` (`string`): The private key with `0x` prefix.

**Returns:**

- `XPAccount`: An XP account object with the following properties:
  - `publicKey` (`string`): The compressed public key in hex format.
  - `signMessage(message: string)` (`Promise<string>`): Signs a message and returns a base58-encoded signature.
  - `signTransaction(txHash: string | Uint8Array)` (`Promise<string>`): Signs a transaction hash and returns a hex-encoded signature.
  - `verify(message: string, signature: string)` (`boolean`): Verifies a message signature.
  - `type` (`"local"`): The account type.
  - `source` (`"privateKey"`): The account source.

**Note:** Creates an XP-only account from a private key. Lighter weight than `privateKeyToAvalancheAccount` since it skips EVM account initialization. Use this when you only need X-Chain or P-Chain operations.

<Callout type="warning">
  **Limitations**: No EVM account—can't use for C-Chain operations. If you need
  both XP and EVM functionality, use `privateKeyToAvalancheAccount` instead.
</Callout>

**Example:**

```typescript
import { privateKeyToXPAccount } from "@avalanche-sdk/client/accounts";

const xpAccount = privateKeyToXPAccount("0x...");

// Sign message
const signature = await xpAccount.signMessage("Hello Avalanche!");
const isValid = xpAccount.verify("Hello Avalanche!", signature);

// Sign transaction
const txSignature = await xpAccount.signTransaction("0x...");
```

## Next Steps

- **[Using Accounts with Clients](accounts/local/clients)** - Client integration patterns
- **[Wallet Operations](methods/wallet-methods/wallet)** - Learn how to send transactions
- **[Account Management](accounts)** - Overview of account management

# Using Accounts with Clients (/docs/tooling/avalanche-sdk/client/accounts/local/clients)

---

title: "Using Accounts with Clients"
icon: "link"

---

## Overview

Accounts work with both public clients (read-only) and wallet clients (transactions). You can hoist the account into the client or pass it to each method.

## Public Client (Read-Only)

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

const account = privateKeyToAvalancheAccount("0x...");

// Read operations
const balance = await client.getBalance({ address: account.getEVMAddress() });
const height = await client.pChain.getHeight();
```

## Wallet Client (Transactions)

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avaxToWei } from "@avalanche-sdk/client/utils";

const account = privateKeyToAvalancheAccount("0x...");

// Hoist account (recommended)
const walletClient = createAvalancheWalletClient({
  account, // Account is hoisted
  chain: avalanche,
  transport: { type: "http" },
});

// C-Chain transaction
const txHash = await walletClient.send({
  to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  amount: avaxToWei(0.001),
});

// X/P-Chain transaction
const xpTx = await walletClient.xChain.prepareBaseTxn({
  outputs: [{ addresses: [account.getXPAddress("X")], amount: 1 }],
});
await walletClient.sendXPTransaction(xpTx);
```

## Account Hoisting

You can hoist the account into the client (recommended) or pass it to each method:

```typescript
// Hoisted (recommended)
const walletClient = createAvalancheWalletClient({
  account, // No need to pass to each method
  chain: avalanche,
  transport: { type: "http" },
});
await walletClient.send({ to: "0x...", amount: 0.001 });

// Or pass per method
const walletClient = createAvalancheWalletClient({
  chain: avalanche,
  transport: { type: "http" },
});
await walletClient.send({ account, to: "0x...", amount: 0.001 });
```

## Cross-Chain Operations

Cross-chain transfers use the export/import pattern. Export from the source chain, wait for confirmation, then import to the destination chain.

[Learn more about cross-chain transfers →](methods/wallet-methods/wallet#cross-chain-transfers)

## Next Steps

- **[Wallet Operations](methods/wallet-methods/wallet)** - Learn how to send transactions
- **[P-Chain Operations](methods/public-methods/p-chain)** - Validator and staking operations
- **[X-Chain Operations](methods/public-methods/x-chain)** - Asset transfers and UTXO operations
- **[C-Chain Operations](methods/public-methods/c-chain)** - EVM and smart contract operations

# JSON-RPC Accounts (/docs/tooling/avalanche-sdk/client/accounts/json-rpc)

---

title: JSON-RPC Accounts
icon: globe
description: Learn how to use JSON-RPC accounts with browser wallets like MetaMask and Core in the Avalanche Client SDK.

---

## Overview

A JSON-RPC Account is an Account whose signing keys are stored on an external Wallet. It **defers** signing of transactions & messages to the target Wallet over JSON-RPC. Examples of such wallets include Browser Extension Wallets (like MetaMask or Core) or Mobile Wallets over WalletConnect.

## Supported Wallets

### Core Browser Extension

Core is Avalanche's official browser extension wallet that provides native support for Avalanche networks (C/P/X-Chains).

```typescript
import "@avalanche-sdk/client/window";
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

try {
  // Check if Core extension is available
  const provider = window.avalanche;
  if (!provider) {
    throw new Error(
      "Core extension not found. Please install Core. https://core.app",
    );
  }

  // Create wallet client with Core provider
  const walletClient = createAvalancheWalletClient({
    chain: avalanche,
    transport: {
      type: "custom",
      provider,
    },
  });
} catch (error) {
  console.error("Failed to initialize Core provider:", error);
}
```

### MetaMask

MetaMask can be used with Avalanche networks through custom network configuration for C-Chain evm operations.

```typescript
import "@avalanche-sdk/client/window";
import { createAvalancheWalletClient, custom } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

// Use MetaMask provider
const provider = window.ethereum;
if (!provider) {
  throw new Error("MetaMask not found. Please install MetaMask.");
}

const walletClient = createAvalancheWalletClient({
  chain: avalanche,
  transport: {
    type: "custom",
    provider,
  },
});
```

## Basic Usage

### 1. Request Account Connection

```typescript
try {
  // Request accounts from the wallet
  const accounts: string[] = await walletClient.requestAddresses();
  const address: string = accounts[0]; // Get the first account
  console.log("Connected address:", address);
} catch (error) {
  console.error("Failed to request addresses:", error);
}
```

### 2. Send Transactions

```typescript
try {
  // Send a transaction (will prompt user to sign)
  const txHash: string = await walletClient.send({
    to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    amount: 0.001,
  });
  console.log("Transaction hash:", txHash);
} catch (error) {
  console.error("Failed to send transaction:", error);
}
```

### 3. Switch Networks

```typescript
import { avalanche, avalancheFuji } from "@avalanche-sdk/client/chains";

try {
  // Switch to Avalanche mainnet
  await walletClient.switchChain({
    id: avalanche.id,
  });
  console.log("Switched to Avalanche mainnet");

  // Switch to Fuji testnet
  await walletClient.switchChain({
    id: avalancheFuji.id,
  });
  console.log("Switched to Fuji testnet");
} catch (error) {
  console.error("Failed to switch chain:", error);
}
```

## React Integration Example

Here's a complete React component for wallet connection using Core:

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalanche, avalancheFuji } from "@avalanche-sdk/client/chains";
import { useState, useCallback } from "react";
import "@avalanche-sdk/client/window";

export function ConnectWallet() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chain, setChain] = useState<"mainnet" | "fuji">("fuji");

  const selectedChain = chain === "fuji" ? avalancheFuji : avalanche;

  const connect = useCallback(async () => {
    try {
      const provider = window.avalanche;
      if (!provider) {
        throw new Error("Core extension not found. Please install Core.");
      }

      const walletClient = createAvalancheWalletClient({
        chain: selectedChain,
        transport: { type: "custom", provider },
      });

      const accounts = await walletClient.requestAddresses();
      const addr = accounts[0];

      setAddress(addr);
      setConnected(true);
    } catch (error) {
      console.error("Connection failed:", error);
    }
  }, [selectedChain]);

  const sendTransaction = useCallback(async () => {
    if (!connected || !address) return;

    try {
      const provider = (window as any).avalanche;
      const walletClient = createAvalancheWalletClient({
        chain: selectedChain,
        transport: { type: "custom", provider },
      });

      const txHash = await walletClient.send({
        to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        amount: 0.001,
      });

      console.log("Transaction sent:", txHash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }, [connected, address, selectedChain]);

  return (
    <div>
      <h2>Wallet Connection</h2>

      {!connected ? (
        <button onClick={connect}>Connect Core Wallet</button>
      ) : (
        <div>
          <p>Connected: {address}</p>
          <p>Network: {selectedChain.name}</p>

          <div>
            <label>
              <input
                type="radio"
                value="fuji"
                checked={chain === "fuji"}
                onChange={(e) => setChain(e.target.value as "fuji")}
              />
              Fuji Testnet
            </label>
            <label>
              <input
                type="radio"
                value="mainnet"
                checked={chain === "mainnet"}
                onChange={(e) => setChain(e.target.value as "mainnet")}
              />
              Mainnet
            </label>
          </div>

          <button onClick={sendTransaction}>Send Transaction</button>
        </div>
      )}
    </div>
  );
}
```

## Cross-Chain Operations

JSON-RPC accounts support cross-chain operations through the Avalanche Client SDK:

```typescript
// P-Chain export transaction
const pChainExportTxn = await walletClient.pChain.prepareExportTxn({
  destinationChain: "C",
  fromAddress: address,
  exportedOutput: {
    addresses: [address],
    amount: avaxToWei(0.001),
  },
});

const txHash = await walletClient.sendXPTransaction(pChainExportTxn);
```

## Best Practices

### 1. Check Provider Availability

```typescript
// Always check if the provider is available
if (typeof window !== "undefined" && window.avalanche) {
  // Core is available
} else if (typeof window !== "undefined" && window.ethereum) {
  // MetaMask is available
} else {
  // No wallet provider found
}
```

### 2. Handle Network Switching

```typescript
// Check if wallet is on the correct network
const currentChainId = await walletClient.getChainId();
if (currentChainId !== avalanche.id) {
  await walletClient.switchChain({ id: avalanche.id });
}
```

### 3. Graceful Error Handling

```typescript
const handleWalletError = (error: any) => {
  switch (error.code) {
    case 4001:
      return "User rejected the request";
    case -32002:
      return "Request already pending";
    case -32602:
      return "Invalid parameters";
    default:
      return error.message || "Unknown error occurred";
  }
};
```

## Troubleshooting

### Common Issues

**Provider Not Found**

```typescript
// Check if provider exists
if (!window.avalanche && !window.ethereum) {
  throw new Error("No wallet provider found. Please install Core or MetaMask.");
}
```

**Wrong Network**

```typescript
// Ensure wallet is on the correct network
const chainId = await walletClient.getChainId();
if (chainId !== avalanche.id) {
  await walletClient.switchChain({ id: avalanche.id });
}
```

**User Rejection**

```typescript
try {
  await walletClient.send({ to: address, amount: 0.001 });
} catch (error) {
  if (error.code === 4001) {
    console.log("User rejected transaction");
  }
}
```

## Next Steps

- **[Local Accounts](accounts/local)** - Learn about local account management
- **[Wallet Operations](methods/wallet-methods/wallet)** - Learn how to send transactions
- **[Cross-Chain Transfers](methods/wallet-methods/wallet#cross-chain-transfers)** - Moving assets between chains

# Clients (/docs/tooling/avalanche-sdk/client/clients)

---

## title: Clients

## Overview

The SDK provides different client types for interacting with Avalanche. Each client is optimized for specific use cases.

## Client Architecture

```typescript
Avalanche Client (Public)
├── P-Chain Client
├── X-Chain Client
├── C-Chain Client
├── Admin API Client
├── Info API Client
├── Health API Client
├── ProposerVM Client
└── Index API Clients

Avalanche Wallet Client
├── All Public Client Methods
├── P-Chain Wallet Operations
├── X-Chain Wallet Operations
├── C-Chain Wallet Operations
└── ERC20 Token Operations
```

## Client Types

### Main Clients

- **[Avalanche Client](clients/avalanche-client)** - Read-only operations for all chains
- **[Avalanche Wallet Client](clients/wallet-client)** - Transaction signing and sending

### Chain-Specific Clients

- **[P-Chain Client](clients/p-chain-client)** - Validator and staking operations
- **[X-Chain Client](clients/x-chain-client)** - Asset transfers and UTXO operations
- **[C-Chain Client](clients/c-chain-client)** - EVM and atomic transaction operations

### API Clients

- **[Admin API Client](clients/api-clients#admin-api-client)** - Administrative node operations
- **[Info API Client](clients/api-clients#info-api-client)** - Node information and network statistics
- **[Health API Client](clients/api-clients#health-api-client)** - Node health monitoring
- **[ProposerVM Client](clients/api-clients#proposervm-client)** - ProposerVM operations
- **[Index API Clients](clients/api-clients#index-api-clients)** - Indexed blockchain data queries

## Configuration

All clients accept a common configuration:

```typescript
interface AvalancheClientConfig {
  transport: Transport; // Required: HTTP, WebSocket, or Custom
  chain?: Chain; // Optional: Network configuration
  account?: Account | Address; // Optional: For wallet operations
  apiKey?: string; // Optional: For authenticated endpoints
  rlToken?: string; // Optional: Rate limit token
  key?: string; // Optional: Client key identifier
  name?: string; // Optional: Client name
  pollingInterval?: number; // Optional: Polling interval in ms (default: chain.blockTime / 3)
  cacheTime?: number; // Optional: Cache time in ms (default: chain.blockTime / 3)
  batch?: { multicall?: boolean | MulticallBatchOptions }; // Optional: Batch settings
  ccipRead?:
    | {
        request?: (
          params: CcipRequestParameters,
        ) => Promise<CcipRequestReturnType>;
      }
    | false; // Optional: CCIP Read config
  experimental_blockTag?: BlockTag; // Optional: Default block tag (default: 'latest')
  rpcSchema?: RpcSchema; // Optional: Typed JSON-RPC schema
  type?: string; // Optional: Client type
}
```

### Configuration Options

| Option            | Type                 | Required | Default               | Description                                       |
| ----------------- | -------------------- | -------- | --------------------- | ------------------------------------------------- |
| `transport`       | `Transport`          | ✅ Yes   | -                     | Transport configuration (HTTP, WebSocket, Custom) |
| `chain`           | `Chain`              | No       | -                     | Network configuration (mainnet/testnet)           |
| `account`         | `Account \| Address` | No       | -                     | Account for signing operations                    |
| `apiKey`          | `string`             | No       | -                     | API key for authenticated endpoints               |
| `rlToken`         | `string`             | No       | -                     | Rate limit token                                  |
| `key`             | `string`             | No       | -                     | Client key identifier                             |
| `name`            | `string`             | No       | -                     | Client name                                       |
| `pollingInterval` | `number`             | No       | `chain.blockTime / 3` | Polling interval in milliseconds                  |
| `cacheTime`       | `number`             | No       | `chain.blockTime / 3` | Cache time in milliseconds                        |
| `batch`           | `object`             | No       | -                     | Batch settings (multicall configuration)          |
| `ccipRead`        | `object \| false`    | No       | -                     | CCIP Read configuration                           |
| `rpcSchema`       | `RpcSchema`          | No       | -                     | Typed JSON-RPC schema                             |
| `type`            | `string`             | No       | -                     | Client type identifier                            |

## Usage Examples

### Public Client

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

// Read data from all chains
const pHeight = await client.pChain.getHeight();
const balance = await client.getBalance({ address: "0x..." });
```

### Wallet Client

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalanche } from "@avalanche-sdk/client/chains";
import { avaxToWei } from "@avalanche-sdk/client/utils";

const account = privateKeyToAvalancheAccount("0x...");

const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: { type: "http" },
});

// Send transaction
const txHash = await walletClient.send({
  to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  amount: avaxToWei(0.001),
});
```

### Accessing Sub-Clients

```typescript
const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

// Chain clients
client.pChain; // P-Chain operations
client.xChain; // X-Chain operations
client.cChain; // C-Chain operations

// API clients
client.admin; // Admin API
client.info; // Info API
client.health; // Health API
client.proposerVM.pChain; // ProposerVM API for P Chain
client.proposerVM.xChain; // ProposerVM API for X Chain
client.proposerVM.cChain; // ProposerVM API for C Chain
client.indexBlock.pChain; // P-Chain block index
client.indexBlock.cChain; // C-Chain block index
client.indexBlock.xChain; // X-Chain block index
client.indexTx.xChain; // X-Chain transaction index
```

## Next Steps

- **[Avalanche Client](clients/avalanche-client)** - Read-only operations
- **[Avalanche Wallet Client](clients/wallet-client)** - Transaction operations
- **[Chain-Specific Clients](clients/p-chain-client)** - P, X, and C-Chain clients
- **[API Clients](clients/api-clients)** - Admin, Info, Health, ProposerVM, and Index APIs

# Avalanche Client (/docs/tooling/avalanche-sdk/client/clients/avalanche-client)

---

## title: Avalanche Client

## Overview

The Avalanche Client (also known as the Public Client) is the main client for read-only operations across all Avalanche chains. It provides a unified interface for querying data from P-Chain, X-Chain, C-Chain, and various API endpoints.

**When to use:** Use the Avalanche Client when you need to query blockchain data but don't need to send transactions.

## Installation & Setup

For setup instructions, see the [Getting Started](/avalanche-sdk/client-sdk/getting-started) guide.

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});
```

## Available Clients

The Avalanche Client automatically provides access to all chain-specific and API clients:

```typescript
// Chain clients
client.pChain; // P-Chain operations (validators, staking, subnets)
client.xChain; // X-Chain operations (assets, UTXOs)
client.cChain; // C-Chain operations (EVM, atomic transactions)

// API clients
client.admin; // Admin API operations
client.info; // Info API operations
client.health; // Health API operations
client.proposerVM.pChain; // ProposerVM API for P Chain
client.proposerVM.xChain; // ProposerVM API for X Chain
client.proposerVM.cChain; // ProposerVM API for C Chain
client.indexBlock.pChain; // P-Chain block index
client.indexBlock.cChain; // C-Chain block index
client.indexBlock.xChain; // X-Chain block index
client.indexTx.xChain; // X-Chain transaction index
```

## Available Methods

The Avalanche Client extends viem's Public Client and provides additional Avalanche-specific methods:

### Avalanche-Specific Methods

- **Public Methods**: `baseFee`, `getChainConfig`, `maxPriorityFeePerGas`, `feeConfig`, `getActiveRulesAt`

For complete documentation, see [Public Methods Reference](/avalanche-sdk/client-sdk/methods/public-methods/public).

### Chain-Specific Methods

Access methods through chain clients:

- **P-Chain Methods**: See [P-Chain Client](/avalanche-sdk/client-sdk/clients/p-chain-client) and [P-Chain Methods Reference](/avalanche-sdk/client-sdk/methods/public-methods/p-chain)
- **X-Chain Methods**: See [X-Chain Client](/avalanche-sdk/client-sdk/clients/x-chain-client) and [X-Chain Methods Reference](/avalanche-sdk/client-sdk/methods/public-methods/x-chain)
- **C-Chain Methods**: See [C-Chain Client](/avalanche-sdk/client-sdk/clients/c-chain-client) and [C-Chain Methods Reference](/avalanche-sdk/client-sdk/methods/public-methods/c-chain)

### viem Public Client Methods

The client extends viem's Public Client, providing access to all standard EVM actions:

- `getBalance`, `getBlock`, `getBlockNumber`, `getTransaction`, `getTransactionReceipt`
- `readContract`, `call`, `estimateGas`, `getCode`, `getStorageAt`
- And many more...

See the [viem documentation](https://viem.sh/docs/getting-started) for all available EVM actions.

## Common Operations

### Query P-Chain Data

```typescript
// Get current block height
const height = await client.pChain.getHeight();

// Get current validators
const validators = await client.pChain.getCurrentValidators({
  subnetID: "11111111111111111111111111111111LpoYY",
});

// Get subnet information
const subnet = await client.pChain.getSubnet({
  subnetID: "11111111111111111111111111111111LpoYY",
});

// Get balance
const balance = await client.pChain.getBalance({
  addresses: ["P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"],
});
```

### Query X-Chain Data

```typescript
// Get balance for specific asset
const balance = await client.xChain.getBalance({
  addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
  assetID: "AVAX",
});

// Get all balances
const allBalances = await client.xChain.getAllBalances({
  addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
});

// Get asset information
const asset = await client.xChain.getAssetDescription({
  assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
});
```

### Query C-Chain Data

```typescript
// Get EVM balance (viem action)
const balance = await client.getBalance({
  address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
});

// Get transaction receipt (viem action)
const receipt = await client.getTransactionReceipt({
  hash: "0x...",
});

// Get base fee (Avalanche-specific)
const baseFee = await client.baseFee();

// Get chain config
const chainConfig = await client.getChainConfig();

// Get atomic transaction
const atomicTx = await client.cChain.getAtomicTx({
  txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
});
```

### Query API Data

```typescript
// Admin API - Get peers
const peers = await client.admin.getPeers();

// Info API - Get node version
const version = await client.info.getNodeVersion();

// Health API - Get health status
const health = await client.health.health();

// Index API - Get block by index
const block = await client.indexPChainBlock.getContainerByIndex({
  index: 12345,
});
```

## Error Handling

Always handle errors appropriately:

```typescript
import { BaseError } from "viem";

try {
  const balance = await client.getBalance({
    address: "0x...",
  });
} catch (error) {
  if (error instanceof BaseError) {
    console.error("RPC Error:", error.message);
  } else {
    console.error("Unknown error:", error);
  }
}
```

## When to Use This Client

- ✅ Querying blockchain data
- ✅ Reading balances and transaction history
- ✅ Checking validator information
- ✅ Monitoring network status
- ✅ Inspecting smart contract state

**Don't use this client for:**

- ❌ Sending transactions (use [Wallet Client](/avalanche-sdk/client-sdk/clients/wallet-client))
- ❌ Signing messages (use [Wallet Client](/avalanche-sdk/client-sdk/clients/wallet-client))
- ❌ Cross-chain transfers (use [Wallet Client](/avalanche-sdk/client-sdk/clients/wallet-client))

## Best Practices

### Use Specific Clients

```typescript
// Good: Use P-Chain client for platform operations
const validators = await client.pChain.getCurrentValidators({});

// Good: Use X-Chain client for asset operations
const balance = await client.xChain.getBalance({
  addresses: ["X-avax..."],
  assetID: "AVAX",
});

// Good: Use C-Chain client for EVM operations
const atomicTx = await client.cChain.getAtomicTx({
  txID: "0x...",
});
```

### Using viem Actions

Since the Avalanche Client extends viem's Public Client, you have access to all viem actions:

```typescript
// Use viem's readContract action
const result = await client.readContract({
  address: "0x...",
  abi: contractABI,
  functionName: "balanceOf",
  args: ["0x..."],
});

// Use viem's getTransaction action
const tx = await client.getTransaction({
  hash: "0x...",
});

// Use viem's estimateGas action
const gas = await client.estimateGas({
  to: "0x...",
  value: parseEther("0.001"),
});
```

See the [viem documentation](https://viem.sh/docs/getting-started) for all available actions.

## Next Steps

- **[Wallet Client](/avalanche-sdk/client-sdk/clients/wallet-client)** - Transaction signing and sending
- **[P-Chain Client](/avalanche-sdk/client-sdk/clients/p-chain-client)** - Detailed P-Chain operations
- **[X-Chain Client](/avalanche-sdk/client-sdk/clients/x-chain-client)** - Asset and UTXO operations
- **[C-Chain Client](/avalanche-sdk/client-sdk/clients/c-chain-client)** - EVM and atomic operations
- **[Public Methods Reference](/avalanche-sdk/client-sdk/methods/public-methods/public)** - Complete public method documentation

# Avalanche Wallet Client (/docs/tooling/avalanche-sdk/client/clients/wallet-client)

---

## title: Avalanche Wallet Client

## Overview

The Avalanche Wallet Client extends the Public Client with full transaction signing and sending capabilities. It enables cross-chain operations, atomic transactions, and comprehensive wallet management across all Avalanche chains.

**When to use:** Use the Wallet Client when you need to sign and send transactions, sign messages, or manage accounts.

## Installation & Setup

For setup instructions, see the [Getting Started](/avalanche-sdk/client-sdk/getting-started) guide.

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = privateKeyToAvalancheAccount("0x...");

const walletClient = createAvalancheWalletClient({
  account, // Hoist the account, otherwise we can pass a custom provider for injected provider or pass a account for each method
  chain: avalanche,
  transport: { type: "http" },
});
```

## Available Wallet Operations

The Wallet Client provides access to:

```typescript
// Chain wallet operations
walletClient.pChain; // P-Chain wallet operations
walletClient.xChain; // X-Chain wallet operations
walletClient.cChain; // C-Chain wallet operations

// Core wallet methods
walletClient.send(); // Send transactions
walletClient.sendXPTransaction(); // Send XP transactions
walletClient.signXPMessage(); // Sign XP messages
walletClient.signXPTransaction(); // Sign XP transactions
walletClient.waitForTxn(); // Wait for transaction confirmation
walletClient.getAccountPubKey(); // Get account public key
```

For complete method documentation, see:

- **[Wallet Methods](/avalanche-sdk/client-sdk/methods/wallet-methods/wallet)** - Core wallet operations
- **[P-Chain Wallet Methods](/avalanche-sdk/client-sdk/methods/wallet-methods/p-chain-wallet)** - P-Chain transactions
- **[X-Chain Wallet Methods](/avalanche-sdk/client-sdk/methods/wallet-methods/x-chain-wallet)** - X-Chain transactions
- **[C-Chain Wallet Methods](/avalanche-sdk/client-sdk/methods/wallet-methods/c-chain-wallet)** - C-Chain transactions

## Common Operations

### Send AVAX on C-Chain

```typescript
import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";

const hash = await walletClient.send({
  to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  value: avaxToNanoAvax(0.001), // 0.001 AVAX
});

console.log("Transaction hash:", hash);
```

### P-Chain Wallet Operations

```typescript
// Prepare and send base transaction
const baseTxn = await walletClient.pChain.prepareBaseTxn({
  outputs: [
    {
      addresses: [account.getXPAddress("P")],
      amount: avaxToNanoAvax(0.00001),
    },
  ],
});

const txID = await walletClient.sendXPTransaction(baseTxn);
console.log("P-Chain transaction:", txID);
```

### X-Chain Wallet Operations

```typescript
// Prepare and send base transaction
const xChainTx = await walletClient.xChain.prepareBaseTxn({
  outputs: [
    {
      addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
      amount: avaxToNanoAvax(1), // 1 AVAX
    },
  ],
});

const txID = await walletClient.sendXPTransaction(xChainTx);
console.log("X-Chain transaction:", txID);
```

### Sign Messages

```typescript
// Sign XP message
const signedMessage = await walletClient.signXPMessage({
  message: "Hello Avalanche",
});

console.log("Signed message:", signedMessage);
```

### Wait for Transaction Confirmation

```typescript
try {
  await walletClient.waitForTxn({
    txID: "0x...",
    chainAlias: "P",
  });
  console.log("Transaction confirmed!");
} catch (error) {
  console.error("chain confirmation failed:", error);
}
```

## When to Use This Client

- ✅ Sending transactions
- ✅ Signing messages and transactions
- ✅ Cross-chain transfers
- ✅ Managing accounts
- ✅ All wallet operations

## Next Steps

- **[Wallet Methods Reference](/avalanche-sdk/client-sdk/methods/wallet-methods/wallet)** - Complete wallet method documentation
- **[P-Chain Wallet Methods](/avalanche-sdk/client-sdk/methods/wallet-methods/p-chain-wallet)** - P-Chain transaction operations
- **[X-Chain Wallet Methods](/avalanche-sdk/client-sdk/methods/wallet-methods/x-chain-wallet)** - X-Chain transaction operations
- **[C-Chain Wallet Methods](/avalanche-sdk/client-sdk/methods/wallet-methods/c-chain-wallet)** - C-Chain transaction operations
- **[Account Management](/avalanche-sdk/client-sdk/accounts)** - Account types and management

# P-Chain Client (/docs/tooling/avalanche-sdk/client/clients/p-chain-client)

---

## title: P-Chain Client

## Overview

The P-Chain (Platform Chain) Client provides an interface for interacting with Avalanche's Platform Chain, which is responsible for coordinating validators, managing subnets, creating blockchains, and handling staking operations.

**When to use:** Use the P-Chain Client for validator operations, staking, subnet management, and blockchain creation.

## Installation & Setup

For setup instructions, see the [Getting Started](/avalanche-sdk/client-sdk/getting-started) guide.

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

const pChainClient = client.pChain;
```

Or create a standalone P-Chain client:

```typescript
import { createPChainClient } from "@avalanche-sdk/client";

const pChainClient = createPChainClient({
  chain: avalanche,
  transport: { type: "http" },
});
```

## Available Methods

The P-Chain Client provides methods for:

- **Balance Operations**: `getBalance`, `getUTXOs`
- **Validator Operations**: `getCurrentValidators`, `getValidatorsAt`, `sampleValidators`, `getL1Validator`
- **Staking Operations**: `getStake`, `getTotalStake`, `getMinStake`
- **Subnet Operations**: `getSubnet`, `getSubnets`, `getStakingAssetID`
- **Blockchain Operations**: `getBlockchains`, `getBlockchainStatus`, `validatedBy`, `validates`
- **Block Operations**: `getHeight`, `getBlock`, `getBlockByHeight`, `getProposedHeight`, `getTimestamp`
- **Transaction Operations**: `getTx`, `getTxStatus`, `issueTx`
- **Fee Operations**: `getFeeConfig`, `getFeeState`
- **Supply Operations**: `getCurrentSupply`
- **Reward Operations**: `getRewardUTXOs`

For complete method documentation with signatures, parameters, and examples, see the [P-Chain Methods Reference](/avalanche-sdk/client-sdk/methods/public-methods/p-chain).

## Common Use Cases

### Query Validators

```typescript
// Get current validators
const validators = await client.pChain.getCurrentValidators({});

console.log("Total validators:", validators.validators.length);

// Get validators at specific height
const validatorsAt = await client.pChain.getValidatorsAt({
  height: 1000001,
  subnetID: "11111111111111111111111111111111LpoYY",
});
```

### Query Staking Information

```typescript
// Get minimum stake requirements
const minStake = await client.pChain.getMinStake({
  subnetID: "11111111111111111111111111111111LpoYY",
});

console.log("Min validator stake:", minStake.minValidatorStake);
console.log("Min delegator stake:", minStake.minDelegatorStake);

// Get total stake for a subnet
const totalStake = await client.pChain.getTotalStake({
  subnetID: "11111111111111111111111111111111LpoYY",
});

// Get stake for specific addresses
const stake = await client.pChain.getStake({
  addresses: ["P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"],
  subnetID: "11111111111111111111111111111111LpoYY",
});
```

### Query Subnet Information

```typescript
// Get subnet information
const subnet = await client.pChain.getSubnet({
  subnetID: "11111111111111111111111111111111LpoYY",
});

console.log("Is permissioned:", subnet.isPermissioned);
console.log("Control keys:", subnet.controlKeys);

// Get all blockchains in the network
const blockchains = await client.pChain.getBlockchains();

// Get blockchains validated by a subnet
const validatedBlockchains = await client.pChain.validates({
  subnetID: "11111111111111111111111111111111LpoYY",
});
```

### Query Balance and UTXOs

```typescript
// Get balance for addresses
const balance = await client.pChain.getBalance({
  addresses: ["P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"],
});

console.log("Total balance:", balance.balance);
console.log("Unlocked:", balance.unlocked);

// Get UTXOs
const utxos = await client.pChain.getUTXOs({
  addresses: ["P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"],
  limit: 100,
});
```

### Query Fee Information

```typescript
// Get fee configuration
const feeConfig = await client.pChain.getFeeConfig();
console.log("Fee weights:", feeConfig.weights);
console.log("Min price:", feeConfig.minPrice);

// Get current fee state
const feeState = await client.pChain.getFeeState();
console.log("Current fee price:", feeState.price);
console.log("Fee capacity:", feeState.capacity);
```

## Wallet Operations

For transaction operations (preparing and sending transactions), use the wallet client:

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = privateKeyToAvalancheAccount("0x...");
const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: { type: "http" },
});

// Prepare and send base transaction
const baseTxn = await walletClient.pChain.prepareBaseTxn({
  outputs: [
    {
      addresses: [account.getXPAddress("P")],
      amount: 0.00001,
    },
  ],
});

const txID = await walletClient.sendXPTransaction(baseTxn);
console.log("Transaction sent:", txID);
```

For complete wallet operations documentation, see [P-Chain Wallet Methods](/avalanche-sdk/client-sdk/methods/wallet-methods/p-chain-wallet).

## Next Steps

- **[P-Chain Methods Reference](/avalanche-sdk/client-sdk/methods/public-methods/p-chain)** - Complete method documentation
- **[P-Chain Wallet Methods](/avalanche-sdk/client-sdk/methods/wallet-methods/p-chain-wallet)** - Transaction preparation and signing
- **[Wallet Client](/avalanche-sdk/client-sdk/clients/wallet-client)** - Complete wallet operations
- **[X-Chain Client](/avalanche-sdk/client-sdk/clients/x-chain-client)** - Asset transfers
- **[C-Chain Client](/avalanche-sdk/client-sdk/clients/c-chain-client)** - EVM operations

# X-Chain Client (/docs/tooling/avalanche-sdk/client/clients/x-chain-client)

---

## title: X-Chain Client

## Overview

The X-Chain (Exchange Chain) Client provides an interface for interacting with Avalanche's Exchange Chain, which handles asset creation, trading, transfers, and UTXO management.

**When to use:** Use the X-Chain Client for asset operations, UTXO management, and X-Chain transaction queries.

## Installation & Setup

For setup instructions, see the [Getting Started](/avalanche-sdk/client-sdk/getting-started) guide.

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

const xChainClient = client.xChain;
```

Or create a standalone X-Chain client:

```typescript
import { createXChainClient } from "@avalanche-sdk/client";

const xChainClient = createXChainClient({
  chain: avalanche,
  transport: { type: "http" },
});
```

## Available Methods

The X-Chain Client provides methods for:

- **Balance Operations**: `getBalance`, `getAllBalances`
- **Asset Operations**: `getAssetDescription`, `buildGenesis`
- **UTXO Operations**: `getUTXOs`
- **Block Operations**: `getHeight`, `getBlock`, `getBlockByHeight`
- **Transaction Operations**: `getTx`, `getTxStatus`, `getTxFee`, `issueTx`

For complete method documentation with signatures, parameters, and examples, see the [X-Chain Methods Reference](/avalanche-sdk/client-sdk/methods/public-methods/x-chain).

## Common Use Cases

### Query Balances

```typescript
// Get balance for specific asset
const balance = await client.xChain.getBalance({
  addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
  assetID: "AVAX",
});

console.log("Balance:", balance.balance);

// Get all balances for all assets
const allBalances = await client.xChain.getAllBalances({
  addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
});

console.log("All balances:", allBalances.balances);
```

### Query Asset Information

```typescript
// Get asset description
const asset = await client.xChain.getAssetDescription({
  assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
});

console.log("Asset name:", asset.name);
console.log("Asset symbol:", asset.symbol);
console.log("Denomination:", asset.denomination);
```

### Query UTXOs

```typescript
// Get UTXOs for address
const utxos = await client.xChain.getUTXOs({
  addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
  sourceChain: "P", // Optional: specify source chain
  limit: 100,
});

console.log("Number of UTXOs:", utxos.utxos.length);

// Paginate through UTXOs if needed
if (utxos.endIndex) {
  const moreUtxos = await client.xChain.getUTXOs({
    addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
    startIndex: utxos.endIndex,
    limit: 100,
  });
}
```

### Query Transaction Information

```typescript
// Get transaction
const tx = await client.xChain.getTx({
  txID: "11111111111111111111111111111111LpoYY",
  encoding: "hex",
});

// Get transaction status
const status = await client.xChain.getTxStatus({
  txID: "11111111111111111111111111111111LpoYY",
});

console.log("Transaction status:", status.status);

// Get transaction fees
const txFee = await client.xChain.getTxFee();
console.log("Transaction fee:", txFee.txFee);
console.log("Create asset fee:", txFee.createAssetTxFee);
```

### Query Block Information

```typescript
// Get current height
const height = await client.xChain.getHeight();
console.log("Current X-Chain height:", height);

// Get block by height
const block = await client.xChain.getBlockByHeight({
  height: Number(height),
  encoding: "hex",
});

// Get block by ID
const blockById = await client.xChain.getBlock({
  blockID: "d7WYmb8VeZNHsny3EJCwMm6QA37s1EHwMxw1Y71V3FqPZ5EFG",
  encoding: "hex",
});
```

## Wallet Operations

For transaction operations (preparing and sending transactions), use the wallet client:

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = privateKeyToAvalancheAccount("0x...");
const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: { type: "http" },
});

// Prepare and send base transaction
const baseTxn = await walletClient.xChain.prepareBaseTxn({
  outputs: [
    {
      addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
      amount: 1, // 1 AVAX
    },
  ],
});

const txID = await walletClient.sendXPTransaction(baseTxn);
console.log("Transaction sent:", txID);
```

For complete wallet operations documentation, see [X-Chain Wallet Methods](/avalanche-sdk/client-sdk/methods/wallet-methods/x-chain-wallet).

## Next Steps

- **[X-Chain Methods Reference](/avalanche-sdk/client-sdk/methods/public-methods/x-chain)** - Complete method documentation
- **[X-Chain Wallet Methods](/avalanche-sdk/client-sdk/methods/wallet-methods/x-chain-wallet)** - Transaction preparation and signing
- **[Wallet Client](/avalanche-sdk/client-sdk/clients/wallet-client)** - Complete wallet operations
- **[P-Chain Client](/avalanche-sdk/client-sdk/clients/p-chain-client)** - Validator and staking operations
- **[C-Chain Client](/avalanche-sdk/client-sdk/clients/c-chain-client)** - EVM operations

# C-Chain Client (/docs/tooling/avalanche-sdk/client/clients/c-chain-client)

---

## title: C-Chain Client

## Overview

The C-Chain (Contract Chain) Client provides an interface for interacting with Avalanche's Contract Chain, which is an instance of the Ethereum Virtual Machine (EVM) with additional Avalanche-specific features like cross-chain atomic transactions.

**When to use:** Use the C-Chain Client for EVM operations and atomic transactions (cross-chain transfers).

## Installation & Setup

For setup instructions, see the [Getting Started](/avalanche-sdk/client-sdk/getting-started) guide.

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

const cChainClient = client.cChain;
```

Or create a standalone C-Chain client:

```typescript
import { createCChainClient } from "@avalanche-sdk/client";

const cChainClient = createCChainClient({
  chain: avalanche,
  transport: { type: "http" },
});
```

## Available Methods

The C-Chain Client provides methods for:

- **Atomic Transaction Operations**: `getAtomicTx`, `getAtomicTxStatus`
- **UTXO Operations**: `getUTXOs`
- **Transaction Operations**: `issueTx`

Additionally, the C-Chain Client extends viem's Public Client, providing access to all standard EVM actions such as `getBalance`, `getBlock`, `readContract`, `call`, and more.

For complete method documentation with signatures, parameters, and examples, see the [C-Chain Methods Reference](/avalanche-sdk/client-sdk/methods/public-methods/c-chain).

## Common Use Cases

### Query Atomic Transactions

```typescript
// Get atomic transaction details
const atomicTx = await client.cChain.getAtomicTx({
  txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
});

console.log("Source chain:", atomicTx.sourceChain);
console.log("Destination chain:", atomicTx.destinationChain);
console.log("Transfers:", atomicTx.transfers);

// Get atomic transaction status
const status = await client.cChain.getAtomicTxStatus({
  txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
});

console.log("Status:", status.status);
```

### Query UTXOs

```typescript
// Get UTXOs for C-Chain addresses
const utxos = await client.cChain.getUTXOs({
  addresses: ["0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"],
  limit: 100,
});

console.log("Number of UTXOs:", utxos.utxos.length);
```

## Using viem Actions

The C-Chain Client extends viem's Public Client, so you have access to all standard EVM actions:

```typescript
// Get EVM balance
const balance = await client.getBalance({
  address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
});

// Get transaction receipt
const receipt = await client.getTransactionReceipt({
  hash: "0x...",
});

// Get block number
const blockNumber = await client.getBlockNumber();

// Read smart contract
const result = await client.readContract({
  address: "0x...",
  abi: contractABI,
  functionName: "balanceOf",
  args: ["0x..."],
});

// Get block information
const block = await client.getBlock({
  blockNumber: blockNumber,
});
```

See the [viem documentation](https://viem.sh/docs/getting-started) for all available EVM actions.

## Wallet Operations

For transaction operations (sending transactions, writing contracts), use the wallet client:

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { parseEther } from "@avalanche-sdk/client/utils";

const account = privateKeyToAvalancheAccount("0x...");
const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: { type: "http" },
});

// Send AVAX
const txHash = await walletClient.send({
  to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  value: parseEther("0.001"),
});

console.log("Transaction hash:", txHash);
```

### Cross-Chain Operations

```typescript
// Export from C-Chain to P-Chain
const exportTx = await walletClient.cChain.prepareExportTxn({
  destinationChain: "P",
  to: account.getXPAddress("P"),
  amount: "0.001",
});

const exportTxHash = await walletClient.sendXPTransaction(exportTx);
console.log("Export transaction:", exportTxHash);

// Import to C-Chain from P-Chain
const importTx = await walletClient.cChain.prepareImportTxn({
  to: account.getEVMAddress(),
  amount: "0.001",
  sourceChain: "P",
});

const importTxHash = await walletClient.sendXPTransaction(importTx);
console.log("Import transaction:", importTxHash);
```

For complete wallet operations documentation, see [C-Chain Wallet Methods](/avalanche-sdk/client-sdk/methods/wallet-methods/c-chain-wallet).

## Next Steps

- **[C-Chain Methods Reference](/avalanche-sdk/client-sdk/methods/public-methods/c-chain)** - Complete method documentation
- **[C-Chain Wallet Methods](/avalanche-sdk/client-sdk/methods/wallet-methods/c-chain-wallet)** - Transaction preparation and sending
- **[Wallet Client](/avalanche-sdk/client-sdk/clients/wallet-client)** - Complete wallet operations
- **[P-Chain Client](/avalanche-sdk/client-sdk/clients/p-chain-client)** - Validator operations
- **[X-Chain Client](/avalanche-sdk/client-sdk/clients/x-chain-client)** - Asset operations

# API Clients (/docs/tooling/avalanche-sdk/client/clients/api-clients)

---

## title: API Clients

## Overview

API clients provide access to node-level operations. They're included with the main Avalanche Client and handle administrative tasks, node information, health monitoring, and indexed blockchain queries.

## Accessing from Avalanche Client

All API clients are available on the main Avalanche Client:

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

// Admin API - Node configuration and profiling
const admin = client.admin;

// Info API - Node and network information
const info = client.info;

// Health API - Node health monitoring
const health = client.health;

// ProposerVM API - ProposerVM operations per chain
const proposervmPChain = client.proposerVM.pChain;
const proposervmXChain = client.proposerVM.xChain;
const proposervmCChain = client.proposerVM.cChain;

// Index API - Indexed blockchain queries
const indexPChainBlock = client.indexBlock.pChain;
const indexCChainBlock = client.indexBlock.cChain;
const indexXChainBlock = client.indexBlock.xChain;
const indexXChainTx = client.indexTx.xChain;
```

## Admin API Client

Node configuration, aliases, logging, and profiling.

### From Avalanche Client

```typescript
const admin = client.admin;

// Example: Set logger level
await admin.setLoggerLevel({
  loggerName: "C",
  logLevel: "DEBUG",
});
```

### Create Standalone Client

```typescript
import { createAdminApiClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const adminClient = createAdminApiClient({
  chain: avalanche,
  transport: {
    type: "http",
    url: "https://api.avax.network/ext/admin",
  },
});

await adminClient.alias({
  endpoint: "bc/X",
  alias: "myAlias",
});
```

[View all Admin API methods →](methods/public-methods/api#admin-api-client)

## Info API Client

Node and network information, statistics, and status.

### From Avalanche Client

```typescript
const info = client.info;

// Example: Get network info
const networkID = await info.getNetworkID();
const version = await info.getNodeVersion();
```

### Create Standalone Client

```typescript
import { createInfoApiClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const infoClient = createInfoApiClient({
  chain: avalanche,
  transport: { type: "http" },
});

const networkID = await infoClient.getNetworkID();
const version = await infoClient.getNodeVersion();
```

[View all Info API methods →](methods/public-methods/api#info-api-client)

## Health API Client

Node health monitoring and status checks.

### From Avalanche Client

```typescript
const health = client.health;

// Example: Check node health
const status = await health.health({});
const isAlive = await health.liveness();
```

### Create Standalone Client

```typescript
import { createHealthApiClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const healthClient = createHealthApiClient({
  chain: avalanche,
  transport: { type: "http" },
});

const health = await healthClient.health({});
const liveness = await healthClient.liveness();
```

[View all Health API methods →](methods/public-methods/api#health-api-client)

## ProposerVM API Client

ProposerVM operations for each chain.

### From Avalanche Client

```typescript
// Access ProposerVM for each chain
const proposervmPChain = client.proposerVM.pChain;
const proposervmXChain = client.proposerVM.xChain;
const proposervmCChain = client.proposerVM.cChain;
```

### Create Standalone Client

```typescript
import { createProposervmApiClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

// P-Chain ProposerVM
const proposervmPChain = createProposervmApiClient({
  chain: avalanche,
  transport: { type: "http" },
  clientType: "proposervmPChain",
});

// X-Chain ProposerVM
const proposervmXChain = createProposervmApiClient({
  chain: avalanche,
  transport: { type: "http" },
  clientType: "proposervmXChain",
});

// C-Chain ProposerVM
const proposervmCChain = createProposervmApiClient({
  chain: avalanche,
  transport: { type: "http" },
  clientType: "proposervmCChain",
});

// Example: Get proposed height
const pChainHeight = await proposervmPChain.getProposedHeight();
```

## Index API Clients

Fast indexed queries for blockchain data.

### From Avalanche Client

```typescript
// Block indexes
const indexPChainBlock = client.indexBlock.pChain;
const indexCChainBlock = client.indexBlock.cChain;
const indexXChainBlock = client.indexBlock.xChain;

// Transaction index
const indexXChainTx = client.indexTx.xChain;

// Example: Get last accepted block
const lastBlock = await indexPChainBlock.getLastAccepted({
  encoding: "hex",
});
```

### Create Standalone Client

```typescript
import { createIndexApiClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

// P-Chain block index
const indexPChainBlock = createIndexApiClient({
  chain: avalanche,
  transport: { type: "http" },
  clientType: "indexPChainBlock",
});

// C-Chain block index
const indexCChainBlock = createIndexApiClient({
  chain: avalanche,
  transport: { type: "http" },
  clientType: "indexCChainBlock",
});

// X-Chain block index
const indexXChainBlock = createIndexApiClient({
  chain: avalanche,
  transport: { type: "http" },
  clientType: "indexXChainBlock",
});

// X-Chain transaction index
const indexXChainTx = createIndexApiClient({
  chain: avalanche,
  transport: { type: "http" },
  clientType: "indexXChainTx",
});

// Example: Get container by index
const block = await indexPChainBlock.getContainerByIndex({
  index: 12345,
  encoding: "hex",
});
```

[View all Index API methods →](methods/public-methods/api#index-api-clients)

## Quick Examples

### Node Health Check

```typescript
const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

const health = await client.health.health({});
const liveness = await client.health.liveness();
console.log("Node healthy:", health.healthy);
```

### Get Node Information

```typescript
const version = await client.info.getNodeVersion();
const networkID = await client.info.getNetworkID();
const nodeID = await client.info.getNodeID();
console.log(`Node ${nodeID.nodeID} v${version} on network ${networkID}`);
```

### Query Indexed Blocks

```typescript
const lastBlock = await client.indexBlock.pChain.getLastAccepted({
  encoding: "hex",
});

const block = await client.indexBlock.cChain.getContainerByIndex({
  index: 12345,
  encoding: "hex",
});
```

## When to Use

- **Admin API**: Node configuration, profiling, logging (requires admin access)
- **Info API**: Node and network information
- **Health API**: Health monitoring and status checks
- **Index API**: Fast indexed queries for blocks and transactions
- **ProposerVM API**: ProposerVM operations per chain

<Callout>
  **Note:** Admin API operations require administrative access and may not be
  available on public endpoints.
</Callout>

## Next Steps

- **[API Methods Reference](methods/public-methods/api)** - Complete method documentation
- **[Avalanche Client](clients/avalanche-client)** - Main client operations
- **[Wallet Client](clients/wallet-client)** - Transaction operations

# Public Methods (/docs/tooling/avalanche-sdk/client/methods/public-methods/public)

---

title: Public Methods
description: Complete reference for Avalanche-specific public client methods

---

## Overview

The Avalanche Client extends viem's Public Client with Avalanche-specific methods for querying fee information, chain configuration, and active rules. These methods are available on both the main Avalanche Client and the C-Chain client.

## Fee Operations

### baseFee

Get the base fee for the next block on the C-Chain.

**Function Signature:**

```typescript
function baseFee(): Promise<string>;
```

**Parameters:**

No parameters required.

**Returns:**

| Type     | Description                                                    |
| -------- | -------------------------------------------------------------- |
| `string` | Base fee for the next block as hex string (e.g., "0x3b9aca00") |

**Example:**

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

const baseFee = await client.baseFee();
console.log("Base fee:", baseFee); // "0x3b9aca00"
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/c-chain#eth_basefee)
- [maxPriorityFeePerGas](#maxpriorityfeepergas) - Get max priority fee per gas

---

### maxPriorityFeePerGas

Get the maximum priority fee per gas for the next block.

**Function Signature:**

```typescript
function maxPriorityFeePerGas(): Promise<string>;
```

**Parameters:**

No parameters required.

**Returns:**

| Type     | Description                                                     |
| -------- | --------------------------------------------------------------- |
| `string` | Maximum priority fee per gas as hex string (e.g., "0x3b9aca00") |

**Example:**

```typescript
const maxPriorityFee = await client.maxPriorityFeePerGas();
console.log("Max priority fee per gas:", maxPriorityFee);

// Use in EIP-1559 transaction
const txHash = await walletClient.sendTransaction({
  to: "0x...",
  value: avaxToWei(1),
  maxFeePerGas: baseFee + maxPriorityFee,
  maxPriorityFeePerGas: maxPriorityFee,
});
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/c-chain#eth_maxpriorityfeepergas)
- [baseFee](#basefee) - Get base fee

---

### feeConfig

Get the fee configuration for a specific block. Returns fee settings and when they were last changed.

**Function Signature:**

```typescript
function feeConfig(params: FeeConfigParameters): Promise<FeeConfigReturnType>;

interface FeeConfigParameters {
  blk?: string; // Block number or hash, defaults to "latest"
}

interface FeeConfigReturnType {
  feeConfig: {
    [key: string]: string;
  };
  lastChangedAt: string;
}
```

**Parameters:**

| Name  | Type     | Required | Description                                             |
| ----- | -------- | -------- | ------------------------------------------------------- |
| `blk` | `string` | No       | Block number or hash (hex string), defaults to "latest" |

**Returns:**

| Type                  | Description              |
| --------------------- | ------------------------ |
| `FeeConfigReturnType` | Fee configuration object |

**Return Object:**

| Property        | Type     | Description                                |
| --------------- | -------- | ------------------------------------------ |
| `feeConfig`     | `object` | Fee configuration key-value pairs          |
| `lastChangedAt` | `string` | Timestamp when fee config was last changed |

**Example:**

```typescript
// Get fee config for latest block
const feeConfig = await client.feeConfig({});
console.log("Fee config:", feeConfig.feeConfig);
console.log("Last changed:", feeConfig.lastChangedAt);

// Get fee config for specific block
const blockFeeConfig = await client.feeConfig({ blk: "0x123456" });
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/subnet-evm#eth_feeconfig)
- [baseFee](#basefee) - Get base fee

---

## Chain Configuration

### getChainConfig

Get the chain configuration for the C-Chain, including fork blocks and Avalanche-specific upgrade timestamps.

**Function Signature:**

```typescript
function getChainConfig(): Promise<GetChainConfigReturnType>;

interface GetChainConfigReturnType {
  chainId: number;
  homesteadBlock: number;
  daoForkBlock: number;
  daoForkSupport: boolean;
  eip150Block: number;
  eip150Hash: string;
  eip155Block: number;
  eip158Block: number;
  byzantiumBlock: number;
  constantinopleBlock: number;
  petersburgBlock: number;
  istanbulBlock: number;
  muirGlacierBlock: number;
  apricotPhase1BlockTimestamp: number;
  apricotPhase2BlockTimestamp: number;
  apricotPhase3BlockTimestamp: number;
  apricotPhase4BlockTimestamp: number;
  apricotPhase5BlockTimestamp: number;
}
```

**Parameters:**

No parameters required.

**Returns:**

| Type                       | Description                |
| -------------------------- | -------------------------- |
| `GetChainConfigReturnType` | Chain configuration object |

**Return Object:**

| Property                      | Type      | Description                       |
| ----------------------------- | --------- | --------------------------------- |
| `chainId`                     | `number`  | Chain ID                          |
| `homesteadBlock`              | `number`  | Homestead fork block              |
| `daoForkBlock`                | `number`  | DAO fork block                    |
| `daoForkSupport`              | `boolean` | DAO fork support flag             |
| `eip150Block`                 | `number`  | EIP-150 fork block                |
| `eip150Hash`                  | `string`  | EIP-150 fork hash                 |
| `eip155Block`                 | `number`  | EIP-155 fork block                |
| `eip158Block`                 | `number`  | EIP-158 fork block                |
| `byzantiumBlock`              | `number`  | Byzantium fork block              |
| `constantinopleBlock`         | `number`  | Constantinople fork block         |
| `petersburgBlock`             | `number`  | Petersburg fork block             |
| `istanbulBlock`               | `number`  | Istanbul fork block               |
| `muirGlacierBlock`            | `number`  | Muir Glacier fork block           |
| `apricotPhase1BlockTimestamp` | `number`  | Apricot Phase 1 upgrade timestamp |
| `apricotPhase2BlockTimestamp` | `number`  | Apricot Phase 2 upgrade timestamp |
| `apricotPhase3BlockTimestamp` | `number`  | Apricot Phase 3 upgrade timestamp |
| `apricotPhase4BlockTimestamp` | `number`  | Apricot Phase 4 upgrade timestamp |
| `apricotPhase5BlockTimestamp` | `number`  | Apricot Phase 5 upgrade timestamp |

**Example:**

```typescript
const chainConfig = await client.getChainConfig();
console.log("Chain ID:", chainConfig.chainId);
console.log("Apricot Phase 1:", chainConfig.apricotPhase1BlockTimestamp);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/c-chain#eth_getchainconfig)

---

## Active Rules

### getActiveRulesAt

Get the active rules (EIPs, precompiles) at a specific timestamp. Useful for determining which features are enabled at a given time.

**Function Signature:**

```typescript
function getActiveRulesAt(
  params: GetActiveRulesAtParameters,
): Promise<GetActiveRulesAtReturnType>;

interface GetActiveRulesAtParameters {
  timestamp: string; // Unix timestamp as hex string or "latest"
}

interface GetActiveRulesAtReturnType {
  ethRules: Map<string, true>;
  avalancheRules: Map<string, true>;
  precompiles: Map<string, object>;
}
```

**Parameters:**

| Name        | Type     | Required | Description                                                     |
| ----------- | -------- | -------- | --------------------------------------------------------------- |
| `timestamp` | `string` | Yes      | Unix timestamp as hex string (e.g., "0x1234567890") or "latest" |

**Returns:**

| Type                         | Description         |
| ---------------------------- | ------------------- |
| `GetActiveRulesAtReturnType` | Active rules object |

**Return Object:**

| Property         | Type                  | Description                                  |
| ---------------- | --------------------- | -------------------------------------------- |
| `ethRules`       | `Map<string, true>`   | Active Ethereum rules (EIPs)                 |
| `avalancheRules` | `Map<string, true>`   | Active Avalanche-specific rules              |
| `precompiles`    | `Map<string, object>` | Active precompiles with their configurations |

**Example:**

```typescript
// Get active rules at current time
const activeRules = await client.getActiveRulesAt({
  timestamp: "latest",
});

console.log("Ethereum rules:", Array.from(activeRules.ethRules.keys()));
console.log("Avalanche rules:", Array.from(activeRules.avalancheRules.keys()));
console.log("Precompiles:", Array.from(activeRules.precompiles.keys()));

// Get active rules at specific timestamp
const historicalRules = await client.getActiveRulesAt({
  timestamp: "0x1234567890",
});
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/subnet-evm#eth_getactiverulesat)

---

## Viem Integration

The Avalanche Client extends viem's Public Client, providing access to all standard Ethereum RPC methods. For complete method reference, see:

- **[viem Documentation](https://viem.sh/docs)** - Complete EVM method reference
- **[viem Actions](https://viem.sh/docs/actions/public)** - Public client actions
- **[viem Utilities](https://viem.sh/docs/utilities)** - Utility functions

## Next Steps

- **[C-Chain Methods](c-chain)** - C-Chain-specific methods
- **[Wallet Client](../clients/wallet-client)** - Transaction operations
- **[Account Management](../../accounts)** - Account types and management

# C-Chain Methods (/docs/tooling/avalanche-sdk/client/methods/public-methods/c-chain)

---

title: C-Chain Methods
description: Complete reference for C-Chain (Contract Chain) methods and EVM compatibility

---

## Overview

The C-Chain (Contract Chain) is Avalanche's instance of the Ethereum Virtual Machine (EVM), providing full Ethereum compatibility with additional Avalanche-specific features like cross-chain atomic transactions and UTXO management.

**Note:** The Avalanche Client SDK fully extends [viem](https://viem.sh), meaning all standard EVM methods are also available. See the [viem documentation](https://viem.sh/docs) for complete EVM method reference.

## Atomic Transaction Operations

### getAtomicTx

Get an atomic transaction by its ID. Atomic transactions enable cross-chain transfers between the C-Chain and other Avalanche chains (P-Chain, X-Chain).

**Function Signature:**

```typescript
function getAtomicTx(
  params: GetAtomicTxParameters,
): Promise<GetAtomicTxReturnType>;

interface GetAtomicTxParameters {
  txID: string;
  encoding?: "hex";
}

interface GetAtomicTxReturnType {
  tx: string;
  blockHeight: string;
  encoding: "hex";
}
```

**Parameters:**

| Name       | Type     | Required | Description                                             |
| ---------- | -------- | -------- | ------------------------------------------------------- |
| `txID`     | `string` | Yes      | Transaction ID in CB58 format                           |
| `encoding` | `"hex"`  | No       | Encoding format for the transaction (defaults to "hex") |

**Returns:**

| Type                    | Description               |
| ----------------------- | ------------------------- |
| `GetAtomicTxReturnType` | Atomic transaction object |

**Return Object:**

| Property      | Type     | Description                                    |
| ------------- | -------- | ---------------------------------------------- |
| `tx`          | `string` | Transaction bytes in hex format                |
| `blockHeight` | `string` | Height of the block containing the transaction |
| `encoding`    | `"hex"`  | Encoding format used                           |

**Example:**

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

const atomicTx = await client.cChain.getAtomicTx({
  txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
});

console.log("Transaction:", atomicTx.tx);
console.log("Block height:", atomicTx.blockHeight);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/c-chain#avaxgetatomictx)
- [getAtomicTxStatus](#getatomictxstatus) - Get transaction status

---

### getAtomicTxStatus

Get the status of an atomic transaction. Returns the current processing state and block information.

**Function Signature:**

```typescript
function getAtomicTxStatus(
  params: GetAtomicTxStatusParameters,
): Promise<GetAtomicTxStatusReturnType>;

interface GetAtomicTxStatusParameters {
  txID: string;
}

interface GetAtomicTxStatusReturnType {
  status: CChainAtomicTxStatus;
  blockHeight: string;
}

type CChainAtomicTxStatus = "Accepted" | "Processing" | "Dropped" | "Unknown";
```

**Parameters:**

| Name   | Type     | Required | Description                   |
| ------ | -------- | -------- | ----------------------------- |
| `txID` | `string` | Yes      | Transaction ID in CB58 format |

**Returns:**

| Type                          | Description               |
| ----------------------------- | ------------------------- |
| `GetAtomicTxStatusReturnType` | Transaction status object |

**Return Object:**

| Property      | Type                   | Description                                                           |
| ------------- | ---------------------- | --------------------------------------------------------------------- |
| `status`      | `CChainAtomicTxStatus` | Transaction status: "Accepted", "Processing", "Dropped", or "Unknown" |
| `blockHeight` | `string`               | Height of the block containing the transaction (if accepted)          |

**Status Values:**

- **Accepted**: Transaction is (or will be) accepted by every node
- **Processing**: Transaction is being voted on by this node
- **Dropped**: Transaction was dropped by this node because it thought the transaction invalid
- **Unknown**: Transaction hasn't been seen by this node

**Example:**

```typescript
const status = await client.cChain.getAtomicTxStatus({
  txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
});

console.log("Status:", status.status);
if (status.status === "Accepted") {
  console.log("Block height:", status.blockHeight);
}
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/c-chain#avaxgetatomictxstatus)
- [getAtomicTx](#getatomictx) - Get transaction details

---

## UTXO Operations

### getUTXOs

Get the UTXOs (Unspent Transaction Outputs) for a set of addresses. UTXOs represent unspent native AVAX on the C-Chain from imported transactions.

**Function Signature:**

```typescript
function getUTXOs(params: GetUTXOsParameters): Promise<GetUTXOsReturnType>;

interface GetUTXOsParameters {
  addresses: string[];
  limit?: number;
  startIndex?: {
    address: string;
    utxo: string;
  };
  sourceChain?: string;
  encoding?: "hex";
}

interface GetUTXOsReturnType {
  numFetched: number;
  utxos: string[];
  endIndex: {
    address: string;
    utxo: string;
  };
}
```

**Parameters:**

| Name          | Type                                | Required | Description                                  |
| ------------- | ----------------------------------- | -------- | -------------------------------------------- |
| `addresses`   | `string[]`                          | Yes      | Array of C-Chain addresses                   |
| `limit`       | `number`                            | No       | Maximum number of UTXOs to return (max 1024) |
| `startIndex`  | `{ address: string; utxo: string }` | No       | Pagination cursor for next page              |
| `sourceChain` | `string`                            | No       | Source chain ID for filtering UTXOs          |
| `encoding`    | `"hex"`                             | No       | Encoding format for returned UTXOs           |

**Returns:**

| Type                 | Description               |
| -------------------- | ------------------------- |
| `GetUTXOsReturnType` | UTXO data with pagination |

**Return Object:**

| Property     | Type                                | Description                              |
| ------------ | ----------------------------------- | ---------------------------------------- |
| `numFetched` | `number`                            | Number of UTXOs fetched in this response |
| `utxos`      | `string[]`                          | Array of UTXO bytes (hex encoded)        |
| `endIndex`   | `{ address: string; utxo: string }` | Pagination cursor for fetching next page |

**Example:**

```typescript
// Get UTXOs from X-Chain
const utxos = await client.cChain.getUTXOs({
  addresses: ["0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"],
  limit: 100,
  sourceChain: "X",
});

console.log("Number of UTXOs:", utxos.numFetched);
console.log("UTXOs:", utxos.utxos);

// Get next page if needed
if (utxos.endIndex) {
  const moreUTXOs = await client.cChain.getUTXOs({
    addresses: ["0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"],
    startIndex: utxos.endIndex,
    limit: 100,
  });
}
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/c-chain#avaxgetutxos)
- [C-Chain Wallet Methods](../wallet-methods/c-chain-wallet) - Atomic transaction operations

---

## Transaction Operations

### issueTx

Issue a transaction to the C-Chain. Submits a signed transaction for processing.

**Function Signature:**

```typescript
function issueTx(params: IssueTxParameters): Promise<IssueTxReturnType>;

interface IssueTxParameters {
  tx: string;
  encoding: "hex";
}

interface IssueTxReturnType {
  txID: string;
}
```

**Parameters:**

| Name       | Type     | Required | Description                     |
| ---------- | -------- | -------- | ------------------------------- |
| `tx`       | `string` | Yes      | Transaction bytes in hex format |
| `encoding` | `"hex"`  | Yes      | Encoding format (must be "hex") |

**Returns:**

| Type                | Description           |
| ------------------- | --------------------- |
| `IssueTxReturnType` | Transaction ID object |

**Return Object:**

| Property | Type     | Description                   |
| -------- | -------- | ----------------------------- |
| `txID`   | `string` | Transaction ID in CB58 format |

**Example:**

```typescript
const txID = await client.cChain.issueTx({
  tx: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0...",
  encoding: "hex",
});

console.log("Transaction ID:", txID.txID);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/c-chain#avaxissuetx)

---

## Admin Operations

These methods are available for node administration and debugging. They require admin access to the node.

### setLogLevel

Set the log level for the C-Chain node.

**Function Signature:**

```typescript
function setLogLevel(params: SetLogLevelParameters): Promise<void>;

interface SetLogLevelParameters {
  level: string;
}
```

**Parameters:**

| Name    | Type     | Required | Description                                        |
| ------- | -------- | -------- | -------------------------------------------------- |
| `level` | `string` | Yes      | Log level (e.g., "debug", "info", "warn", "error") |

**Returns:**

| Type   | Description                            |
| ------ | -------------------------------------- |
| `void` | Promise resolves when log level is set |

**Example:**

```typescript
await client.cChain.setLogLevel({
  level: "info",
});
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/c-chain#adminsetloglevel)

---

### startCPUProfiler

Start the CPU profiler for performance analysis.

**Function Signature:**

```typescript
function startCPUProfiler(): Promise<void>;
```

**Parameters:**

No parameters required.

**Returns:**

| Type   | Description                               |
| ------ | ----------------------------------------- |
| `void` | Promise resolves when profiler is started |

**Example:**

```typescript
await client.cChain.startCPUProfiler();
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/c-chain#adminstartcpuprofiler)
- [stopCPUProfiler](#stopcpuprofiler) - Stop the CPU profiler

---

### stopCPUProfiler

Stop the CPU profiler.

**Function Signature:**

```typescript
function stopCPUProfiler(): Promise<void>;
```

**Parameters:**

No parameters required.

**Returns:**

| Type   | Description                               |
| ------ | ----------------------------------------- |
| `void` | Promise resolves when profiler is stopped |

**Example:**

```typescript
await client.cChain.stopCPUProfiler();
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/c-chain#adminstopcpuprofiler)
- [startCPUProfiler](#startcpuprofiler) - Start the CPU profiler

---

### memoryProfile

Get the memory profile of the C-Chain node.

**Function Signature:**

```typescript
function memoryProfile(): Promise<void>;
```

**Parameters:**

No parameters required.

**Returns:**

| Type   | Description                                       |
| ------ | ------------------------------------------------- |
| `void` | Promise resolves when memory profile is retrieved |

**Example:**

```typescript
await client.cChain.memoryProfile();
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/c-chain#adminmemoryprofile)

---

### lockProfile

Lock the profile to prevent modifications.

**Function Signature:**

```typescript
function lockProfile(): Promise<void>;
```

**Parameters:**

No parameters required.

**Returns:**

| Type   | Description                             |
| ------ | --------------------------------------- |
| `void` | Promise resolves when profile is locked |

**Example:**

```typescript
await client.cChain.lockProfile();
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/c-chain#adminlockprofile)

---

## Standard EVM Methods

The C-Chain client extends viem's Public Client, providing access to all standard Ethereum methods. Here are some commonly used methods:

### Block Operations

```typescript
// Get block number
const blockNumber = await client.getBlockNumber();

// Get block by number
const block = await client.getBlock({
  blockNumber: 12345n,
});

// Get block by hash
const blockByHash = await client.getBlock({
  blockHash: "0x...",
});
```

### Balance Operations

```typescript
// Get balance
const balance = await client.getBalance({
  address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
});

// Get balance with block number
const balanceAtBlock = await client.getBalance({
  address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  blockNumber: 12345n,
});
```

### Transaction Operations

```typescript
// Get transaction
const tx = await client.getTransaction({
  hash: "0x...",
});

// Get transaction receipt
const receipt = await client.getTransactionReceipt({
  hash: "0x...",
});

// Get transaction count (nonce)
const nonce = await client.getTransactionCount({
  address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
});
```

### Gas Operations

```typescript
// Get gas price
const gasPrice = await client.getGasPrice();

// Get max priority fee per gas
const maxPriorityFee = await client.maxPriorityFeePerGas();

// Estimate gas
const estimatedGas = await client.estimateGas({
  to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  value: parseEther("0.001"),
});
```

### Contract Operations

```typescript
// Read contract
const result = await client.readContract({
  address: "0x...",
  abi: [...],
  functionName: "balanceOf",
  args: [address],
});

// Simulate contract
const { request } = await client.simulateContract({
  address: "0x...",
  abi: [...],
  functionName: "transfer",
  args: [to, amount],
});
```

**For complete EVM method reference, see:** [Viem Documentation](https://viem.sh/docs)

---

## Next Steps

- **[C-Chain Wallet Methods](../wallet-methods/c-chain-wallet)** - Atomic transaction operations
- **[Wallet Client](../../clients/wallet-client)** - Complete wallet operations
- **[Account Management](../../accounts)** - Account types and management
- **[Viem Documentation](https://viem.sh/docs)** - Complete EVM method reference

# P-Chain Methods (/docs/tooling/avalanche-sdk/client/methods/public-methods/p-chain)

---

title: P-Chain Methods
description: Complete reference for P-Chain (Platform Chain) methods

---

## Overview

The P-Chain (Platform Chain) is Avalanche's coordinating chain responsible for managing validators, delegators, subnets, and blockchains. This reference covers all read-only P-Chain operations available through the Avalanche Client SDK.

## Balance Operations

### getBalance

Get the balance of AVAX controlled by a given address.

**Function Signature:**

```typescript
function getBalance(
  params: GetBalanceParameters,
): Promise<GetBalanceReturnType>;

interface GetBalanceParameters {
  addresses: string[];
}

interface GetBalanceReturnType {
  balance: bigint;
  unlocked: bigint;
  lockedStakeable: bigint;
  lockedNotStakeable: bigint;
  utxoIDs: {
    txID: string;
    outputIndex: number;
  }[];
}
```

**Parameters:**

| Name        | Type       | Required | Description                         |
| ----------- | ---------- | -------- | ----------------------------------- |
| `addresses` | `string[]` | Yes      | Array of P-Chain addresses to query |

**Returns:**

| Type                   | Description                |
| ---------------------- | -------------------------- |
| `GetBalanceReturnType` | Balance information object |

**Return Object:**

| Property             | Type     | Description                                 |
| -------------------- | -------- | ------------------------------------------- |
| `balance`            | `bigint` | Total balance                               |
| `unlocked`           | `bigint` | Unlocked balance                            |
| `lockedStakeable`    | `bigint` | Locked and stakeable balance                |
| `lockedNotStakeable` | `bigint` | Locked but not stakeable balance            |
| `utxoIDs`            | `array`  | Array of UTXO IDs referencing the addresses |

**Example:**

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

const balance = await client.pChain.getBalance({
  addresses: ["P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"],
});

console.log("Total balance:", balance.balance);
console.log("Unlocked:", balance.unlocked);
console.log("Locked stakeable:", balance.lockedStakeable);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetbalance)
- [getUTXOs](#getutxos) - Get UTXOs for addresses

---

### getUTXOs

Get the UTXOs (Unspent Transaction Outputs) controlled by a set of addresses.

**Function Signature:**

```typescript
function getUTXOs(params: GetUTXOsParameters): Promise<GetUTXOsReturnType>;

interface GetUTXOsParameters {
  addresses: string[];
  sourceChain?: string;
  limit?: number;
  startIndex?: {
    address: string;
    utxo: string;
  };
  encoding?: "hex";
}

interface GetUTXOsReturnType {
  numFetched: number;
  utxos: string[];
  endIndex: {
    address: string;
    utxo: string;
  };
  sourceChain?: string;
  encoding: "hex";
}
```

**Parameters:**

| Name          | Type                                | Required | Description                                     |
| ------------- | ----------------------------------- | -------- | ----------------------------------------------- |
| `addresses`   | `string[]`                          | Yes      | Array of P-Chain addresses                      |
| `sourceChain` | `string`                            | No       | Source chain ID (e.g., "X" for X-Chain)         |
| `limit`       | `number`                            | No       | Maximum number of UTXOs to return               |
| `startIndex`  | `{ address: string; utxo: string }` | No       | Pagination cursor for next page                 |
| `encoding`    | `"hex"`                             | No       | Encoding format (can only be "hex" if provided) |

**Returns:**

| Type                 | Description               |
| -------------------- | ------------------------- |
| `GetUTXOsReturnType` | UTXO data with pagination |

**Return Object:**

| Property      | Type                                | Description                              |
| ------------- | ----------------------------------- | ---------------------------------------- |
| `numFetched`  | `number`                            | Number of UTXOs fetched in this response |
| `utxos`       | `string[]`                          | Array of UTXO bytes (hex encoded)        |
| `endIndex`    | `{ address: string; utxo: string }` | Pagination cursor for fetching next page |
| `sourceChain` | `string`                            | Source chain ID (if specified)           |
| `encoding`    | `"hex"`                             | Encoding format used                     |

**Example:**

```typescript
// Get first page
const utxos = await client.pChain.getUTXOs({
  addresses: ["P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"],
  limit: 100,
});

console.log("Fetched UTXOs:", utxos.numFetched);
console.log("UTXOs:", utxos.utxos);

// Get next page if needed
if (utxos.endIndex) {
  const moreUTXOs = await client.pChain.getUTXOs({
    addresses: ["P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"],
    startIndex: utxos.endIndex,
    limit: 100,
  });
}
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetutxos)
- [getBalance](#getbalance) - Get balance summary

---

## Validator Operations

### getCurrentValidators

Get the current validators of the specified Subnet.

**Function Signature:**

```typescript
function getCurrentValidators(
  params: GetCurrentValidatorsParameters,
): Promise<GetCurrentValidatorsReturnType>;

interface GetCurrentValidatorsParameters {
  subnetID?: string | Buffer;
  nodeIDs?: string[];
}

interface GetCurrentValidatorsReturnType {
  validators: Array<{
    accruedDelegateeReward: string;
    txID: string;
    startTime: string;
    endTime?: string;
    stakeAmount: string;
    nodeID: string;
    weight: string;
    validationRewardOwner?: {
      locktime: string;
      threshold: string;
      addresses: string[];
    };
    delegationRewardOwner?: {
      locktime: string;
      threshold: string;
      addresses: string[];
    };
    signer?: {
      publicKey: string;
      proofOfPosession: string;
    };
    delegatorCount?: string;
    delegatorWeight?: string;
    potentialReward?: string;
    delegationFee?: string;
    uptime?: string;
    connected?: boolean;
    delegators?: Array<{
      txID: string;
      startTime: string;
      endTime: string;
      stakeAmount: string;
      nodeID: string;
      rewardOwner: {
        locktime: string;
        threshold: string;
        addresses: string[];
      };
      potentialReward: string;
    }>;
  }>;
}
```

**Parameters:**

| Name       | Type               | Required | Description                             |
| ---------- | ------------------ | -------- | --------------------------------------- |
| `subnetID` | `string \| Buffer` | No       | Subnet ID (defaults to Primary Network) |
| `nodeIDs`  | `string[]`         | No       | Specific NodeIDs to query               |

**Returns:**

| Type                             | Description            |
| -------------------------------- | ---------------------- |
| `GetCurrentValidatorsReturnType` | Validators list object |

**Return Object:**

| Property     | Type    | Description                                 |
| ------------ | ------- | ------------------------------------------- |
| `validators` | `array` | List of validators for the specified Subnet |

**Note:** Many fields in the validator object are omitted if `subnetID` is not the Primary Network. The `delegators` field is only included when `nodeIDs` specifies a single NodeID.

**Example:**

```typescript
// Get all validators on Primary Network
const validators = await client.pChain.getCurrentValidators({});

console.log("Total validators:", validators.validators.length);

// Get validators for specific subnet
const subnetValidators = await client.pChain.getCurrentValidators({
  subnetID: "11111111111111111111111111111111LpoYY",
});

// Get specific validators
const specificValidators = await client.pChain.getCurrentValidators({
  subnetID: "11111111111111111111111111111111LpoYY",
  nodeIDs: ["NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg"],
});
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetcurrentvalidators)
- [getValidatorsAt](#getvalidatorsat) - Get validators at specific height
- [getAllValidatorsAt](#getallvalidatorsat) - Get all validators at height
- [sampleValidators](#samplevalidators) - Sample validators

---

### getValidatorsAt

Get the validators at a specific height.

**Function Signature:**

```typescript
function getValidatorsAt(
  params: GetValidatorsAtParameters,
): Promise<GetValidatorsAtReturnType>;

interface GetValidatorsAtParameters {
  height: number;
  subnetID?: string;
}

interface GetValidatorsAtReturnType {
  validators: Record<string, number>;
}
```

**Parameters:**

| Name       | Type     | Required | Description                             |
| ---------- | -------- | -------- | --------------------------------------- |
| `height`   | `number` | Yes      | Block height to query                   |
| `subnetID` | `string` | No       | Subnet ID (defaults to Primary Network) |

**Returns:**

| Type                        | Description           |
| --------------------------- | --------------------- |
| `GetValidatorsAtReturnType` | Validators map object |

**Return Object:**

| Property     | Type                     | Description                                 |
| ------------ | ------------------------ | ------------------------------------------- |
| `validators` | `Record<string, number>` | Map of validator IDs to their stake amounts |

**Example:**

```typescript
const validators = await client.pChain.getValidatorsAt({
  height: 1000001,
  subnetID: "11111111111111111111111111111111LpoYY",
});

console.log("Validators at height:", validators.validators);
```

**Links:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetvalidatorsat)
- [Related: getCurrentValidators](#getcurrentvalidators) - Get current validators
- [Related: getAllValidatorsAt](#getallvalidatorsat) - Get all validators at height
- [Related: getHeight](#getheight) - Get current height

---

### getAllValidatorsAt

Get all validators at a specific height across all Subnets and the Primary Network.

**Function Signature:**

```typescript
function getAllValidatorsAt(
  params: GetAllValidatorsAtParameters,
): Promise<GetAllValidatorsAtReturnType>;

interface GetAllValidatorsAtParameters {
  height: number | "proposed";
}

interface GetAllValidatorsAtReturnType {
  validatorSets: Record<
    string,
    {
      validators: Array<{
        publicKey: string;
        weight: string;
        nodeIDs: string[];
      }>;
      totalWeight: string;
    }
  >;
}
```

**Parameters:**

| Name     | Type                   | Required | Description                                        |
| -------- | ---------------------- | -------- | -------------------------------------------------- |
| `height` | `number \| "proposed"` | Yes      | P-Chain height or "proposed" for proposervm height |

**Returns:**

| Type                           | Description           |
| ------------------------------ | --------------------- |
| `GetAllValidatorsAtReturnType` | Validator sets object |

**Return Object:**

| Property        | Type     | Description                                      |
| --------------- | -------- | ------------------------------------------------ |
| `validatorSets` | `object` | Map of Subnet IDs to their validator information |

**Note:** The public API (api.avax.network) only supports height within 1000 blocks from the P-Chain tip.

**Example:**

```typescript
// Get all validators at specific height
const validators = await client.pChain.getAllValidatorsAt({
  height: 1000001,
});

// Get validators at proposed height
const proposedValidators = await client.pChain.getAllValidatorsAt({
  height: "proposed",
});

console.log("Subnet IDs:", Object.keys(validators.validatorSets));
Object.entries(validators.validatorSets).forEach(([subnetID, set]) => {
  console.log(`Subnet ${subnetID}:`);
  console.log(`  Total weight: ${set.totalWeight}`);
  console.log(`  Validators: ${set.validators.length}`);
});
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetallvalidatorsat)
- [getCurrentValidators](#getcurrentvalidators) - Get current validators
- [getValidatorsAt](#getvalidatorsat) - Get validators at height for specific subnet

---

### sampleValidators

Sample validators from the specified Subnet.

**Function Signature:**

```typescript
function sampleValidators(
  params: SampleValidatorsParameters,
): Promise<SampleValidatorsReturnType>;

interface SampleValidatorsParameters {
  samplingSize: number;
  subnetID?: string;
  pChainHeight?: number;
}

interface SampleValidatorsReturnType {
  validators: string[];
}
```

**Parameters:**

| Name           | Type     | Required | Description                             |
| -------------- | -------- | -------- | --------------------------------------- |
| `samplingSize` | `number` | Yes      | Number of validators to sample          |
| `subnetID`     | `string` | No       | Subnet ID (defaults to Primary Network) |
| `pChainHeight` | `number` | No       | Block height (defaults to current)      |

**Returns:**

| Type                         | Description               |
| ---------------------------- | ------------------------- |
| `SampleValidatorsReturnType` | Sampled validators object |

**Return Object:**

| Property     | Type       | Description                        |
| ------------ | ---------- | ---------------------------------- |
| `validators` | `string[]` | Array of sampled validator NodeIDs |

**Example:**

```typescript
const sampled = await client.pChain.sampleValidators({
  samplingSize: 5,
  subnetID: "11111111111111111111111111111111LpoYY",
});

console.log("Sampled validators:", sampled.validators);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformsamplevalidators)
- [getCurrentValidators](#getcurrentvalidators) - Get all current validators

---

## Block Operations

### getHeight

Get the height of the last accepted block.

**Function Signature:**

```typescript
function getHeight(): Promise<GetHeightReturnType>;

interface GetHeightReturnType {
  height: number;
}
```

**Parameters:**

No parameters required.

**Returns:**

| Type                  | Description   |
| --------------------- | ------------- |
| `GetHeightReturnType` | Height object |

**Return Object:**

| Property | Type     | Description                  |
| -------- | -------- | ---------------------------- |
| `height` | `number` | Current P-Chain block height |

**Example:**

```typescript
const height = await client.pChain.getHeight();
console.log("Current P-Chain height:", height.height);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetheight)
- [getBlockByHeight](#getblockbyheight) - Get block by height
- [getProposedHeight](#getproposedheight) - Get proposed height

---

### getBlockByHeight

Get a block by its height.

**Function Signature:**

```typescript
function getBlockByHeight(
  params: GetBlockByHeightParameters,
): Promise<GetBlockByHeightReturnType>;

interface GetBlockByHeightParameters {
  height: number;
  encoding?: "hex" | "json";
}

interface GetBlockByHeightReturnType {
  encoding: "hex" | "json";
  block: string | object;
}
```

**Parameters:**

| Name       | Type              | Required | Description                         |
| ---------- | ----------------- | -------- | ----------------------------------- |
| `height`   | `number`          | Yes      | Block height                        |
| `encoding` | `"hex" \| "json"` | No       | Encoding format (defaults to "hex") |

**Returns:**

| Type                         | Description       |
| ---------------------------- | ----------------- |
| `GetBlockByHeightReturnType` | Block data object |

**Return Object:**

| Property   | Type               | Description                                 |
| ---------- | ------------------ | ------------------------------------------- |
| `encoding` | `"hex" \| "json"`  | Encoding format used                        |
| `block`    | `string \| object` | Block data in the specified encoding format |

**Example:**

```typescript
const block = await client.pChain.getBlockByHeight({
  height: 12345,
  encoding: "hex",
});

console.log("Block data:", block.block);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetblockbyheight)
- [getBlock](#getblock) - Get block by ID
- [getHeight](#getheight) - Get current height

---

### getBlock

Get a block by its ID.

**Function Signature:**

```typescript
function getBlock(params: GetBlockParameters): Promise<GetBlockReturnType>;

interface GetBlockParameters {
  blockId: string;
  encoding?: "hex" | "json";
}

interface GetBlockReturnType {
  encoding: "hex" | "json";
  block: string | object;
}
```

**Parameters:**

| Name       | Type              | Required | Description                         |
| ---------- | ----------------- | -------- | ----------------------------------- |
| `blockId`  | `string`          | Yes      | Block ID in CB58 format             |
| `encoding` | `"hex" \| "json"` | No       | Encoding format (defaults to "hex") |

**Returns:**

| Type                 | Description       |
| -------------------- | ----------------- |
| `GetBlockReturnType` | Block data object |

**Return Object:**

| Property   | Type               | Description                                 |
| ---------- | ------------------ | ------------------------------------------- |
| `encoding` | `"hex" \| "json"`  | Encoding format used                        |
| `block`    | `string \| object` | Block data in the specified encoding format |

**Example:**

```typescript
const block = await client.pChain.getBlock({
  blockId: "d7WYmb8VeZNHsny3EJCwMm6QA37s1EHwMxw1Y71V3FqPZ5EFG",
  encoding: "hex",
});

console.log("Block:", block.block);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetblock)
- [getBlockByHeight](#getblockbyheight) - Get block by height

---

## Staking Operations

### getStake

Get the stake amount for a set of addresses.

**Function Signature:**

```typescript
function getStake(params: GetStakeParameters): Promise<GetStakeReturnType>;

interface GetStakeParameters {
  addresses: string[];
  subnetID: string;
}

interface GetStakeReturnType {
  stakeAmount: bigint;
}
```

**Parameters:**

| Name        | Type       | Required | Description       |
| ----------- | ---------- | -------- | ----------------- |
| `addresses` | `string[]` | Yes      | P-Chain addresses |
| `subnetID`  | `string`   | Yes      | Subnet ID         |

**Returns:**

| Type                 | Description         |
| -------------------- | ------------------- |
| `GetStakeReturnType` | Stake amount object |

**Return Object:**

| Property      | Type     | Description                          |
| ------------- | -------- | ------------------------------------ |
| `stakeAmount` | `bigint` | Total stake amount for the addresses |

**Example:**

```typescript
const stake = await client.pChain.getStake({
  addresses: ["P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"],
  subnetID: "11111111111111111111111111111111LpoYY",
});

console.log("Stake amount:", stake.stakeAmount);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetstake)
- [getTotalStake](#gettotalstake) - Get total subnet stake
- [getMinStake](#getminstake) - Get minimum stake requirements

---

### getTotalStake

Get the total amount of stake for a Subnet.

**Function Signature:**

```typescript
function getTotalStake(
  params: GetTotalStakeParameters,
): Promise<GetTotalStakeReturnType>;

interface GetTotalStakeParameters {
  subnetID: string;
}

interface GetTotalStakeReturnType {
  stake: bigint;
  weight: bigint;
}
```

**Parameters:**

| Name       | Type     | Required | Description |
| ---------- | -------- | -------- | ----------- |
| `subnetID` | `string` | Yes      | Subnet ID   |

**Returns:**

| Type                      | Description        |
| ------------------------- | ------------------ |
| `GetTotalStakeReturnType` | Total stake object |

**Return Object:**

| Property | Type     | Description                       |
| -------- | -------- | --------------------------------- |
| `stake`  | `bigint` | Total stake amount for the subnet |
| `weight` | `bigint` | Total weight for the subnet       |

**Example:**

```typescript
const totalStake = await client.pChain.getTotalStake({
  subnetID: "11111111111111111111111111111111LpoYY",
});

console.log("Total stake:", totalStake.stake);
console.log("Total weight:", totalStake.weight);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgettotalstake)
- [getStake](#getstake) - Get stake for addresses
- [getMinStake](#getminstake) - Get minimum stake

---

### getMinStake

Get the minimum stake required to validate or delegate.

**Function Signature:**

```typescript
function getMinStake(
  params: GetMinStakeParameters,
): Promise<GetMinStakeReturnType>;

interface GetMinStakeParameters {
  subnetID: string;
}

interface GetMinStakeReturnType {
  minValidatorStake: bigint;
  minDelegatorStake: bigint;
}
```

**Parameters:**

| Name       | Type     | Required | Description |
| ---------- | -------- | -------- | ----------- |
| `subnetID` | `string` | Yes      | Subnet ID   |

**Returns:**

| Type                    | Description          |
| ----------------------- | -------------------- |
| `GetMinStakeReturnType` | Minimum stake object |

**Return Object:**

| Property            | Type     | Description                                  |
| ------------------- | -------- | -------------------------------------------- |
| `minValidatorStake` | `bigint` | Minimum stake required to become a validator |
| `minDelegatorStake` | `bigint` | Minimum stake required to delegate           |

**Example:**

```typescript
const minStake = await client.pChain.getMinStake({
  subnetID: "11111111111111111111111111111111LpoYY",
});

console.log("Min validator stake:", minStake.minValidatorStake);
console.log("Min delegator stake:", minStake.minDelegatorStake);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetminstake)
- [getTotalStake](#gettotalstake) - Get total subnet stake

---

## Subnet Operations

### getSubnet

Get information about a subnet.

**Function Signature:**

```typescript
function getSubnet(params: GetSubnetParameters): Promise<GetSubnetReturnType>;

interface GetSubnetParameters {
  subnetID: string;
}

interface GetSubnetReturnType {
  isPermissioned: boolean;
  controlKeys: string[];
  threshold: string;
  locktime: string;
  subnetTransformationTxID: string;
  conversionID: string;
  managerChainID: string;
  managerAddress: string | null;
}
```

**Parameters:**

| Name       | Type     | Required | Description          |
| ---------- | -------- | -------- | -------------------- |
| `subnetID` | `string` | Yes      | The ID of the subnet |

**Returns:**

| Type                  | Description               |
| --------------------- | ------------------------- |
| `GetSubnetReturnType` | Subnet information object |

**Return Object:**

| Property                   | Type             | Description                          |
| -------------------------- | ---------------- | ------------------------------------ |
| `isPermissioned`           | `boolean`        | Whether the subnet is permissioned   |
| `controlKeys`              | `string[]`       | Control keys for the subnet          |
| `threshold`                | `string`         | Signature threshold                  |
| `locktime`                 | `string`         | Locktime for the subnet              |
| `subnetTransformationTxID` | `string`         | Subnet transformation transaction ID |
| `conversionID`             | `string`         | Conversion ID                        |
| `managerChainID`           | `string`         | Manager chain ID                     |
| `managerAddress`           | `string \| null` | Manager address (null if not set)    |

**Example:**

```typescript
const subnet = await client.pChain.getSubnet({
  subnetID: "11111111111111111111111111111111LpoYY",
});

console.log("Is permissioned:", subnet.isPermissioned);
console.log("Control keys:", subnet.controlKeys);
console.log("Threshold:", subnet.threshold);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetsubnet)
- [getSubnets](#getsubnets) - Get multiple subnets

---

### getSubnets

Get information about multiple subnets.

**Function Signature:**

```typescript
function getSubnets(
  params: GetSubnetsParameters,
): Promise<GetSubnetsReturnType>;

interface GetSubnetsParameters {
  ids: string[];
}

interface GetSubnetsReturnType {
  subnets: {
    id: string;
    controlKeys: string[];
    threshold: string;
  }[];
}
```

**Parameters:**

| Name  | Type       | Required | Description                  |
| ----- | ---------- | -------- | ---------------------------- |
| `ids` | `string[]` | Yes      | Array of subnet IDs to query |

**Returns:**

| Type                   | Description                |
| ---------------------- | -------------------------- |
| `GetSubnetsReturnType` | Subnets information object |

**Return Object:**

| Property  | Type    | Description                         |
| --------- | ------- | ----------------------------------- |
| `subnets` | `array` | Array of subnet information objects |

**Example:**

```typescript
const subnets = await client.pChain.getSubnets({
  ids: [
    "11111111111111111111111111111111LpoYY",
    "SubnetID-11111111111111111111111111111111LpoYY",
  ],
});

console.log("Number of subnets:", subnets.subnets.length);
subnets.subnets.forEach((subnet) => {
  console.log("Subnet ID:", subnet.id);
  console.log("Control keys:", subnet.controlKeys);
});
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetsubnets)
- [getSubnet](#getsubnet) - Get single subnet

---

### getStakingAssetID

Get the staking asset ID for a subnet.

**Function Signature:**

```typescript
function getStakingAssetID(
  params: GetStakingAssetIDParameters,
): Promise<GetStakingAssetIDReturnType>;

interface GetStakingAssetIDParameters {
  subnetID: string;
}

interface GetStakingAssetIDReturnType {
  assetID: string;
}
```

**Parameters:**

| Name       | Type     | Required | Description          |
| ---------- | -------- | -------- | -------------------- |
| `subnetID` | `string` | Yes      | The ID of the subnet |

**Returns:**

| Type                          | Description             |
| ----------------------------- | ----------------------- |
| `GetStakingAssetIDReturnType` | Staking asset ID object |

**Return Object:**

| Property  | Type     | Description                             |
| --------- | -------- | --------------------------------------- |
| `assetID` | `string` | Asset ID used for staking on the subnet |

**Example:**

```typescript
const stakingAsset = await client.pChain.getStakingAssetID({
  subnetID: "11111111111111111111111111111111LpoYY",
});

console.log("Staking asset ID:", stakingAsset.assetID);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetstakingassetid)
- [getSubnet](#getsubnet) - Get subnet information

---

## Blockchain Operations

### getBlockchains

Get all the blockchains that exist (excluding the P-Chain).

**Function Signature:**

```typescript
function getBlockchains(): Promise<GetBlockchainsReturnType>;

interface GetBlockchainsReturnType {
  blockchains: {
    id: string;
    name: string;
    subnetID: string;
    vmID: string;
  }[];
}
```

**Parameters:**

No parameters required.

**Returns:**

| Type                       | Description             |
| -------------------------- | ----------------------- |
| `GetBlockchainsReturnType` | Blockchains list object |

**Return Object:**

| Property      | Type    | Description                             |
| ------------- | ------- | --------------------------------------- |
| `blockchains` | `array` | Array of blockchain information objects |

**Example:**

```typescript
const blockchains = await client.pChain.getBlockchains();

console.log("Number of blockchains:", blockchains.blockchains.length);

blockchains.blockchains.forEach((blockchain) => {
  console.log("Blockchain:", blockchain.name);
  console.log("  ID:", blockchain.id);
  console.log("  Subnet ID:", blockchain.subnetID);
  console.log("  VM ID:", blockchain.vmID);
});
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetblockchains)
- [getBlockchainStatus](#getblockchainstatus) - Get blockchain status

---

### getBlockchainStatus

Get the status of a blockchain.

**Function Signature:**

```typescript
function getBlockchainStatus(
  params: GetBlockchainStatusParameters,
): Promise<GetBlockchainStatusReturnType>;

interface GetBlockchainStatusParameters {
  blockchainId: string;
}

interface GetBlockchainStatusReturnType {
  status: "Validating" | "Created" | "Preferred" | "Syncing" | "Unknown";
}
```

**Parameters:**

| Name           | Type     | Required | Description              |
| -------------- | -------- | -------- | ------------------------ |
| `blockchainId` | `string` | Yes      | The ID of the blockchain |

**Returns:**

| Type                            | Description              |
| ------------------------------- | ------------------------ |
| `GetBlockchainStatusReturnType` | Blockchain status object |

**Return Object:**

| Property | Type     | Description                                                                      |
| -------- | -------- | -------------------------------------------------------------------------------- |
| `status` | `string` | Blockchain status: "Validating", "Created", "Preferred", "Syncing", or "Unknown" |

**Status Values:**

- **Validating**: The blockchain is being validated by this node
- **Created**: The blockchain exists but isn't being validated by this node
- **Preferred**: The blockchain was proposed to be created and is likely to be created, but the transaction isn't yet accepted
- **Syncing**: This node is participating in the blockchain as a non-validating node
- **Unknown**: The blockchain either wasn't proposed or the proposal isn't preferred

**Example:**

```typescript
const status = await client.pChain.getBlockchainStatus({
  blockchainId: "11111111111111111111111111111111LpoYY",
});

console.log("Blockchain status:", status.status);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetblockchainstatus)
- [getBlockchains](#getblockchains) - Get all blockchains

---

## Transaction Operations

### getTx

Get a transaction by its ID.

**Function Signature:**

```typescript
function getTx(params: GetTxParameters): Promise<GetTxReturnType>;

interface GetTxParameters {
  txID: string;
  encoding?: "hex" | "json";
}

interface GetTxReturnType {
  encoding: "hex" | "json";
  tx: string | object;
}
```

**Parameters:**

| Name       | Type              | Required | Description                         |
| ---------- | ----------------- | -------- | ----------------------------------- |
| `txID`     | `string`          | Yes      | Transaction ID in CB58 format       |
| `encoding` | `"hex" \| "json"` | No       | Encoding format (defaults to "hex") |

**Returns:**

| Type              | Description             |
| ----------------- | ----------------------- |
| `GetTxReturnType` | Transaction data object |

**Return Object:**

| Property   | Type               | Description                                       |
| ---------- | ------------------ | ------------------------------------------------- |
| `encoding` | `"hex" \| "json"`  | Encoding format used                              |
| `tx`       | `string \| object` | Transaction data in the specified encoding format |

**Example:**

```typescript
const tx = await client.pChain.getTx({
  txID: "11111111111111111111111111111111LpoYY",
  encoding: "hex",
});

console.log("Transaction:", tx);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgettx)
- [getTxStatus](#gettxstatus) - Get transaction status
- [issueTx](#issuetx) - Issue a transaction

---

### getTxStatus

Get the status of a transaction.

**Function Signature:**

```typescript
function getTxStatus(
  params: GetTxStatusParameters,
): Promise<GetTxStatusReturnType>;

interface GetTxStatusParameters {
  txID: string;
}

interface GetTxStatusReturnType {
  status: "Committed" | "Pending" | "Dropped" | "Unknown";
  reason?: string;
}
```

**Parameters:**

| Name   | Type     | Required | Description                   |
| ------ | -------- | -------- | ----------------------------- |
| `txID` | `string` | Yes      | Transaction ID in CB58 format |

**Returns:**

| Type                    | Description               |
| ----------------------- | ------------------------- |
| `GetTxStatusReturnType` | Transaction status object |

**Return Object:**

| Property | Type     | Description                                                         |
| -------- | -------- | ------------------------------------------------------------------- |
| `status` | `string` | Transaction status: "Committed", "Pending", "Dropped", or "Unknown" |
| `reason` | `string` | Optional reason for the status (if dropped)                         |

**Status Values:**

- **Committed**: The transaction is (or will be) accepted by every node
- **Pending**: The transaction is being voted on by this node
- **Dropped**: The transaction will never be accepted by any node in the network
- **Unknown**: The transaction hasn't been seen by this node

**Example:**

```typescript
const txStatus = await client.pChain.getTxStatus({
  txID: "11111111111111111111111111111111LpoYY",
});

console.log("Transaction status:", txStatus.status);
if (txStatus.reason) {
  console.log("Reason:", txStatus.reason);
}
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgettxstatus)
- [getTx](#gettx) - Get transaction details
- [issueTx](#issuetx) - Issue a transaction

---

### issueTx

Issue a transaction to the Platform Chain.

**Function Signature:**

```typescript
function issueTx(params: IssueTxParameters): Promise<IssueTxReturnType>;

interface IssueTxParameters {
  tx: string;
  encoding: "hex";
}

interface IssueTxReturnType {
  txID: string;
}
```

**Parameters:**

| Name       | Type     | Required | Description                     |
| ---------- | -------- | -------- | ------------------------------- |
| `tx`       | `string` | Yes      | Transaction bytes in hex format |
| `encoding` | `"hex"`  | Yes      | Encoding format (must be "hex") |

**Returns:**

| Type                | Description           |
| ------------------- | --------------------- |
| `IssueTxReturnType` | Transaction ID object |

**Return Object:**

| Property | Type     | Description                   |
| -------- | -------- | ----------------------------- |
| `txID`   | `string` | Transaction ID in CB58 format |

**Example:**

```typescript
const txID = await client.pChain.issueTx({
  tx: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0...",
  encoding: "hex",
});

console.log("Transaction issued:", txID.txID);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformissuetx)
- [getTx](#gettx) - Get transaction details
- [getTxStatus](#gettxstatus) - Get transaction status

---

## Block Operations

### getProposedHeight

Get the proposed height of the P-Chain.

**Function Signature:**

```typescript
function getProposedHeight(): Promise<GetProposedHeightReturnType>;

interface GetProposedHeightReturnType {
  height: number;
}
```

**Parameters:**

No parameters required.

**Returns:**

| Type                          | Description            |
| ----------------------------- | ---------------------- |
| `GetProposedHeightReturnType` | Proposed height object |

**Return Object:**

| Property | Type     | Description                   |
| -------- | -------- | ----------------------------- |
| `height` | `number` | Proposed P-Chain block height |

**Example:**

```typescript
const proposedHeight = await client.pChain.getProposedHeight();
console.log("Proposed height:", proposedHeight.height);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetproposedheight)
- [getHeight](#getheight) - Get current accepted height

---

### getTimestamp

Get the current timestamp of the P-Chain.

**Function Signature:**

```typescript
function getTimestamp(): Promise<GetTimestampReturnType>;

interface GetTimestampReturnType {
  timestamp: string;
}
```

**Parameters:**

No parameters required.

**Returns:**

| Type                     | Description      |
| ------------------------ | ---------------- |
| `GetTimestampReturnType` | Timestamp object |

**Return Object:**

| Property    | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| `timestamp` | `string` | Current timestamp in ISO 8601 format |

**Example:**

```typescript
const timestamp = await client.pChain.getTimestamp();
console.log("Current timestamp:", timestamp.timestamp);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgettimestamp)
- [getHeight](#getheight) - Get current height

---

## Fee Operations

### getFeeConfig

Get the fee configuration for the P-Chain.

**Function Signature:**

```typescript
function getFeeConfig(): Promise<GetFeeConfigReturnType>;

interface GetFeeConfigReturnType {
  weights: [
    bandwidth: number,
    dbRead: number,
    dbWrite: number,
    compute: number,
  ];
  maxCapacity: bigint;
  maxPerSecond: bigint;
  targetPerSecond: bigint;
  minPrice: bigint;
  excessConversionConstant: bigint;
}
```

**Parameters:**

No parameters required.

**Returns:**

| Type                     | Description              |
| ------------------------ | ------------------------ |
| `GetFeeConfigReturnType` | Fee configuration object |

**Return Object:**

| Property                   | Type     | Description                                        |
| -------------------------- | -------- | -------------------------------------------------- |
| `weights`                  | `array`  | Fee weights: [bandwidth, dbRead, dbWrite, compute] |
| `maxCapacity`              | `bigint` | Maximum capacity                                   |
| `maxPerSecond`             | `bigint` | Maximum per second                                 |
| `targetPerSecond`          | `bigint` | Target per second                                  |
| `minPrice`                 | `bigint` | Minimum price                                      |
| `excessConversionConstant` | `bigint` | Excess conversion constant                         |

**Example:**

```typescript
const feeConfig = await client.pChain.getFeeConfig();

console.log("Fee weights:", feeConfig.weights);
console.log("Max capacity:", feeConfig.maxCapacity);
console.log("Target per second:", feeConfig.targetPerSecond);
console.log("Min price:", feeConfig.minPrice);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetfeeconfig)
- [getFeeState](#getfeestate) - Get current fee state

---

### getFeeState

Get the current fee state of the P-Chain.

**Function Signature:**

```typescript
function getFeeState(): Promise<GetFeeStateReturnType>;

interface GetFeeStateReturnType {
  capacity: bigint;
  excess: bigint;
  price: bigint;
  timestamp: string;
}
```

**Parameters:**

No parameters required.

**Returns:**

| Type                    | Description      |
| ----------------------- | ---------------- |
| `GetFeeStateReturnType` | Fee state object |

**Return Object:**

| Property    | Type     | Description                |
| ----------- | -------- | -------------------------- |
| `capacity`  | `bigint` | Current fee capacity       |
| `excess`    | `bigint` | Current fee excess         |
| `price`     | `bigint` | Current fee price          |
| `timestamp` | `string` | Timestamp of the fee state |

**Example:**

```typescript
const feeState = await client.pChain.getFeeState();

console.log("Fee capacity:", feeState.capacity);
console.log("Fee excess:", feeState.excess);
console.log("Fee price:", feeState.price);
console.log("Timestamp:", feeState.timestamp);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetfeestate)
- [getFeeConfig](#getfeeconfig) - Get fee configuration

---

## Supply Operations

### getCurrentSupply

Get the current supply of AVAX tokens.

**Function Signature:**

```typescript
function getCurrentSupply(
  params?: GetCurrentSupplyParameters,
): Promise<GetCurrentSupplyReturnType>;

interface GetCurrentSupplyParameters {
  subnetId?: string;
}

interface GetCurrentSupplyReturnType {
  supply: bigint;
}
```

**Parameters:**

| Name       | Type     | Required | Description                                        |
| ---------- | -------- | -------- | -------------------------------------------------- |
| `subnetId` | `string` | No       | Subnet ID (defaults to Primary Network if omitted) |

**Returns:**

| Type                         | Description   |
| ---------------------------- | ------------- |
| `GetCurrentSupplyReturnType` | Supply object |

**Return Object:**

| Property | Type     | Description                                    |
| -------- | -------- | ---------------------------------------------- |
| `supply` | `bigint` | Upper bound on the number of tokens that exist |

**Example:**

```typescript
// Get Primary Network supply
const supply = await client.pChain.getCurrentSupply();
console.log("Primary Network supply:", supply.supply);

// Get subnet-specific supply
const subnetSupply = await client.pChain.getCurrentSupply({
  subnetId: "11111111111111111111111111111111LpoYY",
});
console.log("Subnet supply:", subnetSupply.supply);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetcurrentsupply)
- [getBalance](#getbalance) - Get address balance

---

## Reward Operations

### getRewardUTXOs

Get the reward UTXOs for a transaction.

**Function Signature:**

```typescript
function getRewardUTXOs(
  params: GetRewardUTXOsParameters,
): Promise<GetRewardUTXOsReturnType>;

interface GetRewardUTXOsParameters {
  txID: string;
  encoding?: "hex";
}

interface GetRewardUTXOsReturnType {
  numFetched: number;
  utxos: string[];
  encoding: "hex";
}
```

**Parameters:**

| Name       | Type     | Required | Description                         |
| ---------- | -------- | -------- | ----------------------------------- |
| `txID`     | `string` | Yes      | Transaction ID in CB58 format       |
| `encoding` | `"hex"`  | No       | Encoding format (defaults to "hex") |

**Returns:**

| Type                       | Description         |
| -------------------------- | ------------------- |
| `GetRewardUTXOsReturnType` | Reward UTXOs object |

**Return Object:**

| Property     | Type       | Description                              |
| ------------ | ---------- | ---------------------------------------- |
| `numFetched` | `number`   | Number of reward UTXOs fetched           |
| `utxos`      | `string[]` | Array of reward UTXO bytes (hex encoded) |
| `encoding`   | `"hex"`    | Encoding format used                     |

**Example:**

```typescript
const rewardUTXOs = await client.pChain.getRewardUTXOs({
  txID: "11111111111111111111111111111111LpoYY",
  encoding: "hex",
});

console.log("Reward UTXOs fetched:", rewardUTXOs.numFetched);
console.log("UTXOs:", rewardUTXOs.utxos);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetrewardutxos)
- [getUTXOs](#getutxos) - Get UTXOs for addresses

---

## L1 Validator Operations

### getL1Validator

Get information about an L1 validator.

**Function Signature:**

```typescript
function getL1Validator(
  params: GetL1ValidatorParameters,
): Promise<GetL1ValidatorReturnType>;

interface GetL1ValidatorParameters {
  validationID: string;
}

interface GetL1ValidatorReturnType {
  subnetID: string;
  nodeID: string;
  publicKey: string;
  remainingBalanceOwner: {
    addresses: string[];
    locktime: string;
    threshold: string;
  };
  deactivationOwner: {
    addresses: string[];
    locktime: string;
    threshold: string;
  };
  startTime: bigint;
  weight: bigint;
  minNonce?: bigint;
  balance?: bigint;
  height?: bigint;
}
```

**Parameters:**

| Name           | Type     | Required | Description                                             |
| -------------- | -------- | -------- | ------------------------------------------------------- |
| `validationID` | `string` | Yes      | The ID for L1 subnet validator registration transaction |

**Returns:**

| Type                       | Description                     |
| -------------------------- | ------------------------------- |
| `GetL1ValidatorReturnType` | L1 validator information object |

**Return Object:**

| Property                | Type     | Description                                   |
| ----------------------- | -------- | --------------------------------------------- |
| `subnetID`              | `string` | L1 subnet ID this validator is validating     |
| `nodeID`                | `string` | Node ID of the validator                      |
| `publicKey`             | `string` | Compressed BLS public key of the validator    |
| `remainingBalanceOwner` | `object` | Owner that will receive any withdrawn balance |
| `deactivationOwner`     | `object` | Owner that can withdraw the balance           |
| `startTime`             | `bigint` | Unix timestamp when validator was added       |
| `weight`                | `bigint` | Weight used for consensus voting and ICM      |
| `minNonce`              | `bigint` | Minimum nonce for SetL1ValidatorWeightTx      |
| `balance`               | `bigint` | Current remaining balance for continuous fee  |
| `height`                | `bigint` | Height of the last accepted block             |

**Example:**

```typescript
const validator = await client.pChain.getL1Validator({
  validationID: "11111111111111111111111111111111LpoYY",
});

console.log("Subnet ID:", validator.subnetID);
console.log("Node ID:", validator.nodeID);
console.log("Weight:", validator.weight);
console.log("Start time:", validator.startTime);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformgetl1validator)
- [getCurrentValidators](#getcurrentvalidators) - Get current validators

---

## Chain Validation

### validatedBy

Get the subnet that validates a given blockchain.

**Function Signature:**

```typescript
function validatedBy(
  params: ValidatedByParameters,
): Promise<ValidatedByReturnType>;

interface ValidatedByParameters {
  blockchainID: string;
}

interface ValidatedByReturnType {
  subnetID: string;
}
```

**Parameters:**

| Name           | Type     | Required | Description         |
| -------------- | -------- | -------- | ------------------- |
| `blockchainID` | `string` | Yes      | The blockchain's ID |

**Returns:**

| Type                    | Description      |
| ----------------------- | ---------------- |
| `ValidatedByReturnType` | Subnet ID object |

**Return Object:**

| Property   | Type     | Description                                    |
| ---------- | -------- | ---------------------------------------------- |
| `subnetID` | `string` | ID of the subnet that validates the blockchain |

**Example:**

```typescript
const validatedBy = await client.pChain.validatedBy({
  blockchainID: "11111111111111111111111111111111LpoYY",
});

console.log("Validated by subnet:", validatedBy.subnetID);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformvalidatedby)
- [validates](#validates) - Get blockchains validated by subnet

---

### validates

Get the IDs of the blockchains a subnet validates.

**Function Signature:**

```typescript
function validates(params: ValidatesParameters): Promise<ValidatesReturnType>;

interface ValidatesParameters {
  subnetID: string;
}

interface ValidatesReturnType {
  blockchainIDs: string[];
}
```

**Parameters:**

| Name       | Type     | Required | Description     |
| ---------- | -------- | -------- | --------------- |
| `subnetID` | `string` | Yes      | The subnet's ID |

**Returns:**

| Type                  | Description           |
| --------------------- | --------------------- |
| `ValidatesReturnType` | Blockchain IDs object |

**Return Object:**

| Property        | Type       | Description                                     |
| --------------- | ---------- | ----------------------------------------------- |
| `blockchainIDs` | `string[]` | Array of blockchain IDs validated by the subnet |

**Example:**

```typescript
const validates = await client.pChain.validates({
  subnetID: "11111111111111111111111111111111LpoYY",
});

console.log("Number of blockchains:", validates.blockchainIDs.length);
validates.blockchainIDs.forEach((blockchainID) => {
  console.log("Blockchain ID:", blockchainID);
});
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/p-chain#platformvalidates)
- [validatedBy](#validatedby) - Get subnet validating blockchain

## Next Steps

- **[P-Chain Wallet Methods](../wallet-methods/p-chain-wallet)** - Transaction preparation and signing
- **[Wallet Client](../../clients/wallet-client)** - Complete wallet operations
- **[Account Management](../../accounts)** - Account types and management

# X-Chain Methods (/docs/tooling/avalanche-sdk/client/methods/public-methods/x-chain)

---

title: X-Chain Methods
description: Complete reference for X-Chain (Exchange Chain) methods

---

## Overview

The X-Chain (Exchange Chain) is Avalanche's DAG-based chain designed for creating and trading digital smart assets. It handles asset creation, transfers, UTXO management, and provides the foundation for the Avalanche ecosystem. This reference covers all read-only X-Chain operations available through the Avalanche Client SDK.

## Balance Operations

### getBalance

Get the balance of a specific asset controlled by a given address.

**Function Signature:**

```typescript
function getBalance(
  params: GetBalanceParameters,
): Promise<GetBalanceReturnType>;

interface GetBalanceParameters {
  address: string;
  assetID: string;
}

interface GetBalanceReturnType {
  balance: bigint;
  utxoIDs: {
    txID: string;
    outputIndex: number;
  }[];
}
```

**Parameters:**

| Name      | Type     | Required | Description              |
| --------- | -------- | -------- | ------------------------ |
| `address` | `string` | Yes      | X-Chain address to query |
| `assetID` | `string` | Yes      | Asset ID to query        |

**Returns:**

| Type                   | Description                |
| ---------------------- | -------------------------- |
| `GetBalanceReturnType` | Balance information object |

**Return Object:**

| Property  | Type     | Description                               |
| --------- | -------- | ----------------------------------------- |
| `balance` | `bigint` | Balance amount for the specified asset    |
| `utxoIDs` | `array`  | Array of UTXO IDs referencing the address |

**Example:**

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

const balance = await client.xChain.getBalance({
  address: "X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5",
  assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z", // AVAX
});

console.log("Balance:", balance.balance);
console.log("UTXO IDs:", balance.utxoIDs);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/x-chain#avmgetbalance)
- [getAllBalances](#getallbalances) - Get balances for all assets
- [getUTXOs](#getutxos) - Get UTXOs for addresses

---

### getAllBalances

Get the balances of all assets controlled by given addresses.

**Function Signature:**

```typescript
function getAllBalances(
  params: GetAllBalancesParameters,
): Promise<GetAllBalancesReturnType>;

interface GetAllBalancesParameters {
  addresses: string[];
}

interface GetAllBalancesReturnType {
  balances: Array<{
    assetID: string;
    balance: bigint;
  }>;
}
```

**Parameters:**

| Name        | Type       | Required | Description                         |
| ----------- | ---------- | -------- | ----------------------------------- |
| `addresses` | `string[]` | Yes      | Array of X-Chain addresses to query |

**Returns:**

| Type                       | Description           |
| -------------------------- | --------------------- |
| `GetAllBalancesReturnType` | Balances array object |

**Return Object:**

| Property   | Type    | Description                                       |
| ---------- | ------- | ------------------------------------------------- |
| `balances` | `array` | Array of balance objects with assetID and balance |

**Example:**

```typescript
const allBalances = await client.xChain.getAllBalances({
  addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
});

// Iterate over all assets
allBalances.balances.forEach(({ assetID, balance }) => {
  console.log(`Asset ${assetID}: ${balance}`);
});
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/x-chain#avmgetallbalances)
- [getBalance](#getbalance) - Get balance for specific asset
- [getAssetDescription](#getassetdescription) - Get asset information

---

## Asset Operations

### getAssetDescription

Get information about an asset.

**Function Signature:**

```typescript
function getAssetDescription(
  params: GetAssetDescriptionParameters,
): Promise<GetAssetDescriptionReturnType>;

interface GetAssetDescriptionParameters {
  assetID: string;
}

interface GetAssetDescriptionReturnType {
  assetID: string;
  name: string;
  symbol: string;
  denomination: number;
}
```

**Parameters:**

| Name      | Type     | Required | Description |
| --------- | -------- | -------- | ----------- |
| `assetID` | `string` | Yes      | Asset ID    |

**Returns:**

| Type                            | Description              |
| ------------------------------- | ------------------------ |
| `GetAssetDescriptionReturnType` | Asset information object |

**Return Object:**

| Property       | Type     | Description                                   |
| -------------- | -------- | --------------------------------------------- |
| `assetID`      | `string` | Asset ID                                      |
| `name`         | `string` | Asset name                                    |
| `symbol`       | `string` | Asset symbol                                  |
| `denomination` | `number` | Asset denomination (number of decimal places) |

**Example:**

```typescript
const asset = await client.xChain.getAssetDescription({
  assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
});

console.log("Asset name:", asset.name);
console.log("Asset symbol:", asset.symbol);
console.log("Denomination:", asset.denomination);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/x-chain#avmgetassetdescription)
- [getBalance](#getbalance) - Get balance for this asset

---

## Block Operations

### getHeight

Get the current block height of the X-Chain.

**Function Signature:**

```typescript
function getHeight(): Promise<GetHeightReturnType>;

interface GetHeightReturnType {
  height: number;
}
```

**Parameters:**

No parameters required.

**Returns:**

| Type                  | Description   |
| --------------------- | ------------- |
| `GetHeightReturnType` | Height object |

**Return Object:**

| Property | Type     | Description                  |
| -------- | -------- | ---------------------------- |
| `height` | `number` | Current X-Chain block height |

**Example:**

```typescript
const height = await client.xChain.getHeight();
console.log("Current X-Chain height:", height.height);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/x-chain#avmgetheight)
- [getBlockByHeight](#getblockbyheight) - Get block at height

---

### getBlockByHeight

Get a block by its height.

**Function Signature:**

```typescript
function getBlockByHeight(
  params: GetBlockByHeightParameters,
): Promise<GetBlockByHeightReturnType>;

interface GetBlockByHeightParameters {
  height: number;
  encoding?: "hex" | "json";
}

interface GetBlockByHeightReturnType {
  encoding: "hex" | "json";
  block: string | object;
}
```

**Parameters:**

| Name       | Type              | Required | Description                          |
| ---------- | ----------------- | -------- | ------------------------------------ |
| `height`   | `number`          | Yes      | Block height                         |
| `encoding` | `"hex" \| "json"` | No       | Encoding format (defaults to "json") |

**Returns:**

| Type                         | Description       |
| ---------------------------- | ----------------- |
| `GetBlockByHeightReturnType` | Block data object |

**Return Object:**

| Property   | Type               | Description                                 |
| ---------- | ------------------ | ------------------------------------------- |
| `encoding` | `"hex" \| "json"`  | Encoding format used                        |
| `block`    | `string \| object` | Block data in the specified encoding format |

**Example:**

```typescript
const block = await client.xChain.getBlockByHeight({
  height: 12345,
  encoding: "hex",
});

console.log("Block data:", block.block);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/x-chain#avmgetblockbyheight)
- [getBlock](#getblock) - Get block by ID
- [getHeight](#getheight) - Get current height

---

### getBlock

Get a block by its ID.

**Function Signature:**

```typescript
function getBlock(params: GetBlockParameters): Promise<GetBlockReturnType>;

interface GetBlockParameters {
  blockId: string;
  encoding?: "hex" | "json";
}

interface GetBlockReturnType {
  encoding: "hex" | "json";
  block: string | object;
}
```

**Parameters:**

| Name       | Type              | Required | Description                          |
| ---------- | ----------------- | -------- | ------------------------------------ |
| `blockId`  | `string`          | Yes      | Block ID in CB58 format              |
| `encoding` | `"hex" \| "json"` | No       | Encoding format (defaults to "json") |

**Returns:**

| Type                 | Description       |
| -------------------- | ----------------- |
| `GetBlockReturnType` | Block data object |

**Return Object:**

| Property   | Type               | Description                                 |
| ---------- | ------------------ | ------------------------------------------- |
| `encoding` | `"hex" \| "json"`  | Encoding format used                        |
| `block`    | `string \| object` | Block data in the specified encoding format |

**Example:**

```typescript
const block = await client.xChain.getBlock({
  blockId: "block-id-in-cb58-format",
  encoding: "hex",
});

console.log("Block:", block.block);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/x-chain#avmgetblock)
- [getBlockByHeight](#getblockbyheight) - Get block by height

---

## Transaction Operations

### getTx

Get a transaction by its ID.

**Function Signature:**

```typescript
function getTx(params: GetTxParameters): Promise<GetTxReturnType>;

interface GetTxParameters {
  txID: string;
  encoding?: "hex" | "json";
}

interface GetTxReturnType {
  encoding: "hex" | "json";
  tx: string | object;
}
```

**Parameters:**

| Name       | Type              | Required | Description                          |
| ---------- | ----------------- | -------- | ------------------------------------ |
| `txID`     | `string`          | Yes      | Transaction ID in CB58 format        |
| `encoding` | `"hex" \| "json"` | No       | Encoding format (defaults to "json") |

**Returns:**

| Type              | Description             |
| ----------------- | ----------------------- |
| `GetTxReturnType` | Transaction data object |

**Return Object:**

| Property   | Type               | Description                                       |
| ---------- | ------------------ | ------------------------------------------------- |
| `encoding` | `"hex" \| "json"`  | Encoding format used                              |
| `tx`       | `string \| object` | Transaction data in the specified encoding format |

**Example:**

```typescript
const tx = await client.xChain.getTx({
  txID: "transaction-id",
  encoding: "hex",
});

console.log("Transaction:", tx.tx);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/x-chain#avmgettx)
- [getTxStatus](#gettxstatus) - Get transaction status
- [issueTx](#issuetx) - Submit transaction

---

### getTxStatus

Get the status of a transaction.

**Function Signature:**

```typescript
function getTxStatus(
  params: GetTxStatusParameters,
): Promise<GetTxStatusReturnType>;

interface GetTxStatusParameters {
  txID: string;
  includeReason?: boolean | true;
}

interface GetTxStatusReturnType {
  status: "Accepted" | "Processing" | "Rejected" | "Unknown";
  reason?: string;
}
```

**Parameters:**

| Name            | Type              | Required | Description                                  |
| --------------- | ----------------- | -------- | -------------------------------------------- |
| `txID`          | `string`          | Yes      | Transaction ID in CB58 format                |
| `includeReason` | `boolean \| true` | No       | Whether to include the reason for the status |

**Returns:**

| Type                    | Description               |
| ----------------------- | ------------------------- |
| `GetTxStatusReturnType` | Transaction status object |

**Return Object:**

| Property | Type     | Description                                                            |
| -------- | -------- | ---------------------------------------------------------------------- |
| `status` | `string` | Transaction status: "Accepted", "Processing", "Rejected", or "Unknown" |
| `reason` | `string` | Optional reason for the status (if rejected)                           |

**Status Values:**

- **Accepted**: Transaction has been accepted and included in a block
- **Processing**: Transaction is being processed
- **Rejected**: Transaction was rejected
- **Unknown**: Transaction status cannot be determined

**Example:**

```typescript
const status = await client.xChain.getTxStatus({
  txID: "transaction-id",
});

if (status.status === "Accepted") {
  console.log("Transaction accepted!");
} else if (status.status === "Rejected") {
  console.log("Transaction rejected");
  if (status.reason) {
    console.log("Reason:", status.reason);
  }
} else {
  console.log("Transaction status:", status.status);
}
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/x-chain#avmgettxstatus)
- [getTx](#gettx) - Get transaction details

---

### getTxFee

Get the transaction fee for the X-Chain.

**Function Signature:**

```typescript
function getTxFee(): Promise<GetTxFeeReturnType>;

interface GetTxFeeReturnType {
  txFee: number;
  createAssetTxFee: number;
}
```

**Parameters:**

No parameters required.

**Returns:**

| Type                 | Description            |
| -------------------- | ---------------------- |
| `GetTxFeeReturnType` | Transaction fee object |

**Return Object:**

| Property           | Type     | Description                  |
| ------------------ | -------- | ---------------------------- |
| `txFee`            | `number` | Standard transaction fee     |
| `createAssetTxFee` | `number` | Fee for creating a new asset |

**Example:**

```typescript
const fees = await client.xChain.getTxFee();

console.log("Standard transaction fee:", fees.txFee);
console.log("Create asset fee:", fees.createAssetTxFee);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/x-chain#avmgettxfee)

---

## UTXO Operations

### getUTXOs

Get the UTXOs controlled by a set of addresses.

**Function Signature:**

```typescript
function getUTXOs(params: GetUTXOsParameters): Promise<GetUTXOsReturnType>;

interface GetUTXOsParameters {
  addresses: string[];
  sourceChain?: string;
  limit?: number;
  startIndex?: {
    address: string;
    utxo: string;
  };
  encoding?: "hex";
}

interface GetUTXOsReturnType {
  numFetched: number;
  utxos: string[];
  endIndex: {
    address: string;
    utxo: string;
  };
  sourceChain?: string;
  encoding: "hex";
}
```

**Parameters:**

| Name          | Type                                | Required | Description                                     |
| ------------- | ----------------------------------- | -------- | ----------------------------------------------- |
| `addresses`   | `string[]`                          | Yes      | Array of X-Chain addresses                      |
| `sourceChain` | `string`                            | No       | Source chain ID (e.g., "P" for P-Chain)         |
| `limit`       | `number`                            | No       | Maximum number of UTXOs to return               |
| `startIndex`  | `{ address: string; utxo: string }` | No       | Pagination cursor for next page                 |
| `encoding`    | `"hex"`                             | No       | Encoding format (can only be "hex" if provided) |

**Returns:**

| Type                 | Description               |
| -------------------- | ------------------------- |
| `GetUTXOsReturnType` | UTXO data with pagination |

**Return Object:**

| Property      | Type                                | Description                              |
| ------------- | ----------------------------------- | ---------------------------------------- |
| `numFetched`  | `number`                            | Number of UTXOs fetched in this response |
| `utxos`       | `string[]`                          | Array of UTXO bytes (hex encoded)        |
| `endIndex`    | `{ address: string; utxo: string }` | Pagination cursor for fetching next page |
| `sourceChain` | `string`                            | Source chain ID (if specified)           |
| `encoding`    | `"hex"`                             | Encoding format used                     |

**Example:**

```typescript
// Get first page
const utxos = await client.xChain.getUTXOs({
  addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
  limit: 100,
});

console.log("Number of UTXOs:", utxos.numFetched);

// Get next page if needed
if (utxos.endIndex) {
  const moreUTXOs = await client.xChain.getUTXOs({
    addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
    startIndex: utxos.endIndex,
    limit: 100,
  });
}
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/x-chain#avmgetutxos)
- [getBalance](#getbalance) - Get balance summary

---

## Transaction Submission

### issueTx

Issue a transaction to the X-Chain.

**Function Signature:**

```typescript
function issueTx(params: IssueTxParameters): Promise<IssueTxReturnType>;

interface IssueTxParameters {
  tx: string;
  encoding: "hex";
}

interface IssueTxReturnType {
  txID: string;
}
```

**Parameters:**

| Name       | Type     | Required | Description                     |
| ---------- | -------- | -------- | ------------------------------- |
| `tx`       | `string` | Yes      | Transaction bytes in hex format |
| `encoding` | `"hex"`  | Yes      | Encoding format (must be "hex") |

**Returns:**

| Type                | Description           |
| ------------------- | --------------------- |
| `IssueTxReturnType` | Transaction ID object |

**Return Object:**

| Property | Type     | Description                   |
| -------- | -------- | ----------------------------- |
| `txID`   | `string` | Transaction ID in CB58 format |

**Example:**

```typescript
const txID = await client.xChain.issueTx({
  tx: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0...",
  encoding: "hex",
});

console.log("Transaction ID:", txID.txID);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/x-chain#avmissuetx)
- [getTxStatus](#gettxstatus) - Check transaction status

---

## Genesis Operations

### buildGenesis

Build a genesis block for a custom blockchain.

**Function Signature:**

```typescript
function buildGenesis(
  params: BuildGenesisParameters,
): Promise<BuildGenesisReturnType>;

interface BuildGenesisParameters {
  networkID: number;
  genesisData: {
    name: string;
    symbol: string;
    denomination: number;
    initialState: {
      fixedCap: {
        amount: number;
        addresses: string[];
      };
    };
  };
  encoding: "hex";
}

interface BuildGenesisReturnType {
  bytes: string;
  encoding: "hex";
}
```

**Parameters:**

| Name          | Type     | Required | Description                                 |
| ------------- | -------- | -------- | ------------------------------------------- |
| `networkID`   | `number` | Yes      | Network ID                                  |
| `genesisData` | `object` | Yes      | Genesis block data with asset configuration |
| `encoding`    | `"hex"`  | Yes      | Encoding format (must be "hex")             |

**Returns:**

| Type                     | Description                |
| ------------------------ | -------------------------- |
| `BuildGenesisReturnType` | Genesis block bytes object |

**Return Object:**

| Property   | Type     | Description                       |
| ---------- | -------- | --------------------------------- |
| `bytes`    | `string` | Genesis block bytes in hex format |
| `encoding` | `"hex"`  | Encoding format used              |

**Example:**

```typescript
const genesis = await client.xChain.buildGenesis({
  networkID: 16,
  genesisData: {
    name: "myFixedCapAsset",
    symbol: "MFCA",
    denomination: 0,
    initialState: {
      fixedCap: {
        amount: 100000,
        addresses: ["X-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"],
      },
    },
  },
  encoding: "hex",
});

console.log("Genesis bytes:", genesis.bytes);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/x-chain#avmbuildgenesis)

---

## Next Steps

- **[X-Chain Wallet Methods](../wallet-methods/x-chain-wallet)** - Transaction preparation and signing
- **[Wallet Client](../../clients/wallet-client)** - Complete wallet operations
- **[Account Management](../../accounts)** - Account types and management

# API Methods (/docs/tooling/avalanche-sdk/client/methods/public-methods/api)

---

title: API Methods
description: Complete reference for Admin, Info, Health, Index, and ProposerVM API methods

---

## Overview

The Avalanche Client SDK provides access to node-level API methods through specialized API clients. These include administrative operations, informational queries, health monitoring, indexed blockchain data access, and ProposerVM operations.

## Admin API Client

Provides administrative operations for managing node aliases, logging, and profiling.

**Access:** `client.admin`

### alias

Assign an API endpoint an alias.

**Function Signature:**

```typescript
function alias(params: AliasParameters): Promise<void>;

interface AliasParameters {
  endpoint: string;
  alias: string;
}
```

**Parameters:**

| Name       | Type     | Required | Description            |
| ---------- | -------- | -------- | ---------------------- |
| `endpoint` | `string` | Yes      | API endpoint to alias  |
| `alias`    | `string` | Yes      | Alias for the endpoint |

**Returns:**

| Type            | Description     |
| --------------- | --------------- |
| `Promise<void>` | No return value |

**Example:**

```typescript
import { createAvalancheClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const client = createAvalancheClient({
  chain: avalanche,
  transport: { type: "http" },
});

await client.admin.alias({
  endpoint: "bc/X",
  alias: "myAlias",
});
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/admin-rpc#adminalias)

---

### aliasChain

Give a blockchain an alias.

**Function Signature:**

```typescript
function aliasChain(params: AliasChainParameters): Promise<void>;

interface AliasChainParameters {
  chain: string;
  alias: string;
}
```

**Parameters:**

| Name    | Type     | Required | Description              |
| ------- | -------- | -------- | ------------------------ |
| `chain` | `string` | Yes      | Blockchain ID to alias   |
| `alias` | `string` | Yes      | Alias for the blockchain |

**Returns:**

| Type            | Description     |
| --------------- | --------------- |
| `Promise<void>` | No return value |

**Example:**

```typescript
await client.admin.aliasChain({
  chain: "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM",
  alias: "myBlockchainAlias",
});
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/admin-rpc#adminaliaschain)

---

### getChainAliases

Get the aliases of a chain.

**Function Signature:**

```typescript
function getChainAliases(params: GetChainAliasesParameters): Promise<string[]>;

interface GetChainAliasesParameters {
  chain: string;
}
```

**Parameters:**

| Name    | Type     | Required | Description            |
| ------- | -------- | -------- | ---------------------- |
| `chain` | `string` | Yes      | Blockchain ID to query |

**Returns:**

| Type                | Description                    |
| ------------------- | ------------------------------ |
| `Promise<string[]>` | Array of aliases for the chain |

**Example:**

```typescript
const aliases = await client.admin.getChainAliases({
  chain: "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM",
});

console.log("Chain aliases:", aliases);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/admin-rpc#admingetchainaliases)

---

### Additional Admin API Methods

- **getLoggerLevel** - Get log and display levels of loggers
- **setLoggerLevel** - Set log and display levels of loggers
- **loadVMs** - Dynamically loads virtual machines
- **lockProfile** - Writes mutex statistics to `lock.profile`
- **memoryProfile** - Writes memory profile to `mem.profile`
- **startCPUProfiler** - Start CPU profiling
- **stopCPUProfiler** - Stop CPU profiler

See the [Admin API documentation](clients/api-clients#admin-api-client) for complete details.

---

## Info API Client

Provides node information and network statistics.

**Access:** `client.info`

### getNetworkID

Get the ID of the network this node is participating in.

**Function Signature:**

```typescript
function getNetworkID(): Promise<GetNetworkIDReturnType>;

interface GetNetworkIDReturnType {
  networkID: string;
}
```

**Returns:**

| Type                     | Description       |
| ------------------------ | ----------------- |
| `GetNetworkIDReturnType` | Network ID object |

**Return Object:**

| Property    | Type     | Description                                    |
| ----------- | -------- | ---------------------------------------------- |
| `networkID` | `string` | Network ID (1 for Mainnet, 5 for Fuji testnet) |

**Example:**

```typescript
const result = await client.info.getNetworkID();

if (result.networkID === "1") {
  console.log("Connected to Mainnet");
} else if (result.networkID === "5") {
  console.log("Connected to Fuji testnet");
}
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/info-rpc#infogetnetworkid)

---

### getNetworkName

Get the name of the network this node is participating in.

**Function Signature:**

```typescript
function getNetworkName(): Promise<GetNetworkNameReturnType>;

interface GetNetworkNameReturnType {
  networkName: string;
}
```

**Returns:**

| Type                       | Description         |
| -------------------------- | ------------------- |
| `GetNetworkNameReturnType` | Network name object |

**Return Object:**

| Property      | Type     | Description                            |
| ------------- | -------- | -------------------------------------- |
| `networkName` | `string` | Network name (e.g., "mainnet", "fuji") |

**Example:**

```typescript
const result = await client.info.getNetworkName();
console.log("Network:", result.networkName);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/info-rpc#infogetnetworkname)

---

### getNodeVersion

Get the version of this node.

**Function Signature:**

```typescript
function getNodeVersion(): Promise<GetNodeVersionReturnType>;

interface GetNodeVersionReturnType {
  version: string;
  databaseVersion: string;
  gitCommit: string;
  vmVersions: Map<string, string>;
  rpcProtocolVersion: string;
}
```

**Returns:**

| Type                       | Description         |
| -------------------------- | ------------------- |
| `GetNodeVersionReturnType` | Node version object |

**Return Object:**

| Property             | Type                  | Description                            |
| -------------------- | --------------------- | -------------------------------------- |
| `version`            | `string`              | Node version (e.g., "avalanche/1.9.4") |
| `databaseVersion`    | `string`              | Database version                       |
| `gitCommit`          | `string`              | Git commit hash                        |
| `vmVersions`         | `Map<string, string>` | Map of VM IDs to their versions        |
| `rpcProtocolVersion` | `string`              | RPC protocol version                   |

**Example:**

```typescript
const version = await client.info.getNodeVersion();
console.log("Node version:", version.version);
console.log("Database version:", version.databaseVersion);
console.log("VM versions:", Object.fromEntries(version.vmVersions));
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/info-rpc#infogetnodeversion)

---

### getNodeID

Get the node ID, BLS key, and proof of possession.

**Function Signature:**

```typescript
function getNodeID(): Promise<GetNodeIDReturnType>;

interface GetNodeIDReturnType {
  nodeID: string;
  nodePOP: {
    publicKey: string;
    proofOfPossession: string;
  };
}
```

**Returns:**

| Type                  | Description    |
| --------------------- | -------------- |
| `GetNodeIDReturnType` | Node ID object |

**Return Object:**

| Property                    | Type     | Description                                     |
| --------------------------- | -------- | ----------------------------------------------- |
| `nodeID`                    | `string` | Unique identifier of the node                   |
| `nodePOP.publicKey`         | `string` | 48 byte hex representation of the BLS key       |
| `nodePOP.proofOfPossession` | `string` | 96 byte hex representation of the BLS signature |

**Example:**

```typescript
const nodeID = await client.info.getNodeID();
console.log("Node ID:", nodeID.nodeID);
console.log("BLS Public Key:", nodeID.nodePOP.publicKey);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/info-rpc#infogetnodeid)

---

### getNodeIP

Get the IP address of the node.

**Function Signature:**

```typescript
function getNodeIP(): Promise<GetNodeIPReturnType>;

interface GetNodeIPReturnType {
  ip: string;
}
```

**Returns:**

| Type                  | Description    |
| --------------------- | -------------- |
| `GetNodeIPReturnType` | Node IP object |

**Return Object:**

| Property | Type     | Description            |
| -------- | -------- | ---------------------- |
| `ip`     | `string` | IP address of the node |

**Example:**

```typescript
const result = await client.info.getNodeIP();
console.log("Node IP:", result.ip);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/info-rpc#infogetnodeip)

---

### getBlockchainID

Get blockchain ID from alias.

**Function Signature:**

```typescript
function getBlockchainID(
  params: GetBlockchainIDParameters,
): Promise<GetBlockchainIDReturnType>;

interface GetBlockchainIDParameters {
  alias: string;
}

interface GetBlockchainIDReturnType {
  blockchainID: string;
}
```

**Parameters:**

| Name    | Type     | Required | Description                       |
| ------- | -------- | -------- | --------------------------------- |
| `alias` | `string` | Yes      | Blockchain alias (e.g., "X", "P") |

**Returns:**

| Type                        | Description          |
| --------------------------- | -------------------- |
| `GetBlockchainIDReturnType` | Blockchain ID object |

**Return Object:**

| Property       | Type     | Description          |
| -------------- | -------- | -------------------- |
| `blockchainID` | `string` | ID of the blockchain |

**Example:**

```typescript
const result = await client.info.getBlockchainID({ alias: "X" });
console.log("X-Chain ID:", result.blockchainID);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/info-rpc#infogetblockchainid)

---

### getTxFee

Get transaction fees for various operations.

**Function Signature:**

```typescript
function getTxFee(): Promise<GetTxFeeReturnType>;

interface GetTxFeeReturnType {
  txFee: bigint;
  createAssetTxFee: bigint;
  createSubnetTxFee: bigint;
  transformSubnetTxFee: bigint;
  createBlockchainTxFee: bigint;
  addPrimaryNetworkValidatorFee: bigint;
  addPrimaryNetworkDelegatorFee: bigint;
  addSubnetValidatorFee: bigint;
  addSubnetDelegatorFee: bigint;
}
```

**Returns:**

| Type                 | Description             |
| -------------------- | ----------------------- |
| `GetTxFeeReturnType` | Transaction fees object |

**Return Object:**

| Property                        | Type     | Description                                |
| ------------------------------- | -------- | ------------------------------------------ |
| `txFee`                         | `bigint` | Base transaction fee                       |
| `createAssetTxFee`              | `bigint` | Fee for creating an asset                  |
| `createSubnetTxFee`             | `bigint` | Fee for creating a subnet                  |
| `transformSubnetTxFee`          | `bigint` | Fee for transforming a subnet              |
| `createBlockchainTxFee`         | `bigint` | Fee for creating a blockchain              |
| `addPrimaryNetworkValidatorFee` | `bigint` | Fee for adding a primary network validator |
| `addPrimaryNetworkDelegatorFee` | `bigint` | Fee for adding a primary network delegator |
| `addSubnetValidatorFee`         | `bigint` | Fee for adding a subnet validator          |
| `addSubnetDelegatorFee`         | `bigint` | Fee for adding a subnet delegator          |

**Example:**

```typescript
const fees = await client.info.getTxFee();
console.log("Base transaction fee:", fees.txFee);
console.log("Create asset fee:", fees.createAssetTxFee);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/info-rpc#infogettxfee)

---

### getVMs

Get supported virtual machines.

**Function Signature:**

```typescript
function getVMs(): Promise<GetVMsReturnType>;

interface GetVMsReturnType {
  vms: {
    [key: string]: string[];
  };
}
```

**Returns:**

| Type               | Description |
| ------------------ | ----------- |
| `GetVMsReturnType` | VMs object  |

**Return Object:**

| Property | Type                          | Description                    |
| -------- | ----------------------------- | ------------------------------ |
| `vms`    | `{ [key: string]: string[] }` | Map of VM IDs to their aliases |

**Example:**

```typescript
const vms = await client.info.getVMs();
console.log("Supported VMs:", vms.vms);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/info-rpc#infogetvms)

---

### isBootstrapped

Check whether a given chain is done bootstrapping.

**Function Signature:**

```typescript
function isBootstrapped(
  params: IsBootstrappedParameters,
): Promise<IsBootstrappedReturnType>;

interface IsBootstrappedParameters {
  chain: string;
}

interface IsBootstrappedReturnType {
  isBootstrapped: boolean;
}
```

**Parameters:**

| Name    | Type     | Required | Description                   |
| ------- | -------- | -------- | ----------------------------- |
| `chain` | `string` | Yes      | Chain ID or alias (e.g., "X") |

**Returns:**

| Type                       | Description         |
| -------------------------- | ------------------- |
| `IsBootstrappedReturnType` | Bootstrapped status |

**Return Object:**

| Property         | Type      | Description                             |
| ---------------- | --------- | --------------------------------------- |
| `isBootstrapped` | `boolean` | Whether the chain is done bootstrapping |

**Example:**

```typescript
const result = await client.info.isBootstrapped({ chain: "X" });

if (result.isBootstrapped) {
  console.log("X-Chain is bootstrapped");
} else {
  console.log("X-Chain is still bootstrapping");
}
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/info-rpc#infoisbootstrapped)

---

### peers

Get peer information.

**Function Signature:**

```typescript
function peers(params: PeersParameters): Promise<PeersReturnType>;

interface PeersParameters {
  nodeIDs?: string[];
}

interface PeersReturnType {
  numPeers: number;
  peers: {
    ip: string;
    publicIP: string;
    nodeID: string;
    version: string;
    lastSent: string;
    lastReceived: string;
    benched: string[];
    observedUptime: number;
  }[];
}
```

**Parameters:**

| Name      | Type       | Required | Description                          |
| --------- | ---------- | -------- | ------------------------------------ |
| `nodeIDs` | `string[]` | No       | Optional array of node IDs to filter |

**Returns:**

| Type              | Description  |
| ----------------- | ------------ |
| `PeersReturnType` | Peers object |

**Return Object:**

| Property   | Type     | Description                       |
| ---------- | -------- | --------------------------------- |
| `numPeers` | `number` | Number of connected peers         |
| `peers`    | `array`  | Array of peer information objects |

**Peer Object:**

| Property         | Type       | Description                                        |
| ---------------- | ---------- | -------------------------------------------------- |
| `ip`             | `string`   | Remote IP of the peer                              |
| `publicIP`       | `string`   | Public IP of the peer                              |
| `nodeID`         | `string`   | Prefixed Node ID of the peer                       |
| `version`        | `string`   | Version the peer is running                        |
| `lastSent`       | `string`   | Timestamp of last message sent to the peer         |
| `lastReceived`   | `string`   | Timestamp of last message received from the peer   |
| `benched`        | `string[]` | Array of chain IDs the peer is benched on          |
| `observedUptime` | `number`   | Node's primary network uptime observed by the peer |

**Example:**

```typescript
const peers = await client.info.peers();
console.log("Number of peers:", peers.numPeers);
console.log("Peer details:", peers.peers);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/info-rpc#infopeers)

---

### uptime

Get node uptime statistics.

**Function Signature:**

```typescript
function uptime(): Promise<UptimeReturnType>;

interface UptimeReturnType {
  rewardingStakePercentage: number;
  weightedAveragePercentage: number;
}
```

**Returns:**

| Type               | Description   |
| ------------------ | ------------- |
| `UptimeReturnType` | Uptime object |

**Return Object:**

| Property                    | Type     | Description                                                             |
| --------------------------- | -------- | ----------------------------------------------------------------------- |
| `rewardingStakePercentage`  | `number` | Percent of stake which thinks this node is above the uptime requirement |
| `weightedAveragePercentage` | `number` | Stake-weighted average of all observed uptimes for this node            |

**Example:**

```typescript
const uptime = await client.info.uptime();
console.log("Rewarding stake percentage:", uptime.rewardingStakePercentage);
console.log("Weighted average percentage:", uptime.weightedAveragePercentage);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/info-rpc#infouptime)

---

### upgrades

Get upgrade history.

**Function Signature:**

```typescript
function upgrades(): Promise<UpgradesReturnType>;

interface UpgradesReturnType {
  apricotPhase1Time: string;
  apricotPhase2Time: string;
  apricotPhase3Time: string;
  apricotPhase4Time: string;
  apricotPhase4MinPChainHeight: number;
  apricotPhase5Time: string;
  apricotPhasePre6Time: string;
  apricotPhase6Time: string;
  apricotPhasePost6Time: string;
  banffTime: string;
  cortinaTime: string;
  cortinaXChainStopVertexID: string;
  durangoTime: string;
  etnaTime: string;
  fortunaTime?: string;
}
```

**Returns:**

| Type                 | Description     |
| -------------------- | --------------- |
| `UpgradesReturnType` | Upgrades object |

**Return Object:**

| Property                       | Type      | Description                                |
| ------------------------------ | --------- | ------------------------------------------ |
| `apricotPhase1Time`            | `string`  | Timestamp of Apricot Phase 1 upgrade       |
| `apricotPhase2Time`            | `string`  | Timestamp of Apricot Phase 2 upgrade       |
| `apricotPhase3Time`            | `string`  | Timestamp of Apricot Phase 3 upgrade       |
| `apricotPhase4Time`            | `string`  | Timestamp of Apricot Phase 4 upgrade       |
| `apricotPhase4MinPChainHeight` | `number`  | Minimum P-Chain height for Apricot Phase 4 |
| `apricotPhase5Time`            | `string`  | Timestamp of Apricot Phase 5 upgrade       |
| `apricotPhasePre6Time`         | `string`  | Timestamp of Apricot Phase Pre-6 upgrade   |
| `apricotPhase6Time`            | `string`  | Timestamp of Apricot Phase 6 upgrade       |
| `apricotPhasePost6Time`        | `string`  | Timestamp of Apricot Phase Post-6 upgrade  |
| `banffTime`                    | `string`  | Timestamp of Banff upgrade                 |
| `cortinaTime`                  | `string`  | Timestamp of Cortina upgrade               |
| `cortinaXChainStopVertexID`    | `string`  | X-Chain stop vertex ID for Cortina upgrade |
| `durangoTime`                  | `string`  | Timestamp of Durango upgrade               |
| `etnaTime`                     | `string`  | Timestamp of Etna upgrade                  |
| `fortunaTime`                  | `string?` | Timestamp of Fortuna upgrade (optional)    |

**Example:**

```typescript
const upgrades = await client.info.upgrades();
console.log("Apricot Phase 1:", upgrades.apricotPhase1Time);
console.log("Banff upgrade:", upgrades.banffTime);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/info-rpc#infoupgrades)

---

### acps

Get peer preferences for Avalanche Community Proposals.

**Function Signature:**

```typescript
function acps(): Promise<AcpsReturnType>;

interface AcpsReturnType {
  acps: Map<
    number,
    {
      supportWeight: bigint;
      supporters: Set<string>;
      objectWeight: bigint;
      objectors: Set<string>;
      abstainWeight: bigint;
    }
  >;
}
```

**Returns:**

| Type             | Description |
| ---------------- | ----------- |
| `AcpsReturnType` | ACPs object |

**Return Object:**

| Property | Type  | Description                              |
| -------- | ----- | ---------------------------------------- |
| `acps`   | `Map` | Map of ACP IDs to their peer preferences |

**ACP Object:**

| Property        | Type          | Description                             |
| --------------- | ------------- | --------------------------------------- |
| `supportWeight` | `bigint`      | Weight of stake supporting the ACP      |
| `supporters`    | `Set<string>` | Set of node IDs supporting the ACP      |
| `objectWeight`  | `bigint`      | Weight of stake objecting to the ACP    |
| `objectors`     | `Set<string>` | Set of node IDs objecting to the ACP    |
| `abstainWeight` | `bigint`      | Weight of stake abstaining from the ACP |

**Example:**

```typescript
const acps = await client.info.acps();
console.log("ACP preferences:", acps.acps);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/info-rpc#infoacps)

---

## Health API Client

Provides health monitoring for the node.

**Access:** `client.health`

### health

Get health check results for the node.

**Function Signature:**

```typescript
function health(params: HealthParameters): Promise<HealthReturnType>;

interface HealthParameters {
  tags?: string[];
}

interface HealthReturnType {
  healthy: boolean;
  checks: {
    C: ChainHealthCheck;
    P: ChainHealthCheck;
    X: ChainHealthCheck;
    bootstrapped: {
      message: any[];
      timestamp: string;
      duration: number;
    };
    database: {
      timestamp: string;
      duration: number;
    };
    diskspace: {
      message: {
        availableDiskBytes: number;
      };
      timestamp: string;
      duration: number;
    };
    network: {
      message: {
        connectedPeers: number;
        sendFailRate: number;
        timeSinceLastMsgReceived: string;
        timeSinceLastMsgSent: string;
      };
      timestamp: string;
      duration: number;
    };
    router: {
      message: {
        longestRunningRequest: string;
        outstandingRequests: number;
      };
      timestamp: string;
      duration: number;
    };
  };
}

type ChainHealthCheck = {
  message: {
    engine: {
      consensus: {
        lastAcceptedHeight: number;
        lastAcceptedID: string;
        longestProcessingBlock: string;
        processingBlocks: number;
      };
      vm: null;
    };
    networking: {
      percentConnected: number;
    };
  };
  timestamp: string;
  duration: number;
};
```

**Parameters:**

| Name   | Type       | Required | Description                           |
| ------ | ---------- | -------- | ------------------------------------- |
| `tags` | `string[]` | No       | Optional tags to filter health checks |

**Returns:**

| Type               | Description          |
| ------------------ | -------------------- |
| `HealthReturnType` | Health check results |

**Return Object:**

| Property  | Type      | Description                             |
| --------- | --------- | --------------------------------------- |
| `healthy` | `boolean` | Overall health status of the node       |
| `checks`  | `object`  | Health check results for each component |

**Example:**

```typescript
const healthStatus = await client.health.health({
  tags: ["11111111111111111111111111111111LpoYY"],
});

console.log("Node healthy:", healthStatus.healthy);
console.log("C-Chain health:", healthStatus.checks.C);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/health-rpc#healthhealth)

---

### liveness

Get liveness check indicating if the node is alive and can handle requests.

**Function Signature:**

```typescript
function liveness(): Promise<LivenessReturnType>;

interface LivenessReturnType {
  checks: object;
  healthy: boolean;
}
```

**Returns:**

| Type                 | Description           |
| -------------------- | --------------------- |
| `LivenessReturnType` | Liveness check result |

**Return Object:**

| Property  | Type      | Description                                            |
| --------- | --------- | ------------------------------------------------------ |
| `checks`  | `object`  | Liveness check details                                 |
| `healthy` | `boolean` | Indicates if the node is alive and can handle requests |

**Example:**

```typescript
const livenessStatus = await client.health.liveness();

if (livenessStatus.healthy) {
  console.log("Node is alive and responding");
}
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/health-rpc#healthliveness)

---

### readiness

Get readiness check indicating if the node has finished initializing.

**Function Signature:**

```typescript
function readiness(params: ReadinessParameters): Promise<ReadinessReturnType>;

interface ReadinessParameters {
  tags?: string[];
}

interface ReadinessReturnType {
  checks: {
    [key: string]: {
      message: {
        timestamp: string;
        duration: number;
        contiguousFailures: number;
        timeOfFirstFailure: string | null;
      };
      healthy: boolean;
    };
  };
  healthy: boolean;
}
```

**Parameters:**

| Name   | Type       | Required | Description                              |
| ------ | ---------- | -------- | ---------------------------------------- |
| `tags` | `string[]` | No       | Optional tags to filter readiness checks |

**Returns:**

| Type                  | Description            |
| --------------------- | ---------------------- |
| `ReadinessReturnType` | Readiness check result |

**Return Object:**

| Property  | Type      | Description                                |
| --------- | --------- | ------------------------------------------ |
| `checks`  | `object`  | Readiness check results for each component |
| `healthy` | `boolean` | Overall readiness status of the node       |

**Example:**

```typescript
const readinessStatus = await client.health.readiness({
  tags: ["11111111111111111111111111111111LpoYY"],
});

if (readinessStatus.healthy) {
  console.log("Node is ready to handle requests");
}
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/health-rpc#healthreadiness)

---

## Index API Clients

Provides indexed blockchain data queries for fast container lookups.

**Access:**

- `client.indexBlock.pChain` - P-Chain block index
- `client.indexBlock.cChain` - C-Chain block index
- `client.indexBlock.xChain` - X-Chain block index
- `client.indexTx.xChain` - X-Chain transaction index

### getContainerByIndex

Get container by its index.

**Function Signature:**

```typescript
function getContainerByIndex(
  params: GetContainerByIndexParameters,
): Promise<GetContainerByIndexReturnType>;

interface GetContainerByIndexParameters {
  index: number;
  encoding: "hex";
}

interface GetContainerByIndexReturnType {
  id: string;
  bytes: string;
  timestamp: string;
  encoding: "hex";
  index: string;
}
```

**Parameters:**

| Name       | Type     | Required | Description                                     |
| ---------- | -------- | -------- | ----------------------------------------------- |
| `index`    | `number` | Yes      | Container index (first container is at index 0) |
| `encoding` | `"hex"`  | Yes      | Encoding format (only "hex" is supported)       |

**Returns:**

| Type                            | Description      |
| ------------------------------- | ---------------- |
| `GetContainerByIndexReturnType` | Container object |

**Return Object:**

| Property    | Type     | Description                                       |
| ----------- | -------- | ------------------------------------------------- |
| `id`        | `string` | Container's ID                                    |
| `bytes`     | `string` | Byte representation of the container              |
| `timestamp` | `string` | Time at which this node accepted the container    |
| `encoding`  | `"hex"`  | Encoding format used                              |
| `index`     | `string` | How many containers were accepted before this one |

**Example:**

```typescript
const container = await client.indexBlock.pChain.getContainerByIndex({
  index: 12345,
  encoding: "hex",
});

console.log("Container ID:", container.id);
console.log("Container bytes:", container.bytes);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/index-rpc#indexgetcontainerbyindex)

---

### getContainerByID

Get container by its ID.

**Function Signature:**

```typescript
function getContainerByID(
  params: GetContainerByIDParameters,
): Promise<GetContainerByIDReturnType>;

interface GetContainerByIDParameters {
  id: string;
  encoding: "hex";
}

interface GetContainerByIDReturnType {
  id: string;
  bytes: string;
  timestamp: string;
  encoding: "hex";
  index: string;
}
```

**Parameters:**

| Name       | Type     | Required | Description                               |
| ---------- | -------- | -------- | ----------------------------------------- |
| `id`       | `string` | Yes      | Container's ID                            |
| `encoding` | `"hex"`  | Yes      | Encoding format (only "hex" is supported) |

**Returns:**

| Type                         | Description      |
| ---------------------------- | ---------------- |
| `GetContainerByIDReturnType` | Container object |

**Return Object:**

| Property    | Type     | Description                                       |
| ----------- | -------- | ------------------------------------------------- |
| `id`        | `string` | Container's ID                                    |
| `bytes`     | `string` | Byte representation of the container              |
| `timestamp` | `string` | Time at which this node accepted the container    |
| `encoding`  | `"hex"`  | Encoding format used                              |
| `index`     | `string` | How many containers were accepted before this one |

**Example:**

```typescript
const container = await client.indexBlock.cChain.getContainerByID({
  id: "0x123...",
  encoding: "hex",
});

console.log("Container index:", container.index);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/index-rpc#indexgetcontainerbyid)

---

### getContainerRange

Get range of containers by index.

**Function Signature:**

```typescript
function getContainerRange(
  params: GetContainerRangeParameters,
): Promise<GetContainerRangeReturnType>;

interface GetContainerRangeParameters {
  startIndex: number;
  endIndex: number;
  encoding: "hex";
}

interface GetContainerRangeReturnType {
  containers: Array<{
    id: string;
    bytes: string;
    timestamp: string;
    encoding: "hex";
    index: string;
  }>;
}
```

**Parameters:**

| Name         | Type     | Required | Description                                         |
| ------------ | -------- | -------- | --------------------------------------------------- |
| `startIndex` | `number` | Yes      | Index of the first container to retrieve            |
| `endIndex`   | `number` | Yes      | Index of the last container to retrieve (inclusive) |
| `encoding`   | `"hex"`  | Yes      | Encoding format (only "hex" is supported)           |

**Returns:**

| Type                          | Description            |
| ----------------------------- | ---------------------- |
| `GetContainerRangeReturnType` | Container range object |

**Return Object:**

| Property     | Type    | Description                |
| ------------ | ------- | -------------------------- |
| `containers` | `array` | Array of container details |

**Container Object:**

| Property    | Type     | Description                                       |
| ----------- | -------- | ------------------------------------------------- |
| `id`        | `string` | Container's ID                                    |
| `bytes`     | `string` | Byte representation of the container              |
| `timestamp` | `string` | Time at which this node accepted the container    |
| `encoding`  | `"hex"`  | Encoding format used                              |
| `index`     | `string` | How many containers were accepted before this one |

**Example:**

```typescript
const range = await client.indexBlock.xChain.getContainerRange({
  startIndex: 1000,
  endIndex: 1010,
  encoding: "hex",
});

console.log("Containers:", range.containers.length);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/index-rpc#indexgetcontainerrange)

---

### getIndex

Get container index by ID.

**Function Signature:**

```typescript
function getIndex(params: GetIndexParameters): Promise<GetIndexReturnType>;

interface GetIndexParameters {
  id: string;
  encoding: "hex";
}

interface GetIndexReturnType {
  index: string;
}
```

**Parameters:**

| Name       | Type     | Required | Description                               |
| ---------- | -------- | -------- | ----------------------------------------- |
| `id`       | `string` | Yes      | Container's ID                            |
| `encoding` | `"hex"`  | Yes      | Encoding format (only "hex" is supported) |

**Returns:**

| Type                 | Description  |
| -------------------- | ------------ |
| `GetIndexReturnType` | Index object |

**Return Object:**

| Property | Type     | Description                                            |
| -------- | -------- | ------------------------------------------------------ |
| `index`  | `string` | Index of the container (first container is at index 0) |

**Example:**

```typescript
const result = await client.indexTx.xChain.getIndex({
  id: "0x123...",
  encoding: "hex",
});

console.log("Container index:", result.index);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/index-rpc#indexgetindex)

---

### getLastAccepted

Get last accepted container.

**Function Signature:**

```typescript
function getLastAccepted(
  params: GetLastAcceptedParameters,
): Promise<GetLastAcceptedReturnType>;

interface GetLastAcceptedParameters {
  encoding: "hex";
}

interface GetLastAcceptedReturnType {
  id: string;
  bytes: string;
  timestamp: string;
  encoding: "hex";
  index: string;
}
```

**Parameters:**

| Name       | Type    | Required | Description                               |
| ---------- | ------- | -------- | ----------------------------------------- |
| `encoding` | `"hex"` | Yes      | Encoding format (only "hex" is supported) |

**Returns:**

| Type                        | Description                    |
| --------------------------- | ------------------------------ |
| `GetLastAcceptedReturnType` | Last accepted container object |

**Return Object:**

| Property    | Type     | Description                                       |
| ----------- | -------- | ------------------------------------------------- |
| `id`        | `string` | Container's ID                                    |
| `bytes`     | `string` | Byte representation of the container              |
| `timestamp` | `string` | Time at which this node accepted the container    |
| `encoding`  | `"hex"`  | Encoding format used                              |
| `index`     | `string` | How many containers were accepted before this one |

**Example:**

```typescript
const lastAccepted = await client.indexBlock.pChain.getLastAccepted({
  encoding: "hex",
});

console.log("Last accepted container ID:", lastAccepted.id);
console.log("Last accepted index:", lastAccepted.index);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/index-rpc#indexgetlastaccepted)

---

### isAccepted

Check if container is accepted in the index.

**Function Signature:**

```typescript
function isAccepted(
  params: IsAcceptedParameters,
): Promise<IsAcceptedReturnType>;

interface IsAcceptedParameters {
  id: string;
  encoding: "hex";
}

interface IsAcceptedReturnType {
  isAccepted: boolean;
}
```

**Parameters:**

| Name       | Type     | Required | Description                               |
| ---------- | -------- | -------- | ----------------------------------------- |
| `id`       | `string` | Yes      | Container's ID                            |
| `encoding` | `"hex"`  | Yes      | Encoding format (only "hex" is supported) |

**Returns:**

| Type                   | Description              |
| ---------------------- | ------------------------ |
| `IsAcceptedReturnType` | Acceptance status object |

**Return Object:**

| Property     | Type      | Description                            |
| ------------ | --------- | -------------------------------------- |
| `isAccepted` | `boolean` | Whether the container is in this index |

**Example:**

```typescript
const result = await client.indexBlock.cChain.isAccepted({
  id: "0x123...",
  encoding: "hex",
});

if (result.isAccepted) {
  console.log("Container is accepted");
} else {
  console.log("Container is not accepted");
}
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/other/index-rpc#indexisaccepted)

---

## ProposerVM API Client

Provides ProposerVM operations for each chain. ProposerVM is responsible for proposing blocks and managing consensus.

**Access:**

- `client.proposerVM.pChain` - P-Chain ProposerVM
- `client.proposerVM.xChain` - X-Chain ProposerVM
- `client.proposerVM.cChain` - C-Chain ProposerVM

### getProposedHeight

Get the current proposed height for the chain.

**Function Signature:**

```typescript
function getProposedHeight(): Promise<GetProposedHeightReturnType>;

interface GetProposedHeightReturnType {
  height: string;
}
```

**Returns:**

| Type                          | Description            |
| ----------------------------- | ---------------------- |
| `GetProposedHeightReturnType` | Proposed height object |

**Return Object:**

| Property | Type     | Description                            |
| -------- | -------- | -------------------------------------- |
| `height` | `string` | This node's current proposer VM height |

**Example:**

```typescript
const pChainHeight = await client.proposerVM.pChain.getProposedHeight();
console.log("P-Chain proposed height:", pChainHeight.height);

const xChainHeight = await client.proposerVM.xChain.getProposedHeight();
console.log("X-Chain proposed height:", xChainHeight.height);

const cChainHeight = await client.proposerVM.cChain.getProposedHeight();
console.log("C-Chain proposed height:", cChainHeight.height);
```

**Related:**

- [API Reference](https://build.avax.network/docs/api-reference/proposervm-api#proposervmgetproposedheight)

---

### getCurrentEpoch

Get the current epoch information.

**Function Signature:**

```typescript
function getCurrentEpoch(): Promise<GetCurrentEpochReturnType>;

interface GetCurrentEpochReturnType {
  number: string;
  startTime: string;
  pChainHeight: string;
}
```

**Returns:**

| Type                        | Description          |
| --------------------------- | -------------------- |
| `GetCurrentEpochReturnType` | Current epoch object |

**Return Object:**

| Property       | Type     | Description                                   |
| -------------- | -------- | --------------------------------------------- |
| `number`       | `string` | The current epoch number                      |
| `startTime`    | `string` | The epoch start time (Unix timestamp)         |
| `pChainHeight` | `string` | The P-Chain height at the start of this epoch |

**Example:**

```typescript
const epoch = await client.proposerVM.pChain.getCurrentEpoch();
console.log("Current epoch:", epoch.number);
console.log("Epoch start time:", epoch.startTime);
console.log("P-Chain height at epoch start:", epoch.pChainHeight);
```

**Related:**

- [API Reference](https://build.avax.network/docs/api-reference/proposervm-api#proposervmgetcurrentepoch)

---

## Next Steps

- **[API Clients Documentation](clients/api-clients)** - Detailed API client reference
- **[Main Clients](clients)** - Client architecture overview
- **[Getting Started](getting-started)** - Quick start guide

# Wallet Methods (/docs/tooling/avalanche-sdk/client/methods/wallet-methods/wallet)

---

title: Wallet Methods
description: Complete reference for Avalanche wallet operations

---

## Overview

The Avalanche Wallet Client provides methods for sending transactions, signing messages and transactions, and managing accounts across all Avalanche chains (P-Chain, X-Chain, and C-Chain). This reference covers all wallet-specific methods available through the Avalanche Wallet Client SDK.

**Access:** `walletClient`

## send

Send tokens from the source chain to the destination chain. Automatically handles cross-chain transfers when needed.

**Function Signature:**

```typescript
function send(params: SendParameters): Promise<SendReturnType>;

interface SendParameters {
  account?: AvalancheAccount;
  amount: bigint;
  to: Address | XPAddress;
  from?: Address | XPAddress;
  sourceChain?: "P" | "C";
  destinationChain?: "P" | "C";
  token?: "AVAX";
  context?: Context;
}

interface SendReturnType {
  txHashes: TransactionDetails[];
}

interface TransactionDetails {
  txHash: string;
  chainAlias: "P" | "C";
}
```

**Parameters:**

| Name               | Type                   | Required | Description                                           |
| ------------------ | ---------------------- | -------- | ----------------------------------------------------- |
| `account`          | `AvalancheAccount`     | No       | Account to send from (uses client account if omitted) |
| `amount`           | `bigint`               | Yes      | Amount to send in wei                                 |
| `to`               | `Address \| XPAddress` | Yes      | Destination address                                   |
| `from`             | `Address \| XPAddress` | No       | Source address (defaults to account address)          |
| `sourceChain`      | `"P" \| "C"`           | No       | Source chain (default: "C")                           |
| `destinationChain` | `"P" \| "C"`           | No       | Destination chain (default: "C")                      |
| `token`            | `"AVAX"`               | No       | Token to send (only AVAX supported)                   |
| `context`          | `Context`              | No       | Transaction context (auto-fetched if omitted)         |

**Returns:**

| Type             | Description               |
| ---------------- | ------------------------- |
| `SendReturnType` | Transaction hashes object |

**Return Object:**

| Property   | Type                   | Description                  |
| ---------- | ---------------------- | ---------------------------- |
| `txHashes` | `TransactionDetails[]` | Array of transaction details |

**Transaction Details Object:**

| Property     | Type         | Description                        |
| ------------ | ------------ | ---------------------------------- |
| `txHash`     | `string`     | The hash of the transaction        |
| `chainAlias` | `"P" \| "C"` | The chain alias of the transaction |

**Example:**

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalanche } from "@avalanche-sdk/client/chains";
import { avaxToWei, avaxToNanoAvax } from "@avalanche-sdk/client/utils";

const account = privateKeyToAvalancheAccount("0x...");

const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: { type: "http" },
});

// Send AVAX on C-Chain
const result = await walletClient.send({
  to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  amount: avaxToWei(0.001),
  destinationChain: "C",
});

console.log("Transaction hash:", result.txHashes[0].txHash);

// Send AVAX from C-Chain to P-Chain
const crossChainResult = await walletClient.send({
  to: "P-avax1example...",
  amount: avaxToWei(1),
  sourceChain: "C",
  destinationChain: "P",
});

console.log("Transfer transactions:", crossChainResult.txHashes);
```

**Related:**

- [waitForTxn](#waitfortxn) - Wait for transaction confirmation
- [signXPMessage](#signxpmessage) - Sign messages

---

## getAccountPubKey

Get the public key associated with the wallet account in both EVM and XP formats.

**Function Signature:**

```typescript
function getAccountPubKey(): Promise<GetAccountPubKeyReturnType>;

interface GetAccountPubKeyReturnType {
  evm: string;
  xp: string;
}
```

**Returns:**

| Type                         | Description        |
| ---------------------------- | ------------------ |
| `GetAccountPubKeyReturnType` | Public keys object |

**Return Object:**

| Property | Type     | Description              |
| -------- | -------- | ------------------------ |
| `evm`    | `string` | Public key in EVM format |
| `xp`     | `string` | Public key in XP format  |

**Example:**

```typescript
const pubKeys = await walletClient.getAccountPubKey();

console.log("EVM public key:", pubKeys.evm);
console.log("XP public key:", pubKeys.xp);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/x-chain#avmgetaccountpubkey)
- [Account Management](../accounts) - Account types and management

---

## waitForTxn

Wait for a transaction to be confirmed on the network.

**Function Signature:**

```typescript
function waitForTxn(params: WaitForTxnParameters): Promise<void>;

interface WaitForTxnParameters {
  txHash: string;
  chainAlias: "X" | "P" | "C";
  sleepTime?: number;
  maxRetries?: number;
}
```

**Parameters:**

| Name         | Type                | Required | Description                                                  |
| ------------ | ------------------- | -------- | ------------------------------------------------------------ |
| `txHash`     | `string`            | Yes      | Transaction hash                                             |
| `chainAlias` | `"X" \| "P" \| "C"` | Yes      | Chain where transaction was submitted                        |
| `sleepTime`  | `number`            | No       | Time to sleep between retries in milliseconds (default: 300) |
| `maxRetries` | `number`            | No       | Maximum number of retries (default: 10)                      |

**Returns:**

| Type            | Description                                                                         |
| --------------- | ----------------------------------------------------------------------------------- |
| `Promise<void>` | Promise that resolves when transaction is confirmed or rejects if transaction fails |

**Example:**

```typescript
const txHash = "0x...";

try {
  await walletClient.waitForTxn({
    txHash,
    chainAlias: "C",
    sleepTime: 500, // Wait 500ms between checks
    maxRetries: 20, // Check up to 20 times
  });

  console.log("Transaction confirmed!");
} catch (error) {
  console.error("Transaction failed:", error);
}
```

**Related:**

- [send](#send) - Send transactions
- [Client tx status methods](../public-methods) - Check transaction status manually

---

## sendXPTransaction

Send a signed XP transaction to the network (X-Chain, P-Chain, or C-Chain).

**Function Signature:**

```typescript
function sendXPTransaction(
  params: SendXPTransactionParameters,
): Promise<SendXPTransactionReturnType>;

interface SendXPTransactionParameters {
  account?: AvalancheAccount | Address;
  tx: string | UnsignedTx;
  chainAlias: "X" | "P" | "C";
  externalIndices?: number[];
  internalIndices?: number[];
  utxoIds?: string[];
  feeTolerance?: number;
  subnetAuth?: number[];
  subnetOwners?: PChainOwner;
  disableOwners?: PChainOwner;
  disableAuth?: number[];
}

interface SendXPTransactionReturnType {
  txHash: string;
  chainAlias: "X" | "P" | "C";
}
```

**Parameters:**

| Name              | Type                          | Required | Description                                           |
| ----------------- | ----------------------------- | -------- | ----------------------------------------------------- |
| `account`         | `AvalancheAccount \| Address` | No       | Account to use for the transaction                    |
| `tx`              | `string \| UnsignedTx`        | Yes      | Transaction to send (hex string or UnsignedTx object) |
| `chainAlias`      | `"X" \| "P" \| "C"`           | Yes      | Target chain                                          |
| `externalIndices` | `number[]`                    | No       | External indices to use for the transaction           |
| `internalIndices` | `number[]`                    | No       | Internal indices to use for the transaction           |
| `utxoIds`         | `string[]`                    | No       | UTXO IDs to use for the transaction                   |
| `feeTolerance`    | `number`                      | No       | Fee tolerance to use for the transaction              |
| `subnetAuth`      | `number[]`                    | No       | Subnet auth to use for the transaction                |
| `subnetOwners`    | `PChainOwner`                 | No       | Subnet owners to use for the transaction              |
| `disableOwners`   | `PChainOwner`                 | No       | Disable owners to use for the transaction             |
| `disableAuth`     | `number[]`                    | No       | Disable auth to use for the transaction               |

**Returns:**

| Type                          | Description             |
| ----------------------------- | ----------------------- |
| `SendXPTransactionReturnType` | Transaction hash object |

**Return Object:**

| Property     | Type                | Description                 |
| ------------ | ------------------- | --------------------------- |
| `txHash`     | `string`            | The hash of the transaction |
| `chainAlias` | `"X" \| "P" \| "C"` | The chain alias             |

**Example:**

```typescript
// This is typically used with prepare methods from chain-specific wallets
const unsignedTx = await walletClient.pChain.prepareBaseTxn({
  outputs: [
    {
      addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
      amount: avaxToNanoAvax(1),
    },
  ],
});

const signedTx = await walletClient.signXPTransaction({
  tx: unsignedTx.tx,
  chainAlias: "P",
});

const { txHash } = await walletClient.sendXPTransaction({
  tx: signedTx.signedTxHex,
  chainAlias: "P",
});

console.log("Transaction hash:", txHash);
```

**Related:**

- [signXPTransaction](#signxptransaction) - Sign transactions
- [P-Chain Wallet Methods](./p-chain-wallet) - P-Chain transaction preparation
- [X-Chain Wallet Methods](./x-chain-wallet) - X-Chain transaction preparation

---

## signXPTransaction

Sign an XP transaction (X-Chain, P-Chain, or C-Chain).

**Function Signature:**

```typescript
function signXPTransaction(
  params: SignXPTransactionParameters,
): Promise<SignXPTransactionReturnType>;

interface SignXPTransactionParameters {
  account?: AvalancheAccount | Address;
  tx?: string | UnsignedTx;
  signedTxHex?: string;
  chainAlias: "X" | "P" | "C";
  utxoIds?: string[];
  subnetAuth?: number[];
  subnetOwners?: PChainOwner;
  disableOwners?: PChainOwner;
  disableAuth?: number[];
  context?: Context;
}

interface Signatures {
  signature: string;
  sigIndices: number[];
}

interface SignXPTransactionReturnType {
  signedTxHex: string;
  signatures: Signatures[];
  chainAlias: "X" | "P" | "C";
  subnetAuth?: number[];
  subnetOwners?: PChainOwner;
  disableOwners?: PChainOwner;
  disableAuth?: number[];
}
```

**Parameters:**

| Name            | Type                          | Required | Description                                                                  |
| --------------- | ----------------------------- | -------- | ---------------------------------------------------------------------------- |
| `account`       | `AvalancheAccount \| Address` | No       | Account to use for the transaction                                           |
| `tx`            | `string \| UnsignedTx`        | No       | Unsigned transaction (either `tx` or `signedTxHex` must be provided)         |
| `signedTxHex`   | `string`                      | No       | Pre-signed transaction bytes (either `tx` or `signedTxHex` must be provided) |
| `chainAlias`    | `"X" \| "P" \| "C"`           | Yes      | Target chain                                                                 |
| `utxoIds`       | `string[]`                    | No       | UTXO IDs to use for the transaction                                          |
| `subnetAuth`    | `number[]`                    | No       | Subnet auth to use for the transaction                                       |
| `subnetOwners`  | `PChainOwner`                 | No       | Subnet owners to use for the transaction                                     |
| `disableOwners` | `PChainOwner`                 | No       | Disable owners to use for the transaction                                    |
| `disableAuth`   | `number[]`                    | No       | Disable auth to use for the transaction                                      |
| `context`       | `Context`                     | No       | Transaction context (auto-fetched if omitted)                                |

**Returns:**

| Type                          | Description               |
| ----------------------------- | ------------------------- |
| `SignXPTransactionReturnType` | Signed transaction object |

**Return Object:**

| Property        | Type                | Description                             |
| --------------- | ------------------- | --------------------------------------- |
| `signedTxHex`   | `string`            | The signed transaction in hex format    |
| `signatures`    | `Signatures[]`      | Array of signatures for the transaction |
| `chainAlias`    | `"X" \| "P" \| "C"` | The chain alias                         |
| `subnetAuth`    | `number[]?`         | Subnet auth used for the transaction    |
| `subnetOwners`  | `PChainOwner?`      | Subnet owners used for the transaction  |
| `disableOwners` | `PChainOwner?`      | Disable owners used for the transaction |
| `disableAuth`   | `number[]?`         | Disable auth used for the transaction   |

**Signatures Object:**

| Property     | Type       | Description                                                               |
| ------------ | ---------- | ------------------------------------------------------------------------- |
| `signature`  | `string`   | The signature of the transaction with the current account                 |
| `sigIndices` | `number[]` | The indices of the signatures. Contains [inputIndex, signatureIndex] pair |

**Example:**

```typescript
const unsignedTx = await walletClient.pChain.prepareBaseTxn({
  outputs: [
    {
      addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
      amount: avaxToNanoAvax(0.1),
    },
  ],
});

const signedTx = await walletClient.signXPTransaction({
  tx: unsignedTx.tx,
  chainAlias: "P",
});

// Now send the signed transaction
const { txHash } = await walletClient.sendXPTransaction({
  tx: signedTx.signedTxHex,
  chainAlias: "P",
});

console.log("Transaction hash:", txHash);
```

**Related:**

- [sendXPTransaction](#sendxptransaction) - Send signed transaction
- [signXPMessage](#signxpmessage) - Sign messages

---

## signXPMessage

Sign a message with an XP account (P-Chain or X-Chain addresses).

**Function Signature:**

```typescript
function signXPMessage(
  params: SignXPMessageParameters,
): Promise<SignXPMessageReturnType>;

interface SignXPMessageParameters {
  account?: AvalancheAccount | Address;
  message: string;
  accountIndex?: number;
}

interface SignXPMessageReturnType {
  signature: string;
}
```

**Parameters:**

| Name           | Type                          | Required | Description                                                                       |
| -------------- | ----------------------------- | -------- | --------------------------------------------------------------------------------- |
| `account`      | `AvalancheAccount \| Address` | No       | Account to use for the message                                                    |
| `message`      | `string`                      | Yes      | Message to sign                                                                   |
| `accountIndex` | `number`                      | No       | Account index to use for the message from custom transport (e.g., core extension) |

**Returns:**

| Type                      | Description              |
| ------------------------- | ------------------------ |
| `SignXPMessageReturnType` | Message signature object |

**Return Object:**

| Property    | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| `signature` | `string` | Hex-encoded signature of the message |

**Example:**

```typescript
const { signature } = await walletClient.signXPMessage({
  message: "Hello Avalanche",
});

console.log("Signature:", signature);
```

**Related:**

- [API Reference](https://build.avax.network/docs/rpcs/x-chain#avmsignmessage)
- [signXPTransaction](#signxptransaction) - Sign transactions

---

## EVM Transaction Methods

The Avalanche Wallet Client extends viem's Wallet Client, providing access to all standard Ethereum transaction methods.

### Standard viem Methods

```typescript
// Send transaction
const hash = await walletClient.sendTransaction({
  to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  value: parseEther("0.001"),
});

// Sign message
const signature = await walletClient.signMessage({
  message: "Hello World",
});

// Sign typed data (EIP-712)
const typedSignature = await walletClient.signTypedData({
  domain: { ... },
  types: { ... },
  primaryType: "Message",
  message: { ... },
});
```

**For complete EVM wallet method reference, see:** [Viem Documentation](https://viem.sh/docs)

---

## Chain-Specific Wallet Operations

### P-Chain Wallet Operations

Access through `walletClient.pChain`:

```typescript
// Prepare base transaction
const baseTx = await walletClient.pChain.prepareBaseTxn({
  outputs: [
    {
      addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
      amount: avaxToNanoAvax(1),
    },
  ],
});

// Prepare export transaction
const exportTx = await walletClient.pChain.prepareExportTxn({
  destinationChain: "C",
  exportedOutputs: [
    {
      addresses: ["0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"],
      amount: avaxToNanoAvax(1),
    },
  ],
});

// Prepare import transaction
const importTx = await walletClient.pChain.prepareImportTxn({
  sourceChain: "C",
  importedOutput: {
    addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
  },
});
```

See [P-Chain Wallet Methods](./p-chain-wallet) for complete reference.

### X-Chain Wallet Operations

Access through `walletClient.xChain`:

```typescript
// Prepare base transaction
const baseTx = await walletClient.xChain.prepareBaseTxn({
  outputs: [
    {
      addresses: ["X-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
      amount: avaxToNanoAvax(1),
    },
  ],
});
```

See [X-Chain Wallet Methods](./x-chain-wallet) for complete reference.

### C-Chain Wallet Operations

Access through `walletClient.cChain`:

```typescript
// Prepare export transaction
const exportTx = await walletClient.cChain.prepareExportTxn({
  destinationChain: "P",
  fromAddress: account.getEVMAddress(),
  exportedOutput: {
    addresses: [account.getXPAddress("P")],
    amount: avaxToNanoAvax(1),
  },
});

// Prepare import transaction
const importTx = await walletClient.cChain.prepareImportTxn({
  sourceChain: "P",
  toAddress: account.getEVMAddress(),
});
```

See [C-Chain Wallet Methods](./c-chain-wallet) for complete reference.

---

## Next Steps

- **[P-Chain Wallet Methods](./p-chain-wallet)** - P-Chain transaction preparation
- **[X-Chain Wallet Methods](./x-chain-wallet)** - X-Chain transaction preparation
- **[C-Chain Wallet Methods](./c-chain-wallet)** - C-Chain atomic transactions
- **[Account Management](../accounts)** - Account types and creation
- **[Viem Documentation](https://viem.sh/docs)** - Complete EVM wallet reference

# P-Chain Wallet Methods (/docs/tooling/avalanche-sdk/client/methods/wallet-methods/p-chain-wallet)

---

title: P-Chain Wallet Methods
description: Complete reference for P-Chain transaction preparation methods

---

## Overview

The P-Chain Wallet Methods provide transaction preparation capabilities for the Platform Chain. These methods allow you to create unsigned transactions for various operations including base transfers, validator operations, delegator operations, subnet management, and cross-chain transfers.

**Access:** `walletClient.pChain`

## prepareBaseTxn

Prepare a base P-Chain transaction for transferring AVAX.

**Function Signature:**

```typescript
function prepareBaseTxn(
  params: PrepareBaseTxnParameters,
): Promise<PrepareBaseTxnReturnType>;

interface PrepareBaseTxnParameters {
  outputs?: Output[];
  fromAddresses?: string[];
  changeAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface Output {
  addresses: string[];
  amount: bigint;
  assetId?: string;
  locktime?: bigint;
  threshold?: number;
}

interface PrepareBaseTxnReturnType {
  tx: UnsignedTx;
  baseTx: BaseTx;
  chainAlias: "P";
}
```

**Parameters:**

| Name              | Type       | Required | Description                                   |
| ----------------- | ---------- | -------- | --------------------------------------------- |
| `outputs`         | `Output[]` | No       | Array of outputs to send funds to             |
| `fromAddresses`   | `string[]` | No       | Addresses to send funds from                  |
| `changeAddresses` | `string[]` | No       | Addresses to receive change                   |
| `utxos`           | `Utxo[]`   | No       | UTXOs to use as inputs                        |
| `memo`            | `string`   | No       | Transaction memo                              |
| `minIssuanceTime` | `bigint`   | No       | Earliest time this transaction can be issued  |
| `context`         | `Context`  | No       | Transaction context (auto-fetched if omitted) |

**Output Object:**

| Name        | Type       | Required | Description                                                        |
| ----------- | ---------- | -------- | ------------------------------------------------------------------ |
| `addresses` | `string[]` | Yes      | Addresses who can sign the consuming of this UTXO                  |
| `amount`    | `bigint`   | Yes      | Amount in nano AVAX                                                |
| `assetId`   | `string`   | No       | Asset ID of the UTXO                                               |
| `locktime`  | `bigint`   | No       | Timestamp in seconds after which this UTXO can be consumed         |
| `threshold` | `number`   | No       | Threshold of `addresses`' signatures required to consume this UTXO |

**Returns:**

| Type                       | Description             |
| -------------------------- | ----------------------- |
| `PrepareBaseTxnReturnType` | Base transaction object |

**Return Object:**

| Property     | Type         | Description                   |
| ------------ | ------------ | ----------------------------- |
| `tx`         | `UnsignedTx` | The unsigned transaction      |
| `baseTx`     | `BaseTx`     | The base transaction instance |
| `chainAlias` | `"P"`        | The chain alias               |

**Example:**

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalanche } from "@avalanche-sdk/client/chains";
import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";

const account = privateKeyToAvalancheAccount("0x...");

const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: { type: "http" },
});

const unsignedTx = await walletClient.pChain.prepareBaseTxn({
  outputs: [
    {
      addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
      amount: avaxToNanoAvax(1),
    },
  ],
});

// Sign and send
const signedTx = await walletClient.signXPTransaction({
  tx: unsignedTx.tx,
  chainAlias: "P",
});

const { txHash } = await walletClient.sendXPTransaction({
  txOrTxHex: signedTx.signedTxHex,
  chainAlias: "P",
});

console.log("Transaction hash:", txHash);
```

**Related:**

- [prepareExportTxn](#prepareexporttxn) - Cross-chain exports
- [prepareImportTxn](#prepareimporttxn) - Cross-chain imports

---

## prepareAddPermissionlessValidatorTxn

Prepare a transaction to add a permissionless validator to the Primary Network.

**Function Signature:**

```typescript
function prepareAddPermissionlessValidatorTxn(
  params: PrepareAddPermissionlessValidatorTxnParameters,
): Promise<PrepareAddPermissionlessValidatorTxnReturnType>;

interface PrepareAddPermissionlessValidatorTxnParameters {
  nodeId: string;
  stakeInAvax: bigint;
  end: bigint;
  rewardAddresses: string[];
  delegatorRewardAddresses: string[];
  delegatorRewardPercentage: number;
  publicKey?: string;
  signature?: string;
  threshold?: number;
  locktime?: bigint;
  fromAddresses?: string[];
  changeAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface PrepareAddPermissionlessValidatorTxnReturnType {
  tx: UnsignedTx;
  addPermissionlessValidatorTx: AddPermissionlessValidatorTx;
  chainAlias: "P";
}
```

**Parameters:**

| Name                        | Type       | Required | Description                                                                       |
| --------------------------- | ---------- | -------- | --------------------------------------------------------------------------------- |
| `nodeId`                    | `string`   | Yes      | Node ID of the validator being added                                              |
| `stakeInAvax`               | `bigint`   | Yes      | Amount of AVAX to stake (in nano AVAX)                                            |
| `end`                       | `bigint`   | Yes      | Unix time in seconds when validator will be removed                               |
| `rewardAddresses`           | `string[]` | Yes      | Addresses which will receive validator rewards                                    |
| `delegatorRewardAddresses`  | `string[]` | Yes      | Addresses which will receive delegator fee rewards                                |
| `delegatorRewardPercentage` | `number`   | Yes      | Percentage of delegator rewards as delegation fee (2-100, up to 3 decimal places) |
| `publicKey`                 | `string`   | No       | BLS public key (in hex format)                                                    |
| `signature`                 | `string`   | No       | BLS signature (in hex format)                                                     |
| `threshold`                 | `number`   | No       | Number of signatures required to spend reward UTXO (default: 1)                   |
| `locktime`                  | `bigint`   | No       | Unix timestamp after which reward UTXO can be spent (default: 0)                  |
| `fromAddresses`             | `string[]` | No       | Addresses to send funds from                                                      |
| `changeAddresses`           | `string[]` | No       | Addresses to receive change                                                       |
| `utxos`                     | `Utxo[]`   | No       | UTXOs to use as inputs                                                            |
| `memo`                      | `string`   | No       | Transaction memo                                                                  |
| `minIssuanceTime`           | `bigint`   | No       | Earliest time this transaction can be issued                                      |
| `context`                   | `Context`  | No       | Transaction context (auto-fetched if omitted)                                     |

**Returns:**

| Type                                             | Description                      |
| ------------------------------------------------ | -------------------------------- |
| `PrepareAddPermissionlessValidatorTxnReturnType` | Add validator transaction object |

**Return Object:**

| Property                       | Type                           | Description                            |
| ------------------------------ | ------------------------------ | -------------------------------------- |
| `tx`                           | `UnsignedTx`                   | The unsigned transaction               |
| `addPermissionlessValidatorTx` | `AddPermissionlessValidatorTx` | The add validator transaction instance |
| `chainAlias`                   | `"P"`                          | The chain alias                        |

**Example:**

```typescript
import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";

const validatorTx =
  await walletClient.pChain.prepareAddPermissionlessValidatorTxn({
    nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
    stakeInAvax: avaxToNanoAvax(2000),
    end: BigInt(1716441600),
    rewardAddresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
    delegatorRewardAddresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
    delegatorRewardPercentage: 2.5,
    threshold: 1,
  });

// Sign and send
const signedTx = await walletClient.signXPTransaction({
  tx: validatorTx.tx,
  chainAlias: "P",
});

const { txHash } = await walletClient.sendXPTransaction({
  txOrTxHex: signedTx.signedTxHex,
  chainAlias: "P",
});
```

**Related:**

- [prepareAddSubnetValidatorTxn](#prepareaddsubnetvalidatortxn) - Add to subnet
- [prepareAddPermissionlessDelegatorTxn](#prepareaddpermissionlessdelegatortxn) - Add delegator

---

## prepareAddPermissionlessDelegatorTxn

Prepare a transaction to add a permissionless delegator to a validator.

**Function Signature:**

```typescript
function prepareAddPermissionlessDelegatorTxn(
  params: PrepareAddPermissionlessDelegatorTxnParameters,
): Promise<PrepareAddPermissionlessDelegatorTxnReturnType>;

interface PrepareAddPermissionlessDelegatorTxnParameters {
  nodeId: string;
  stakeInAvax: bigint;
  end: bigint;
  rewardAddresses: string[];
  threshold?: number;
  locktime?: bigint;
  fromAddresses?: string[];
  changeAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface PrepareAddPermissionlessDelegatorTxnReturnType {
  tx: UnsignedTx;
  addPermissionlessDelegatorTx: AddPermissionlessDelegatorTx;
  chainAlias: "P";
}
```

**Parameters:**

| Name              | Type       | Required | Description                                                      |
| ----------------- | ---------- | -------- | ---------------------------------------------------------------- |
| `nodeId`          | `string`   | Yes      | Node ID of the validator to delegate to                          |
| `stakeInAvax`     | `bigint`   | Yes      | Amount of AVAX to stake (in nano AVAX)                           |
| `end`             | `bigint`   | Yes      | Unix time in seconds when delegation stops                       |
| `rewardAddresses` | `string[]` | Yes      | Addresses which will receive rewards                             |
| `threshold`       | `number`   | No       | Number of signatures required to spend reward UTXO (default: 1)  |
| `locktime`        | `bigint`   | No       | Unix timestamp after which reward UTXO can be spent (default: 0) |
| `fromAddresses`   | `string[]` | No       | Addresses to send funds from                                     |
| `changeAddresses` | `string[]` | No       | Addresses to receive change                                      |
| `utxos`           | `Utxo[]`   | No       | UTXOs to use as inputs                                           |
| `memo`            | `string`   | No       | Transaction memo                                                 |
| `minIssuanceTime` | `bigint`   | No       | Earliest time this transaction can be issued                     |
| `context`         | `Context`  | No       | Transaction context (auto-fetched if omitted)                    |

**Returns:**

| Type                                             | Description                      |
| ------------------------------------------------ | -------------------------------- |
| `PrepareAddPermissionlessDelegatorTxnReturnType` | Add delegator transaction object |

**Return Object:**

| Property                       | Type                           | Description                            |
| ------------------------------ | ------------------------------ | -------------------------------------- |
| `tx`                           | `UnsignedTx`                   | The unsigned transaction               |
| `addPermissionlessDelegatorTx` | `AddPermissionlessDelegatorTx` | The add delegator transaction instance |
| `chainAlias`                   | `"P"`                          | The chain alias                        |

**Example:**

```typescript
const delegatorTx =
  await walletClient.pChain.prepareAddPermissionlessDelegatorTxn({
    nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
    stakeInAvax: avaxToNanoAvax(25),
    end: BigInt(1716441600),
    rewardAddresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
    threshold: 1,
  });
```

**Related:**

- [prepareAddPermissionlessValidatorTxn](#prepareaddpermissionlessvalidatortxn) - Add validator

---

## prepareExportTxn

Prepare a transaction to export AVAX from P-Chain to another chain.

**Function Signature:**

```typescript
function prepareExportTxn(
  params: PrepareExportTxnParameters,
): Promise<PrepareExportTxnReturnType>;

interface PrepareExportTxnParameters {
  destinationChain: "X" | "C";
  exportedOutputs: Output[];
  fromAddresses?: string[];
  changeAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface PrepareExportTxnReturnType {
  tx: UnsignedTx;
  exportTx: ExportTx;
  chainAlias: "P";
}
```

**Parameters:**

| Name               | Type         | Required | Description                                   |
| ------------------ | ------------ | -------- | --------------------------------------------- |
| `destinationChain` | `"X" \| "C"` | Yes      | Chain alias to export funds to                |
| `exportedOutputs`  | `Output[]`   | Yes      | Outputs to export                             |
| `fromAddresses`    | `string[]`   | No       | Addresses to send funds from                  |
| `changeAddresses`  | `string[]`   | No       | Addresses to receive change                   |
| `utxos`            | `Utxo[]`     | No       | UTXOs to use as inputs                        |
| `memo`             | `string`     | No       | Transaction memo                              |
| `minIssuanceTime`  | `bigint`     | No       | Earliest time this transaction can be issued  |
| `context`          | `Context`    | No       | Transaction context (auto-fetched if omitted) |

**Returns:**

| Type                         | Description               |
| ---------------------------- | ------------------------- |
| `PrepareExportTxnReturnType` | Export transaction object |

**Return Object:**

| Property     | Type         | Description                     |
| ------------ | ------------ | ------------------------------- |
| `tx`         | `UnsignedTx` | The unsigned transaction        |
| `exportTx`   | `ExportTx`   | The export transaction instance |
| `chainAlias` | `"P"`        | The chain alias                 |

**Example:**

```typescript
const exportTx = await walletClient.pChain.prepareExportTxn({
  destinationChain: "C",
  exportedOutputs: [
    {
      addresses: [account.getEVMAddress()],
      amount: avaxToNanoAvax(0.001),
    },
  ],
});

// Sign and send
const signedTx = await walletClient.signXPTransaction({
  tx: exportTx.tx,
  chainAlias: "P",
});

const { txHash } = await walletClient.sendXPTransaction({
  txOrTxHex: signedTx.signedTxHex,
  chainAlias: "P",
});
```

**Related:**

- [prepareImportTxn](#prepareimporttxn) - Import to P-Chain
- [Wallet send method](./wallet#send) - Simplified cross-chain transfers

---

## prepareImportTxn

Prepare a transaction to import AVAX from another chain to P-Chain.

**Function Signature:**

```typescript
function prepareImportTxn(
  params: PrepareImportTxnParameters,
): Promise<PrepareImportTxnReturnType>;

interface PrepareImportTxnParameters {
  sourceChain: "X" | "C";
  importedOutput: ImportedOutput;
  fromAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface ImportedOutput {
  addresses: string[];
  locktime?: bigint;
  threshold?: number;
}

interface PrepareImportTxnReturnType {
  tx: UnsignedTx;
  importTx: ImportTx;
  chainAlias: "P";
}
```

**Parameters:**

| Name              | Type             | Required | Description                                     |
| ----------------- | ---------------- | -------- | ----------------------------------------------- |
| `sourceChain`     | `"X" \| "C"`     | Yes      | Chain alias to import funds from                |
| `importedOutput`  | `ImportedOutput` | Yes      | Consolidated imported output from atomic memory |
| `fromAddresses`   | `string[]`       | No       | Addresses to send funds from                    |
| `utxos`           | `Utxo[]`         | No       | UTXOs to use as inputs                          |
| `memo`            | `string`         | No       | Transaction memo                                |
| `minIssuanceTime` | `bigint`         | No       | Earliest time this transaction can be issued    |
| `context`         | `Context`        | No       | Transaction context (auto-fetched if omitted)   |

**Imported Output Object:**

| Name        | Type       | Required | Description                                                                         |
| ----------- | ---------- | -------- | ----------------------------------------------------------------------------------- |
| `addresses` | `string[]` | Yes      | Addresses who can sign the consuming of this UTXO                                   |
| `locktime`  | `bigint`   | No       | Timestamp in seconds after which this UTXO can be consumed                          |
| `threshold` | `number`   | No       | Number of signatures required out of total `addresses` to spend the imported output |

**Returns:**

| Type                         | Description               |
| ---------------------------- | ------------------------- |
| `PrepareImportTxnReturnType` | Import transaction object |

**Return Object:**

| Property     | Type         | Description                     |
| ------------ | ------------ | ------------------------------- |
| `tx`         | `UnsignedTx` | The unsigned transaction        |
| `importTx`   | `ImportTx`   | The import transaction instance |
| `chainAlias` | `"P"`        | The chain alias                 |

**Example:**

```typescript
const importTx = await walletClient.pChain.prepareImportTxn({
  sourceChain: "C",
  importedOutput: {
    addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
    threshold: 1,
  },
});

// Sign and send
const signedTx = await walletClient.signXPTransaction({
  tx: importTx.tx,
  chainAlias: "P",
});

const { txHash } = await walletClient.sendXPTransaction({
  txOrTxHex: signedTx.signedTxHex,
  chainAlias: "P",
});
```

**Related:**

- [prepareExportTxn](#prepareexporttxn) - Export from P-Chain

---

## prepareAddSubnetValidatorTxn

Prepare a transaction to add a validator to a subnet.

**Function Signature:**

```typescript
function prepareAddSubnetValidatorTxn(
  params: PrepareAddSubnetValidatorTxnParameters,
): Promise<PrepareAddSubnetValidatorTxnReturnType>;

interface PrepareAddSubnetValidatorTxnParameters {
  subnetId: string;
  nodeId: string;
  weight: bigint;
  end: bigint;
  subnetAuth: readonly number[];
  fromAddresses?: string[];
  changeAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface PrepareAddSubnetValidatorTxnReturnType {
  tx: UnsignedTx;
  addSubnetValidatorTx: AddSubnetValidatorTx;
  subnetOwners: PChainOwner;
  subnetAuth: number[];
  chainAlias: "P";
}
```

**Parameters:**

| Name              | Type                | Required | Description                                                                |
| ----------------- | ------------------- | -------- | -------------------------------------------------------------------------- |
| `subnetId`        | `string`            | Yes      | Subnet ID to add the validator to                                          |
| `nodeId`          | `string`            | Yes      | Node ID of the validator being added                                       |
| `weight`          | `bigint`            | Yes      | Weight of the validator used during consensus                              |
| `end`             | `bigint`            | Yes      | End timestamp in seconds after which validator will be removed             |
| `subnetAuth`      | `readonly number[]` | Yes      | Array of indices from subnet's owners array who will sign this transaction |
| `fromAddresses`   | `string[]`          | No       | Addresses to send funds from                                               |
| `changeAddresses` | `string[]`          | No       | Addresses to receive change                                                |
| `utxos`           | `Utxo[]`            | No       | UTXOs to use as inputs                                                     |
| `memo`            | `string`            | No       | Transaction memo                                                           |
| `minIssuanceTime` | `bigint`            | No       | Earliest time this transaction can be issued                               |
| `context`         | `Context`           | No       | Transaction context (auto-fetched if omitted)                              |

**Returns:**

| Type                                     | Description                             |
| ---------------------------------------- | --------------------------------------- |
| `PrepareAddSubnetValidatorTxnReturnType` | Add subnet validator transaction object |

**Return Object:**

| Property               | Type                   | Description                                   |
| ---------------------- | ---------------------- | --------------------------------------------- |
| `tx`                   | `UnsignedTx`           | The unsigned transaction                      |
| `addSubnetValidatorTx` | `AddSubnetValidatorTx` | The add subnet validator transaction instance |
| `subnetOwners`         | `PChainOwner`          | The subnet owners                             |
| `subnetAuth`           | `number[]`             | Array of indices from subnet's owners array   |
| `chainAlias`           | `"P"`                  | The chain alias                               |

**Example:**

```typescript
const addSubnetValidatorTx =
  await walletClient.pChain.prepareAddSubnetValidatorTxn({
    subnetId: "2b175hLJhGdj3CzgXNUHXDPVY3wQo3y3VWqPjKpF5vK",
    nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
    weight: BigInt(1000000),
    end: BigInt(1716441600),
    subnetAuth: [0, 1],
  });
```

**Related:**

- [prepareRemoveSubnetValidatorTxn](#prepareremovesubnetvalidatortxn) - Remove subnet validator

---

## prepareRemoveSubnetValidatorTxn

Prepare a transaction to remove a validator from a subnet.

**Function Signature:**

```typescript
function prepareRemoveSubnetValidatorTxn(
  params: PrepareRemoveSubnetValidatorTxnParameters,
): Promise<PrepareRemoveSubnetValidatorTxnReturnType>;

interface PrepareRemoveSubnetValidatorTxnParameters {
  subnetId: string;
  nodeId: string;
  subnetAuth: readonly number[];
  fromAddresses?: string[];
  changeAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface PrepareRemoveSubnetValidatorTxnReturnType {
  tx: UnsignedTx;
  removeSubnetValidatorTx: RemoveSubnetValidatorTx;
  subnetOwners: PChainOwner;
  subnetAuth: number[];
  chainAlias: "P";
}
```

**Parameters:**

| Name              | Type                | Required | Description                                                                |
| ----------------- | ------------------- | -------- | -------------------------------------------------------------------------- |
| `subnetId`        | `string`            | Yes      | Subnet ID to remove the validator from                                     |
| `nodeId`          | `string`            | Yes      | Node ID of the validator being removed                                     |
| `subnetAuth`      | `readonly number[]` | Yes      | Array of indices from subnet's owners array who will sign this transaction |
| `fromAddresses`   | `string[]`          | No       | Addresses to send funds from                                               |
| `changeAddresses` | `string[]`          | No       | Addresses to receive change                                                |
| `utxos`           | `Utxo[]`            | No       | UTXOs to use as inputs                                                     |
| `memo`            | `string`            | No       | Transaction memo                                                           |
| `minIssuanceTime` | `bigint`            | No       | Earliest time this transaction can be issued                               |
| `context`         | `Context`           | No       | Transaction context (auto-fetched if omitted)                              |

**Returns:**

| Type                                        | Description                                |
| ------------------------------------------- | ------------------------------------------ |
| `PrepareRemoveSubnetValidatorTxnReturnType` | Remove subnet validator transaction object |

**Return Object:**

| Property                  | Type                      | Description                                      |
| ------------------------- | ------------------------- | ------------------------------------------------ |
| `tx`                      | `UnsignedTx`              | The unsigned transaction                         |
| `removeSubnetValidatorTx` | `RemoveSubnetValidatorTx` | The remove subnet validator transaction instance |
| `subnetOwners`            | `PChainOwner`             | The subnet owners                                |
| `subnetAuth`              | `number[]`                | Array of indices from subnet's owners array      |
| `chainAlias`              | `"P"`                     | The chain alias                                  |

**Example:**

```typescript
const removeSubnetValidatorTx =
  await walletClient.pChain.prepareRemoveSubnetValidatorTxn({
    subnetId: "2b175hLJhGdj3CzgXNUHXDPVY3wQo3y3VWqPjKpF5vK",
    nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
    subnetAuth: [0, 1],
  });
```

**Related:**

- [prepareAddSubnetValidatorTxn](#prepareaddsubnetvalidatortxn) - Add subnet validator

---

## prepareCreateSubnetTxn

Prepare a transaction to create a new subnet.

**Function Signature:**

```typescript
function prepareCreateSubnetTxn(
  params: PrepareCreateSubnetTxnParameters,
): Promise<PrepareCreateSubnetTxnReturnType>;

interface PrepareCreateSubnetTxnParameters {
  subnetOwners: SubnetOwners;
  fromAddresses?: string[];
  changeAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface SubnetOwners {
  addresses: string[];
  threshold?: number;
  locktime?: bigint;
}

interface PrepareCreateSubnetTxnReturnType {
  tx: UnsignedTx;
  createSubnetTx: CreateSubnetTx;
  chainAlias: "P";
}
```

**Parameters:**

| Name              | Type           | Required | Description                                   |
| ----------------- | -------------- | -------- | --------------------------------------------- |
| `subnetOwners`    | `SubnetOwners` | Yes      | Subnet owners configuration                   |
| `fromAddresses`   | `string[]`     | No       | Addresses to send funds from                  |
| `changeAddresses` | `string[]`     | No       | Addresses to receive change                   |
| `utxos`           | `Utxo[]`       | No       | UTXOs to use as inputs                        |
| `memo`            | `string`       | No       | Transaction memo                              |
| `minIssuanceTime` | `bigint`       | No       | Earliest time this transaction can be issued  |
| `context`         | `Context`      | No       | Transaction context (auto-fetched if omitted) |

**Subnet Owners Object:**

| Name        | Type       | Required | Description                                                                              |
| ----------- | ---------- | -------- | ---------------------------------------------------------------------------------------- |
| `addresses` | `string[]` | Yes      | List of unique addresses (must be sorted lexicographically)                              |
| `threshold` | `number`   | No       | Number of unique signatures required to spend the output (must be ≤ length of addresses) |
| `locktime`  | `bigint`   | No       | Unix timestamp after which the output can be spent                                       |

**Returns:**

| Type                               | Description                      |
| ---------------------------------- | -------------------------------- |
| `PrepareCreateSubnetTxnReturnType` | Create subnet transaction object |

**Return Object:**

| Property         | Type             | Description                            |
| ---------------- | ---------------- | -------------------------------------- |
| `tx`             | `UnsignedTx`     | The unsigned transaction               |
| `createSubnetTx` | `CreateSubnetTx` | The create subnet transaction instance |
| `chainAlias`     | `"P"`            | The chain alias                        |

**Example:**

```typescript
const createSubnetTx = await walletClient.pChain.prepareCreateSubnetTxn({
  subnetOwners: {
    addresses: [
      "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
      "P-fuji1y8zrxh9cvdny0e8n8n4n7h4q4h4q4h4q4h4q4h",
    ],
    threshold: 2,
  },
});
```

**Related:**

- [prepareCreateChainTxn](#preparecreatechaintxn) - Create chain on subnet

---

## prepareCreateChainTxn

Prepare a transaction to create a new blockchain on a subnet.

**Function Signature:**

```typescript
function prepareCreateChainTxn(
  params: PrepareCreateChainTxnParameters,
): Promise<PrepareCreateChainTxnReturnType>;

interface PrepareCreateChainTxnParameters {
  subnetId: string;
  vmId: string;
  chainName: string;
  genesisData: Record<string, unknown>;
  subnetAuth: readonly number[];
  fxIds?: readonly string[];
  fromAddresses?: string[];
  changeAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface PrepareCreateChainTxnReturnType {
  tx: UnsignedTx;
  createChainTx: CreateChainTx;
  subnetOwners: PChainOwner;
  subnetAuth: number[];
  chainAlias: "P";
}
```

**Parameters:**

| Name              | Type                      | Required | Description                                                                |
| ----------------- | ------------------------- | -------- | -------------------------------------------------------------------------- |
| `subnetId`        | `string`                  | Yes      | Subnet ID to create the chain on                                           |
| `vmId`            | `string`                  | Yes      | VM ID of the chain being created                                           |
| `chainName`       | `string`                  | Yes      | Name of the chain being created                                            |
| `genesisData`     | `Record<string, unknown>` | Yes      | Genesis JSON data of the chain being created                               |
| `subnetAuth`      | `readonly number[]`       | Yes      | Array of indices from subnet's owners array who will sign this transaction |
| `fxIds`           | `readonly string[]`       | No       | Array of FX IDs to be added to the chain                                   |
| `fromAddresses`   | `string[]`                | No       | Addresses to send funds from                                               |
| `changeAddresses` | `string[]`                | No       | Addresses to receive change                                                |
| `utxos`           | `Utxo[]`                  | No       | UTXOs to use as inputs                                                     |
| `memo`            | `string`                  | No       | Transaction memo                                                           |
| `minIssuanceTime` | `bigint`                  | No       | Earliest time this transaction can be issued                               |
| `context`         | `Context`                 | No       | Transaction context (auto-fetched if omitted)                              |

**Returns:**

| Type                              | Description                     |
| --------------------------------- | ------------------------------- |
| `PrepareCreateChainTxnReturnType` | Create chain transaction object |

**Return Object:**

| Property        | Type            | Description                                 |
| --------------- | --------------- | ------------------------------------------- |
| `tx`            | `UnsignedTx`    | The unsigned transaction                    |
| `createChainTx` | `CreateChainTx` | The create chain transaction instance       |
| `subnetOwners`  | `PChainOwner`   | The subnet owners                           |
| `subnetAuth`    | `number[]`      | Array of indices from subnet's owners array |
| `chainAlias`    | `"P"`           | The chain alias                             |

**Example:**

```typescript
const createChainTx = await walletClient.pChain.prepareCreateChainTxn({
  subnetId: "2b175hLJhGdj3CzgXNUHXDPVY3wQo3y3VWqPjKpF5vK",
  vmId: "avm",
  chainName: "MyCustomChain",
  genesisData: {
    // Genesis configuration
  },
  subnetAuth: [0, 1],
});
```

**Related:**

- [prepareCreateSubnetTxn](#preparecreatesubnettxn) - Create subnet

---

## prepareConvertSubnetToL1Txn

Prepare a transaction to convert a subnet to an L1 (Layer 1) blockchain.

**Function Signature:**

```typescript
function prepareConvertSubnetToL1Txn(
  params: PrepareConvertSubnetToL1TxnParameters,
): Promise<PrepareConvertSubnetToL1TxnReturnType>;

interface PrepareConvertSubnetToL1TxnParameters {
  subnetId: string;
  blockchainId: string;
  managerContractAddress: string;
  validators: L1Validator[];
  subnetAuth: readonly number[];
  fromAddresses?: string[];
  changeAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface L1Validator {
  nodeId: string;
  nodePoP: {
    publicKey: string;
    proofOfPossession: string;
  };
  weight: bigint;
  initialBalanceInAvax: bigint;
  remainingBalanceOwner: PChainOwnerJSON;
  deactivationOwner: PChainOwnerJSON;
}

interface PrepareConvertSubnetToL1TxnReturnType {
  tx: UnsignedTx;
  convertSubnetToL1Tx: ConvertSubnetToL1Tx;
  subnetOwners: PChainOwner;
  subnetAuth: number[];
  chainAlias: "P";
}
```

**Parameters:**

| Name                     | Type                | Required | Description                                                                |
| ------------------------ | ------------------- | -------- | -------------------------------------------------------------------------- |
| `subnetId`               | `string`            | Yes      | Subnet ID of the subnet to convert                                         |
| `blockchainId`           | `string`            | Yes      | Blockchain ID of the L1 where validator manager contract is deployed       |
| `managerContractAddress` | `string`            | Yes      | Address of the validator manager contract                                  |
| `validators`             | `L1Validator[]`     | Yes      | Initial set of L1 validators after conversion                              |
| `subnetAuth`             | `readonly number[]` | Yes      | Array of indices from subnet's owners array who will sign this transaction |
| `fromAddresses`          | `string[]`          | No       | Addresses to send funds from                                               |
| `changeAddresses`        | `string[]`          | No       | Addresses to receive change                                                |
| `utxos`                  | `Utxo[]`            | No       | UTXOs to use as inputs                                                     |
| `memo`                   | `string`            | No       | Transaction memo                                                           |
| `minIssuanceTime`        | `bigint`            | No       | Earliest time this transaction can be issued                               |
| `context`                | `Context`           | No       | Transaction context (auto-fetched if omitted)                              |

**L1 Validator Object:**

| Name                        | Type              | Description                                                              |
| --------------------------- | ----------------- | ------------------------------------------------------------------------ |
| `nodeId`                    | `string`          | Node ID of the validator                                                 |
| `nodePoP.publicKey`         | `string`          | Public key of the validator                                              |
| `nodePoP.proofOfPossession` | `string`          | Proof of possession of the public key                                    |
| `weight`                    | `bigint`          | Weight of the validator on the L1 used during consensus participation    |
| `initialBalanceInAvax`      | `bigint`          | Initial balance in nano AVAX required for paying contiguous fee          |
| `remainingBalanceOwner`     | `PChainOwnerJSON` | Owner information for remaining balance if validator is removed/disabled |
| `deactivationOwner`         | `PChainOwnerJSON` | Owner information which can remove or disable the validator              |

**Returns:**

| Type                                    | Description                             |
| --------------------------------------- | --------------------------------------- |
| `PrepareConvertSubnetToL1TxnReturnType` | Convert subnet to L1 transaction object |

**Return Object:**

| Property              | Type                  | Description                                   |
| --------------------- | --------------------- | --------------------------------------------- |
| `tx`                  | `UnsignedTx`          | The unsigned transaction                      |
| `convertSubnetToL1Tx` | `ConvertSubnetToL1Tx` | The convert subnet to L1 transaction instance |
| `subnetOwners`        | `PChainOwner`         | The subnet owners                             |
| `subnetAuth`          | `number[]`            | Array of indices from subnet's owners array   |
| `chainAlias`          | `"P"`                 | The chain alias                               |

**Example:**

```typescript
const convertSubnetToL1Tx =
  await walletClient.pChain.prepareConvertSubnetToL1Txn({
    subnetId: "2b175hLJhGdj3CzgXNUHXDPVY3wQo3y3VWqPjKpF5vK",
    blockchainId: "2oYMBNV4eNHyqk2fjjV5nVwDzxvbmovtDAOwPJCTc9wqg8k9t",
    managerContractAddress: "0x1234567890123456789012345678901234567890",
    validators: [
      {
        nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
        nodePoP: {
          publicKey: "0x...",
          proofOfPossession: "0x...",
        },
        weight: BigInt(1000000),
        initialBalanceInAvax: avaxToNanoAvax(1000),
        remainingBalanceOwner: {
          addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
          threshold: 1,
        },
        deactivationOwner: {
          addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
          threshold: 1,
        },
      },
    ],
    subnetAuth: [0, 1],
  });
```

---

## prepareRegisterL1ValidatorTxn

Prepare a transaction to register an L1 validator.

**Function Signature:**

```typescript
function prepareRegisterL1ValidatorTxn(
  params: PrepareRegisterL1ValidatorTxnParameters,
): Promise<PrepareRegisterL1ValidatorTxnReturnType>;

interface PrepareRegisterL1ValidatorTxnParameters {
  initialBalanceInAvax: bigint;
  blsSignature: string;
  message: string;
  fromAddresses?: string[];
  changeAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface PrepareRegisterL1ValidatorTxnReturnType {
  tx: UnsignedTx;
  registerL1ValidatorTx: RegisterL1ValidatorTx;
  chainAlias: "P";
}
```

**Parameters:**

| Name                   | Type       | Required | Description                                                                                  |
| ---------------------- | ---------- | -------- | -------------------------------------------------------------------------------------------- |
| `initialBalanceInAvax` | `bigint`   | Yes      | Initial balance in nano AVAX required for paying contiguous fee                              |
| `blsSignature`         | `string`   | Yes      | BLS signature of the validator                                                               |
| `message`              | `string`   | Yes      | Signed warp message hex with `AddressedCall` payload containing `RegisterL1ValidatorMessage` |
| `fromAddresses`        | `string[]` | No       | Addresses to send funds from                                                                 |
| `changeAddresses`      | `string[]` | No       | Addresses to receive change                                                                  |
| `utxos`                | `Utxo[]`   | No       | UTXOs to use as inputs                                                                       |
| `memo`                 | `string`   | No       | Transaction memo                                                                             |
| `minIssuanceTime`      | `bigint`   | No       | Earliest time this transaction can be issued                                                 |
| `context`              | `Context`  | No       | Transaction context (auto-fetched if omitted)                                                |

**Returns:**

| Type                                      | Description                              |
| ----------------------------------------- | ---------------------------------------- |
| `PrepareRegisterL1ValidatorTxnReturnType` | Register L1 validator transaction object |

**Return Object:**

| Property                | Type                    | Description                                    |
| ----------------------- | ----------------------- | ---------------------------------------------- |
| `tx`                    | `UnsignedTx`            | The unsigned transaction                       |
| `registerL1ValidatorTx` | `RegisterL1ValidatorTx` | The register L1 validator transaction instance |
| `chainAlias`            | `"P"`                   | The chain alias                                |

**Example:**

```typescript
const registerL1ValidatorTx =
  await walletClient.pChain.prepareRegisterL1ValidatorTxn({
    initialBalanceInAvax: avaxToNanoAvax(1000),
    blsSignature: "0x...",
    message: "0x...",
  });
```

---

## prepareDisableL1ValidatorTxn

Prepare a transaction to disable an L1 validator.

**Function Signature:**

```typescript
function prepareDisableL1ValidatorTxn(
  params: PrepareDisableL1ValidatorTxnParameters,
): Promise<PrepareDisableL1ValidatorTxnReturnType>;

interface PrepareDisableL1ValidatorTxnParameters {
  validationId: string;
  disableAuth: number[];
  fromAddresses?: string[];
  changeAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface PrepareDisableL1ValidatorTxnReturnType {
  tx: UnsignedTx;
  disableL1ValidatorTx: DisableL1ValidatorTx;
  disableOwners: PChainOwner;
  disableAuth: number[];
  chainAlias: "P";
}
```

**Parameters:**

| Name              | Type       | Required | Description                                                                              |
| ----------------- | ---------- | -------- | ---------------------------------------------------------------------------------------- |
| `validationId`    | `string`   | Yes      | Validation ID of the L1 validator                                                        |
| `disableAuth`     | `number[]` | Yes      | Array of indices from L1 validator's disable owners array who will sign this transaction |
| `fromAddresses`   | `string[]` | No       | Addresses to send funds from                                                             |
| `changeAddresses` | `string[]` | No       | Addresses to receive change                                                              |
| `utxos`           | `Utxo[]`   | No       | UTXOs to use as inputs                                                                   |
| `memo`            | `string`   | No       | Transaction memo                                                                         |
| `minIssuanceTime` | `bigint`   | No       | Earliest time this transaction can be issued                                             |
| `context`         | `Context`  | No       | Transaction context (auto-fetched if omitted)                                            |

**Returns:**

| Type                                     | Description                             |
| ---------------------------------------- | --------------------------------------- |
| `PrepareDisableL1ValidatorTxnReturnType` | Disable L1 validator transaction object |

**Return Object:**

| Property               | Type                   | Description                                   |
| ---------------------- | ---------------------- | --------------------------------------------- |
| `tx`                   | `UnsignedTx`           | The unsigned transaction                      |
| `disableL1ValidatorTx` | `DisableL1ValidatorTx` | The disable L1 validator transaction instance |
| `disableOwners`        | `PChainOwner`          | The disable owners                            |
| `disableAuth`          | `number[]`             | Array of indices from disable owners array    |
| `chainAlias`           | `"P"`                  | The chain alias                               |

**Example:**

```typescript
const disableL1ValidatorTx =
  await walletClient.pChain.prepareDisableL1ValidatorTxn({
    validationId: "0x...",
    disableAuth: [0, 1],
  });
```

---

## prepareSetL1ValidatorWeightTxn

Prepare a transaction to set the weight of an L1 validator.

**Function Signature:**

```typescript
function prepareSetL1ValidatorWeightTxn(
  params: PrepareSetL1ValidatorWeightTxnParameters,
): Promise<PrepareSetL1ValidatorWeightTxnReturnType>;

interface PrepareSetL1ValidatorWeightTxnParameters {
  message: string;
  fromAddresses?: string[];
  changeAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface PrepareSetL1ValidatorWeightTxnReturnType {
  tx: UnsignedTx;
  setL1ValidatorWeightTx: SetL1ValidatorWeightTx;
  chainAlias: "P";
}
```

**Parameters:**

| Name              | Type       | Required | Description                                                                                   |
| ----------------- | ---------- | -------- | --------------------------------------------------------------------------------------------- |
| `message`         | `string`   | Yes      | Signed warp message hex with `AddressedCall` payload containing `SetL1ValidatorWeightMessage` |
| `fromAddresses`   | `string[]` | No       | Addresses to send funds from                                                                  |
| `changeAddresses` | `string[]` | No       | Addresses to receive change                                                                   |
| `utxos`           | `Utxo[]`   | No       | UTXOs to use as inputs                                                                        |
| `memo`            | `string`   | No       | Transaction memo                                                                              |
| `minIssuanceTime` | `bigint`   | No       | Earliest time this transaction can be issued                                                  |
| `context`         | `Context`  | No       | Transaction context (auto-fetched if omitted)                                                 |

**Returns:**

| Type                                       | Description                                |
| ------------------------------------------ | ------------------------------------------ |
| `PrepareSetL1ValidatorWeightTxnReturnType` | Set L1 validator weight transaction object |

**Return Object:**

| Property                 | Type                     | Description                                      |
| ------------------------ | ------------------------ | ------------------------------------------------ |
| `tx`                     | `UnsignedTx`             | The unsigned transaction                         |
| `setL1ValidatorWeightTx` | `SetL1ValidatorWeightTx` | The set L1 validator weight transaction instance |
| `chainAlias`             | `"P"`                    | The chain alias                                  |

**Example:**

```typescript
const setL1ValidatorWeightTx =
  await walletClient.pChain.prepareSetL1ValidatorWeightTxn({
    message: "0x...",
  });
```

---

## prepareIncreaseL1ValidatorBalanceTxn

Prepare a transaction to increase the balance of an L1 validator.

**Function Signature:**

```typescript
function prepareIncreaseL1ValidatorBalanceTxn(
  params: PrepareIncreaseL1ValidatorBalanceTxnParameters,
): Promise<PrepareIncreaseL1ValidatorBalanceTxnReturnType>;

interface PrepareIncreaseL1ValidatorBalanceTxnParameters {
  balanceInAvax: bigint;
  validationId: string;
  fromAddresses?: string[];
  changeAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface PrepareIncreaseL1ValidatorBalanceTxnReturnType {
  tx: UnsignedTx;
  increaseL1ValidatorBalanceTx: IncreaseL1ValidatorBalanceTx;
  chainAlias: "P";
}
```

**Parameters:**

| Name              | Type       | Required | Description                                              |
| ----------------- | ---------- | -------- | -------------------------------------------------------- |
| `balanceInAvax`   | `bigint`   | Yes      | Amount of AVAX to increase the balance by (in nano AVAX) |
| `validationId`    | `string`   | Yes      | Validation ID of the L1 validator                        |
| `fromAddresses`   | `string[]` | No       | Addresses to send funds from                             |
| `changeAddresses` | `string[]` | No       | Addresses to receive change                              |
| `utxos`           | `Utxo[]`   | No       | UTXOs to use as inputs                                   |
| `memo`            | `string`   | No       | Transaction memo                                         |
| `minIssuanceTime` | `bigint`   | No       | Earliest time this transaction can be issued             |
| `context`         | `Context`  | No       | Transaction context (auto-fetched if omitted)            |

**Returns:**

| Type                                             | Description                                      |
| ------------------------------------------------ | ------------------------------------------------ |
| `PrepareIncreaseL1ValidatorBalanceTxnReturnType` | Increase L1 validator balance transaction object |

**Return Object:**

| Property                       | Type                           | Description                                            |
| ------------------------------ | ------------------------------ | ------------------------------------------------------ |
| `tx`                           | `UnsignedTx`                   | The unsigned transaction                               |
| `increaseL1ValidatorBalanceTx` | `IncreaseL1ValidatorBalanceTx` | The increase L1 validator balance transaction instance |
| `chainAlias`                   | `"P"`                          | The chain alias                                        |

**Example:**

```typescript
const increaseL1ValidatorBalanceTx =
  await walletClient.pChain.prepareIncreaseL1ValidatorBalanceTxn({
    balanceInAvax: avaxToNanoAvax(500),
    validationId: "0x...",
  });
```

---

## Next Steps

- **[Wallet Methods](./wallet)** - General wallet operations
- **[X-Chain Wallet Methods](./x-chain-wallet)** - X-Chain transaction preparation
- **[C-Chain Wallet Methods](./c-chain-wallet)** - C-Chain atomic transactions
- **[Account Management](../accounts)** - Account types and management

# X-Chain Wallet Methods (/docs/tooling/avalanche-sdk/client/methods/wallet-methods/x-chain-wallet)

---

title: X-Chain Wallet Methods
description: Complete reference for X-Chain transaction preparation methods

---

## Overview

The X-Chain Wallet Methods provide transaction preparation capabilities for the Exchange Chain. These methods allow you to create unsigned transactions for various operations including base transfers and cross-chain transfers.

**Access:** `walletClient.xChain`

## prepareBaseTxn

Prepare a base X-Chain transaction for transferring AVAX or other assets.

**Function Signature:**

```typescript
function prepareBaseTxn(
  params: PrepareBaseTxnParameters,
): Promise<PrepareBaseTxnReturnType>;

interface PrepareBaseTxnParameters {
  outputs?: Output[];
  fromAddresses?: string[];
  changeAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface Output {
  addresses: string[];
  amount: bigint;
  assetId?: string;
  locktime?: bigint;
  threshold?: number;
}

interface PrepareBaseTxnReturnType {
  tx: UnsignedTx;
  baseTx: BaseTx;
  chainAlias: "X";
}
```

**Parameters:**

| Name              | Type       | Required | Description                                   |
| ----------------- | ---------- | -------- | --------------------------------------------- |
| `outputs`         | `Output[]` | No       | Array of outputs to send funds to             |
| `fromAddresses`   | `string[]` | No       | Addresses to send funds from                  |
| `changeAddresses` | `string[]` | No       | Addresses to receive change                   |
| `utxos`           | `Utxo[]`   | No       | UTXOs to use as inputs                        |
| `memo`            | `string`   | No       | Transaction memo                              |
| `minIssuanceTime` | `bigint`   | No       | Earliest time this transaction can be issued  |
| `context`         | `Context`  | No       | Transaction context (auto-fetched if omitted) |

**Output Object:**

| Name        | Type       | Required | Description                                                        |
| ----------- | ---------- | -------- | ------------------------------------------------------------------ |
| `addresses` | `string[]` | Yes      | Addresses who can sign the consuming of this UTXO                  |
| `amount`    | `bigint`   | Yes      | Amount in nano AVAX                                                |
| `assetId`   | `string`   | No       | Asset ID of the UTXO                                               |
| `locktime`  | `bigint`   | No       | Timestamp in seconds after which this UTXO can be consumed         |
| `threshold` | `number`   | No       | Threshold of `addresses`' signatures required to consume this UTXO |

**Returns:**

| Type                       | Description             |
| -------------------------- | ----------------------- |
| `PrepareBaseTxnReturnType` | Base transaction object |

**Return Object:**

| Property     | Type         | Description                   |
| ------------ | ------------ | ----------------------------- |
| `tx`         | `UnsignedTx` | The unsigned transaction      |
| `baseTx`     | `BaseTx`     | The base transaction instance |
| `chainAlias` | `"X"`        | The chain alias               |

**Example:**

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalanche } from "@avalanche-sdk/client/chains";
import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";

const account = privateKeyToAvalancheAccount("0x...");

const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: { type: "http" },
});

const unsignedTx = await walletClient.xChain.prepareBaseTxn({
  outputs: [
    {
      addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
      amount: avaxToNanoAvax(1),
    },
  ],
});

// Sign and send
const signedTx = await walletClient.signXPTransaction({
  tx: unsignedTx.tx,
  chainAlias: "X",
});

const { txHash } = await walletClient.sendXPTransaction({
  tx: signedTx.signedTxHex,
  chainAlias: "X",
});

console.log("Transaction hash:", txHash);
```

**Related:**

- [prepareExportTxn](#prepareexporttxn) - Cross-chain exports
- [prepareImportTxn](#prepareimporttxn) - Cross-chain imports

---

## prepareExportTxn

Prepare a transaction to export AVAX or other assets from X-Chain to another chain.

**Function Signature:**

```typescript
function prepareExportTxn(
  params: PrepareExportTxnParameters,
): Promise<PrepareExportTxnReturnType>;

interface PrepareExportTxnParameters {
  destinationChain: "P" | "C";
  exportedOutputs: Output[];
  fromAddresses?: string[];
  changeAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface PrepareExportTxnReturnType {
  tx: UnsignedTx;
  exportTx: ExportTx;
  chainAlias: "X";
}
```

**Parameters:**

| Name               | Type         | Required | Description                                   |
| ------------------ | ------------ | -------- | --------------------------------------------- |
| `destinationChain` | `"P" \| "C"` | Yes      | Chain alias to export funds to                |
| `exportedOutputs`  | `Output[]`   | Yes      | Outputs to export                             |
| `fromAddresses`    | `string[]`   | No       | Addresses to send funds from                  |
| `changeAddresses`  | `string[]`   | No       | Addresses to receive change                   |
| `utxos`            | `Utxo[]`     | No       | UTXOs to use as inputs                        |
| `memo`             | `string`     | No       | Transaction memo                              |
| `minIssuanceTime`  | `bigint`     | No       | Earliest time this transaction can be issued  |
| `context`          | `Context`    | No       | Transaction context (auto-fetched if omitted) |

**Returns:**

| Type                         | Description               |
| ---------------------------- | ------------------------- |
| `PrepareExportTxnReturnType` | Export transaction object |

**Return Object:**

| Property     | Type         | Description                     |
| ------------ | ------------ | ------------------------------- |
| `tx`         | `UnsignedTx` | The unsigned transaction        |
| `exportTx`   | `ExportTx`   | The export transaction instance |
| `chainAlias` | `"X"`        | The chain alias                 |

**Example:**

```typescript
const exportTx = await walletClient.xChain.prepareExportTxn({
  destinationChain: "C",
  exportedOutputs: [
    {
      addresses: ["0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"],
      amount: avaxToNanoAvax(1),
    },
  ],
});

// Sign and send
const signedTx = await walletClient.signXPTransaction({
  tx: exportTx.tx,
  chainAlias: "X",
});

const { txHash } = await walletClient.sendXPTransaction({
  tx: signedTx.signedTxHex,
  chainAlias: "X",
});
```

**Related:**

- [prepareImportTxn](#prepareimporttxn) - Import to X-Chain
- [Wallet send method](./wallet#send) - Simplified cross-chain transfers

---

## prepareImportTxn

Prepare a transaction to import AVAX or other assets from another chain to X-Chain.

**Function Signature:**

```typescript
function prepareImportTxn(
  params: PrepareImportTxnParameters,
): Promise<PrepareImportTxnReturnType>;

interface PrepareImportTxnParameters {
  sourceChain: "P" | "C";
  importedOutput: ImportedOutput;
  fromAddresses?: string[];
  utxos?: Utxo[];
  memo?: string;
  minIssuanceTime?: bigint;
  context?: Context;
}

interface ImportedOutput {
  addresses: string[];
  locktime?: bigint;
  threshold?: number;
}

interface PrepareImportTxnReturnType {
  tx: UnsignedTx;
  importTx: ImportTx;
  chainAlias: "X";
}
```

**Parameters:**

| Name              | Type             | Required | Description                                     |
| ----------------- | ---------------- | -------- | ----------------------------------------------- |
| `sourceChain`     | `"P" \| "C"`     | Yes      | Chain alias to import funds from                |
| `importedOutput`  | `ImportedOutput` | Yes      | Consolidated imported output from atomic memory |
| `fromAddresses`   | `string[]`       | No       | Addresses to send funds from                    |
| `utxos`           | `Utxo[]`         | No       | UTXOs to use as inputs                          |
| `memo`            | `string`         | No       | Transaction memo                                |
| `minIssuanceTime` | `bigint`         | No       | Earliest time this transaction can be issued    |
| `context`         | `Context`        | No       | Transaction context (auto-fetched if omitted)   |

**Imported Output Object:**

| Name        | Type       | Required | Description                                                                         |
| ----------- | ---------- | -------- | ----------------------------------------------------------------------------------- |
| `addresses` | `string[]` | Yes      | Addresses who can sign the consuming of this UTXO                                   |
| `locktime`  | `bigint`   | No       | Timestamp in seconds after which this UTXO can be consumed                          |
| `threshold` | `number`   | No       | Number of signatures required out of total `addresses` to spend the imported output |

**Returns:**

| Type                         | Description               |
| ---------------------------- | ------------------------- |
| `PrepareImportTxnReturnType` | Import transaction object |

**Return Object:**

| Property     | Type         | Description                     |
| ------------ | ------------ | ------------------------------- |
| `tx`         | `UnsignedTx` | The unsigned transaction        |
| `importTx`   | `ImportTx`   | The import transaction instance |
| `chainAlias` | `"X"`        | The chain alias                 |

**Example:**

```typescript
const importTx = await walletClient.xChain.prepareImportTxn({
  sourceChain: "C",
  importedOutput: {
    addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
    threshold: 1,
  },
});

// Sign and send
const signedTx = await walletClient.signXPTransaction({
  tx: importTx.tx,
  chainAlias: "X",
});

const { txHash } = await walletClient.sendXPTransaction({
  tx: signedTx.signedTxHex,
  chainAlias: "X",
});
```

**Related:**

- [prepareExportTxn](#prepareexporttxn) - Export from X-Chain

---

## Next Steps

- **[Wallet Methods](./wallet)** - General wallet operations
- **[P-Chain Wallet Methods](./p-chain-wallet)** - P-Chain transaction preparation
- **[C-Chain Wallet Methods](./c-chain-wallet)** - C-Chain atomic transactions
- **[Account Management](../accounts)** - Account types and management

# C-Chain Wallet Methods (/docs/tooling/avalanche-sdk/client/methods/wallet-methods/c-chain-wallet)

---

title: C-Chain Wallet Methods
description: Complete reference for C-Chain atomic transaction methods

---

## Overview

The C-Chain Wallet Methods provide transaction preparation capabilities for atomic cross-chain transfers between the C-Chain and other Avalanche chains (P-Chain and X-Chain). These methods handle the export and import of native AVAX via atomic transactions.

**Access:** `walletClient.cChain`

## prepareExportTxn

Prepare a transaction to export AVAX from C-Chain to another chain (P-Chain or X-Chain).

**Function Signature:**

```typescript
function prepareExportTxn(
  params: PrepareExportTxnParameters,
): Promise<PrepareExportTxnReturnType>;

interface PrepareExportTxnParameters {
  destinationChain: "P" | "X";
  fromAddress: string;
  exportedOutput: {
    addresses: string[];
    amount: bigint;
    locktime?: bigint;
    threshold?: number;
  };
  context?: Context;
}

interface PrepareExportTxnReturnType {
  tx: UnsignedTx;
  exportTx: ExportTx;
  chainAlias: "C";
}
```

**Parameters:**

| Name               | Type         | Required | Description                                         |
| ------------------ | ------------ | -------- | --------------------------------------------------- |
| `destinationChain` | `"P" \| "X"` | Yes      | Chain alias to export funds to (P-Chain or X-Chain) |
| `fromAddress`      | `string`     | Yes      | EVM address to export funds from                    |
| `exportedOutput`   | `object`     | Yes      | Consolidated exported output (UTXO)                 |
| `context`          | `Context`    | No       | Optional context for the transaction                |

**Exported Output Object:**

| Name        | Type       | Required | Description                                                        |
| ----------- | ---------- | -------- | ------------------------------------------------------------------ |
| `addresses` | `string[]` | Yes      | Addresses who can sign the consuming of this UTXO                  |
| `amount`    | `bigint`   | Yes      | Amount in nano AVAX held by this exported output                   |
| `locktime`  | `bigint`   | No       | Timestamp in seconds after which this UTXO can be consumed         |
| `threshold` | `number`   | No       | Threshold of `addresses`' signatures required to consume this UTXO |

**Returns:**

| Type                         | Description               |
| ---------------------------- | ------------------------- |
| `PrepareExportTxnReturnType` | Export transaction object |

**Return Object:**

| Property     | Type         | Description                     |
| ------------ | ------------ | ------------------------------- |
| `tx`         | `UnsignedTx` | The unsigned transaction        |
| `exportTx`   | `ExportTx`   | The export transaction instance |
| `chainAlias` | `"C"`        | The chain alias                 |

**Example:**

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalanche } from "@avalanche-sdk/client/chains";
import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";

const account = privateKeyToAvalancheAccount("0x...");

const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: { type: "http" },
});

// Export from C-Chain to P-Chain
const exportTx = await walletClient.cChain.prepareExportTxn({
  destinationChain: "P",
  fromAddress: account.getEVMAddress(),
  exportedOutput: {
    addresses: [account.getXPAddress("P")],
    amount: avaxToNanoAvax(0.001),
  },
});

// Sign and send
const { txHash } = await walletClient.sendXPTransaction({
  txOrTxHex: exportTx,
  chainAlias: "C",
});

console.log("Export transaction hash:", txHash);
```

**Related:**

- [prepareImportTxn](#prepareimporttxn) - Import to C-Chain
- [Wallet send method](./wallet#send) - Simplified cross-chain transfers
- [getAtomicTxStatus](../public-methods/c-chain#getatomictxstatus) - Check transaction status

---

## prepareImportTxn

Prepare a transaction to import AVAX from another chain (P-Chain or X-Chain) to C-Chain.

**Function Signature:**

```typescript
function prepareImportTxn(
  params: PrepareImportTxnParameters,
): Promise<PrepareImportTxnReturnType>;

interface PrepareImportTxnParameters {
  account?: AvalancheAccount | Address | undefined;
  sourceChain: "P" | "X";
  toAddress: string;
  fromAddresses?: string[];
  utxos?: Utxo[];
  context?: Context;
}

interface PrepareImportTxnReturnType {
  tx: UnsignedTx;
  importTx: ImportTx;
  chainAlias: "C";
}
```

**Parameters:**

| Name            | Type                          | Required | Description                                                                     |
| --------------- | ----------------------------- | -------- | ------------------------------------------------------------------------------- |
| `account`       | `AvalancheAccount \| Address` | No       | Account to use for the transaction                                              |
| `sourceChain`   | `"P" \| "X"`                  | Yes      | Chain alias to import funds from (P-Chain or X-Chain)                           |
| `toAddress`     | `string`                      | Yes      | EVM address to import funds to                                                  |
| `fromAddresses` | `string[]`                    | No       | Addresses to import funds from (auto-fetched if not provided)                   |
| `utxos`         | `Utxo[]`                      | No       | UTXOs to use as inputs (must be in atomic memory, auto-fetched if not provided) |
| `context`       | `Context`                     | No       | Optional context for the transaction                                            |

**Returns:**

| Type                         | Description               |
| ---------------------------- | ------------------------- |
| `PrepareImportTxnReturnType` | Import transaction object |

**Return Object:**

| Property     | Type         | Description                     |
| ------------ | ------------ | ------------------------------- |
| `tx`         | `UnsignedTx` | The unsigned transaction        |
| `importTx`   | `ImportTx`   | The import transaction instance |
| `chainAlias` | `"C"`        | The chain alias                 |

**Example:**

```typescript
const importTx = await walletClient.cChain.prepareImportTxn({
  sourceChain: "P",
  toAddress: account.getEVMAddress(),
  fromAddresses: [account.getXPAddress("P")],
});

// Sign and send
const { txHash } = await walletClient.sendXPTransaction({
  txOrTxHex: importTx,
  chainAlias: "C",
});

console.log("Import transaction hash:", txHash);
```

**Related:**

- [prepareExportTxn](#prepareexporttxn) - Export from C-Chain
- [getAtomicTxStatus](../public-methods/c-chain#getatomictxstatus) - Check transaction status

---

## Complete Cross-Chain Transfer Workflow

### Export from C-Chain to P-Chain

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalanche } from "@avalanche-sdk/client/chains";
import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";

const account = privateKeyToAvalancheAccount("0x...");

const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: { type: "http" },
});

// 1. Export from C-Chain
const exportTx = await walletClient.cChain.prepareExportTxn({
  destinationChain: "P",
  fromAddress: account.getEVMAddress(),
  exportedOutput: {
    addresses: [account.getXPAddress("P")],
    amount: avaxToNanoAvax(1.0),
  },
});

// 2. Sign and send export transaction
const { txHash: exportTxHash } = await walletClient.sendXPTransaction({
  txOrTxHex: exportTx,
  chainAlias: "C",
});

// 3. Wait for export to be committed
await walletClient.waitForTxn({
  txHash: exportTxHash,
  chainAlias: "C",
});

console.log("Export completed:", exportTxHash);

// 4. Import to P-Chain
const importTx = await walletClient.pChain.prepareImportTxn({
  sourceChain: "C",
  toAddresses: [account.getXPAddress("P")],
});

const { txHash: importTxHash } = await walletClient.sendXPTransaction({
  txOrTxHex: importTx,
  chainAlias: "P",
});

console.log("Import completed:", importTxHash);
```

---

## Next Steps

- **[Wallet Methods](./wallet)** - General wallet operations
- **[P-Chain Wallet Methods](./p-chain-wallet)** - P-Chain transaction preparation
- **[X-Chain Wallet Methods](./x-chain-wallet)** - X-Chain transaction preparation
- **[Account Management](../accounts)** - Account types and management

# Utilities (/docs/tooling/avalanche-sdk/client/utils)

---

title: "Utilities"
icon: "tools"

---

## Overview

The Avalanche SDK provides utility functions for AVAX unit conversion, CB58 encoding/decoding, transaction serialization, and UTXO operations. All viem utilities are also re-exported for EVM operations.

<Callout>
  **Note:** All utility functions are synchronous unless marked as `async`.
  Handle errors appropriately when working with blockchain data.
</Callout>

## Importing Utilities

Import utilities from `@avalanche-sdk/client/utils`:

```typescript
import {
  // AVAX conversions
  avaxToNanoAvax,
  nanoAvaxToAvax,
  avaxToWei,
  weiToAvax,
  weiToNanoAvax,
  nanoAvaxToWei,
  // CB58 encoding
  CB58ToHex,
  hexToCB58,
  // Transaction serialization
  getTxFromBytes,
  getUnsignedTxFromBytes,
  // UTXO operations
  getUtxoFromBytes,
  getUtxosForAddress,
  buildUtxoBytes,
} from "@avalanche-sdk/client/utils";

// Viem utilities are also available
import { hexToBytes, bytesToHex, isAddress } from "@avalanche-sdk/client/utils";
```

## AVAX Unit Conversion

Avalanche uses different units for different chains:

- **AVAX**: Human-readable unit (1 AVAX)
- **nanoAVAX (nAVAX)**: Smallest unit on P-Chain and X-Chain and C-Chain atomics (1 AVAX = 10^9 nAVAX)
- **wei**: Used on C-Chain (1 AVAX = 10^18 wei)

### avaxToNanoAvax

Converts AVAX to nanoAVAX for P-Chain/X-Chain or C-Chain Atomic operations.

**Function Signature:**

```typescript
function avaxToNanoAvax(amount: number): bigint;
```

**Parameters:**

| Name     | Type     | Required | Description    |
| -------- | -------- | -------- | -------------- |
| `amount` | `number` | Yes      | Amount in AVAX |

**Returns:**

| Type     | Description        |
| -------- | ------------------ |
| `bigint` | Amount in nanoAVAX |

**Example:**

```typescript
import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";

const nanoAvax = avaxToNanoAvax(1.5);
console.log(nanoAvax); // 1500000000n

// Use in P-Chain transaction
const tx = await walletClient.pChain.prepareBaseTxn({
  outputs: [
    {
      addresses: ["P-avax1..."],
      amount: Number(nanoAvax),
    },
  ],
});
```

### nanoAvaxToAvax

Converts nanoAVAX back to AVAX for display purposes.

**Function Signature:**

```typescript
function nanoAvaxToAvax(amount: bigint): number;
```

**Parameters:**

| Name     | Type     | Required | Description        |
| -------- | -------- | -------- | ------------------ |
| `amount` | `bigint` | Yes      | Amount in nanoAVAX |

**Returns:**

| Type     | Description    |
| -------- | -------------- |
| `number` | Amount in AVAX |

**Example:**

```typescript
import { nanoAvaxToAvax } from "@avalanche-sdk/client/utils";

const balance = await walletClient.pChain.getBalance({
  addresses: ["P-avax1..."],
});

const avax = nanoAvaxToAvax(BigInt(balance.balance || 0));
console.log(`Balance: ${avax} AVAX`);
```

### avaxToWei

Converts AVAX to wei for C-Chain operations.

**Function Signature:**

```typescript
function avaxToWei(amount: number): bigint;
```

**Parameters:**

| Name     | Type     | Required | Description    |
| -------- | -------- | -------- | -------------- |
| `amount` | `number` | Yes      | Amount in AVAX |

**Returns:**

| Type     | Description   |
| -------- | ------------- |
| `bigint` | Amount in wei |

**Example:**

```typescript
import { avaxToWei } from "@avalanche-sdk/client/utils";

const wei = avaxToWei(1.5);
console.log(wei); // 1500000000000000000n

// Use in C-Chain transaction
const txHash = await walletClient.cChain.sendTransaction({
  to: "0x...",
  value: wei,
});
```

### weiToAvax

Converts wei back to AVAX for display.

**Function Signature:**

```typescript
function weiToAvax(amount: bigint): bigint;
```

**Parameters:**

| Name     | Type     | Required | Description   |
| -------- | -------- | -------- | ------------- |
| `amount` | `bigint` | Yes      | Amount in wei |

**Returns:**

| Type     | Description                |
| -------- | -------------------------- |
| `bigint` | Amount in AVAX (as bigint) |

**Example:**

```typescript
import { weiToAvax } from "@avalanche-sdk/client/utils";

const balance = await walletClient.cChain.getBalance({
  address: "0x...",
});

const avax = weiToAvax(balance);
console.log(`Balance: ${avax} AVAX`);
```

### weiToNanoAvax

Converts wei to nanoAVAX for cross-chain operations.

**Function Signature:**

```typescript
function weiToNanoAvax(amount: bigint): bigint;
```

**Parameters:**

| Name     | Type     | Required | Description   |
| -------- | -------- | -------- | ------------- |
| `amount` | `bigint` | Yes      | Amount in wei |

**Returns:**

| Type     | Description        |
| -------- | ------------------ |
| `bigint` | Amount in nanoAVAX |

**Example:**

```typescript
import { weiToNanoAvax } from "@avalanche-sdk/client/utils";

const cChainBalance = await walletClient.cChain.getBalance({
  address: "0x...",
});

// Convert to nanoAVAX for P-Chain transfer
const nanoAvax = weiToNanoAvax(cChainBalance);
```

### nanoAvaxToWei

Converts nanoAVAX to wei for cross-chain operations.

**Function Signature:**

```typescript
function nanoAvaxToWei(amount: bigint): bigint;
```

**Parameters:**

| Name     | Type     | Required | Description        |
| -------- | -------- | -------- | ------------------ |
| `amount` | `bigint` | Yes      | Amount in nanoAVAX |

**Returns:**

| Type     | Description   |
| -------- | ------------- |
| `bigint` | Amount in wei |

**Example:**

```typescript
import { nanoAvaxToWei } from "@avalanche-sdk/client/utils";

const pChainBalance = await walletClient.pChain.getBalance({
  addresses: ["P-avax1..."],
});

// Convert to wei for C-Chain transfer
const wei = nanoAvaxToWei(BigInt(pChainBalance.balance || 0));
```

## CB58 Encoding/Decoding

CB58 is Avalanche's base58 encoding format used for transaction IDs, asset IDs, and addresses.

### CB58ToHex

Converts CB58-encoded strings to hexadecimal format.

**Function Signature:**

```typescript
function CB58ToHex(cb58: string): Hex;
```

**Parameters:**

| Name   | Type     | Required | Description         |
| ------ | -------- | -------- | ------------------- |
| `cb58` | `string` | Yes      | CB58 encoded string |

**Returns:**

| Type  | Description                         |
| ----- | ----------------------------------- |
| `Hex` | Hexadecimal string with `0x` prefix |

**Example:**

```typescript
import { CB58ToHex } from "@avalanche-sdk/client/utils";

const txId = "mYxFK3CWs6iMFFaRx4wmVLDUtnktzm2o9Mhg9AG6JSzRijy5V";
const hex = CB58ToHex(txId);
console.log(hex); // 0x...

// Use with hex-based APIs
const tx = await client.pChain.getAtomicTx({ txID: hex });
```

### hexToCB58

Converts hexadecimal strings to CB58 format.

**Function Signature:**

```typescript
function hexToCB58(hex: Hex): string;
```

**Parameters:**

| Name  | Type  | Required | Description                         |
| ----- | ----- | -------- | ----------------------------------- |
| `hex` | `Hex` | Yes      | Hexadecimal string with `0x` prefix |

**Returns:**

| Type     | Description         |
| -------- | ------------------- |
| `string` | CB58 encoded string |

**Example:**

```typescript
import { hexToCB58 } from "@avalanche-sdk/client/utils";

const hex = "0x1234567890abcdef";
const cb58 = hexToCB58(hex);
console.log(cb58); // CB58 encoded string
```

## Transaction Serialization

### getTxFromBytes

Parses signed transaction bytes to extract the transaction and credentials.

**Function Signature:**

```typescript
function getTxFromBytes(
  txBytes: string,
  chainAlias: "P" | "X" | "C",
): [Common.Transaction, Credential[]];
```

**Parameters:**

| Name         | Type                | Required | Description                     |
| ------------ | ------------------- | -------- | ------------------------------- |
| `txBytes`    | `string`            | Yes      | Transaction bytes as hex string |
| `chainAlias` | `"P" \| "X" \| "C"` | Yes      | Chain alias                     |

**Returns:**

| Type                                 | Description                                        |
| ------------------------------------ | -------------------------------------------------- |
| `[Common.Transaction, Credential[]]` | Tuple containing transaction and credentials array |

**Example:**

```typescript
import { getTxFromBytes } from "@avalanche-sdk/client/utils";

const txHex = "0x1234567890abcdef...";
const [tx, credentials] = getTxFromBytes(txHex, "P");

console.log("Transaction ID:", tx.getId().toString());
console.log("Signatures:", credentials.length);
```

### getUnsignedTxFromBytes

Parses unsigned transaction bytes to get an unsigned transaction object.

**Function Signature:**

```typescript
function getUnsignedTxFromBytes(
  txBytes: string,
  chainAlias: "P" | "X" | "C",
): UnsignedTx;
```

**Parameters:**

| Name         | Type                | Required | Description                     |
| ------------ | ------------------- | -------- | ------------------------------- |
| `txBytes`    | `string`            | Yes      | Transaction bytes as hex string |
| `chainAlias` | `"P" \| "X" \| "C"` | Yes      | Chain alias                     |

**Returns:**

| Type         | Description                        |
| ------------ | ---------------------------------- |
| `UnsignedTx` | Parsed unsigned transaction object |

**Example:**

```typescript
import { getUnsignedTxFromBytes } from "@avalanche-sdk/client/utils";

const txHex = "0x1234567890abcdef...";
const unsignedTx = getUnsignedTxFromBytes(txHex, "P");

console.log("Transaction ID:", unsignedTx.txID);
console.log("Transaction bytes:", unsignedTx.toBytes());
```

## UTXO Operations

### getUtxoFromBytes

Parses UTXO bytes to get a UTXO object.

**Function Signature:**

```typescript
function getUtxoFromBytes(
  utxoBytesOrHex: string | Uint8Array,
  chainAlias: "P" | "X" | "C",
): Utxo;
```

**Parameters:**

| Name             | Type                   | Required | Description                            |
| ---------------- | ---------------------- | -------- | -------------------------------------- |
| `utxoBytesOrHex` | `string \| Uint8Array` | Yes      | UTXO bytes as hex string or Uint8Array |
| `chainAlias`     | `"P" \| "X" \| "C"`    | Yes      | Chain alias                            |

**Returns:**

| Type   | Description        |
| ------ | ------------------ |
| `Utxo` | Parsed UTXO object |

**Example:**

```typescript
import { getUtxoFromBytes } from "@avalanche-sdk/client/utils";

const utxoHex = "0x1234567890abcdef...";
const utxo = getUtxoFromBytes(utxoHex, "P");

console.log("UTXO ID:", utxo.utxoID);
console.log("Asset ID:", utxo.assetID);
console.log("Output:", utxo.output);
```

### getUtxosForAddress

Fetches all UTXOs for a given address on a specific chain. This function handles pagination automatically.

**Function Signature:**

```typescript
function getUtxosForAddress(
  client: AvalancheWalletCoreClient,
  params: {
    address: string;
    chainAlias: "P" | "X" | "C";
    sourceChain?: string;
  },
): Promise<Utxo[]>;
```

**Parameters:**

| Name     | Type                        | Required | Description                |
| -------- | --------------------------- | -------- | -------------------------- |
| `client` | `AvalancheWalletCoreClient` | Yes      | The wallet client instance |
| `params` | `object`                    | Yes      | Parameters object          |

**params object:**

| Name          | Type                | Required | Description                             |
| ------------- | ------------------- | -------- | --------------------------------------- |
| `address`     | `string`            | Yes      | Address to query                        |
| `chainAlias`  | `"P" \| "X" \| "C"` | Yes      | Chain alias                             |
| `sourceChain` | `string`            | No       | Source chain ID for import transactions |

**Returns:**

| Type              | Description           |
| ----------------- | --------------------- |
| `Promise<Utxo[]>` | Array of UTXO objects |

**Example:**

```typescript
import { getUtxosForAddress } from "@avalanche-sdk/client/utils";
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalanche } from "@avalanche-sdk/client/chains";

const walletClient = createAvalancheWalletClient({
  account: myAccount,
  chain: avalanche,
  transport: { type: "http" },
});

const utxos = await getUtxosForAddress(walletClient, {
  address: "P-avax1...",
  chainAlias: "P",
});

console.log(`Found ${utxos.length} UTXOs`);
```

### buildUtxoBytes

Builds UTXO bytes from parameters. Useful for reconstructing UTXOs or creating test data.

**Function Signature:**

```typescript
function buildUtxoBytes(
  txHash: string,
  outputIndex: number,
  assetId: string,
  amount: string,
  addresses: string[],
  locktime: string,
  threshold: number,
): `0x${string}`;
```

**Parameters:**

| Name          | Type       | Required | Description                                 |
| ------------- | ---------- | -------- | ------------------------------------------- |
| `txHash`      | `string`   | Yes      | Transaction hash in CB58 format             |
| `outputIndex` | `number`   | Yes      | Output index in the transaction             |
| `assetId`     | `string`   | Yes      | Asset ID in CB58 format                     |
| `amount`      | `string`   | Yes      | Amount as string                            |
| `addresses`   | `string[]` | Yes      | Array of addresses that can spend this UTXO |
| `locktime`    | `string`   | Yes      | UNIX timestamp locktime in seconds          |
| `threshold`   | `number`   | Yes      | Signature threshold                         |

**Returns:**

| Type                | Description              |
| ------------------- | ------------------------ |
| `` `0x${string}` `` | UTXO bytes as hex string |

**Example:**

```typescript
import { buildUtxoBytes } from "@avalanche-sdk/client/utils";

const utxoBytes = buildUtxoBytes(
  "mYxFK3CWs6iMFFaRx4wmVLDUtnktzm2o9Mhg9AG6JSzRijy5V",
  0,
  "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK",
  "111947",
  ["P-fuji1nv6w7m6egkwhkcvz96ze3qmzyk5gt6csqz7ejq"],
  "0",
  1,
);

console.log("UTXO bytes:", utxoBytes);
```

## Viem Utilities

The SDK re-exports all utilities from viem for EVM operations. See the [viem utilities documentation](https://viem.sh/docs/utilities) for complete reference.

**Common Categories:**

- **Encoding/Decoding**: `bytesToHex`, `hexToBytes`, `stringToHex`
- **ABI Operations**: `encodeAbiParameters`, `decodeAbiParameters`, `parseAbiItem`
- **Address Operations**: `getAddress`, `isAddress`, `checksumAddress`
- **Number Operations**: `bytesToBigInt`, `hexToNumber`, `numberToHex`
- **Hash Operations**: `keccak256`, `sha256`, `ripemd160`
- **Signature Operations**: `recoverAddress`, `verifyMessage`

## Common Patterns

### Converting Between Units

```typescript
import {
  avaxToNanoAvax,
  nanoAvaxToAvax,
  avaxToWei,
  weiToAvax,
} from "@avalanche-sdk/client/utils";

// P-Chain: AVAX → nanoAVAX
const nanoAvax = avaxToNanoAvax(1.5);

// C-Chain: AVAX → wei
const wei = avaxToWei(1.5);

// Display: nanoAVAX → AVAX
const avax = nanoAvaxToAvax(nanoAvax);
```

### Working with Transaction IDs

```typescript
import { CB58ToHex, hexToCB58 } from "@avalanche-sdk/client/utils";

// Convert CB58 to hex for API calls
const txId = "mYxFK3CWs6iMFFaRx4wmVLDUtnktzm2o9Mhg9AG6JSzRijy5V";
const hex = CB58ToHex(txId);

// Convert hex back to CB58 for display
const cb58 = hexToCB58(hex);
```

### Parsing Transactions

```typescript
import { getTxFromBytes } from "@avalanche-sdk/client/utils";

const txHex = "0x...";
const [tx, credentials] = getTxFromBytes(txHex, "P");

// Access transaction details
const txId = tx.getId().toString();
const numSignatures = credentials.length;
```

## Next Steps

- **[Account Management](accounts)** - Working with accounts
- **[Transaction Signing](methods/wallet-methods/wallet)** - Signing and sending transactions
- **[Chain Clients](clients)** - Chain-specific operations
- **[Viem Documentation](https://viem.sh/docs/utilities)** - Complete viem utilities reference

# Getting Started (/docs/tooling/avalanche-sdk/interchain/getting-started)

---

title: Getting Started
description: Install and configure the Interchain SDK
icon: rocket

---

## Installation

<Tabs items={["npm", "pnpm", "yarn", "bun"]}>
<Tab value="npm">
npm install @avalanche-sdk/interchain @avalanche-sdk/client
</Tab>
<Tab value="pnpm">
pnpm add @avalanche-sdk/interchain @avalanche-sdk/client
</Tab>
<Tab value="yarn">
yarn add @avalanche-sdk/interchain @avalanche-sdk/client
</Tab>
<Tab value="bun">bun add @avalanche-sdk/interchain @avalanche-sdk/client</Tab>
</Tabs>

## Setup

### 1. Create Wallet Client

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = privateKeyToAvalancheAccount("0x...");
const wallet = createAvalancheWalletClient({
  account,
  chain: avalancheFuji,
  transport: { type: "http" },
});
```

### 2. Initialize ICM Client

```typescript
import { createICMClient } from "@avalanche-sdk/interchain";
import { avalancheFuji, dispatch } from "@avalanche-sdk/interchain/chains";

const icm = createICMClient(wallet, avalancheFuji, dispatch);
```

## Send Your First Message

```typescript
async function sendMessage() {
  const hash = await icm.sendMsg({
    sourceChain: avalancheFuji,
    destinationChain: dispatch,
    message: "Hello from Avalanche!",
  });

  console.log("Message sent:", hash);
}
```

## Send Your First Token Transfer

```typescript
import { createICTTClient } from "@avalanche-sdk/interchain";

const ictt = createICTTClient(avalancheFuji, dispatch);

// Deploy token and contracts (one-time setup)
const { contractAddress: tokenAddress } = await ictt.deployERC20Token({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  name: "My Token",
  symbol: "MTK",
  initialSupply: 1000000,
});

// Send tokens
const { txHash } = await ictt.sendToken({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  destinationChain: dispatch,
  tokenHomeContract: "0x...",
  tokenRemoteContract: "0x...",
  recipient: "0x...",
  amountInBaseUnit: 100,
});
```

## Next Steps

- Learn about [Interchain Messaging](/avalanche-sdk/interchain/icm)
- Explore [Token Transfers](/avalanche-sdk/interchain/ictt)
- Understand [Warp Messages](/avalanche-sdk/interchain/warp)

# Getting Started (/docs/tooling/avalanche-sdk/interchain/getting-started)

---

title: Getting Started
description: Install and configure the Interchain SDK
icon: rocket

---

## Installation

<Tabs items={["npm", "pnpm", "yarn", "bun"]}>
<Tab value="npm">
npm install @avalanche-sdk/interchain @avalanche-sdk/client
</Tab>
<Tab value="pnpm">
pnpm add @avalanche-sdk/interchain @avalanche-sdk/client
</Tab>
<Tab value="yarn">
yarn add @avalanche-sdk/interchain @avalanche-sdk/client
</Tab>
<Tab value="bun">bun add @avalanche-sdk/interchain @avalanche-sdk/client</Tab>
</Tabs>

## Setup

### 1. Create Wallet Client

```typescript
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";

const account = privateKeyToAvalancheAccount("0x...");
const wallet = createAvalancheWalletClient({
  account,
  chain: avalancheFuji,
  transport: { type: "http" },
});
```

### 2. Initialize ICM Client

```typescript
import { createICMClient } from "@avalanche-sdk/interchain";
import { avalancheFuji, dispatch } from "@avalanche-sdk/interchain/chains";

const icm = createICMClient(wallet, avalancheFuji, dispatch);
```

## Send Your First Message

```typescript
async function sendMessage() {
  const hash = await icm.sendMsg({
    sourceChain: avalancheFuji,
    destinationChain: dispatch,
    message: "Hello from Avalanche!",
  });

  console.log("Message sent:", hash);
}
```

## Send Your First Token Transfer

```typescript
import { createICTTClient } from "@avalanche-sdk/interchain";

const ictt = createICTTClient(avalancheFuji, dispatch);

// Deploy token and contracts (one-time setup)
const { contractAddress: tokenAddress } = await ictt.deployERC20Token({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  name: "My Token",
  symbol: "MTK",
  initialSupply: 1000000,
});

// Send tokens
const { txHash } = await ictt.sendToken({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  destinationChain: dispatch,
  tokenHomeContract: "0x...",
  tokenRemoteContract: "0x...",
  recipient: "0x...",
  amountInBaseUnit: 100,
});
```

## Next Steps

- Learn about [Interchain Messaging](/avalanche-sdk/interchain/icm)
- Explore [Token Transfers](/avalanche-sdk/interchain/ictt)
- Understand [Warp Messages](/avalanche-sdk/interchain/warp)

# Interchain Messaging (/docs/tooling/avalanche-sdk/interchain/icm)

---

title: Interchain Messaging
icon: message-square

---

## Overview

Send arbitrary messages between Avalanche chains and subnets using the Teleporter protocol. Messages are encoded as strings and delivered cross-chain.

## Create Client

```typescript
import { createICMClient } from "@avalanche-sdk/interchain";
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji, dispatch } from "@avalanche-sdk/interchain/chains";

// Setup wallet
const account = privateKeyToAvalancheAccount("0x...");
const wallet = createAvalancheWalletClient({
  account,
  chain: avalancheFuji,
  transport: { type: "http" },
});

const icm = createICMClient(wallet);
// Or with default chains
const icm = createICMClient(wallet, sourceChain, destinationChain);
```

<Callout type="warn">
  The wallet client's chain configuration must match the `sourceChain` used in
  your interchain operations. For example, if you're sending messages from Fuji
  testnet, ensure your wallet client is configured with the Fuji chain.
  Mismatched chains will result in an "invalid sender" error.
</Callout>

## Methods

<Cards>
  <Card title="sendMsg" href="/avalanche-sdk/interchain/icm/methods">
    Send a cross-chain message
  </Card>
</Cards>

# Methods (/docs/tooling/avalanche-sdk/interchain/icm/methods)

---

title: Methods
icon: code

---

## sendMsg

Sends a cross-chain message to the specified destination chain.

### Parameters

| Parameter                 | Type                                          | Required | Description                                  |
| ------------------------- | --------------------------------------------- | -------- | -------------------------------------------- |
| `message`                 | `string`                                      | Yes      | Message content to send                      |
| `sourceChain`             | `ChainConfig`                                 | Yes\*    | Source chain configuration                   |
| `destinationChain`        | `ChainConfig`                                 | Yes\*    | Destination chain configuration              |
| `recipientAddress`        | `0x${string}`                                 | No       | Recipient address (defaults to zero address) |
| `feeInfo`                 | `{ feeTokenAddress: string, amount: bigint }` | No       | Fee token and amount                         |
| `requiredGasLimit`        | `bigint`                                      | No       | Gas limit for execution (default: 100000)    |
| `allowedRelayerAddresses` | `string[]`                                    | No       | Allowed relayer addresses                    |

\* Required if not set in client constructor

### Returns

| Type              | Description      |
| ----------------- | ---------------- |
| `Promise<string>` | Transaction hash |

### Example

```typescript
import { createICMClient } from "@avalanche-sdk/interchain";
import { avalancheFuji, dispatch } from "@avalanche-sdk/interchain/chains";

const icm = createICMClient(wallet);

// Simple message
const hash = await icm.sendMsg({
  sourceChain: avalancheFuji,
  destinationChain: dispatch,
  message: "Hello from Avalanche!",
});

// With options
const hash = await icm.sendMsg({
  sourceChain: avalancheFuji,
  destinationChain: dispatch,
  message: "Hello from Avalanche!",
  recipientAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  feeInfo: {
    feeTokenAddress: "0x0000000000000000000000000000000000000000",
    amount: 0n,
  },
  requiredGasLimit: 200000n,
});
```

# Interchain Token Transfers (/docs/tooling/avalanche-sdk/interchain/ictt)

---

title: Interchain Token Transfers
icon: coins

---

## Overview

Transfer ERC20 tokens between Avalanche chains using the Teleporter protocol. Requires deploying token home and remote contracts for each token pair.

## Create Client

```typescript
import { createICTTClient } from "@avalanche-sdk/interchain";

const ictt = createICTTClient();
// Or with default chains
const ictt = createICTTClient(sourceChain, destinationChain);
```

## Workflow

1. **Deploy ERC20 Token** - Deploy your token on the source chain
2. **Deploy Token Home** - Deploy home contract on source chain
3. **Deploy Token Remote** - Deploy remote contract on destination chain
4. **Register Remote** - Register remote with home contract
5. **Approve Token** - Approve home contract to spend tokens
6. **Send Tokens** - Transfer tokens cross-chain

<Callout type="warn">
  The wallet client's chain configuration must match the `sourceChain` used in
  your interchain operations. For example, if you're sending messages from Fuji
  testnet, ensure your wallet client is configured with the Fuji chain.
  Mismatched chains will result in an "invalid sender" error.
</Callout>

## Methods

<Cards>
  <Card title="Deployment" href="/avalanche-sdk/interchain/ictt/deployment">
    Deploy tokens and contracts
  </Card>
  <Card title="Transfers" href="/avalanche-sdk/interchain/ictt/transfers">
    Transfer tokens cross-chain
  </Card>
</Cards>

# Deployment Methods (/docs/tooling/avalanche-sdk/interchain/ictt/deployment)

---

title: Deployment Methods
icon: package

---

## deployERC20Token

Deploys a new ERC20 token on the source chain.

### Parameters

| Parameter       | Type           | Required | Description                                              |
| --------------- | -------------- | -------- | -------------------------------------------------------- |
| `walletClient`  | `WalletClient` | Yes      | Wallet client for signing                                |
| `sourceChain`   | `ChainConfig`  | Yes\*    | Source chain configuration                               |
| `name`          | `string`       | Yes      | Token name                                               |
| `symbol`        | `string`       | Yes      | Token symbol                                             |
| `initialSupply` | `number`       | Yes      | Initial token supply                                     |
| `recipient`     | `Address`      | No       | Recipient of initial supply (defaults to wallet address) |

\* Required if not set in client constructor

### Returns

| Type                                                             | Description                           |
| ---------------------------------------------------------------- | ------------------------------------- |
| `Promise<{ txHash: 0x${string}, contractAddress: 0x${string} }>` | Transaction hash and contract address |

### Example

```typescript
const { txHash, contractAddress } = await ictt.deployERC20Token({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  name: "My Token",
  symbol: "MTK",
  initialSupply: 1000000,
});
```

## deployTokenHomeContract

Deploys a token home contract on the source chain.

### Parameters

| Parameter                  | Type           | Required | Description                |
| -------------------------- | -------------- | -------- | -------------------------- |
| `walletClient`             | `WalletClient` | Yes      | Wallet client for signing  |
| `sourceChain`              | `ChainConfig`  | Yes\*    | Source chain configuration |
| `erc20TokenAddress`        | `Address`      | Yes      | ERC20 token address        |
| `minimumTeleporterVersion` | `number`       | Yes      | Minimum Teleporter version |
| `tokenHomeCustomByteCode`  | `string`       | No       | Custom bytecode            |
| `tokenHomeCustomABI`       | `ABI`          | No       | Custom ABI                 |

### Returns

| Type                                                             | Description                           |
| ---------------------------------------------------------------- | ------------------------------------- |
| `Promise<{ txHash: 0x${string}, contractAddress: 0x${string} }>` | Transaction hash and contract address |

### Example

```typescript
const { txHash, contractAddress } = await ictt.deployTokenHomeContract({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  erc20TokenAddress: tokenAddress,
  minimumTeleporterVersion: 1,
});
```

## deployTokenRemoteContract

Deploys a token remote contract on the destination chain.

### Parameters

| Parameter                   | Type           | Required | Description                     |
| --------------------------- | -------------- | -------- | ------------------------------- |
| `walletClient`              | `WalletClient` | Yes      | Wallet client for signing       |
| `sourceChain`               | `ChainConfig`  | Yes\*    | Source chain configuration      |
| `destinationChain`          | `ChainConfig`  | Yes\*    | Destination chain configuration |
| `tokenHomeContract`         | `Address`      | Yes      | Token home contract address     |
| `tokenRemoteCustomByteCode` | `string`       | No       | Custom bytecode                 |
| `tokenRemoteCustomABI`      | `ABI`          | No       | Custom ABI                      |

### Returns

| Type                                                             | Description                           |
| ---------------------------------------------------------------- | ------------------------------------- |
| `Promise<{ txHash: 0x${string}, contractAddress: 0x${string} }>` | Transaction hash and contract address |

### Example

```typescript
const { txHash, contractAddress } = await ictt.deployTokenRemoteContract({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  destinationChain: dispatch,
  tokenHomeContract: tokenHomeAddress,
});
```

## registerRemoteWithHome

Registers the token remote contract with the token home contract.

### Parameters

| Parameter             | Type           | Required | Description                     |
| --------------------- | -------------- | -------- | ------------------------------- |
| `walletClient`        | `WalletClient` | Yes      | Wallet client for signing       |
| `sourceChain`         | `ChainConfig`  | Yes\*    | Source chain configuration      |
| `destinationChain`    | `ChainConfig`  | Yes\*    | Destination chain configuration |
| `tokenRemoteContract` | `Address`      | Yes      | Token remote contract address   |
| `feeTokenAddress`     | `Address`      | No       | Fee token address               |
| `feeAmount`           | `number`       | No       | Fee amount                      |

### Returns

| Type                               | Description      |
| ---------------------------------- | ---------------- |
| `Promise<{ txHash: 0x${string} }>` | Transaction hash |

### Example

```typescript
const { txHash } = await ictt.registerRemoteWithHome({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  destinationChain: dispatch,
  tokenRemoteContract: tokenRemoteAddress,
});
```

# Transfer Methods (/docs/tooling/avalanche-sdk/interchain/ictt/transfers)

---

title: Transfer Methods
icon: arrow-right

---

## approveToken

Approves the token home contract to spend tokens on the source chain.

### Parameters

| Parameter           | Type           | Required | Description                       |
| ------------------- | -------------- | -------- | --------------------------------- |
| `walletClient`      | `WalletClient` | Yes      | Wallet client for signing         |
| `sourceChain`       | `ChainConfig`  | Yes\*    | Source chain configuration        |
| `tokenHomeContract` | `Address`      | Yes      | Token home contract address       |
| `tokenAddress`      | `Address`      | Yes      | ERC20 token address               |
| `amountInBaseUnit`  | `number`       | Yes      | Amount to approve (in base units) |

\* Required if not set in client constructor

### Returns

| Type                               | Description      |
| ---------------------------------- | ---------------- |
| `Promise<{ txHash: 0x${string} }>` | Transaction hash |

### Example

```typescript
const { txHash } = await ictt.approveToken({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  tokenHomeContract: tokenHomeAddress,
  tokenAddress: tokenAddress,
  amountInBaseUnit: 1000,
});
```

## sendToken

Sends tokens from the source chain to the destination chain.

### Parameters

| Parameter             | Type           | Required | Description                            |
| --------------------- | -------------- | -------- | -------------------------------------- |
| `walletClient`        | `WalletClient` | Yes      | Wallet client for signing              |
| `sourceChain`         | `ChainConfig`  | Yes\*    | Source chain configuration             |
| `destinationChain`    | `ChainConfig`  | Yes\*    | Destination chain configuration        |
| `tokenHomeContract`   | `Address`      | Yes      | Token home contract address            |
| `tokenRemoteContract` | `Address`      | Yes      | Token remote contract address          |
| `recipient`           | `Address`      | Yes      | Recipient address on destination chain |
| `amountInBaseUnit`    | `number`       | Yes      | Amount to send (in base units)         |
| `feeTokenAddress`     | `Address`      | No       | Fee token address                      |
| `feeAmount`           | `number`       | No       | Fee amount                             |

\* Required if not set in client constructor

### Returns

| Type                               | Description      |
| ---------------------------------- | ---------------- |
| `Promise<{ txHash: 0x${string} }>` | Transaction hash |

### Example

```typescript
const { txHash } = await ictt.sendToken({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  destinationChain: dispatch,
  tokenHomeContract: tokenHomeAddress,
  tokenRemoteContract: tokenRemoteAddress,
  recipient: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  amountInBaseUnit: 100,
});
```

## Complete Workflow

```typescript
import { createICTTClient } from "@avalanche-sdk/interchain";
import { avalancheFuji, dispatch } from "@avalanche-sdk/interchain/chains";

const ictt = createICTTClient(avalancheFuji, dispatch);

// 1. Deploy token
const { contractAddress: tokenAddress } = await ictt.deployERC20Token({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  name: "My Token",
  symbol: "MTK",
  initialSupply: 1000000,
});

// 2. Deploy home contract
const { contractAddress: tokenHomeAddress } =
  await ictt.deployTokenHomeContract({
    walletClient: wallet,
    sourceChain: avalancheFuji,
    erc20TokenAddress: tokenAddress,
    minimumTeleporterVersion: 1,
  });

// 3. Deploy remote contract
const { contractAddress: tokenRemoteAddress } =
  await ictt.deployTokenRemoteContract({
    walletClient: wallet,
    sourceChain: avalancheFuji,
    destinationChain: dispatch,
    tokenHomeContract: tokenHomeAddress,
  });

// 4. Register remote with home
await ictt.registerRemoteWithHome({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  destinationChain: dispatch,
  tokenRemoteContract: tokenRemoteAddress,
});

// 5. Approve tokens
await ictt.approveToken({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  tokenHomeContract: tokenHomeAddress,
  tokenAddress: tokenAddress,
  amountInBaseUnit: 1000,
});

// 6. Send tokens
const { txHash } = await ictt.sendToken({
  walletClient: wallet,
  sourceChain: avalancheFuji,
  destinationChain: dispatch,
  tokenHomeContract: tokenHomeAddress,
  tokenRemoteContract: tokenRemoteAddress,
  recipient: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  amountInBaseUnit: 100,
});
```

# Warp Messages (/docs/tooling/avalanche-sdk/interchain/warp)

---

title: Warp Messages
icon: layers

---

## Overview

Warp messages enable cross-chain communication in Avalanche. Parse and build Warp protocol messages for validator registration, weight updates, and subnet conversions.

## Supported Message Types

- **RegisterL1ValidatorMessage** - Register L1 validators
- **L1ValidatorWeightMessage** - Update validator weights
- **L1ValidatorRegistrationMessage** - L1 validator registration
- **SubnetToL1ConversionMessage** - Subnet to L1 conversion

## Quick Start

```typescript
import {
  WarpMessage,
  RegisterL1ValidatorMessage,
} from "@avalanche-sdk/interchain/warp";

// Parse a signed Warp message
const signedWarpMsg = WarpMessage.fromHex(signedWarpMsgHex);

// Parse specific message type
const registerMsg = RegisterL1ValidatorMessage.fromHex(signedWarpMsgHex);
```

## Methods

<Cards>
  <Card title="Parsing" href="/avalanche-sdk/interchain/warp/parsing">
    Parse Warp messages
  </Card>
  <Card title="Building" href="/avalanche-sdk/interchain/warp/building">
    Build Warp messages
  </Card>
</Cards>

# Parsing Warp Messages (/docs/tooling/avalanche-sdk/interchain/warp/parsing)

---

title: Parsing Warp Messages
icon: search

---

## WarpMessage

Parse a signed Warp message from hex.

### Methods

| Method    | Parameters    | Returns       | Description               |
| --------- | ------------- | ------------- | ------------------------- |
| `fromHex` | `hex: string` | `WarpMessage` | Parse signed Warp message |

### Example

```typescript
import { WarpMessage } from "@avalanche-sdk/interchain/warp";

const signedWarpMsgHex = "0x...";
const warpMsg = WarpMessage.fromHex(signedWarpMsgHex);

// Access message properties
console.log(warpMsg.networkID);
console.log(warpMsg.sourceChainID);
console.log(warpMsg.addressedCallPayload);
console.log(warpMsg.signatures);
```

## RegisterL1ValidatorMessage

Parse a Register L1 Validator message.

### Methods

| Method    | Parameters    | Returns                      | Description    |
| --------- | ------------- | ---------------------------- | -------------- |
| `fromHex` | `hex: string` | `RegisterL1ValidatorMessage` | Parse from hex |

### Example

```typescript
import { RegisterL1ValidatorMessage } from "@avalanche-sdk/interchain/warp";

const msg = RegisterL1ValidatorMessage.fromHex(signedWarpMsgHex);
console.log(msg.nodeID);
console.log(msg.publicKey);
console.log(msg.signature);
```

## L1ValidatorWeightMessage

Parse an L1 Validator Weight message.

### Methods

| Method    | Parameters    | Returns                    | Description    |
| --------- | ------------- | -------------------------- | -------------- |
| `fromHex` | `hex: string` | `L1ValidatorWeightMessage` | Parse from hex |

### Example

```typescript
import { L1ValidatorWeightMessage } from "@avalanche-sdk/interchain/warp";

const msg = L1ValidatorWeightMessage.fromHex(signedWarpMsgHex);
console.log(msg.nodeID);
console.log(msg.weight);
console.log(msg.startTime);
```

## L1ValidatorRegistrationMessage

Parse an L1 Validator Registration message.

### Methods

| Method    | Parameters    | Returns                          | Description    |
| --------- | ------------- | -------------------------------- | -------------- |
| `fromHex` | `hex: string` | `L1ValidatorRegistrationMessage` | Parse from hex |

## SubnetToL1ConversionMessage

Parse a Subnet to L1 Conversion message.

### Methods

| Method    | Parameters    | Returns                       | Description    |
| --------- | ------------- | ----------------------------- | -------------- |
| `fromHex` | `hex: string` | `SubnetToL1ConversionMessage` | Parse from hex |

### Example

```typescript
import { SubnetToL1ConversionMessage } from "@avalanche-sdk/interchain/warp";

const msg = SubnetToL1ConversionMessage.fromHex(signedWarpMsgHex);
console.log(msg.subnetID);
console.log(msg.assetID);
console.log(msg.initialSupply);
```

# Building Warp Messages (/docs/tooling/avalanche-sdk/interchain/warp/building)

---

title: Building Warp Messages
icon: hammer

---

## Building Messages

Build unsigned Warp messages for signing and broadcasting.

## RegisterL1ValidatorMessage

### Methods

| Method       | Parameters                                             | Returns                      | Description       |
| ------------ | ------------------------------------------------------ | ---------------------------- | ----------------- |
| `fromValues` | `nodeID: string, publicKey: string, signature: string` | `RegisterL1ValidatorMessage` | Build from values |
| `toHex`      | -                                                      | `string`                     | Convert to hex    |

### Example

```typescript
import { RegisterL1ValidatorMessage } from "@avalanche-sdk/interchain/warp";

const msg = RegisterL1ValidatorMessage.fromValues(
  "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
  "0x...",
  "0x...",
);

const hex = msg.toHex();
```

## L1ValidatorWeightMessage

### Methods

| Method       | Parameters                                          | Returns                    | Description       |
| ------------ | --------------------------------------------------- | -------------------------- | ----------------- |
| `fromValues` | `nodeID: string, weight: bigint, startTime: bigint` | `L1ValidatorWeightMessage` | Build from values |
| `toHex`      | -                                                   | `string`                   | Convert to hex    |

### Example

```typescript
import { L1ValidatorWeightMessage } from "@avalanche-sdk/interchain/warp";

const msg = L1ValidatorWeightMessage.fromValues(
  "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
  4n,
  41n,
);

const hex = msg.toHex();
```

## AddressedCall

Build AddressedCall payload from a message.

### Methods

| Method       | Parameters                                | Returns         | Description       |
| ------------ | ----------------------------------------- | --------------- | ----------------- |
| `fromValues` | `sourceAddress: Address, payload: string` | `AddressedCall` | Build from values |
| `toHex`      | -                                         | `string`        | Convert to hex    |

### Example

```typescript
import {
  AddressedCall,
  L1ValidatorWeightMessage,
} from "@avalanche-sdk/interchain/warp";

const msg = L1ValidatorWeightMessage.fromValues(
  "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
  4n,
  41n,
);

const addressedCall = AddressedCall.fromValues(
  "0x35F884853114D298D7aA8607f4e7e0DB52205f07",
  msg.toHex(),
);
```

## WarpUnsignedMessage

Build unsigned Warp message from AddressedCall.

### Methods

| Method       | Parameters                                                               | Returns               | Description       |
| ------------ | ------------------------------------------------------------------------ | --------------------- | ----------------- |
| `fromValues` | `networkID: number, sourceChainID: string, addressedCallPayload: string` | `WarpUnsignedMessage` | Build from values |
| `toHex`      | -                                                                        | `string`              | Convert to hex    |

### Example

```typescript
import {
  AddressedCall,
  L1ValidatorWeightMessage,
  WarpUnsignedMessage,
} from "@avalanche-sdk/interchain/warp";

// Build message
const msg = L1ValidatorWeightMessage.fromValues(
  "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
  4n,
  41n,
);

// Build AddressedCall
const addressedCall = AddressedCall.fromValues(
  "0x35F884853114D298D7aA8607f4e7e0DB52205f07",
  msg.toHex(),
);

// Build unsigned Warp message
const warpUnsignedMsg = WarpUnsignedMessage.fromValues(
  1,
  "251q44yFiimeVSHaQbBk69TzoeYqKu9VagGtLVqo92LphUxjmR",
  addressedCall.toHex(),
);

const hex = warpUnsignedMsg.toHex();
```
