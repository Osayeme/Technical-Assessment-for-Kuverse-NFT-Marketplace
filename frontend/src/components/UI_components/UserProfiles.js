import React from "react";
import styled from "styled-components";
import { device } from "../../components/devices";
import { useTheme } from "../../context/themeContext";
import { useWeb3React } from "@web3-react/core";
import { shorter } from "../../utils";
import { Button1, ButtonDiv, ButtonStyle1 } from "./Buttons";

const TechCenterInnerContentTop = styled.div`
  margin: 0 auto;

  @media ${device.mobile} {
    margin: 19px auto 0;
  }
`;
const Counting = styled.div`
  text-align: right;
  margin-right: 45px;
`;
const CountingText = styled.p`
  color: black;
  font-family: Inter;
  font-size: 20px;
  font-style: italic;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.6px;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 2px;
  @media ${device.mobile} {
    font-size: 14px;
  }
  & > img {
    @media ${device.mobile} {
      height: 14px;
    }
  }
  & > img:nth-child(2) {
    display: none;
  }
`;
const Profile = styled.div`
display: flex;
gap: 23px;
width: 350px;
margin 0 auto;
margin-top: 59px;
@media ${device.mobile} {
    gap: 10px;
    margin-top: 16px;
}

`;
const HrTag = styled.hr`
  @media ${device.mobile} {
    display: none;
  }
`;
const ProfileImage = styled.div`
  width: 103px;
  height: 103px;
  border-radius: 50%;
  border: 4px solid #008ad2;
  display: flex;
  justify-content: center;
  align-items: center;
  & > img {
    background: #eeeeee;
    border-radius: 50%;
    width: 100%;
    height: auto;
    margin: 4px;
    padding: 5px;
  }
`;
const ProfileImageIcon = styled.img`
  width: 20px;
  height: 20px;
`;
const ProfileImageIcon1 = styled.img`
  // padding-top:2px;
`;
const ProfileDetail = styled.div`
  /* Add styles for tech-center-inner-content-profile-detail here */
`;
const ProfileDetailText = styled.p`
  background: linear-gradient(180deg, #00beee 0%, #0087d1 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 1px;
  display: flex;
  gap: 7px;
`;
const ProfileDetailTexttwo = styled.p`
  color: #404040;
  font-size: 15px;
  font-style: italic;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.45px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
`;
const ProfileDetailIcons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
`;
const ProfileImageIcon3 = styled.img`
  width: 43px;
  height: 29px;
    display: none;
  @media ${device.mobile} {
    display: block;
  }
`;
const Icon = styled.span`
  color: #404040;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.2px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const TechCenterInnerContent = (props) => {
  const { account } = useWeb3React();
  const { theme } = useTheme();
  return (
    <TechCenterInnerContentTop className="w-100 px-4">
      <Profile>
        {account ? (
              <ProfileDetail>
                <ButtonDiv>
                  <ButtonStyle1 onClick={props.openLogoutModal}>
                    {shorter(account)}
                  </ButtonStyle1>
                </ButtonDiv>
              </ProfileDetail>
						) : (
							<ButtonDiv onClick={props.connectAccount}>
								<ButtonStyle1>CONNECT METAMASK</ButtonStyle1>
							</ButtonDiv>
						)}

      </Profile>
      <HrTag
        style={{
          maxWidth: 400,
          margin: "37px auto 0",
          border: "1px solid #DCDCDC",
        }}
      />
    </TechCenterInnerContentTop>
  );
};

export default TechCenterInnerContent;
