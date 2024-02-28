import time
from web3 import Web3
import json
from dotenv import load_dotenv
import os, logging

load_dotenv()
DAO_CONTRACT_ADDRESS = os.getenv("DAO_CONTRACT_ADDRESS")
INFURA_URL = os.getenv("INFURA_URL")
PRIVATE_KEY = os.getenv("DAO_PRIVATE_KEY")
WALLET_ADDRESS = os.getenv("DAO_PUB_KEY")

web3_provider = Web3.HTTPProvider(INFURA_URL)
web3 = Web3(web3_provider)

with open(f"{os.getcwd()}/data/CredentialDAO.json") as file:
        abi = json.load(file)
contract = web3.eth.contract(address=DAO_CONTRACT_ADDRESS, abi=abi)


async def publish_challenge_to_ledger(domain: str, passphrase: str):
    nonce = web3.eth.get_transaction_count(WALLET_ADDRESS)
    transaction = contract.functions.publishChallenge(domain, passphrase).build_transaction({
        "from": WALLET_ADDRESS,
        "gas": 1000000,
        "gasPrice": web3.to_wei("20", "gwei"),
        "nonce": nonce 
    })


    signed_transaction = web3.eth.account.sign_transaction(transaction, PRIVATE_KEY)
    logging.debug(f"signed transaction: {signed_transaction.rawTransaction}")
    transaction_hash = web3.eth.send_raw_transaction(signed_transaction.rawTransaction)
    # Wait for the transaction receipt
    receipt = None
    while receipt is None:
        receipt = web3.eth.get_transaction_receipt(transaction_hash)
        time.sleep(secs=5)
    return receipt

def has_requested_accelerated_onboarding(domain: str):
     result = contract.functions.hasAppliedForAcceleratedOnboarding(domain).call()
     return result

async def test():
    for el in contract.abi:
        
        if el['type'] == "function" and el['name'] == 'publishChallenge':
            print(el['name'], el)
    result = contract.functions.hasAppliedForAcceleratedOnboarding("optimates.ch").call()
    print(DAO_CONTRACT_ADDRESS, INFURA_URL, result)
    