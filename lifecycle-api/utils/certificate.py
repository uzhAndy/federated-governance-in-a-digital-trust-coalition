import logging
from dataclasses import dataclass
from enum import Enum
from OpenSSL.crypto import X509
from OpenSSL.crypto import _Key
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5 as Cipher_PKCS1_v1_5
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.asymmetric.types import PublicKeyTypes
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import mnemonic
import base64
from typing import Union
from models.api.agent_lifecycle import ECDHChallenge, RSAChallenge
from models.enums.certificate import CertificateValidation, AlgorithmSignature
from cryptography.hazmat.primitives import serialization

@dataclass
class Certificate():
    valid: bool
    country: str
    state: str
    city: str
    organization: str
    domain: str
    validation_type: CertificateValidation
    pubkey: _Key
    signature_algorithm: bytes

    pubkey = "pubkey"
    signature_algorithm: AlgorithmSignature = AlgorithmSignature.ECDH

def import_private_key(sig_alg: str, fpath: str = "certs"):
    with open(f"{fpath}/TEST_api_private_key_{sig_alg}.pem", "rb") as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None,
            backend=default_backend()
        )

    return private_key

def encrypt_with_ecdh(pubkey, message, sig_alg):
    my_pk = import_private_key(sig_alg)
    my_pubkey = my_pk.public_key()
    shkey = my_pk.exchange(ec.ECDH(), pubkey)
    logging.debug(f"SHARED KEY:\n{shkey.hex()}")

    return encrypt_message_ecdh(shkey, message), my_pubkey

def encrypt_message_ecdh(shared_key, message: str):
    cipher = Cipher(algorithms.AES(shared_key), modes.CFB(b"\0" * 16), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted_message = encryptor.update(message.encode("utf-8")) + encryptor.finalize()

    return encrypted_message

def encrypt_with_rsa(pubkey, seed):
    keyPub = RSA.import_key(pubkey) 
    cipher = Cipher_PKCS1_v1_5.new(keyPub)

    return cipher.encrypt(seed.encode()) 

def generate_challenge_cipher_text(pubkey, signature_algorithm) -> Union[RSAChallenge, ECDHChallenge]:

    key: PublicKeyTypes = serialization.load_pem_public_key(pubkey.encode(), backend=default_backend())
    used_public_key = pubkey.replace("\n", "\n\t\t")

    mnemo = mnemonic.Mnemonic("english")
    seed = mnemo.generate()
    logging.debug(f"Seed: {seed}")
    
    if(signature_algorithm == AlgorithmSignature.RSA.value):
        logging.debug(f"Encrypting seed with {AlgorithmSignature.RSA.name}")
        
        encrypted = encrypt_with_rsa(pubkey, seed)
        shared_seed =  {
            "cipher_text": base64.b64encode(encrypted).decode("utf-8"), 
            "method": AlgorithmSignature.RSA.name,
            "note": "secret is base64 encoded",
            "your_rsa_pubkey": pubkey
            }
        logging.debug(f"\n\tENCRYPTED SEED: {shared_seed['cipher_text']}\n\tUSED PUBLIC KEY:\n\t\t{used_public_key}")
        
    elif(signature_algorithm == AlgorithmSignature.ECDH.value):
        logging.debug(f"Encrypting seed with {AlgorithmSignature.ECDH.name}")

        encrypted, my_pubkey = encrypt_with_ecdh(key, seed, 'ecdsa-with-SHA256')
        my_pubkey_bytes = my_pubkey.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        shared_seed =  {
            "cipher_text": base64.b64encode(encrypted),
            "method": AlgorithmSignature.ECDH.name,
            "note": "secret is base64 encoded",
            "my_pubkey": my_pubkey_bytes,
            "your_pubkey": pubkey,
            }
        my_public_key = my_pubkey_bytes.decode().replace("\n", "\n\t\t")

        logging.debug(f"\n\tENCRYPTED SEED: {shared_seed['cipher_text']}\n\tMY PUBLIC KEY: \n\t\t{my_public_key}\n\tUSED PUBLIC KEY: \n\t\t{used_public_key}")
    return shared_seed

def dencrypt_with_ecdh(pubkey, message, sig_alg):

    secret = base64.b64decode(message)

    def decrypt_message_ecdh(shkey, message):
        cipher = Cipher(algorithms.AES(shkey), modes.CFB(b"\0" * 16), backend=default_backend())
        decryptor = cipher.decryptor()
        decrypted_message = decryptor.update(message.decode("utf-8")) + decryptor.finalize()
        return decrypted_message

    my_pk = import_private_key(sig_alg)
    shkey = my_pk.exchange(ec.ECDH(), pubkey)

    return decrypt_message_ecdh(shkey, secret)