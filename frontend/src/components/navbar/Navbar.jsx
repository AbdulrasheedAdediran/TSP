import React, {useContext} from 'react'
import {Web3Context} from '../../contexts/Web3Context'
import addressShortener from "../../utils/addressShortener";

function Navbar() {
    const {connectWallet, connected, account} = useContext(Web3Context);
    const connectedAddress = addressShortener(account)
  return (
   <nav className="navbar">
      <h1>The Startup Place</h1>
      <button onClick={connectWallet}>{connected ? connectedAddress : "Connect Wallet"}</button>
    </nav>
  )
}

export default Navbar