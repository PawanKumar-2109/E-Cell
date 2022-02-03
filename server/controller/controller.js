var Userdb = require('../model/model');
const Web3 = require('web3');
var privatekey = "0dd071a276beaf137e89e44f9932e93b28cf9dbd7b397053cee7241a6382c319";
var winzo_address = '0x63Bb22625d13dF265eC3b5D2bfB71c6F0F05557d';
var contractAddress = '0xbA033Da694f76AAbEFb41b7Dab2Ce66C925d5939';
var abi = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "total",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "delegate",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "delegate",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "numTokens",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenOwner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "numTokens",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "numTokens",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

exports.create = (req,res)=>{
    //new user
    const user = new Userdb({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        balance : 0,
        withdrawal_transactions : [],
        deposit_transactions : []
    })
    //save user
    user
        .save(user)
        .then(data=>{
            res.send("User Signed Up Successfully");
        })
        .catch(err=>{
            res.status(500).send({
                message : "Error"
            });
        });
}


exports.find = (req,res)=>{
    const _email = req.body.email;
    Userdb.find({email:_email}).
    then(user=>{
        res.send(user);
    }).catch(err=>{
        res.send(err);
    })
}



exports.withdraw = async (req,res)=>{
    let _email = req.body.email;
    let myuser = await Userdb.find({email:_email});
    let updated_balance = myuser[0].balance - req.body.amount;
    const web3 = new Web3("https://kovan.infura.io/v3/0c90d17882b84155b6516768f91dd33e");
    let _amount = parseInt(req.body.amount);
    contract = await new web3.eth.Contract(abi,contractAddress);
    let pre_tx = contract.methods.transfer(req.body.address,_amount);
    let gas = await pre_tx.estimateGas({from:winzo_address});
    let gasPrice = await web3.eth.getGasPrice();
    let data = pre_tx.encodeABI();
    let nonce = await web3.eth.getTransactionCount(winzo_address);
    let signed_tx = await web3.eth.accounts.signTransaction({
        from:winzo_address,
        to:contractAddress,
        data,
        gas,
        gasPrice,
        nonce
    },privatekey);
    let _tx = await web3.eth.sendSignedTransaction(signed_tx.rawTransaction);
    await Userdb.updateOne({email:_email},{$set:{balance:updated_balance},$push:{withdrawal_transactions:{amount:req.body.amount,to:req.body.address,tx:_tx}}})
    .then(result=>{
        res.send(result);
    }).catch(err=>{
        res.send(err);
    })
}



exports.request = async (req,res)=>{
    const web3 = new Web3("https://kovan.infura.io/v3/0c90d17882b84155b6516768f91dd33e");
    let _amount = parseInt(req.body.amount);
    contract = await new web3.eth.Contract(abi,contractAddress);
    let pre_tx = contract.methods.transfer(req.body.address,_amount);
    let gas = await pre_tx.estimateGas({from:winzo_address});
    let gasPrice = await web3.eth.getGasPrice();
    let data = pre_tx.encodeABI();
    let nonce = await web3.eth.getTransactionCount(winzo_address);
    let signed_tx = await web3.eth.accounts.signTransaction({
        from:winzo_address,
        to:contractAddress,
        data,
        gas,
        gasPrice,
        nonce
    },privatekey);
    let _tx = await web3.eth.sendSignedTransaction(signed_tx.rawTransaction);
    res.send(_tx);
}


exports.deposit = async (req,res)=>{
    const _email = req.body.email;
    let myuser = await Userdb.find({email:_email});
    let updated_balance = myuser[0].balance + req.body.amount;
    await Userdb.updateOne({email:_email},{$set:{balance:updated_balance},$push:{deposit_transactions:{amount:req.body.amount,tx:req.body.tx}}})
    .then(result=>{
        res.send(result);
    }).catch(err=>{
        res.send(err);
    })
}
