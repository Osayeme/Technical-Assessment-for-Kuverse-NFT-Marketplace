import React, { useState } from "react";
import {
  NFTFormContainer,
  FormField,
  FormTitle,
  FormWrapper,
  FormButton,
  ErrorMessage,
  Message,
} from "./NFTFormStyles"; // Ensure ErrorMessage style is defined
import UserProfile from "../../UI_components/UserProfiles";
import { pinJSONToIPFS } from "../../../utils/ipfs";
import { mintNFT } from "../../../utils/mintNFT";

export const NFTForm = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");

  const validateInputs = () => {
    if (!title.trim()) return "Title is required.";
    if (!description.trim()) return "Description is required.";

    const ipfsUrlPattern = /^https:\/\/ipfs\.io\/ipfs\/[a-zA-Z0-9]+$/;
    if (!imageURL.trim() || !ipfsUrlPattern.test(imageURL))
      return "A valid image URL is required.";
    return null;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const metadata = { title, description, image: imageURL };
      const metadataURL = await pinJSONToIPFS(metadata);

      if (!metadataURL) {
        setError("Failed to upload metadata to IPFS.");
        setIsSubmitting(false);
        return;
      }
      const mintResponse = await mintNFT(metadataURL);
      if (mintResponse.success) {
        setPrompt("NFT Minted Successfully!");
      } else {
        setError(mintResponse.error); // Display wallet error to the user
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
      if (error.code === 4001) {
        setError("MetaMask connection rejected by user.");
      } else if (error.message.includes("insufficient funds")) {
        setError("Insufficient funds for minting.");
      } else {
        setError("Minting failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <NFTFormContainer>
      <UserProfile {...props} />
      <FormWrapper onSubmit={handleFormSubmit}>
        <FormTitle>Create Your NFT</FormTitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {prompt && <Message>{prompt}</Message>}

        <FormField>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter NFT title"
          />
        </FormField>

        <FormField>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter NFT description"
          />
        </FormField>

        <FormField>
          <label>Image URL</label>
          <input
            type="text"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            placeholder="Enter image URL (e.g., https://example.com/image.png)"
          />
        </FormField>

        <FormButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Minting..." : "Mint NFT"}
        </FormButton>
      </FormWrapper>
    </NFTFormContainer>
  );
};
