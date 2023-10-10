/// <reference types="node" />

/**
 * Script to encode an SVG file to a CSS data URI.
 * Takes the path to the SVG file as an argument and outputs the CSS data URI to stdout.
 *
 * Usage:
 *  node createCssData.js <path/to/file.svg>
 */

import fs from "node:fs"
import path from "node:path"
import process from "node:process"

// Credits to Anthony Fu and his research:
// https://antfu.me/posts/icons-in-pure-css#datauri
function encodeSvg(svg) {
  const encoded = svg
    .replace("<svg", ~svg.indexOf("xmlns") ? "<svg" : "<svg xmlns=\"http://www.w3.org/2000/svg\"")
    .replace(/"/g, "'")
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/{/g, "%7B")
    .replace(/}/g, "%7D")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")

  return `url("data:image/svg+xml;utf8,${encoded}")`
}

function main() {
  const filePath = path.resolve(process.argv[2])
  const svg = fs.readFileSync(filePath, "utf8")
  const css = encodeSvg(svg)
  process.stdout.write(css)
}

main()
