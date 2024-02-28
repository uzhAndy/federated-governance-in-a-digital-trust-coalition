import base64
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
secret_b64 = "secret"
secret=base64.b64decode(secret_b64)
pk_str="""-----BEGIN PRIVATE KEY-----
FRIST_ROW_PRIVATE_KEY
SECOND_ROW_PRIVATE_KEY
THIRD_ROW_PRIVATE_KEY
-----END PRIVATE KEY-----"""
my_pk = serialization.load_pem_private_key(pk_str.encode(), password=None, backend=default_backend())

pub_key="""-----BEGIN PUBLIC KEY-----
FIRST_ROW_ENCRYPTORS_PUBLIC_KEY
SECOND_ROW_ENCRYPTORS_PUBLIC_KEY
-----END PUBLIC KEY-----"""
their_pubkey = serialization.load_pem_public_key(pub_key.encode())
shkey = my_pk.exchange(ec.ECDH(), their_pubkey)        
cipher = Cipher(algorithms.AES(shkey), modes.CFB(b"\0" * 16), backend=default_backend())
decryptor = cipher.decryptor()
secret
secret_b64
decrypted_message = decryptor.update(secret) + decryptor.finalize()