// import pinataSDK from '@pinata/sdk';
// const pinata = pinataSDK('4868ff87fe4275217b39', '19fd8f2e8fc9669e614f89406a5eade723991960eaff68aa11769f147f930371');

// export const getIpfsHash = async (data) => {
//   const result = await pinata.pinJSONToIPFS(data, null);
//   const hash = result.IpfsHash;
//   return hash;
// };

import axios from "axios";
//import { create } from 'ipfs-http-client';
//import dotenv from 'dotenv';
//dotenv.config();




const pinataApiKey = 'YOUR_PINATA_API_KEY';
const pinataSecretApiKey= 'YOUR_PINATA_SECRET_API_KEY';

/*
// Setup IPFS client
const ipfsClient = create({ url:
  'https://ipfs.infura.io:5001/api/v0',
  headers: {
    authorization: auth,
  },
 }); 


export const uploadToIPFS = async (metadata) => {
  try {
    console.log(metadata);
    const added = await ipfsClient.add(JSON.stringify(metadata));
    console.log(added);
    return `https://ipfs.infura.io/ipfs/${added.path}`;
  } catch (error) {
    console.error("Error uploading to IPFS", error);
    return null;
  }
};*/

export const pinJSONToIPFS = async (metaData) => {
  try {
    const jsonData = JSON.stringify(metaData);
    console.log(jsonData);
    const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey,
      },
    });

    console.log('JSON pinned successfully:', response.data);
    return `https://ipfs.io/ipfs/${response.data.IpfsHash}`; // Contains the IPFS hash
  } catch (error) {
    console.error('Error pinning JSON to Pinata:', error.message);
  }
}

export const getIpfshash = async (data) => {
  let config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4ZmNhZTY5MS1kMGRlLTRjYjMtYTgyOC1kMTJlZDM3OTk1M2QiLCJlbWFpbCI6ImNob3NraW5AYW1iaXRpb3VzLWxpZmVzdHlsZXMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjQ4NjhmZjg3ZmU0Mjc1MjE3YjM5Iiwic2NvcGVkS2V5U2VjcmV0IjoiMTlmZDhmMmU4ZmM5NjY5ZTYxNGY4OTQwNmE1ZWFkZTcyMzk5MTk2MGVhZmY2OGFhMTE3NjlmMTQ3ZjkzMDM3MSIsImlhdCI6MTY2MTg4Njg4NH0.z6sWc6RTMGAuIpEwBhyr2TG2TkvySZsBBPTOQc5FWfk'
    },
    data : data
  };
  const res = await axios(config);
  return res.data.IpfsHash;
}

export const getIpfsHashFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    var headers = new Headers();
    headers.append("pinata_api_key", "4868ff87fe4275217b39");
    headers.append("pinata_secret_api_key", "19fd8f2e8fc9669e614f89406a5eade723991960eaff68aa11769f147f930371");
    var formdata = new FormData();
    formdata.append("file", file);
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: formdata
    };
    fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", requestOptions)
      .then(r => r.json())
      .then(r => {
        resolve(r.IpfsHash);
      })
      .catch(error => reject(error))
  })
};
