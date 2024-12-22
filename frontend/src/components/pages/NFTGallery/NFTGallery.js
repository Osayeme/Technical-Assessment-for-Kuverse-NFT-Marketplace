import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  GalleryContainer,
  GalleryTitle,
  FetchButton,
  NFTGrid,
  NFTCard,
  NFTImage,
  NFTTitle,
  NFTDetails,
} from "./NFTGalleryStyles";
import axios from "axios";

export const NFTGallery = () => {
  const { account } = useWeb3React(); // Get the connected wallet address
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const alchemyApiKey = "YOUR_ALCHEMY_API_KEY";
  const alchemyBaseURL = `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`;

  const fetchNFTs = async () => {
    if (!account) {
      setError("Please connect your wallet to view NFTs.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(`${alchemyBaseURL}/getNFTs`, {
        params: { owner: account },
      });

      setNfts(response.data.ownedNfts || []);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError("Failed to fetch NFTs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch NFTs automatically when the account changes
  useEffect(() => {
    if (account) {
      fetchNFTs();
    }
  }, [account]);

  return (
    <GalleryContainer>
      <GalleryTitle>Your NFTs</GalleryTitle>

      {account ? (
        <>
          <FetchButton onClick={fetchNFTs} disabled={isLoading}>
            {isLoading ? "Fetching..." : "Refresh NFTs"}
          </FetchButton>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <NFTGrid>
            {nfts.map((nft, index) => (
              <NFTCard key={index}>
                <NFTImage
                  src={nft.media[0]?.gateway || "https://via.placeholder.com/150"}
                  alt={nft.title || "NFT"}
                />
                <NFTTitle>{nft.title || "Untitled NFT"}</NFTTitle>
                <NFTDetails>{nft.description}</NFTDetails>
              </NFTCard>
            ))}
          </NFTGrid>
        </>
      ) : (
        <p style={{ textAlign: "center", color: "gray" }}>
          Connect your wallet to view NFTs.
        </p>
      )}
    </GalleryContainer>
  );
};
