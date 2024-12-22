import { ethers } from 'ethers';
import nftABI from '../abis/minter.json';


const nftContractAddress = "0xbE67c1452Ca0C895b9A8620bA4A6F84bb5C587b8";
const ethValue = "0.05"; 

/*
export const mintNFT = async (metadataURL) => {
  console.log(metadataURL)
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(nftContractAddress, nftABI, signer);
  const transaction = await contract.mint( metadataURL, { value: ethers.utils.parseEther(ethValue) });
  await transaction.wait(); // Wait for transaction confirmation
};*/

export const mintNFT = async (metadataURL) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(nftContractAddress, nftABI, signer);
    const transaction = await contract.mint(metadataURL, {
      value: ethers.utils.parseEther(ethValue),
    });

    await transaction.wait();
    return { success: true };
  } catch (error) {
    // Extract error details for debugging or user feedback
    const errorMessage =
      error.code === 4001
        ? "Transaction rejected by the user."
        : error.reason || "An error occurred during minting.";
    console.error("Minting error:", error);

    return { success: false, error: errorMessage };
  }
};
