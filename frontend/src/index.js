//import 'regenerator-runtime/runtime'
import { login_full_metamask, initContractPolygon } from './utils'

import getConfigPolygon from './config_polygon'
//import { async } from 'regenerator-runtime'
//const { networkId } = getConfig(process.env.NODE_ENV || 'development')
const polygonConfig = getConfigPolygon('testnet');

//import { init_env } from '@ref-finance/ref-sdk'
//import { ftGetTokenMetadata, getPoolEstimate, getPoolByIds } from '@ref-finance/ref-sdk'

//init_env('testnet');
//console.log(typeof process.env.NODE_ENV);

// Displaying the signed in flow container and fill in account-specific data
async function signedInFlow() {

  document.getElementById("blocker").style.display = 'block';

  if (document.getElementById("button_network").checked) {
    document.getElementById('blocker_img_near').style.display = "none";
    document.getElementById('blocker_img_polygon').style.display = "inline-flex";
  } else {
    document.getElementById('blocker_img_near').style.display = "inline-flex";
    document.getElementById('blocker_img_polygon').style.display = "none";
  }

  document.querySelector('#signed-in-flow').style.display = 'block';
  document.querySelector('#signed-out-flow').style.display = 'none';

  // if (parseInt(window.getCookie("state")) == 0) {
  //   document.querySelector('#account').style.display = 'block';
  // } else if (parseInt(window.getCookie("state")) == 1) {
  //   document.querySelector('#governance').style.display = 'block';
  // }

  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = window.accountId;
  });

  // populate links in the notification box
  // try {
  //   const accountLink = document.querySelector('[data-behavior=notification] a:nth-of-type(1)');
  //   accountLink.href = accountLink.href + window.accountId;
  //   accountLink.innerText = '@' + window.accountId;
  //   const contractLink = document.querySelector('[data-behavior=notification] a:nth-of-type(2)');
  //   contractLink.href = contractLink.href + window.contract.contractId;
  //   contractLink.innerText = '@' + window.contract.contractId;

  //   // update with selected networkId
  //   accountLink.href = accountLink.href.replace('testnet', networkId);
  //   contractLink.href = contractLink.href.replace('testnet', networkId);
  // } catch (error) {
  //   console.log(error);
  // }

  await fetchBalance();
  // window.addEventListener("focus", async function () {
  //   await fetchBalance();
  // }, false);

  document.getElementById("blocker").style.display = 'none';

}

function commarize(x) {
  // Alter numbers larger than 1k
  if (x >= 1e3) {
    var units = ["k", "M", "B", "T", "Q"];
    var order = Math.floor(Math.log(x) / Math.log(1000));
    var unitname = units[(order - 1)];
    var num = Math.round(x * 100000 / 1000 ** order) / 100000;
    // output number remainder + unitname
    return num + unitname
  }
  return Math.round(x * 100000) / 100000;
}

// update global currentGreeting variable; update DOM with it
async function fetchBalance() {
  let blockchain = "";

  window.apy = 0;
  blockchain = "MATIC";
  document.getElementById("label_native_balance").innerHTML = "Balance Wallet";
  let account_string = String(window.accountIdPolygon);
  if (account_string.length >= 18 && account_string.length > 0) {
    document.getElementById("account_id").style.display = 'inline-flex';
    document.getElementById("sign-out-button").style.borderTopLeftRadius = '0px';
    document.getElementById("sign-out-button").style.borderBottomLeftRadius = '0px';
    document.getElementById("account_id").innerHTML = '<i class="fa fa-address-book-o" aria-hidden="true" style="padding-right: 0.5em;"></i>' + " " + account_string.substring(0, 12) + "...";
  } else {
    document.getElementById("account_id").innerHTML = '<i class="fa fa-address-book-o" aria-hidden="true" style="padding-right: 0.5em;"></i>';
    document.getElementById("account_id").style.display = 'none';
    document.getElementById("sign-out-button").style.borderTopLeftRadius = '10px';
    document.getElementById("sign-out-button").style.borderBottomLeftRadius = '10px';
  }

  if (await metamask_isSignedIn()) {
    document.getElementById('sign-out-button').innerHTML = '<i class="fa-solid fa-link"></i>';
    document.getElementById('sign-out-button').style.width = '3em';
    document.querySelector('#sign-out-button').onclick = null;
  } else {
    document.getElementById('sign-out-button').innerHTML = "Connect";
    document.querySelector('#sign-out-button').onclick = login;
    document.getElementById('sign-out-button').style.width = '8em';
    window.accountIdPolygon = "";
  }

  window.contract_name = polygonConfig.contract_name;
  document.getElementById("sign-out-button").disabled = false;
  document.getElementById("contract_label").innerHTML = "<strong>Contract:</strong> " + String(window.contract_name);

  //First load LendingPoolAddressProvider contract
  //Call Lending Pool function to get the relevant Lending pool contract
  //Load the lendingPool contract with that address
  //We need to know the reserve addresses of the tokens to pass them to the deposit method of the lendinpool contract
  //redeem needs to be done from the token aToken.
  //aToken contract address needs to be requested with the lendingPool.getReserveData.aTokenAddress   
  //Load aToken and call the method redeem with the amount to redeem.    

  if (window.contract_matic_exist) {
    let a = await window.aavePoolAddressProviverContract.methods.getPool().call({ from: window.provider.selectedAddress });
    window.aavePoolContract = new window.web3.eth.Contract(polygonConfig.abi_aave_pool_address, a);

    // let b = await window.aavePoolContract.methods.getReservesList().call();
    // for (let j = 0; j < b.length; j++) {
    //   let atoken = ( await window.aavePoolContract.methods.getReserveData(b[j]).call() ).aTokenAddress;
    //   window.atokenContract = new window.web3.eth.Contract(polygonConfig.abi_atoken, atoken);
    //   console.log( await window.atokenContract.methods.UNDERLYING_ASSET_ADDRESS().call() );
    // }

    let asset_loans_info = [];
    for (let j = 0; j < 1; j++) {
      asset_loans_info.push(await window.aavePoolContract.methods.getReserveData(polygonConfig.asset_addresses[j]).call());
    }

    for (let j = 0; j < 1; j++) {
      let x1 = parseInt(asset_loans_info[j].aTokenAddress);
      if (x1 > 0) {
        window.apy = parseFloat(asset_loans_info[j].currentLiquidityRate) / 10 ** 25;
      } else {
      }

    }
  }

  let balance = 0;
  let native_balance = 0;
  let dollar_native = 0;
  let dollar_depo = 0;
 
  window.wallet_balance = 0;
  window.protocol_balance = 0;
  window.protocol_premium = 0;
  //    console.log("check balances");
  try {
    if (window.contract_matic_exist) {

      if (window.accountIdPolygon !== "" && await metamask_isSignedIn()) {
        window.protocol_balance = await window.contractMatic.methods.assetsOf( window.accountIdPolygon ).call({});
        window.wallet_balance =  await window.usdcContract.methods.balanceOf( window.accountIdPolygon ).call({});
        window.protocol_premium = await window.claimContract.methods.computePremium( 10000 ).call({});
        window.protocol_premium = window.protocol_premium / 100;

        window.protocol_balance = Math.round(parseInt(window.protocol_balance) * 100000 / 10 ** 18) / 100000;
        window.wallet_balance = Math.round(parseInt(window.wallet_balance) * 100000 / 10 ** 18) / 100000;

        if (window.protocol_balance > 0) {
          document.getElementById("btn_withdraw").disabled = false;
        } else {
          document.getElementById("btn_withdraw").disabled = true;
        }

        if (window.wallet_balance > 0) {
          document.getElementById("btn_deposit").disabled = false;
        } else {
          document.getElementById("btn_deposit").disabled = true;
        }
      }

    } else {

      document.getElementById("btn_withdraw").disabled = true;
      document.getElementById("btn_deposit").disabled = true;

    }

  } catch (error) {
    console.log(error);
    document.getElementById("btn_withdraw").disabled = true;
    document.getElementById("btn_deposit").disabled = true;

  }

  //gas_fee = window.gas_price.gas_price * (300 * 10 ** 12 / 10 ** 24);
  document.getElementById("l_balance").innerHTML = commarize(window.protocol_balance) + ' ' + 'USDC';
  document.getElementById("l_balance_native").innerHTML = commarize(window.wallet_balance) + ' ' + 'USDC';
  document.getElementById("total_ser").innerHTML = "Premium Cost: " + commarize(window.protocol_premium) + ' ' + ' %';

  window.blockchain = blockchain;

  document.getElementById("ser_balance").innerHTML = 'APY &nbsp; ' + commarize(window.apy) + ' %';
  document.getElementById("total_usd").innerHTML = "$ " + commarize(dollar_native);
  //from here

  document.getElementById("depo_near").innerHTML = '$ ' + commarize(dollar_depo);

}

document.getElementById("approve").onclick = async function () {

  document.body.style.cursor = 'progress';
  document.getElementById("blocker").style.display = 'block';
  document.documentElement.style.overflow = 'hidden';
  document.documentElement.style.touchAction = 'none';

  if (window.actual_action === "BUY") {

    const submit = document.querySelectorAll(".button_small_perc");
    submit.forEach((btn) => {
      btn.style.backgroundColor = "var(--light-gray)";
      btn.style.color = "#8b949b";
    });
    //      alert( get_distro() );

    if (window.getCookie("network") == 0) {
    } else if (window.getCookie("network") == 1) {
      let value = BigInt(Math.round(document.getElementById("fname").value * 100000000)) * BigInt(10000000000);
      value = value.toString();

      document.getElementById("fname").value = "";
      document.getElementById("approve").disabled = true;
      document.getElementById("cancel").disabled = true;

      if (value > 0 && window.contract_matic_exist == true) {
        try {
          let result0 = await window.usdcContract.methods.approve( polygonConfig.contract_name, value ).send({ from: window.provider.selectedAddress, gas: 3000000 });
          let result1 = await window.contractMatic.methods.depositAsset( value ).send({ from: window.provider.selectedAddress, gas: 3000000 });
        } catch (error) {
          console.log(error);
        }
      }

    }

  } else if (window.actual_action === "SELL") {

    document.getElementById("approve").disabled = true;
    document.getElementById("cancel").disabled = true;

    const submit = document.querySelectorAll(".button_small_perc");
    submit.forEach((btn) => {
      btn.style.backgroundColor = "var(--light-gray)";
      btn.style.color = "#8b949b";
    });

    if (window.getCookie("network") == 0) {
    } else if (window.getCookie("network") == 1) {

      let value = BigInt(Math.round(document.getElementById("fname").value * 1000 / window.protocol_balance));
      console.log(value);

      if (value > 1000) {
        value = 1000;
      }
      value = value.toString();

      if (value > 0 && window.contract_matic_exist == true) {
        try {
          let result = await window.contractMatic.methods.withdrawAsset(BigInt(value)).send({ from: window.provider.selectedAddress, gas: 3000000 });
        } catch (error) {
          console.log(error);
        }
      }

    }

  }

  document.getElementById("fname").value = "";
  //  await fetchBalance();
  document.body.style.cursor = 'default';
  document.getElementById("blocker").style.display = 'none';
  document.documentElement.style.overflow = 'visible';
  document.documentElement.style.touchAction = 'auto';
  window.location.replace(window.location.origin + window.location.pathname);

}

const check_buttons = document.querySelectorAll(".checkpoint");
check_buttons.forEach((btn) => {
  btn.onclick = async function () {
    let tid = btn.getAttribute('id').slice(5, undefined);
    let tid_type = tid.charAt(tid.length - 1);

    if (tid_type !== 'w') {

      tid = parseInt(tid) - 1;

      if (window.getCookie("network") == 0) {

        let assets = await window.contract.get_assets({ "account": window.accountId });

        if (window.contract_exist == true && assets[tid] > 0) {

          const args = { token_ids: tid };
          document.body.style.cursor = 'progress';
          document.getElementById("blocker").style.display = 'block';
          document.documentElement.style.overflow = 'hidden';
          document.documentElement.style.touchAction = 'none';

          try {

            let a = await account.signAndSendTransaction(
              {
                receiverId: window.contract_name,
                actions: [
                  transactions.functionCall("supply_lending", Buffer.from(JSON.stringify(args)), 300000000000000, "1"),
                ]
              }
            );

          } catch (error) {
            alert(error);
          }

          //          await fetchBalance();
          document.body.style.cursor = 'default';
          document.getElementById("blocker").style.display = 'none';
          document.documentElement.style.overflow = 'visible';
          document.documentElement.style.touchAction = 'auto';
          window.location.replace(window.location.origin + window.location.pathname);

        }

      } else if (window.getCookie("network") == 1) {

        let assets = await window.contractMatic.methods.assetsOf(window.accountIdPolygon).call({ from: window.provider.selectedAddress });
        let assets_loans = [];
        for (let i = 0; i < assets.length; i++) {
          assets_loans.push(await window.contractMatic.methods.assetsLoansID(window.accountIdPolygon, i).call({ from: window.provider.selectedAddress }));
        }

        if (window.contract_matic_exist == true && assets[tid] > 0) {

          const args = { token_ids: tid };
          document.body.style.cursor = 'progress';
          document.getElementById("blocker").style.display = 'block';
          document.documentElement.style.overflow = 'hidden';
          document.documentElement.style.touchAction = 'none';

          try {

            let a = await window.contractMatic.methods.supplyLendToken(tid).send({ from: window.provider.selectedAddress, gas: 3000000 });

          } catch (error) {
            alert(error);
          }

          //          await fetchBalance();
          document.body.style.cursor = 'default';
          document.getElementById("blocker").style.display = 'none';
          document.documentElement.style.overflow = 'visible';
          document.documentElement.style.touchAction = 'auto';
          window.location.replace(window.location.origin + window.location.pathname);

        }

      }

    } else {

      tid = parseInt(tid.slice(0, tid.length - 2)) - 1;

      if (window.getCookie("network") == 0) {

        let assets_loans = await window.contract.get_assets_loans({ "account": window.accountId });

        if (window.contract_exist == true && assets_loans[tid] > 0) {

          const args = { token_ids: tid };

          document.body.style.cursor = 'progress';
          document.getElementById("blocker").style.display = 'block';
          document.documentElement.style.overflow = 'hidden';
          document.documentElement.style.touchAction = 'none';

          try {

            let a = await account.signAndSendTransaction(
              {
                receiverId: window.contract_name,
                actions: [
                  transactions.functionCall("withdraw_lending", Buffer.from(JSON.stringify(args)), 300000000000000, "1"),
                ]
              }
            );

          } catch (error) {
            alert(error);
          }

          //          await fetchBalance();
          document.body.style.cursor = 'default';
          document.getElementById("blocker").style.display = 'none';
          document.documentElement.style.overflow = 'visible';
          document.documentElement.style.touchAction = 'auto';
          window.location.replace(window.location.origin + window.location.pathname);
        }

      } else if (window.getCookie("network") == 1) {

        let assets = await window.contractMatic.methods.assetsOf(window.accountIdPolygon).call({ from: window.provider.selectedAddress });
        let assets_loans = [];
        for (let i = 0; i < assets.length; i++) {
          assets_loans.push(await window.contractMatic.methods.assetsLoansID(window.accountIdPolygon, i).call({ from: window.provider.selectedAddress }));
        }

        if (window.contract_matic_exist == true && assets_loans[tid] > 0) {

          const args = { token_ids: tid };
          document.body.style.cursor = 'progress';
          document.getElementById("blocker").style.display = 'block';
          document.documentElement.style.overflow = 'hidden';
          document.documentElement.style.touchAction = 'none';

          try {

            let a = await window.contractMatic.methods.withdrawLendToken(tid).send({ from: window.provider.selectedAddress, gas: 3000000 });

          } catch (error) {
            alert(error);
          }

          //          await fetchBalance();
          document.body.style.cursor = 'default';
          document.getElementById("blocker").style.display = 'none';
          document.documentElement.style.overflow = 'visible';
          document.documentElement.style.touchAction = 'auto';
          window.location.replace(window.location.origin + window.location.pathname);

        }


      }

    }

  };
});

// document.getElementById("btn_rebalance").onclick = async function () {

//   let new_portfolio = get_distro();
//   let sum = 0;
//   for (let i = 0; i < new_portfolio.length; i++) {
//     let x_con = Math.round(1000 * window.distro_user[i]);
//     sum += Math.abs(new_portfolio[i] - x_con) / 1000.0;
//   }

//   if (window.getCookie("network") == 0) {

//     if (sum > 0.02 && window.contract_exist == true) {

//       document.body.style.cursor = 'progress';
//       document.getElementById("blocker").style.display = 'block';
//       document.documentElement.style.overflow = 'hidden';
//       document.documentElement.style.touchAction = 'none';

//       if (window.contract_exist == true) {
//         try {

//           let distro_1 = get_distro();
//           let distro_final = [];
//           //        distro_final.push(0);
//           for (i = 0; i < distro_1.length; i++) {
//             distro_final.push(distro_1[i]);
//           }
//           const args1 = { portfolio: distro_final };

//           let a = await account.signAndSendTransaction(
//             {
//               receiverId: window.contract_name,
//               actions: [
//                 transactions.functionCall("rebalance_portfolio", Buffer.from(JSON.stringify(args1)), 300000000000000, "1"),
//               ]
//             }
//           );

//         } catch (error) {
//           alert(error);
//         }
//       }

//       await fetchBalance();
//       document.body.style.cursor = 'default';
//       document.getElementById("blocker").style.display = 'none';
//       document.documentElement.style.overflow = 'visible';
//       document.documentElement.style.touchAction = 'auto';
//       window.location.replace(window.location.origin + window.location.pathname);
//     } else {
//       alert("The new distribution is less than 2% different from the user's one.");
//     }
//   } else if (window.getCookie("network") == 1) {

//     if (sum > 0.02 && window.contract_matic_exist == true) {

//       document.body.style.cursor = 'progress';
//       document.getElementById("blocker").style.display = 'block';
//       document.documentElement.style.overflow = 'hidden';
//       document.documentElement.style.touchAction = 'none';

//       let distro_1 = get_distro();
//       let distro_final = [];
//       //        distro_final.push(0);
//       for (i = 0; i < distro_1.length; i++) {
//         distro_final.push(distro_1[i]);
//       }

//       try {
//         let result = await window.contractMatic.methods.redistributeDistribution(distro_final).send({ from: window.provider.selectedAddress, gas: 3000000 });
//       } catch (error) {
//         console.log(error);
//       }

//       await fetchBalance();
//       document.body.style.cursor = 'default';
//       document.getElementById("blocker").style.display = 'none';
//       document.documentElement.style.overflow = 'visible';
//       document.documentElement.style.touchAction = 'auto';
//       window.location.replace(window.location.origin + window.location.pathname);

//     } else {
//       alert("The new distribution is less than 2% different from the user's one.");
//     }
//   }

// }

// document.getElementById("vote_0_right").onclick = function () {
//   document.getElementById("vote_div_0_1").style.display = "none";
//   if (window.is_mobile == false) {
//     document.getElementById("vote_div_0_2").style.display = "inline-block";
//   } else {
//     document.getElementById("vote_div_0_2").style.display = "block";
//   }
//   //      document.getElementById("vote1_label").innerHTML = "Previous";
//   document.getElementById("vote_0_right").disabled = true;
//   document.getElementById("vote_0_left").disabled = false;
//   plot_distro_manual(0);
//   plot_price_manual(0);
// }
// document.getElementById("vote_0_left").onclick = function () {
//   if (window.is_mobile == false) {
//     document.getElementById("vote_div_0_1").style.display = "inline-flex";
//   } else {
//     document.getElementById("vote_div_0_1").style.display = "block";
//   }
//   document.getElementById("vote_div_0_2").style.display = "none";
//   //      document.getElementById("vote1_label").innerHTML = "Your Proposal";
//   document.getElementById("vote_0_right").disabled = false;
//   document.getElementById("vote_0_left").disabled = true;
//   plot_distro_manual(0);
//   plot_price_manual(0);
// }

document.getElementById("button_network").onclick = async function () {

  document.getElementById("blocker").style.display = 'block';

  if (document.getElementById("button_network").checked) {
    //NEAR -> MATIC
    window.contract_name = polygonConfig.contract_name;
    document.cookie = "network=1; path=/";
    document.getElementById('blocker_img_near').style.display = "none";
    document.getElementById('blocker_img_polygon').style.display = "inline-flex";
    window.asset_labels = ['MATIC', 'BTC', 'ETH', 'LINK', 'USDC'];

    window.net_line = "p_";
    window.polygonInitPromise = initContractPolygon().then(() => { signedInFlow() }).catch(console.error);
    document.getElementById('link_wallet').href = "";
    document.getElementById('box2').className = "calculation-box calculation-box-polygon";

  } else {
    //MATIC -> NEAR
    window.contract_name = nearConfig.contract_name;
    document.cookie = "network=0; path=/";
    document.getElementById('blocker_img_near').style.display = "inline-flex";
    document.getElementById('blocker_img_polygon').style.display = "none";
    window.asset_labels = ['NEAR', 'BTC', 'ETH', 'SOL', 'USDC'];

    for (let i = 0; i < window.asset_labels.length; i++) {
      document.getElementById(String(i + 1) + 'coin').innerText = window.asset_labels[i];
    }

    window.net_line = "";
    window.nearInitPromise = initContract().then(() => { signedInFlow() }).catch(console.error);
    document.getElementById('link_wallet').href = window.nearWalletUrl;
    document.getElementById('box2').className = "calculation-box calculation-box-near";

  }

}

document.getElementById("btn_deposit").onclick = function () {
  document.getElementById("blocker_transaction").style.display = "block";
  document.getElementById("div_deposit").style.display = "block";
  if (window.getCookie("network") == 0) {
    document.getElementById("label_popup").innerHTML = "Deposit NEAR";
    window.actual_action = "BUY";
    document.getElementById("fname").placeholder = "amount (NEAR)";
    document.getElementById("pop_balance").innerHTML = 'Balance: ' + window.near_asset + ' ' + window.blockchain.toString();
  } else if (window.getCookie("network") == 1) {
    document.getElementById("label_popup").innerHTML = "Deposit USDC";
    window.actual_action = "BUY";
    document.getElementById("fname").placeholder = "amount (USDC)";
    document.getElementById("pop_balance").innerHTML = 'Balance: ' + window.near_asset + ' ' + window.blockchain.toString();
  }
}

document.getElementById("btn_withdraw").onclick = function () {
  document.getElementById("blocker_transaction").style.display = "block";
  document.getElementById("div_deposit").style.display = "block";
  if (window.getCookie("network") == 0) {
    document.getElementById("label_popup").innerHTML = "Withdraw NEAR";
    window.actual_action = "SELL";
    document.getElementById("fname").placeholder = "amount (NEAR)";
    document.getElementById("pop_balance").innerHTML = 'Balance: ' + window.depo_asset + ' ' + window.blockchain.toString();
  } else if (window.getCookie("network") == 1) {
    document.getElementById("label_popup").innerHTML = "Withdraw USDC";
    window.actual_action = "SELL";
    document.getElementById("fname").placeholder = "amount (USDC)";
    document.getElementById("pop_balance").innerHTML = 'Balance: ' + window.depo_asset + ' ' + ' USDC';
  }
}

window.getCookie = function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  if (cname === "network") {
    return 1;
  } else {
    return 0;
  }
}

document.getElementById('back_from_wallet').onclick = function () {
  signedInFlow();
}

function login() {
  document.getElementById('signed-out-flow').style.display = "block";
  document.querySelector('#signed-in-flow').style.display = 'none';
  if (window.getCookie("network") == 0) {
    const list_wallets = document.querySelectorAll('.wallet_selector');
    list_wallets.forEach(element => {
      element.style.display = 'inline-flex';
    });
    document.querySelector('.wallet_selector_polygon').style.display = 'none';
  } else {
    const list_wallets = document.querySelectorAll('.wallet_selector');
    list_wallets.forEach(element => {
      element.style.display = 'none';
    });
    document.querySelector('.wallet_selector_polygon').style.display = 'inline-flex';
  }
}

async function metamask_isSignedIn() {
  //  console.log("metamask function");
  try {

    if (typeof window.ethereum !== "undefined") {
      window.provider = window.ethereum;
      if (window.ethereum.providers?.length) {
        window.ethereum.providers.forEach(async (p) => {
          if (p.isMetaMask) window.provider = p;
        });
      }
    }

    if (typeof window.provider !== "undefined") {
      const accounts = await window.provider.request({ method: 'eth_accounts' });
      const chainId = await window.provider.request({ method: 'eth_chainId' });
      if (accounts && accounts.length > 0 && chainId === polygonConfig.chainId) {
        return true;
      }
    }
  } catch (error) {
  }
  return false;
}

// `nearInitPromise` gets called on page load
// window.nearInitPromise = initContract().then(() => { signedInFlow(); }).catch(console.error);
//window.polygonInitPromise = initContractPolygon().then(() => { signedInFlow(); }).catch(console.error);

try {
  if (typeof window.ethereum !== "undefined") {
    window.provider = window.ethereum;
    if (window.ethereum.providers?.length) {
      window.ethereum.providers.forEach(async (p) => {
        if (p.isMetaMask) window.provider = p;
      });
    }
  }
  if (typeof window.provider !== "undefined") {
    window.provider.on('accountsChanged', async () => {
      window.location.replace(window.location.origin + window.location.pathname);
    });

    window.provider.on('chainChanged', function (networkId) {
      window.location.replace(window.location.origin + window.location.pathname);
    });
  }
} catch (error) {
}

document.querySelector('#sign-in-button-metamask').onclick = login_full_metamask;