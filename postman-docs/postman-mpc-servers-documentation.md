---

title: Set up the Postman MCP Server
approved: 2026-02-13T00:00:00.000Z
max-toc-depth: 2
ux: v12

---

The Postman MCP Server supports both [remote servers](#remote-server) through streamable HTTP and [local servers](#local-server) with STDIO. The remote server is available at `https://mcp.postman.com/` and `https://mcp.eu.postman.com` for the EU, and the local server is available in the [Postman MCP Server GitHub repository](https://github.com/postmanlabs/postman-mcp-server). You can also fork the [Postman MCP collection](https://www.postman.com/postman/postman-public-workspace/collection/681dc649440b35935978b8b7) from the Postman Public Workspace.

Postman also offers servers as an [npm package](https://www.npmjs.com/package/@postman/postman-mcp-server) and as a [Docker image](#install-in-docker).

### Authentication

For the best developer experience and fastest setup, use OAuth on the remote server (`https://mcp.postman.com`). OAuth is fully compliant with the [MCP Authorization specification](https://modelcontextprotocol.io/specification/draft/basic/authorization) and doesn't require manual API key configuration.

The EU remote server and the [local server](#local-server) support only [Postman API key](https://postman.postman.co/settings/me/api-keys) authentication.

### Support for EU

The Postman MCP Server supports the EU region for remote and local servers:

- For streamable HTTP, the remote server is available at `https://mcp.eu.postman.com`.
- For the STDIO public package, use the `--region` flag to specify the Postman API region (`us` or `eu`), or set the `POSTMAN_API_BASE_URL` environment variable directly.
- OAuth isn't supported for the EU Postman MCP Server. The EU remote server only supports API key authentication.

## Remote server

The remote Postman MCP Server is hosted by Postman over streamable HTTP and provides the easiest method for getting started.

The remote server (`https://mcp.postman.com`) supports OAuth for the best developer experience and fastest setup, and doesn't require an API key. OAuth provides stronger security and access control compared to a static API key. It's MCP specification-compliant, including Dynamic Client Registration (DCR), OAuth metadata, and PKCE.

<Info>
  The EU remote server (`https://mcp.eu.postman.com`) only supports API key authentication.
</Info>

MCP hosts that support OAuth can discover and use it automatically for all tools. The remote server also accepts a [Postman API key](https://postman.postman.co/settings/me/api-keys) (Bearer token in the Authorization header).

#### Use cases

Consider using the remote Postman MCP server if:

- Your MCP host doesn't support local MCP servers.
- You want a fast and quick way to get started with the Postman MCP server.

#### Supported configurations

The remote Postman MCP server offers the following tool configurations through streamable HTTP:

- **Minimal** — (Default) This mode only includes essential tools for basic Postman operations, available at `https://mcp.postman.com/minimal` and `https://mcp.eu.postman.com/minimal` for EU users.
- **Code** — Includes tools for searching public and internal API definitions and generating client code, available at `https://mcp.postman.com/code` and `https://mcp.eu.postman.com/code` for EU users.
- **Full** — Includes all available Postman API tools (100+ tools), available at `https://mcp.postman.com/mcp` and `https://mcp.eu.postman.com/mcp` for EU users.

### Install in Cursor

Click the button to install the remote Postman MCP Server in Cursor:

<a href="https://cursor.com/en/install-mcp?name=postman_mcp_server&config=eyJ1cmwiOiJodHRwczovL21jcC5wb3N0bWFuLmNvbS9taW5pbWFsIiwiaGVhZGVycyI6eyJBdXRob3JpemF0aW9uIjoiQmVhcmVyIFlPVVJfQVBJX0tFWSJ9fQ%3D%3D" target="_blank" rel="noopener noreferrer">
  <img alt="Install the remote Postman MCP Server" src="https://cursor.com/deeplink/mcp-install-dark.svg" width="130px" role="img" />
</a>

<Info>
  If your MCP host supports OAuth, use the `https://mcp.postman.com` server URL without headers for the fastest setup. Otherwise, ensure the Authorization header uses the `Bearer <YOUR_API_KEY>` format. Note that OAuth isn't supported for EU servers.
</Info>

After installing, ensure that the Authorization header uses the `Bearer $POSTMAN-API-KEY` format.

To access **Full** mode, change the `url` value to `https://mcp.postman.com/mcp` in the `mcp.json` file. To access **Code** mode, change the value to `https://mcp.postman.com/code` in this file.

### Install in Visual Studio Code

To install the remote Postman MCP Server in VS Code, click the install button or use the [Postman VS Code Extension](/docs/developer/vs-code-extension/postman-mcp-server/):

<a href="https://insiders.vscode.dev/redirect/mcp/install?name=postman_mcp_server&config=%7B%22type%22%3A%20%22http%22%2C%22url%22%3A%20%22https%3A%2F%2Fmcp.postman.com%2Fminimal%22%2C%22headers%22%3A%7B%22Authorization%22%3A%22Bearer%20YOUR_API_KEY%22%7D%7D" target="_blank" rel="noopener noreferrer">
  <img alt="Install the remote Postman MCP Server in VS Code" src="https://img.shields.io/badge/VS_Code-Install_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white" width="130px" />
</a>

To access **Full** mode, change the `url` value to `https://mcp.postman.com/mcp` in the `mcp.json` file. To access **Code** mode, change the value to `https://mcp.postman.com/code` in this file.

#### Manual installation

You can use the Postman MCP Server with MCP-compatible extensions in VS Code, such as GitHub Copilot, Claude for VS Code, or other AI assistants that support MCP. To do this, add the following JSON block to the `.vscode/mcp.json` configuration file:

**OAuth**

Add the following JSON block to use the recommended OAuth installation method:

```json wordWrap
{
  "servers": {
    "postman": {
      "type": "http",
      "url": "https://mcp.postman.com/{minimal OR code OR mcp}"
    }
  }
}
```

Start the server. When prompted, enter your Postman API key.

**API key**

Use the following JSON block to use the API key installation method:

```json
{
  "servers": {
    "postman": {
      "type": "http",
      "url": "https://mcp.postman.com/{minimal OR code OR mcp}",
      // For the EU server, use "https://mcp.eu.postman.com/{minimal OR code OR mcp}"
      "headers": {
        "Authorization": "Bearer ${input:postman-api-key}"
      }
    }
  },
  "inputs": [
    {
      "id": "postman-api-key",
      "type": "promptString",
      "description": "Enter your Postman API key"
    }
  ]
}
```

Start the server. When prompted, enter your Postman API key.

### Install in Claude Code

On the US server, Claude Code automatically uses OAuth for the best installation experience. To use an API key (required for the EU server), add the `--header` flag.

**OAuth**

To use the OAuth installation method for US servers, run the following command in your terminal:

For **Minimal** mode:

```bash
claude mcp add --transport http postman https://mcp.postman.com/minimal
```

For **Code** mode:

```bash
claude mcp add --transport http postman https://mcp.postman.com/code
```

For **Full** mode:

```bash
claude mcp add --transport http postman https://mcp.postman.com/mcp
```

**API key**

To use the API key installation method if required and for EU servers, run the following command in your terminal:

For **Minimal** mode:

```bash
claude mcp add --transport http postman https://mcp.postman.com/minimal --header "Authorization: Bearer <POSTMAN_API_KEY>"
```

For **Code** mode:

```bash
claude mcp add --transport http postman https://mcp.postman.com/code --header "Authorization: Bearer <POSTMAN_API_KEY>"
```

For **Full** mode:

```bash
claude mcp add --transport http postman https://mcp.postman.com/mcp --header "Authorization: Bearer <POSTMAN_API_KEY>"
```

### Install in Codex

To install the remote server in Codex, use one of the following methods, depending on your authentication and region.

**OAuth**

Use this method with the US server for the best installation experience. OAuth requires no manual API key setup.

For **Minimal** mode:

```bash
codex mcp add postman --remote-url https://mcp.postman.com/minimal
```

For **Code** mode:

```bash
codex mcp add postman --remote-url https://mcp.postman.com/code
```

For **Full** mode:

```bash
codex mcp add postman --remote-url https://mcp.postman.com/mcp
```

**API key**

If you're using the EU server, a [local server](#install-in-codex-1), or prefer API key authentication, use the API key method. Set the `POSTMAN_API_KEY` environment variable and invoke the MCP server using `npx`.

For **Minimal** mode:

```bash
codex mcp add postman --env POSTMAN_API_KEY=<POSTMAN_API_KEY> -- npx @postman/postman-mcp-server --minimal
```

For **Code** mode:

```bash
codex mcp add postman --env POSTMAN_API_KEY=<POSTMAN_API_KEY> -- npx @postman/postman-mcp-server --code
```

For **Full** mode:

```bash
codex mcp add postman --env POSTMAN_API_KEY=<POSTMAN_API_KEY> -- npx @postman/postman-mcp-server --full
```

#### Manual installation

To manually install the MCP server in Codex, create a `~/.codex/config.toml` config file, then copy the following config into the file:

```bash
[mcp_servers.postman-mcp-server]
command = "npx"
args = ["-y", "@postman/postman-mcp-server"]

[mcp_servers.postman-mcp-server.env]
POSTMAN_API_KEY="XXX"
```

### Install in Windsurf

To install the MCP server in Windsurf, copy the following JSON config into the `.codeium/windsurf/mcp_config.json` file. This configuration uses the remote server (`https://mcp.postman.com`), which automatically authenticates with OAuth.

```json wordWrap
{
  "mcpServers": {
    "postman-full": {
      "args": ["mcp-remote", "https://mcp.postman.com/mcp"],
      "disabled": false,
      "disabledTools": [],
      "env": {}
    },
    "postman-code": {
      "args": ["mcp-remote", "https://mcp.postman.com/code"],
      "disabled": false,
      "disabledTools": [],
      "env": {}
    },
    "postman-minimal": {
      "args": ["mcp-remote", "https://mcp.postman.com/minimal"],
      "disabled": false,
      "disabledTools": [],
      "env": {}
    }
  }
}
```

### Install in Antigravity

To install the MCP server in Antigravity, click **Manage MCP servers > View raw config**. Then, copy the following JSON config into the `.codeium/windsurf/mcp_config.json` file. This configuration uses the remote server (`https://mcp.postman.com`), which automatically authenticates with OAuth.

```json wordWrap
{
  "mcpServers": {
    "postman-full": {
      "args": ["mcp-remote", "https://mcp.postman.com/mcp"],
      "disabled": false,
      "disabledTools": [],
      "env": {}
    },
    "postman-code": {
      "args": ["mcp-remote", "https://mcp.postman.com/code"],
      "disabled": false,
      "disabledTools": [],
      "env": {}
    },
    "postman-minimal": {
      "args": ["mcp-remote", "https://mcp.postman.com/minimal"],
      "disabled": false,
      "disabledTools": [],
      "env": {}
    }
  }
}
```

### Install in GitHub Copilot CLI

You can add the MCP server to your Copilot CLI either with OAuth (recommended) or an API key.

Use the Copilot CLI to interactively add the MCP server:

```bash
/mcp add
```

#### Manual installation

Copy the following JSON config into the `~/.copilot/mcp-config.json` file:

```json wordWrap
{
  "mcpServers": {
    "postman": {
      "type": "http",
      "url": "https://mcp.postman.com/minimal" // Use "https://mcp.postman.com/mcp" for Full mode, or "https://mcp.postman.com/code"` for Code mode.
    }
  }
}
```

**API key**

Use the following method to install on EU servers or if API key authentication is required:

```json wordWrap
{
  "mcpServers": {
    "postman": {
      "type": "http",
      "url": "https://mcp.eu.postman.com/minimal", // To use Full mode, use https://mcp.postman.com/mcp. For Code mode, use https://mcp.postman.com/code.
      "headers": {
        "Authorization": "Bearer ${input:postman-api-key}"
      }
    }
  },
  "inputs": [
    {
      "id": "postman-api-key",
      "type": "promptString",
      "description": "Enter your Postman API key"
    }
  ]
}
```

By default, this uses **Minimal** mode. To access **Full** mode, change the `url` value to `https://mcp.postman.com/mcp`. To access **Code** mode, change the value to `https://mcp.postman.com/code`.

For more information, see the [Copilot CLI documentation](https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli).

## Local server

The local server is based on STDIO transport and is hosted locally on an environment of your choice. STDIO is a lightweight solution that's ideal for integration with editors and tools like Visual Studio Code. Install an MCP-compatible VS Code extension, such as GitHub Copilot, Claude for VS Code, or other AI assistants that support MCP. The local server only supports API key authentication (with a Postman API key or Bearer token).

<Note>
  The local server only supports API key authentication (with a Postman API key or Bearer token).
</Note>

#### Use cases

Consider using the local Postman MCP server if:

- You want to power local use cases, such as local API testing.
- You have specific security and network requirements.
- You prefer to build the MCP server from the source code in this repo.

#### Supported configurations

The local server supports the following tool configurations:

- **Minimal** — (Default) Only includes essential tools for basic Postman operations.
- **Code** — Includes tools for searching public and internal API definitions and generating client code.
- **Full** — Includes all available Postman API tools (100+ tools). Use the `--full` flag to enable this configuration.

Use the `--region` flag to specify the Postman API region (`us` or `eu`), or set the `POSTMAN_API_BASE_URL` environment variable directly. By default, the server uses the `us` option.

<Note>
  To run the server as a Node application, install [Node.js](https://nodejs.org/) before getting started.
</Note>

### Install in Visual Studio Code

Click the button to install the local Postman MCP Server in VS Code:

<a href="https://insiders.vscode.dev/redirect/mcp/install?name=postman-api-mcp&inputs=%5B%7B%22id%22%3A%22postman-api-key%22%2C%22type%22%3A%22promptString%22%2C%22description%22%3A%22Enter%20your%20Postman%20API%20key%22%7D%5D&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22%40postman%2Fpostman-mcp-server%22%2C%22--full%22%5D%2C%22env%22%3A%7B%22POSTMAN_API_KEY%22%3A%22%24%7Binput%3Apostman-api-key%7D%22%7D%7D" target="_blank" rel="noopener noreferrer">
  <img alt="Install the local Postman MCP Server in VS Code" src="https://img.shields.io/badge/VS_Code-Install_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white" width="130px" />
</a>

By default, the server uses **Full** mode. To access **Minimal** mode, remove the `--full` flag from the `mcp.json` configuration file. To access **Code** mode, replace the `--full` flag with the `--code` flag.

#### Manual configuration

You can manually integrate your MCP server with Cursor or VS Code to use it with extensions that support MCP. To do this, create a `mcp.json` file in your project and add the following JSON block to it:

```json wordWrap
{
  "servers": {
    "postman": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "@postman/postman-mcp-server",
        "--full", // (optional) Use this flag to enable full mode...
        "--code", // (optional) ...or this flag to enable code mode.
        "--region us" // (optional) Use this flag to specify the Postman API region (us or eu). Defaults to us.
      ],
      "env": {
        "POSTMAN_API_KEY": "${input:postman-api-key}"
      }
    }
  },
  "inputs": [
    {
      "id": "postman-api-key",
      "type": "promptString",
      "description": "Enter your Postman API key"
    }
  ]
}
```

### Install in Cursor

Click the button to install the local Postman MCP Server in Cursor:

<a href="https://cursor.com/en/install-mcp?name=postman-api-mcp&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyJAcG9zdG1hbi9wb3N0bWFuLW1jcC1zZXJ2ZXIiLCItLWZ1bGwiXSwiZW52Ijp7IlBPU1RNQU5fQVBJX0tFWSI6IllPVVJfQVBJX0tFWSJ9fQ%3D%3D" target="_blank" rel="noopener noreferrer">
  <img alt="Install the local Postman MCP Server in Cursor" src="https://cursor.com/deeplink/mcp-install-dark.svg" width="130px" role="img" />
</a>

By default, the server uses **Full** mode. To access **Minimal** mode, remove the `--full` flag from the `mcp.json` configuration file. To access **Code** mode, replace the `--full` flag with the `--code` flag.

#### Manual installation

You can manually integrate your MCP server with VS Code to use it with extensions that support MCP. To do so, create a `.vscode/mcp.json` file in your project and add the following JSON block to it:

```json wordWrap
{
    "servers": {
        "postman-api-mcp": {
            "type": "stdio",
            "command": "npx",
            "args": [
                "@postman/postman-mcp-server",
                "--full" // (optional) Use this flag to enable full mode.
                "--code" // (optional) Use this flag to enable code mode.
                "--region us" // (optional) Use this flag to specify the Postman API region (us or eu). Defaults to us.
            ],
            "env": {
                "POSTMAN_API_KEY": "${input:postman-api-key}"
            }
        }
    },
    "inputs": [
        {
            "id": "postman-api-key",
            "type": "promptString",
            "description": "Enter your Postman API key"
        }
    ]
}
```

### Claude integration

To integrate the local Postman MCP Server with Claude, check the [latest Postman MCP server release](https://github.com/postmanlabs/postman-mcp-server/releases) and get the `.mcpb` file:

- **Minimal** — `postman-api-mcp-minimal.mcpb`
- **Code** — `postman-mcp-server-code.mcpb`
- **Full** — `postman-api-mcp-full.mcpb`

For more information, see the [Claude Desktop Extensions](https://www.anthropic.com/engineering/desktop-extensions) documentation.

### Install in Claude Code

To install the MCP server in Claude Code, run the following command in your terminal:

For **Minimal** mode:

```bash
claude mcp add postman --env POSTMAN_API_KEY=YOUR_KEY -- npx @postman/postman-mcp-server@latest
```

For **Code** mode:

```bash
claude mcp add postman --env POSTMAN_API_KEY=YOUR_KEY -- npx @postman/postman-mcp-server@latest --code
```

For **Full** mode:

```bash
claude mcp add postman --env POSTMAN_API_KEY=YOUR_KEY -- npx @postman/postman-mcp-server@latest --full
```

### Install in Codex

To install the local server, use the API key installation method. Set the `POSTMAN_API_KEY` environment variable and invoke the MCP server using `npx`.

For **Minimal** mode:

```bash
codex mcp add postman --env POSTMAN_API_KEY=<POSTMAN_API_KEY> -- npx @postman/postman-mcp-server --minimal
```

For **Code** mode:

```bash
codex mcp add postman --env POSTMAN_API_KEY=<POSTMAN_API_KEY> -- npx @postman/postman-mcp-server --code
```

For **Full** mode:

```bash
codex mcp add postman --env POSTMAN_API_KEY=<POSTMAN_API_KEY> -- npx @postman/postman-mcp-server --full
```

### Install in Windsurf

To manually install the MCP server in Windsurf, do the following:

1. Click **Open MCP Marketplace** in Windsurf.
2. Enter "Postman" in the search text box to filter the marketplace results.
3. Click **Install**.
4. When prompted, enter a valid Postman API key.
5. Select the tools that you want to enable, or click **All Tools** to select all available tools.
6. Turn on **Enabled** to enable the Postman MCP server.

#### Manual installation

Copy the following JSON config into the `.codeium/windsurf/mcp_config.json` file:

```json wordWrap
{
  "mcpServers": {
    "postman": {
      "args": ["@postman/postman-mcp-server"],
      "command": "npx",
      "disabled": false,
      "disabledTools": [],
      "env": {
        "POSTMAN_API_KEY": "<POSTMAN_API_KEY>"
      }
    }
  }
}
```

### Install in Antigravity

To install the MCP server in Antigravity, click **Manage MCP servers > View raw config**. Then, copy the following JSON config into the `.codeium/windsurf/mcp_config.json` file:

```json wordWrap
{
  "mcpServers": {
    "postman": {
      "args": ["@postman/postman-mcp-server"],
      "command": "npx",
      "disabled": false,
      "disabledTools": [],
      "env": {
        "POSTMAN_API_KEY": "XXXX"
      }
    }
  }
}
```

### Install in GitHub Copilot CLI

Use the Copilot CLI to interactively add the MCP server:

```bash
/mcp add
```

#### Manual installation

Copy the following JSON config into the `~/.copilot/mcp-config.json` file:

```json
{
  "mcpServers": {
    "postman": {
      "command": "npx",
      "args": ["@postman/postman-mcp-server"],
      "env": {
        "POSTMAN_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

### Use as a Gemini CLI extension

To install the MCP server as a Gemini CLI extension, run the following command in your terminal:

```bash
gemini extensions install https://github.com/postmanlabs/postman-mcp-server
```

### Install in Kiro

To set up the Postman MCP Server with one-click, go to the [Kiro Powers](https://kiro.dev/powers/) and click **API Testing with Postman**. Then, click **Add to Kiro**.

#### Manual installation

To manually install the Postman MCP Server in Kiro, do the following:

1. Launch the Kiro app, then click the Kiro ghost icon in the left navigation.
2. Add an MCP Server, then select **User Config** or **Workspace Config** to install the Postman MCP Server.
3. Add the following JSON block to the `mcp.json` configuration file:

   ```json wordWrap
   {
     "mcpServers": {
       "postman": {
         "command": "npx",
         "args": ["@postman/postman-mcp-server"],
         "env": {
           "POSTMAN_API_KEY": "postman-api-key"
         },
         "disabled": false,
         "autoApprove": ["getAuthenticatedUser"]
       }
     }
   }
   ```

### Install in Docker

To use the Postman MCP Server in Docker, you can use one of the following methods:

- To install the Postman MCP Server in Docker, see the [Postman MCP Server](https://hub.docker.com/mcp/server/postman/overview) at Docker MCP Hub. Click **+ Add to Docker Desktop** to automatically install it.

- To run the Postman MCP Server image in Docker, run the following command in your terminal. Docker automatically discovers, downloads, and runs the Postman MCP Server image:

  ```bash
  docker run -i -e POSTMAN_API_KEY="<your-secret-key>" mcp/postman
  ```

- To build and run the server in Docker manually, run the `docker build -t postman-api-mcp-stdio .` command. Then, run one of the following commands, replacing `$YOUR-POSTMAN-API-KEY` with your Postman API key:
  - **Minimal** - `docker run -i -e POSTMAN_API_KEY="<your-secret-key>" postman-api-mcp-stdio`
  - **Full** - `docker run -i -e POSTMAN_API_KEY="<your-secret-key>" postman-api-mcp-stdio --full`
