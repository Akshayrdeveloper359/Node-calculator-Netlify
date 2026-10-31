# Node Calculator

Web UI:     open `index.html` in a browser
CLI:        `npm start`  or  `node cli.js "2 + 3 * 4"`
Tests:      `npm test`
Build:      `npm run build`  (runs tests, then creates `dist/`)

Operators: `+ - * / % ^`, parentheses, unary minus.
Functions: `sqrt abs round floor ceil`. In the CLI, `ans` is the previous result.

## Netlify
`netlify.toml` runs `npm run build` and publishes `dist/`.
A failing test fails the build, so the deploy is blocked.
