import getConfigPolygon from './config_polygon';
import detectEthereumProvider from '@metamask/detect-provider';

//import { Web3 } from 'web3';
const Web3 = require('web3');

//const nearConfig = getConfig(process.env.NODE_ENV || 'development')
const polygonConfig = getConfigPolygon('testnet');

export async function initContractPolygon() {

  if (typeof window.ethereum !== "undefined") {
    window.provider = window.ethereum;
    if (window.ethereum.providers?.length) {
      window.ethereum.providers.forEach(async (p) => {
        if (p.isMetaMask) window.provider = p;
      });
    }
  }

  window.contract_matic_exist = false;
  window.accountIdPolygon = "";
  if (typeof window.provider !== "undefined") {
    if (window.provider && window.provider.isMetaMask) {

      try {
        if (typeof window.provider !== "undefined") {
          const chainId = await window.provider.request({ method: 'eth_chainId' });
          if (chainId === polygonConfig.chainId) {
            const accounts = await window.provider.request({ method: 'eth_accounts' });
            const account = accounts[0];
            window.accountIdPolygon = account;
    
            window.web3 = new Web3(window.provider);
            window.contractMatic = new window.web3.eth.Contract(polygonConfig.abi, Web3.utils.toChecksumAddress(polygonConfig.contract_name));
            window.usdcContract = new window.web3.eth.Contract(polygonConfig.erc20_abi, Web3.utils.toChecksumAddress(polygonConfig.asset_addresses[0]));
            window.claimContract = new window.web3.eth.Contract(polygonConfig.abi_claim, Web3.utils.toChecksumAddress(polygonConfig.claim_contract));
            window.aavePoolAddressProviverContract = new window.web3.eth.Contract(polygonConfig.abi_aave_pool_address_provider, Web3.utils.toChecksumAddress(polygonConfig.contract_aave_pool_address_provider));
            window.contract_matic_exist = true;
//            console.log(window.quoterContract);
          }
        }
      } catch (error) {
        console.log(error);
      }
    
    } else {
    }
  }
}

export async function login_full_metamask() {
  document.cookie = "wallet_polygon=0; path=/";

  if (typeof window.ethereum !== "undefined") {
    window.provider = window.ethereum;
    if (window.ethereum.providers?.length) {
      window.ethereum.providers.forEach(async (p) => {
        if (p.isMetaMask) window.provider = p;
      });
    }

    let changed = null;
    const chainId = await window.provider.request({ method: 'eth_chainId' });
    if (chainId !== polygonConfig.chainId) {
      try {
        await window.provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: polygonConfig.chainId }] });
      } catch (error) {
        changed = 0;
        if (error.code == 4902) {
          try {
            let paramChain = {
              chainId: polygonConfig.chainId,
              chainName: polygonConfig.chainName,
              rpcUrls: polygonConfig.rpcUrls,
              nativeCurrency: polygonConfig.nativeCurrency,
              blockExplorerUrls: polygonConfig.blockExplorerUrls
            }      
            changed = await window.provider.request({ method: 'wallet_addEthereumChain', params: [paramChain] });
          } catch (error_2) {
            console.log("There was an error adding the chain");
            console.log(error_2);
          }
        }
      }
    }
    if (changed == null) {
      document.getElementById('sign-in-button-metamask').onclick = null;
      const accounts = await window.provider.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      window.accountIdPolygon = account;
      window.location.replace(window.location.origin + window.location.pathname);
    }

  } else {
    window.open("https://metamask.io/download/","_self");
  }

}

