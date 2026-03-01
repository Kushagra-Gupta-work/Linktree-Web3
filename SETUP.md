# Web3 Linktree Setup Guide

## Prerequisites
1. Node.js 18+ installed
2. Pinata account (https://pinata.cloud)

## Setup Steps

### 1. Get Pinata API Keys
1. Sign up at https://pinata.cloud
2. Go to API Keys section
3. Create a new API key with the following permissions:
   - pinFileToIPFS
   - pinJSONToIPFS
   - unpin
   - pinList
4. Copy your API Key and Secret Key

### 2. Environment Variables
1. Copy `.env.example` to `.env.local`
2. Fill in your Pinata credentials:
   \`\`\`
   PINATA_API_KEY=your_actual_api_key
   PINATA_SECRET_KEY=your_actual_secret_key
   \`\`\`

### 3. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 4. Run the Application
\`\`\`bash
npm run dev
\`\`\`

## How Data Storage Works

### Profile Data
- All profile data (name, bio, links, social media) is stored on IPFS via Pinata
- Each profile gets a unique IPFS hash
- Wallet addresses are mapped to IPFS hashes in our database

### Analytics Data
- View counts, click tracking, and activity logs are stored locally
- This data is not stored on IPFS for privacy and cost reasons

### Scheduled Links
- Scheduled link data is stored locally
- When links become active, they're included in the profile data on IPFS

## Data Flow
1. User creates/edits profile → Data sent to Pinata → IPFS hash returned
2. Profile viewing → IPFS hash looked up → Data fetched from IPFS
3. Analytics → Tracked locally for real-time updates
4. Public profiles → Fetched directly from IPFS using stored hash

## Benefits of IPFS Storage
- **Decentralized**: No single point of failure
- **Permanent**: Data persists even if our servers go down
- **Verifiable**: Content-addressed storage ensures data integrity
- **Censorship Resistant**: Cannot be easily taken down
- **Global**: Accessible from anywhere in the world
