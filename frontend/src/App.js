import React, { useState, useEffect, useContext } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  connectors,
  connectorLocalStorageKey,
  getConnector,
} from "./utils/connectors";
import { setupNetwork } from "./utils/wallet";
import { useInactiveListener } from "./hooks/useInactiveListener";
import { useAxios } from "./hooks/useAxios";
import { getErrorMessage, getErrorType } from "./utils/ethereum";
import {
  getUser,
  loginUser,
  useAuthDispatch,
  useAuthState,
  logout,
} from "./context/authContext";
import "./components/styles/CustomCss/style.css";
import "./components/styles/CustomCss/Responsive.css";
import "./components/styles/CustomCss/Darkstyle.css";
import FooterMobile from "./components/pages/FooterMobile/Footer";
import { device } from "./components/devices";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import Identicon from "@polkadot/react-identicon";
// import * as Kilt from '@kiltprotocol/sdk-js'
import TopNav from "./components/UI_components/TopNav";
import { Navbar } from "./components/UI_components/Navbar";
import { MarketPlace } from "./components/pages/MarketPlace/MarketPlace";
import { NFTGallery } from "./components/pages/NFTGallery/NFTGallery";
//import { NFTForm } from "./components/pages/NFTForm/NFTForm";
import styled from "styled-components";
import MyRoutes from "./routes";
import { shorter } from "./utils";
import {
  ModalWindow,
  ModalContainer,
  ModalWrap,
  ModalBody,
  ModalFooter,
} from "./components/styles/Common";
import { ThemeProvider, useTheme, test } from "./context/themeContext";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const MainConetent = styled.div`
  display: flex;
  justify-content: space-between;
  .desk-markt {
    position: relative;
  }
  @media ${device.laptopS} {
    width: 100%;
  justify-content: space-between;
    .desk-markt {
      display: none;
    }
  }
  @media ${device.laptopL} {
    .desk-markt {
      width: 37%;
      position: relative;
    }
  }
  @media ${device.tablet} {
    display: flex;
    width:100%;
    .desk-markt {
      display: none;
    }
  }
  @media ${device.mobile} {
    display: block;
    // width:100%;
    .desk-markt {
      display: none;
    }
  }
`;
const WModalBody = styled(ModalBody)`
  text-align: center;
  & > img {
    height: 70px;
  }
  & > .success-title {
    padding-bottom: 20px;
  }
  & > .wallet-list {
    max-height: 400px;
    overflow-y: auto;
  }
`;
const WModalWalletButton = styled.button`
  background: linear-gradient(180deg, #00beee 0%, #0087d1 100%);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.25),
    inset 2px 2px 14px rgba(255, 255, 255, 0.25);
  border-radius: 5px;
  border: none;
  font-weight: 900;
  font-size: 18px;
  text-align: center;
  letter-spacing: 0.15em;
  color: #ffffff;
  cursor: pointer;
  margin: 2% 0;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  & > svg {
    margin-left: 10px;
  }
`;
const WModalCloseButton = styled.button`
  background: #00beee;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 2px 2px 5px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const WModalFooter = styled(ModalFooter)`
  padding-top: 24px;
  & > button {
    display: flex;
    justify-content: center;
    align-items: center;
    position: unset;
    width: 100%;
    & > img {
      height: 32px;
      margin-right: 10px;
    }
  }
`;
function App() {
  const [connectModalOpen, setConnectModalOpen] = useState(null);
  const [errorModalOpen, setErrorModalOpen] = useState(null);
  //const [networkError, setNetworkError] = useState(null);
  const [errorType, setErrorType] = useState("unknown");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  useAxios();

  const { account, library, activate, active, connector, deactivate } =
    useWeb3React();
  const connectAccount = () => {
    console.log("come here")
    setConnectModalOpen(true);
  };
  const connectToProvider = (connector) => {
    let _tried = false;
    let _triedError = undefined;
    const connectorKey = window.localStorage.getItem(connectorLocalStorageKey);
    if (connectorKey && connectorKey !== "") {
      const currentConnector = getConnector(connectorKey);
      if (connectorKey === "injectedConnector") {
        currentConnector.isAuthorized().then((isAuthorized) => {
          if (isAuthorized) {
            activate(currentConnector, undefined, true).catch((error) => {
              if (error instanceof UnsupportedChainIdError) {
                setupNetwork().then((hasSetup) => {
                  if (hasSetup) activate(currentConnector);
                });
              }
              _triedError = error;
              _tried = true;
            });
          } else _tried = true;
        });
      } else {
        activate(currentConnector);
        _tried = true;
      }
    }
    if (_tried) {
      const errorMsg = getErrorMessage(_triedError);
      const errType = getErrorType(_triedError);
      //setNetworkError(errorMsg);
      setErrorType(errType);
      setErrorModalOpen(true);
    }
    activate(connector);
  };
  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState();
  useEffect(() => {
    const connectorKey = window.localStorage.getItem(connectorLocalStorageKey);
    if (connectorKey && connectorKey !== "") {
      const currentConnector = getConnector(connectorKey);
      if (connectorKey === "injectedConnector") {
        currentConnector.isAuthorized().then((isAuthorized) => {
          if (isAuthorized) activate(currentConnector);
        });
      } else {
        activate(currentConnector);
      }
    } else if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, []);
  const { activateError } = useInactiveListener(!!activatingConnector);
  // handling connection error
  if (activateError && errorModalOpen === null) {
    const errorMsg = getErrorMessage(activateError);
    const errType = getErrorType(activateError);
    //setNetworkError(errorMsg);
    setErrorType(errType);
    setErrorModalOpen(false);
  }
  const handleLogout = async () => {
    deactivate();
    window.localStorage.removeItem(connectorLocalStorageKey);
    setLogoutModalOpen(false);
  };
  const openLogoutModal = () => {
    setLogoutModalOpen(true);
  };
  const closeErrorModal = () => {
    window.localStorage.setItem(connectorLocalStorageKey, connectors[0].key);
    setErrorModalOpen(false);
  };

  // kusama connect
  const [kuConnect, setKuConnect] = useState(false);
  const [kuAccounts, setKuAccounts] = useState([]);
  const [kuWallet, setKuWallet] = useState(null);
  const [isKuOpen, setIsKuOpen] = useState(false);
  const [isKuError, setIsKuError] = useState(false);
  const extensionKuSetup = async (initialization = false) => {
    const extensions = await web3Enable("polkadot-kuverse-app");
    if (extensions.length === 0) {
      localStorage.setItem("kuverse_ku_wallet", null);
      if (!initialization) setIsKuError(true);
      return;
    }
    let isPolkadot = false;
    for (let i = 0; i < extensions.length; i++) {
      if (extensions[i].name === "polkadot-js") {
        const accounts = await web3Accounts();
        // Filter the accounts to only include the ones provided by the Polkadot.js extension
        const polkadotAccounts = accounts.filter(
          (account) => account.meta.source === "polkadot-js"
        );
        setKuAccounts(polkadotAccounts);
        setKuConnect(true);
        isPolkadot = true;
      }
    }
    if (!isPolkadot) {
      localStorage.setItem("kuverse_ku_wallet", null);
      if (!initialization) setIsKuError(true);
    }
  };
  useEffect(() => {
    extensionKuSetup(true);
    saveKuwallet(null);
  }, []);
  const connectKusama = async () => {
    if (!kuConnect) await extensionKuSetup();
    else setIsKuOpen(true);
  };
  const saveKuwallet = (_kuWallet) => {
    if (_kuWallet) {
      setKuWallet(_kuWallet);
      localStorage.setItem("kuverse_ku_wallet", JSON.stringify(_kuWallet));
    } else {
      let localWallet = localStorage.getItem("kuverse_ku_wallet");
      if (localWallet) setKuWallet(JSON.parse(localWallet));
    }
    setIsKuOpen(false);
  };
  // kilt wallet
  const [kiltConnect, setKiltConnect] = useState(false);
  const [kiltAccounts, setKiltAccounts] = useState([]);
  const [kiltWallet, setKiltWallet] = useState(null);
  const [isKiltOpen, setIsKiltOpen] = useState(false);
  const [isKiltError, setIsKiltError] = useState(false);
  const dispatch = useAuthDispatch();
  const { user, token } = useAuthState();
  const loginWithKilt = async () => {
    if (!kiltConnect || !kiltWallet) return;
    if (!!user) {
      await getUser(dispatch, kiltWallet.address);
    }
    loginUser(dispatch, kiltWallet.address);
  };
  const logoutWithKilt = async () => {
    logout(dispatch);
  };
  useEffect(() => {
    loginWithKilt();
  }, [kiltWallet, kiltConnect]);

  // Kilt Wallet
  const extensionKiltSetup = async (initialization = false) => {
    const extensions = await web3Enable("sporran-kuverse-app");
    if (extensions.length === 0) {
      localStorage.setItem("kuverse_kilt_wallet", null);
      if (!initialization) setIsKiltError(true);
      return;
    }
    let isSporran = false;
    for (let i = 0; i < extensions.length; i++) {
      if (extensions[i].name === "Sporran") {
        setKiltConnect(true);
        isSporran = true;
        const accounts = await web3Accounts();
        // Filter the accounts to only include the ones provided by the Polkadot.js extension
        const sporranAccounts = accounts.filter(
          (account) => account.meta.source === "Sporran"
        );
        setKiltAccounts(sporranAccounts);
      }
    }
    if (!isSporran) {
      localStorage.setItem("kuverse_kilt_wallet", null);
      if (!initialization) setIsKiltError(true);
    }
  };
  useEffect(() => {
    extensionKiltSetup(true);
    saveKiltWallet(null);
  }, []);
  const connectSporran = async () => {
    if (!kiltConnect) await extensionKiltSetup();
    else setIsKiltOpen(true);
  };
  const saveKiltWallet = async (_kiltWallet) => {
    if (_kiltWallet) {
      setKiltWallet(_kiltWallet);
      localStorage.setItem("kuverse_kilt_wallet", JSON.stringify(_kiltWallet));
      // await Kilt.connect('wss://spiritnet.kilt.io/');
      // const api = Kilt.ConfigService.get('api');
      // console.log("===", _kiltWallet.address);
      // const encodedJohnDoeDetails = await api.call.did.queryByAccount(_kiltWallet)
      // // This function will throw if johnDoeOwner does not exist
      // const {
      // 	document: { uri }
      // } = Kilt.Did.linkedInfoFromChain(encodedJohnDoeDetails)
      // console.log(`My name is john_doe and this is my DID: "${uri}"`)
    } else {
      let localWallet = localStorage.getItem("kuverse_kilt_wallet");
      if (localWallet) setKiltWallet(JSON.parse(localWallet));
    }
    setIsKiltOpen(false);
  };
  return (
    <ThemeProvider>
      <AppContainer>
        <>
          <TopNav />
          <MainConetent>
            <div className="r-l-border responsive">
              <MyRoutes
                connectAccount={connectAccount}
                getUser={getUser}
                user={user}
                loginWithKilt={loginWithKilt}
                logoutWithKilt={logoutWithKilt}
                connectKusama={connectKusama}
                kuWallet={kuWallet}
                setIsKuError={setIsKuError}
                connectSporran={connectSporran}
                kiltWallet={kiltWallet}
                setIsKiltError={setIsKiltError}
                setConnectModalOpen={setConnectModalOpen}
                setLogoutModalOpen={setLogoutModalOpen}
                openLogoutModal={openLogoutModal}
                
              />
            </div>
            {device.mobile && (
              <div className="desk-markt">
                <NFTGallery />
              </div>
            )}
          </MainConetent>
          <FooterMobile />
        </>
        {!!errorModalOpen && !active && (
          <ModalWindow className="modal-window">
            <ModalContainer>
              <ModalWrap className="modal-wrap" style={{ paddingBottom: 24 }}>
                <ModalBody>
                  <h3 className="success-title">Connect your wallet</h3>
                  <h5 className="success-subtitle">
                  </h5>
                </ModalBody>
                <WModalFooter>
                  {errorType === "chain" ? (
                    <button
                      onClick={() => {
                        setErrorModalOpen(false);
                        connectAccount();
                      }}
                      style={{ letterSpacing: 0 }}
                    >
                      <img src="/assets/bird-white.svg" alt="" />
                      Switch to Exosama Network
                    </button>
                  ) : (
                    <button onClick={() => setErrorModalOpen(false)}>
                      <img src="/assets/bird-white.svg" alt="" />
                      CLOSE
                    </button>
                  )}
                </WModalFooter>
              </ModalWrap>
            </ModalContainer>
          </ModalWindow>
        )}
        {!!connectModalOpen && (
          <ModalWindow className="modal-window">
            <ModalContainer>
              <ModalWrap className="modal-wrap">
                <WModalBody>
                  <img src="/assets/bird-white.svg" alt="" />
                  <h3 className="success-title">Connect your wallet</h3>
                  <div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {connectors.map((entry, index) => (
                        <WModalWalletButton
                          key={index}
                          onClick={() => {
                            window.localStorage.setItem(
                              connectorLocalStorageKey,
                              entry.key
                            );
                            connectToProvider(entry.connectorId);
                            setConnectModalOpen(false);
                          }}
                        >
                          {entry.title} <entry.icon width={30} />
                        </WModalWalletButton>
                      ))}
                    </div>
                  </div>
                </WModalBody>
                <WModalFooter>
                  <WModalCloseButton onClick={() => setConnectModalOpen(false)}>
                    CLOSE
                  </WModalCloseButton>
                </WModalFooter>
              </ModalWrap>
            </ModalContainer>
          </ModalWindow>
        )}
        {!!logoutModalOpen && (
          <ModalWindow className="modal-window">
            <ModalContainer>
              <ModalWrap className="modal-wrap">
                <WModalBody>
                  <img src="/assets/bird-white.svg" alt="" />
                  <h3 className="success-title">Connected your wallet</h3>
                  <h5
                    style={{
                      color: "white",
                      wordBreak: "break-all",
                      paddingBottom: "10px",
                    }}
                  >
                    {account}
                  </h5>
                  <div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <WModalWalletButton onClick={() => handleLogout()}>
                        LOGOUT
                      </WModalWalletButton>
                    </div>
                  </div>
                </WModalBody>
                <WModalFooter>
                  <WModalCloseButton onClick={() => setLogoutModalOpen(false)}>
                    CLOSE
                  </WModalCloseButton>
                </WModalFooter>
              </ModalWrap>
            </ModalContainer>
          </ModalWindow>
        )}

        {/* Kusama Wallet Modal */}
        {!!isKuError && (
          <ModalWindow className="modal-window">
            <ModalContainer>
              <ModalWrap className="modal-wrap" style={{ paddingBottom: 24 }}>
                <ModalBody>
                  <h3 className="success-title">Connect your wallet</h3>
                  <h5 className="success-subtitle">
                    Please check your polkadot connection in kusama network
                  </h5>
                  <h5 className="success-subtitle">
                    <a
                      href="https://polkadot.js.org/extension/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Polkadot Extension
                    </a>
                  </h5>
                </ModalBody>
                <WModalFooter>
                  <button onClick={() => setIsKuError(false)}>
                    <img src="/assets/bird-white.svg" alt="" />
                    CLOSE
                  </button>
                </WModalFooter>
              </ModalWrap>
            </ModalContainer>
          </ModalWindow>
        )}

        {!!isKuOpen && (
          <ModalWindow className="modal-window">
            <ModalContainer>
              <ModalWrap className="modal-wrap">
                <WModalBody>
                  <img src="/assets/bird-white.svg" alt="" />
                  <h3 className="success-title">Connect your wallet</h3>
                  <div className="wallet-list">
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {kuAccounts.map((kuAccount, index) => (
                        <WModalWalletButton
                          key={index}
                          onClick={() => saveKuwallet(kuAccount)}
                        >
                          <Identicon
                            value={kuAccount.address}
                            size={44}
                            theme={"polkadot"}
                            style={{ marginRight: 20 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span>{kuAccount.meta.name}</span>
                            <span
                              style={{
                                fontSize: 12,
                                wordBreak: "break-all",
                                textTransform: "none",
                              }}
                            >
                              {shorter(kuAccount.address)}
                            </span>
                          </div>
                        </WModalWalletButton>
                      ))}
                    </div>
                  </div>
                </WModalBody>
                <WModalFooter>
                  <WModalCloseButton onClick={() => setIsKuOpen(false)}>
                    CLOSE
                  </WModalCloseButton>
                </WModalFooter>
              </ModalWrap>
            </ModalContainer>
          </ModalWindow>
        )}

        {/* KILT Wallet Modal */}
        {!!isKiltError && (
          <ModalWindow className="modal-window">
            <ModalContainer>
              <ModalWrap className="modal-wrap" style={{ paddingBottom: 24 }}>
                <ModalBody>
                  <h3 className="success-title">Connect Your Sporran Wallet</h3>
                  <h5 className="success-subtitle">
                    Please check your sporran wallet in kilt blokchain network
                  </h5>
                  <h5 className="success-subtitle">
                    <a
                      href="https://www.sporran.org"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Sporran Wallet Extension
                    </a>
                  </h5>
                </ModalBody>
                <WModalFooter>
                  <button onClick={() => setIsKiltError(false)}>
                    <img src="/assets/bird-white.svg" alt="" />
                    CLOSE
                  </button>
                </WModalFooter>
              </ModalWrap>
            </ModalContainer>
          </ModalWindow>
        )}

        {!!isKiltOpen && (
          <ModalWindow className="modal-window">
            <ModalContainer>
              <ModalWrap className="modal-wrap">
                <WModalBody>
                  <img src="/assets/bird-white.svg" alt="" />
                  <h3 className="success-title">Connect Your Sporran Wallet</h3>
                  <div className="wallet-list">
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {kiltAccounts.map((kiltAccount, index) => (
                        <WModalWalletButton
                          key={index}
                          onClick={() => saveKiltWallet(kiltAccount)}
                        >
                          <Identicon
                            value={kiltAccount.address}
                            size={44}
                            theme={"polkadot"}
                            style={{ marginRight: 20 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span>{kiltAccount.meta.name}</span>
                            <span
                              style={{
                                fontSize: 12,
                                wordBreak: "break-all",
                                textTransform: "none",
                              }}
                            >
                              {shorter(kiltAccount.address)}
                            </span>
                          </div>
                        </WModalWalletButton>
                      ))}
                    </div>
                  </div>
                </WModalBody>
                <WModalFooter>
                  <WModalCloseButton onClick={() => setIsKiltOpen(false)}>
                    CLOSE
                  </WModalCloseButton>
                </WModalFooter>
              </ModalWrap>
            </ModalContainer>
          </ModalWindow>
        )}
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
