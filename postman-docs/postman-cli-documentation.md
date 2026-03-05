---
title: Explore Postman's command-line companion
approved: 2024-12-04T00:00:00.000Z
slug: docs/postman-cli/postman-cli-overview
max-toc-depth: 2
---

The Postman CLI is a secure command-line companion for Postman. It's signed and supported by Postman, like the Postman app. The Postman CLI supports the following features:

- [Sign in and sign out of Postman](/docs/postman-cli/postman-cli-options/#sign-in-and-out) from the command line.
- [Validate, synchronize, and push local collections and environments](/docs/postman-cli/postman-cli-options/#sync-local-elements-with-workspaces) to Postman workspaces in the cloud.
- [Run a collection](/docs/postman-cli/postman-cli-run-collection/) with its collection ID or path, and send the run results to the Postman cloud by default.
- [Run a monitor](/docs/postman-cli/postman-cli-run-monitor/) in the Postman cloud with its monitor ID.
- [Start a runner](/docs/postman-cli/postman-cli-run-monitor/) in your internal network to monitor APIs with private endpoints.
- [Start a mock server](/docs/postman-cli/postman-cli-options#run-mock-servers) to simulate API behavior for testing and development.
- [Run a performance test](/docs/postman-cli/postman-cli-options#postman-performance-run) with the specified collection ID.
- Generate a local collection run report with [built-in reporters](/docs/postman-cli/postman-cli-reporters/).
- [Check API definitions](/docs/postman-cli/postman-cli-options/#governance-and-security) against configured API governance and API security rules.

<Info class="iconless-callout">
  The Postman CLI requires a valid Postman API key. For more information, see [Generate and use Postman API keys](/docs/developer/postman-api/authentication/).
</Info>

<Tip>
  The Postman desktop app also supports a built-in terminal with [Native Git](/docs/agent-mode/native-git/).
</Tip>

## Comparing the Postman CLI and Newman

The table below shows a high-level comparison of the Postman CLI and [Newman](/docs/collections/using-newman-cli/command-line-integration-with-newman/).

| Postman CLI                                                                             | Newman                                                                                         |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Created by Postman                                                                      | Created by Postman                                                                             |
| Maintained and supported by Postman                                                     | Open source; supported by community contributions                                              |
| Supports collection runs                                                                | Supports collection runs                                                                       |
| Automatically sends collection run results to Postman by default                        | Supports ingesting run results to Postman using a reporter                                     |
| Package is signed by Postman                                                            | Package isn't signed by Postman                                                                |
| Distributed as a downloadable package                                                   | Distributed on npm                                                                             |
| Downloadable programmatically                                                           | Downloadable programmatically                                                                  |
| Not available as a library                                                              | Available as a library                                                                         |
| Supports sign in and sign out                                                           | Doesn't support sign in and sign out                                                           |
| Checks API specifications against your configured API governance and API security rules | Doesn't check API specifications against your configured API governance and API security rules |

## Decide which command-line companion to use

You can use the Postman CLI or Newman to run and test collections from the command line. One may be a better fit, depending on your use case or preferences.

For example, assume you already manage your own security for open-source software, and you want to run collections from a script. Also assume you want visibility into any software you build into your CI/CD pipeline. Newman would be a good fit for this use case because Newman's repository is public and Newman isn't signed or secured by Postman.

Here's another example. Assume you don't already support or secure any open-source software, and you want the software you use to be signed and secured by its developer. The Postman CLI would be a good fit for this use case because the Postman CLI is signed and secured by Postman.

<Info class="iconless-callout">
  Learn how to [install the Postman CLI](/docs/postman-cli/postman-cli-installation/).
</Info>

## About the Postman CLI and Postman API usage

Some Postman CLI commands use the [Postman API](/docs/developer/postman-api/intro-api/) to fetch data from and send data to Postman's servers. These commands count toward your monthly [Postman API usage](/docs/billing/resource-usage/#postman-api-usage). The number of Postman API calls you can make each month depends on your [Postman plan](https://www.postman.com/pricing/).

The following Postman CLI commands make calls to the Postman API and count toward your Postman API usage:

- `postman login` - Uses one call to authenticate a user with a Postman API key.
- `postman collection run` - Uses one call to fetch a collection by ID, one call to fetch an environment (if any), and one call to send data back to Postman.
- `postman monitor run` - Uses one call to fetch a monitor by ID, one call to start a monitor run, and multiple calls that poll Postman for the run's completion.
- `postman spec lint` - Uses one call to fetch the API governance rules and one call to send a report back to Postman.
- `postman api lint` - Uses one call to fetch the API governance and security rules and one call to send a report back to Postman.

<Info class="iconless-callout">
  Learn more about [Postman CLI command options](/docs/postman-cli/postman-cli-options/).
</Info>

---

title: Install the Postman CLI
approved: 2025-12-12T00:00:00.000Z
topictype: procedure
slug: docs/postman-cli/postman-cli-installation
max-toc-depth: 2
ux: v12

---

Install the [Postman CLI](/docs/postman-cli/postman-cli-overview/) by following the instructions for your operating system below.

<Note title="Note">
  The Postman CLI supports the same system requirements as the Postman desktop app. For a complete list of requirements, see [Install and update Postman](/docs/getting-started/installation/installation-and-updates/).
</Note>

{/_ vale postman-style-guide.Headings = NO _/}

## npm installation for Windows, macOS, and Linux

If you have Node.js and npm installed on your system, you can run the following command. This will download and install the Postman CLI binary, making the `postman` command available in your terminal.

```bash
npm install -g postman-cli
```

<Info class="iconless-callout">
  Alternatively, you can also install the Postman CLI binary with a script specific to [Windows](#windows-installation). You can also use [curl to install the Postman CLI binary](#macos-linux-and-windows-subsystem-for-linux-wsl-installation) on systems running macOS, Linux, or Windows Subsystem for Linux (WSL).
</Info>

{/\* \*/}

<Info class="iconless-callout">
  Linux support excludes Alpine Linux distributions due to libc compatibility requirements.
</Info>

## Windows installation

Run the following command to install the Postman CLI for Windows. This will download and run an install script. The script creates a `%USERPROFILE%\AppData\Local\Microsoft\WindowsApps` directory if it doesn't exist yet, then installs the `postman` binary there.

```powershell
powershell.exe -NoProfile -InputFormat None -ExecutionPolicy AllSigned -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://dl-cli.pstmn.io/install/win64.ps1'))"
```

## macOS, Linux, and Windows Subsystem for Linux (WSL) installation

{/_ vale postman-style-guide.Headings = YES _/}

Run the following command to install the Postman CLI on systems running macOS, Linux, or Windows Subsystem for Linux (WSL). This will download and run a unified install script that detects your OS and architecture. The install script creates a `/usr/local/bin` directory if it doesn't exist yet, then installs the `postman` binary there.

```bash
curl -o- "https://dl-cli.pstmn.io/install/unix.sh" | sh
```

## Update your Postman CLI installation

To update your Postman CLI installation to the latest version, run the same command you used to install it. The new version will overwrite the earlier version. For details about the latest changes and features, see the [Postman CLI release notes](https://www.postman.com/release-notes/postman-cli/).

## Uninstall Postman CLI

If you installed the Postman CLI with npm, you can uninstall it with the following command:

```bash
npm uninstall -g postman-cli
```

If you installed the Postman CLI with any method other than npm, you can uninstall it by deleting the `postman` binary. For Windows systems, the binary is in `%USERPROFILE%\AppData\Local\Microsoft\WindowsApps` by default. For macOS, Linux, and WLS systems, the binary is in `/usr/local/bin` by default.

## Troubleshooting

If you’ve installed the Postman CLI using both npm and the curl-based script, your system may have two copies of the binary. Which binary is active depends on the order of directories in your `PATH` environment variable.

To check which binary is active, do the following:

1. Run one of the following commands, depending on your system:
   - For macOS, Linux, or WSL, run `which postman`.

   - For Windows, run `where postman`.

2. Run `postman --version`.

If you have two copies of the binary in your `PATH` environment variable, you can resolve the conflict by [uninstalling](#uninstall-postman-cli) one of the binaries.

---

title: Postman CLI command options
approved: 2024-12-04T00:00:00.000Z
topictype: reference
slug: docs/postman-cli/postman-cli-options
max-toc-depth: 2
ux: v12

---

<Info class="iconless-callout">
  Availability of some Postman CLI commands depend on your [Postman plan](https://www.postman.com/pricing/).
</Info>

This topic covers the commands and options supported by the [Postman CLI](/docs/postman-cli/postman-cli-overview/).

## Basic command line options

### `postman`

The base command of the Postman CLI is `postman`. Run this command with the syntax and options detailed below.

#### Options

| Option            | Details                                                     |
| :---------------- | :---------------------------------------------------------- |
| `--help`, `-h`    | Returns information about Postman CLI commands and options. |
| `--version`, `-v` | Returns the version number for the Postman CLI.             |

<Tip title="Tip">
  You can run the `man postman` command to return a manual page with the Postman CLI commands and options.
</Tip>

#### Example

```plaintext
postman -v
```

## Sign in and out

You can use the Postman CLI to sign in and out of Postman with the [`login`](#postman-login) and [`logout`](#postman-logout) commands.

<Note>
  If you're using the Postman CLI from a network with outbound restrictions, you must [allowlist specific domains](/docs/getting-started/installation/installation-and-updates/#use-postman-behind-a-firewall) to connect to Postman.
</Note>

### `postman login`

The `login` command prompts you to securely sign in and authenticate from the browser. Signing in is required once per session.

If you purchased a [Postman EU Data Residency plan](/docs/administration/enterprise/about-eu-data-residency/), the `login` command also requires the `--region` option. Use this option with the argument `eu` to specify that your instance of Postman is hosted in the EU region.

You can also use the `--with-api-key` option to authenticate using your [Postman API key](/docs/developer/postman-api/authentication/#generate-a-postman-api-key). This method is recommended when using the Postman CLI from your CI/CD pipeline, but you can also use this method from your local machine.

You remain signed in until you use the `logout` command or your Postman credentials or API key expire.

{/_TODO: behavior if you log in a second time, how you create an alias, etc. _/}

#### Options

| Option                     | Details                                                                         |
| :------------------------- | :------------------------------------------------------------------------------ |
| `--with-api-key <api-key>` | Authenticate the user with the given API key.                                   |
| `--region <region>`        | Specify that your instance of Postman is hosted in the EU region. Accepts `eu`. |

#### Examples

```plaintext
postman login

postman login --with-api-key ABCD-1234-1234-1234-1234-1234

postman login --with-api-key ABCD-1234-1234-1234-1234-1234 --region eu
```

### `postman logout`

This command signs you out of Postman and deletes the stored API key.

{/_TODO: alias behavior _/}

#### Example

```plaintext
postman logout
```

## Sync local elements with workspaces

The Postman CLI includes workspace commands to validate, synchronize, and push local collections and environments to Postman workspaces in the cloud. Add the commands to your CI/CD script to automate these tasks during the deployment process. Learn more about [adding workspace commands to your CI/CD pipeline](/docs/agent-mode/native-git#add-a-github-workflow-to-publish-to-postman-cloud).

### `postman workspace prepare`

This command validates and prepares local collections and environments for pushing to a Postman workspace. It checks for valid UUIDs, regenerates IDs if needed, and ensures all items and responses have proper IDs.

#### Options

| Option                      | Details                                                                    |
| :-------------------------- | :------------------------------------------------------------------------- |
| `--collections-dir <path>`  | Path to the collections directory. The default is `postman/collections`.   |
| `--environments-dir <path>` | Path to the environments directory. The default is `postman/environments`. |

#### Configuration

The command expects a `.postman/resources.yaml` file in your working directory.

Collection and environment paths can be relative (resolved from `.postman/`) or absolute. Only valid JSON files are processed. Invalid paths like empty strings and non-JSON files are automatically filtered with warnings.

#### Example

```plaintext
postman workspace prepare
```

### `postman workspace push`

This command pushes local collection and environment changes to your Postman workspace. It synchronizes your local files with the workspace in the Postman cloud, performing create, update, and delete operations as needed.

#### Options

| Option                      | Details                                                                    |
| :-------------------------- | :------------------------------------------------------------------------- |
| `--collections-dir <path>`  | Path to the collections directory. The default is `postman/collections`.   |
| `--environments-dir <path>` | Path to the environments directory. The default is `postman/environments`. |
| `--no-prepare`              | Skip the prepare step before pushing.                                      |
| `-y, --yes`                 | Skip all confirmation prompts.                                             |

#### Workflow

1. **Validate** - Checks if the collections and environments exist globally and in the target workspace.
2. **Prepare** (unless `--no-prepare`) - Runs prepare automatically if invalid or missing IDs are detected.
3. **Sync** - Creates, updates, or deletes entities to match your local state.
4. **Update Local Files** - After successful creation, updates local files with server-returned IDs.

#### Configuration

The command expects a `.postman/resources.yaml` file in your working directory.

If the `resources.yaml` file contains collection or environment paths, those specific files are used instead of directory scanning.

#### Example push with automatic prepare and interactive prompts

```plaintext
postman workspace push
```

#### Example push without the prepare step

```plaintext
postman workspace push --no-prepare
```

#### Example automatic push without prompts (useful for CI/CD)

```plaintext
postman workspace push --yes
```

## Run collections

You can run your collections with HTTP requests using the `postman collection run` command. With a paid plan, you can also run collections with gRPC and GraphQL requests.

### `postman collection run`

This command runs a collection and sends the run results to the Postman cloud. You can specify the collection with its file path or Collection ID.

<Tip title="Tip">
  You can find the collection ID in Postman. Click the <img alt="Items icon" src="https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon" width="20px" /> Items tab, click **Collections** in the sidebar, and select a collection. Then click the <img alt="Info icon" src="https://assets.postman.com/postman-docs/aether-icons/state-info-stroke.svg#icon" width="16px" /> **Info** tab in the right sidebar to view or copy the collection ID.
</Tip>

#### Options

| Option                                                                 | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :--------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--bail [optional modifiers]`                                          | Specifies whether to stop a collection run on encountering the first error. `--bail` can optionally accept two modifiers: `--folder` and `--failure`. `--folder` skips the entire collection run if there are any errors. If a test fails, `--failure` stops the collection run after completing the current script.                                                                                                                                                                                                                                                    |
| `--color [value]`                                                      | Controls colors in the CLI output. Accepts `on`, `off`, and `auto`. The default is `auto`. With `auto`, the Postman CLI attempts to automatically turn color on or off based on the color support in the terminal. This behavior can be changed by using the `on` or `off` value.                                                                                                                                                                                                                                                                                       |
| `--cookie-jar [path]`                                                  | Specifies the file path for a `JSON` cookie jar. This uses the `tough-cookie` library to deserialize the file.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `--delay-request [number]`                                             | Specifies a delay (in milliseconds) between requests. The default is 0.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `--disable-unicode`                                                    | Replaces all symbols in the output with their plain text equivalents.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `--environment [UID] or [file-path]`, `-e`                             | Specifies an environment file path or UID.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `--env-var "[environment-variable-name]=[environment-variable-value]"` | Specifies environment variables in a `key=value` format. Multiple CLI environment variables can be added by using `--env-var` multiple times, for example: `--env-var "this=that" --env-var "alpha=beta"`.                                                                                                                                                                                                                                                                                                                                                              |
| `--export-cookie-jar [path]`                                           | Specifies the path where the Postman CLI will output the final cookie jar file after completing a run. This uses the `tough-cookie` library to serialize the file.                                                                                                                                                                                                                                                                                                                                                                                                      |
| `--global-var "[global-variable-name]=[global-variable-value]"`        | Specifies global variables in a `key=value` format. Multiple CLI global variables can be added by using `--global-var` multiple times, for example: `--global-var "this=that" --global-var "alpha=beta"`.                                                                                                                                                                                                                                                                                                                                                               |
| `--globals [file-path]`, `-g`                                          | Specifies a path to a file containing global variables. Global variables are similar to environment variables but have lower precedence and can be overridden by environment variables having the same name.                                                                                                                                                                                                                                                                                                                                                            |
| `--integration-id [ID]`                                                | Specifies an integration ID when using an integration with CI/CD. This sends the Postman CLI results to the correct integration in Postman. When you generate the Postman CLI command for a Git integrated API collection, the integration ID is automatically added to the command. To learn how to generate the Postman CLI command with the integration ID, go to [Configure the Postman CLI for CI](/docs/integrations/ci-integrations/#configure-the-postman-cli-for-ci).                                                                                          |
| `--iteration-count [number]`, `-n`                                     | Specifies the number of times the collection will run when used in conjunction with the iteration data file.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `--iteration-data [file-path]`, `-d`                                   | Specifies the local file path to a data file (JSON or CSV) to use for each iteration.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `-i [requestUID] or [folderUID]`                                       | Runs only the specified folder UID or request UID from the collection. Multiple items can be run in order by specifying `-i` multiple times, for example: `postman collection run collectionUID -i folder1UID -i folder2UID`.                                                                                                                                                                                                                                                                                                                                           |
| `-i [requestName] or [folderName]`                                     | Runs only the specified folder name or request name from the collection. If there are duplicate names, the Postman CLI runs the folder or request that appears first.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `--ignore-redirects`                                                   | Prevents the Postman CLI from automatically following 3XX redirect responses.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `--insecure`, `-k`                                                     | Turns off SSL verification checks and enables self-signed SSL certificates.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `--mock [file-path]`                                                   | Specifies the path to a mock server configuration file. This starts a mock server using the specified configuration, runs the collection against the mock server, and then stops the mock server. Make sure you also have a JavaScript file with an HTTP server that sets the request and example response for simulating real API behavior. Use this option in your CI/CD script to run a collection against a mock server during your deployment process. Learn how to [create a mock server in your Git repository](/docs/design-apis/mock-apis/local-mock-servers). |
| `--no-insecure-file-read`                                              | Prevents reading of files situated outside of the working directory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `--silent`                                                             | Turns off terminal output.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `--ssl-client-cert-list <path>`                                        | Specifies the path to a client certificates configuration (JSON).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `--ssl-client-cert <path>`                                             | Specifies the path to a client certificate (PEM).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `--ssl-client-key <path>`                                              | Specifies the path to a client certificate private key.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `--ssl-client-passphrase <passphrase>`                                 | Specifies the client certificate passphrase (for a protected key).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `--ssl-extra-ca-certs <path>`                                          | Specifies more trusted CA certificates (PEM).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `--suppress-exit-code`, `-x`                                           | Specifies whether to override the default exit code for the current run.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `--timeout [number]`                                                   | Specifies the time (in milliseconds) to wait for the entire collection run to complete.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `--timeout-request [number]`                                           | Specifies a time (in milliseconds) to wait for requests to return a response. The default is 0.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `--timeout-script [number]`                                            | Specifies the time (in milliseconds) to wait for scripts to complete. The default is 0.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `--verbose`                                                            | Shows detailed information for the collection run and each request sent.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `--working-dir [path]`                                                 | Sets the path of the working directory to use while reading files with relative paths. This defaults to the current directory.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `--reporters [reporter], -r [reporter]`                                | Generates a local report for the collection run in the specified format: `cli`, `json`, `junit`, and `html`. If the `--reporters` option isn't specified, the `cli` report is output by default. Only the `cli` report output is supported for collections with HTTP, gRPC, and GraphQL requests. To learn more, go to [Generate collection run reports using the Postman CLI](/docs/postman-cli/postman-cli-reporters/).                                                                                                                                               |

#### Examples

```plaintext
postman collection run /myCollectionFolderName/myCollectionFile.json

postman collection run 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12
```

## Run requests

You can test and debug HTTP requests from the command line with the `postman request` command.

### `postman request`

Use this command to test and debug HTTP requests from the command line with the Postman CLI. Use many of Postman's features for sending requests, including authentication, environment variables, test assertions, and more. The command accepts the request's method (GET, POST, PUT, DELETE, PATCH, HEAD, or OPTIONS) as the first argument, defaulting to GET if a method isn't provided. The command accepts the target URL as the second argument.

<Tip title="Tip">
  In Postman, you can also [convert an API request into a Postman CLI code snippet](/docs/sending-requests/create-requests/generate-code-snippets/). Copy the generated code snippet, add options to help you test your request, then send the request with the Postman CLI.
</Tip>

#### Options

| Option                                      | Details                                                                                                                                                                                                                                                                                                                                           |
| :------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--auth-[type]-[parameter] [value]`         | Specifies the authentication type and parameters. Supports the following authentication types: `basic`, `bearer`, `digest`, `oauth1`, `oauth2`, `hawk`, `aws`, `ntlm`, and `apikey`. For example: `--auth-basic-username user --auth-basic-password pass` or `--auth-apikey-key "X-API-Key" --auth-apikey-value "abc123" --auth-apikey-in header` |
| `--body [body]`, `-d`                       | Specifies request body content. Supports inline string or `@filepath` syntax for files. For example: `--body '{"name": "John"}'` or `--body @data.json`                                                                                                                                                                                           |
| `--debug`                                   | Shows detailed information in debug mode, including retry attempts, redirects, and timing breakdowns.                                                                                                                                                                                                                                             |
| `--environment [UUID] or [file-path]`, `-e` | Specifies an environment file path or UUID. Resolves variables in the URL, headers, and body.                                                                                                                                                                                                                                                     |
| `--form [field]`, `-f`                      | Specifies multipart/form-data in `key=value` format. Use `@filepath` syntax for files. Can be used multiple times. For example: `-f "name=John"` or `-f "avatar=@photo.jpg"`                                                                                                                                                                      |
| `--header [header]`, `-H`                   | Specifies a header in `key-value` format. Can be used multiple times. For example: `-H Content-Type:application/json`                                                                                                                                                                                                                             |
| `--output [path]`, `-o`                     | Saves the complete response to a JSON file, including status, headers, body, and more. Use for debugging or further processing.                                                                                                                                                                                                                   |
| `--response-only`                           | Suppresses all output except the response body. This is useful for piping to other commands.                                                                                                                                                                                                                                                      |
| `--redirects-follow-method`                 | Preserves the original HTTP method when 3xx redirect responses. Redirects are followed with the GET method by default.                                                                                                                                                                                                                            |
| `--redirects-ignore`                        | Prevents the Postman CLI from automatically following 3xx redirect responses. Redirects are followed by default.                                                                                                                                                                                                                                  |
| `--redirects-max [number]`                  | Specifies the maximum number of 3xx redirect responses to follow. There is no limit by default. Useful for preventing redirect loops.                                                                                                                                                                                                             |
| `--redirects-remove-referrer`               | Removes the Referer header when following 3xx redirect responses. The Referer header is sent with redirects by default.                                                                                                                                                                                                                           |
| `--retry [number]`                          | Specifies the number of retry attempts for failed requests, like a 400 Bad Request code. Useful for unreliable endpoints or rate limited APIs. The default is 0.                                                                                                                                                                                  |
| `--retry-delay [number]`                    | Specifies the time (in milliseconds) to wait to retry the request. The default is 1000.                                                                                                                                                                                                                                                           |
| `--script-post-request [script]`            | Adds JavaScript that runs after the request runs. Supports inline JavaScript or `@filepath` syntax for files. Learn more about writing [post-response scripts](/docs/tests-and-scripts/write-scripts/test-scripts/). For example: `--script-post-request "console.log(pm.response.json());"`                                                      |
| `--script-pre-request [script]`             | Adds JavaScript that runs before the request runs. Supports inline JavaScript or `@filepath` syntax for files. Learn more about writing [pre-request scripts](/docs/tests-and-scripts/write-scripts/pre-request-scripts/). For example: `--script-pre-request "pm.environment.set('timestamp', Date.now());"`                                     |
| `--timeout [number]`                        | Specifies the time (in milliseconds) to wait for the request to complete. The default is 300000.                                                                                                                                                                                                                                                  |
| `--verbose`                                 | Shows detailed information for the request and response, including headers, body, and metadata.                                                                                                                                                                                                                                                   |

#### Examples

```plaintext
postman request GET https://api.example.com/users

postman request POST https://api.example.com/users \
    --body '{"name": "John", "email": "john@example.com"}'

postman request https://api.example.com/data \
    --auth-apikey-key "apikey" \
    --auth-apikey-value "abc123xyz" \
    --auth-apikey-in query
```

## Run monitors

You can use the `postman monitor run` command to trigger monitor runs within your CI/CD pipeline. You can also use the `postman runner start` command to run your organization's APIs from your internal network.

### `postman monitor run`

This command runs a monitor in the Postman cloud. Add the command into your CI/CD script to trigger a monitor run during your deployment process. Then your team can use your Postman tests to catch regressions and configuration issues. Learn more at [Run a monitor using the Postman CLI](/docs/postman-cli/postman-cli-run-monitor/).

The command also invokes the monitor and polls Postman for the run's completion, returning the monitor results. Specify the monitor with its monitor ID.

<Tip title="Tip">
  You can find the monitor ID in Postman. Click the <img alt="Services icon" src="https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-services-stroke.svg#icon" width="20px" /> Services tab, click **Monitors** in the sidebar, and select a monitor. Then click the <img alt="Info icon" src="https://assets.postman.com/postman-docs/aether-icons/state-info-stroke.svg#icon" width="16px" /> **Monitor details** tab in the right sidebar to view or copy the monitor ID.
</Tip>

#### Options

| Option                       | Details                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------- |
| `--timeout <number>`         | Specifies the time (in milliseconds) to wait for the entire run to complete. |
| `--suppress-exit-code`, `-x` | Specifies whether to override the default exit code for the current run.     |

#### Example

```plaintext
postman monitor run 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12
```

### `postman runner start`

<Note>
  Private API Monitoring is available on [Postman Enterprise plans](https://www.postman.com/pricing/).
</Note>

With [Private API Monitoring](/docs/monitoring-your-api/runners/overview/), you can use runners to monitor and test your organization's APIs from your internal network, without publicly exposing your endpoints.

Run this command to start a runner from your internal network that regularly polls Postman for upcoming monitor runs. The collection's tests run in your internal network. Then the test results are sent back to the Postman cloud, making them available in the monitor results. Provide the runner ID and key from the command you copied when you created the runner. Learn more about [setting up a runner in your internal network](/docs/monitoring-your-api/runners/set-up-a-runner-in-your-network/).

Optionally, you can configure the runner to route HTTP and HTTPS traffic through a proxy server that enforces outbound request policies. You can use the `--proxy` option to provide the URL for the proxy server used by your organization. Or you can use the `--egress-proxy` option to enable the built-in proxy and use the `--egress-proxy-authz-url` option to provide the URL for the runner authorization service that evaluates outbound request policies. Learn more about [configuring a runner to use a proxy server](/docs/monitoring-your-api/runners/proxy-server/overview/).

<Note>
  You can't use the `--proxy` and `--egress-proxy` options together.
</Note>

If the runner is running in the background, stop the runner using your system's process control. You can also press **Control+C** or **Ctrl+C** to stop the runner.

#### Options

| Option                           | Details                                                                                                                                                                                                           |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--id <runner-id>`               | Specifies the runner ID.                                                                                                                                                                                          |
| `--key <runner-key>`             | Specifies the runner key that authenticates your runner with the Postman cloud.                                                                                                                                   |
| `--egress-proxy`                 | Runs the runner with the built-in proxy enabled. This option requires `--egress-proxy-authz-url`.                                                                                                                 |
| `--egress-proxy-authz-url <url>` | Specifies a custom runner authorization service URL. Instead of specifying this option, you can define the URL using the `POSTMAN_RUNNER_AUTHZ_URL` environment variable. This is required with `--egress-proxy`. |
| `--metrics`                      | Runs a metrics server available at the `/health/live` endpoint. Useful for health checks in orchestration environments, like Kubernetes.                                                                          |
| `--metrics-port <port>`          | Specifies a port number where the metrics server can expose health checks and metrics. Default is `9090`.                                                                                                         |
| `--proxy <url>`                  | Specifies your organization's proxy URL. Instead of specifying this option, you can define the URL using the `HTTP_PROXY` and `HTTPS_PROXY` environment variables.                                                |
| `--ssl-extra-ca-certs <path>`    | Specifies the path to the file with one or more trusted CA certificates in PEM format. Used for custom SSL certificate validation.                                                                                |

#### Examples

```plaintext
postman runner start --id 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12 --key 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12

postman runner start --id 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12 --key 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12 --proxy http://example.com:8080

postman runner start --id 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12 --key 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12 --egress-proxy --egress-proxy-authz-url http://authz.example.com

postman runner start --id 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12 --key 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12 --metrics --metrics-port 12044 --ssl-extra-ca-certs /path/to/certs.pem
```

## Run flows

<Note title="Note">
  The `postman flows run` command is available with [Postman Enterprise plans](https://www.postman.com/pricing/).
</Note>

You can use the `postman flows run` command to run local flows without exposing private APIs and sensitive data to the Postman cloud. The `postman flows run` command has options to set [input values](/docs/postman-flows/build-flows/configure/scenarios/#start-block-inputs), show [run log](/docs/postman-flows/build-flows/troubleshoot/troubleshoot/#run-logs) information, and use values from a [scenario](/docs/postman-flows/build-flows/configure/scenarios/).

### `postman flows run`

Run a single flow from your local repo. Successful runs return status and output.

#### Options

| Option                          | Details                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `-x, --suppress-exit-code`      | Specify whether or not to override the default exit code for the current run.                                 |
| `--verbose`                     | Show detailed information about the flow run and each request (method, URL, assertions).                      |
| `--input <key=value/path.json>` | Set flow inputs with key=value pairs and/or paths to JSON files.                                              |
| `--input-file <path.json>`      | Set flow inputs from JSON files.                                                                              |
| `--scenario <name>`             | Reference a pre-built scenario as flow inputs by its name. Can be combined with `--input` to override values. |
| `-h, --help`                    | Display help for the command.                                                                                 |

#### Examples

```plaintext
postman flows run ./postman/flows/<flow-filename>.json

postman flows run ./postman/flows/<flow-filename>.json --input <input name>=<value>

postman flows run ./postman/flows/<flow-filename>.json --input path/to/<input-filename>.json

postman flows run ./postman/flows/<flow-filename>.json --scenario "<scenario name>"

postman flows run ./postman/flows/<flow-filename>.json --scenario "<scenario name>" --input <input name>=<value>
```

## Run performance tests

You can use the `postman performance run` command to configure and run performance tests for collections within your CI/CD pipeline.

### `postman performance run`

This command runs a performance test for a specified collection in the Postman cloud. Add the command into your CI/CD script to run a performance test during your deployment process. Then your team can use your Postman tests to catch performance issues. Learn more at [Run a performance test using the Postman CLI](/docs/postman-cli/postman-cli-run-performance-test/).

The command runs the performance test against the specified collection, returning the performance test results in Postman. Specify the collection with its ID.

#### Options

| Option                           | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--data-file [path]`             | Specifies the path to a data file with custom values to use for each virtual user. The file must be in CSV or JSON format. Learn more about [using a data file to simulate virtual users](/docs/collections/performance-testing/performance-test-data-files/).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `--duration [minutes]`, `-d`     | The duration of the performance test in minutes. Default is 10.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `--environment [ID]`, `-e`       | Specifies an environment by its ID. Variables in the collection are resolved from the environment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `--globals [ID]`, `-g`           | Specifies globals by its ID. Variables in the collection are resolved from globals.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `--load-profile [profile]`, `-p` | <p>The load profile type to use for the performance test. Accepts `fixed`, `ramp-up`, `spike`, or `peak`. The default is `ramp-up`.</p><ul><li>With `fixed`, the number of virtual users is constant during the performance test.</li><li>With `ramp-up`, the number of virtual users gradually increases from 25% to 100%, and then maintains at 100%.</li><li>With `spike`, the number of virtual users starts at 10%, spikes to 100%, then drops back down to 10%.</li><li>With `peak`, the number of virtual users gradually increases from 20% to 100%, maintains at 100%, then gradually decreases back down to 20%.</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `--pass-if [condition]`          | <p>Specifies a condition that determines whether the performance test passes or fails. The condition must be in the `function(metric, value)` format.</p><p>**Functions:**</p><ul><li>`less_than(metric, value)` - The test passes if the metric is less than the value.</li><li>`less_than_eq(metric, value)` - The test passes if the metric is less than or equal to the value.</li><li>`greater_than(metric, value)` - The test passes if the metric is greater than the value.</li><li>`greater_than_eq(metric, value)` - The test passes if the metric is greater than or equal to the value.</li></ul><p>**Metrics:**</p><ul><li>`avg` - The response time of all requests averaged together, in milliseconds.</li><li>`p90` - The 90th percentile of response times, in milliseconds.</li><li>`p95` - The 95th percentile of response times, in milliseconds.</li><li>`p99` - The 99th percentile of response times, in milliseconds.</li><li>`error_rate` - The percentage of requests with an error. Errors indicate runtime issues such as timeouts, connection or TLS failures, or uncaught exceptions in user scripts.</li><li>`rps` - The number of requests sent per second.</li></ul><p>**Examples:**</p><ul><li>`--pass-if "less_than(p95, 500)"` - The test passes if the 95th percentile of response times is less than 500 milliseconds.</li><li>`--pass-if "less_than_eq(error_rate, 5)"` - The test passes if the percentage of requests with an error is less than or equal to 5%.</li></ul> |
| `--vu-count [number]`            | The number of peak virtual users that simulate traffic to your API. The default is 20.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

#### Examples

```plaintext
postman performance run 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12

postman performance run 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12 \
  --vu-count 100 \
  --duration 30

postman performance run 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12 \
  --vu-count 100 \
  --duration 20 \
  --load-profile spike \
  --pass-if "less_than(p95, 800)"
```

## Run mock servers

You can use the `postman mock run` command to start a mock server from a configuration file.

<Note>
  To run a collection against a mock server, use the `--mock` option with the [`postman collection run` command](#postman-collection-run).
</Note>

### `postman mock run`

This command starts a mock server from a configuration file in JSON format. With the configuration file, you can configure details like the mock server's port number, name, script, and more. The mock server runs on the specified port until you stop it. Make sure you also have a JavaScript file with an HTTP server that sets the request and example response for simulating real API behavior.

Add the command to your CI/CD script to start a mock server as a dependency for your application or test suite. Once running, your service or external tests can send requests to it as if it were a real API. This enables you to simulate API behavior for testing and development.

Learn how to [create a mock server in your Git repository](/docs/design-apis/mock-apis/local-mock-servers).

#### Example

```plaintext
postman mock run mock-config.json
```

## Governance and security

API governance is the practice of applying a defined set of standards consistently across the API design and testing phases of your development process. The Postman CLI includes commands that checks your API specifications in [Spec Hub](#postman-spec-lint) and the [Postman API Builder](#postman-api-lint) against your team's configured [Postman API governance and security rules](/docs/api-governance/api-governance-overview/).

### `postman spec lint`

This command runs syntax validation and governance rule checks against a single- or multi-file API specification in [Spec Hub](/docs/design-apis/specifications/overview/). Provide the local file path or ID for a specification that's in OpenAPI 2.0, 3.0, or 3.1 format. If you're providing the local file path for a multi-file specification, provide the path to the [root file](/docs/design-apis/specifications/add-files-to-a-specification/#about-multi-file-specifications).

By default, if you provide a local file path for a specification, the command runs syntax validation and governance checks using the **All workspaces** governance group. Use the `--workspace-id` option to run governance checks using the rules from a specific workspace.

<Tip title="Tip">
  You can find the specification ID in Postman. Click <img alt="Items icon" src="https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon" width="20px" /> Items tab, click **Specs** in the sidebar, and select a specification. Then click the <img alt="Info icon" src="https://assets.postman.com/postman-docs/aether-icons/state-info-stroke.svg#icon" width="16px" /> **Specification Info** tab in the right sidebar to view or copy the specification ID.
</Tip>

#### Options

| Option                             | Details                                                                                                                                                                                                                                                                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--fail-severity [severity]`, `-f` | Triggers an exit failure code for rule violations at or higher than the specified severity level. The options, in order of lowest to highest severity, are `HINT`, `INFO`, `WARNING`, and `ERROR` (default).                                                                                                                                     |
| `--output [output format]`, `-o`   | Controls the output format for issues found in the OpenAPI specification. Accepts `JSON` or `CSV`. Defaults to table view if no output format is specified. See [examples of JSON and CSV output](#example-output).                                                                                                                              |
| `--workspace-id [workspace-id]`    | Run syntax validation and governance rule checks using the rules from a particular workspace by providing its ID. You can use this option if you provide the local file path for a specification. Learn how to [get a workspace's ID](/docs/collaborating-in-postman/using-workspaces/internal-workspaces/use-workspaces/#get-the-workspace-id). |

#### Example

```plaintext
postman spec lint openapi.yaml --workspace-id 987654321-54321ef-4321-1ab2-1ab2-ab1234112a12
postman spec lint 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12
```

#### Example output

You can change the output of governance rule violations to JSON or CSV. If you don't specify an output, it defaults to table view.

The following is an example of the output in table format (default):

![Example output](https://assets.postman.com/postman-docs/v11/postman-cli-spec-lint-table-v11-74-2.png)

The following is an example of the output in JSON format:

```json
{
  "violations": [
    {
      "file": "../../../Desktop/test-collections/spacecraft-api/src/main/resources/openapi.yaml",
      "line number": "13",
      "path": "paths./spacecrafts/{spacecraftIds}.parameters.0",
      "severity": "WARNING",
      "issue": "Parameter \"spacecraftId\" must be used in path \"/spacecrafts/{spacecraftIds}\".",
      "issue type": "Syntax"
    },
    {
      "file": "../../../Desktop/test-collections/spacecraft-api/src/main/resources/openapi.yaml",
      "line number": "19",
      "path": "paths./spacecrafts/{spacecraftIds}.get",
      "severity": "WARNING",
      "issue": "Operation must define parameter \"{spacecraftIds}\" as expected by path \"/spacecrafts/{spacecraftIds}\".",
      "issue type": "Syntax"
    },
    {
      "file": "../../../Desktop/test-collections/spacecraft-api/src/main/resources/openapi.yaml",
      "line number": "4",
      "path": "info",
      "severity": "WARNING",
      "issue": "The info object should have a description.",
      "issue type": "Governance"
    },
    {
      "file": "../../../Desktop/test-collections/spacecraft-api/src/main/resources/openapi.yaml",
      "line number": "21",
      "path": "paths./spacecrafts/{spacecraftIds}.get.responses",
      "severity": "WARNING",
      "issue": "Operation should return a 5xx HTTP status code",
      "issue type": "Governance"
    }
  ]
}
```

The following is an example of the output in CSV format:

```csv
file,line number,path,severity,issue,issue type
../../../Desktop/test-collections/spacecraft-api/src/main/resources/openapi.yaml,13,paths./spacecrafts/{spacecraftIds}.parameters.0,WARNING,"Parameter ""spacecraftId"" must be used in path ""/spacecrafts/{spacecraftIds}"".",Syntax
../../../Desktop/test-collections/spacecraft-api/src/main/resources/openapi.yaml,19,paths./spacecrafts/{spacecraftIds}.get,WARNING,"Operation must define parameter ""{spacecraftIds}"" as expected by path ""/spacecrafts/{spacecraftIds}"".",Syntax
../../../Desktop/test-collections/spacecraft-api/src/main/resources/openapi.yaml,4,info,WARNING,The info object should have a description.,Governance
../../../Desktop/test-collections/spacecraft-api/src/main/resources/openapi.yaml,21,paths./spacecrafts/{spacecraftIds}.get.responses,WARNING,Operation should return a 5xx HTTP status code,Governance
```

### `postman api lint`

<Info class="iconless-callout">
  The `postman api lint` command is only supported for API Builder objects in Postman v11. The Postman API Builder isn't supported in Postman v12 and later. Learn about [using the API Builder in Postman v11 and earlier](/v11/docs/design-apis/api-builder/overview/).
</Info>

This command runs validation checks for governance and security rules against the API specification provided in the Postman config file, a local file, or a UUID. The `api lint` command shows a warning if it's unable to find the API ID to send data back to Postman.

<Note title="Note">
  This command supports APIs in the Postman API Builder that aren't linked to Git.
</Note>

#### Options

| Option                             | Details                                                                                                                                                                                                   |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--fail-severity [severity]`, `-f` | Triggers an exit failure code for rule violations at or higher than the specified severity level. The options, in order of lowest to highest severity, are `HINT`, `INFO`, `WARN`, and `ERROR` (default). |
| `--suppress-exit-code`, `-x`       | Specifies whether to override the default exit code for the current run.                                                                                                                                  |

#### Example

```plaintext
postman api lint my-definition-file.json
postman api lint 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12
```

## Publish an API version

You can publish API versions in the Postman API Builder from the command line with the Postman CLI. Use the Postman CLI to automate the API version publishing process.

### `postman publish api`

<Info class="iconless-callout">
  The `postman publish api` command is only supported for API Builder objects in Postman v11. The Postman API Builder isn't supported in Postman v12 and later. Learn about [using the API Builder in Postman v11 and earlier](/v11/docs/design-apis/api-builder/overview/).
</Info>

Publish a snapshot of an API for the given `apiId`. All elements linked to the API are published by default. You can choose which elements to publish by using other command options.

When publishing an API that's linked with Git, you must enter the command from inside the local Git repo. Also, you must provide paths to the schema directory and collection paths instead of IDs.

#### Options

| Option                                              | Details                                                                                                                                                 |
| :-------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--name <name>`                                     | Specifies the name of the version to publish.                                                                                                           |
| `--release-notes <releaseNotes>`                    | Enter release notes as a string in quotes for the version to publish. This option supports Markdown.                                                    |
| `--collections <collectionIds/paths...>`            | Specifies the collections to publish. If the API is linked with Git, provide the `filePath` instead of the ID.                                          |
| `--api-definition <apiDefinitionId/directory/file>` | Specifies the API specification to publish. If the API is linked with Git, provide the `schemaDirectoryPath` or `schemaRootFilePath` instead of the ID. |
| `--do-not-poll`                                     | Specifies not to poll for completion status of the publish action.                                                                                      |
| `--suppress-exit-code, -x`                          | Specifies whether to override the default exit code for the current run.                                                                                |

#### Example for repos not linked with Git

```plaintext
postman api publish <apiId> --name v1\
--release-notes "# Some release notes information"\
--collections <collectionId1> <collectionId2>\
--api-definition <apiDefinitionId>
```

#### Examples for repos linked with Git

The options for the `api publish` command differ depending on if you specified a schema folder or schema root file when setting up the Git integration. Git integrations added in Postman v10.18 or later use a schema root file. Git integrations added in other Postman versions use a schema folder.

- If the API uses a schema folder, publish the API using the `--api-definition <schemaDirectoryPath>` option:

  ```plaintext
  postman api publish <apiId> --name v1\
  --release-notes "# Some release notes information"\
  --collections <collectionPath1> <collectionPath2>\
  --api-definition <schemaDirectoryPath>
  ```

- If the API uses a schema root file, publish the API using the `--api-definition <schemaRootFilePath>` option:

  ```plaintext
  postman api publish <apiId> --name v1\
  --release-notes "# Some release notes information"\
  --collections <collectionPath1> <collectionPath2>\
  --api-definition <schemaRootFilePath>
  ```

<Note>
  If you specify a file when a folder is required, or a folder when a file is required, the `api publish` command returns the following error: `API Definition <file/folder> isn't part of API <apiId>`. Try the command again using the other option.
</Note>

---

title: Run a collection using the Postman CLI
approved: 2024-12-04T00:00:00.000Z
slug: docs/postman-cli/postman-cli-run-collection
max-toc-depth: 2
ux: v12

---

You can use the [Postman CLI](/docs/postman-cli/postman-cli-overview/) to manually run collections to test the functionality of your API. You can also use the Postman CLI to automate collection runs in CI/CD pipelines.

When the Postman CLI runs a collection, the collection and its tests run locally, and the results are sent to the Postman cloud using an API call.

<Info>
  * The Postman CLI supports running collections with HTTP requests. With a paid plan, you can also run collections with gRPC and GraphQL requests. You can't run collections with other protocols.
  * The Postman CLI doesn't support OAuth 2.0 authentication. To learn how to use an OAuth 2.0 token with the Postman CLI, see [OAuth 2.0 overview](/docs/sending-requests/authorization/oauth-20/#oauth-20-overview).
</Info>

## Run a collection locally with the Postman CLI

You can use the Postman CLI to run the requests in a [collection](/docs/collections/use-collections/create-collections/) or a [folder](/docs/collections/use-collections/manage-collections/#add-folders-to-a-collection).

{/_ vale postman-style-guide.Avoid = NO _/}

1. [Download and install the Postman CLI](/docs/postman-cli/postman-cli-installation/).

2. Click the <img alt="Items icon" src="https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon" width="20px" /> Items tab in the sidebar, click **Collections**, and select the collection or folder you want to run.

3. Click <img alt="Runner icon" src="https://assets.postman.com/postman-docs/icon-runner-v9.jpg#icon" width="16px" /> **Run**.

4. On the **Functional** tab, click **Automate runs via CLI**.

   <Info>
     If you're running a [collection linked to an API](/docs/design-apis/api-builder/develop-apis/adding-api-elements/) that's connected to a [Git repository](/docs/design-apis/api-builder/versioning-an-api/overview/), replace the collection ID with the path to the collection file in your remote repository.
   </Info>

5. Under **Run on Postman CLI**, click **Add API Key**. Do one of the following:
   - Click **Generate Key** to create a new API key. Enter a name for the API key and click **Generate**. Click <img alt="Copy icon" src="https://assets.postman.com/postman-docs/aether-icons/action-copy-stroke.svg#icon" width="16px" /> **Copy** to copy the key and save it somewhere safe.
   - Click **Use Existing Key** and enter a valid API key.

6. Click **Insert Key**.

7. Click <img alt="Copy icon" src="https://assets.postman.com/postman-docs/aether-icons/action-copy-stroke.svg#icon" width="16px" /> **Copy** to copy the commands.

8. Paste and run the commands in your terminal. After running the commands, the Postman CLI outputs a run report and a link to the run results in Postman.

   <Info>
     In the run report, `test-scripts` refers to [post-response scripts](/docs/tests-and-scripts/write-scripts/test-scripts/).
   </Info>

9. Follow the link to check the results in Postman.

   <img alt="Postman CLI view collection run results" src="https://assets.postman.com/postman-docs/v11/postman-cli-view-run-data-v11-19.jpg" />

{/_ vale postman-style-guide.Avoid = YES _/}

## Run a collection in CI/CD

When the collection runs to your satisfaction, you can copy the commands into your CI/CD script to integrate them into your workflows. When adding the commands to your CI/CD script, you may want to replace the API key with a variable.

To run a collection in CI/CD, do the following:

{/_ vale postman-style-guide.Avoid = NO _/}

1. Click the <img alt="Items icon" src="https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon" width="20px" /> Items tab.

2. Click **Collections** in the sidebar and select the collection or folder you want to run.

3. Click <img alt="Runner icon" src="https://assets.postman.com/postman-docs/icon-runner-v9.jpg#icon" width="16px" /> **Run**.

4. On the **Functional** tab, click **Automate runs via CLI**.

5. Under **Run on CI/CD**, click **Configure command**.

6. Click a **Collection** to run during pipeline builds. You can also select an **Environment** to use.

   <Info>
     If needed, click <img alt="Add icon" src="https://assets.postman.com/postman-docs/aether-icons/action-add-stroke.svg#icon" width="16px" /> **Add Another Collection** to select more collections to run.
   </Info>

7. Click the **CI/CD Provider** and **Operating system** for your CI/CD pipeline.

8. To copy the Postman CLI configuration, click <img alt="Copy icon" src="https://assets.postman.com/postman-docs/aether-icons/action-copy-stroke.svg#icon" width="16px" /> **Copy** or **Copy Postman CLI Command**.

   <img alt="Generate Postman CLI" src="https://assets.postman.com/postman-docs/v11/generate-postman-cli-v11-19.jpg" />

9. Add the Postman CLI configuration to your CI/CD script. This process depends on your CI tool.

{/_ vale postman-style-guide.Avoid = YES _/}

## Run a collection in a specific order

By default, when you generate the command to run a collection from the Collection Runner, a single Collection ID for the collection is specified. This runs the folders and requests in that collection in the sequence they're listed in the collection.

If you need to change the request order, select a request in the Collection Runner and drag it to its new location in the order. You can also remove an individual request from the run by clearing the checkbox next to its name.

When you change the folder and request sequence, the generated command also changes. In addition to the Collection ID, the generated command specifies a number of folder and request UIDs with the `-i` option. This runs each of the folders or requests in that specified order.

## Run a collection that uses test data files

The Postman CLI can't run requests that use files in your local [working directory](/docs/getting-started/installation/settings/#working-directory) to send [body data](/docs/sending-requests/create-requests/parameters/). If your collection has requests that use files, [upload your test data files](/docs/sending-requests/create-requests/test-data/) to make them available to the Postman CLI.

## Run a collection that uses packages

<Info>
  Using the Postman CLI to run packages from your team's Postman Package Library is available with [Postman Solo, Team, and Enterprise plans](https://www.postman.com/pricing/).
</Info>

You can use the Postman CLI to run collections with scripts that import packages from your team's [package library](/docs/tests-and-scripts/write-scripts/packages/package-library/). Learn how to [add packages](/docs/tests-and-scripts/write-scripts/packages/package-library/#add-a-package) to the package library, and [import packages](/docs/tests-and-scripts/write-scripts/packages/package-library/#import-a-package) into your scripts.

You can also use the Postman CLI to run collections that [import external packages](/docs/tests-and-scripts/write-scripts/packages/external-package-registries/) from npm or JSR package registries.

---

title: Run a monitor using the Postman CLI
approved: 2025-10-31T00:00:00.000Z
slug: docs/postman-cli/postman-cli-run-monitor
max-toc-depth: 2
ux: v12

---

Monitors enable you to regularly check the health and performance of your APIs. You can use the [Postman CLI](/docs/postman-cli/postman-cli-overview/) to trigger [monitor runs](/docs/monitoring-your-api/intro-monitors/) within your CI/CD pipeline. Then your team can use your Postman tests to automatically catch regressions and configuration issues during your deployment process. Depending on whether the monitor run passes or fails, you can push or roll back your changes.

By default, Postman supports monitoring public APIs. If you're on an Enterprise plan, you can use [Private API Monitoring](/docs/monitoring-your-api/runners/overview/) to monitor your organization's internal APIs from your internal network using runners, without publicly exposing your endpoints. As an [Admin or Super Admin](/docs/administration/roles-and-permissions/#team-roles), you can create runners when you configure a monitor and then set up the runner in your internal network using the [`postman runner start` command](/docs/postman-cli/postman-cli-options/#postman-runner-start).

Once your monitor is created, add the Postman CLI installation command and [`postman monitor run` command](/docs/postman-cli/postman-cli-options/#postman-monitor-run) into your CI/CD script to integrate them into your workflow. Postman recommends replacing your monitor ID and API key with variables.

The Postman CLI triggers the monitor using the `postman monitor run` command and polls Postman for the run's completion. Then the Postman CLI makes the test results available in the [monitor results](/docs/monitoring-your-api/viewing-monitor-results/) in Postman. When the Postman CLI triggers a monitor for a public API, the collection and its tests run in the Postman cloud. When the Postman CLI triggers a monitor for an internal API, the collection and its tests run in your internal network.

<Info class="iconless-callout">
  Postman Monitors support HTTP collections. You can't use monitors with multi-protocol collections.
</Info>

{/\* \*/}

<Info class="iconless-callout">
  The Postman CLI doesn't support OAuth 2.0 authentication. To learn how to use an OAuth 2.0 token with the Postman CLI, see [OAuth 2.0 overview](/docs/sending-requests/authorization/oauth-20/#oauth-20-overview).
</Info>

## Configure a monitor for your CI/CD pipeline

To configure a monitor for your CI/CD pipeline, do the following:

1. Click the <img alt="Services icon" src="https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-services-stroke.svg#icon" width="20px" /> Services tab in the sidebar.
2. Click **Monitors**, then [create or edit a monitor](/docs/monitoring-your-api/setting-up-monitor/).
3. Under **Run**, select **Postman CLI** to only run the monitor when triggered by the Postman CLI.
4. With an Enterprise plan, you can monitor internal APIs using runners. Under **Runners**, select **Manually Select**, then select one of your team's runners from the list. If there are no runners in the list, contact your Admin to [create and set up a runner](/docs/monitoring-your-api/runners/configure-a-runner/) in your team.
5. Continue configuring your monitor, and click **Create Monitor**.

## Run a monitor within your CI/CD pipeline

1. Click the <img alt="Services icon" src="https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-services-stroke.svg#icon" width="20px" /> Services tab in the sidebar.

2. Click **Monitors**, then select the [monitor you configured earlier](#configure-a-monitor-for-your-cicd-pipeline).

3. Select <img alt="Options icon" src="https://assets.postman.com/postman-docs/aether-icons/action-options-stroke.svg#icon" width="16px" /> **View more actions > Run using Postman CLI** in the upper right of the workbench.

4. Under **Trigger Monitor Run**, click **Add API key**. Do one of the following:
   - Click **Generate Key** to create a new API key. Enter a name for the API key and click **Generate**. Click <img alt="Copy icon" src="https://assets.postman.com/postman-docs/aether-icons/action-copy-stroke.svg#icon" width="16px" /> **Copy** to copy the key and save it somewhere safe.
   - Click **Use Existing Key** and enter a valid API key.

5. Click **Insert Key**.

6. Click <img alt="Copy icon" src="https://assets.postman.com/postman-docs/aether-icons/action-copy-stroke.svg#icon" width="16px" /> **Copy to clipboard** to copy the commands.

7. Paste the Postman CLI installation, `login`, and `monitor` commands into your CI/CD script. This process depends on your CI tool.

The following example shows how to use the [Postman CLI GitHub Action](/docs/postman-cli/postman-cli-github-actions/) to run a monitor:

```yaml
name: API Testing

on: push

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run monitor
        uses: postmanlabs/postman-cli-action@v1
        with:
          command: "monitor run ${{ vars.MONITOR_ID }}"
          api-key: ${{ secrets.POSTMAN_API_KEY }}
```

<Info class="iconless-callout">
  You can use the Postman CLI to run a monitor linked to a collection that imports packages from your team's [Postman Package Library](/docs/tests-and-scripts/write-scripts/packages/package-library/). Learn how to [add packages](/docs/tests-and-scripts/write-scripts/packages/package-library/#add-a-package) to the package library, and [import packages](/docs/tests-and-scripts/write-scripts/packages/package-library/#import-a-package) into your scripts.

You can also use the Postman CLI to run a monitor linked to a collection that [imports external packages](/docs/tests-and-scripts/write-scripts/packages/external-package-registries/) from npm or JSR package registries.
</Info>

---

title: Run a performance test using the Postman CLI
approved: 2026-01-16T00:00:00.000Z
slug: docs/postman-cli/postman-cli-run-performance-test
max-toc-depth: 2
ux: v12

---

With performance tests, you can simulate user traffic and observe how your API behaves under load, identifying potential issues that affect performance. You can use the [Postman CLI](/docs/postman-cli/postman-cli-overview/) to trigger [performance tests](/docs/collections/performance-testing/testing-api-performance/) for specified collections, all within your CI/CD pipeline. Your team can use your tests to automatically catch performance issues during the deployment process. Depending on whether the performance test passes or fails, you can push or roll back your changes.

With the [`postman performance run` command](/docs/postman-cli/postman-cli-options/#run-performance-tests), you can configure a performance test for a collection. Add the command into your CI/CD script to [integrate performance tests into your workflow](#run-a-performance-test-within-your-cicd-pipeline). Postman recommends replacing your collection ID and API key with variables.

The Postman CLI triggers the performance test using the `postman performance run` command. The performance test runs against the specified collection according to your performance test configuration. Then the Postman CLI makes the test results available in the [performance test results](/docs/collections/performance-testing/performance-test-metrics/) in Postman.

<Note title="Note">
  Performance tests aren't supported with the [Postman web app](/docs/getting-started/installation/installation-and-updates/#use-the-postman-web-app).
</Note>

## Run a performance test within your CI/CD pipeline

1. Click the <img alt="Items icon" src="https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon" width="20px" /> Items tab in the sidebar.

2. Click **Collections**, then select a collection you'd like to run a performance test for.

3. Click <img alt="Run icon" src="https://assets.postman.com/postman-docs/aether-icons/action-run-stroke.svg#icon" width="16px" role="img" /> **Run**.

4. Click the **Performance** tab.

5. [Configure the performance test](/docs/collections/performance-testing/performance-test-configuration/) for your collection. Your configuration settings are reflected in the `performance` command that you can copy from the Postman app.

6. Under **Run**, select **via the CLI**.

7. Under **Install Postman CLI**, click <img alt="Copy icon" src="https://assets.postman.com/postman-docs/aether-icons/action-copy-stroke.svg#icon" width="16px" role="img" /> **Copy to clipboard** to copy the Postman CLI installation command.

8. Under **Run the performance test**, click **Add API key**. Do one of the following:
   - Click **Generate Key** to create a new API key. Enter a name for the API key and click **Generate**. Click <img alt="Copy icon" src="https://assets.postman.com/postman-docs/aether-icons/action-copy-stroke.svg#icon" width="16px" /> **Copy** to copy the key and save it somewhere safe.
   - Click **Use Existing Key** and enter a valid API key.

9. Click **Insert Key**.

10. Click <img alt="Copy icon" src="https://assets.postman.com/postman-docs/aether-icons/action-copy-stroke.svg#icon" width="16px" /> **Copy to clipboard** to copy the `login` and `performance` commands.

11. Paste the Postman CLI installation, `login`, and `performance` commands into your CI/CD script. This process depends on your CI tool.

The following example shows how to use the [Postman CLI GitHub Action](/docs/postman-cli/postman-cli-github-actions/) to run a performance test:

```yaml
name: API Testing

on: push

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run performance test
        uses: postmanlabs/postman-cli-action@v1
        with:
          command: "performance run ${{ vars.COLLECTION_ID }}"
          api-key: ${{ secrets.POSTMAN_API_KEY }}
```

---

title: Generate collection run reports using the Postman CLI
approved: 2024-12-16T00:00:00.000Z
slug: docs/postman-cli/postman-cli-reporters
max-toc-depth: 2
ux: v12

---

The Postman CLI has built-in reporters you can use to generate reports for your [collection runs](/docs/postman-cli/postman-cli-run-collection/). The following reporters are available: CLI, JSON, JUnit, and HTML. You can use more than one reporter for a run, and you can customize the report output to meet your needs. Built-in reporters are available for HTTP collection runs. Built-in reporters are also available for gRPC and GraphQL collection runs, but only the CLI reporter is available.

## About built-in reporters

Each Postman CLI reporter generates a local report with details about a collection run, including the requests sent, response codes and times, and the number of passed and failed tests. JSON and HTML reports also include details about failed requests ran from scripts at the collection and folder levels. The following reporters are available:

- **CLI** - Displays a report in the terminal. The CLI report is displayed by default if no reporter options are specified. Note that gRPC and GraphQL collection runs only support the CLI report.
- **JSON** - Creates a JSON file containing the report. By default, the report structure follows the Postman CLI JSON reporter schema. You can optionally generate a report using the Newman JSON reporter schema ([example](https://github.com/postmanlabs/newman/blob/develop/examples/reports/sample-collection-report.json)).
- **JUnit** - Creates an XML file containing the report. To learn more about JUnit reporting, see the [JUnit documentation](https://junit.org/junit5/docs/current/user-guide/#junit-platform-reporting).
- **HTML** - Creates an HTML file containing the report. You can filter your collection run iterations by test failures or errors, or by test failures only. Then select the iteration you'd like to view from the filtered results. You can also filter the requests within each iteration to show requests that encountered test failures or errors, or errors only.

## Use a built-in reporter

To generate a report for a collection run, use the `-r` or `--reporters` option. Then specify the reporter you want to use to generate the report: `cli`, `json`, `junit`, or `html`. Use the following syntax:

```bash
postman collection run <collection-id> -r <reporter>
```

<Tip title="Tip">
  You can find the collection ID in Postman. Click the <img alt="Items icon" src="https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon" width="20px" /> Items tab in the sidebar, click **Collections**, then select a collection. Then click the <img alt="Info icon" src="https://assets.postman.com/postman-docs/aether-icons/state-info-stroke.svg#icon" width="16px" /> **Info** tab in the right sidebar to view or copy the collection ID.
</Tip>

By default, reports are created inside the directory `postman-cli-reports` in the current working directory. If the `postman-cli-reports` directory doesn't exist, it's automatically created. You can also [specify an output directory](#configure-the-json-junit-and-html-reporters). The filename includes the collection name and a system timestamp in 24-hour format: `collection-name-yyyy-mm-dd-hh-mm-ss`.

### Use more than one reporter

You can specify one or more reporters for a collection run. If you specify more than one reporter, separate the reporter names in a comma-separated list, for example, `-r json,junit`.

By default, CLI reporter output is shown in the terminal when you run a collection. If you specify one or more reporters, for example `-r json`, then CLI reporter output isn't shown. In this case, to show the CLI reporter, you must explicitly specify it along with the other reporters, for example: `-r cli,json`.

The following example runs the `cli` and `json` reporters:

```bash
postman collection run <collection-id> -r cli,json
```

## Configure built-in reporters

You can customize the output of each reporter by including one or more options when running the command. Use the following syntax:

```bash
postman collection run <collection-id> -r json <--reporter-json-option1> <--reporter-json-option2>
```

The following example runs the `json` reporter with the omit headers and omit response bodies options:

```bash
postman collection run <collection-id> -r json --reporter-json-omitHeaders --reporter-json-omitResponseBodies
```

### Configure the CLI reporter

The CLI reporter is turned on by default when running a collection with the Postman CLI and prints the report to the terminal. Use the following options to configure the CLI reporter.

| Option                                 | Details                                                                                                  |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `--reporter-cli-silent`                | Turns off the CLI reporter, and no output is displayed in the terminal.                                  |
| `--reporter-cli-show-timestamps`       | Prints the local time that each request was made.                                                        |
| `--reporter-cli-no-summary`            | Doesn't print the statistical summary table.                                                             |
| `--reporter-cli-no-failures`           | Doesn't print details for run failures.                                                                  |
| `--reporter-cli-no-assertions`         | Turns off output for assertions as they happen.                                                          |
| `--reporter-cli-no-success-assertions` | Turns off output for successful assertions as they happen.                                               |
| `--reporter-cli-no-console`            | Turns off `console.log()` output (and other console methods) from pre-request and post-response scripts. |
| `--reporter-cli-no-banner`             | Turns off the banner shown at the beginning of each collection run.                                      |

### Configure the JSON, JUnit, and HTML reporters

The JSON, JUnit, and HTML reporters create a report file in the specified format in your working directory. Use the following options to configure the reporter. Replace `<reporter>` with the reporter you are using: `json`, `junit`, or `html`.

| Option                                        | Details                                                                                                                                                                                                                                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--reporter-<reporter>-export <path>`         | Specify a path to save the report. By default, reports are saved to the `/postman-cli-reports` directory in your current working directory. If the directory doesn't exist, it will be created automatically. If the specified path is an existing directory, the report file will be saved within it. |
| `--reporter-<reporter>-omitRequestBodies`     | (JSON and HTML reporters only) Remove all request bodies from the report.                                                                                                                                                                                                                              |
| `--reporter-<reporter>-omitResponseBodies`    | (JSON and HTML reporters only) Remove all response bodies from the report.                                                                                                                                                                                                                             |
| `--reporter-<reporter>-omitHeaders`           | (JSON and HTML reporters only) Remove all request and response headers from the report.                                                                                                                                                                                                                |
| `--reporter-<reporter>-omitAllHeadersAndBody` | (JSON and HTML reporters only) Remove all request and response headers, and all request and response bodies, from the report.                                                                                                                                                                          |
| `--reporter-json-structure newman`            | (JSON reporter only) Generate a JSON report using the Newman schema. By default, JSON reports use the native structure of the Postman CLI.                                                                                                                                                             |

### Configure options for more than one reporter

If you're using more than one reporter, you can specify an option for a single reporter using the syntax `--reporter-<reporter>-<option>`. Replace `<reporter>` with the reporter you are using: `cli`, `json`, `junit`, or `html`. Replace `<option>` with the [reporter option](#configure-built-in-reporters) you want to apply to the reporter.

```bash
postman collection run <collection-id> -r json,html --reporter-json-omitHeaders
```

If you want all reporters to accept the same option, you can specify a [reporter option](#configure-built-in-reporters) for all reporters using the syntax `--reporter-[option]`.

```bash
postman collection run <collection-id> -r json,html --reporter-omitHeaders
```

<Info class="iconless-callout">
  When using more than one reporter, options specified for a single reporter take precedence over options specified for all reporters.
</Info>

---

title: Run Postman CLI commands in your CI/CD workflows using GitHub Actions
approved: 2026-01-16T00:00:00.000Z
topictype: concept
slug: docs/postman-cli/postman-cli-github-actions
max-toc-depth: 2

---

With the Postman CLI GitHub Action, you can run [Postman CLI](/docs/postman-cli/postman-cli-overview/) commands directly in your GitHub CI/CD workflows, without creating and maintaining custom actions. The action supports collection runs, monitors, syntax checks, governance validation, and more. By catching regressions and configuration issues early, you can confidently decide whether to proceed with or roll back a deployment.

To learn more about the Postman CLI GitHub Action, see the [GitHub Marketplace](https://github.com/marketplace/actions/postman-cli).

## Use the Postman CLI GitHub Action

Specify the Postman CLI commands you'd like to run in your CI/CD workflows. For each command, you can customize inputs to suit your API project, such as the Postman CLI version. Each command returns an exit code output you can use to check whether the results succeeded or failed.

```yaml
name: API Tests

on: push

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Run Postman Collection
        uses: postmanlabs/postman-cli-action@v1
        with:
          command: "collection run 12345678-collection-id"
          api-key: ${{ secrets.POSTMAN_API_KEY }}
```

The Postman CLI GitHub Action accepts the following inputs:

| Name                  | Description                                                                                                                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api-key`             | Specify your [Postman API key](/docs/developer/postman-api/authentication/#generate-a-postman-api-key) used for authentication. Required if you're accessing the Postman cloud. This is optional if you're accessing local files. |
| `command`             | (Required) Specify the [Postman CLI command](/docs/postman-cli/postman-cli-options/) you'd like to run and its options.                                                                                                           |
| `postman-cli-version` | Specify the Postman CLI version to install. For example, `1.27.0`. (Default: `latest`)                                                                                                                                            |
| `region`              | If you purchased a [Postman EU Data Residency plan](/docs/administration/enterprise/about-eu-data-residency/), specify that your instance of Postman is hosted in the EU region. Accepts `eu`.                                    |
| `working-directory`   | Specify the directory to run the command from. (Default: `.`)                                                                                                                                                                     |

The Postman CLI commands return the following outputs:

| Name        | Description                                                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `exit-code` | The Postman CLI command returns exit code `0` when it successfully completes. The command returns a non-zero exit code when a failure is detected. |

## Run collections

A collection is a set of [API requests](/docs/getting-started/first-steps/sending-the-first-request/), a [workflow](/docs/collections/running-collections/building-workflows/), or a [test suite](/docs/tests-and-scripts/write-scripts/test-scripts/). You can use the Postman CLI to run HTTP collections and send the run results to the Postman cloud. Learn more about [collections](/docs/collections/use-collections/use-collections-overview/).

```yaml
# Local file
- uses: postmanlabs/postman-cli-action@v1
  with:
    command: "collection run tests/collection.json --environment tests/environment.json"

# Cloud resources
- uses: postmanlabs/postman-cli-action@v1
  with:
    command: "collection run 12345678-collection-id --environment 87654321-environment-id"
    api-key: ${{ secrets.POSTMAN_API_KEY }}
```

Learn more about the [collection run options](/docs/postman-cli/postman-cli-options/#postman-collection-run) you can use to configure the command.

## Run monitors

[Monitors](/docs/monitoring-your-api/intro-monitors/) enable you to regularly check the health and performance of your APIs. You can use the Postman CLI to trigger monitor runs and send the run results to the Postman cloud. You can learn more about [configuring a monitor for your CI/CD workflow](/docs/postman-cli/postman-cli-run-monitor/).

```yaml
- uses: postmanlabs/postman-cli-action@v1
  with:
    command: "monitor run 12345678-monitor-id"
    api-key: ${{ secrets.POSTMAN_API_KEY }}
```

Learn more about the [monitor run options](/docs/postman-cli/postman-cli-options/#postman-monitor-run) you can use to configure the command.

## Validate specifications in Spec Hub

Run syntax validation and governance rule checks against API specifications in [Spec Hub](/docs/design-apis/specifications/overview/). The command is supported for API specifications in OpenAPI 2.0, 3.0, or 3.1 format.

```yaml
# Local file
- uses: postmanlabs/postman-cli-action@v1
  with:
    command: "spec lint specs/openapi.yaml --fail-severity ERROR"

# Cloud resources
- uses: postmanlabs/postman-cli-action@v1
  with:
    command: "spec lint 12345678-spec-id --output json --fail-severity ERROR"
    api-key: ${{ secrets.POSTMAN_API_KEY }}
```

Learn more about the [specification validation options](/docs/postman-cli/postman-cli-options/#postman-spec-lint) you can use to configure the command.
