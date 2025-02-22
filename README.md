# Zerops x Puppeteer example

Import in Zerops

```yaml
project:
  name: puppeteer-example

services:
  - hostname: app
    type: nodejs@22
    enableSubdomainAccess: true
    buildFromGit: https://github.com/fxck/zerops-puppeteer-example
```
