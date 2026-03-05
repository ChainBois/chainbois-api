---
description: Postman Agent Skills for AI coding agents. Sync collections, generate code, run tests, create mocks, publish docs, audit security, and analyze API readiness. - Postman-Devrel/agent-skills
image: https://opengraph.githubassets.com/2bf09dc3e669e7fe51c9c211d25cd19ff971e879bebd29d6bd8ec8f687e8e01f/Postman-Devrel/agent-skills
title: GitHub - Postman-Devrel/agent-skills: Postman Agent Skills for AI coding agents. Sync collections, generate code, run tests, create mocks, publish docs, audit security, and analyze API readiness.
---

[Skip to content](#start-of-content)

You signed in with another tab or window. Reload to refresh your session. You signed out in another tab or window. Reload to refresh your session. You switched accounts on another tab or window. Reload to refresh your session. Dismiss alert

{{ message }}

[ Postman-Devrel](/Postman-Devrel) / **[agent-skills](/Postman-Devrel/agent-skills)** Public

- [ Notifications](/login?return%5Fto=%2FPostman-Devrel%2Fagent-skills) You must be signed in to change notification settings
- [ Fork1 ](/login?return%5Fto=%2FPostman-Devrel%2Fagent-skills)
- [ Star 2 ](/login?return%5Fto=%2FPostman-Devrel%2Fagent-skills)

[](/Postman-Devrel/agent-skills)

main

[Branches](/Postman-Devrel/agent-skills/branches)[Tags](/Postman-Devrel/agent-skills/tags)

Go to file

Code

Open more actions menu

## Folders and files

| Name                                                                                  | Name                                                                         | Last commit message | Last commit date |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------- | ---------------- |
| Latest commit History[4 Commits](/Postman-Devrel/agent-skills/commits/main/)4 Commits |                                                                              |                     |                  |
| [skills](/Postman-Devrel/agent-skills/tree/main/skills "skills")                      | [skills](/Postman-Devrel/agent-skills/tree/main/skills "skills")             |                     |                  |
| [.gitignore](/Postman-Devrel/agent-skills/blob/main/.gitignore ".gitignore")          | [.gitignore](/Postman-Devrel/agent-skills/blob/main/.gitignore ".gitignore") |                     |                  |
| [LICENSE](/Postman-Devrel/agent-skills/blob/main/LICENSE "LICENSE")                   | [LICENSE](/Postman-Devrel/agent-skills/blob/main/LICENSE "LICENSE")          |                     |                  |
| [README.md](/Postman-Devrel/agent-skills/blob/main/README.md "README.md")             | [README.md](/Postman-Devrel/agent-skills/blob/main/README.md "README.md")    |                     |                  |
| View all files                                                                        |                                                                              |                     |                  |

## Repository files navigation

[](https://camo.githubusercontent.com/981c2118053156739cf6d5a65876f4a512c65f222042b9efe485ac5054895a72/68747470733a2f2f766f79616765722e706f73746d616e2e636f6d2f6c6f676f2f706f73746d616e2d6c6f676f2d6f72616e67652e737667)

# Postman Agent Skills

[](https://opensource.org/licenses/MIT)

Give your AI coding agent full access to Postman. Sync collections, generate client code, run tests, create mocks, publish docs, audit security, and analyze API readiness for AI agents.

Works with **Claude Code**, **Cursor**, **Windsurf**, **Codex**, and [40+ other agents](https://skills.sh).

## Install

npx skills add Postman-Devrel/agent-skills

This installs two skills:

| Skill                     | What It Does                                                                                         |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| **postman**               | Full API lifecycle: sync specs, generate code, run tests, create mocks, publish docs, audit security |
| **postman-api-readiness** | Analyze any API for AI agent compatibility (48 checks, 8 pillars, 0-100 scoring)                     |

## Prerequisites

1. **Postman API Key**: Get one at [postman.postman.co/settings/me/api-keys](https://postman.postman.co/settings/me/api-keys)
2. **Set the environment variable**:  
   export POSTMAN_API_KEY=PMAK-your-key-here  
   Add to `~/.zshrc` or `~/.bashrc` to persist.
3. **Postman MCP Server**: The skills use Postman's MCP Server for all operations. If you're using the [Postman Claude Code Plugin](https://github.com/Postman-Devrel/postman-claude-code-plugin), MCP is already configured. Otherwise, add to your MCP config:  
   {  
    "mcpServers": {  
    "postman": {  
    "type": "http",  
    "url": "https://mcp.postman.com/mcp",  
    "headers": {  
    "Authorization": "Bearer ${POSTMAN_API_KEY}"  
    }  
    }  
    }  
   }

## What You Can Do

### Sync Collections

Push OpenAPI specs to Postman, create collections, keep everything in sync.

```
"Sync my OpenAPI spec to Postman"
"Create a collection from my local API spec"
"Push my endpoint changes to Postman"

```

### Generate Client Code

Generate typed clients from your Postman collections in TypeScript, Python, Go, Rust, Java, or Ruby.

```
"Generate a TypeScript client from my Users API collection"
"Create a Python SDK for the Pet Store API"

```

### Run Tests

Execute Postman collection tests, diagnose failures, and fix code.

```
"Run the tests for my API collection"
"Why are my API tests failing?"

```

### Create Mock Servers

Spin up mock servers for frontend development and testing.

```
"Create a mock server for my collection"
"I need a fake API for frontend development"

```

### Publish Documentation

Analyze, improve, and publish API docs.

```
"How complete is my API documentation?"
"Generate docs for my OpenAPI spec"
"Publish my collection docs"

```

### Security Audit

Audit APIs against OWASP API Security Top 10.

```
"Run a security audit on my API"
"Check my spec for vulnerabilities"

```

### API Readiness Analysis

Score your API for AI agent compatibility.

```
"Is my API agent-ready?"
"Scan my OpenAPI spec for agent compatibility"
"How do I get my API to a 90% readiness score?"

```

## Skills Structure

```
skills/
  postman/
    SKILL.md                    # Main skill (7 workflows)
    references/
      mcp-tools.md              # MCP tool catalog
      mcp-limitations.md        # Known limitations + workarounds
  postman-api-readiness/
    SKILL.md                    # Readiness analyzer (48 checks)
    references/
      pillars.md                # Full pillar reference

```

## About

Built by the [Postman Developer Relations](https://www.postman.com) team. These skills give AI coding agents native access to Postman's API platform, turning your agent into a full API development partner.

The **postman** skill covers the complete API lifecycle: design, build, test, secure, deploy, observe, and distribute. The **postman-api-readiness** skill is a standalone analyzer that evaluates any OpenAPI spec for AI agent compatibility using a framework of 48 checks across 8 pillars.

## License

MIT

## About

Postman Agent Skills for AI coding agents. Sync collections, generate code, run tests, create mocks, publish docs, audit security, and analyze API readiness.

### Topics

[ mcp](/topics/mcp "Topic: mcp") [ postman](/topics/postman "Topic: postman") [ api-development](/topics/api-development "Topic: api-development") [ agent-skills](/topics/agent-skills "Topic: agent-skills") [ skills-sh](/topics/skills-sh "Topic: skills-sh")

### Resources

[ Readme](#readme-ov-file)

### License

[ MIT license](#MIT-1-ov-file)

### Uh oh!

There was an error while loading. Please reload this page.

[ Activity](/Postman-Devrel/agent-skills/activity)

[ Custom properties](/Postman-Devrel/agent-skills/custom-properties)

### Stars

[ **2** stars](/Postman-Devrel/agent-skills/stargazers)

### Watchers

[ **0** watching](/Postman-Devrel/agent-skills/watchers)

### Forks

[ **1** fork](/Postman-Devrel/agent-skills/forks)

[ Report repository](/contact/report-content?content%5Furl=https%3A%2F%2Fgithub.com%2FPostman-Devrel%2Fagent-skills&report=Postman-Devrel+%28user%29)

## [Releases](/Postman-Devrel/agent-skills/releases)

No releases published

## [Packages0](/orgs/Postman-Devrel/packages?repo%5Fname=agent-skills)

### Uh oh!

There was an error while loading. Please reload this page.

## [Contributors](/Postman-Devrel/agent-skills/graphs/contributors)
