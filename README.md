<!--
  Paste this entire block into your README.md
  This expanded HTML README uses only GitHub-safe elements and language-tagged code blocks
  so it will render with clean headings, highlighted code/backgrounds, and collapsible sections.
-->

<!-- Header -->
<h1 align="center">WEB3 LINKTREE</h1>
<h2 align="center">DECENTRALIZED LINK-IN-BIO PLATFORM</h2>



<hr />

<!-- SHORT DESCRIPTION -->
<h2>OVERVIEW</h2>
<p>
  <strong>Web3 Linktree</strong> is a decentralized “link-in-bio” application that stores profile data on a content-addressable network instead of a centralized server.
  Users identify and manage profiles using a Web3 wallet, and profile data is pinned to IPFS through a pinning service.
</p>

<!-- TECHNOLOGY STACK -->
<h2>TECHNOLOGY STACK</h2>
<p>
  The project is built with modern web frameworks and decentralized tooling including:
  <strong>Next.js</strong>, <strong>React</strong>, <strong>Tailwind CSS</strong>, a Web3 wallet connector, and IPFS (pinned via a pinning service).
</p>

<!-- FEATURES -->
<h2>KEY FEATURES</h2>
<ul>
  <li>Wallet-based authentication to uniquely identify profile owners.</li>
  <li>Profile data pinned to IPFS, producing a content hash for public retrieval.</li>
  <li>Profile editor for links, bio, avatar, and theme customization.</li>
  <li>QR code generation for easy sharing.</li>
  <li>Link scheduling and local analytics for clicks and views.</li>
  <li>Simple public profile viewer served from an IPFS content hash.</li>
</ul>

<hr />

<!-- PROJECT STRUCTURE -->
<h2>PROJECT STRUCTURE (DETAILED)</h2>
<pre><code class="language-text">
root/
│
├── app/                     # Next.js application pages / routes
│   ├── dashboard/           # Dashboard components and pages
│   ├── public-profile/      # Public profile rendering
│   └── api/                 # Serverless API routes (pinning, analytics endpoints)
│
├── components/              # Reusable UI components (ProfileEditor, QRGenerator, etc.)
├── hooks/                   # React hooks (useWallet, usePinata, useAnalytics)
├── lib/                     # Utilities (ipfs helpers, pinata client wrappers)
├── public/                  # Static assets (images, screenshots)
├── styles/                  # Tailwind / global CSS (minimal)
│
├── app.jsx                  # App entry (if applicable)
├── package.json             # NPM dependencies and scripts
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript config (if using TS)
└── SETUP.md                 # Setup and deployment notes
</code></pre>

<hr />

<!-- HOW IT WORKS / ARCHITECTURE -->
<h2>ARCHITECTURE & DATA FLOW</h2>
<ol>
  <li><strong>Wallet Connect:</strong> The user connects a Web3 wallet to the UI to prove ownership of a wallet address.</li>
  <li><strong>Edit & Pin:</strong> Profile data (JSON containing links, bio, theme, avatar reference) is sent to the backend which calls the pinning service API to pin the JSON to IPFS.</li>
  <li><strong>Content Hash:</strong> The pinning service returns an IPFS content identifier (CID). This CID is the canonical reference to the profile.</li>
  <li><strong>Public View:</strong> The public profile page fetches the pinned JSON from IPFS using the CID and renders the profile for visitors.</li>
  <li><strong>Local Analytics:</strong> Click events and view counts are recorded locally (or in a lightweight database) and are not pinned to IPFS to reduce costs and preserve privacy.</li>
</ol>

<hr />

<!-- SETUP & INSTALLATION -->
<h2>INSTALLATION & DEVELOPMENT</h2>

<h3>Prerequisites</h3>
<ul>
  <li>Node.js v18 or higher</li>
  <li>A pinning service account (for example, a pinning provider with API keys)</li>
</ul>

<h3>Clone the repository</h3>
<pre><code class="language-bash">git clone https://github.com/TrimanSingh/linktree-web3.git
cd linktree-web3
</code></pre>

<h3>Configure environment variables</h3>
<p>Copy the example and add your pinning service credentials:</p>
<pre><code class="language-bash">cp .env.example .env.local
# then edit .env.local
</code></pre>

<h3>Sample <code>.env.local</code></h3>
<pre><code class="language-env">PINATA_API_KEY=your_api_key_here
PINATA_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_API_BASE=/api
</code></pre>

<h3>Install dependencies</h3>
<pre><code class="language-bash">npm install
</code></pre>

<h3>Run the dev server</h3>
<pre><code class="language-bash">npm run dev
# Open http://localhost:3000 in your browser and connect your wallet
</code></pre>

<hr />

<!-- PINNING EXAMPLE -->
<h2>PINNING EXAMPLE</h2>
<p>Below is an example JSON structure that is pinned to IPFS for a profile. Pinning returns a CID which becomes the public identifier.</p>

<pre><code class="language-json">{
  "name": "Alice Example",
  "wallet": "0xAbC123...789",
  "bio": "Developer and builder",
  "links": [
    {"title": "Portfolio", "url": "https://alice.example"},
    {"title": "Twitter", "url": "https://twitter.com/alice"}
  ],
  "theme": { "primary": "blue", "layout": "compact" },
  "avatar": "ipfs://QmExampleAvatarCID"
}
</code></pre>

<hr />

<!-- PINATA API USAGE SAMPLE (JS) -->
<h2>PINNING SAMPLE (SERVER-SIDE)</h2>
<p>Example of a minimal server-side pin call. Do not expose secret keys in client-side code.</p>

<pre><code class="language-javascript">// Example: pin JSON via Pinata-like API (server-side)
const fetch = require('node-fetch');

async function pinJson(pinataApiKey, pinataSecret, jsonObject) {
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': pinataApiKey,
      'pinata_secret_api_key': pinataSecret
    },
    body: JSON.stringify(jsonObject)
  });
  return response.json(); // contains the IPFS CID (IpfsHash)
}
</code></pre>

<hr />

<!-- DEPLOYMENT -->
<h2>DEPLOYMENT</h2>
<p>
  Make sure to add env variables in platform's (vercel or netlify) settings to link correctly.
  
</p>

<hr />

<!-- TROUBLESHOOTING & FAQ -->
<h2>TROUBLESHOOTING & FAQ</h2>
<details>
  <summary><strong>Why can't I see my updated profile?</strong></summary>
  <p>Confirm that the pin call returned a successful CID. If caching is in place, clear caches or fetch the CID directly from an IPFS gateway.</p>
</details>

<details>
  <summary><strong>Where are analytics stored?</strong></summary>
  <p>Analytics are kept locally or in a small database rather than on IPFS to avoid costs and leaking sensitive usage patterns publicly.</p>
</details>

<details>
  <summary><strong>Is the profile reversible or editable after pinning?</strong></summary>
  <p>IPFS CIDs are immutable. To update a profile, pin a new JSON and distribute the new CID (the dashboard manages this process and can link a wallet to the latest CID).</p>
</details>

<hr />

<!-- FOOTER -->
