# Data API vs RPC (/docs/api-reference/data-api/data-vs-rpc)

---

title: Data API vs RPC
description: Comparison of the Data API and RPC methods
icon: Server

---

In the rapidly evolving world of Web3 development, efficiently retrieving token balances for a user's address is a fundamental requirement. Whether you're building DeFi platforms, wallets, analytics tools, or exchanges, displaying accurate token balances is crucial for user engagement and trust. A typical use case involves showing a user's token portfolio in a wallet application, in this case, we have sAvax and USDC.

<img src="https://mintcdn.com/avalabs-47ea3976/0zR1yC86HIu3y3oi/images/wallet.png?fit=max&auto=format&n=0zR1yC86HIu3y3oi&q=85&s=9a7596035baaa07bbeca4c3e65d54459" alt="title" data-og-width="3267" width="3267" data-og-height="2112" height="2112" data-path="images/wallet.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/avalabs-47ea3976/0zR1yC86HIu3y3oi/images/wallet.png?w=280&fit=max&auto=format&n=0zR1yC86HIu3y3oi&q=85&s=e7852463251bb0cede8143ff4e777aae 280w, https://mintcdn.com/avalabs-47ea3976/0zR1yC86HIu3y3oi/images/wallet.png?w=560&fit=max&auto=format&n=0zR1yC86HIu3y3oi&q=85&s=523f9034b79bb173a77c3e8f1d1d5a37 560w, https://mintcdn.com/avalabs-47ea3976/0zR1yC86HIu3y3oi/images/wallet.png?w=840&fit=max&auto=format&n=0zR1yC86HIu3y3oi&q=85&s=65ff3d5662f91787c3eb2ae4b7675587 840w, https://mintcdn.com/avalabs-47ea3976/0zR1yC86HIu3y3oi/images/wallet.png?w=1100&fit=max&auto=format&n=0zR1yC86HIu3y3oi&q=85&s=7e68f4a1c8457c54efde9a989b2015f0 1100w, https://mintcdn.com/avalabs-47ea3976/0zR1yC86HIu3y3oi/images/wallet.png?w=1650&fit=max&auto=format&n=0zR1yC86HIu3y3oi&q=85&s=46e8d62f6c222b5f202db739928da286 1650w, https://mintcdn.com/avalabs-47ea3976/0zR1yC86HIu3y3oi/images/wallet.png?w=2500&fit=max&auto=format&n=0zR1yC86HIu3y3oi&q=85&s=6d72d4bda1aca25d96bc63cda3c7cf25 2500w" />

Developers generally have two options to fetch this data:

1. **Using RPC methods to index blockchain data on their own**
2. **Leveraging an indexer provider like the Data API**

While both methods aim to achieve the same goal, the Data API offers a more efficient, scalable, and developer-friendly solution. This article delves into why using the Data API is better than relying on traditional RPC (Remote Procedure Call) methods.

### What Are RPC methods and their challenges?

Remote Procedure Call (RPC) methods allow developers to interact directly with blockchain nodes. One of their key advantages is that they are standardized and universally understood by blockchain developers across different platforms. With RPC, you can perform tasks such as querying data, submitting transactions, and interacting with smart contracts. These methods are typically low-level and synchronous, meaning they require a deep understanding of the blockchain’s architecture and specific command structures.
You can refer to the [official documentation](https://ethereum.org/en/developers/docs/apis/json-rpc/) to gain a more comprehensive understanding of the JSON-RPC API.

Here’s an example using the `eth_getBalance` method to retrieve the native balance of a wallet:

```bash
curl --location 'https://api.avax.network/ext/bc/C/rpc' \
--header 'Content-Type: application/json' \
--data '{"method":"eth_getBalance","params":["0x8ae323046633A07FB162043f28Cea39FFc23B50A", "latest"],"id":1,"jsonrpc":"2.0"}'
```

This call returns the following response:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x284476254bc5d594"
}
```

The balance in this wallet is 2.9016 AVAX. However, despite the wallet holding multiple tokens such as USDC, the `eth_getBalance` method only returns the AVAX amount and it does so in Wei and in hexadecimal format. This is not particularly human-readable, adding to the challenge for developers who need to manually convert the balance to a more understandable format.

#### No direct RPC methods to retrieve token balances

Despite their utility, RPC methods come with significant limitations when it comes to retrieving detailed token and transaction data. Currently, RPC methods do not provide direct solutions for the following:

- **Listing all tokens held by a wallet**: There is no RPC method that provides a complete list of ERC-20 tokens owned by a wallet.
- **Retrieving all transactions for a wallet**: : There is no direct method for fetching all transactions associated with a wallet.
- **Getting ERC-20/721/1155 token balances**: The `eth_getBalance` method only returns the balance of the wallet’s native token (such as AVAX on Avalanche) and cannot be used to retrieve ERC-20/721/1155 token balances.

To achieve these tasks using RPC methods alone, you would need to:

- **Query every block for transaction logs**: Scan the entire blockchain, which is resource-intensive and impractical.
- **Parse transaction logs**: Identify and extract ERC-20 token transfer events from each transaction.
- **Aggregate data**: Collect and process this data to compute balances and transaction histories.

#### Manual blockchain indexing is difficult and costly

Using RPC methods to fetch token balances involves an arduous process:

1. You must connect to a node and subscribe to new block events.
2. For each block, parse every transaction to identify ERC-20 token transfers involving the user's address.
3. Extract contract addresses and other relevant data from the parsed transactions.
4. Compute balances by processing transfer events.
5. Store the processed data in a database for quick retrieval and aggregation.

#### Why this is difficult:

- **Resource-Intensive**: Requires significant computational power and storage to process and store blockchain data.
- **Time-consuming**: Processing millions of blocks and transactions can take an enormous amount of time.
- **Complexity**: Handling edge cases like contract upgrades, proxy contracts, and non-standard implementations adds layers of complexity.
- **Maintenance**: Keeping the indexed data up-to-date necessitates continuous synchronization with new blocks being added to the blockchain.
- **High Costs**: Associated with servers, databases, and network bandwidth.

### The Data API Advantage

The Data API provides a streamlined, efficient, and scalable solution for fetching token balances. Here's why it's the best choice:
With a single API call, you can retrieve all ERC-20 token balances for a user's address:

```javascript
avalancheSDK.data.evm.balances.listErc20Balances({
  address: "0xYourAddress",
});
```

Sample Response:

```json
{
  "erc20TokenBalances": [
    {
      "ercType": "ERC-20",
      "chainId": "43114",
      "address": "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      "name": "USD Coin",
      "symbol": "USDC",
      "decimals": 6,
      "price": {
        "value": 1.0,
        "currencyCode": "usd"
      },
      "balance": "15000000",
      "balanceValue": {
        "currencyCode": "usd",
        "value": 9.6
      },
      "logoUri": "https://images.ctfassets.net/gcj8jwzm6086/e50058c1-2296-4e7e-91ea-83eb03db95ee/8db2a492ce64564c96de87c05a3756fd/43114-0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E.png"
    }
    // Additional tokens...
  ]
}
```

As you can see with a single call the API returns an array of token balances for all the wallet tokens, including:

- **Token metadata**: Contract address, name, symbol, decimals.
- **Balance information**: Token balance in both hexadecimal and decimal formats, Also retrieves balances of native assets like ETH or AVAX.
- **Price data**: Current value in USD or other supported currencies, saving you the effort of integrating another API.
- **Visual assets**: Token logo URI for better user interface integration.

If you’re building a wallet, DeFi app, or any application that requires displaying balances, transaction history, or smart contract interactions, relying solely on RPC methods can be challenging. Just as there’s no direct RPC method to retrieve token balances, there’s also no simple way to fetch all transactions associated with a wallet, especially for ERC-20, ERC-721, or ERC-1155 token transfers.

However, by using the Data API, you can retrieve all token transfers for a given wallet **with a single API call**, making the process much more efficient. This approach simplifies tracking and displaying wallet activity without the need to manually scan the entire blockchain.

Below are two examples that demonstrate the power of the Data API: in the first, it returns all ERC transfers, including ERC-20, ERC-721, and ERC-1155 tokens, and in the second, it shows all internal transactions, such as when one contract interacts with another.

<Accordions>
  <Accordion title="List ERC transfers">
    [Lists ERC transfers](/data-api/evm-transactions/list-erc-transfers) for an ERC-20, ERC-721, or ERC-1155 contract address.

    ```javascript  theme={null}
    import { Avalanche } from "@avalanche-sdk/chainkit";

    const avalancheSDK = new Avalanche({
      apiKey: "<YOUR_API_KEY_HERE>",
      chainId: "43114",
      network: "mainnet",
    });

    async function run() {
      const result = await avalancheSDK.data.evm.transactions.listTransfers({
        startBlock: 6479329,
        endBlock: 6479330,
        pageSize: 10,
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      });

      for await (const page of result) {
        // Handle the page
        console.log(page);
      }
    }

    run();
    ```

    Example response

    ```json  theme={null}
    {
      "nextPageToken": "<string>",
      "transfers": [
        {
          "blockNumber": "339",
          "blockTimestamp": 1648672486,
          "blockHash": "0x17533aeb5193378b9ff441d61728e7a2ebaf10f61fd5310759451627dfca2e7c",
          "txHash": "0x3e9303f81be00b4af28515dab7b914bf3dbff209ea10e7071fa24d4af0a112d4",
          "from": {
            "name": "Wrapped AVAX",
            "symbol": "WAVAX",
            "decimals": 18,
            "logoUri": "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
            "address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
          },
          "to": {
            "name": "Wrapped AVAX",
            "symbol": "WAVAX",
            "decimals": 18,
            "logoUri": "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
            "address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
          },
          "logIndex": 123,
          "value": "10000000000000000000",
          "erc20Token": {
            "address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
            "name": "Wrapped AVAX",
            "symbol": "WAVAX",
            "decimals": 18,
            "logoUri": "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
            "ercType": "ERC-20",
            "price": {
              "currencyCode": "usd",
              "value": "42.42"
            }
          }
        }
      ]
    }
    ```

  </Accordion>

  <Accordion title="List internal transactions">
    [Returns a list of internal transactions](/data-api/evm-transactions/list-internal-transactions) for an address and chain. Filterable by block range.

    ```javascript  theme={null}
    import { Avalanche } from "@avalanche-sdk/chainkit";

    const avalancheSDK = new Avalanche({
      apiKey: "<YOUR_API_KEY_HERE>",
      chainId: "43114",
      network: "mainnet",
    });

    async function run() {
      const result = await avalancheSDK.data.evm.transactions.listInternalTransactions({
        startBlock: 6479329,
        endBlock: 6479330,
        pageSize: 10,
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      });

      for await (const page of result) {
        // Handle the page
        console.log(page);
      }
    }

    run();
    ```

    Example response

    ```json  theme={null}
    {
      "nextPageToken": "<string>",
      "transactions": [
        {
          "blockNumber": "339",
          "blockTimestamp": 1648672486,
          "blockHash": "0x17533aeb5193378b9ff441d61728e7a2ebaf10f61fd5310759451627dfca2e7c",
          "txHash": "0x3e9303f81be00b4af28515dab7b914bf3dbff209ea10e7071fa24d4af0a112d4",
          "from": {
            "name": "Wrapped AVAX",
            "symbol": "WAVAX",
            "decimals": 18,
            "logoUri": "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
            "address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
          },
          "to": {
            "name": "Wrapped AVAX",
            "symbol": "WAVAX",
            "decimals": 18,
            "logoUri": "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
            "address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
          },
          "internalTxType": "UNKNOWN",
          "value": "10000000000000000000",
          "isReverted": true,
          "gasUsed": "<string>",
          "gasLimit": "<string>"
        }
      ]
    }
    ```

  </Accordion>
</Accordions>

### Conclusion

Using the Data API over traditional RPC methods for fetching token balances offers significant advantages:

- **Efficiency**: Retrieve all necessary information in a single API call.
- **Simplicity**: Eliminates complex data processing and reduces development time.
- **Scalability**: Handles large volumes of data efficiently, suitable for real-time applications.
- **Comprehensive Data**: Provides enriched information, including token prices and logos.
- **Reliability**: Ensures data accuracy and consistency without the need for extensive error handling.
  For developers building Web3 applications, leveraging the Data API is the smarter choice. It not only simplifies your codebase but also enhances the user experience by providing accurate and timely data.

If you’re building cutting-edge Web3 applications, this API is the key to improving your workflow and performance. Whether you’re developing DeFi solutions, wallets, or analytics platforms, take your project to the next level. [Start today with the Data API](/data-api/getting-started) and experience the difference!

# Rate Limits (/docs/api-reference/data-api/rate-limits)

---

title: Rate Limits
description: Rate Limits for the Data API
icon: Clock

---

Rate limiting is managed through a weighted scoring system, known as Compute Units (CUs). Each API request consumes a specified number of CUs, determined by the complexity of the request. This system is designed to accommodate basic requests while efficiently handling more computationally intensive operations.

## Rate Limit Tiers

The maximum CUs (rate-limiting score) for a user depends on their subscription level and is delineated in the following table:

| Subscription Level | Per Minute Limit (CUs) | Per Day Limit (CUs) |
| :----------------- | :--------------------- | :------------------ |
| Unauthenticated    | 6,000                  | 1,200,000           |
| Free               | 8,000                  | 2,000,000           |
| Base               | 10,000                 | 3,750,000           |
| Growth             | 14,000                 | 11,200,000          |
| Pro                | 20,000                 | 25,000,000          |

To update your subscription level use the [AvaCloud Portal](https://app.avacloud.io/)

<Info> Note: Rate limits apply collectively across both Webhooks and Data APIs, with usage from each counting toward your total CU limit. </Info>

## Rate Limit Categories

The CUs for each category are defined in the following table:

| Weight | CU Value |
| :----- | :------- |
| Free   | 1        |
| Small  | 10       |
| Medium | 20       |
| Large  | 50       |
| XL     | 100      |
| XXL    | 200      |

## Rate Limits for Data API Endpoints

The CUs for each route are defined in the table below:

| Endpoint                                                                          | Method | Weight | CU Value |
| :-------------------------------------------------------------------------------- | :----- | :----- | :------- |
| `/v1/health-check`                                                                | GET    | Medium | 20       |
| `/v1/address/{address}/chains`                                                    | GET    | Medium | 20       |
| `/v1/transactions`                                                                | GET    | Medium | 20       |
| `/v1/blocks`                                                                      | GET    | Medium | 20       |
| `/v1/chains/{chainId}/nfts/collections/{address}/tokens/{tokenId}:reindex`        | POST   | Small  | 10       |
| `/v1/chains/{chainId}/nfts/collections/{address}/tokens`                          | GET    | Medium | 20       |
| `/v1/chains/{chainId}/nfts/collections/{address}/tokens/{tokenId}`                | GET    | Medium | 20       |
| `/v1/operations/{operationId}`                                                    | GET    | Small  | 10       |
| `/v1/operations/transactions:export`                                              | POST   | Medium | 20       |
| `/v1/networks/{network}/blockchains/{blockchainId}/transactions/{txHash}`         | GET    | Medium | 20       |
| `/v1/networks/{network}/blockchains/{blockchainId}/transactions`                  | GET    | XL     | 100      |
| `/v1/networks/{network}/blockchains/{blockchainId}/transactions:listStaking`      | GET    | XL     | 100      |
| `/v1/networks/{network}/rewards:listPending`                                      | GET    | XL     | 100      |
| `/v1/networks/{network}/rewards`                                                  | GET    | XL     | 100      |
| `/v1/networks/{network}/blockchains/{blockchainId}/utxos`                         | GET    | XL     | 100      |
| `/v1/networks/{network}/blockchains/{blockchainId}/balances`                      | GET    | XL     | 100      |
| `/v1/networks/{network}/blockchains/{blockchainId}/blocks/{blockId}`              | GET    | XL     | 100      |
| `/v1/networks/{network}/blockchains/{blockchainId}/nodes/{nodeId}/blocks`         | GET    | Medium | 20       |
| `/v1/networks/{network}/blockchains/{blockchainId}/blocks`                        | GET    | Medium | 20       |
| `/v1/networks/{network}/blockchains/{blockchainId}/vertices`                      | GET    | Medium | 20       |
| `/v1/networks/{network}/blockchains/{blockchainId}/vertices/{vertexHash}`         | GET    | Medium | 20       |
| `/v1/networks/{network}/blockchains/{blockchainId}/vertices:listByHeight`         | GET    | Medium | 20       |
| `/v1/networks/{network}/blockchains/{blockchainId}/assets/{assetId}`              | GET    | XL     | 100      |
| `/v1/networks/{network}/blockchains/{blockchainId}/assets/{assetId}/transactions` | GET    | XL     | 100      |
| `/v1/networks/{network}/addresses:listChainIds`                                   | GET    | XL     | 100      |
| `/v1/networks/{network}`                                                          | GET    | XL     | 100      |
| `/v1/networks/{network}/blockchains`                                              | GET    | Medium | 20       |
| `/v1/networks/{network}/subnets`                                                  | GET    | Medium | 20       |
| `/v1/networks/{network}/subnets/{subnetId}`                                       | GET    | Medium | 20       |
| `/v1/networks/{network}/validators`                                               | GET    | Medium | 20       |
| `/v1/networks/{network}/validators/{nodeId}`                                      | GET    | Medium | 20       |
| `/v1/networks/{network}/delegators`                                               | GET    | Medium | 20       |
| `/v1/networks/{network}/l1Validators`                                             | GET    | Medium | 20       |
| `/v1/teleporter/messages/{messageId}`                                             | GET    | Medium | 20       |
| `/v1/teleporter/messages`                                                         | GET    | Medium | 20       |
| `/v1/teleporter/addresses/{address}/messages`                                     | GET    | Medium | 20       |
| `/v1/icm/messages/{messageId}`                                                    | GET    | Medium | 20       |
| `/v1/icm/messages`                                                                | GET    | Medium | 20       |
| `/v1/icm/addresses/{address}/messages`                                            | GET    | Medium | 20       |
| `/v1/apiUsageMetrics`                                                             | GET    | XXL    | 200      |
| `/v1/apiLogs`                                                                     | GET    | XXL    | 200      |
| `/v1/subnetRpcUsageMetrics`                                                       | GET    | XXL    | 200      |
| `/v1/rpcUsageMetrics`                                                             | GET    | XXL    | 200      |
| `/v1/primaryNetworkRpcUsageMetrics`                                               | GET    | XXL    | 200      |
| `/v1/signatureAggregator/{network}/aggregateSignatures`                           | POST   | Medium | 20       |
| `/v1/signatureAggregator/{network}/aggregateSignatures/{txHash}`                  | GET    | Medium | 20       |
| `/v1/chains/{chainId}/addresses/{address}/balances:getNative`                     | GET    | Medium | 20       |
| `/v1/chains/{chainId}/addresses/{address}/balances:listErc20`                     | GET    | Medium | 20       |
| `/v1/chains/{chainId}/addresses/{address}/balances:listErc721`                    | GET    | Medium | 20       |
| `/v1/chains/{chainId}/addresses/{address}/balances:listErc1155`                   | GET    | Medium | 20       |
| `/v1/chains/{chainId}/addresses/{address}/balances:listCollectibles`              | GET    | Medium | 20       |
| `/v1/chains/{chainId}/blocks`                                                     | GET    | Small  | 10       |
| `/v1/chains/{chainId}/blocks/{blockId}`                                           | GET    | Small  | 10       |
| `/v1/chains/{chainId}/contracts/{address}/transactions:getDeployment`             | GET    | Medium | 20       |
| `/v1/chains/{chainId}/contracts/{address}/deployments`                            | GET    | Medium | 20       |
| `/v1/chains/{chainId}/addresses/{address}`                                        | GET    | Medium | 20       |
| `/v1/chains`                                                                      | GET    | Free   | 1        |
| `/v1/chains/{chainId}`                                                            | GET    | Free   | 1        |
| `/v1/chains/address/{address}`                                                    | GET    | Free   | 1        |
| `/v1/chains/allTransactions`                                                      | GET    | Free   | 1        |
| `/v1/chains/allBlocks`                                                            | GET    | Free   | 1        |
| `/v1/chains/{chainId}/tokens/{address}/transfers`                                 | GET    | Medium | 20       |
| `/v1/chains/{chainId}/addresses/{address}/transactions`                           | GET    | Medium | 20       |
| `/v1/chains/{chainId}/addresses/{address}/transactions:listNative`                | GET    | Medium | 20       |
| `/v1/chains/{chainId}/addresses/{address}/transactions:listErc20`                 | GET    | Medium | 20       |
| `/v1/chains/{chainId}/addresses/{address}/transactions:listErc721`                | GET    | Medium | 20       |
| `/v1/chains/{chainId}/addresses/{address}/transactions:listErc1155`               | GET    | Medium | 20       |
| `/v1/chains/{chainId}/addresses/{address}/transactions:listInternals`             | GET    | Medium | 20       |
| `/v1/chains/{chainId}/transactions/{txHash}`                                      | GET    | Medium | 20       |
| `/v1/chains/{chainId}/blocks/{blockId}/transactions`                              | GET    | Medium | 20       |
| `/v1/chains/{chainId}/transactions`                                               | GET    | Medium | 20       |

## Rate Limits for RPC endpoints

The CUs for RPC calls are calculated based on the RPC method(s) within the request. The CUs assigned to each method are defined in the table below:

| Method                                    | Weight | CU Value |
| :---------------------------------------- | :----- | :------- |
| `eth_accounts`                            | Free   | 1        |
| `eth_blockNumber`                         | Small  | 10       |
| `eth_call`                                | Small  | 10       |
| `eth_coinbase`                            | Small  | 10       |
| `eth_chainId`                             | Free   | 1        |
| `eth_gasPrice`                            | Small  | 10       |
| `eth_getBalance`                          | Small  | 10       |
| `eth_getBlockByHash`                      | Small  | 10       |
| `eth_getBlockByNumber`                    | Small  | 10       |
| `eth_getBlockTransactionCountByNumber`    | Medium | 20       |
| `eth_getCode`                             | Medium | 20       |
| `eth_getLogs`                             | XXL    | 200      |
| `eth_getStorageAt`                        | Medium | 20       |
| `eth_getTransactionByBlockNumberAndIndex` | Medium | 20       |
| `eth_getTransactionByHash`                | Small  | 10       |
| `eth_getTransactionCount`                 | Small  | 10       |
| `eth_getTransactionReceipt`               | Small  | 10       |
| `eth_signTransaction`                     | Medium | 20       |
| `eth_sendTransaction`                     | Medium | 20       |
| `eth_sign`                                | Medium | 20       |
| `eth_sendRawTransaction`                  | Small  | 10       |
| `eth_syncing`                             | Free   | 1        |
| `net_listening`                           | Free   | 1        |
| `net_peerCount`                           | Medium | 20       |
| `net_version`                             | Free   | 1        |
| `web3_clientVersion`                      | Small  | 10       |
| `web3_sha3`                               | Small  | 10       |
| `eth_newPendingTransactionFilter`         | Medium | 20       |
| `eth_maxPriorityFeePerGas`                | Small  | 10       |
| `eth_baseFee`                             | Small  | 10       |
| `rpc_modules`                             | Free   | 1        |
| `eth_getChainConfig`                      | Small  | 10       |
| `eth_feeConfig`                           | Small  | 10       |
| `eth_getActivePrecompilesAt`              | Small  | 10       |

<Info> All rate limits, weights, and CU values are subject to change. </Info>

# Snowflake Datashare (/docs/api-reference/data-api/snowflake)

---

title: Snowflake Datashare
description: Snowflake Datashare for Avalanche blockchain data
icon: Snowflake

---

Avalanche Primary Network data (C-chain, P-chain, and X-chain blockchains) can be accessed in a sql-based table format via the [Snowflake Data Marketplace.](https://app.snowflake.com/marketplace)

Explore the blockchain state since the Genesis Block. These tables provide insights on transaction gas fees, DeFi activity, the historical stake of validators on the primary network, AVAX emissions rewarded to past validators/delegators, and fees paid by Avalanche L1 Validators to the primary network.

## Available Blockchain Data

#### Primary Network

- **C-chain:**
  - Blocks
  - Transactions
  - Logs
  - Internal Transactions
  - Receipts
  - Messages
- **P-chain:**
  - Blocks
  - Transactions
  - UTXOs
- **X-chain:**
  - Blocks
  - Transactions
  - Vertices before the [X-chain Linearization](https://www.avax.network/blog/cortina-x-chain-linearization) in the Cortina Upgrade
- **Dictionary:** A data dictionary is provided with the listing with column and table descriptions. Example columns include:
  - `c_blocks.blockchash`
  - `c_transactions.transactionfrom`
  - `c_logs.topichex_0`
  - `p_blocks.block_hash`
  - `p_blocks.block_index`
  - `p_blocks.type`
  - `p_transactions.timestamp`
  - `p_transactions.transaction_hash`
  - `utxos.utxo_id`
  - `utxos.address`
  - `vertices.vertex_hash`
  - `vertices.parent_hash`
  - `x_blocks.timestamp`
  - `x_blocks.proposer_id`
  - `x_transactions.transaction_hash`
  - `x_transactions.type`

#### Available Avalanche L1s

- **Gunzilla**
- **Dexalot**
- **DeFi Kingdoms (DFK)**
- **Henesys (MapleStory Universe)**

#### L1 Data

- Blocks
- Transactions
- Logs
- Internal Transactions (currently unavailable for DFK)
- Receipts
- Messages

## Access

Search for "Ava Labs" on the [Snowflake Data Marketplace](https://app.snowflake.com/marketplace).

# Get the health of the service (/docs/api-reference/data-api/health-check/data-health-check)

---

title: Get the health of the service
full: true
\_openapi:
method: GET
route: /v1/health-check
toc: []
structuredData:
headings: []
contents: - content: >-
Check the health of the service. This checks the read and write health
of the database and cache.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Check the health of the service. This checks the read and write health of the database and cache.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/health-check","method":"get"}]} webhooks={[]} hasHead={false} />

# Get the liveliness of the service (reads only) (/docs/api-reference/data-api/health-check/live-check)

---

title: Get the liveliness of the service (reads only)
full: true
\_openapi:
method: GET
route: /v1/live-check
toc: []
structuredData:
headings: []
contents: - content: Check the liveliness of the service (reads only).

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Check the liveliness of the service (reads only).

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/live-check","method":"get"}]} webhooks={[]} hasHead={false} />

# Get chain information (/docs/api-reference/data-api/evm-chains/getChainInfo)

---

title: Get chain information
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}
toc: []
structuredData:
headings: []
contents: - content: >-
Gets chain information for the EVM-compatible chain if supported by
AvaCloud.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets chain information for the EVM-compatible chain if supported by AvaCloud.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}","method":"get"}]} webhooks={[]} hasHead={false} />

# List all chains associated with a given address (/docs/api-reference/data-api/evm-chains/listAddressChains)

---

title: List all chains associated with a given address
full: true
\_openapi:
method: GET
route: /v1/address/{address}/chains
toc: []
structuredData:
headings: []
contents: - content: >-
Lists the chains where the specified address has participated in
transactions or ERC token transfers, either as a sender or receiver.
The data is refreshed every 15 minutes.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists the chains where the specified address has participated in transactions or ERC token transfers, either as a sender or receiver. The data is refreshed every 15 minutes.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/address/{address}/chains","method":"get"}]} webhooks={[]} hasHead={false} />

# List chains (/docs/api-reference/data-api/evm-chains/supportedChains)

---

title: List chains
full: true
\_openapi:
method: GET
route: /v1/chains
toc: []
structuredData:
headings: []
contents: - content: >-
Lists the AvaCloud supported EVM-compatible chains. Filterable by
network.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists the AvaCloud supported EVM-compatible chains. Filterable by network.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains","method":"get"}]} webhooks={[]} hasHead={false} />

# Get block (/docs/api-reference/data-api/evm-blocks/getBlock)

---

title: Get block
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/blocks/{blockId}
toc: []
structuredData:
headings: []
contents: - content: Gets the details of an individual block on the EVM-compatible chain.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets the details of an individual block on the EVM-compatible chain.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/blocks/{blockId}","method":"get"}]} webhooks={[]} hasHead={false} />

# List latest blocks (/docs/api-reference/data-api/evm-blocks/getLatestBlocks)

---

title: List latest blocks
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/blocks
toc: []
structuredData:
headings: []
contents: - content: >-
Lists the latest indexed blocks on the EVM-compatible chain sorted in
descending order by block timestamp.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists the latest indexed blocks on the EVM-compatible chain sorted in descending order by block timestamp.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/blocks","method":"get"}]} webhooks={[]} hasHead={false} />

# List latest blocks across all supported EVM chains (/docs/api-reference/data-api/evm-blocks/listLatestBlocksAllChains)

---

title: List latest blocks across all supported EVM chains
full: true
\_openapi:
method: GET
route: /v1/blocks
toc: []
structuredData:
headings: []
contents: - content: >-
Lists the most recent blocks from all supported EVM-compatible chains.
The results can be filtered by network.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists the most recent blocks from all supported EVM-compatible chains. The results can be filtered by network.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/blocks","method":"get"}]} webhooks={[]} hasHead={false} />

# Get deployment transaction (/docs/api-reference/data-api/evm-transactions/getDeploymentTransaction)

---

title: Get deployment transaction
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/contracts/{address}/transactions:getDeployment
toc: []
structuredData:
headings: []
contents: - content: >-
If the address is a smart contract, returns the transaction in which
it was deployed.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

If the address is a smart contract, returns the transaction in which it was deployed.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/contracts/{address}/transactions:getDeployment","method":"get"}]} webhooks={[]} hasHead={false} />

# Get transaction (/docs/api-reference/data-api/evm-transactions/getTransaction)

---

title: Get transaction
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/transactions/{txHash}
toc: []
structuredData:
headings: []
contents: - content: Gets the details of a single transaction.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets the details of a single transaction.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/transactions/{txHash}","method":"get"}]} webhooks={[]} hasHead={false} />

# List transactions for a block (/docs/api-reference/data-api/evm-transactions/getTransactionsForBlock)

---

title: List transactions for a block
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/blocks/{blockId}/transactions
toc: []
structuredData:
headings: []
contents: - content: Lists the transactions that occured in a given block.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists the transactions that occured in a given block.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/blocks/{blockId}/transactions","method":"get"}]} webhooks={[]} hasHead={false} />

# List deployed contracts (/docs/api-reference/data-api/evm-transactions/listContractDeployments)

---

title: List deployed contracts
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/contracts/{address}/deployments
toc: []
structuredData:
headings: []
contents: - content: Lists all contracts deployed by the given address.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists all contracts deployed by the given address.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/contracts/{address}/deployments","method":"get"}]} webhooks={[]} hasHead={false} />

# List ERC-1155 transfers (/docs/api-reference/data-api/evm-transactions/listErc1155Transactions)

---

title: List ERC-1155 transfers
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/addresses/{address}/transactions:listErc1155
toc: []
structuredData:
headings: []
contents: - content: Lists ERC-1155 transfers for an address. Filterable by block range.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists ERC-1155 transfers for an address. Filterable by block range.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/addresses/{address}/transactions:listErc1155","method":"get"}]} webhooks={[]} hasHead={false} />

# List ERC-20 transfers (/docs/api-reference/data-api/evm-transactions/listErc20Transactions)

---

title: List ERC-20 transfers
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/addresses/{address}/transactions:listErc20
toc: []
structuredData:
headings: []
contents: - content: Lists ERC-20 transfers for an address. Filterable by block range.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists ERC-20 transfers for an address. Filterable by block range.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/addresses/{address}/transactions:listErc20","method":"get"}]} webhooks={[]} hasHead={false} />

# List ERC-721 transfers (/docs/api-reference/data-api/evm-transactions/listErc721Transactions)

---

title: List ERC-721 transfers
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/addresses/{address}/transactions:listErc721
toc: []
structuredData:
headings: []
contents: - content: Lists ERC-721 transfers for an address. Filterable by block range.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists ERC-721 transfers for an address. Filterable by block range.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/addresses/{address}/transactions:listErc721","method":"get"}]} webhooks={[]} hasHead={false} />

# List internal transactions (/docs/api-reference/data-api/evm-transactions/listInternalTransactions)

---

title: List internal transactions
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/addresses/{address}/transactions:listInternals
toc: []
structuredData:
headings: []
contents: - content: >-
Returns a list of internal transactions for an address and chain.
Filterable by block range.

          Note that the internal transactions list only contains `CALL` or
          `CALLCODE` transactions with a non-zero value and
          `CREATE`/`CREATE2`/`CREATE3` transactions. To get a complete list of
          internal transactions use the `debug_` prefixed RPC methods on an
          archive node.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Returns a list of internal transactions for an address and chain. Filterable by block range.

Note that the internal transactions list only contains `CALL` or `CALLCODE` transactions with a non-zero value and `CREATE`/`CREATE2`/`CREATE3` transactions. To get a complete list of internal transactions use the `debug_` prefixed RPC methods on an archive node.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/addresses/{address}/transactions:listInternals","method":"get"}]} webhooks={[]} hasHead={false} />

# List latest transactions (/docs/api-reference/data-api/evm-transactions/listLatestTransactions)

---

title: List latest transactions
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/transactions
toc: []
structuredData:
headings: []
contents: - content: Lists the latest transactions. Filterable by status.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists the latest transactions. Filterable by status.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/transactions","method":"get"}]} webhooks={[]} hasHead={false} />

# List the latest transactions across all supported EVM chains (/docs/api-reference/data-api/evm-transactions/listLatestTransactionsAllChains)

---

title: List the latest transactions across all supported EVM chains
full: true
\_openapi:
method: GET
route: /v1/transactions
toc: []
structuredData:
headings: []
contents: - content: >-
Lists the most recent transactions from all supported EVM-compatible
chains. The results can be filtered based on transaction status.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists the most recent transactions from all supported EVM-compatible chains. The results can be filtered based on transaction status.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/transactions","method":"get"}]} webhooks={[]} hasHead={false} />

# List native transactions (/docs/api-reference/data-api/evm-transactions/listNativeTransactions)

---

title: List native transactions
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/addresses/{address}/transactions:listNative
toc: []
structuredData:
headings: []
contents: - content: Lists native transactions for an address. Filterable by block range.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists native transactions for an address. Filterable by block range.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/addresses/{address}/transactions:listNative","method":"get"}]} webhooks={[]} hasHead={false} />

# List transactions (/docs/api-reference/data-api/evm-transactions/listTransactions)

---

title: List transactions
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/addresses/{address}/transactions
toc: []
structuredData:
headings: []
contents: - content: >-
Returns a list of transactions where the given wallet address had an
on-chain interaction for the given chain. The ERC-20 transfers,
ERC-721 transfers, ERC-1155, and internal transactions returned are
only those where the input address had an interaction. Specifically,
those lists only inlcude entries where the input address was the
sender (`from` field) or the receiver (`to` field) for the
sub-transaction. Therefore the transactions returned from this list
may not be complete representations of the on-chain data. For a
complete view of a transaction use the
`/chains/:chainId/transactions/:txHash` endpoint.

          Filterable by block ranges.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Returns a list of transactions where the given wallet address had an on-chain interaction for the given chain. The ERC-20 transfers, ERC-721 transfers, ERC-1155, and internal transactions returned are only those where the input address had an interaction. Specifically, those lists only inlcude entries where the input address was the sender (`from` field) or the receiver (`to` field) for the sub-transaction. Therefore the transactions returned from this list may not be complete representations of the on-chain data. For a complete view of a transaction use the `/chains/:chainId/transactions/:txHash` endpoint.

Filterable by block ranges.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/addresses/{address}/transactions","method":"get"}]} webhooks={[]} hasHead={false} />

# List transactions v2 (/docs/api-reference/data-api/evm-transactions/listTransactionsV2)

---

title: List transactions v2
full: true
\_openapi:
method: GET
route: /v2/chains/{chainId}/addresses/{address}/transactions
toc: []
structuredData:
headings: []
contents: - content: >-
Returns a list of transactions where the given wallet address had an
on-chain interaction for the given chain. The ERC-20 transfers (with
token reputation), ERC-721 transfers, ERC-1155, and internal
transactions returned are only those where the input address had an
interaction. Specifically, those lists only inlcude entries where the
input address was the sender (`from` field) or the receiver (`to`
field) for the sub-transaction. Therefore the transactions returned
from this list may not be complete representations of the on-chain
data. For a complete view of a transaction use the
`/chains/:chainId/transactions/:txHash` endpoint.

          Filterable by block ranges.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Returns a list of transactions where the given wallet address had an on-chain interaction for the given chain. The ERC-20 transfers (with token reputation), ERC-721 transfers, ERC-1155, and internal transactions returned are only those where the input address had an interaction. Specifically, those lists only inlcude entries where the input address was the sender (`from` field) or the receiver (`to` field) for the sub-transaction. Therefore the transactions returned from this list may not be complete representations of the on-chain data. For a complete view of a transaction use the `/chains/:chainId/transactions/:txHash` endpoint.

Filterable by block ranges.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v2/chains/{chainId}/addresses/{address}/transactions","method":"get"}]} webhooks={[]} hasHead={false} />

# List ERC transfers (/docs/api-reference/data-api/evm-transactions/listTransfers)

---

title: List ERC transfers
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/tokens/{address}/transfers
toc: []
structuredData:
headings: []
contents: - content: >-
Lists ERC transfers for an ERC-20, ERC-721, or ERC-1155 contract
address.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists ERC transfers for an ERC-20, ERC-721, or ERC-1155 contract address.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/tokens/{address}/transfers","method":"get"}]} webhooks={[]} hasHead={false} />

# Get native token balance (/docs/api-reference/data-api/evm-balances/getNativeBalance)

---

title: Get native token balance
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/addresses/{address}/balances:getNative
toc: []
structuredData:
headings: []
contents: - content: >-
Gets native token balance of a wallet address.

          Balance at a given block can be retrieved with the `blockNumber`
          parameter.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets native token balance of a wallet address.

Balance at a given block can be retrieved with the `blockNumber` parameter.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/addresses/{address}/balances:getNative","method":"get"}]} webhooks={[]} hasHead={false} />

# List collectible (ERC-721/ERC-1155) balances (/docs/api-reference/data-api/evm-balances/listCollectibleBalances)

---

title: List collectible (ERC-721/ERC-1155) balances
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/addresses/{address}/balances:listCollectibles
toc: []
structuredData:
headings: []
contents: - content: >-
Lists ERC-721 and ERC-1155 token balances of a wallet address.

          Balance for a specific contract can be retrieved with the
          `contractAddress` parameter.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists ERC-721 and ERC-1155 token balances of a wallet address.

Balance for a specific contract can be retrieved with the `contractAddress` parameter.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/addresses/{address}/balances:listCollectibles","method":"get"}]} webhooks={[]} hasHead={false} />

# List ERC-1155 balances (/docs/api-reference/data-api/evm-balances/listErc1155Balances)

---

title: List ERC-1155 balances
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/addresses/{address}/balances:listErc1155
toc: []
structuredData:
headings: []
contents: - content: >-
Lists ERC-1155 token balances of a wallet address.

          Balance at a given block can be retrieved with the `blockNumber`
          parameter.


          Balance for a specific contract can be retrieved with the
          `contractAddress` parameter.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists ERC-1155 token balances of a wallet address.

Balance at a given block can be retrieved with the `blockNumber` parameter.

Balance for a specific contract can be retrieved with the `contractAddress` parameter.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/addresses/{address}/balances:listErc1155","method":"get"}]} webhooks={[]} hasHead={false} />

# List ERC-20 balances (/docs/api-reference/data-api/evm-balances/listErc20Balances)

---

title: List ERC-20 balances
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/addresses/{address}/balances:listErc20
toc: []
structuredData:
headings: []
contents: - content: >-
Lists ERC-20 token balances of a wallet address.

          Balance at a given block can be retrieved with the `blockNumber`
          parameter.


          Balance for specific contracts can be retrieved with the
          `contractAddresses` parameter.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists ERC-20 token balances of a wallet address.

Balance at a given block can be retrieved with the `blockNumber` parameter.

Balance for specific contracts can be retrieved with the `contractAddresses` parameter.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/addresses/{address}/balances:listErc20","method":"get"}]} webhooks={[]} hasHead={false} />

# List ERC-721 balances (/docs/api-reference/data-api/evm-balances/listErc721Balances)

---

title: List ERC-721 balances
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/addresses/{address}/balances:listErc721
toc: []
structuredData:
headings: []
contents: - content: >-
Lists ERC-721 token balances of a wallet address.

          Balance for a specific contract can be retrieved with the
          `contractAddress` parameter.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists ERC-721 token balances of a wallet address.

Balance for a specific contract can be retrieved with the `contractAddress` parameter.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/addresses/{address}/balances:listErc721","method":"get"}]} webhooks={[]} hasHead={false} />

# Get contract metadata (/docs/api-reference/data-api/evm-contracts/getContractMetadata)

---

title: Get contract metadata
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/addresses/{address}
toc: []
structuredData:
headings: []
contents: - content: Gets metadata about the contract at the given address.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets metadata about the contract at the given address.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/addresses/{address}","method":"get"}]} webhooks={[]} hasHead={false} />

# Get token details (/docs/api-reference/data-api/nfts/getTokenDetails)

---

title: Get token details
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/nfts/collections/{address}/tokens/{tokenId}
toc: []
structuredData:
headings: []
contents: - content: Gets token details for a specific token of an NFT contract.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets token details for a specific token of an NFT contract.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/nfts/collections/{address}/tokens/{tokenId}","method":"get"}]} webhooks={[]} hasHead={false} />

# List tokens (/docs/api-reference/data-api/nfts/listTokens)

---

title: List tokens
full: true
\_openapi:
method: GET
route: /v1/chains/{chainId}/nfts/collections/{address}/tokens
toc: []
structuredData:
headings: []
contents: - content: Lists tokens for an NFT contract.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists tokens for an NFT contract.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/nfts/collections/{address}/tokens","method":"get"}]} webhooks={[]} hasHead={false} />

# Reindex NFT metadata (/docs/api-reference/data-api/nfts/reindexNft)

---

title: Reindex NFT metadata
full: true
\_openapi:
method: POST
route: /v1/chains/{chainId}/nfts/collections/{address}/tokens/{tokenId}:reindex
toc: []
structuredData:
headings: []
contents: - content: >-
Triggers reindexing of token metadata for an NFT token. Reindexing can
only be called once per hour for each NFT token.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Triggers reindexing of token metadata for an NFT token. Reindexing can only be called once per hour for each NFT token.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/chains/{chainId}/nfts/collections/{address}/tokens/{tokenId}:reindex","method":"post"}]} webhooks={[]} hasHead={false} />

# Get asset details (/docs/api-reference/data-api/primary-network/getAssetDetails)

---

title: Get asset details
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/blockchains/{blockchainId}/assets/{assetId}
toc: []
structuredData:
headings: []
contents: - content: Gets asset details corresponding to the given asset id on the X-Chain.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets asset details corresponding to the given asset id on the X-Chain.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/assets/{assetId}","method":"get"}]} webhooks={[]} hasHead={false} />

# Get blockchain details by ID (/docs/api-reference/data-api/primary-network/getBlockchainById)

---

title: Get blockchain details by ID
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/blockchains/{blockchainId}
toc: []
structuredData:
headings: []
contents: - content: Get details of the blockchain registered on the network.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Get details of the blockchain registered on the network.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}","method":"get"}]} webhooks={[]} hasHead={false} />

# Get chain interactions for addresses (/docs/api-reference/data-api/primary-network/getChainIdsForAddresses)

---

title: Get chain interactions for addresses
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/addresses:listChainIds
toc: []
structuredData:
headings: []
contents: - content: >-
Returns Primary Network chains that each address has touched in the
form of an address mapped array. If an address has had any on-chain
interaction for a chain, that chain's chain id will be returned.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Returns Primary Network chains that each address has touched in the form of an address mapped array. If an address has had any on-chain interaction for a chain, that chain's chain id will be returned.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/addresses:listChainIds","method":"get"}]} webhooks={[]} hasHead={false} />

# Get network details (/docs/api-reference/data-api/primary-network/getNetworkDetails)

---

title: Get network details
full: true
\_openapi:
method: GET
route: /v1/networks/{network}
toc: []
structuredData:
headings: []
contents: - content: Gets network details such as validator and delegator stats.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets network details such as validator and delegator stats.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}","method":"get"}]} webhooks={[]} hasHead={false} />

# Get single validator details (/docs/api-reference/data-api/primary-network/getSingleValidatorDetails)

---

title: Get single validator details
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/validators/{nodeId}
toc: []
structuredData:
headings: []
contents: - content: >-
List validator details for a single validator. Filterable by
validation status.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

List validator details for a single validator. Filterable by validation status.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/validators/{nodeId}","method":"get"}]} webhooks={[]} hasHead={false} />

# Get Subnet details by ID (/docs/api-reference/data-api/primary-network/getSubnetById)

---

title: Get Subnet details by ID
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/subnets/{subnetId}
toc: []
structuredData:
headings: []
contents: - content: Get details of the Subnet registered on the network.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Get details of the Subnet registered on the network.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/subnets/{subnetId}","method":"get"}]} webhooks={[]} hasHead={false} />

# List blockchains (/docs/api-reference/data-api/primary-network/listBlockchains)

---

title: List blockchains
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/blockchains
toc: []
structuredData:
headings: []
contents: - content: Lists all blockchains registered on the network.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists all blockchains registered on the network.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains","method":"get"}]} webhooks={[]} hasHead={false} />

# List delegators (/docs/api-reference/data-api/primary-network/listDelegators)

---

title: List delegators
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/delegators
toc: []
structuredData:
headings: []
contents: - content: Lists details for delegators.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists details for delegators.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/delegators","method":"get"}]} webhooks={[]} hasHead={false} />

# List L1 validators (/docs/api-reference/data-api/primary-network/listL1Validators)

---

title: List L1 validators
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/l1Validators
toc: []
structuredData:
headings: []
contents: - content: >-
Lists details for L1 validators. By default, returns details for all
active L1 validators. Filterable by validator node ids, subnet id, and
validation id.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists details for L1 validators. By default, returns details for all active L1 validators. Filterable by validator node ids, subnet id, and validation id.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/l1Validators","method":"get"}]} webhooks={[]} hasHead={false} />

# List subnets (/docs/api-reference/data-api/primary-network/listSubnets)

---

title: List subnets
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/subnets
toc: []
structuredData:
headings: []
contents: - content: Lists all subnets registered on the network.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists all subnets registered on the network.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/subnets","method":"get"}]} webhooks={[]} hasHead={false} />

# List validators (/docs/api-reference/data-api/primary-network/listValidators)

---

title: List validators
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/validators
toc: []
structuredData:
headings: []
contents: - content: >-
Lists details for validators. By default, returns details for all
validators. The nodeIds parameter supports substring matching.
Filterable by validation status, delegation capacity, time remaining,
fee percentage, uptime performance, and subnet id.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists details for validators. By default, returns details for all validators. The nodeIds parameter supports substring matching. Filterable by validation status, delegation capacity, time remaining, fee percentage, uptime performance, and subnet id.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/validators","method":"get"}]} webhooks={[]} hasHead={false} />

# Get block (/docs/api-reference/data-api/primary-network-blocks/getBlockById)

---

title: Get block
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/blockchains/{blockchainId}/blocks/{blockId}
toc: []
structuredData:
headings: []
contents: - content: >-
Gets a block by block height or block hash on one of the Primary
Network chains.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets a block by block height or block hash on one of the Primary Network chains.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/blocks/{blockId}","method":"get"}]} webhooks={[]} hasHead={false} />

# List latest blocks (/docs/api-reference/data-api/primary-network-blocks/listLatestPrimaryNetworkBlocks)

---

title: List latest blocks
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/blockchains/{blockchainId}/blocks
toc: []
structuredData:
headings: []
contents: - content: Lists latest blocks on one of the Primary Network chains.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists latest blocks on one of the Primary Network chains.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/blocks","method":"get"}]} webhooks={[]} hasHead={false} />

# List blocks proposed by node (/docs/api-reference/data-api/primary-network-blocks/listPrimaryNetworkBlocksByNodeId)

---

title: List blocks proposed by node
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/blockchains/{blockchainId}/nodes/{nodeId}/blocks
toc: []
structuredData:
headings: []
contents: - content: >-
Lists the latest blocks proposed by a given NodeID on one of the
Primary Network chains.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists the latest blocks proposed by a given NodeID on one of the Primary Network chains.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/nodes/{nodeId}/blocks","method":"get"}]} webhooks={[]} hasHead={false} />

# Get transaction (/docs/api-reference/data-api/primary-network-transactions/getTxByHash)

---

title: Get transaction
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/blockchains/{blockchainId}/transactions/{txHash}
toc: []
structuredData:
headings: []
contents: - content: >-
Gets the details of a single transaction on one of the Primary Network
chains.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets the details of a single transaction on one of the Primary Network chains.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/transactions/{txHash}","method":"get"}]} webhooks={[]} hasHead={false} />

# List staking transactions (/docs/api-reference/data-api/primary-network-transactions/listActivePrimaryNetworkStakingTransactions)

---

title: List staking transactions
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/blockchains/{blockchainId}/transactions:listStaking
toc: []
structuredData:
headings: []
contents: - content: >-
Lists active staking transactions on the P-Chain for the supplied
addresses.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists active staking transactions on the P-Chain for the supplied addresses.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/transactions:listStaking","method":"get"}]} webhooks={[]} hasHead={false} />

# List asset transactions (/docs/api-reference/data-api/primary-network-transactions/listAssetTransactions)

---

title: List asset transactions
full: true
\_openapi:
method: GET
route: >-
/v1/networks/{network}/blockchains/{blockchainId}/assets/{assetId}/transactions
toc: []
structuredData:
headings: []
contents: - content: >-
Lists asset transactions corresponding to the given asset id on the
X-Chain.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists asset transactions corresponding to the given asset id on the X-Chain.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/assets/{assetId}/transactions","method":"get"}]} webhooks={[]} hasHead={false} />

# List latest transactions (/docs/api-reference/data-api/primary-network-transactions/listLatestPrimaryNetworkTransactions)

---

title: List latest transactions
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/blockchains/{blockchainId}/transactions
toc: []
structuredData:
headings: []
contents: - content: >-
Lists the latest transactions on one of the Primary Network chains.

          Transactions are filterable by addresses, txTypes, and timestamps.
          When querying for latest transactions without an address parameter,
          filtering by txTypes and timestamps is not supported. An address
          filter must be provided to utilize txTypes and timestamp filters.


          For P-Chain, you can fetch all L1 validators related transactions like
          ConvertSubnetToL1Tx, IncreaseL1ValidatorBalanceTx etc. using the
          unique L1 validation ID. These transactions are further filterable by
          txTypes and timestamps as well.


          Given that each transaction may return a large number of UTXO objects,
          bounded only by the maximum transaction size, the query may return
          less transactions than the provided page size. The result will contain
          less results than the page size if the number of utxos contained in
          the resulting transactions reach a performance threshold.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists the latest transactions on one of the Primary Network chains.

Transactions are filterable by addresses, txTypes, and timestamps. When querying for latest transactions without an address parameter, filtering by txTypes and timestamps is not supported. An address filter must be provided to utilize txTypes and timestamp filters.

For P-Chain, you can fetch all L1 validators related transactions like ConvertSubnetToL1Tx, IncreaseL1ValidatorBalanceTx etc. using the unique L1 validation ID. These transactions are further filterable by txTypes and timestamps as well.

Given that each transaction may return a large number of UTXO objects, bounded only by the maximum transaction size, the query may return less transactions than the provided page size. The result will contain less results than the page size if the number of utxos contained in the resulting transactions reach a performance threshold.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/transactions","method":"get"}]} webhooks={[]} hasHead={false} />

# Get balances (/docs/api-reference/data-api/primary-network-balances/getBalancesByAddresses)

---

title: Get balances
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/blockchains/{blockchainId}/balances
toc: []
structuredData:
headings: []
contents: - content: >-
Gets primary network balances for one of the Primary Network chains
for the supplied addresses.

          C-Chain balances returned are only the shared atomic memory balance.
          For EVM balance, use the
          `/v1/chains/:chainId/addresses/:addressId/balances:getNative`
          endpoint.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets primary network balances for one of the Primary Network chains for the supplied addresses.

C-Chain balances returned are only the shared atomic memory balance. For EVM balance, use the `/v1/chains/:chainId/addresses/:addressId/balances:getNative` endpoint.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/balances","method":"get"}]} webhooks={[]} hasHead={false} />

# Get last activity timestamp by addresses (/docs/api-reference/data-api/primary-network-utxos/getLastActivityTimestampByAddresses)

---

title: Get last activity timestamp by addresses
full: true
\_openapi:
method: GET
route: >-
/v1/networks/{network}/blockchains/{blockchainId}/lastActivityTimestampByAddresses
toc: []
structuredData:
headings: []
contents: - content: >-
Gets the last activity timestamp for the supplied addresses on one of
the Primary Network chains.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets the last activity timestamp for the supplied addresses on one of the Primary Network chains.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/lastActivityTimestampByAddresses","method":"get"}]} webhooks={[]} hasHead={false} />

# Get last activity timestamp by addresses v2 (/docs/api-reference/data-api/primary-network-utxos/getLastActivityTimestampByAddressesV2)

---

title: Get last activity timestamp by addresses v2
full: true
\_openapi:
method: POST
route: >-
/v1/networks/{network}/blockchains/{blockchainId}/lastActivityTimestampByAddresses
toc: []
structuredData:
headings: []
contents: - content: >-
Gets the last activity timestamp for the supplied addresses on one of
the Primary Network chains. V2 route supports querying for more
addresses.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets the last activity timestamp for the supplied addresses on one of the Primary Network chains. V2 route supports querying for more addresses.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/lastActivityTimestampByAddresses","method":"post"}]} webhooks={[]} hasHead={false} />

# List UTXOs (/docs/api-reference/data-api/primary-network-utxos/getUtxosByAddresses)

---

title: List UTXOs
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/blockchains/{blockchainId}/utxos
toc: []
structuredData:
headings: []
contents: - content: >-
Lists UTXOs on one of the Primary Network chains for the supplied
addresses.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists UTXOs on one of the Primary Network chains for the supplied addresses.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/utxos","method":"get"}]} webhooks={[]} hasHead={false} />

# List UTXOs v2 - Supports querying for more addresses (/docs/api-reference/data-api/primary-network-utxos/getUtxosByAddressesV2)

---

title: List UTXOs v2 - Supports querying for more addresses
full: true
\_openapi:
method: POST
route: /v1/networks/{network}/blockchains/{blockchainId}/utxos
toc: []
structuredData:
headings: []
contents: - content: >-
Lists UTXOs on one of the Primary Network chains for the supplied
addresses. This v2 route supports increased page size and address
limit.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists UTXOs on one of the Primary Network chains for the supplied addresses. This v2 route supports increased page size and address limit.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/utxos","method":"post"}]} webhooks={[]} hasHead={false} />

# Get vertex (/docs/api-reference/data-api/primary-network-vertices/getVertexByHash)

---

title: Get vertex
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/blockchains/{blockchainId}/vertices/{vertexHash}
toc: []
structuredData:
headings: []
contents: - content: Gets a single vertex on the X-Chain.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets a single vertex on the X-Chain.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/vertices/{vertexHash}","method":"get"}]} webhooks={[]} hasHead={false} />

# List vertices by height (/docs/api-reference/data-api/primary-network-vertices/getVertexByHeight)

---

title: List vertices by height
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/blockchains/{blockchainId}/vertices:listByHeight
toc: []
structuredData:
headings: []
contents: - content: Lists vertices at the given vertex height on the X-Chain.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists vertices at the given vertex height on the X-Chain.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/vertices:listByHeight","method":"get"}]} webhooks={[]} hasHead={false} />

# List vertices (/docs/api-reference/data-api/primary-network-vertices/listLatestXChainVertices)

---

title: List vertices
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/blockchains/{blockchainId}/vertices
toc: []
structuredData:
headings: []
contents: - content: Lists latest vertices on the X-Chain.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists latest vertices on the X-Chain.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/blockchains/{blockchainId}/vertices","method":"get"}]} webhooks={[]} hasHead={false} />

# List historical rewards (/docs/api-reference/data-api/primary-network-rewards/listHistoricalPrimaryNetworkRewards)

---

title: List historical rewards
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/rewards
toc: []
structuredData:
headings: []
contents: - content: >-
Lists historical rewards on the Primary Network for the supplied
addresses.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists historical rewards on the Primary Network for the supplied addresses.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/rewards","method":"get"}]} webhooks={[]} hasHead={false} />

# List pending rewards (/docs/api-reference/data-api/primary-network-rewards/listPendingPrimaryNetworkRewards)

---

title: List pending rewards
full: true
\_openapi:
method: GET
route: /v1/networks/{network}/rewards:listPending
toc: []
structuredData:
headings: []
contents: - content: >-
Lists pending rewards on the Primary Network for the supplied
addresses.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists pending rewards on the Primary Network for the supplied addresses.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/networks/{network}/rewards:listPending","method":"get"}]} webhooks={[]} hasHead={false} />

# Get an ICM message (/docs/api-reference/data-api/interchain-messaging/getIcmMessage)

---

title: Get an ICM message
full: true
\_openapi:
method: GET
route: /v1/icm/messages/{messageId}
toc: []
structuredData:
headings: []
contents: - content: Gets an ICM message by teleporter message ID.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets an ICM message by teleporter message ID.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/icm/messages/{messageId}","method":"get"}]} webhooks={[]} hasHead={false} />

# List ICM messages (/docs/api-reference/data-api/interchain-messaging/listIcmMessages)

---

title: List ICM messages
full: true
\_openapi:
method: GET
route: /v1/icm/messages
toc: []
structuredData:
headings: []
contents: - content: Lists ICM messages. Ordered by timestamp in descending order.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists ICM messages. Ordered by timestamp in descending order.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/icm/messages","method":"get"}]} webhooks={[]} hasHead={false} />

# List ICM messages by address (/docs/api-reference/data-api/interchain-messaging/listIcmMessagesByAddress)

---

title: List ICM messages by address
full: true
\_openapi:
method: GET
route: /v1/icm/addresses/{address}/messages
toc: []
structuredData:
headings: []
contents: - content: >-
Lists ICM messages by address. Ordered by timestamp in descending
order.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Lists ICM messages by address. Ordered by timestamp in descending order.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/icm/addresses/{address}/messages","method":"get"}]} webhooks={[]} hasHead={false} />

# Aggregate Signatures (/docs/api-reference/data-api/signature-aggregator/aggregateSignatures)

---

title: Aggregate Signatures
full: true
\_openapi:
method: POST
route: /v1/signatureAggregator/{network}/aggregateSignatures
toc: []
structuredData:
headings: []
contents: - content: Aggregates Signatures for a Warp message from Subnet validators.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Aggregates Signatures for a Warp message from Subnet validators.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/signatureAggregator/{network}/aggregateSignatures","method":"post"}]} webhooks={[]} hasHead={false} />

# Get Aggregated Signatures (/docs/api-reference/data-api/signature-aggregator/getAggregatedSignatures)

---

title: Get Aggregated Signatures
full: true
\_openapi:
method: GET
route: /v1/signatureAggregator/{network}/aggregateSignatures/{txHash}
toc: []
structuredData:
headings: []
contents: - content: Get Aggregated Signatures for a P-Chain L1 related Warp Message.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Get Aggregated Signatures for a P-Chain L1 related Warp Message.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/signatureAggregator/{network}/aggregateSignatures/{txHash}","method":"get"}]} webhooks={[]} hasHead={false} />

# Get operation (/docs/api-reference/data-api/operations/getOperationResult)

---

title: Get operation
full: true
\_openapi:
method: GET
route: /v1/operations/{operationId}
toc: []
structuredData:
headings: []
contents: - content: Gets operation details for the given operation id.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets operation details for the given operation id.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/operations/{operationId}","method":"get"}]} webhooks={[]} hasHead={false} />

# Create transaction export operation (/docs/api-reference/data-api/operations/postTransactionExportJob)

---

title: Create transaction export operation
full: true
\_openapi:
method: POST
route: /v1/operations/transactions:export
toc: []
structuredData:
headings: []
contents: - content: >-
Trigger a transaction export operation with given parameters.

          The transaction export operation runs asynchronously in the
          background. The status of the job can be retrieved from the
          `/v1/operations/:operationId` endpoint using the `operationId`
          returned from this endpoint.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Trigger a transaction export operation with given parameters.

The transaction export operation runs asynchronously in the background. The status of the job can be retrieved from the `/v1/operations/:operationId` endpoint using the `operationId` returned from this endpoint.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/operations/transactions:export","method":"post"}]} webhooks={[]} hasHead={false} />

# Get logs for requests made by client (/docs/api-reference/data-api/data-api-usage-metrics/getApiLogs)

---

title: Get logs for requests made by client
full: true
\_openapi:
method: GET
route: /v1/apiLogs
toc: []
structuredData:
headings: []
contents: - content: >-
Gets logs for requests made by client over a specified time interval
for a specific organization.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets logs for requests made by client over a specified time interval for a specific organization.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/apiLogs","method":"get"}]} webhooks={[]} hasHead={false} />

# Get usage metrics for the Data API (/docs/api-reference/data-api/data-api-usage-metrics/getApiUsageMetrics)

---

title: Get usage metrics for the Data API
full: true
\_openapi:
method: GET
route: /v1/apiUsageMetrics
toc: []
structuredData:
headings: []
contents: - content: >-
Gets metrics for Data API usage over a specified time interval
aggregated at the specified time-duration granularity.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets metrics for Data API usage over a specified time interval aggregated at the specified time-duration granularity.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/apiUsageMetrics","method":"get"}]} webhooks={[]} hasHead={false} />

# Get usage metrics for the Primary Network RPC (/docs/api-reference/data-api/data-api-usage-metrics/getPrimaryNetworkRpcUsageMetrics)

---

title: Get usage metrics for the Primary Network RPC
full: true
\_openapi:
method: GET
route: /v1/primaryNetworkRpcUsageMetrics
toc: []
structuredData:
headings: []
contents: - content: >-
Gets metrics for public Primary Network RPC usage over a specified
time interval aggregated at the specified time-duration granularity.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets metrics for public Primary Network RPC usage over a specified time interval aggregated at the specified time-duration granularity.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/primaryNetworkRpcUsageMetrics","method":"get"}]} webhooks={[]} hasHead={false} />

# Get usage metrics for the Subnet RPC (/docs/api-reference/data-api/data-api-usage-metrics/getSubnetRpcUsageMetrics)

---

title: Get usage metrics for the Subnet RPC
full: true
\_openapi:
method: GET
route: /v1/subnetRpcUsageMetrics
toc: []
structuredData:
headings: []
contents: - content: >-
Gets metrics for public Subnet RPC usage over a specified time
interval aggregated at the specified time-duration granularity.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Gets metrics for public Subnet RPC usage over a specified time interval aggregated at the specified time-duration granularity.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/subnetRpcUsageMetrics","method":"get"}]} webhooks={[]} hasHead={false} />

# Get AVAX supply information (/docs/api-reference/data-api/avax-supply/getAvaxSupply)

---

title: Get AVAX supply information
full: true
\_openapi:
method: GET
route: /v1/avax/supply
toc: []
structuredData:
headings: []
contents: - content: >-
Get AVAX supply information that includes total supply, circulating
supply, total p burned, total c burned, total x burned, total staked,
total locked, total rewards, and last updated.

---

{/_ This file was generated by Fumadocs. Do not edit this file directly. Any changes should be made by running the generation command again. _/}

Get AVAX supply information that includes total supply, circulating supply, total p burned, total c burned, total x burned, total staked, total locked, total rewards, and last updated.

<APIPage document={"./public/openapi/glacier.json"} operations={[{"path":"/v1/avax/supply","method":"get"}]} webhooks={[]} hasHead={false} />
