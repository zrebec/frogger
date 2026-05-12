import { defineConfig } from 'vite'

const CSP = "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' data:; connect-src 'self'"

export default defineConfig(({ command }) => ({
  base: '/frogger/',
  plugins: command === 'build' ? [{
    name: 'inject-csp',
    transformIndexHtml: (html) => html.replace(
      '<meta charset="UTF-8" />',
      `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}">`,
    ),
  }] : [],
}))
