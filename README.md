## Description
This project implements a Non-Fungible Token (NFT) minting contract on the Ethereum blockchain using **Solidity** and interacts with **IPFS** for storing NFT metadata. Users can mint unique NFTs, which are linked to metadata that includes images hosted on IPFS.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting Up the Project Locally](#setting-up-the-project-locally)
3. [Smart Contract Overview](#smart-contract-overview)
4. [Interacting with the Smart Contract](#interacting-with-the-smart-contract)

---

## Prerequisites

Before you can run this project locally, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://npmjs.com) (Node Package Manager)
- [Infura or Pinata](https://www.pinata.cloud/) (For uploading files to IPFS)

---

## Setting Up the Project Locally

Follow these steps to set up and run the project on your local machine.

1. **Clone the repository**:
   ```
   git clone https://github.com/Osayeme/Technical-Assessment-for-Kuverse-NFT-Marketplace.git
   ```

2. **Install the dependencies**:
  Navigate to the project root and run the following code
  ```
  cd Technical-Assessment-for-Kuverse-NFT-Marketplace
  npm install
  ```

3. **Set up environment variables**:
  Create a .env file at the root of the project directory. Add your Alchemy and Pinata API credentials and other environment-specific variables:
  ```
  PINATA_PROJECT_ID=your_pinata_project_id
  PINATA_PROJECT_SECRET=your_pinata_project_secret
  ALCHEMY_API_KEY= your_alchemy_api_key
  ```
4. **Run the frontend application**:
In your terminal navigate to the frontend of your application and run the start command
```
cd Technical-Assessment-for-Kuverse-NFT-Marketplace/frontend
npm run start
```

## Interacting with the Smart Contract
The smart contract is an ERC-721 implementation that allows users to mint unique NFTs, each with associated metadata stored on IPFS. The contract is written in Solidity and utilizes the OpenZeppelin library for ERC721 standards and URI storage.

**Deploy the contract**:
Deploy your contract to a test network (e.g., Sepolia) using Hardhat, Truffle, or Remix IDE. Ensure you have ETH in your account for deployment and interacting with the contract.

**Mint an NFT**:
Use the mint() function to mint NFTs. You need to pass the metadata URL to mint the NFT.


**Set Price**:
As the contract owner, you can adjust the minting price by calling the setPrice() function.

**Withdraw funds**:
As the contract owner, you can withdraw any balance from the contract using the withdrawBalance() function.
