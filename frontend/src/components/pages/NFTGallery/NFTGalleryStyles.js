import styled from "styled-components";

export const GalleryContainer = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

export const GalleryTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

export const WalletInputField = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
`;

export const FetchButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

export const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

export const NFTCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const NFTImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
`;

export const NFTTitle = styled.h3`
  font-size: 1rem;
  margin: 10px 0;
`;

export const NFTDetails = styled.p`
  font-size: 0.8rem;
  color: #555;
`;
