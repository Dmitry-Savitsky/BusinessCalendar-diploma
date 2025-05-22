// This script builds and bundles the web component
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Build the Next.js app
console.log("Building Next.js app...")
execSync("npm run build", { stdio: "inherit" })

// Create a directory for the web component
const outputDir = path.resolve(__dirname, "../dist")
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

// Copy the booking-widget.js file from the .next directory
console.log("Creating web component bundle...")
const sourcePath = path.resolve(__dirname, "../.next/static/chunks/booking-widget.js")
const destPath = path.resolve(outputDir, "booking-widget.js")

// Add the custom element registration to the bundle
const webComponentCode = fs.readFileSync(sourcePath, "utf8")
const finalCode = `
${webComponentCode}

// Register the web component
if (typeof window !== 'undefined') {
  if (!customElements.get('booking-widget')) {
    customElements.define('booking-widget', BookingWidget);
  }
}
`

fs.writeFileSync(destPath, finalCode)

console.log("Web component bundle created at:", destPath)
