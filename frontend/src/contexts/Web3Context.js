import React, { useState, useEffect, createContext } from "react"
import { ethers, Contract, utils } from "ethers"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    TSP_TOKEN_ADDRESS,
    TSP_TOKEN_CONTRACT,
} from "../utils/constants/constants";

export const Web3Context = createContext()
const toastConfig = { autoClose: 5000, theme: "dark", position: "bottom-left" };

function Web3ContextProvider({ children }) {
    const [account, setAccount] = useState(null);
    const [connected, setConnected] = useState(false);
    const [accountBalance, setAccountBalance] = useState({
        tokenBalance: 0,
        coinBalance: 0,
    });


    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner(account)
    const mumbaiChainID = 80001

    // Requests wallet connection
    const connectWallet = async () => {
        if (connected) return;
        if (window.ethereum || window.web3) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setAccount(accounts[0]);
                await eagerConnect();
                if (connected) {
                    toast.success("Connected!", toastConfig);
                    window.location.reload(false);
                }
            } catch (error) {
                toast.error(
                    error ? error.message.slice(0, 50) : "Connection failed",
                    toastConfig
                );
                console.error(error);
            }
        } else {
            toast.error(
                "Please Use a Web3 Enabled Browser or Install Metamask",
                toastConfig
            );
        }
    };

    const disconnectWallet = () => {
        setConnected(false);
        setAccount(null);
    };
    const refreshState = () => {
        setTimeout(() => {
            window.location.reload();
        }, 5000);
    };
 
    const getContractWithSigner = (contractAddress, contractABI) => {
        return new Contract(contractAddress, contractABI, signer);
    };

    const getTSPTokenBalance = async (address) => {
        if (!connected) {
            try {
                const contract = getContractWithSigner(
                    TSP_TOKEN_ADDRESS,
                    TSP_TOKEN_CONTRACT
                );
                const balance = await contract.balanceOf(address);
                const formattedBalance = utils.formatUnits(balance, 18);
                return formattedBalance;
            } catch (error) {
                toast.error(
                    error ? error.message.slice(0, 50) : "Connection failed",
                    toastConfig
                );
                console.error(error);
            }
        }
    };

    const getCoinBalance = async (address) => {
        if (!connected) {
            try {
                const balance = await provider.getBalance(address);
                const formattedBalance = utils.formatUnits(balance, 18);
                return formattedBalance;
            } catch (error) {
                toast.error(
                    error ? error.message.slice(0, 50) : "Connection failed",
                    toastConfig
                );
                console.error(error);
            }
        }
    };

    // Eagerly connects user and fetches their account data
    const eagerConnect = async () => {
        const networkID = await window.ethereum.request({
            method: "eth_chainId",
        });
        if (Number(networkID) !== mumbaiChainID) {
            setConnected(false);
            return toast.error(
                "You are currently connected to an unsupported network, please switch to Polygon Testnet",
                toastConfig
            );
        }
        const accounts = await provider.listAccounts();
        if (!accounts.length) return;
        setConnected(true);
    };

    //Alerts user to switch to a supported network when account is switched from a supported network
    const handleAccountChanged = async () => {
        if (account) {
            try {
                const networkID = await window.ethereum.request({
                    method: "eth_chainId",
                });
                if (Number(networkID) !== mumbaiChainID) {
                    return toast.error(
                        "You are currently connected to an unsupported network, please switch to Nahmii Testnet 3",
                        toastConfig
                    );
                } else {
                    const accounts = await provider.listAccounts();
                    setAccount(accounts[0]);
                    refreshState();
                }
            } catch (error) {
                toast.error(
                    error ? error.message.slice(0, 50) : "Connection failed",
                    toastConfig
                );
            }
        }
    };

    //Alerts user to switch to a supported network when account is switched from a supported network
    const handleChainChanged = async () => {
        const networkID = await window.ethereum.request({
            method: "eth_chainId",
        });
        if (Number(networkID) !== mumbaiChainID) {
            setConnected(false);
            return toast.error(
                "You are currently connected to an unsupported network, please switch to Nahmii Testnet 3",
                toastConfig
            );
        } else {
            setConnected(true);
            refreshState();
        }
    };

    const init = async () => {
        connectWallet();
        const accounts = await provider.listAccounts();
        if (!accounts.length) return;
        const coinBalance = await getCoinBalance(accounts[0]);
        const tokenBalance = await getTSPTokenBalance(accounts[0]);
        setAccountBalance({
            tokenBalance,
            coinBalance,
        });
        setAccount(accounts[0]);
        setConnected(true);
    };

    useEffect(() => {
        init();
        if (!window.ethereum) return;

        window.ethereum.on("connect", eagerConnect);
        window.ethereum.on("accountsChanged", handleAccountChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
        window.ethereum.removeListener("accountsChanged", handleAccountChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

 const value = {
        account,
        connected,
        connectWallet,
        disconnectWallet,
        accountBalance,
    };

    return (
        <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
    )
}

export default Web3ContextProvider