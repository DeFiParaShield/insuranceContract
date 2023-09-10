# Project

Here you find the frondend, backend in apiCode (code in python for oracle), and smart contracts deployed in Polygon and Scroll. The oracle to build the best yield cross-chain, it is deployed in Arbitrum and writes into Polygon.

# Contracts

Polygon Insurance (for deposits and withdrawals): 0xff4bF7486cd9ee16bD2C17DbcaF531064dE0e25A
Scroll Sepolia Insurance: 0xAF1E808Ed090df0eD0Adb1952C0B618fb3Aa9BbC

Polygon Claiming Contract (for claiming and premium calculations): 0xdAf9f2EF84cCb7B247EaB7cB55a66964e373EEcB
Scroll Sepolia Claiming Contract: 0xDd02E3b2480473E1758a1c80F700348aB45216d2

Now, for the cross-chain search of the best API, there are two more smart contracts deployed on Arbitrum and Polygon, respectively.
The apyAAVE contract is deployed on each chain to search for the its own:

Mumbai deployment: 0x12CB9c0e8ef735f0D5e4F5E3D395D7C32242CfD3
Sepolia deployment: 0xDd02E3b2480473E1758a1c80F700348aB45216d2
Arbitrum deployment: 0xDd02E3b2480473E1758a1c80F700348aB45216d2

And the yieldSeeker smart contract send the data to polygon. It has been deployed only in Arbitrum at the moment:

Address: 0x2440CEdAA7b162f53eC462EA8013ec2c392F7fe5

There is one successful transaction to the cross call contract, and it can be found with the hash: 

Successful hash in Arbitrum: 0x186aa2bebb2f9514ebb89a4a7bafebe754315a94db0641e07a020d6f20f8d2bc

Thank you for your patience, and sorry for not being more detailed due to time constrains.


