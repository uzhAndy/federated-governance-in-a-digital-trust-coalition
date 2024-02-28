import base64
import logging
import random
import ssl
from string import ascii_letters
from models.api.agent_lifecycle import ChallengeParameters
from utils.certificate import generate_challenge_cipher_text
from utils.web3 import has_requested_accelerated_onboarding, publish_challenge_to_ledger
from typing import Union
from models.api.agent_lifecycle import RSAChallenge, ECDHChallenge
import requests
from Crypto.Cipher import PKCS1_v1_5 as Cipher_PKCS1_v1_5
from Crypto.PublicKey import RSA
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.asymmetric.types import PublicKeyTypes
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from OpenSSL.crypto import FILETYPE_PEM, X509, dump_publickey, load_certificate
from pyasn1.codec.ber import decoder
from pyasn1_modules import rfc5280

from utils.certificate import Certificate
from models.enums.certificate import AlgorithmSignature, CertificateValidation, SubjectComponents

async def get_certificate_policy(domain_name: str):
    try:
        if(domain_name.startswith("https")):
            domain = domain_name.replace("https://", "")
        elif(domain_name.startswith("http")):
            domain = domain_name.replace("http://", "")
        else:
            domain = domain_name
        x509 = await retrieve_ssl_certificate(domain)
        cert: Certificate = parse_certificate_data(x509)
        is_reputable = (cert.validation_type == CertificateValidation.EV or cert.validation_type == CertificateValidation.OV)
        is_valid = cert.valid
        return (is_reputable and is_valid), 200
    except:
        return False, 500

async def generate_joiner_challenge(body: ChallengeParameters, mocked: bool = False):
    domain = body.domain
    if(domain.startswith("https")):
        domain = domain.replace("https://", "")
    if(domain.startswith("http")):
        domain = domain.replace("http://", "")
    
    x509 = await retrieve_ssl_certificate(domain)
    cert: Certificate = parse_certificate_data(x509)
    print(f"Certificate policy: {cert.validation_type}")


    if(not cert.valid):
        return {"message": "invalid ssl certificate"}, 400 
    else:
        if mocked:
            challenge: Union[RSAChallenge, ECDHChallenge] = generate_challenge_cipher_text(cert.pubkey, cert.signature_algorithm)    
        if not mocked:
            if cert.validation_type.value == CertificateValidation.NONE or cert.validation_type.value == CertificateValidation.DV:
                return {"message": "Domain does not qualify for accelerated join. Only available for domains with EV and OV TLS certificate"}, 400 
            legit_request = has_requested_accelerated_onboarding(domain)
            if not legit_request:
                return {"message": "Domain has not been registered"}, 400 
            challenge: Union[RSAChallenge, ECDHChallenge] = generate_challenge_cipher_text(cert.pubkey, cert.signature_algorithm)
            response = publish_challenge_to_ledger(domain, challenge['cipher_text'].decode())
        # todo log registering
        logging.info(f"[JOINER EVENT] Registering seed executed. {challenge['cipher_text']}. Is mocked: {mocked}")
        

        return challenge, 201

def request_membership(email: str, firstname, lastname, company_name, company_industry, company_domain):
    logging.debug(f"Requesting membership for {firstname, lastname} on behalf of {company_name} (Industry: {company_industry}, Domain: {company_domain})")
    if(not same_email_and_website_domain(email, company_domain)):
        return "invalid email and domain combination", "", "", 400
    
    x509 = retrieve_ssl_certificate(company_domain)
    cert = parse_certificate_data(x509)
    logging.debug(f"Certificate policy: {cert.validation_type}")
    
    if(not cert.valid):
        return {"message": "invalid ssl certificate"}, 400 
    if(cert.validation_type == CertificateValidation.NONE or cert.validation_type == CertificateValidation.DV):
        return {"message": "TODO start vote on dao"}, 400
    else:
        # TODO register wallet in DAO on blockchain
        message, status = register_seed_on_indy(cert.pubkey, company_domain, cert.signature_algorithm)
        # todo log registering
        logging.info(f"[JOINER EVENT] Registering seed executed. {status}")
        
        return message, status

def same_email_and_website_domain(email: str, domain: str):
    email_domain = email.split("@")[1]
    company_domain = domain.split(".")[-2]
    return email_domain.find(company_domain) > -1


def import_private_key(sig_alg):    
    with open(f"certs/TEST_api_private_key_{sig_alg.decode()}.pem", "rb") as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None,
            backend=default_backend()
        )

    return private_key
    

def encrypt_with_rsa(pubkey, seed):
    keyPub = RSA.import_key(pubkey) 
    cipher = Cipher_PKCS1_v1_5.new(keyPub)

    return cipher.encrypt(seed.encode()) 


def encrypt_message_ecdh(shared_key, message: str):
    cipher = Cipher(algorithms.AES(shared_key), modes.CFB(b"\0" * 16), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted_message = encryptor.update(message.encode("utf-8")) + encryptor.finalize()

    return encrypted_message


def encrypt_with_ecdh(pubkey, message, sig_alg):
    my_pk = import_private_key(sig_alg)
    my_pubkey = my_pk.public_key()
    shkey = my_pk.exchange(ec.ECDH(), pubkey)

    return encrypt_message_ecdh(shkey, message), my_pubkey


def register_seed_on_indy(pubkey, domain, signature_algorithm):

    def perform_request():
        data = {"alias": domain, "seed": seed, "role": ""}
        logging.debug(f"Registering {domain} on ledger with seed {seed} ")
        return requests.post("http://127.0.0.1:9000/register", json=data)
    
    seed = "".join(random.choice(ascii_letters) for i in range(31))
    key: PublicKeyTypes = serialization.load_pem_public_key(pubkey.encode(), backend=default_backend())
    used_public_key = pubkey.replace("\n", "\n\t\t")
    
    
    if(signature_algorithm == AlgorithmSignature.RSA.value):
        logging.debug(f"Encrypting seed with {AlgorithmSignature.RSA.name}")
        
        encrypted = encrypt_with_rsa(pubkey, seed)
        shared_seed =  {
            "encrypted_seed": base64.b64encode(encrypted).decode("utf-8"), 
            "your_rsa_pubkey": pubkey
            }
        logging.debug(f"\n\tENCRYPTED SEED: {shared_seed['encrypted_seed']}\n\tUSED PUBLIC KEY:\n\t\t{used_public_key}")
        
    elif(signature_algorithm == AlgorithmSignature.ECDH.value):
        logging.debug(f"Encrypting seed with {AlgorithmSignature.ECDH.name}")

        encrypted, my_pubkey = encrypt_with_ecdh(key, seed, b'ecdsa-with-SHA256')
        my_pubkey_bytes = my_pubkey.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )

        my_public_key = my_pubkey_bytes.decode().replace("\n", "\n\t\t")
        
        shared_seed =  {
            "encrypted_seed": base64.b64encode(encrypted).decode("utf-8"),
            "my_pubkey": my_pubkey_bytes,
            "your_pubkey": pubkey
            }

        logging.debug(f"\n\tENCRYPTED SEED: {shared_seed['encrypted_seed']}\n\tMY PUBLIC KEY: \n\t\t{my_public_key}\n\tUSED PUBLIC KEY: \n\t\t{used_public_key}")
    req = perform_request()
    
    
    if req.status_code == 200:
        return {"message": f"Successfully registered seed on ledger.", "shared_seed": shared_seed}, 201
    else:
        return {"message": f"something went wrong"}, req.status_code
    

async def retrieve_ssl_certificate(url: str) -> X509:
    cert = ssl.get_server_certificate((url, 443))
    return load_certificate(FILETYPE_PEM, cert)


def parse_certificate_data(x509: X509) -> Certificate:
    valid = not x509.has_expired()
    subject_components = x509.get_subject().get_components()
    pubkey = extract_public_key(x509)
    sig_alg = x509.get_pubkey().type()

    country = extract_subject_component(SubjectComponents.COUNTRY.value, subject_components)
    state = extract_subject_component(SubjectComponents.STATE.value, subject_components)
    city = extract_subject_component(SubjectComponents.CITY.value, subject_components)
    organization = extract_subject_component(SubjectComponents.ORGANIZATION.value, subject_components)
    domain = extract_subject_component(SubjectComponents.DOMAIN.value, subject_components)

    for i in range(x509.get_extension_count()):
        ex = x509.get_extension(i)
        name = ex.get_short_name()
        data = ex.get_data()

        if(name == b"certificatePolicies"):
            decoded, _ = decoder.decode(data, asn1Spec=rfc5280.CertificatePolicies())
            cv = extract_ssl_certificate_policy(decoded)
            certificate: Certificate = Certificate(
                valid=valid,
                country=country,
                state=state,
                city=city,
                organization=organization,
                domain=domain,
                validation_type=cv,
                pubkey=pubkey,
                signature_algorithm=sig_alg
            )
    return certificate


def extract_ssl_certificate_policy(decoded):
    for policy_info in decoded:
        match (policy_info.getComponentByName("policyIdentifier").prettyPrint()):
            case (CertificateValidation.EV.value):
                return CertificateValidation.EV
            case (CertificateValidation.OV.value):
                return CertificateValidation.OV
            case (CertificateValidation.DV.value):
                return CertificateValidation.DV
    return CertificateValidation.NONE


def extract_subject_component(component, components: list[tuple[bytes, bytes]]):
    subj_component = list(filter(lambda c: c[0] == component, components))
    if len(subj_component) == 0:
        return None
    if len(subj_component) == 1:
        return subj_component[0][1]


def extract_public_key(x509: X509):
    return dump_publickey(FILETYPE_PEM, x509.get_pubkey()).decode("utf-8")

