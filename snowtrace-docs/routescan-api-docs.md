---
title: Routescan API v2.0.0
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="routescan-api">Routescan API v2.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Routescan multi-chain explorer API docs

# Authentication

* API Key (apiKey)
    - Parameter Name: **apikey**, in: header. Api Key

<h1 id="routescan-api-avm">AVM</h1>

## get__v2_network_{networkId}_avm_{blockchainId}_address_{addressId}_transactions

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/avm/{blockchainId}/address/{addressId}/transactions \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/avm/{blockchainId}/address/{addressId}/transactions HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/avm/{blockchainId}/address/{addressId}/transactions',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/avm/{blockchainId}/address/{addressId}/transactions',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/avm/{blockchainId}/address/{addressId}/transactions', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/avm/{blockchainId}/address/{addressId}/transactions', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/avm/{blockchainId}/address/{addressId}/transactions");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/avm/{blockchainId}/address/{addressId}/transactions", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/avm/{blockchainId}/address/{addressId}/transactions`

<h3 id="get__v2_network_{networkid}_avm_{blockchainid}_address_{addressid}_transactions-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|timestampFrom|query|string(date-time)|false|Inclusive|
|timestampTo|query|string(date-time)|false|Exclusive|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|blockchainId|path|string|true|none|
|addressId|path|string(avm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "id": "string",
      "type": "base",
      "timestamp": "2019-08-24T14:15:22Z",
      "inputsCount": 0,
      "outputsCount": 0,
      "inputsLimit": 0,
      "outputsLimit": 0,
      "inputs": [
        {
          "id": "string",
          "txId": "string",
          "index": 0,
          "amount": "string",
          "srcChain": "string",
          "dstChain": "string",
          "owner": {
            "addresses": [
              "string"
            ],
            "threshold": 0
          },
          "locktime": 0,
          "creds": [
            {
              "address": "string"
            }
          ],
          "asset": {
            "id": "string",
            "name": "string",
            "symbol": "string",
            "denomination": 0,
            "type": "fixed_cap"
          }
        }
      ],
      "outputs": [
        {
          "id": "string",
          "txId": "string",
          "index": 0,
          "amount": "string",
          "srcChain": "string",
          "dstChain": "string",
          "owner": {
            "addresses": [
              "string"
            ],
            "threshold": 0
          },
          "locktime": 0,
          "creds": [
            {
              "address": "string"
            }
          ],
          "asset": {
            "id": "string",
            "name": "string",
            "symbol": "string",
            "denomination": 0,
            "type": "fixed_cap"
          }
        }
      ],
      "memo": "string"
    }
  ],
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_avm_{blockchainid}_address_{addressid}_transactions-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_avm_{blockchainid}_address_{addressid}_transactions-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» id|string|true|none|none|
|»» type|string|false|none|none|
|»» timestamp|string(date-time)|true|none|none|
|»» inputsCount|number|true|none|Total number of inputs for this transaction|
|»» outputsCount|number|true|none|Total number of outputs for this transaction|
|»» inputsLimit|number|false|none|If this field is set, it means we have loaded up to N inputs from the transaction|
|»» outputsLimit|number|false|none|If this field is set, it means we have loaded up to N outputs from the transaction|
|»» inputs|[object]|true|none|none|
|»»» id|string|true|none|none|
|»»» txId|string|true|none|none|
|»»» index|number|true|none|none|
|»»» amount|string(bigint)|true|none|none|
|»»» srcChain|string|false|none|Populated if this UTXO results from an import|
|»»» dstChain|string|false|none|Populated if this UTXO results from an export|
|»»» owner|object|true|none|none|
|»»»» addresses|[string]|true|none|none|
|»»»» threshold|number|true|none|none|
|»»» locktime|number|false|none|none|
|»»» creds|[object]|false|none|none|
|»»»» address|string|true|none|none|
|»»» asset|object|false|none|none|
|»»»» id|string|true|none|none|
|»»»» name|string|false|none|none|
|»»»» symbol|string|false|none|none|
|»»»» denomination|number|false|none|none|
|»»»» type|string|false|none|none|
|»» outputs|[object]|true|none|none|
|»»» id|string|true|none|none|
|»»» txId|string|true|none|none|
|»»» index|number|true|none|none|
|»»» amount|string(bigint)|true|none|none|
|»»» srcChain|string|false|none|Populated if this UTXO results from an import|
|»»» dstChain|string|false|none|Populated if this UTXO results from an export|
|»»» owner|object|true|none|none|
|»»»» addresses|[string]|true|none|none|
|»»»» threshold|number|true|none|none|
|»»» locktime|number|false|none|none|
|»»» creds|[object]|false|none|none|
|»»»» address|string|true|none|none|
|»»» asset|object|false|none|none|
|»»»» id|string|true|none|none|
|»»»» name|string|false|none|none|
|»»»» symbol|string|false|none|none|
|»»»» denomination|number|false|none|none|
|»»»» type|string|false|none|none|
|»» memo|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|base|
|type|create_asset|
|type|create_asset_fixed_cap|
|type|create_asset_var_cap|
|type|create_asset_nft|
|type|operation|
|type|mint_asset_var_cap|
|type|mint_nft|
|type|transfer_nft|
|type|multimint_var_cap|
|type|multimint_nft|
|type|multitransfer_nft|
|type|composite|
|type|import|
|type|export|
|type|fixed_cap|
|type|var_cap|
|type|nft|
|type|fixed_cap|
|type|var_cap|
|type|nft|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_avm_{blockchainId}_transactions_{transactionId}

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId} \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}`

<h3 id="get__v2_network_{networkid}_avm_{blockchainid}_transactions_{transactionid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|networkId|path|string|true|none|
|blockchainId|path|string|true|none|
|transactionId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "type": "base",
  "timestamp": "2019-08-24T14:15:22Z",
  "inputsCount": 0,
  "outputsCount": 0,
  "inputsLimit": 0,
  "outputsLimit": 0,
  "inputs": [
    {
      "id": "string",
      "txId": "string",
      "index": 0,
      "amount": "string",
      "srcChain": "string",
      "dstChain": "string",
      "owner": {
        "addresses": [
          "string"
        ],
        "threshold": 0
      },
      "locktime": 0,
      "creds": [
        {
          "address": "string"
        }
      ],
      "asset": {
        "id": "string",
        "name": "string",
        "symbol": "string",
        "denomination": 0,
        "type": "fixed_cap"
      }
    }
  ],
  "outputs": [
    {
      "id": "string",
      "txId": "string",
      "index": 0,
      "amount": "string",
      "srcChain": "string",
      "dstChain": "string",
      "owner": {
        "addresses": [
          "string"
        ],
        "threshold": 0
      },
      "locktime": 0,
      "creds": [
        {
          "address": "string"
        }
      ],
      "asset": {
        "id": "string",
        "name": "string",
        "symbol": "string",
        "denomination": 0,
        "type": "fixed_cap"
      }
    }
  ],
  "memo": "string"
}
```

<h3 id="get__v2_network_{networkid}_avm_{blockchainid}_transactions_{transactionid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_avm_{blockchainid}_transactions_{transactionid}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|string|true|none|none|
|» type|string|false|none|none|
|» timestamp|string(date-time)|true|none|none|
|» inputsCount|number|true|none|Total number of inputs for this transaction|
|» outputsCount|number|true|none|Total number of outputs for this transaction|
|» inputsLimit|number|false|none|If this field is set, it means we have loaded up to N inputs from the transaction|
|» outputsLimit|number|false|none|If this field is set, it means we have loaded up to N outputs from the transaction|
|» inputs|[object]|true|none|none|
|»» id|string|true|none|none|
|»» txId|string|true|none|none|
|»» index|number|true|none|none|
|»» amount|string(bigint)|true|none|none|
|»» srcChain|string|false|none|Populated if this UTXO results from an import|
|»» dstChain|string|false|none|Populated if this UTXO results from an export|
|»» owner|object|true|none|none|
|»»» addresses|[string]|true|none|none|
|»»» threshold|number|true|none|none|
|»» locktime|number|false|none|none|
|»» creds|[object]|false|none|none|
|»»» address|string|true|none|none|
|»» asset|object|false|none|none|
|»»» id|string|true|none|none|
|»»» name|string|false|none|none|
|»»» symbol|string|false|none|none|
|»»» denomination|number|false|none|none|
|»»» type|string|false|none|none|
|» outputs|[object]|true|none|none|
|»» id|string|true|none|none|
|»» txId|string|true|none|none|
|»» index|number|true|none|none|
|»» amount|string(bigint)|true|none|none|
|»» srcChain|string|false|none|Populated if this UTXO results from an import|
|»» dstChain|string|false|none|Populated if this UTXO results from an export|
|»» owner|object|true|none|none|
|»»» addresses|[string]|true|none|none|
|»»» threshold|number|true|none|none|
|»» locktime|number|false|none|none|
|»» creds|[object]|false|none|none|
|»»» address|string|true|none|none|
|»» asset|object|false|none|none|
|»»» id|string|true|none|none|
|»»» name|string|false|none|none|
|»»» symbol|string|false|none|none|
|»»» denomination|number|false|none|none|
|»»» type|string|false|none|none|
|» memo|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|base|
|type|create_asset|
|type|create_asset_fixed_cap|
|type|create_asset_var_cap|
|type|create_asset_nft|
|type|operation|
|type|mint_asset_var_cap|
|type|mint_nft|
|type|transfer_nft|
|type|multimint_var_cap|
|type|multimint_nft|
|type|multitransfer_nft|
|type|composite|
|type|import|
|type|export|
|type|fixed_cap|
|type|var_cap|
|type|nft|
|type|fixed_cap|
|type|var_cap|
|type|nft|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_avm_{blockchainId}_transactions_{transactionId}_inputs

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/inputs \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/inputs HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/inputs',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/inputs',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/inputs', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/inputs', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/inputs");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/inputs", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/inputs`

Lists inputs of a specific transaction.

<h3 id="get__v2_network_{networkid}_avm_{blockchainid}_transactions_{transactionid}_inputs-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|blockchainId|path|string|true|none|
|transactionId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "id": "string",
      "txId": "string",
      "index": 0,
      "amount": "string",
      "srcChain": "string",
      "dstChain": "string",
      "owner": {
        "addresses": [
          "string"
        ],
        "threshold": 0
      },
      "locktime": 0,
      "creds": [
        {
          "address": "string"
        }
      ],
      "asset": {
        "id": "string",
        "name": "string",
        "symbol": "string",
        "denomination": 0,
        "type": "fixed_cap"
      }
    }
  ],
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_avm_{blockchainid}_transactions_{transactionid}_inputs-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_avm_{blockchainid}_transactions_{transactionid}_inputs-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» id|string|true|none|none|
|»» txId|string|true|none|none|
|»» index|number|true|none|none|
|»» amount|string(bigint)|true|none|none|
|»» srcChain|string|false|none|Populated if this UTXO results from an import|
|»» dstChain|string|false|none|Populated if this UTXO results from an export|
|»» owner|object|true|none|none|
|»»» addresses|[string]|true|none|none|
|»»» threshold|number|true|none|none|
|»» locktime|number|false|none|none|
|»» creds|[object]|false|none|none|
|»»» address|string|true|none|none|
|»» asset|object|false|none|none|
|»»» id|string|true|none|none|
|»»» name|string|false|none|none|
|»»» symbol|string|false|none|none|
|»»» denomination|number|false|none|none|
|»»» type|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|fixed_cap|
|type|var_cap|
|type|nft|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_avm_{blockchainId}_transactions_{transactionId}_outputs

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/outputs \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/outputs HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/outputs',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/outputs',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/outputs', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/outputs', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/outputs");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/outputs", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/avm/{blockchainId}/transactions/{transactionId}/outputs`

Lists the outputs of a specific transaction.

<h3 id="get__v2_network_{networkid}_avm_{blockchainid}_transactions_{transactionid}_outputs-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|blockchainId|path|string|true|none|
|transactionId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "id": "string",
      "txId": "string",
      "index": 0,
      "amount": "string",
      "srcChain": "string",
      "dstChain": "string",
      "owner": {
        "addresses": [
          "string"
        ],
        "threshold": 0
      },
      "locktime": 0,
      "creds": [
        {
          "address": "string"
        }
      ],
      "asset": {
        "id": "string",
        "name": "string",
        "symbol": "string",
        "denomination": 0,
        "type": "fixed_cap"
      }
    }
  ],
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_avm_{blockchainid}_transactions_{transactionid}_outputs-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_avm_{blockchainid}_transactions_{transactionid}_outputs-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» id|string|true|none|none|
|»» txId|string|true|none|none|
|»» index|number|true|none|none|
|»» amount|string(bigint)|true|none|none|
|»» srcChain|string|false|none|Populated if this UTXO results from an import|
|»» dstChain|string|false|none|Populated if this UTXO results from an export|
|»» owner|object|true|none|none|
|»»» addresses|[string]|true|none|none|
|»»» threshold|number|true|none|none|
|»» locktime|number|false|none|none|
|»» creds|[object]|false|none|none|
|»»» address|string|true|none|none|
|»» asset|object|false|none|none|
|»»» id|string|true|none|none|
|»»» name|string|false|none|none|
|»»» symbol|string|false|none|none|
|»»» denomination|number|false|none|none|
|»»» type|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|fixed_cap|
|type|var_cap|
|type|nft|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

<h1 id="routescan-api-etherscan">Etherscan</h1>

## post__v2_network_{networkId}_evm_{chainId}_etherscan

> Code samples

```shell
# You can also use wget
curl -X POST /v2/network/{networkId}/evm/{chainId}/etherscan

```

```http
POST /v2/network/{networkId}/evm/{chainId}/etherscan HTTP/1.1

```

```javascript

fetch('/v2/network/{networkId}/evm/{chainId}/etherscan',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.post '/v2/network/{networkId}/evm/{chainId}/etherscan',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.post('/v2/network/{networkId}/evm/{chainId}/etherscan')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/v2/network/{networkId}/evm/{chainId}/etherscan', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/etherscan");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/v2/network/{networkId}/evm/{chainId}/etherscan", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /v2/network/{networkId}/evm/{chainId}/etherscan`

Etherscan compatible endpoint. For more information, see: https://routescan.io/documentation/etherscan-compatibility/accounts

<h3 id="post__v2_network_{networkid}_evm_{chainid}_etherscan-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

<h1 id="routescan-api-evm">EVM</h1>

## get__v2_network_{networkId}_evm_{chainId}_addresses

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/addresses \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/addresses HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/addresses',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/addresses',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/addresses', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/addresses', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/addresses");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/addresses", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/addresses`

Lists the addresses.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_addresses-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|ids|query|array[string]|false|none|
|sort|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "address": "string",
      "balance": "string",
      "balanceValueUsd": "string",
      "name": "string"
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_addresses-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_addresses-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» address|string(evm-address)|true|none|none|
|»» balance|string(bigint)|false|none|none|
|»» balanceValueUsd|string(bigint)|false|none|none|
|»» name|string|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_addresses_{address}

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/addresses/{address} \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/addresses/{address} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/addresses/{address}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/addresses/{address}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/addresses/{address}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/addresses/{address}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/addresses/{address}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/addresses/{address}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/addresses/{address}`

Retrieves the details of a specific address.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_addresses_{address}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "address": "string",
  "balance": "string",
  "firstActivity": "2019-08-24T14:15:22Z",
  "transactionsCount": 0,
  "erc20TransfersCount": 0,
  "erc721TransfersCount": 0,
  "erc1155TransfersCount": 0
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_addresses_{address}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_addresses_{address}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» address|string(evm-address)|true|none|none|
|» balance|string(bigint)|false|none|none|
|» firstActivity|string(date-time)|false|none|none|
|» transactionsCount|number|false|none|none|
|» erc20TransfersCount|number|false|none|none|
|» erc721TransfersCount|number|false|none|none|
|» erc1155TransfersCount|number|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_avg-gas-price

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_avg-gas-price-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|unit|query|string|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|unit|second|
|unit|minute|
|unit|hour|
|unit|day|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_avg-gas-price-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_avg-gas-price-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_avg-gas-price_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_avg-gas-price_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_avg-gas-price_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_avg-gas-price_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_gas-used

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/gas-used \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/gas-used HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/gas-used`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_gas-used-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_gas-used-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_gas-used-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_gas-used_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/gas-used/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/gas-used/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/gas-used/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_gas-used_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_gas-used_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_gas-used_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_burned-fees

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_burned-fees-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_burned-fees-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_burned-fees-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_burned-fees_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_burned-fees_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_burned-fees_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_burned-fees_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_network-fees

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/network-fees \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/network-fees HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/network-fees`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_network-fees-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_network-fees-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_network-fees-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_network-fees_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/network-fees/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/network-fees/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/network-fees/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_network-fees_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_network-fees_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_network-fees_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_avg-gas-price-l1

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1 \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_avg-gas-price-l1-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_avg-gas-price-l1-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_avg-gas-price-l1-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_avg-gas-price-l1_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/avg-gas-price-l1/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_avg-gas-price-l1_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_avg-gas-price-l1_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_avg-gas-price-l1_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_gas-used-l1

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1 \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_gas-used-l1-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_gas-used-l1-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_gas-used-l1-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_gas-used-l1_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/gas-used-l1/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_gas-used-l1_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_gas-used-l1_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_gas-used-l1_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_burned-fees-l1

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1 \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_burned-fees-l1-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_burned-fees-l1-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_burned-fees-l1-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_burned-fees-l1_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/burned-fees-l1/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_burned-fees-l1_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_burned-fees-l1_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_burned-fees-l1_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_blocks

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/blocks \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/blocks HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/blocks',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/blocks',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/blocks', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/blocks', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/blocks");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/blocks", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/blocks`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_blocks-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_blocks-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_blocks-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_blocks_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/blocks/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/blocks/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/blocks/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/blocks/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/blocks/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/blocks/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/blocks/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/blocks/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/blocks/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_blocks_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_blocks_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_blocks_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_erc20-transfers

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc20-transfers-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc20-transfers-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc20-transfers-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_erc20-transfers_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc20-transfers/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc20-transfers_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc20-transfers_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc20-transfers_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_erc721-transfers

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc721-transfers-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc721-transfers-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc721-transfers-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_erc721-transfers_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc721-transfers/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc721-transfers_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc721-transfers_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc721-transfers_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_erc1155-transfers

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc1155-transfers-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc1155-transfers-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc1155-transfers-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_erc1155-transfers_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/erc1155-transfers/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc1155-transfers_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc1155-transfers_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_erc1155-transfers_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_internal-operations

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_internal-operations-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_internal-operations-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_internal-operations-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_internal-operations_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/internal-operations/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_internal-operations_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_internal-operations_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_internal-operations_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_addresses

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/addresses \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/addresses HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/addresses',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/addresses',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/addresses', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/addresses', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/addresses");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/addresses", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/addresses`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_addresses-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_addresses-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_addresses-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_addresses_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/addresses/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/addresses/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/addresses/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/addresses/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/addresses/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/addresses/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/addresses/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/addresses/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/addresses/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_addresses_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_addresses_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_addresses_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_senders

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/senders \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/senders HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/senders',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/senders',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/senders', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/senders', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/senders");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/senders", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/senders`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_senders-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_senders-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_senders-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_senders_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/senders/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/senders/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/senders/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/senders/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/senders/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/senders/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/senders/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/senders/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/senders/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_senders_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_senders_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_senders_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_receivers

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/receivers \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/receivers HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/receivers',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/receivers',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/receivers', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/receivers', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/receivers");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/receivers", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/receivers`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_receivers-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_receivers-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_receivers-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_receivers_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/receivers/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/receivers/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/receivers/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/receivers/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/receivers/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/receivers/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/receivers/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/receivers/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/receivers/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_receivers_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_receivers_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_receivers_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_address_{address}_gas-used_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/gas-used/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/gas-used/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/gas-used/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/gas-used/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/gas-used/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/gas-used/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/gas-used/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/gas-used/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/gas-used/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_address_{address}_gas-used_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_address_{address}_gas-used_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_address_{address}_gas-used_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_address_{address}_burned-fees_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/burned-fees/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/burned-fees/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/burned-fees/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/burned-fees/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/burned-fees/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/burned-fees/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/burned-fees/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/burned-fees/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/address/{address}/burned-fees/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_address_{address}_burned-fees_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_address_{address}_burned-fees_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_address_{address}_burned-fees_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_network-fees-usd

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd`

Returns daily network fees converted to USD using historical token prices.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_network-fees-usd-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_network-fees-usd-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_network-fees-usd-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_network-fees-usd_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/network-fees-usd/tot`

Returns the total network fees in USD for the given date range.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_network-fees-usd_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_network-fees-usd_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_network-fees-usd_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_contracts

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/contracts \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/contracts HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/contracts',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/contracts',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/contracts', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/contracts', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/contracts");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/contracts", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/contracts`

Lists the daily contracts counts.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_contracts-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|sort|query|string|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sort|asc|
|sort|desc|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_contracts-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_contracts-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_contracts_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/contracts/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/contracts/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/contracts/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/contracts/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/contracts/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/contracts/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/contracts/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/contracts/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/contracts/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_contracts_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_contracts_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_contracts_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_contracts-verified

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified`

Lists the daily counts of verified contracts.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_contracts-verified-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|sort|query|string|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sort|asc|
|sort|desc|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_contracts-verified-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_contracts-verified-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_contracts-verified_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/contracts-verified/tot`

Lists the total count of verified contracts.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_contracts-verified_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_contracts-verified_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_contracts-verified_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_txs_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/txs/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/txs/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/txs/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/txs/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/txs/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/txs/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/txs/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/txs/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/txs/tot`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_txs_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|fromAddresses|query|array[string]|false|none|
|toAddresses|query|array[string]|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_txs_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_txs_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_txs

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/txs \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/txs HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/txs',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/txs',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/txs', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/txs', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/txs");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/txs", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/txs`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_txs-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|fromAddresses|query|array[string]|false|none|
|toAddresses|query|array[string]|false|none|
|unit|query|string|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|unit|second|
|unit|minute|
|unit|hour|
|unit|day|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_txs-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_txs-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_unique-addresses

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses`

Lists the daily running counts of unique addresseses.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_unique-addresses-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|sort|query|string|false|none|
|unit|query|string|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sort|asc|
|sort|desc|
|unit|day|
|unit|week|
|unit|month|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  [
    "string"
  ]
]
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_unique-addresses-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_unique-addresses-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_aggregations_unique-addresses_tot

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses/tot \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses/tot HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses/tot',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses/tot',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses/tot', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses/tot', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses/tot");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses/tot", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/aggregations/unique-addresses/tot`

Retrieves the total count of unique addresses.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_unique-addresses_tot-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|sort|query|string|false|none|
|dateFrom|query|string(date-time)|false|none|
|dateTo|query|string(date-time)|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sort|asc|
|sort|desc|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "value": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_unique-addresses_tot-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_aggregations_unique-addresses_tot-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» value|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_contracts

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/contracts \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/contracts HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/contracts',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/contracts',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/contracts', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/contracts', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/contracts");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/contracts", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/contracts`

Lists the contracts.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_contracts-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|verified|query|boolean|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "address": "string",
      "createOperation": {
        "timestamp": "2019-08-24T14:15:22Z",
        "txHash": "string",
        "index": 0,
        "type": "string",
        "from": "string"
      },
      "name": "string",
      "verified": true,
      "verifiedAt": "2019-08-24T14:15:22Z",
      "txCount": 0,
      "hasConstructorArguments": true,
      "licenseType": "string",
      "compilerName": "string",
      "compilerVersion": "string",
      "compilerSettings": {
        "evmVersion": "string",
        "optimizer": {
          "enabled": true,
          "runs": 0
        }
      }
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_contracts-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_contracts-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» address|string(evm-address)|true|none|none|
|»» createOperation|object|false|none|none|
|»»» timestamp|string(date-time)|false|none|none|
|»»» txHash|string|false|none|none|
|»»» index|number|false|none|none|
|»»» type|string|false|none|none|
|»»» from|string|false|none|none|
|»» name|string|false|none|none|
|»» verified|boolean|false|none|none|
|»» verifiedAt|string(date-time)|false|none|none|
|»» txCount|number|false|none|none|
|»» hasConstructorArguments|boolean|false|none|none|
|»» licenseType|string|false|none|none|
|»» compilerName|string|false|none|none|
|»» compilerVersion|string|false|none|none|
|»» compilerSettings|object|false|none|none|
|»»» evmVersion|string|false|none|none|
|»»» optimizer|object|false|none|none|
|»»»» enabled|boolean|false|none|none|
|»»»» runs|number|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## post__v2_network_{networkId}_evm_{chainId}_vyper-verifications

> Code samples

```shell
# You can also use wget
curl -X POST /v2/network/{networkId}/evm/{chainId}/vyper-verifications \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /v2/network/{networkId}/evm/{chainId}/vyper-verifications HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "format": "json",
  "address": "string",
  "data": null,
  "compilerVersion": "string",
  "contract": "string",
  "constructorArguments": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/vyper-verifications',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/v2/network/{networkId}/evm/{chainId}/vyper-verifications',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/v2/network/{networkId}/evm/{chainId}/vyper-verifications', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/v2/network/{networkId}/evm/{chainId}/vyper-verifications', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/vyper-verifications");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/v2/network/{networkId}/evm/{chainId}/vyper-verifications", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /v2/network/{networkId}/evm/{chainId}/vyper-verifications`

Verifies a vyper contract.

> Body parameter

```json
{
  "format": "json",
  "address": "string",
  "data": null,
  "compilerVersion": "string",
  "contract": "string",
  "constructorArguments": "string"
}
```

<h3 id="post__v2_network_{networkid}_evm_{chainid}_vyper-verifications-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|body|body|any|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "id": "string"
}
```

<h3 id="post__v2_network_{networkid}_evm_{chainid}_vyper-verifications-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="post__v2_network_{networkid}_evm_{chainid}_vyper-verifications-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|string|true|none|Verification job id|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_vyper-verifications_{id}

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/vyper-verifications/{id} \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/vyper-verifications/{id} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/vyper-verifications/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/vyper-verifications/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/vyper-verifications/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/vyper-verifications/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/vyper-verifications/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/vyper-verifications/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/vyper-verifications/{id}`

Retrieves the status of the provided Vyper verification.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_vyper-verifications_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|id|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "status": "ok",
  "message": "string"
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_vyper-verifications_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_vyper-verifications_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|true|none|none|
|» message|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|ok|
|status|pending|
|status|error|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_cross-transactions_messages

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/cross-transactions/messages \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/cross-transactions/messages HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/cross-transactions/messages',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/cross-transactions/messages',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/cross-transactions/messages', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/cross-transactions/messages', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/cross-transactions/messages");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/cross-transactions/messages", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/cross-transactions/messages`

<h3 id="get__v2_network_{networkid}_evm_cross-transactions_messages-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|chainId|query|string|false|none|
|srcChainIds|query|array[string]|false|none|
|dstChainIds|query|array[string]|false|none|
|srcEcosystem|query|string|false|none|
|dstEcosystem|query|string|false|none|
|count|query|boolean|false|none|
|types|query|array[string]|false|none|
|fromAddress|query|string(evm-address)|false|none|
|toAddress|query|string(evm-address)|false|none|
|timestampFrom|query|string(date-time)|false|Inclusive|
|timestampTo|query|string(date-time)|false|Exclusive|
|txHash|query|string|false|Source or destination transaction hashes|
|sort|query|string|false|none|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|types|opStackPreBedrockTx|
|types|opStackBedrockTx|
|types|teleporterTx|
|types|omni|
|types|opSuperchainInterop|
|types|taiko|
|types|layerZero|
|types|amb|
|types|CCTP|
|types|hyperlane|
|sort|asc|
|sort|desc|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "id": "string",
      "type": "opStackPreBedrockTx",
      "status": "completed",
      "srcChainId": "string",
      "srcTimestamp": "2019-08-24T14:15:22Z",
      "srcTxHash": "string",
      "srcBlockNumber": "string",
      "srcBlockHash": "string",
      "srcGasLimit": "string",
      "dstChainId": "string",
      "dstTimestamp": "2019-08-24T14:15:22Z",
      "dstTxHash": "string",
      "dstBlockNumber": "string",
      "dstBlockHash": "string",
      "dstGasLimit": "string",
      "from": "string",
      "to": "string",
      "data": {
        "property1": "string",
        "property2": "string"
      }
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_cross-transactions_messages-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_cross-transactions_messages-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» id|string|true|none|none|
|»» type|string|true|none|none|
|»» status|string|true|none|none|
|»» srcChainId|string|true|none|none|
|»» srcTimestamp|string(date-time)|true|none|none|
|»» srcTxHash|string|false|none|none|
|»» srcBlockNumber|string|false|none|none|
|»» srcBlockHash|string|false|none|none|
|»» srcGasLimit|string|false|none|none|
|»» dstChainId|string|true|none|none|
|»» dstTimestamp|string(date-time)|true|none|none|
|»» dstTxHash|string|false|none|none|
|»» dstBlockNumber|string|false|none|none|
|»» dstBlockHash|string|false|none|none|
|»» dstGasLimit|string|false|none|none|
|»» from|string(evm-address)|false|none|none|
|»» to|string(evm-address)|false|none|none|
|»» data|object|true|none|none|
|»»» **additionalProperties**|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» *anonymous*|number|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|opStackPreBedrockTx|
|type|opStackBedrockTx|
|type|teleporterTx|
|type|omni|
|type|opSuperchainInterop|
|type|taiko|
|type|layerZero|
|type|amb|
|type|CCTP|
|type|hyperlane|
|status|completed|
|status|pending|
|status|failed|
|status|ready_to_prove|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_cross-transactions_messages_{id}

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/cross-transactions/messages/{id} \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/cross-transactions/messages/{id} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/cross-transactions/messages/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/cross-transactions/messages/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/cross-transactions/messages/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/cross-transactions/messages/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/cross-transactions/messages/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/cross-transactions/messages/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/cross-transactions/messages/{id}`

<h3 id="get__v2_network_{networkid}_evm_cross-transactions_messages_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|networkId|path|string|true|none|
|id|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "type": "opStackPreBedrockTx",
  "status": "completed",
  "srcChainId": "string",
  "srcTimestamp": "2019-08-24T14:15:22Z",
  "srcTxHash": "string",
  "srcBlockNumber": "string",
  "srcBlockHash": "string",
  "srcGasLimit": "string",
  "dstChainId": "string",
  "dstTimestamp": "2019-08-24T14:15:22Z",
  "dstTxHash": "string",
  "dstBlockNumber": "string",
  "dstBlockHash": "string",
  "dstGasLimit": "string",
  "from": "string",
  "to": "string",
  "data": {
    "property1": "string",
    "property2": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_cross-transactions_messages_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_cross-transactions_messages_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|string|true|none|none|
|» type|string|true|none|none|
|» status|string|true|none|none|
|» srcChainId|string|true|none|none|
|» srcTimestamp|string(date-time)|true|none|none|
|» srcTxHash|string|false|none|none|
|» srcBlockNumber|string|false|none|none|
|» srcBlockHash|string|false|none|none|
|» srcGasLimit|string|false|none|none|
|» dstChainId|string|true|none|none|
|» dstTimestamp|string(date-time)|true|none|none|
|» dstTxHash|string|false|none|none|
|» dstBlockNumber|string|false|none|none|
|» dstBlockHash|string|false|none|none|
|» dstGasLimit|string|false|none|none|
|» from|string(evm-address)|false|none|none|
|» to|string(evm-address)|false|none|none|
|» data|object|true|none|none|
|»» **additionalProperties**|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|number|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|opStackPreBedrockTx|
|type|opStackBedrockTx|
|type|teleporterTx|
|type|omni|
|type|opSuperchainInterop|
|type|taiko|
|type|layerZero|
|type|amb|
|type|CCTP|
|type|hyperlane|
|status|completed|
|status|pending|
|status|failed|
|status|ready_to_prove|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_cross-transactions_actions

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/cross-transactions/actions \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/cross-transactions/actions HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/cross-transactions/actions',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/cross-transactions/actions',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/cross-transactions/actions', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/cross-transactions/actions', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/cross-transactions/actions");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/cross-transactions/actions", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/cross-transactions/actions`

<h3 id="get__v2_network_{networkid}_evm_cross-transactions_actions-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|chainId|query|string|false|none|
|srcChainIds|query|array[string]|false|none|
|dstChainIds|query|array[string]|false|none|
|srcEcosystem|query|string|false|none|
|dstEcosystem|query|string|false|none|
|count|query|boolean|false|none|
|actionTypes|query|array[string]|false|none|
|types|query|array[string]|false|none|
|fromAddress|query|string(evm-address)|false|none|
|toAddress|query|string(evm-address)|false|none|
|timestampFrom|query|string(date-time)|false|Inclusive|
|timestampTo|query|string(date-time)|false|Exclusive|
|txHash|query|string|false|Source or destination transaction hashes|
|status|query|array[string]|false|none|
|sort|query|string|false|none|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|actionTypes|GasGasBridge|
|actionTypes|ERC20GasBridge|
|actionTypes|GasERC20Bridge|
|actionTypes|ERC20ERC20Bridge|
|actionTypes|ERC721ERC721Bridge|
|actionTypes|VoidERC20Bridge|
|actionTypes|ERC20VoidBridge|
|actionTypes|ERC1155ERC1155Bridge|
|actionTypes|ArbitraryFunction|
|types|superchainWETH|
|types|superchainTokenBridge|
|types|opL1StandardBridge|
|types|opDeposited|
|types|dexalotBridge|
|types|taikoETHTransfer|
|types|taikoERC20Vault|
|types|taikoERC721Vault|
|types|omniBridge|
|types|avalancheBTCBridge|
|types|avalancheETHBridge|
|types|synapse|
|types|genericTransfer|
|types|ICTT|
|types|OFT|
|types|ambOmnibridge|
|types|CCTPTokenMessenger|
|types|nearIntent|
|types|superswaps|
|types|hyperlane|
|types|eil|
|status|pending|
|status|completed|
|status|failed|
|sort|asc|
|sort|desc|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "id": "string",
      "type": "superchainWETH",
      "status": "completed",
      "srcChainId": "string",
      "srcTimestamp": "2019-08-24T14:15:22Z",
      "srcTxHash": "string",
      "srcBlockNumber": "string",
      "srcBlockHash": "string",
      "srcGasLimit": "string",
      "dstChainId": "string",
      "dstTimestamp": "2019-08-24T14:15:22Z",
      "dstTxHash": "string",
      "dstBlockNumber": "string",
      "dstBlockHash": "string",
      "dstGasLimit": "string",
      "from": "string",
      "to": "string",
      "crossMessageId": "string",
      "actionType": "GasGasBridge",
      "data": {
        "srcToken": {
          "chainId": "string",
          "blockchainId": "string",
          "ecosystems": [
            "string"
          ],
          "address": "string",
          "name": "string",
          "symbol": "string",
          "decimals": 0,
          "totalSupply": "string",
          "price": "string",
          "priceChange1h": "string",
          "priceChange24h": "string",
          "recentMarketPrices": {
            "property1": "string",
            "property2": "string"
          },
          "marketCap": "string",
          "createdAt": "2019-08-24T14:15:22Z",
          "txHash": "string",
          "detail": {
            "alert": "string",
            "name": "string",
            "alias": "string",
            "unlock_date": "2019-08-24T14:15:22Z",
            "description": "string",
            "link": "string",
            "icon": "string",
            "iconUrls": {
              "32": "string",
              "64": "string",
              "256": "string",
              "1024": "string"
            },
            "type": "string",
            "symbol": "string",
            "reputation": "ok",
            "bridge": "string",
            "bridged_token": "string",
            "blacklist": true,
            "similar": [
              "string"
            ],
            "similar_token": [
              "string"
            ],
            "supertype": "string",
            "isBridge": true,
            "isContract": true,
            "bridged_chain": {
              "name": "string",
              "logo": "string",
              "chain_id_evm": "string",
              "external_url": "string"
            },
            "burnAddresses": [
              "string"
            ],
            "lockAddresses": [
              "string"
            ],
            "bridgeData": {
              "url": "string",
              "otherSideUrl": "string"
            },
            "url": "string",
            "social_profile": {
              "items": [
                {
                  "type": "string",
                  "value": "string",
                  "title": "string"
                }
              ]
            },
            "dapp": {
              "alias": "string",
              "url": "string",
              "description": "string"
            },
            "owner": "string",
            "tags": [
              "string"
            ]
          },
          "transfers": {
            "last24h": 0,
            "last48h": 0,
            "last72h": 0
          },
          "holders": 0,
          "market": {
            "totalSupply": 0,
            "circulatingSupply": 0,
            "burned": 0,
            "price": 0,
            "marketCap": 0,
            "minPriceLast24h": 0,
            "maxPriceLast24h": 0
          }
        },
        "dstToken": {
          "chainId": "string",
          "blockchainId": "string",
          "ecosystems": [
            "string"
          ],
          "address": "string",
          "name": "string",
          "symbol": "string",
          "decimals": 0,
          "totalSupply": "string",
          "price": "string",
          "priceChange1h": "string",
          "priceChange24h": "string",
          "recentMarketPrices": {
            "property1": "string",
            "property2": "string"
          },
          "marketCap": "string",
          "createdAt": "2019-08-24T14:15:22Z",
          "txHash": "string",
          "detail": {
            "alert": "string",
            "name": "string",
            "alias": "string",
            "unlock_date": "2019-08-24T14:15:22Z",
            "description": "string",
            "link": "string",
            "icon": "string",
            "iconUrls": {
              "32": "string",
              "64": "string",
              "256": "string",
              "1024": "string"
            },
            "type": "string",
            "symbol": "string",
            "reputation": "ok",
            "bridge": "string",
            "bridged_token": "string",
            "blacklist": true,
            "similar": [
              "string"
            ],
            "similar_token": [
              "string"
            ],
            "supertype": "string",
            "isBridge": true,
            "isContract": true,
            "bridged_chain": {
              "name": "string",
              "logo": "string",
              "chain_id_evm": "string",
              "external_url": "string"
            },
            "burnAddresses": [
              "string"
            ],
            "lockAddresses": [
              "string"
            ],
            "bridgeData": {
              "url": "string",
              "otherSideUrl": "string"
            },
            "url": "string",
            "social_profile": {
              "items": [
                {
                  "type": "string",
                  "value": "string",
                  "title": "string"
                }
              ]
            },
            "dapp": {
              "alias": "string",
              "url": "string",
              "description": "string"
            },
            "owner": "string",
            "tags": [
              "string"
            ]
          },
          "transfers": {
            "last24h": 0,
            "last48h": 0,
            "last72h": 0
          },
          "holders": 0,
          "market": {
            "totalSupply": 0,
            "circulatingSupply": 0,
            "burned": 0,
            "price": 0,
            "marketCap": 0,
            "minPriceLast24h": 0,
            "maxPriceLast24h": 0
          }
        },
        "srcAmount": "string",
        "dstAmount": "string",
        "entrypoint": {
          "chainId": "string",
          "blockchainId": "string",
          "ecosystems": [
            "string"
          ],
          "address": "string",
          "name": "string",
          "symbol": "string",
          "decimals": 0,
          "totalSupply": "string",
          "price": "string",
          "priceChange1h": "string",
          "priceChange24h": "string",
          "recentMarketPrices": {
            "property1": "string",
            "property2": "string"
          },
          "marketCap": "string",
          "createdAt": "2019-08-24T14:15:22Z",
          "txHash": "string",
          "detail": {
            "alert": "string",
            "name": "string",
            "alias": "string",
            "unlock_date": "2019-08-24T14:15:22Z",
            "description": "string",
            "link": "string",
            "icon": "string",
            "iconUrls": {
              "32": "string",
              "64": "string",
              "256": "string",
              "1024": "string"
            },
            "type": "string",
            "symbol": "string",
            "reputation": "ok",
            "bridge": "string",
            "bridged_token": "string",
            "blacklist": true,
            "similar": [
              "string"
            ],
            "similar_token": [
              "string"
            ],
            "supertype": "string",
            "isBridge": true,
            "isContract": true,
            "bridged_chain": {
              "name": "string",
              "logo": "string",
              "chain_id_evm": "string",
              "external_url": "string"
            },
            "burnAddresses": [
              "string"
            ],
            "lockAddresses": [
              "string"
            ],
            "bridgeData": {
              "url": "string",
              "otherSideUrl": "string"
            },
            "url": "string",
            "social_profile": {
              "items": [
                {
                  "type": "string",
                  "value": "string",
                  "title": "string"
                }
              ]
            },
            "dapp": {
              "alias": "string",
              "url": "string",
              "description": "string"
            },
            "owner": "string",
            "tags": [
              "string"
            ]
          },
          "transfers": {
            "last24h": 0,
            "last48h": 0,
            "last72h": 0
          },
          "holders": 0,
          "market": {
            "totalSupply": 0,
            "circulatingSupply": 0,
            "burned": 0,
            "price": 0,
            "marketCap": 0,
            "minPriceLast24h": 0,
            "maxPriceLast24h": 0
          }
        }
      }
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_cross-transactions_actions-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_cross-transactions_actions-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» id|string|true|none|none|
|»» type|string|true|none|none|
|»» status|string|true|none|none|
|»» srcChainId|string|true|none|none|
|»» srcTimestamp|string(date-time)|true|none|none|
|»» srcTxHash|string|false|none|none|
|»» srcBlockNumber|string|false|none|none|
|»» srcBlockHash|string|false|none|none|
|»» srcGasLimit|string|false|none|none|
|»» dstChainId|string|true|none|none|
|»» dstTimestamp|string(date-time)|true|none|none|
|»» dstTxHash|string|false|none|none|
|»» dstBlockNumber|string|false|none|none|
|»» dstBlockHash|string|false|none|none|
|»» dstGasLimit|string|false|none|none|
|»» from|string(evm-address)|false|none|none|
|»» to|string(evm-address)|false|none|none|
|»» crossMessageId|string|false|none|none|
|»» actionType|string|false|none|none|
|»» data|object|true|none|none|
|»»» srcToken|object|false|none|none|
|»»»» chainId|string|true|none|none|
|»»»» blockchainId|string|false|none|none|
|»»»» ecosystems|[string]|false|none|none|
|»»»» address|string|true|none|none|
|»»»» name|string|false|none|none|
|»»»» symbol|string|false|none|none|
|»»»» decimals|number|false|none|none|
|»»»» totalSupply|string(bigint)|false|none|none|
|»»»» price|string(bigint)|false|none|none|
|»»»» priceChange1h|string(bigint)|false|none|none|
|»»»» priceChange24h|string(bigint)|false|none|none|
|»»»» recentMarketPrices|object|false|none|none|
|»»»»» **additionalProperties**|string|false|none|none|
|»»»» marketCap|string(bigint)|false|none|none|
|»»»» createdAt|string(date-time)|false|none|none|
|»»»» txHash|string|false|none|none|
|»»»» detail|object|false|none|none|
|»»»»» alert|string|false|none|none|
|»»»»» name|string|false|none|none|
|»»»»» alias|string|false|none|none|
|»»»»» unlock_date|string(date-time)|false|none|none|
|»»»»» description|string|false|none|none|
|»»»»» link|string|false|none|none|
|»»»»» icon|string|false|none|none|
|»»»»» iconUrls|object|false|none|none|
|»»»»»» 32|string|false|none|none|
|»»»»»» 64|string|false|none|none|
|»»»»»» 256|string|false|none|none|
|»»»»»» 1024|string|false|none|none|
|»»»»» type|string|false|none|none|
|»»»»» symbol|string|false|none|none|
|»»»»» reputation|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» bridge|string|false|none|none|
|»»»»» bridged_token|string|false|none|none|
|»»»»» blacklist|boolean|false|none|none|
|»»»»» similar|[string]|false|none|none|
|»»»»» similar_token|[string]|false|none|none|
|»»»»» supertype|string|false|none|none|
|»»»»» isBridge|boolean|false|none|none|
|»»»»» isContract|boolean|false|none|none|
|»»»»» bridged_chain|object|false|none|none|
|»»»»»» name|string|false|none|none|
|»»»»»» logo|string|false|none|none|
|»»»»»» chain_id_evm|string|false|none|none|
|»»»»»» external_url|string|false|none|none|
|»»»»» burnAddresses|[string]|false|none|none|
|»»»»» lockAddresses|[string]|false|none|none|
|»»»»» bridgeData|object|false|none|none|
|»»»»»» url|string|false|none|none|
|»»»»»» otherSideUrl|string|false|none|none|
|»»»»» url|string|false|none|none|
|»»»»» social_profile|object|false|none|none|
|»»»»»» items|[object]|true|none|none|
|»»»»»»» type|string|true|none|none|
|»»»»»»» value|string|true|none|none|
|»»»»»»» title|string|false|none|none|
|»»»»» dapp|object|false|none|none|
|»»»»»» alias|string|false|none|none|
|»»»»»» url|string|false|none|none|
|»»»»»» description|string|false|none|none|
|»»»»» owner|string|false|none|none|
|»»»»» tags|[string]|false|none|none|
|»»»» transfers|object|false|none|none|
|»»»»» last24h|number|false|none|none|
|»»»»» last48h|number|false|none|none|
|»»»»» last72h|number|false|none|none|
|»»»» holders|number|false|none|none|
|»»»» market|object|false|none|none|
|»»»»» totalSupply|number|false|none|none|
|»»»»» circulatingSupply|number|false|none|none|
|»»»»» burned|number|false|none|none|
|»»»»» price|number|false|none|none|
|»»»»» marketCap|number|false|none|none|
|»»»»» minPriceLast24h|number|false|none|none|
|»»»»» maxPriceLast24h|number|false|none|none|
|»»» dstToken|object|false|none|none|
|»»»» chainId|string|true|none|none|
|»»»» blockchainId|string|false|none|none|
|»»»» ecosystems|[string]|false|none|none|
|»»»» address|string|true|none|none|
|»»»» name|string|false|none|none|
|»»»» symbol|string|false|none|none|
|»»»» decimals|number|false|none|none|
|»»»» totalSupply|string(bigint)|false|none|none|
|»»»» price|string(bigint)|false|none|none|
|»»»» priceChange1h|string(bigint)|false|none|none|
|»»»» priceChange24h|string(bigint)|false|none|none|
|»»»» recentMarketPrices|object|false|none|none|
|»»»»» **additionalProperties**|string|false|none|none|
|»»»» marketCap|string(bigint)|false|none|none|
|»»»» createdAt|string(date-time)|false|none|none|
|»»»» txHash|string|false|none|none|
|»»»» detail|object|false|none|none|
|»»»»» alert|string|false|none|none|
|»»»»» name|string|false|none|none|
|»»»»» alias|string|false|none|none|
|»»»»» unlock_date|string(date-time)|false|none|none|
|»»»»» description|string|false|none|none|
|»»»»» link|string|false|none|none|
|»»»»» icon|string|false|none|none|
|»»»»» iconUrls|object|false|none|none|
|»»»»»» 32|string|false|none|none|
|»»»»»» 64|string|false|none|none|
|»»»»»» 256|string|false|none|none|
|»»»»»» 1024|string|false|none|none|
|»»»»» type|string|false|none|none|
|»»»»» symbol|string|false|none|none|
|»»»»» reputation|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» bridge|string|false|none|none|
|»»»»» bridged_token|string|false|none|none|
|»»»»» blacklist|boolean|false|none|none|
|»»»»» similar|[string]|false|none|none|
|»»»»» similar_token|[string]|false|none|none|
|»»»»» supertype|string|false|none|none|
|»»»»» isBridge|boolean|false|none|none|
|»»»»» isContract|boolean|false|none|none|
|»»»»» bridged_chain|object|false|none|none|
|»»»»»» name|string|false|none|none|
|»»»»»» logo|string|false|none|none|
|»»»»»» chain_id_evm|string|false|none|none|
|»»»»»» external_url|string|false|none|none|
|»»»»» burnAddresses|[string]|false|none|none|
|»»»»» lockAddresses|[string]|false|none|none|
|»»»»» bridgeData|object|false|none|none|
|»»»»»» url|string|false|none|none|
|»»»»»» otherSideUrl|string|false|none|none|
|»»»»» url|string|false|none|none|
|»»»»» social_profile|object|false|none|none|
|»»»»»» items|[object]|true|none|none|
|»»»»»»» type|string|true|none|none|
|»»»»»»» value|string|true|none|none|
|»»»»»»» title|string|false|none|none|
|»»»»» dapp|object|false|none|none|
|»»»»»» alias|string|false|none|none|
|»»»»»» url|string|false|none|none|
|»»»»»» description|string|false|none|none|
|»»»»» owner|string|false|none|none|
|»»»»» tags|[string]|false|none|none|
|»»»» transfers|object|false|none|none|
|»»»»» last24h|number|false|none|none|
|»»»»» last48h|number|false|none|none|
|»»»»» last72h|number|false|none|none|
|»»»» holders|number|false|none|none|
|»»»» market|object|false|none|none|
|»»»»» totalSupply|number|false|none|none|
|»»»»» circulatingSupply|number|false|none|none|
|»»»»» burned|number|false|none|none|
|»»»»» price|number|false|none|none|
|»»»»» marketCap|number|false|none|none|
|»»»»» minPriceLast24h|number|false|none|none|
|»»»»» maxPriceLast24h|number|false|none|none|
|»»» srcAmount|string|false|none|none|
|»»» dstAmount|string|false|none|none|
|»»» entrypoint|object|false|none|none|
|»»»» chainId|string|true|none|none|
|»»»» blockchainId|string|false|none|none|
|»»»» ecosystems|[string]|false|none|none|
|»»»» address|string|true|none|none|
|»»»» name|string|false|none|none|
|»»»» symbol|string|false|none|none|
|»»»» decimals|number|false|none|none|
|»»»» totalSupply|string(bigint)|false|none|none|
|»»»» price|string(bigint)|false|none|none|
|»»»» priceChange1h|string(bigint)|false|none|none|
|»»»» priceChange24h|string(bigint)|false|none|none|
|»»»» recentMarketPrices|object|false|none|none|
|»»»»» **additionalProperties**|string|false|none|none|
|»»»» marketCap|string(bigint)|false|none|none|
|»»»» createdAt|string(date-time)|false|none|none|
|»»»» txHash|string|false|none|none|
|»»»» detail|object|false|none|none|
|»»»»» alert|string|false|none|none|
|»»»»» name|string|false|none|none|
|»»»»» alias|string|false|none|none|
|»»»»» unlock_date|string(date-time)|false|none|none|
|»»»»» description|string|false|none|none|
|»»»»» link|string|false|none|none|
|»»»»» icon|string|false|none|none|
|»»»»» iconUrls|object|false|none|none|
|»»»»»» 32|string|false|none|none|
|»»»»»» 64|string|false|none|none|
|»»»»»» 256|string|false|none|none|
|»»»»»» 1024|string|false|none|none|
|»»»»» type|string|false|none|none|
|»»»»» symbol|string|false|none|none|
|»»»»» reputation|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»»» *anonymous*|string|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» bridge|string|false|none|none|
|»»»»» bridged_token|string|false|none|none|
|»»»»» blacklist|boolean|false|none|none|
|»»»»» similar|[string]|false|none|none|
|»»»»» similar_token|[string]|false|none|none|
|»»»»» supertype|string|false|none|none|
|»»»»» isBridge|boolean|false|none|none|
|»»»»» isContract|boolean|false|none|none|
|»»»»» bridged_chain|object|false|none|none|
|»»»»»» name|string|false|none|none|
|»»»»»» logo|string|false|none|none|
|»»»»»» chain_id_evm|string|false|none|none|
|»»»»»» external_url|string|false|none|none|
|»»»»» burnAddresses|[string]|false|none|none|
|»»»»» lockAddresses|[string]|false|none|none|
|»»»»» bridgeData|object|false|none|none|
|»»»»»» url|string|false|none|none|
|»»»»»» otherSideUrl|string|false|none|none|
|»»»»» url|string|false|none|none|
|»»»»» social_profile|object|false|none|none|
|»»»»»» items|[object]|true|none|none|
|»»»»»»» type|string|true|none|none|
|»»»»»»» value|string|true|none|none|
|»»»»»»» title|string|false|none|none|
|»»»»» dapp|object|false|none|none|
|»»»»»» alias|string|false|none|none|
|»»»»»» url|string|false|none|none|
|»»»»»» description|string|false|none|none|
|»»»»» owner|string|false|none|none|
|»»»»» tags|[string]|false|none|none|
|»»»» transfers|object|false|none|none|
|»»»»» last24h|number|false|none|none|
|»»»»» last48h|number|false|none|none|
|»»»»» last72h|number|false|none|none|
|»»»» holders|number|false|none|none|
|»»»» market|object|false|none|none|
|»»»»» totalSupply|number|false|none|none|
|»»»»» circulatingSupply|number|false|none|none|
|»»»»» burned|number|false|none|none|
|»»»»» price|number|false|none|none|
|»»»»» marketCap|number|false|none|none|
|»»»»» minPriceLast24h|number|false|none|none|
|»»»»» maxPriceLast24h|number|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|superchainWETH|
|type|superchainTokenBridge|
|type|opL1StandardBridge|
|type|opDeposited|
|type|dexalotBridge|
|type|taikoETHTransfer|
|type|taikoERC20Vault|
|type|taikoERC721Vault|
|type|omniBridge|
|type|avalancheBTCBridge|
|type|avalancheETHBridge|
|type|synapse|
|type|genericTransfer|
|type|ICTT|
|type|OFT|
|type|ambOmnibridge|
|type|CCTPTokenMessenger|
|type|nearIntent|
|type|superswaps|
|type|hyperlane|
|type|eil|
|status|completed|
|status|pending|
|status|failed|
|status|ready_to_prove|
|actionType|GasGasBridge|
|actionType|ERC20GasBridge|
|actionType|GasERC20Bridge|
|actionType|ERC20ERC20Bridge|
|actionType|ERC721ERC721Bridge|
|actionType|VoidERC20Bridge|
|actionType|ERC20VoidBridge|
|actionType|ERC1155ERC1155Bridge|
|actionType|ArbitraryFunction|
|*anonymous*|ok|
|*anonymous*|neutral|
|*anonymous*|unknown|
|*anonymous*|suspicious|
|*anonymous*|unsafe|
|*anonymous*|spam|
|*anonymous*|ok|
|*anonymous*|neutral|
|*anonymous*|unknown|
|*anonymous*|suspicious|
|*anonymous*|unsafe|
|*anonymous*|spam|
|*anonymous*|ok|
|*anonymous*|neutral|
|*anonymous*|unknown|
|*anonymous*|suspicious|
|*anonymous*|unsafe|
|*anonymous*|spam|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_cross-transactions_actions_{id}

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/cross-transactions/actions/{id} \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/cross-transactions/actions/{id} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/cross-transactions/actions/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/cross-transactions/actions/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/cross-transactions/actions/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/cross-transactions/actions/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/cross-transactions/actions/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/cross-transactions/actions/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/cross-transactions/actions/{id}`

<h3 id="get__v2_network_{networkid}_evm_cross-transactions_actions_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|networkId|path|string|true|none|
|id|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "type": "superchainWETH",
  "status": "completed",
  "srcChainId": "string",
  "srcTimestamp": "2019-08-24T14:15:22Z",
  "srcTxHash": "string",
  "srcBlockNumber": "string",
  "srcBlockHash": "string",
  "srcGasLimit": "string",
  "dstChainId": "string",
  "dstTimestamp": "2019-08-24T14:15:22Z",
  "dstTxHash": "string",
  "dstBlockNumber": "string",
  "dstBlockHash": "string",
  "dstGasLimit": "string",
  "from": "string",
  "to": "string",
  "crossMessageId": "string",
  "actionType": "GasGasBridge",
  "data": {
    "srcToken": {
      "chainId": "string",
      "blockchainId": "string",
      "ecosystems": [
        "string"
      ],
      "address": "string",
      "name": "string",
      "symbol": "string",
      "decimals": 0,
      "totalSupply": "string",
      "price": "string",
      "priceChange1h": "string",
      "priceChange24h": "string",
      "recentMarketPrices": {
        "property1": "string",
        "property2": "string"
      },
      "marketCap": "string",
      "createdAt": "2019-08-24T14:15:22Z",
      "txHash": "string",
      "detail": {
        "alert": "string",
        "name": "string",
        "alias": "string",
        "unlock_date": "2019-08-24T14:15:22Z",
        "description": "string",
        "link": "string",
        "icon": "string",
        "iconUrls": {
          "32": "string",
          "64": "string",
          "256": "string",
          "1024": "string"
        },
        "type": "string",
        "symbol": "string",
        "reputation": "ok",
        "bridge": "string",
        "bridged_token": "string",
        "blacklist": true,
        "similar": [
          "string"
        ],
        "similar_token": [
          "string"
        ],
        "supertype": "string",
        "isBridge": true,
        "isContract": true,
        "bridged_chain": {
          "name": "string",
          "logo": "string",
          "chain_id_evm": "string",
          "external_url": "string"
        },
        "burnAddresses": [
          "string"
        ],
        "lockAddresses": [
          "string"
        ],
        "bridgeData": {
          "url": "string",
          "otherSideUrl": "string"
        },
        "url": "string",
        "social_profile": {
          "items": [
            {
              "type": "string",
              "value": "string",
              "title": "string"
            }
          ]
        },
        "dapp": {
          "alias": "string",
          "url": "string",
          "description": "string"
        },
        "owner": "string",
        "tags": [
          "string"
        ]
      },
      "transfers": {
        "last24h": 0,
        "last48h": 0,
        "last72h": 0
      },
      "holders": 0,
      "market": {
        "totalSupply": 0,
        "circulatingSupply": 0,
        "burned": 0,
        "price": 0,
        "marketCap": 0,
        "minPriceLast24h": 0,
        "maxPriceLast24h": 0
      }
    },
    "dstToken": {
      "chainId": "string",
      "blockchainId": "string",
      "ecosystems": [
        "string"
      ],
      "address": "string",
      "name": "string",
      "symbol": "string",
      "decimals": 0,
      "totalSupply": "string",
      "price": "string",
      "priceChange1h": "string",
      "priceChange24h": "string",
      "recentMarketPrices": {
        "property1": "string",
        "property2": "string"
      },
      "marketCap": "string",
      "createdAt": "2019-08-24T14:15:22Z",
      "txHash": "string",
      "detail": {
        "alert": "string",
        "name": "string",
        "alias": "string",
        "unlock_date": "2019-08-24T14:15:22Z",
        "description": "string",
        "link": "string",
        "icon": "string",
        "iconUrls": {
          "32": "string",
          "64": "string",
          "256": "string",
          "1024": "string"
        },
        "type": "string",
        "symbol": "string",
        "reputation": "ok",
        "bridge": "string",
        "bridged_token": "string",
        "blacklist": true,
        "similar": [
          "string"
        ],
        "similar_token": [
          "string"
        ],
        "supertype": "string",
        "isBridge": true,
        "isContract": true,
        "bridged_chain": {
          "name": "string",
          "logo": "string",
          "chain_id_evm": "string",
          "external_url": "string"
        },
        "burnAddresses": [
          "string"
        ],
        "lockAddresses": [
          "string"
        ],
        "bridgeData": {
          "url": "string",
          "otherSideUrl": "string"
        },
        "url": "string",
        "social_profile": {
          "items": [
            {
              "type": "string",
              "value": "string",
              "title": "string"
            }
          ]
        },
        "dapp": {
          "alias": "string",
          "url": "string",
          "description": "string"
        },
        "owner": "string",
        "tags": [
          "string"
        ]
      },
      "transfers": {
        "last24h": 0,
        "last48h": 0,
        "last72h": 0
      },
      "holders": 0,
      "market": {
        "totalSupply": 0,
        "circulatingSupply": 0,
        "burned": 0,
        "price": 0,
        "marketCap": 0,
        "minPriceLast24h": 0,
        "maxPriceLast24h": 0
      }
    },
    "srcAmount": "string",
    "dstAmount": "string",
    "entrypoint": {
      "chainId": "string",
      "blockchainId": "string",
      "ecosystems": [
        "string"
      ],
      "address": "string",
      "name": "string",
      "symbol": "string",
      "decimals": 0,
      "totalSupply": "string",
      "price": "string",
      "priceChange1h": "string",
      "priceChange24h": "string",
      "recentMarketPrices": {
        "property1": "string",
        "property2": "string"
      },
      "marketCap": "string",
      "createdAt": "2019-08-24T14:15:22Z",
      "txHash": "string",
      "detail": {
        "alert": "string",
        "name": "string",
        "alias": "string",
        "unlock_date": "2019-08-24T14:15:22Z",
        "description": "string",
        "link": "string",
        "icon": "string",
        "iconUrls": {
          "32": "string",
          "64": "string",
          "256": "string",
          "1024": "string"
        },
        "type": "string",
        "symbol": "string",
        "reputation": "ok",
        "bridge": "string",
        "bridged_token": "string",
        "blacklist": true,
        "similar": [
          "string"
        ],
        "similar_token": [
          "string"
        ],
        "supertype": "string",
        "isBridge": true,
        "isContract": true,
        "bridged_chain": {
          "name": "string",
          "logo": "string",
          "chain_id_evm": "string",
          "external_url": "string"
        },
        "burnAddresses": [
          "string"
        ],
        "lockAddresses": [
          "string"
        ],
        "bridgeData": {
          "url": "string",
          "otherSideUrl": "string"
        },
        "url": "string",
        "social_profile": {
          "items": [
            {
              "type": "string",
              "value": "string",
              "title": "string"
            }
          ]
        },
        "dapp": {
          "alias": "string",
          "url": "string",
          "description": "string"
        },
        "owner": "string",
        "tags": [
          "string"
        ]
      },
      "transfers": {
        "last24h": 0,
        "last48h": 0,
        "last72h": 0
      },
      "holders": 0,
      "market": {
        "totalSupply": 0,
        "circulatingSupply": 0,
        "burned": 0,
        "price": 0,
        "marketCap": 0,
        "minPriceLast24h": 0,
        "maxPriceLast24h": 0
      }
    }
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_cross-transactions_actions_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_cross-transactions_actions_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|string|true|none|none|
|» type|string|true|none|none|
|» status|string|true|none|none|
|» srcChainId|string|true|none|none|
|» srcTimestamp|string(date-time)|true|none|none|
|» srcTxHash|string|false|none|none|
|» srcBlockNumber|string|false|none|none|
|» srcBlockHash|string|false|none|none|
|» srcGasLimit|string|false|none|none|
|» dstChainId|string|true|none|none|
|» dstTimestamp|string(date-time)|true|none|none|
|» dstTxHash|string|false|none|none|
|» dstBlockNumber|string|false|none|none|
|» dstBlockHash|string|false|none|none|
|» dstGasLimit|string|false|none|none|
|» from|string(evm-address)|false|none|none|
|» to|string(evm-address)|false|none|none|
|» crossMessageId|string|false|none|none|
|» actionType|string|false|none|none|
|» data|object|true|none|none|
|»» srcToken|object|false|none|none|
|»»» chainId|string|true|none|none|
|»»» blockchainId|string|false|none|none|
|»»» ecosystems|[string]|false|none|none|
|»»» address|string|true|none|none|
|»»» name|string|false|none|none|
|»»» symbol|string|false|none|none|
|»»» decimals|number|false|none|none|
|»»» totalSupply|string(bigint)|false|none|none|
|»»» price|string(bigint)|false|none|none|
|»»» priceChange1h|string(bigint)|false|none|none|
|»»» priceChange24h|string(bigint)|false|none|none|
|»»» recentMarketPrices|object|false|none|none|
|»»»» **additionalProperties**|string|false|none|none|
|»»» marketCap|string(bigint)|false|none|none|
|»»» createdAt|string(date-time)|false|none|none|
|»»» txHash|string|false|none|none|
|»»» detail|object|false|none|none|
|»»»» alert|string|false|none|none|
|»»»» name|string|false|none|none|
|»»»» alias|string|false|none|none|
|»»»» unlock_date|string(date-time)|false|none|none|
|»»»» description|string|false|none|none|
|»»»» link|string|false|none|none|
|»»»» icon|string|false|none|none|
|»»»» iconUrls|object|false|none|none|
|»»»»» 32|string|false|none|none|
|»»»»» 64|string|false|none|none|
|»»»»» 256|string|false|none|none|
|»»»»» 1024|string|false|none|none|
|»»»» type|string|false|none|none|
|»»»» symbol|string|false|none|none|
|»»»» reputation|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» bridge|string|false|none|none|
|»»»» bridged_token|string|false|none|none|
|»»»» blacklist|boolean|false|none|none|
|»»»» similar|[string]|false|none|none|
|»»»» similar_token|[string]|false|none|none|
|»»»» supertype|string|false|none|none|
|»»»» isBridge|boolean|false|none|none|
|»»»» isContract|boolean|false|none|none|
|»»»» bridged_chain|object|false|none|none|
|»»»»» name|string|false|none|none|
|»»»»» logo|string|false|none|none|
|»»»»» chain_id_evm|string|false|none|none|
|»»»»» external_url|string|false|none|none|
|»»»» burnAddresses|[string]|false|none|none|
|»»»» lockAddresses|[string]|false|none|none|
|»»»» bridgeData|object|false|none|none|
|»»»»» url|string|false|none|none|
|»»»»» otherSideUrl|string|false|none|none|
|»»»» url|string|false|none|none|
|»»»» social_profile|object|false|none|none|
|»»»»» items|[object]|true|none|none|
|»»»»»» type|string|true|none|none|
|»»»»»» value|string|true|none|none|
|»»»»»» title|string|false|none|none|
|»»»» dapp|object|false|none|none|
|»»»»» alias|string|false|none|none|
|»»»»» url|string|false|none|none|
|»»»»» description|string|false|none|none|
|»»»» owner|string|false|none|none|
|»»»» tags|[string]|false|none|none|
|»»» transfers|object|false|none|none|
|»»»» last24h|number|false|none|none|
|»»»» last48h|number|false|none|none|
|»»»» last72h|number|false|none|none|
|»»» holders|number|false|none|none|
|»»» market|object|false|none|none|
|»»»» totalSupply|number|false|none|none|
|»»»» circulatingSupply|number|false|none|none|
|»»»» burned|number|false|none|none|
|»»»» price|number|false|none|none|
|»»»» marketCap|number|false|none|none|
|»»»» minPriceLast24h|number|false|none|none|
|»»»» maxPriceLast24h|number|false|none|none|
|»» dstToken|object|false|none|none|
|»»» chainId|string|true|none|none|
|»»» blockchainId|string|false|none|none|
|»»» ecosystems|[string]|false|none|none|
|»»» address|string|true|none|none|
|»»» name|string|false|none|none|
|»»» symbol|string|false|none|none|
|»»» decimals|number|false|none|none|
|»»» totalSupply|string(bigint)|false|none|none|
|»»» price|string(bigint)|false|none|none|
|»»» priceChange1h|string(bigint)|false|none|none|
|»»» priceChange24h|string(bigint)|false|none|none|
|»»» recentMarketPrices|object|false|none|none|
|»»»» **additionalProperties**|string|false|none|none|
|»»» marketCap|string(bigint)|false|none|none|
|»»» createdAt|string(date-time)|false|none|none|
|»»» txHash|string|false|none|none|
|»»» detail|object|false|none|none|
|»»»» alert|string|false|none|none|
|»»»» name|string|false|none|none|
|»»»» alias|string|false|none|none|
|»»»» unlock_date|string(date-time)|false|none|none|
|»»»» description|string|false|none|none|
|»»»» link|string|false|none|none|
|»»»» icon|string|false|none|none|
|»»»» iconUrls|object|false|none|none|
|»»»»» 32|string|false|none|none|
|»»»»» 64|string|false|none|none|
|»»»»» 256|string|false|none|none|
|»»»»» 1024|string|false|none|none|
|»»»» type|string|false|none|none|
|»»»» symbol|string|false|none|none|
|»»»» reputation|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» bridge|string|false|none|none|
|»»»» bridged_token|string|false|none|none|
|»»»» blacklist|boolean|false|none|none|
|»»»» similar|[string]|false|none|none|
|»»»» similar_token|[string]|false|none|none|
|»»»» supertype|string|false|none|none|
|»»»» isBridge|boolean|false|none|none|
|»»»» isContract|boolean|false|none|none|
|»»»» bridged_chain|object|false|none|none|
|»»»»» name|string|false|none|none|
|»»»»» logo|string|false|none|none|
|»»»»» chain_id_evm|string|false|none|none|
|»»»»» external_url|string|false|none|none|
|»»»» burnAddresses|[string]|false|none|none|
|»»»» lockAddresses|[string]|false|none|none|
|»»»» bridgeData|object|false|none|none|
|»»»»» url|string|false|none|none|
|»»»»» otherSideUrl|string|false|none|none|
|»»»» url|string|false|none|none|
|»»»» social_profile|object|false|none|none|
|»»»»» items|[object]|true|none|none|
|»»»»»» type|string|true|none|none|
|»»»»»» value|string|true|none|none|
|»»»»»» title|string|false|none|none|
|»»»» dapp|object|false|none|none|
|»»»»» alias|string|false|none|none|
|»»»»» url|string|false|none|none|
|»»»»» description|string|false|none|none|
|»»»» owner|string|false|none|none|
|»»»» tags|[string]|false|none|none|
|»»» transfers|object|false|none|none|
|»»»» last24h|number|false|none|none|
|»»»» last48h|number|false|none|none|
|»»»» last72h|number|false|none|none|
|»»» holders|number|false|none|none|
|»»» market|object|false|none|none|
|»»»» totalSupply|number|false|none|none|
|»»»» circulatingSupply|number|false|none|none|
|»»»» burned|number|false|none|none|
|»»»» price|number|false|none|none|
|»»»» marketCap|number|false|none|none|
|»»»» minPriceLast24h|number|false|none|none|
|»»»» maxPriceLast24h|number|false|none|none|
|»» srcAmount|string|false|none|none|
|»» dstAmount|string|false|none|none|
|»» entrypoint|object|false|none|none|
|»»» chainId|string|true|none|none|
|»»» blockchainId|string|false|none|none|
|»»» ecosystems|[string]|false|none|none|
|»»» address|string|true|none|none|
|»»» name|string|false|none|none|
|»»» symbol|string|false|none|none|
|»»» decimals|number|false|none|none|
|»»» totalSupply|string(bigint)|false|none|none|
|»»» price|string(bigint)|false|none|none|
|»»» priceChange1h|string(bigint)|false|none|none|
|»»» priceChange24h|string(bigint)|false|none|none|
|»»» recentMarketPrices|object|false|none|none|
|»»»» **additionalProperties**|string|false|none|none|
|»»» marketCap|string(bigint)|false|none|none|
|»»» createdAt|string(date-time)|false|none|none|
|»»» txHash|string|false|none|none|
|»»» detail|object|false|none|none|
|»»»» alert|string|false|none|none|
|»»»» name|string|false|none|none|
|»»»» alias|string|false|none|none|
|»»»» unlock_date|string(date-time)|false|none|none|
|»»»» description|string|false|none|none|
|»»»» link|string|false|none|none|
|»»»» icon|string|false|none|none|
|»»»» iconUrls|object|false|none|none|
|»»»»» 32|string|false|none|none|
|»»»»» 64|string|false|none|none|
|»»»»» 256|string|false|none|none|
|»»»»» 1024|string|false|none|none|
|»»»» type|string|false|none|none|
|»»»» symbol|string|false|none|none|
|»»»» reputation|any|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»»» *anonymous*|string|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» bridge|string|false|none|none|
|»»»» bridged_token|string|false|none|none|
|»»»» blacklist|boolean|false|none|none|
|»»»» similar|[string]|false|none|none|
|»»»» similar_token|[string]|false|none|none|
|»»»» supertype|string|false|none|none|
|»»»» isBridge|boolean|false|none|none|
|»»»» isContract|boolean|false|none|none|
|»»»» bridged_chain|object|false|none|none|
|»»»»» name|string|false|none|none|
|»»»»» logo|string|false|none|none|
|»»»»» chain_id_evm|string|false|none|none|
|»»»»» external_url|string|false|none|none|
|»»»» burnAddresses|[string]|false|none|none|
|»»»» lockAddresses|[string]|false|none|none|
|»»»» bridgeData|object|false|none|none|
|»»»»» url|string|false|none|none|
|»»»»» otherSideUrl|string|false|none|none|
|»»»» url|string|false|none|none|
|»»»» social_profile|object|false|none|none|
|»»»»» items|[object]|true|none|none|
|»»»»»» type|string|true|none|none|
|»»»»»» value|string|true|none|none|
|»»»»»» title|string|false|none|none|
|»»»» dapp|object|false|none|none|
|»»»»» alias|string|false|none|none|
|»»»»» url|string|false|none|none|
|»»»»» description|string|false|none|none|
|»»»» owner|string|false|none|none|
|»»»» tags|[string]|false|none|none|
|»»» transfers|object|false|none|none|
|»»»» last24h|number|false|none|none|
|»»»» last48h|number|false|none|none|
|»»»» last72h|number|false|none|none|
|»»» holders|number|false|none|none|
|»»» market|object|false|none|none|
|»»»» totalSupply|number|false|none|none|
|»»»» circulatingSupply|number|false|none|none|
|»»»» burned|number|false|none|none|
|»»»» price|number|false|none|none|
|»»»» marketCap|number|false|none|none|
|»»»» minPriceLast24h|number|false|none|none|
|»»»» maxPriceLast24h|number|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|superchainWETH|
|type|superchainTokenBridge|
|type|opL1StandardBridge|
|type|opDeposited|
|type|dexalotBridge|
|type|taikoETHTransfer|
|type|taikoERC20Vault|
|type|taikoERC721Vault|
|type|omniBridge|
|type|avalancheBTCBridge|
|type|avalancheETHBridge|
|type|synapse|
|type|genericTransfer|
|type|ICTT|
|type|OFT|
|type|ambOmnibridge|
|type|CCTPTokenMessenger|
|type|nearIntent|
|type|superswaps|
|type|hyperlane|
|type|eil|
|status|completed|
|status|pending|
|status|failed|
|status|ready_to_prove|
|actionType|GasGasBridge|
|actionType|ERC20GasBridge|
|actionType|GasERC20Bridge|
|actionType|ERC20ERC20Bridge|
|actionType|ERC721ERC721Bridge|
|actionType|VoidERC20Bridge|
|actionType|ERC20VoidBridge|
|actionType|ERC1155ERC1155Bridge|
|actionType|ArbitraryFunction|
|*anonymous*|ok|
|*anonymous*|neutral|
|*anonymous*|unknown|
|*anonymous*|suspicious|
|*anonymous*|unsafe|
|*anonymous*|spam|
|*anonymous*|ok|
|*anonymous*|neutral|
|*anonymous*|unknown|
|*anonymous*|suspicious|
|*anonymous*|unsafe|
|*anonymous*|spam|
|*anonymous*|ok|
|*anonymous*|neutral|
|*anonymous*|unknown|
|*anonymous*|suspicious|
|*anonymous*|unsafe|
|*anonymous*|spam|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_erc1155

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/erc1155 \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/erc1155 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/erc1155',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/erc1155',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/erc1155', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/erc1155', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/erc1155");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/erc1155", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/erc1155`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc1155-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|sort|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "address": "string",
      "name": "string",
      "symbol": "string",
      "createOperation": {
        "timestamp": "2019-08-24T14:15:22Z",
        "txHash": "string"
      },
      "transfers": {
        "last24h": 0,
        "last48h": 0,
        "last72h": 0
      },
      "holdersCount": 0
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc1155-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc1155-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» address|string|true|none|none|
|»» name|string|false|none|none|
|»» symbol|string|false|none|none|
|»» createOperation|object|false|none|none|
|»»» timestamp|string(date-time)|false|none|none|
|»»» txHash|string|false|none|none|
|»» transfers|object|false|none|none|
|»»» last24h|number|false|none|none|
|»»» last48h|number|false|none|none|
|»»» last72h|number|false|none|none|
|»» holdersCount|number|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_erc1155-transfers

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/erc1155-transfers \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/erc1155-transfers HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/erc1155-transfers',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/erc1155-transfers',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/erc1155-transfers', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/erc1155-transfers', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/erc1155-transfers");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/erc1155-transfers", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/erc1155-transfers`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc1155-transfers-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|tokenAddress|query|string(evm-address)|false|none|
|tokenId|query|string|false|none|
|timestampFrom|query|string(date-time)|false|Inclusive|
|timestampTo|query|string(date-time)|false|Exclusive|
|sort|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sort|asc|
|sort|desc|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "blockNumber": 0,
      "txHash": "string",
      "logIndex": 0,
      "from": "string",
      "to": "string",
      "createdAt": "2019-08-24T14:15:22Z",
      "timestamp": "2019-08-24T14:15:22Z",
      "amount": "string",
      "tokenAddress": "string",
      "tokenId": "string",
      "tokenName": "string",
      "tokenSymbol": "string"
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc1155-transfers-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc1155-transfers-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» blockNumber|number|true|none|none|
|»» txHash|string|true|none|none|
|»» logIndex|number|true|none|none|
|»» from|string(evm-address)|true|none|none|
|»» to|string(evm-address)|true|none|none|
|»» createdAt|string(date-time)|true|none|none|
|»» timestamp|string(date-time)|true|none|none|
|»» amount|string(bigint)|true|none|none|
|»» tokenAddress|string|true|none|none|
|»» tokenId|string|true|none|none|
|»» tokenName|string|false|none|none|
|»» tokenSymbol|string|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_address_{address}_erc1155-holdings

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-holdings \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-holdings HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-holdings',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-holdings',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-holdings', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-holdings', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-holdings");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-holdings", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-holdings`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc1155-holdings-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "tokenAddress": "string",
      "tokenId": "string",
      "balance": "string",
      "tokenUri": "string"
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc1155-holdings-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc1155-holdings-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» tokenAddress|string|true|none|none|
|»» tokenId|string|true|none|none|
|»» balance|string(bigint)|true|none|none|
|»» tokenUri|string|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_address_{address}_erc1155-transfers

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-transfers \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-transfers HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-transfers',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-transfers',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-transfers', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-transfers', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-transfers");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-transfers", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc1155-transfers`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc1155-transfers-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|direction|query|string|false|none|
|timestampFrom|query|string(date-time)|false|Inclusive|
|timestampTo|query|string(date-time)|false|Exclusive|
|sort|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|direction|received|
|direction|sent|
|direction||
|sort|asc|
|sort|desc|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "blockNumber": 0,
      "txHash": "string",
      "logIndex": 0,
      "from": "string",
      "to": "string",
      "createdAt": "2019-08-24T14:15:22Z",
      "timestamp": "2019-08-24T14:15:22Z",
      "amount": "string",
      "tokenAddress": "string",
      "tokenId": "string",
      "tokenName": "string",
      "tokenSymbol": "string"
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc1155-transfers-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc1155-transfers-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» blockNumber|number|true|none|none|
|»» txHash|string|true|none|none|
|»» logIndex|number|true|none|none|
|»» from|string(evm-address)|true|none|none|
|»» to|string(evm-address)|true|none|none|
|»» createdAt|string(date-time)|true|none|none|
|»» timestamp|string(date-time)|true|none|none|
|»» amount|string(bigint)|true|none|none|
|»» tokenAddress|string|true|none|none|
|»» tokenId|string|true|none|none|
|»» tokenName|string|false|none|none|
|»» tokenSymbol|string|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_erc1155_{address}_holders

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/erc1155/{address}/holders \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/erc1155/{address}/holders HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/erc1155/{address}/holders',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/erc1155/{address}/holders',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/erc1155/{address}/holders', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/erc1155/{address}/holders', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/erc1155/{address}/holders");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/erc1155/{address}/holders", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/erc1155/{address}/holders`

Get holders list

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc1155_{address}_holders-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|count|query|boolean|false|none|
|tokenId|query|string|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "address": "string",
      "tokenId": "string",
      "balance": "string"
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc1155_{address}_holders-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc1155_{address}_holders-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» address|string(evm-address)|true|none|none|
|»» tokenId|string|true|none|none|
|»» balance|string|true|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_erc20

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/erc20 \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/erc20 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/erc20',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/erc20',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/erc20', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/erc20', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/erc20");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/erc20", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/erc20`

Lists all ERC20 tokens.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc20-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|sort|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "address": "string",
      "name": "string",
      "symbol": "string",
      "decimals": 0,
      "totalSupply": "string",
      "price": "string",
      "marketCap": "string",
      "createOperation": {
        "timestamp": "2019-08-24T14:15:22Z",
        "txHash": "string"
      },
      "transfers": {
        "last24h": 0,
        "last48h": 0,
        "last72h": 0
      },
      "holdersCount": 0
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc20-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc20-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» address|string|true|none|none|
|»» name|string|false|none|none|
|»» symbol|string|false|none|none|
|»» decimals|number|false|none|none|
|»» totalSupply|string(bigint)|false|none|none|
|»» price|string(bigint)|false|none|none|
|»» marketCap|string(bigint)|false|none|none|
|»» createOperation|object|false|none|none|
|»»» timestamp|string(date-time)|false|none|none|
|»»» txHash|string|false|none|none|
|»» transfers|object|false|none|none|
|»»» last24h|number|false|none|none|
|»»» last48h|number|false|none|none|
|»»» last72h|number|false|none|none|
|»» holdersCount|number|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_top-erc20

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/top-erc20 \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/top-erc20 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/top-erc20',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/top-erc20',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/top-erc20', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/top-erc20', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/top-erc20");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/top-erc20", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/top-erc20`

Lists the top ERC20 tokens (trusted only).

<h3 id="get__v2_network_{networkid}_evm_{chainid}_top-erc20-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|sort|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "address": "string",
      "name": "string",
      "symbol": "string",
      "decimals": 0,
      "totalSupply": "string",
      "price": "string",
      "marketCap": "string",
      "createOperation": {
        "timestamp": "2019-08-24T14:15:22Z",
        "txHash": "string"
      },
      "transfers": {
        "last24h": 0,
        "last48h": 0,
        "last72h": 0
      },
      "holdersCount": 0
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_top-erc20-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_top-erc20-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» address|string|true|none|none|
|»» name|string|false|none|none|
|»» symbol|string|false|none|none|
|»» decimals|number|false|none|none|
|»» totalSupply|string(bigint)|false|none|none|
|»» price|string(bigint)|false|none|none|
|»» marketCap|string(bigint)|false|none|none|
|»» createOperation|object|false|none|none|
|»»» timestamp|string(date-time)|false|none|none|
|»»» txHash|string|false|none|none|
|»» transfers|object|false|none|none|
|»»» last24h|number|false|none|none|
|»»» last48h|number|false|none|none|
|»»» last72h|number|false|none|none|
|»» holdersCount|number|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_erc20_{address}_holders

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/erc20/{address}/holders \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/erc20/{address}/holders HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/erc20/{address}/holders',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/erc20/{address}/holders',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/erc20/{address}/holders', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/erc20/{address}/holders', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/erc20/{address}/holders");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/erc20/{address}/holders", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/erc20/{address}/holders`

Lists the holders of a specific ERC20 token.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc20_{address}_holders-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "address": "string",
      "balance": "string",
      "percentage": 0
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc20_{address}_holders-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc20_{address}_holders-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» address|string(evm-address)|true|none|none|
|»» balance|string(bigint)|true|none|none|
|»» percentage|number|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_erc20-transfers

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/erc20-transfers \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/erc20-transfers HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/erc20-transfers',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/erc20-transfers',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/erc20-transfers', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/erc20-transfers', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/erc20-transfers");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/erc20-transfers", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/erc20-transfers`

Lists the transfers of a specific ERC20 token.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc20-transfers-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|timestampFrom|query|string(date-time)|false|Inclusive|
|timestampTo|query|string(date-time)|false|Exclusive|
|tokenAddress|query|string(evm-address)|false|none|
|sort|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sort|asc|
|sort|desc|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "blockNumber": 0,
      "txHash": "string",
      "logIndex": 0,
      "from": "string",
      "to": "string",
      "createdAt": "2019-08-24T14:15:22Z",
      "timestamp": "2019-08-24T14:15:22Z",
      "amount": "string",
      "tokenAddress": "string",
      "tokenName": "string",
      "tokenSymbol": "string",
      "tokenDecimals": 0
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc20-transfers-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc20-transfers-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» blockNumber|number|true|none|none|
|»» txHash|string|true|none|none|
|»» logIndex|number|true|none|none|
|»» from|string(evm-address)|true|none|none|
|»» to|string(evm-address)|true|none|none|
|»» createdAt|string(date-time)|true|none|none|
|»» timestamp|string(date-time)|true|none|none|
|»» amount|string(bigint)|true|none|none|
|»» tokenAddress|string|true|none|none|
|»» tokenName|string|false|none|none|
|»» tokenSymbol|string|false|none|none|
|»» tokenDecimals|number|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_address_{address}_erc20-holdings

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-holdings \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-holdings HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-holdings',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-holdings',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-holdings', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-holdings', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-holdings");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-holdings", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-holdings`

Lists the ERC20 token holdings of a specific address.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc20-holdings-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "tokenAddress": "string",
      "tokenName": "string",
      "tokenSymbol": "string",
      "tokenDecimals": 0,
      "tokenQuantity": "string",
      "tokenPrice": "string",
      "tokenValueInUsd": "string",
      "updatedAtBlock": 0
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc20-holdings-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc20-holdings-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» tokenAddress|string|true|none|none|
|»» tokenName|string|false|none|none|
|»» tokenSymbol|string|false|none|none|
|»» tokenDecimals|number|false|none|none|
|»» tokenQuantity|string|true|none|none|
|»» tokenPrice|string|false|none|none|
|»» tokenValueInUsd|string|false|none|none|
|»» updatedAtBlock|number|true|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_address_{address}_erc20-approvals

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-approvals \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-approvals HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-approvals',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-approvals',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-approvals', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-approvals', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-approvals");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-approvals", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-approvals`

Lists the ERC20 token approvals of a specific address.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc20-approvals-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|status|query|string|false|none|
|sort|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|address|path|string(evm-address)|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|status|active|
|status|all|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "timestamp": "2019-08-24T14:15:22Z",
      "blockNumber": 0,
      "txHash": "string",
      "logIndex": 0,
      "owner": {
        "id": "string",
        "name": "string",
        "alias": "string",
        "dapp": {
          "alias": "string",
          "description": "string",
          "socialProfile": {
            "items": [
              {
                "type": "string",
                "title": "string",
                "value": "string"
              }
            ]
          },
          "icon": "string",
          "alert": "string",
          "tags": [
            "string"
          ]
        },
        "owner": "string",
        "type": "string",
        "supertype": "string",
        "icon": "string",
        "iconUrls": {
          "32": "string",
          "64": "string",
          "256": "string",
          "1024": "string"
        },
        "tags": [
          "string"
        ],
        "isContract": true,
        "ensReverseLookups": [
          {
            "chainId": "string",
            "name": "string"
          }
        ],
        "avvyReverseLookup": {
          "chainId": "string",
          "name": "string"
        }
      },
      "spender": {
        "id": "string",
        "name": "string",
        "alias": "string",
        "dapp": {
          "alias": "string",
          "description": "string",
          "socialProfile": {
            "items": [
              {
                "type": "string",
                "title": "string",
                "value": "string"
              }
            ]
          },
          "icon": "string",
          "alert": "string",
          "tags": [
            "string"
          ]
        },
        "owner": "string",
        "type": "string",
        "supertype": "string",
        "icon": "string",
        "iconUrls": {
          "32": "string",
          "64": "string",
          "256": "string",
          "1024": "string"
        },
        "tags": [
          "string"
        ],
        "isContract": true,
        "ensReverseLookups": [
          {
            "chainId": "string",
            "name": "string"
          }
        ],
        "avvyReverseLookup": {
          "chainId": "string",
          "name": "string"
        }
      },
      "allowance": "string",
      "currentAllowance": "string",
      "tokenAddress": "string",
      "tokenName": "string",
      "tokenSymbol": "string",
      "tokenDecimals": 0
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc20-approvals-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc20-approvals-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» timestamp|string(date-time)|true|none|none|
|»» blockNumber|number|true|none|none|
|»» txHash|string|true|none|none|
|»» logIndex|number|true|none|none|
|»» owner|object|true|none|none|
|»»» id|string|true|none|none|
|»»» name|string|false|none|none|
|»»» alias|string|false|none|none|
|»»» dapp|object|false|none|none|
|»»»» alias|string|true|none|none|
|»»»» description|string|false|none|none|
|»»»» socialProfile|object|false|none|none|
|»»»»» items|[object]|true|none|none|
|»»»»»» type|string|true|none|none|
|»»»»»» title|string|false|none|none|
|»»»»»» value|string|true|none|none|
|»»»» icon|string|false|none|none|
|»»»» alert|string|false|none|none|
|»»»» tags|[string]|false|none|none|
|»»» owner|string|false|none|none|
|»»» type|string|false|none|none|
|»»» supertype|string|false|none|none|
|»»» icon|string|false|none|none|
|»»» iconUrls|object|false|none|none|
|»»»» 32|string|false|none|none|
|»»»» 64|string|false|none|none|
|»»»» 256|string|false|none|none|
|»»»» 1024|string|false|none|none|
|»»» tags|[string]|false|none|none|
|»»» isContract|boolean|false|none|none|
|»»» ensReverseLookups|[object]|false|none|none|
|»»»» chainId|string|true|none|none|
|»»»» name|string|false|none|none|
|»»» avvyReverseLookup|object|false|none|none|
|»»»» chainId|string|true|none|none|
|»»»» name|string|false|none|none|
|»» spender|object|true|none|none|
|»»» id|string|true|none|none|
|»»» name|string|false|none|none|
|»»» alias|string|false|none|none|
|»»» dapp|object|false|none|none|
|»»»» alias|string|true|none|none|
|»»»» description|string|false|none|none|
|»»»» socialProfile|object|false|none|none|
|»»»»» items|[object]|true|none|none|
|»»»»»» type|string|true|none|none|
|»»»»»» title|string|false|none|none|
|»»»»»» value|string|true|none|none|
|»»»» icon|string|false|none|none|
|»»»» alert|string|false|none|none|
|»»»» tags|[string]|false|none|none|
|»»» owner|string|false|none|none|
|»»» type|string|false|none|none|
|»»» supertype|string|false|none|none|
|»»» icon|string|false|none|none|
|»»» iconUrls|object|false|none|none|
|»»»» 32|string|false|none|none|
|»»»» 64|string|false|none|none|
|»»»» 256|string|false|none|none|
|»»»» 1024|string|false|none|none|
|»»» tags|[string]|false|none|none|
|»»» isContract|boolean|false|none|none|
|»»» ensReverseLookups|[object]|false|none|none|
|»»»» chainId|string|true|none|none|
|»»»» name|string|false|none|none|
|»»» avvyReverseLookup|object|false|none|none|
|»»»» chainId|string|true|none|none|
|»»»» name|string|false|none|none|
|»» allowance|string(bigint)|true|none|none|
|»» currentAllowance|string(bigint)|true|none|none|
|»» tokenAddress|string|true|none|none|
|»» tokenName|string|false|none|none|
|»» tokenSymbol|string|false|none|none|
|»» tokenDecimals|number|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_address_{address}_erc20-transfers

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-transfers \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-transfers HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-transfers',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-transfers',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-transfers', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-transfers', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-transfers");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-transfers", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc20-transfers`

Lists the ERC20 token transfers of a specific address.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc20-transfers-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|direction|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|direction|received|
|direction|sent|
|direction||
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "blockNumber": 0,
      "txHash": "string",
      "logIndex": 0,
      "from": "string",
      "to": "string",
      "createdAt": "2019-08-24T14:15:22Z",
      "timestamp": "2019-08-24T14:15:22Z",
      "amount": "string",
      "tokenAddress": "string",
      "tokenName": "string",
      "tokenSymbol": "string",
      "tokenDecimals": 0
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc20-transfers-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc20-transfers-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» blockNumber|number|true|none|none|
|»» txHash|string|true|none|none|
|»» logIndex|number|true|none|none|
|»» from|string(evm-address)|true|none|none|
|»» to|string(evm-address)|true|none|none|
|»» createdAt|string(date-time)|true|none|none|
|»» timestamp|string(date-time)|true|none|none|
|»» amount|string(bigint)|true|none|none|
|»» tokenAddress|string|true|none|none|
|»» tokenName|string|false|none|none|
|»» tokenSymbol|string|false|none|none|
|»» tokenDecimals|number|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_erc20-swaps

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/erc20-swaps \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/erc20-swaps HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/erc20-swaps',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/erc20-swaps',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/erc20-swaps', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/erc20-swaps', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/erc20-swaps");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/erc20-swaps", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/erc20-swaps`

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc20-swaps-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|timestampFrom|query|string(date-time)|false|Inclusive|
|timestampTo|query|string(date-time)|false|Exclusive|
|token|query|string(evm-address)|false|none|
|tokenIn|query|string(evm-address)|false|none|
|tokenOut|query|string(evm-address)|false|none|
|sort|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sort|asc|
|sort|desc|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "txHash": "string",
      "timestamp": "string",
      "price": 0,
      "dex": "string",
      "tokenIn": "string",
      "tokenOut": "string",
      "tokenInQty": "string",
      "tokenOutQty": "string",
      "tokenInDecimals": 0,
      "tokenOutDecimals": 0,
      "sourceDeployer": "string"
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc20-swaps-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc20-swaps-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» txHash|string|true|none|none|
|»» timestamp|string|true|none|none|
|»» price|number|true|none|none|
|»» dex|string|false|none|none|
|»» tokenIn|string|true|none|none|
|»» tokenOut|string|true|none|none|
|»» tokenInQty|string|true|none|none|
|»» tokenOutQty|string|true|none|none|
|»» tokenInDecimals|number|true|none|none|
|»» tokenOutDecimals|number|true|none|none|
|»» sourceDeployer|string|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_erc721

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/erc721 \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/erc721 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/erc721',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/erc721',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/erc721', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/erc721', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/erc721");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/erc721", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/erc721`

Lists the ERC721 tokens.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc721-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|sort|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "address": "string",
      "name": "string",
      "symbol": "string",
      "createOperation": {
        "timestamp": "2019-08-24T14:15:22Z",
        "txHash": "string"
      },
      "transfers": {
        "last24h": 0,
        "last48h": 0,
        "last72h": 0
      },
      "holdersCount": 0
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc721-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc721-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» address|string|true|none|none|
|»» name|string|false|none|none|
|»» symbol|string|false|none|none|
|»» createOperation|object|false|none|none|
|»»» timestamp|string(date-time)|false|none|none|
|»»» txHash|string|false|none|none|
|»» transfers|object|false|none|none|
|»»» last24h|number|false|none|none|
|»»» last48h|number|false|none|none|
|»»» last72h|number|false|none|none|
|»» holdersCount|number|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_erc721-transfers

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/erc721-transfers \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/erc721-transfers HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/erc721-transfers',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/erc721-transfers',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/erc721-transfers', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/erc721-transfers', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/erc721-transfers");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/erc721-transfers", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/erc721-transfers`

Lists the ERC721 token transfers.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc721-transfers-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|timestampFrom|query|string(date-time)|false|Inclusive|
|timestampTo|query|string(date-time)|false|Exclusive|
|tokenAddress|query|string(evm-address)|false|none|
|tokenId|query|string|false|none|
|sort|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sort|asc|
|sort|desc|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "blockNumber": 0,
      "txHash": "string",
      "logIndex": 0,
      "from": "string",
      "to": "string",
      "createdAt": "2019-08-24T14:15:22Z",
      "timestamp": "2019-08-24T14:15:22Z",
      "tokenAddress": "string",
      "tokenId": "string",
      "tokenName": "string",
      "tokenSymbol": "string"
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc721-transfers-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc721-transfers-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» blockNumber|number|true|none|none|
|»» txHash|string|true|none|none|
|»» logIndex|number|true|none|none|
|»» from|string(evm-address)|true|none|none|
|»» to|string(evm-address)|true|none|none|
|»» createdAt|string(date-time)|true|none|none|
|»» timestamp|string(date-time)|true|none|none|
|»» tokenAddress|string|true|none|none|
|»» tokenId|string|true|none|none|
|»» tokenName|string|false|none|none|
|»» tokenSymbol|string|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_erc721_{address}_tokens

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/erc721/{address}/tokens \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/erc721/{address}/tokens HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/erc721/{address}/tokens',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/erc721/{address}/tokens',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/erc721/{address}/tokens', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/erc721/{address}/tokens', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/erc721/{address}/tokens");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/erc721/{address}/tokens", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/erc721/{address}/tokens`

Lists the tokens of a specific ERC721.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc721_{address}_tokens-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "tokenAddress": "string",
      "tokenId": "string",
      "tokenUri": "string",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc721_{address}_tokens-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc721_{address}_tokens-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» tokenAddress|string|true|none|none|
|»» tokenId|string|true|none|none|
|»» tokenUri|string|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_address_{address}_erc721-holdings

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-holdings \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-holdings HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-holdings',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-holdings',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-holdings', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-holdings', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-holdings");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-holdings", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-holdings`

Lists the ERC721 tokens holdings of specific address.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc721-holdings-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "tokenAddress": "string",
      "tokenId": "string",
      "tokenUri": "string",
      "collectionName": "string",
      "collectionSymbol": "string"
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc721-holdings-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc721-holdings-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» tokenAddress|string|true|none|none|
|»» tokenId|string|true|none|none|
|»» tokenUri|string|false|none|none|
|»» collectionName|string|false|none|none|
|»» collectionSymbol|string|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_address_{address}_erc721-transfers

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-transfers \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-transfers HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-transfers',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-transfers',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-transfers', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-transfers', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-transfers");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-transfers", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/address/{address}/erc721-transfers`

Lists the ERC721 token transfers of specific address.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc721-transfers-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|direction|query|string|false|none|
|timestampFrom|query|string(date-time)|false|Inclusive|
|timestampTo|query|string(date-time)|false|Exclusive|
|sort|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|direction|received|
|direction|sent|
|direction||
|sort|asc|
|sort|desc|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "blockNumber": 0,
      "txHash": "string",
      "logIndex": 0,
      "from": "string",
      "to": "string",
      "createdAt": "2019-08-24T14:15:22Z",
      "timestamp": "2019-08-24T14:15:22Z",
      "tokenAddress": "string",
      "tokenId": "string",
      "tokenName": "string",
      "tokenSymbol": "string"
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc721-transfers-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_erc721-transfers-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» blockNumber|number|true|none|none|
|»» txHash|string|true|none|none|
|»» logIndex|number|true|none|none|
|»» from|string(evm-address)|true|none|none|
|»» to|string(evm-address)|true|none|none|
|»» createdAt|string(date-time)|true|none|none|
|»» timestamp|string(date-time)|true|none|none|
|»» tokenAddress|string|true|none|none|
|»» tokenId|string|true|none|none|
|»» tokenName|string|false|none|none|
|»» tokenSymbol|string|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_erc721_{address}_holders

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/erc721/{address}/holders \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/erc721/{address}/holders HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/erc721/{address}/holders',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/erc721/{address}/holders',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/erc721/{address}/holders', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/erc721/{address}/holders', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/erc721/{address}/holders");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/erc721/{address}/holders", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/erc721/{address}/holders`

Lists the holders of a specific ERC721 token.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc721_{address}_holders-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "address": "string",
      "balance": "string",
      "percentage": 0
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc721_{address}_holders-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_erc721_{address}_holders-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» address|string(evm-address)|true|none|none|
|»» balance|string(bigint)|true|none|none|
|»» percentage|number|false|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_internal-operations

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/internal-operations \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/internal-operations HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/internal-operations',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/internal-operations',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/internal-operations', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/internal-operations', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/internal-operations");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/internal-operations", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/internal-operations`

Lists the internal operations.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_internal-operations-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|timestampFrom|query|string(date-time)|false|Inclusive|
|timestampTo|query|string(date-time)|false|Exclusive|
|fromAddresses|query|array[string]|false|none|
|toAddresses|query|array[string]|false|none|
|valueFromEq|query|string(bigint)|false|Inclusive|
|valueToEq|query|string(bigint)|false|Inclusive|
|txHash|query|string(evm-tx)|false|none|
|sort|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sort|asc|
|sort|desc|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "timestamp": "2019-08-24T14:15:22Z",
      "blockNumber": 0,
      "txIndex": 0,
      "opIndex": 0,
      "txHash": "string",
      "from": "string",
      "to": "string",
      "value": "string",
      "type": "string",
      "methodId": "string",
      "method": "string",
      "contractVerified": true,
      "gasUsed": "string",
      "status": true
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_internal-operations-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_internal-operations-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» timestamp|string(date-time)|true|none|none|
|»» blockNumber|number|true|none|none|
|»» txIndex|number|true|none|none|
|»» opIndex|number|true|none|none|
|»» txHash|string|true|none|none|
|»» from|string|true|none|none|
|»» to|string|true|none|none|
|»» value|string(bigint)|true|none|none|
|»» type|string|true|none|none|
|»» methodId|string|false|none|none|
|»» method|string|false|none|none|
|»» contractVerified|boolean|false|none|none|
|»» gasUsed|string(bigint)|true|none|none|
|»» status|boolean|true|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_address_{address}_internal-operations

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/address/{address}/internal-operations \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/address/{address}/internal-operations HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/address/{address}/internal-operations',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/address/{address}/internal-operations',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/address/{address}/internal-operations', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/address/{address}/internal-operations', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/address/{address}/internal-operations");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/address/{address}/internal-operations", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/address/{address}/internal-operations`

Lists the internal operations related to a specific address.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_internal-operations-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|direction|query|string|false|none|
|timestampFrom|query|string(date-time)|false|Inclusive|
|timestampTo|query|string(date-time)|false|Exclusive|
|fromAddresses|query|array[string]|false|none|
|toAddresses|query|array[string]|false|none|
|sort|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|direction|received|
|direction|sent|
|direction||
|sort|asc|
|sort|desc|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "timestamp": "2019-08-24T14:15:22Z",
      "blockNumber": 0,
      "txIndex": 0,
      "opIndex": 0,
      "txHash": "string",
      "from": "string",
      "to": "string",
      "value": "string",
      "type": "string",
      "methodId": "string",
      "method": "string",
      "contractVerified": true,
      "gasUsed": "string",
      "status": true
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_internal-operations-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_internal-operations-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» timestamp|string(date-time)|true|none|none|
|»» blockNumber|number|true|none|none|
|»» txIndex|number|true|none|none|
|»» opIndex|number|true|none|none|
|»» txHash|string|true|none|none|
|»» from|string|true|none|none|
|»» to|string|true|none|none|
|»» value|string(bigint)|true|none|none|
|»» type|string|true|none|none|
|»» methodId|string|false|none|none|
|»» method|string|false|none|none|
|»» contractVerified|boolean|false|none|none|
|»» gasUsed|string(bigint)|true|none|none|
|»» status|boolean|true|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_address_{address}_transactions

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/address/{address}/transactions \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/address/{address}/transactions HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/address/{address}/transactions',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/address/{address}/transactions',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/address/{address}/transactions', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/address/{address}/transactions', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/address/{address}/transactions");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/address/{address}/transactions", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/address/{address}/transactions`

Lists the transactions related to a specific address.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_transactions-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|direction|query|string|false|none|
|count|query|boolean|false|none|
|blockNumberFrom|query|number|false|none|
|blockNumberTo|query|number|false|none|
|timestampFrom|query|string(date-time)|false|Inclusive|
|timestampTo|query|string(date-time)|false|Exclusive|
|type|query|string|false|2023-10-23: DEPRECATED, use categories instead|
|categories|query|string|false|none|
|sort|query|string|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|direction|received|
|direction|sent|
|direction||
|type|evm_tx|
|type|atomic_tx|
|sort|asc|
|sort|desc|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "type": "evm_tx",
      "id": "string",
      "chainId": "string",
      "timestamp": "2019-08-24T14:15:22Z",
      "blockNumber": 0,
      "blockHash": "string",
      "index": 0,
      "from": "string",
      "to": "string",
      "value": "string",
      "gasUsed": "string",
      "gasPrice": "string",
      "gasLimit": "string",
      "burnedFees": "string",
      "status": true,
      "methodId": "string",
      "method": "string",
      "contractVerified": true
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_transactions-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_transactions-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[anyOf]|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|none|
|»»» type|string|true|none|none|
|»»» id|string|true|none|none|
|»»» chainId|string|true|none|none|
|»»» timestamp|string(date-time)|true|none|none|
|»»» blockNumber|number|true|none|none|
|»»» blockHash|string|true|none|none|
|»»» index|number|true|none|none|
|»»» from|string|true|none|none|
|»»» to|string|true|none|none|
|»»» value|string(bigint)|true|none|none|
|»»» gasUsed|string(bigint)|true|none|none|
|»»» gasPrice|string(bigint)|true|none|none|
|»»» gasLimit|string(bigint)|true|none|none|
|»»» burnedFees|string(bigint)|true|none|none|
|»»» status|boolean|true|none|none|
|»»» methodId|string|false|none|none|
|»»» method|string|false|none|none|
|»»» contractVerified|boolean|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|none|
|»»» type|string|true|none|none|
|»»» id|string|true|none|none|
|»»» chainId|string|true|none|none|
|»»» timestamp|string(date-time)|true|none|none|
|»»» blockNumber|number|true|none|none|
|»»» blockHash|string|true|none|none|
|»»» from|string|true|none|none|
|»»» to|string|true|none|none|
|»»» value|string(bigint)|true|none|none|
|»»» burnedFees|string(bigint)|true|none|none|
|»»» status|boolean|true|none|none|
|»»» inputs|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» *anonymous*|object|false|none|none|
|»»»»» address|string|true|none|none|
|»»»»» amount|string(bigint)|true|none|none|
|»»»»» asset|object|true|none|none|
|»»»»»» id|string|true|none|none|
|»»»»»» name|string|false|none|none|
|»»»»»» symbol|string|false|none|none|
|»»»»»» denomination|number|false|none|none|
|»»»»»» type|string|false|none|none|
|»»»»» nonce|number|true|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» *anonymous*|object|false|none|none|
|»»»»» id|string|true|none|none|
|»»»»» txId|string|true|none|none|
|»»»»» index|number|true|none|none|
|»»»»» amount|string(bigint)|true|none|none|
|»»»»» asset|object|true|none|none|
|»»»»»» id|string|true|none|none|
|»»»»»» name|string|false|none|none|
|»»»»»» symbol|string|false|none|none|
|»»»»»» denomination|number|false|none|none|
|»»»»»» type|string|false|none|none|
|»»»»» srcChain|string|true|none|none|
|»»»»» owner|object|false|none|none|
|»»»»»» addresses|[string]|true|none|none|
|»»»»»» threshold|number|true|none|none|
|»»»»» creds|[object]|true|none|none|
|»»»»»» address|string|true|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» outputs|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» *anonymous*|object|false|none|none|
|»»»»» address|string|true|none|none|
|»»»»» amount|string(bigint)|true|none|none|
|»»»»» asset|object|true|none|none|
|»»»»»» id|string|true|none|none|
|»»»»»» name|string|false|none|none|
|»»»»»» symbol|string|false|none|none|
|»»»»»» denomination|number|false|none|none|
|»»»»»» type|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» *anonymous*|object|false|none|none|
|»»»»» id|string|true|none|none|
|»»»»» txId|string|true|none|none|
|»»»»» index|number|true|none|none|
|»»»»» amount|string(bigint)|true|none|none|
|»»»»» locktime|number|false|none|none|
|»»»»» dstChain|string|true|none|none|
|»»»»» asset|object|true|none|none|
|»»»»»» id|string|true|none|none|
|»»»»»» name|string|false|none|none|
|»»»»»» symbol|string|false|none|none|
|»»»»»» denomination|number|false|none|none|
|»»»»»» type|string|false|none|none|
|»»»»» owner|object|true|none|none|
|»»»»»» addresses|[string]|true|none|none|
|»»»»»» threshold|number|true|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|evm_tx|
|type|atomic_tx|
|type|fixed_cap|
|type|var_cap|
|type|nft|
|type|fixed_cap|
|type|var_cap|
|type|nft|
|type|fixed_cap|
|type|var_cap|
|type|nft|
|type|fixed_cap|
|type|var_cap|
|type|nft|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_transactions

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/transactions \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/transactions HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/transactions',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/transactions',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/transactions', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/transactions', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/transactions");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/transactions", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/transactions`

Lists the transactions.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_transactions-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|fromAddresses|query|array[string]|false|none|
|toAddresses|query|array[string]|false|none|
|blockNumberFrom|query|number|false|Inclusive|
|blockNumberTo|query|number|false|Exclusive|
|timestampFrom|query|string(date-time)|false|Inclusive|
|timestampTo|query|string(date-time)|false|Exclusive|
|categories|query|string|false|none|
|sort|query|string|false|none|
|count|query|boolean|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sort|asc|
|sort|desc|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "type": "evm_tx",
      "id": "string",
      "chainId": "string",
      "timestamp": "2019-08-24T14:15:22Z",
      "blockNumber": 0,
      "blockHash": "string",
      "index": 0,
      "from": "string",
      "to": "string",
      "value": "string",
      "gasUsed": "string",
      "gasPrice": "string",
      "gasLimit": "string",
      "burnedFees": "string",
      "status": true,
      "methodId": "string",
      "method": "string",
      "contractVerified": true
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_transactions-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_transactions-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[anyOf]|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|none|
|»»» type|string|true|none|none|
|»»» id|string|true|none|none|
|»»» chainId|string|true|none|none|
|»»» timestamp|string(date-time)|true|none|none|
|»»» blockNumber|number|true|none|none|
|»»» blockHash|string|true|none|none|
|»»» index|number|true|none|none|
|»»» from|string|true|none|none|
|»»» to|string|true|none|none|
|»»» value|string(bigint)|true|none|none|
|»»» gasUsed|string(bigint)|true|none|none|
|»»» gasPrice|string(bigint)|true|none|none|
|»»» gasLimit|string(bigint)|true|none|none|
|»»» burnedFees|string(bigint)|true|none|none|
|»»» status|boolean|true|none|none|
|»»» methodId|string|false|none|none|
|»»» method|string|false|none|none|
|»»» contractVerified|boolean|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|none|
|»»» type|string|true|none|none|
|»»» id|string|true|none|none|
|»»» chainId|string|true|none|none|
|»»» timestamp|string(date-time)|true|none|none|
|»»» blockNumber|number|true|none|none|
|»»» blockHash|string|true|none|none|
|»»» from|string|true|none|none|
|»»» to|string|true|none|none|
|»»» value|string(bigint)|true|none|none|
|»»» burnedFees|string(bigint)|true|none|none|
|»»» status|boolean|true|none|none|
|»»» inputs|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» *anonymous*|object|false|none|none|
|»»»»» address|string|true|none|none|
|»»»»» amount|string(bigint)|true|none|none|
|»»»»» asset|object|true|none|none|
|»»»»»» id|string|true|none|none|
|»»»»»» name|string|false|none|none|
|»»»»»» symbol|string|false|none|none|
|»»»»»» denomination|number|false|none|none|
|»»»»»» type|string|false|none|none|
|»»»»» nonce|number|true|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» *anonymous*|object|false|none|none|
|»»»»» id|string|true|none|none|
|»»»»» txId|string|true|none|none|
|»»»»» index|number|true|none|none|
|»»»»» amount|string(bigint)|true|none|none|
|»»»»» asset|object|true|none|none|
|»»»»»» id|string|true|none|none|
|»»»»»» name|string|false|none|none|
|»»»»»» symbol|string|false|none|none|
|»»»»»» denomination|number|false|none|none|
|»»»»»» type|string|false|none|none|
|»»»»» srcChain|string|true|none|none|
|»»»»» owner|object|false|none|none|
|»»»»»» addresses|[string]|true|none|none|
|»»»»»» threshold|number|true|none|none|
|»»»»» creds|[object]|true|none|none|
|»»»»»» address|string|true|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» outputs|[anyOf]|false|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» *anonymous*|object|false|none|none|
|»»»»» address|string|true|none|none|
|»»»»» amount|string(bigint)|true|none|none|
|»»»»» asset|object|true|none|none|
|»»»»»» id|string|true|none|none|
|»»»»»» name|string|false|none|none|
|»»»»»» symbol|string|false|none|none|
|»»»»»» denomination|number|false|none|none|
|»»»»»» type|string|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» *anonymous*|object|false|none|none|
|»»»»» id|string|true|none|none|
|»»»»» txId|string|true|none|none|
|»»»»» index|number|true|none|none|
|»»»»» amount|string(bigint)|true|none|none|
|»»»»» locktime|number|false|none|none|
|»»»»» dstChain|string|true|none|none|
|»»»»» asset|object|true|none|none|
|»»»»»» id|string|true|none|none|
|»»»»»» name|string|false|none|none|
|»»»»»» symbol|string|false|none|none|
|»»»»»» denomination|number|false|none|none|
|»»»»»» type|string|false|none|none|
|»»»»» owner|object|true|none|none|
|»»»»»» addresses|[string]|true|none|none|
|»»»»»» threshold|number|true|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|evm_tx|
|type|atomic_tx|
|type|fixed_cap|
|type|var_cap|
|type|nft|
|type|fixed_cap|
|type|var_cap|
|type|nft|
|type|fixed_cap|
|type|var_cap|
|type|nft|
|type|fixed_cap|
|type|var_cap|
|type|nft|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_transactions_{transactionId}

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/transactions/{transactionId} \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/transactions/{transactionId} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/transactions/{transactionId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/transactions/{transactionId}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/transactions/{transactionId}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/transactions/{transactionId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/transactions/{transactionId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/transactions/{transactionId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/transactions/{transactionId}`

Retrieves the details of a specific transaction.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_transactions_{transactionid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|transactionId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "type": "evm_tx",
  "id": "string",
  "chainId": "string",
  "timestamp": "2019-08-24T14:15:22Z",
  "blockNumber": 0,
  "blockHash": "string",
  "index": 0,
  "from": "string",
  "to": "string",
  "value": "string",
  "gasUsed": "string",
  "gasPrice": "string",
  "gasLimit": "string",
  "burnedFees": "string",
  "status": true,
  "methodId": "string",
  "method": "string",
  "contractVerified": true
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_transactions_{transactionid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_transactions_{transactionid}-responseschema">Response Schema</h3>

#### Enumerated Values

|Property|Value|
|---|---|
|type|evm_tx|
|type|atomic_tx|
|type|fixed_cap|
|type|var_cap|
|type|nft|
|type|fixed_cap|
|type|var_cap|
|type|nft|
|type|fixed_cap|
|type|var_cap|
|type|nft|
|type|fixed_cap|
|type|var_cap|
|type|nft|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_supply

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/supply \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/supply HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/supply',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/supply',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/supply', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/supply', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/supply");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/supply", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/supply`

Retrieves the total and circulating supply for a specific chain. Values are returned in the chain's native currency (e.g., AVAX, ETH), NOT in subcurrency units like WEI or Gwei.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_supply-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|q|query|any|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "totalSupply": 0,
  "circulatingSupply": 0
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_supply-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_supply-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_address_{address}_gas-balance

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/address/{address}/gas-balance \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/address/{address}/gas-balance HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/address/{address}/gas-balance',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/address/{address}/gas-balance',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/address/{address}/gas-balance', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/address/{address}/gas-balance', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/address/{address}/gas-balance");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/address/{address}/gas-balance", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/address/{address}/gas-balance`

Retrieves the gas balance of a specific address.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_gas-balance-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|chainId|path|string|true|none|
|address|path|string(evm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "chainId": "string",
      "balance": "string",
      "updatedAtBlock": 0
    }
  ],
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_gas-balance-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_address_{address}_gas-balance-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» chainId|string|true|none|none|
|»» balance|string(bigint)|true|none|none|
|»» updatedAtBlock|number|true|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_blockchains

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/blockchains \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/blockchains HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/blockchains',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/blockchains',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/blockchains', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/blockchains', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/blockchains");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/blockchains", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/blockchains`

Lists the blockchains.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_blockchains-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|description|query|boolean|false|none|
|tags|query|boolean|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "name": "string",
      "chainId": "string",
      "evmChainId": "string",
      "avalancheBlockchainId": "string",
      "logo": "string",
      "logoUrls": {
        "32": "string",
        "64": "string",
        "256": "string",
        "1024": "string"
      },
      "icon": "string",
      "iconUrls": {
        "32": "string",
        "64": "string",
        "256": "string",
        "1024": "string"
      },
      "symbol": "string",
      "rpcs": [
        "string"
      ],
      "coingeckoId": "string",
      "avascanId": "string",
      "ecosystems": [
        "string"
      ],
      "socialProfile": {
        "items": [
          {
            "type": "string",
            "value": "string",
            "title": "string"
          }
        ]
      },
      "description": "string",
      "tags": [
        "string"
      ],
      "freeApiRateLimit": {
        "rps": 0,
        "rpd": 0
      },
      "crossTransactionTypes": {
        "actions": [
          "string"
        ],
        "messages": [
          "string"
        ]
      },
      "hasERC4337": true,
      "indexing": true,
      "indexingPaused": true
    }
  ],
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_blockchains-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_blockchains-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» name|string|true|none|none|
|»» chainId|string|true|none|none|
|»» evmChainId|string|false|none|none|
|»» avalancheBlockchainId|string|false|none|none|
|»» logo|string|false|none|none|
|»» logoUrls|object|false|none|none|
|»»» 32|string|false|none|none|
|»»» 64|string|false|none|none|
|»»» 256|string|false|none|none|
|»»» 1024|string|false|none|none|
|»» icon|string|false|none|none|
|»» iconUrls|object|false|none|none|
|»»» 32|string|false|none|none|
|»»» 64|string|false|none|none|
|»»» 256|string|false|none|none|
|»»» 1024|string|false|none|none|
|»» symbol|string|true|none|none|
|»» rpcs|[string]|true|none|none|
|»» coingeckoId|string|false|none|none|
|»» avascanId|string|true|none|none|
|»» ecosystems|[string]|false|none|none|
|»» socialProfile|object|false|none|none|
|»»» items|[object]|true|none|none|
|»»»» type|string|true|none|none|
|»»»» value|string|true|none|none|
|»»»» title|string|false|none|none|
|»» description|string|false|none|none|
|»» tags|[string]|false|none|none|
|»» freeApiRateLimit|object|true|none|none|
|»»» rps|number|true|none|none|
|»»» rpd|number|true|none|none|
|»» crossTransactionTypes|object|true|none|none|
|»»» actions|[string]|false|none|none|
|»»» messages|[string]|false|none|none|
|»» hasERC4337|boolean|false|none|none|
|»» indexing|boolean|true|none|none|
|»» indexingPaused|boolean|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_evm_{chainId}_blocks

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/evm/{chainId}/blocks \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/evm/{chainId}/blocks HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/evm/{chainId}/blocks',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/evm/{chainId}/blocks',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/evm/{chainId}/blocks', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/evm/{chainId}/blocks', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/evm/{chainId}/blocks");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/evm/{chainId}/blocks", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/evm/{chainId}/blocks`

Lists the blocks.

<h3 id="get__v2_network_{networkid}_evm_{chainid}_blocks-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|count|query|boolean|false|none|
|timestampFrom|query|string(date-time)|false|Inclusive|
|timestampTo|query|string(date-time)|false|Exclusive|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|sort|query|string|false|none|
|address|query|string(evm-address)|false|Miner/validator address|
|next|query|string|false|none|
|prev|query|string|false|none|
|networkId|path|string|true|none|
|chainId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sort|asc|
|sort|desc|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "number": 0,
      "id": "string",
      "parent": "string",
      "chainId": "string",
      "ecosystems": [
        "string"
      ],
      "size": "string",
      "volume": "string",
      "gasLimit": "string",
      "gasUsed": "string",
      "atomic": true,
      "burnedFees": "string",
      "timestamp": "2019-08-24T14:15:22Z",
      "currentBlockNumber": 0,
      "txCount": 0,
      "atomicTxCount": 0,
      "miner": "string"
    }
  ],
  "count": 0,
  "countType": "exact",
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_evm_{chainid}_blocks-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_evm_{chainid}_blocks-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» number|number|true|none|none|
|»» id|string|true|none|none|
|»» parent|string|true|none|none|
|»» chainId|string|true|none|none|
|»» ecosystems|[string]|false|none|none|
|»» size|string|true|none|none|
|»» volume|string|true|none|none|
|»» gasLimit|string|true|none|none|
|»» gasUsed|string|true|none|none|
|»» atomic|boolean|true|none|none|
|»» burnedFees|string|true|none|none|
|»» timestamp|string(date-time)|true|none|none|
|»» currentBlockNumber|number|false|none|none|
|»» txCount|number|true|none|none|
|»» atomicTxCount|number|true|none|none|
|»» miner|string|true|none|none|
|» count|number|false|none|none|
|» countType|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|countType|exact|
|countType|lowerBound|
|countType|approx|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

<h1 id="routescan-api-misc">Misc</h1>

## get__v2_ping

> Code samples

```shell
# You can also use wget
curl -X GET /v2/ping \
  -H 'Accept: application/json'

```

```http
GET /v2/ping HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/ping',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/ping',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/ping', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/ping', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/ping");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/ping", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/ping`

Ping

> Example responses

> 200 Response

```json
{
  "ping": "pong"
}
```

<h3 id="get__v2_ping-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_ping-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» ping|string|true|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|ping|pong|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_rate-limit-status

> Code samples

```shell
# You can also use wget
curl -X GET /v2/rate-limit-status?adminKey=string

```

```http
GET /v2/rate-limit-status?adminKey=string HTTP/1.1

```

```javascript

fetch('/v2/rate-limit-status?adminKey=string',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/v2/rate-limit-status',
  params: {
  'adminKey' => 'string'
}

p JSON.parse(result)

```

```python
import requests

r = requests.get('/v2/rate-limit-status', params={
  'adminKey': 'string'
})

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/rate-limit-status', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/rate-limit-status?adminKey=string");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/rate-limit-status", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/rate-limit-status`

Retrieves the rate limit status.

<h3 id="get__v2_rate-limit-status-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|adminKey|query|string|true|none|

<h3 id="get__v2_rate-limit-status-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_evm_{chainId}_rate-limit-status

> Code samples

```shell
# You can also use wget
curl -X GET /v2/evm/{chainId}/rate-limit-status

```

```http
GET /v2/evm/{chainId}/rate-limit-status HTTP/1.1

```

```javascript

fetch('/v2/evm/{chainId}/rate-limit-status',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/v2/evm/{chainId}/rate-limit-status',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/v2/evm/{chainId}/rate-limit-status')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/evm/{chainId}/rate-limit-status', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/evm/{chainId}/rate-limit-status");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/evm/{chainId}/rate-limit-status", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/evm/{chainId}/rate-limit-status`

Retrieves the rate limit status of a specific blockchain.

<h3 id="get__v2_evm_{chainid}_rate-limit-status-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|adminKey|query|string|false|none|
|ecosystem|query|string|false|none|
|includedChainIds|query|array[string]|false|none|
|excludedChainIds|query|array[string]|false|none|
|chainId|path|string|true|none|

<h3 id="get__v2_evm_{chainid}_rate-limit-status-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

<h1 id="routescan-api-pvm">PVM</h1>

## get__v2_network_{networkId}_pvm_{blockchainId}_address_{addressId}_transactions

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/pvm/{blockchainId}/address/{addressId}/transactions \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/pvm/{blockchainId}/address/{addressId}/transactions HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/pvm/{blockchainId}/address/{addressId}/transactions',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/pvm/{blockchainId}/address/{addressId}/transactions',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/pvm/{blockchainId}/address/{addressId}/transactions', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/pvm/{blockchainId}/address/{addressId}/transactions', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/pvm/{blockchainId}/address/{addressId}/transactions");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/pvm/{blockchainId}/address/{addressId}/transactions", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/pvm/{blockchainId}/address/{addressId}/transactions`

Lists the transactions of a specific address.

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_address_{addressid}_transactions-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|timestampFrom|query|string(date-time)|false|Inclusive|
|timestampTo|query|string(date-time)|false|Exclusive|
|categories|query|string|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|blockchainId|path|string|true|none|
|addressId|path|string(pvm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "id": "string",
      "type": "add_validator",
      "timestamp": "2019-08-24T14:15:22Z",
      "inputsCount": 0,
      "outputsCount": 0,
      "inputsLimit": 0,
      "outputsLimit": 0,
      "inputs": [
        {
          "id": "string",
          "txId": "string",
          "index": 0,
          "amount": "string",
          "owner": {
            "addresses": [
              "string"
            ],
            "threshold": 0
          },
          "creds": [
            {
              "address": "string"
            }
          ],
          "srcChain": "string",
          "asset": {
            "id": "string",
            "name": "string",
            "symbol": "string",
            "denomination": 0,
            "type": "fixed_cap"
          }
        }
      ],
      "outputs": [
        {
          "id": "string",
          "txId": "string",
          "index": 0,
          "type": "base",
          "amount": "string",
          "owner": {
            "addresses": [
              "string"
            ],
            "threshold": 0
          },
          "locktime": "2019-08-24T14:15:22Z",
          "dstChain": "string",
          "asset": {
            "id": "string",
            "name": "string",
            "symbol": "string",
            "denomination": 0,
            "type": "fixed_cap"
          }
        }
      ],
      "memo": "string"
    }
  ],
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_address_{addressid}_transactions-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_address_{addressid}_transactions-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» id|string|true|none|none|
|»» type|string|false|none|none|
|»» timestamp|string(date-time)|true|none|none|
|»» inputsCount|number|true|none|Total number of inputs for this transaction|
|»» outputsCount|number|true|none|Total number of outputs for this transaction|
|»» inputsLimit|number|false|none|If this field is set, it means we have loaded up to N inputs from the transaction|
|»» outputsLimit|number|false|none|If this field is set, it means we have loaded up to N outputs from the transaction|
|»» inputs|[object]|true|none|none|
|»»» id|string|true|none|none|
|»»» txId|string|true|none|none|
|»»» index|number|true|none|none|
|»»» amount|string(bigint)|true|none|none|
|»»» owner|object|false|none|none|
|»»»» addresses|[string]|false|none|none|
|»»»» threshold|number|false|none|none|
|»»» creds|[object]|true|none|none|
|»»»» address|string|true|none|none|
|»»» srcChain|string|false|none|Populated if this UTXO results from an import|
|»»» asset|object|false|none|none|
|»»»» id|string|true|none|none|
|»»»» name|string|false|none|none|
|»»»» symbol|string|false|none|none|
|»»»» denomination|number|false|none|none|
|»»»» type|string|false|none|none|
|»» outputs|[object]|true|none|none|
|»»» id|string|true|none|none|
|»»» txId|string|true|none|none|
|»»» index|number|true|none|none|
|»»» type|string|true|none|none|
|»»» amount|string(bigint)|true|none|none|
|»»» owner|object|true|none|none|
|»»»» addresses|[string]|true|none|none|
|»»»» threshold|number|true|none|none|
|»»» locktime|string(date-time)|false|none|none|
|»»» dstChain|string|false|none|Populated if this UTXO results from an export|
|»»» asset|object|false|none|none|
|»»»» id|string|true|none|none|
|»»»» name|string|false|none|none|
|»»»» symbol|string|false|none|none|
|»»»» denomination|number|false|none|none|
|»»»» type|string|false|none|none|
|»» memo|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|add_validator|
|type|add_subnet_validator|
|type|add_delegator|
|type|create_chain|
|type|create_subnet|
|type|import|
|type|export|
|type|advance_time|
|type|reward_validator|
|type|remove_subnet_validator|
|type|transform_subnet|
|type|add_permissionsless_validator|
|type|add_permissionsless_delegator|
|type|fixed_cap|
|type|var_cap|
|type|nft|
|type|base|
|type|stake|
|type|reward|
|type|fixed_cap|
|type|var_cap|
|type|nft|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_pvm_{blockchainId}_transactions_{transactionId}

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId} \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}`

Retrieves the details of a specific transaction.

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_transactions_{transactionid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|networkId|path|string|true|none|
|blockchainId|path|string|true|none|
|transactionId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "type": "add_validator",
  "timestamp": "2019-08-24T14:15:22Z",
  "inputsCount": 0,
  "outputsCount": 0,
  "inputsLimit": 0,
  "outputsLimit": 0,
  "inputs": [
    {
      "id": "string",
      "txId": "string",
      "index": 0,
      "amount": "string",
      "owner": {
        "addresses": [
          "string"
        ],
        "threshold": 0
      },
      "creds": [
        {
          "address": "string"
        }
      ],
      "srcChain": "string",
      "asset": {
        "id": "string",
        "name": "string",
        "symbol": "string",
        "denomination": 0,
        "type": "fixed_cap"
      }
    }
  ],
  "outputs": [
    {
      "id": "string",
      "txId": "string",
      "index": 0,
      "type": "base",
      "amount": "string",
      "owner": {
        "addresses": [
          "string"
        ],
        "threshold": 0
      },
      "locktime": "2019-08-24T14:15:22Z",
      "dstChain": "string",
      "asset": {
        "id": "string",
        "name": "string",
        "symbol": "string",
        "denomination": 0,
        "type": "fixed_cap"
      }
    }
  ],
  "memo": "string"
}
```

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_transactions_{transactionid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_transactions_{transactionid}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|string|true|none|none|
|» type|string|false|none|none|
|» timestamp|string(date-time)|true|none|none|
|» inputsCount|number|true|none|Total number of inputs for this transaction|
|» outputsCount|number|true|none|Total number of outputs for this transaction|
|» inputsLimit|number|false|none|If this field is set, it means we have loaded up to N inputs from the transaction|
|» outputsLimit|number|false|none|If this field is set, it means we have loaded up to N outputs from the transaction|
|» inputs|[object]|true|none|none|
|»» id|string|true|none|none|
|»» txId|string|true|none|none|
|»» index|number|true|none|none|
|»» amount|string(bigint)|true|none|none|
|»» owner|object|false|none|none|
|»»» addresses|[string]|false|none|none|
|»»» threshold|number|false|none|none|
|»» creds|[object]|true|none|none|
|»»» address|string|true|none|none|
|»» srcChain|string|false|none|Populated if this UTXO results from an import|
|»» asset|object|false|none|none|
|»»» id|string|true|none|none|
|»»» name|string|false|none|none|
|»»» symbol|string|false|none|none|
|»»» denomination|number|false|none|none|
|»»» type|string|false|none|none|
|» outputs|[object]|true|none|none|
|»» id|string|true|none|none|
|»» txId|string|true|none|none|
|»» index|number|true|none|none|
|»» type|string|true|none|none|
|»» amount|string(bigint)|true|none|none|
|»» owner|object|true|none|none|
|»»» addresses|[string]|true|none|none|
|»»» threshold|number|true|none|none|
|»» locktime|string(date-time)|false|none|none|
|»» dstChain|string|false|none|Populated if this UTXO results from an export|
|»» asset|object|false|none|none|
|»»» id|string|true|none|none|
|»»» name|string|false|none|none|
|»»» symbol|string|false|none|none|
|»»» denomination|number|false|none|none|
|»»» type|string|false|none|none|
|» memo|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|add_validator|
|type|add_subnet_validator|
|type|add_delegator|
|type|create_chain|
|type|create_subnet|
|type|import|
|type|export|
|type|advance_time|
|type|reward_validator|
|type|remove_subnet_validator|
|type|transform_subnet|
|type|add_permissionsless_validator|
|type|add_permissionsless_delegator|
|type|fixed_cap|
|type|var_cap|
|type|nft|
|type|base|
|type|stake|
|type|reward|
|type|fixed_cap|
|type|var_cap|
|type|nft|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_pvm_{blockchainId}_transactions_{transactionId}_inputs

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/inputs \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/inputs HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/inputs',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/inputs',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/inputs', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/inputs', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/inputs");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/inputs", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/inputs`

Lists the inputs of a specific transaction.

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_transactions_{transactionid}_inputs-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|blockchainId|path|string|true|none|
|transactionId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "id": "string",
      "txId": "string",
      "index": 0,
      "amount": "string",
      "owner": {
        "addresses": [
          "string"
        ],
        "threshold": 0
      },
      "creds": [
        {
          "address": "string"
        }
      ],
      "srcChain": "string",
      "asset": {
        "id": "string",
        "name": "string",
        "symbol": "string",
        "denomination": 0,
        "type": "fixed_cap"
      }
    }
  ],
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_transactions_{transactionid}_inputs-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_transactions_{transactionid}_inputs-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» id|string|true|none|none|
|»» txId|string|true|none|none|
|»» index|number|true|none|none|
|»» amount|string(bigint)|true|none|none|
|»» owner|object|false|none|none|
|»»» addresses|[string]|false|none|none|
|»»» threshold|number|false|none|none|
|»» creds|[object]|true|none|none|
|»»» address|string|true|none|none|
|»» srcChain|string|false|none|Populated if this UTXO results from an import|
|»» asset|object|false|none|none|
|»»» id|string|true|none|none|
|»»» name|string|false|none|none|
|»»» symbol|string|false|none|none|
|»»» denomination|number|false|none|none|
|»»» type|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|fixed_cap|
|type|var_cap|
|type|nft|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_pvm_{blockchainId}_transactions_{transactionId}_outputs

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/outputs \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/outputs HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/outputs',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/outputs',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/outputs', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/outputs', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/outputs");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/outputs", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/pvm/{blockchainId}/transactions/{transactionId}/outputs`

Lists the outputs of a specific transaction.

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_transactions_{transactionid}_outputs-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|next|query|string|false|none|
|prev|query|string|false|none|
|limit|query|number|false|Max value: 100|
|networkId|path|string|true|none|
|blockchainId|path|string|true|none|
|transactionId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "id": "string",
      "txId": "string",
      "index": 0,
      "type": "base",
      "amount": "string",
      "owner": {
        "addresses": [
          "string"
        ],
        "threshold": 0
      },
      "locktime": "2019-08-24T14:15:22Z",
      "dstChain": "string",
      "asset": {
        "id": "string",
        "name": "string",
        "symbol": "string",
        "denomination": 0,
        "type": "fixed_cap"
      }
    }
  ],
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_transactions_{transactionid}_outputs-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_transactions_{transactionid}_outputs-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» id|string|true|none|none|
|»» txId|string|true|none|none|
|»» index|number|true|none|none|
|»» type|string|true|none|none|
|»» amount|string(bigint)|true|none|none|
|»» owner|object|true|none|none|
|»»» addresses|[string]|true|none|none|
|»»» threshold|number|true|none|none|
|»» locktime|string(date-time)|false|none|none|
|»» dstChain|string|false|none|Populated if this UTXO results from an export|
|»» asset|object|false|none|none|
|»»» id|string|true|none|none|
|»»» name|string|false|none|none|
|»»» symbol|string|false|none|none|
|»»» denomination|number|false|none|none|
|»»» type|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|base|
|type|stake|
|type|reward|
|type|fixed_cap|
|type|var_cap|
|type|nft|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

<h1 id="routescan-api-staking">Staking</h1>

## get__v2_network_{networkId}_pvm_{blockchainId}_staking_address_{addressId}

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId} \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}`

Retrieves the staking information of a specific address.

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_address_{addressid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|withPotentialRewards|query|number|false|none|
|blockchainId|path|string|true|none|
|networkId|path|string|true|none|
|addressId|path|string(pvm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "stakingRewards": {
    "value": "string"
  },
  "fromValidations": {
    "fromStaking": "string",
    "fees": "string",
    "totalRewards": "string"
  },
  "fromDelegations": {
    "fromStaking": "string",
    "fees": "string",
    "totalRewards": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_address_{addressid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_address_{addressid}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» stakingRewards|object|true|none|none|
|»» value|string(bigint)|true|none|none|
|» fromValidations|object|true|none|none|
|»» fromStaking|string(bigint)|true|none|none|
|»» fees|string(bigint)|true|none|none|
|»» totalRewards|string(bigint)|true|none|none|
|» fromDelegations|object|true|none|none|
|»» fromStaking|string(bigint)|true|none|none|
|»» fees|string(bigint)|true|none|none|
|»» totalRewards|string(bigint)|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_pvm_{blockchainId}_staking_address_{addressId}_overview

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}/overview \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}/overview HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}/overview',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}/overview',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}/overview', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}/overview', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}/overview");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}/overview", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/pvm/{blockchainId}/staking/address/{addressId}/overview`

Retrieves the staking informations of a specific address.

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_address_{addressid}_overview-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|monthFrom|query|string(date-time)|false|ISO date string representing the first day of the month|
|monthTo|query|string(date-time)|false|ISO date string representing the first day of the month|
|blockchainId|path|string|true|none|
|networkId|path|string|true|none|
|addressId|path|string(pvm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  {
    "month": "string",
    "stake": {
      "stakedInValidations": "string",
      "stakedInDelegations": "string",
      "notStaked": "string"
    },
    "rewards": {
      "validationRewards": "string",
      "delegationFeeRewards": "string",
      "netDelegationRewards": "string"
    }
  }
]
```

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_address_{addressid}_overview-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_address_{addressid}_overview-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» month|string|true|none|none|
|» stake|object|true|none|none|
|»» stakedInValidations|string(bigint)|true|none|none|
|»» stakedInDelegations|string(bigint)|true|none|none|
|»» notStaked|string(bigint)|true|none|none|
|» rewards|object|true|none|none|
|»» validationRewards|string(bigint)|true|none|none|
|»» delegationFeeRewards|string(bigint)|true|none|none|
|»» netDelegationRewards|string(bigint)|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_pvm_{blockchainId}_staking_validations

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/pvm/{blockchainId}/staking/validations \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/pvm/{blockchainId}/staking/validations HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/pvm/{blockchainId}/staking/validations',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/pvm/{blockchainId}/staking/validations',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/pvm/{blockchainId}/staking/validations', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/pvm/{blockchainId}/staking/validations', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/pvm/{blockchainId}/staking/validations");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/pvm/{blockchainId}/staking/validations", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/pvm/{blockchainId}/staking/validations`

Lists validations.

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_validations-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|nodeIds|query|array[string]|false|none|
|subnetIds|query|array[string]|false|none|
|status|query|array[string]|false|none|
|blockchainIds|query|array[string]|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|blockchainId|path|string|true|none|
|networkId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|status|active|
|status|expired|
|status|rewarded|
|status|failed|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "nodeId": "string",
      "subnetId": "string",
      "transactionId": "string",
      "name": "string",
      "manager": "string",
      "icon": "string",
      "beneficiaries": [
        "string"
      ],
      "startTime": "2019-08-24T14:15:22Z",
      "endTime": "2019-08-24T14:15:22Z",
      "assetId": {},
      "stake": {
        "fromSelf": "string",
        "fromDelegations": "string",
        "total": "string",
        "networkShare": 0
      },
      "rewards": {
        "fromSelf": "string",
        "fromDelegations": "string",
        "total": "string"
      },
      "rwrdOuts": [
        {
          "ID": "string",
          "txID": "string",
          "outIndx": 0,
          "t": [
            0
          ],
          "assetID": "string",
          "amt": "string",
          "spentTx": "string",
          "height": 0,
          "ts": 0,
          "locktime": 0,
          "dstChain": "string",
          "owner": {
            "ID": "string",
            "threshold": 0,
            "addrs": [
              "string"
            ],
            "t": [
              0
            ]
          }
        }
      ],
      "delegations": {
        "count": 0,
        "delegationFee": 0,
        "maxYield": 0,
        "availableDelegationCapacity": "string",
        "totalDelegationCapacity": "string",
        "grossDelegationReward": "string",
        "netDelegationReward": "string"
      },
      "node": {
        "avgUptime": 0,
        "responsiveness": {
          "checksCount": 0,
          "positiveChecksCount": 0
        },
        "version": "string",
        "ip": "string",
        "isp": "string",
        "location": {
          "city": "string",
          "country": "string"
        },
        "uptime": {
          "avg": 0,
          "details": [
            {
              "nodeID": "string",
              "uptime": 0,
              "weight": 0,
              "totalWeight": 0
            }
          ]
        }
      },
      "detail": {
        "alias": "string",
        "manager": "string",
        "url": "string",
        "icon": "string",
        "claim_tx": "string",
        "signature": "string",
        "staking_reward_verified": true,
        "staking_reward_slug": "string"
      }
    }
  ],
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_validations-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_validations-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» nodeId|string|true|none|none|
|»» subnetId|string|true|none|none|
|»» transactionId|string|true|none|none|
|»» name|string|false|none|none|
|»» manager|string|false|none|none|
|»» icon|string|false|none|none|
|»» beneficiaries|[string]|true|none|none|
|»» startTime|string(date-time)|true|none|none|
|»» endTime|string(date-time)|true|none|none|
|»» assetId|any|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|null|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|string|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» stake|object|true|none|none|
|»»» fromSelf|string(bigint)|true|none|none|
|»»» fromDelegations|string(bigint)|true|none|none|
|»»» total|string(bigint)|true|none|none|
|»»» networkShare|number|false|none|none|
|»» rewards|object|true|none|none|
|»»» fromSelf|string(bigint)|true|none|none|
|»»» fromDelegations|string(bigint)|true|none|none|
|»»» total|string(bigint)|true|none|none|
|»» rwrdOuts|[object]|false|none|none|
|»»» ID|string|true|none|none|
|»»» txID|string|false|none|none|
|»»» outIndx|number|false|none|none|
|»»» t|[number]|false|none|none|
|»»» assetID|string|false|none|none|
|»»» amt|string|false|none|none|
|»»» spentTx|string|false|none|none|
|»»» height|number|false|none|none|
|»»» ts|number|false|none|none|
|»»» locktime|number|false|none|none|
|»»» dstChain|string|false|none|none|
|»»» owner|object|false|none|none|
|»»»» ID|string|true|none|none|
|»»»» threshold|number|false|none|none|
|»»»» addrs|[string]|false|none|none|
|»»»» t|[number]|false|none|none|
|»» delegations|object|true|none|none|
|»»» count|number|true|none|none|
|»»» delegationFee|number|false|none|none|
|»»» maxYield|number|false|none|Max yield if you start delegating now until end time|
|»»» availableDelegationCapacity|string(bigint)|false|none|none|
|»»» totalDelegationCapacity|string(bigint)|false|none|none|
|»»» grossDelegationReward|string(bigint)|false|none|Sum of expected rewards of all delegations|
|»»» netDelegationReward|string(bigint)|false|none|Gross delegation rewards minus delegation fee|
|»» node|object|true|none|none|
|»»» avgUptime|number|false|none|none|
|»»» responsiveness|object|true|none|none|
|»»»» checksCount|number|true|none|none|
|»»»» positiveChecksCount|number|true|none|none|
|»»» version|string|true|none|none|
|»»» ip|string|true|none|none|
|»»» isp|string|false|none|none|
|»»» location|object|true|none|none|
|»»»» city|string|false|none|none|
|»»»» country|string|false|none|none|
|»»» uptime|object|true|none|none|
|»»»» avg|number|true|none|none|
|»»»» details|[object]|true|none|none|
|»»»»» nodeID|string|true|none|none|
|»»»»» uptime|number|true|none|none|
|»»»»» weight|number|true|none|none|
|»»»»» totalWeight|number|true|none|none|
|»» detail|object|false|none|none|
|»»» alias|string|false|none|none|
|»»» manager|string|false|none|none|
|»»» url|string|false|none|none|
|»»» icon|string|false|none|none|
|»»» claim_tx|string|false|none|none|
|»»» signature|string|false|none|none|
|»»» staking_reward_verified|boolean|false|none|none|
|»»» staking_reward_slug|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_pvm_{blockchainId}_staking_validations_{validationId}

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/pvm/{blockchainId}/staking/validations/{validationId} \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/pvm/{blockchainId}/staking/validations/{validationId} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/pvm/{blockchainId}/staking/validations/{validationId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/pvm/{blockchainId}/staking/validations/{validationId}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/pvm/{blockchainId}/staking/validations/{validationId}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/pvm/{blockchainId}/staking/validations/{validationId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/pvm/{blockchainId}/staking/validations/{validationId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/pvm/{blockchainId}/staking/validations/{validationId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/pvm/{blockchainId}/staking/validations/{validationId}`

Retrieves the details of a specific validation.

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_validations_{validationid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|blockchainId|path|string|true|none|
|networkId|path|string|true|none|
|validationId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "nodeId": "string",
  "subnetId": "string",
  "transactionId": "string",
  "name": "string",
  "manager": "string",
  "icon": "string",
  "beneficiaries": [
    "string"
  ],
  "startTime": "2019-08-24T14:15:22Z",
  "endTime": "2019-08-24T14:15:22Z",
  "assetId": {},
  "stake": {
    "fromSelf": "string",
    "fromDelegations": "string",
    "total": "string",
    "networkShare": 0
  },
  "rewards": {
    "fromSelf": "string",
    "fromDelegations": "string",
    "total": "string"
  },
  "rwrdOuts": [
    {
      "ID": "string",
      "txID": "string",
      "outIndx": 0,
      "t": [
        0
      ],
      "assetID": "string",
      "amt": "string",
      "spentTx": "string",
      "height": 0,
      "ts": 0,
      "locktime": 0,
      "dstChain": "string",
      "owner": {
        "ID": "string",
        "threshold": 0,
        "addrs": [
          "string"
        ],
        "t": [
          0
        ]
      }
    }
  ],
  "delegations": {
    "count": 0,
    "delegationFee": 0,
    "maxYield": 0,
    "availableDelegationCapacity": "string",
    "totalDelegationCapacity": "string",
    "grossDelegationReward": "string",
    "netDelegationReward": "string"
  },
  "node": {
    "avgUptime": 0,
    "responsiveness": {
      "checksCount": 0,
      "positiveChecksCount": 0
    },
    "version": "string",
    "ip": "string",
    "isp": "string",
    "location": {
      "city": "string",
      "country": "string"
    },
    "uptime": {
      "avg": 0,
      "details": [
        {
          "nodeID": "string",
          "uptime": 0,
          "weight": 0,
          "totalWeight": 0
        }
      ]
    }
  },
  "detail": {
    "alias": "string",
    "manager": "string",
    "url": "string",
    "icon": "string",
    "claim_tx": "string",
    "signature": "string",
    "staking_reward_verified": true,
    "staking_reward_slug": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_validations_{validationid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_validations_{validationid}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» nodeId|string|true|none|none|
|» subnetId|string|true|none|none|
|» transactionId|string|true|none|none|
|» name|string|false|none|none|
|» manager|string|false|none|none|
|» icon|string|false|none|none|
|» beneficiaries|[string]|true|none|none|
|» startTime|string(date-time)|true|none|none|
|» endTime|string(date-time)|true|none|none|
|» assetId|any|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|null|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|string|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» stake|object|true|none|none|
|»» fromSelf|string(bigint)|true|none|none|
|»» fromDelegations|string(bigint)|true|none|none|
|»» total|string(bigint)|true|none|none|
|»» networkShare|number|false|none|none|
|» rewards|object|true|none|none|
|»» fromSelf|string(bigint)|true|none|none|
|»» fromDelegations|string(bigint)|true|none|none|
|»» total|string(bigint)|true|none|none|
|» rwrdOuts|[object]|false|none|none|
|»» ID|string|true|none|none|
|»» txID|string|false|none|none|
|»» outIndx|number|false|none|none|
|»» t|[number]|false|none|none|
|»» assetID|string|false|none|none|
|»» amt|string|false|none|none|
|»» spentTx|string|false|none|none|
|»» height|number|false|none|none|
|»» ts|number|false|none|none|
|»» locktime|number|false|none|none|
|»» dstChain|string|false|none|none|
|»» owner|object|false|none|none|
|»»» ID|string|true|none|none|
|»»» threshold|number|false|none|none|
|»»» addrs|[string]|false|none|none|
|»»» t|[number]|false|none|none|
|» delegations|object|true|none|none|
|»» count|number|true|none|none|
|»» delegationFee|number|false|none|none|
|»» maxYield|number|false|none|Max yield if you start delegating now until end time|
|»» availableDelegationCapacity|string(bigint)|false|none|none|
|»» totalDelegationCapacity|string(bigint)|false|none|none|
|»» grossDelegationReward|string(bigint)|false|none|Sum of expected rewards of all delegations|
|»» netDelegationReward|string(bigint)|false|none|Gross delegation rewards minus delegation fee|
|» node|object|true|none|none|
|»» avgUptime|number|false|none|none|
|»» responsiveness|object|true|none|none|
|»»» checksCount|number|true|none|none|
|»»» positiveChecksCount|number|true|none|none|
|»» version|string|true|none|none|
|»» ip|string|true|none|none|
|»» isp|string|false|none|none|
|»» location|object|true|none|none|
|»»» city|string|false|none|none|
|»»» country|string|false|none|none|
|»» uptime|object|true|none|none|
|»»» avg|number|true|none|none|
|»»» details|[object]|true|none|none|
|»»»» nodeID|string|true|none|none|
|»»»» uptime|number|true|none|none|
|»»»» weight|number|true|none|none|
|»»»» totalWeight|number|true|none|none|
|» detail|object|false|none|none|
|»» alias|string|false|none|none|
|»» manager|string|false|none|none|
|»» url|string|false|none|none|
|»» icon|string|false|none|none|
|»» claim_tx|string|false|none|none|
|»» signature|string|false|none|none|
|»» staking_reward_verified|boolean|false|none|none|
|»» staking_reward_slug|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_pvm_{blockchainId}_staking_delegations

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/pvm/{blockchainId}/staking/delegations \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/pvm/{blockchainId}/staking/delegations HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/pvm/{blockchainId}/staking/delegations',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/pvm/{blockchainId}/staking/delegations',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/pvm/{blockchainId}/staking/delegations', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/pvm/{blockchainId}/staking/delegations', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/pvm/{blockchainId}/staking/delegations");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/pvm/{blockchainId}/staking/delegations", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/pvm/{blockchainId}/staking/delegations`

Retrieves the details of a specific delegation.

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_delegations-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|nodeIds|query|array[string]|false|none|
|subnetIds|query|array[string]|false|none|
|status|query|array[string]|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|blockchainId|path|string|true|none|
|networkId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|status|active|
|status|expired|
|status|rewarded|
|status|failed|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "txId": "string",
      "nodeId": "string",
      "subnetId": "string",
      "beneficiaries": [
        "string"
      ],
      "startTime": "2019-08-24T14:15:22Z",
      "endTime": "2019-08-24T14:15:22Z",
      "stake": "string",
      "reward": "string",
      "rwrdOuts": [
        {
          "ID": "string",
          "txID": "string",
          "outIndx": 0,
          "t": [
            0
          ],
          "assetID": "string",
          "amt": "string",
          "spentTx": "string",
          "height": 0,
          "ts": 0,
          "locktime": 0,
          "dstChain": "string",
          "owner": {
            "ID": "string",
            "threshold": 0,
            "addrs": [
              "string"
            ],
            "t": [
              0
            ]
          }
        }
      ]
    }
  ],
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_delegations-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_delegations-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» txId|string|true|none|none|
|»» nodeId|string|true|none|none|
|»» subnetId|string|true|none|none|
|»» beneficiaries|[string]|true|none|none|
|»» startTime|string(date-time)|true|none|none|
|»» endTime|string(date-time)|true|none|none|
|»» stake|string(bigint)|true|none|none|
|»» reward|string(bigint)|true|none|none|
|»» rwrdOuts|[object]|false|none|none|
|»»» ID|string|true|none|none|
|»»» txID|string|false|none|none|
|»»» outIndx|number|false|none|none|
|»»» t|[number]|false|none|none|
|»»» assetID|string|false|none|none|
|»»» amt|string|false|none|none|
|»»» spentTx|string|false|none|none|
|»»» height|number|false|none|none|
|»»» ts|number|false|none|none|
|»»» locktime|number|false|none|none|
|»»» dstChain|string|false|none|none|
|»»» owner|object|false|none|none|
|»»»» ID|string|true|none|none|
|»»»» threshold|number|false|none|none|
|»»»» addrs|[string]|false|none|none|
|»»»» t|[number]|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_pvm_{blockchainId}_staking_subnets

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/pvm/{blockchainId}/staking/subnets \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/pvm/{blockchainId}/staking/subnets HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/pvm/{blockchainId}/staking/subnets',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/pvm/{blockchainId}/staking/subnets',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/pvm/{blockchainId}/staking/subnets', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/pvm/{blockchainId}/staking/subnets', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/pvm/{blockchainId}/staking/subnets");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/pvm/{blockchainId}/staking/subnets", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/pvm/{blockchainId}/staking/subnets`

Lists the subnets.

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_subnets-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|next|query|string|false|none|
|prev|query|string|false|none|
|blockchainId|path|string|true|none|
|networkId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "id": "string",
      "activeDelegatedWeight": "string",
      "activeDelegationCount": "string",
      "activeValidationWeight": "string",
      "activeValidatorCount": "string",
      "pendingDelegatedWeight": "string",
      "pendingDelegationCount": "string",
      "pendingValidationWeight": "string",
      "pendingValidatorCount": "string"
    }
  ],
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_subnets-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_pvm_{blockchainid}_staking_subnets-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» id|string|true|none|none|
|»» activeDelegatedWeight|string(bigint)|true|none|none|
|»» activeDelegationCount|string(bigint)|true|none|none|
|»» activeValidationWeight|string(bigint)|true|none|none|
|»» activeValidatorCount|string(bigint)|true|none|none|
|»» pendingDelegatedWeight|string(bigint)|true|none|none|
|»» pendingDelegationCount|string(bigint)|true|none|none|
|»» pendingValidationWeight|string(bigint)|true|none|none|
|»» pendingValidatorCount|string(bigint)|true|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_staking_address_{addressId}

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/staking/address/{addressId} \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/staking/address/{addressId} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/staking/address/{addressId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/staking/address/{addressId}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/staking/address/{addressId}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/staking/address/{addressId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/staking/address/{addressId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/staking/address/{addressId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/staking/address/{addressId}`

Lists the staking details of a specific address.

<h3 id="get__v2_network_{networkid}_staking_address_{addressid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|withPotentialRewards|query|number|false|none|
|networkId|path|string|true|none|
|addressId|path|string(pvm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "stakingRewards": {
    "value": "string"
  },
  "fromValidations": {
    "fromStaking": "string",
    "fees": "string",
    "totalRewards": "string"
  },
  "fromDelegations": {
    "fromStaking": "string",
    "fees": "string",
    "totalRewards": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_staking_address_{addressid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_staking_address_{addressid}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» stakingRewards|object|true|none|none|
|»» value|string(bigint)|true|none|none|
|» fromValidations|object|true|none|none|
|»» fromStaking|string(bigint)|true|none|none|
|»» fees|string(bigint)|true|none|none|
|»» totalRewards|string(bigint)|true|none|none|
|» fromDelegations|object|true|none|none|
|»» fromStaking|string(bigint)|true|none|none|
|»» fees|string(bigint)|true|none|none|
|»» totalRewards|string(bigint)|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_staking_address_{addressId}_overview

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/staking/address/{addressId}/overview \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/staking/address/{addressId}/overview HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/staking/address/{addressId}/overview',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/staking/address/{addressId}/overview',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/staking/address/{addressId}/overview', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/staking/address/{addressId}/overview', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/staking/address/{addressId}/overview");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/staking/address/{addressId}/overview", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/staking/address/{addressId}/overview`

Retrieves the staking overview of a specific address.

<h3 id="get__v2_network_{networkid}_staking_address_{addressid}_overview-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|monthFrom|query|string(date-time)|false|ISO date string representing the first day of the month|
|monthTo|query|string(date-time)|false|ISO date string representing the first day of the month|
|networkId|path|string|true|none|
|addressId|path|string(pvm-address)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
[
  {
    "month": "string",
    "stake": {
      "stakedInValidations": "string",
      "stakedInDelegations": "string",
      "notStaked": "string"
    },
    "rewards": {
      "validationRewards": "string",
      "delegationFeeRewards": "string",
      "netDelegationRewards": "string"
    }
  }
]
```

<h3 id="get__v2_network_{networkid}_staking_address_{addressid}_overview-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_staking_address_{addressid}_overview-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» month|string|true|none|none|
|» stake|object|true|none|none|
|»» stakedInValidations|string(bigint)|true|none|none|
|»» stakedInDelegations|string(bigint)|true|none|none|
|»» notStaked|string(bigint)|true|none|none|
|» rewards|object|true|none|none|
|»» validationRewards|string(bigint)|true|none|none|
|»» delegationFeeRewards|string(bigint)|true|none|none|
|»» netDelegationRewards|string(bigint)|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_staking_validations

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/staking/validations \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/staking/validations HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/staking/validations',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/staking/validations',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/staking/validations', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/staking/validations', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/staking/validations");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/staking/validations", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/staking/validations`

Lists the validations.

<h3 id="get__v2_network_{networkid}_staking_validations-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|nodeIds|query|array[string]|false|none|
|subnetIds|query|array[string]|false|none|
|status|query|array[string]|false|none|
|blockchainIds|query|array[string]|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|networkId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|status|active|
|status|expired|
|status|rewarded|
|status|failed|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "nodeId": "string",
      "subnetId": "string",
      "transactionId": "string",
      "name": "string",
      "manager": "string",
      "icon": "string",
      "beneficiaries": [
        "string"
      ],
      "startTime": "2019-08-24T14:15:22Z",
      "endTime": "2019-08-24T14:15:22Z",
      "assetId": {},
      "stake": {
        "fromSelf": "string",
        "fromDelegations": "string",
        "total": "string",
        "networkShare": 0
      },
      "rewards": {
        "fromSelf": "string",
        "fromDelegations": "string",
        "total": "string"
      },
      "rwrdOuts": [
        {
          "ID": "string",
          "txID": "string",
          "outIndx": 0,
          "t": [
            0
          ],
          "assetID": "string",
          "amt": "string",
          "spentTx": "string",
          "height": 0,
          "ts": 0,
          "locktime": 0,
          "dstChain": "string",
          "owner": {
            "ID": "string",
            "threshold": 0,
            "addrs": [
              "string"
            ],
            "t": [
              0
            ]
          }
        }
      ],
      "delegations": {
        "count": 0,
        "delegationFee": 0,
        "maxYield": 0,
        "availableDelegationCapacity": "string",
        "totalDelegationCapacity": "string",
        "grossDelegationReward": "string",
        "netDelegationReward": "string"
      },
      "node": {
        "avgUptime": 0,
        "responsiveness": {
          "checksCount": 0,
          "positiveChecksCount": 0
        },
        "version": "string",
        "ip": "string",
        "isp": "string",
        "location": {
          "city": "string",
          "country": "string"
        },
        "uptime": {
          "avg": 0,
          "details": [
            {
              "nodeID": "string",
              "uptime": 0,
              "weight": 0,
              "totalWeight": 0
            }
          ]
        }
      },
      "detail": {
        "alias": "string",
        "manager": "string",
        "url": "string",
        "icon": "string",
        "claim_tx": "string",
        "signature": "string",
        "staking_reward_verified": true,
        "staking_reward_slug": "string"
      }
    }
  ],
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_staking_validations-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_staking_validations-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» nodeId|string|true|none|none|
|»» subnetId|string|true|none|none|
|»» transactionId|string|true|none|none|
|»» name|string|false|none|none|
|»» manager|string|false|none|none|
|»» icon|string|false|none|none|
|»» beneficiaries|[string]|true|none|none|
|»» startTime|string(date-time)|true|none|none|
|»» endTime|string(date-time)|true|none|none|
|»» assetId|any|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|null|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|string|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» stake|object|true|none|none|
|»»» fromSelf|string(bigint)|true|none|none|
|»»» fromDelegations|string(bigint)|true|none|none|
|»»» total|string(bigint)|true|none|none|
|»»» networkShare|number|false|none|none|
|»» rewards|object|true|none|none|
|»»» fromSelf|string(bigint)|true|none|none|
|»»» fromDelegations|string(bigint)|true|none|none|
|»»» total|string(bigint)|true|none|none|
|»» rwrdOuts|[object]|false|none|none|
|»»» ID|string|true|none|none|
|»»» txID|string|false|none|none|
|»»» outIndx|number|false|none|none|
|»»» t|[number]|false|none|none|
|»»» assetID|string|false|none|none|
|»»» amt|string|false|none|none|
|»»» spentTx|string|false|none|none|
|»»» height|number|false|none|none|
|»»» ts|number|false|none|none|
|»»» locktime|number|false|none|none|
|»»» dstChain|string|false|none|none|
|»»» owner|object|false|none|none|
|»»»» ID|string|true|none|none|
|»»»» threshold|number|false|none|none|
|»»»» addrs|[string]|false|none|none|
|»»»» t|[number]|false|none|none|
|»» delegations|object|true|none|none|
|»»» count|number|true|none|none|
|»»» delegationFee|number|false|none|none|
|»»» maxYield|number|false|none|Max yield if you start delegating now until end time|
|»»» availableDelegationCapacity|string(bigint)|false|none|none|
|»»» totalDelegationCapacity|string(bigint)|false|none|none|
|»»» grossDelegationReward|string(bigint)|false|none|Sum of expected rewards of all delegations|
|»»» netDelegationReward|string(bigint)|false|none|Gross delegation rewards minus delegation fee|
|»» node|object|true|none|none|
|»»» avgUptime|number|false|none|none|
|»»» responsiveness|object|true|none|none|
|»»»» checksCount|number|true|none|none|
|»»»» positiveChecksCount|number|true|none|none|
|»»» version|string|true|none|none|
|»»» ip|string|true|none|none|
|»»» isp|string|false|none|none|
|»»» location|object|true|none|none|
|»»»» city|string|false|none|none|
|»»»» country|string|false|none|none|
|»»» uptime|object|true|none|none|
|»»»» avg|number|true|none|none|
|»»»» details|[object]|true|none|none|
|»»»»» nodeID|string|true|none|none|
|»»»»» uptime|number|true|none|none|
|»»»»» weight|number|true|none|none|
|»»»»» totalWeight|number|true|none|none|
|»» detail|object|false|none|none|
|»»» alias|string|false|none|none|
|»»» manager|string|false|none|none|
|»»» url|string|false|none|none|
|»»» icon|string|false|none|none|
|»»» claim_tx|string|false|none|none|
|»»» signature|string|false|none|none|
|»»» staking_reward_verified|boolean|false|none|none|
|»»» staking_reward_slug|string|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_staking_validations_{validationId}

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/staking/validations/{validationId} \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/staking/validations/{validationId} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/staking/validations/{validationId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/staking/validations/{validationId}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/staking/validations/{validationId}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/staking/validations/{validationId}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/staking/validations/{validationId}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/staking/validations/{validationId}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/staking/validations/{validationId}`

Retrieves the details of a specific validation.

<h3 id="get__v2_network_{networkid}_staking_validations_{validationid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|networkId|path|string|true|none|
|validationId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "nodeId": "string",
  "subnetId": "string",
  "transactionId": "string",
  "name": "string",
  "manager": "string",
  "icon": "string",
  "beneficiaries": [
    "string"
  ],
  "startTime": "2019-08-24T14:15:22Z",
  "endTime": "2019-08-24T14:15:22Z",
  "assetId": {},
  "stake": {
    "fromSelf": "string",
    "fromDelegations": "string",
    "total": "string",
    "networkShare": 0
  },
  "rewards": {
    "fromSelf": "string",
    "fromDelegations": "string",
    "total": "string"
  },
  "rwrdOuts": [
    {
      "ID": "string",
      "txID": "string",
      "outIndx": 0,
      "t": [
        0
      ],
      "assetID": "string",
      "amt": "string",
      "spentTx": "string",
      "height": 0,
      "ts": 0,
      "locktime": 0,
      "dstChain": "string",
      "owner": {
        "ID": "string",
        "threshold": 0,
        "addrs": [
          "string"
        ],
        "t": [
          0
        ]
      }
    }
  ],
  "delegations": {
    "count": 0,
    "delegationFee": 0,
    "maxYield": 0,
    "availableDelegationCapacity": "string",
    "totalDelegationCapacity": "string",
    "grossDelegationReward": "string",
    "netDelegationReward": "string"
  },
  "node": {
    "avgUptime": 0,
    "responsiveness": {
      "checksCount": 0,
      "positiveChecksCount": 0
    },
    "version": "string",
    "ip": "string",
    "isp": "string",
    "location": {
      "city": "string",
      "country": "string"
    },
    "uptime": {
      "avg": 0,
      "details": [
        {
          "nodeID": "string",
          "uptime": 0,
          "weight": 0,
          "totalWeight": 0
        }
      ]
    }
  },
  "detail": {
    "alias": "string",
    "manager": "string",
    "url": "string",
    "icon": "string",
    "claim_tx": "string",
    "signature": "string",
    "staking_reward_verified": true,
    "staking_reward_slug": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_staking_validations_{validationid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_staking_validations_{validationid}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» nodeId|string|true|none|none|
|» subnetId|string|true|none|none|
|» transactionId|string|true|none|none|
|» name|string|false|none|none|
|» manager|string|false|none|none|
|» icon|string|false|none|none|
|» beneficiaries|[string]|true|none|none|
|» startTime|string(date-time)|true|none|none|
|» endTime|string(date-time)|true|none|none|
|» assetId|any|true|none|none|

*anyOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|null|false|none|none|

*or*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|string|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» stake|object|true|none|none|
|»» fromSelf|string(bigint)|true|none|none|
|»» fromDelegations|string(bigint)|true|none|none|
|»» total|string(bigint)|true|none|none|
|»» networkShare|number|false|none|none|
|» rewards|object|true|none|none|
|»» fromSelf|string(bigint)|true|none|none|
|»» fromDelegations|string(bigint)|true|none|none|
|»» total|string(bigint)|true|none|none|
|» rwrdOuts|[object]|false|none|none|
|»» ID|string|true|none|none|
|»» txID|string|false|none|none|
|»» outIndx|number|false|none|none|
|»» t|[number]|false|none|none|
|»» assetID|string|false|none|none|
|»» amt|string|false|none|none|
|»» spentTx|string|false|none|none|
|»» height|number|false|none|none|
|»» ts|number|false|none|none|
|»» locktime|number|false|none|none|
|»» dstChain|string|false|none|none|
|»» owner|object|false|none|none|
|»»» ID|string|true|none|none|
|»»» threshold|number|false|none|none|
|»»» addrs|[string]|false|none|none|
|»»» t|[number]|false|none|none|
|» delegations|object|true|none|none|
|»» count|number|true|none|none|
|»» delegationFee|number|false|none|none|
|»» maxYield|number|false|none|Max yield if you start delegating now until end time|
|»» availableDelegationCapacity|string(bigint)|false|none|none|
|»» totalDelegationCapacity|string(bigint)|false|none|none|
|»» grossDelegationReward|string(bigint)|false|none|Sum of expected rewards of all delegations|
|»» netDelegationReward|string(bigint)|false|none|Gross delegation rewards minus delegation fee|
|» node|object|true|none|none|
|»» avgUptime|number|false|none|none|
|»» responsiveness|object|true|none|none|
|»»» checksCount|number|true|none|none|
|»»» positiveChecksCount|number|true|none|none|
|»» version|string|true|none|none|
|»» ip|string|true|none|none|
|»» isp|string|false|none|none|
|»» location|object|true|none|none|
|»»» city|string|false|none|none|
|»»» country|string|false|none|none|
|»» uptime|object|true|none|none|
|»»» avg|number|true|none|none|
|»»» details|[object]|true|none|none|
|»»»» nodeID|string|true|none|none|
|»»»» uptime|number|true|none|none|
|»»»» weight|number|true|none|none|
|»»»» totalWeight|number|true|none|none|
|» detail|object|false|none|none|
|»» alias|string|false|none|none|
|»» manager|string|false|none|none|
|»» url|string|false|none|none|
|»» icon|string|false|none|none|
|»» claim_tx|string|false|none|none|
|»» signature|string|false|none|none|
|»» staking_reward_verified|boolean|false|none|none|
|»» staking_reward_slug|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_staking_delegations

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/staking/delegations \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/staking/delegations HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/staking/delegations',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/staking/delegations',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/staking/delegations', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/staking/delegations', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/staking/delegations");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/staking/delegations", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/staking/delegations`

Lists the delegations.

<h3 id="get__v2_network_{networkid}_staking_delegations-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|nodeIds|query|array[string]|false|none|
|subnetIds|query|array[string]|false|none|
|status|query|array[string]|false|none|
|next|query|string|false|none|
|prev|query|string|false|none|
|networkId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|status|active|
|status|expired|
|status|rewarded|
|status|failed|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "txId": "string",
      "nodeId": "string",
      "subnetId": "string",
      "beneficiaries": [
        "string"
      ],
      "startTime": "2019-08-24T14:15:22Z",
      "endTime": "2019-08-24T14:15:22Z",
      "stake": "string",
      "reward": "string",
      "rwrdOuts": [
        {
          "ID": "string",
          "txID": "string",
          "outIndx": 0,
          "t": [
            0
          ],
          "assetID": "string",
          "amt": "string",
          "spentTx": "string",
          "height": 0,
          "ts": 0,
          "locktime": 0,
          "dstChain": "string",
          "owner": {
            "ID": "string",
            "threshold": 0,
            "addrs": [
              "string"
            ],
            "t": [
              0
            ]
          }
        }
      ]
    }
  ],
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_staking_delegations-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_staking_delegations-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» txId|string|true|none|none|
|»» nodeId|string|true|none|none|
|»» subnetId|string|true|none|none|
|»» beneficiaries|[string]|true|none|none|
|»» startTime|string(date-time)|true|none|none|
|»» endTime|string(date-time)|true|none|none|
|»» stake|string(bigint)|true|none|none|
|»» reward|string(bigint)|true|none|none|
|»» rwrdOuts|[object]|false|none|none|
|»»» ID|string|true|none|none|
|»»» txID|string|false|none|none|
|»»» outIndx|number|false|none|none|
|»»» t|[number]|false|none|none|
|»»» assetID|string|false|none|none|
|»»» amt|string|false|none|none|
|»»» spentTx|string|false|none|none|
|»»» height|number|false|none|none|
|»»» ts|number|false|none|none|
|»»» locktime|number|false|none|none|
|»»» dstChain|string|false|none|none|
|»»» owner|object|false|none|none|
|»»»» ID|string|true|none|none|
|»»»» threshold|number|false|none|none|
|»»»» addrs|[string]|false|none|none|
|»»»» t|[number]|false|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

## get__v2_network_{networkId}_staking_subnets

> Code samples

```shell
# You can also use wget
curl -X GET /v2/network/{networkId}/staking/subnets \
  -H 'Accept: application/json'

```

```http
GET /v2/network/{networkId}/staking/subnets HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/v2/network/{networkId}/staking/subnets',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/v2/network/{networkId}/staking/subnets',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/v2/network/{networkId}/staking/subnets', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/v2/network/{networkId}/staking/subnets', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/v2/network/{networkId}/staking/subnets");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/v2/network/{networkId}/staking/subnets", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /v2/network/{networkId}/staking/subnets`

Lists the subnets.

<h3 id="get__v2_network_{networkid}_staking_subnets-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|next|query|string|false|none|
|prev|query|string|false|none|
|networkId|path|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|networkId|1|
|networkId|5|
|networkId|mainnet|
|networkId|testnet|
|networkId|debug|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "id": "string",
      "activeDelegatedWeight": "string",
      "activeDelegationCount": "string",
      "activeValidationWeight": "string",
      "activeValidatorCount": "string",
      "pendingDelegatedWeight": "string",
      "pendingDelegationCount": "string",
      "pendingValidationWeight": "string",
      "pendingValidatorCount": "string"
    }
  ],
  "link": {
    "next": "string",
    "nextToken": "string",
    "prev": "string",
    "prevToken": "string"
  }
}
```

<h3 id="get__v2_network_{networkid}_staking_subnets-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__v2_network_{networkid}_staking_subnets-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|true|none|none|
|»» id|string|true|none|none|
|»» activeDelegatedWeight|string(bigint)|true|none|none|
|»» activeDelegationCount|string(bigint)|true|none|none|
|»» activeValidationWeight|string(bigint)|true|none|none|
|»» activeValidatorCount|string(bigint)|true|none|none|
|»» pendingDelegatedWeight|string(bigint)|true|none|none|
|»» pendingDelegationCount|string(bigint)|true|none|none|
|»» pendingValidationWeight|string(bigint)|true|none|none|
|»» pendingValidatorCount|string(bigint)|true|none|none|
|» link|object|true|none|none|
|»» next|string|false|none|none|
|»» nextToken|string|false|none|none|
|»» prev|string|false|none|none|
|»» prevToken|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None, apiKey
</aside>

# Schemas

