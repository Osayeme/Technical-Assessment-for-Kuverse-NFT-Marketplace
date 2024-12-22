import styled from "styled-components";
import { device } from "../../devices";

export const NFTFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
`;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`;

export const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

export const FormField = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;

  label {
    font-weight: bold;
    margin-bottom: 5px;
    color: #555;
  }

  input,
  textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const buttonHoverAnimation =`
  0% {background-color: #567ca9;}
  50% {background-color: #A0CCFF;}
  100% {background-color: #567ca9;}
`;

export const FormButton = styled.button`
  background: linear-gradient(180deg, #00BEEE 0%, #0087D1 100%);
  box-shadow: -1px -1px 4px #FFFFFF, 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 50px;
  width: 100%;
  height: 3rem;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  text-align: center;
  letter-spacing: 0.1em;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  &:hover {
    cursor: pointer;
    background: linear-gradient(180deg, #BDF1FE 0%, #73C7F5 100%);
    box-shadow: inset 4px 4px 10px rgba(0, 2, 52, 0.3);
  }

  @media ${device.tablet} {
    width: 80%;
  }

  @media ${device.mobile} {
    width: 60%;
    height: 2.5rem;
  }
`;

export const FormButtonText = styled.span`
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: white;
  display: inline-block;
  text-align: center;
  width: 100%;
`;

export const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
  font-size: 0.9rem;
`;

export const Message = styled.div`
  color: green;
  margin-bottom: 10px;
  font-size: 0.9rem;
`;
