import React, {useContext} from 'react'
import {Web3Context} from '../../contexts/Web3Context'
import addressShortener from "../../utils/addressShortener";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
     const {
        connected,
        account,
        accountBalance,
        disconnectWallet,
    } = useContext(Web3Context);
    const connectedAccount = addressShortener(account);
    const tokens = [
        {
            symbol: "MATIC",
            balance: Number(accountBalance.coinBalance).toFixed(2) || 0,
        },
        // {
        //     symbol: "TSP",
        //     balance: Number(accountBalance.assetTokenBalance).toFixed(2) || 0,
        // },
    ];
    return (
        <section className="dashboard">
            <h1>The Startup Place DApp deployed to Polygon Mumbai Testnet</h1>
            {connected ? (
                 <div>
 <ul className="cards">
                        <li className="dashboard-card">
                            <h3 className="dashboard-card-header text-left font-bold">
                                Tokens
                            </h3>
                            {tokens.map((token) => (
                                <p key={token.symbol}>
                                    <span>{token.balance} </span>
                                    {token.symbol}
                                </p>
                            ))}
                        </li>
                    </ul>
                    <button onClick={disconnectWallet}>Disconnect</button>
        </div>
            ): <p>Connect your wallet to get started</p> }
       
            <ToastContainer />
        </section>
    )
}

export default Dashboard