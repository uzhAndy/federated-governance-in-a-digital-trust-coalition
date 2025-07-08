# Federated Governance for Decentralized Data-oriented Architectures
Welcome to the GitHub repository of my Master's Thesis.
This repository includes all the code written for the prototype *Trust Coalition Agent* (TCA), a decentralized data-oriented software system for federated governance based on decentralized identifiers (DID) and verifiable credentials (VC).
~A running version can be found on [optimates.ch](https://optimates.ch).~

```
"...trust architects had a vision: a 'trust layer' for the Internet could be achieved by following the same architecture as the Internet."
```
\-- [Trust Over IP](https://www.trustoverip.org/toip-model/)

| | |
|-|-|
| Student | Andy Aidoo |
| Supervisor | Dr. Bruno Rodrigues |
| Supervisor | Katherine O. E. Müller |
| Responsible Professor | Prof. Dr. Burkhard Stiller |
| Contents | Repository for prototype that has been developed as part of the Master's Thesis | 

![System Context](documentation/system_context.svg)

## Feature Description
With the web application, you can interact with a decentralized public key infrastructure (PKI) based on distributed ledger technology (DLT) to manage VCs, authenticate credential holders and participate in the coalition's governance trough ethereum smart contracts.
The TCA implements the *Hyperledger Aries* framework *Aries Cloud Agent Python* (acapy) to create connections to other agents, issue and revoke VCs, and verify proofs.
The corresponding public key material is hosted on the Verifiable Organizations Network (VON).
It implements the DLT with *Hyperledger Indy*; the government of British Columbia further offers a mobile application ([android](https://play.google.com/store/apps/details?id=ca.bc.gov.BCWallet), [iOS](https://apps.apple.com/us/app/bc-wallet/id1587380443)) to which you can issue your demo credentials to.
| Feature | Link | Description |
|-------- | ------ | ------ |
| establish an new DIDComm connection | [Connections](https://optimates.ch/connections) | Establishing a connection includes *1.* giving the connection an alias. (Try **'My first DID Connection to FAVORITE_SERIES at CURRENT_DATE'** to my wallet and replace FAVORITE_SERIES + CURRENT_DATE to later be able to identify the right connection). *2.* scanning the QR-code with the BC-Wallet app. |
| accept a DIDComm Invitation | [Accept Connection](https://optimates.ch/connections/receive-connection) | Accepting a connection includes *1.* creating a new connection on [Connections](https://optimates.ch/connections) *2.* giving the connection an alias (Try **My first DID Connection to a TCA'**.), *3.* copying the invitation URL and *4.* pasting it into textbox in under [Connections --> Accept Connection](https://optimates.ch/connections/receive-connection)|
| query active DIDComm connections  | [Connections --> Active Connections](https://optimates.ch/connections/my-connections) | Scroll down to view all previous connections to other agents |
 | issue an AnonCreds Verifiable Credential (VC) | [Credentials](https://optimates.ch/credentials/issue-credentials) | Issuing a VC requires an active connection to a mobile application. Once done, *1.* navigate to [Credentials](https://optimates.ch/credentials), *2.* select the connection with your favorite series and the current date, *3.* select 'standard claims 1.0' (note the field 'Credential Definition' is populated automatically), *4.* fill out each field and *5.* press submit. If no field is empty, you are redirected to [Review Credential Offers](https://optimates.ch/credentials/view-credentials) and should receive a Credential Offer on your mobile application. | 
 | review credential offers | [Credentials --> Review Credential Offers](https://optimates.ch/credentials/view-credentials) | Lists all credential offers that have not been accepted, yet. |
 | **protected** revoke VCs | [Credentials --> My Credentials](https://optimates.ch/credentials/my-credentials) | The API endpoint that this route requests data from requires a valid jwt to be sent in the header. To authenticate, you need a user for the lifecycle API with the 'controller user 1.0' schema (must be done on database directly). Once authenticated this page renders a list of tiles with the issued credentials alongside their validity. Pressing the 'x' in to top-right corner results in the revocation of the credentials. After a small delay the validity is set to false and subsequent proof requests will result in invalid proofs.  |
 | **protected** create a DIDComm proof request | [Proof Requests](https://optimates.ch/proof-requests) | Once authenticated and authorized, this tab allows for the creation of proof presentation requests. *1.* find the connection with your favorite series and today's date, *2.* select all the credentials that should be included in the proof presentation and *3.* press 'Request Proof' |
 | **protected** review proof history | [Proof Requests --> View Past Proofs](https://optimates.ch/proof-requests/view-proof-requests) | Once authenticated and authorized, this tab lists all previous proof presentation requests that have the state `done` or `request-sent` and records which credentials have been requested and whether they were active at the time the proof was presented. |
 | *MetaMask* participate in the governance of the Trusted Coalition Network | [DAO](https://optimates.ch/dao) | This tab relies on authentication based on the crypto wallet [Meta Mask](https://metamask.io/). Users of the TCA require a list of credential definitions for trusted domains. The domains listed are demonstrative appliers to such a trust coalition. Members of the coalition may vote 'yes' and 'no' on the applications and trigger a smart contract that manages domain names with credential definitions. |
 | *MetaMask* apply for Trusted Coaliton network membership | [DAO](https://optimates.ch/dao) | This tab relies on authentication based on the crypto wallet [Meta Mask](https://metamask.io/). Users of the TCA require a list of credential definitions for trusted domains. The domains listed are demonstrative appliers to such a trust coalition. Pressing the Button 'Request Membership' results in the popup of a modal form where the submission triggers the smart contract for requesting membership to the trust coalition. |
 | *MetaMask* accelerated onboarding to the Trusted Coaliton network | [DAO](https://optimates.ch/dao) | This tab relies on authentication based on the crypto wallet [Meta Mask](https://metamask.io/).  Pressing the Button 'Request Membership' results in the popup of a modal form where the submission triggers the smart contract for requesting membership to the trust coalition. After completing the sign up for, domains with an EV or OV TLS certificate may request to achieve member status by correctly responding to a challenge. To register a domain, a valid EV or OV TLS certificate needs to be reachable at *register.tca.example.com*. The certificate is the used to encrypt a 128-bit mnemonic phrase. The plaintext is the stored as a value in a Solidity mapping while the domain acts as the key. If applicant submits the correct phrase, the domain is added to the list of members. |

## Feature Showcase
Below you can find five recordings that depict of how to pass through the onboarding and login process.
Further, it documents how establish a DIDComm connection for issuing, verifying and revoking AnonCreds VCs.

### Regular Onboarding Process
[<img src="https://img.youtube.com/vi/xwJphxnh5PU/hqdefault.jpg" width="600" height="300"
/>](https://www.youtube.com/embed/xwJphxnh5PU)
Domains with a domain validated TLS certificate may start a joiner application, by completing the sign up form.
Once submitted, the user is asked to sign a transaction that triggers a smart contract responsible for the regular onboarding.
Upon successful execution of the smart contract, members are able to support or oppose the application.


### Accelerated Onboarding Process
[<img src="https://img.youtube.com/vi/Xwxk4n29SDs/hqdefault.jpg" width="600" height="300"
/>](https://www.youtube.com/embed/Xwxk4n29SDs)
The same onboarding form checks the domain certificate policy once the field `Company Domain` has been filled out.
When an extended validation or organization validated is detected, a new button `Accelerated Onboarding` appears.
Submitting the form with this button triggers a smart contract responsible for accelerated onboarding and registers the application.
Once successfully applied, the client asks the lifecycle-api to generate a challenge and publish it to the ledger.
The following is an example a the challenge:
```
    {
    "cipher_text": "j+2sx8lBDyyn+lDO/PJUkaPPIUAOfc/DIK4e8BQfjuxc/go+XbX82VCU2FGkzinEBQG8b0mOuXyeLePx2ioNxLVmuo0r5U05xAzc1v23",
    "method": "ECDH",
    "note": "secret is base64 encoded",
    "my_pubkey": "-----BEGIN PUBLIC KEY-----
                  MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEr09lsdUIvcAytcuM9tgYgKjWYg/+
                  hfeizMYupiBIpcsBVnIHwUOA7HuRkrFoZuT6PJ3FKO9BKrx12MpyVakMyg==
                  -----END PUBLIC KEY-----",
    "your_pubkey": "-----BEGIN PUBLIC KEY-----
                    MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEU7w5DzY/4BjWk58Wo0YMA3bb3qlS
                    G5EYuWnVxiZEqPmGK2YJv+ntTfxDJ8QYMmpwTP/7AyoYp1KhV07m+VIzjQ==
                    -----END PUBLIC KEY-----"
    }
```

Decryting the cipher text results in the mnemonic phrase:
```
seminar treat vivid basket cliff tunnel erase enemy napkin tray chapter garage
```

Submission of an answer will trigger another smart contract that verifies the answer and provided that the correct answer was given, the domain is added to the trust coalition.

### Login Process
[<img src="https://img.youtube.com/vi/xq5vr9ZzrAs/hqdefault.jpg" width="600" height="300"/>](https://www.youtube.com/embed/xq5vr9ZzrAs)

When trying to access a protected resource, the user must be authorized beforehand and is redirected to a login page.
The user opens their mobile wallet, enters a PIN or uses biometric authentication and subsequently scans the qr-code displayed on the screen.
First a new DIDComm connection is established and the correct VC requested.
Once the user has confirmed the sharing of the VCs, the credentials are verified and sent to the lifecycle api for authorization.
Successful authorization results in the issuance of a JWT which can be reused on subsequent requests.

### Establish a DIDComm Connection
[<img src="https://img.youtube.com/vi/82uEifjjKGA/hqdefault.jpg" width="600" height="300"
/>](https://www.youtube.com/embed/82uEifjjKGA)
Before being able to issue, verify and revoke AnonCreds VCs, a connection to a holder needs to be established.
This video shows how to generate such a connection with an alias and accepting it in a mobile wallet.


### VC Lifecycle
[<img src="https://img.youtube.com/vi/NCWtZ8zWE5M/hqdefault.jpg" width="600" height="300"
/>](https://www.youtube.com/embed/NCWtZ8zWE5M)
AnonCreds VCs can be issued after having established a connection beforehand.
Once a connection and schema have been selected, a form appears through which VCs can be issued.
The credential holder needs to accept the credentials and can subsequently pass proof presention verification.
To create a proof presentation request, a connection has to be selected and the relevant attributes checked.
Once `Request Proof` has been clicked, the pending proof presentation request is displayed under `View Past Proofs`.
After the holder has answered the its state changes to `done` and the overview informs about the validity of the credential.
A later proof will validate to `revoked` if the `x` is clicked in `My Credentials` and the validity is set to `false`.


## Issuer Architecture
The demo TCA is reachable on [https://optimates.ch](https://optimates.ch). The domain points to a Virtual Private Server that runs a reverse proxy server.
On the home page, an Angular application is served which communicates with services running behind a reverse proxy in Docker containers (/dao-agent, /dao-agent-api, /tails) and services hosted on a Raspberry Pi (/api).


![Issuer Architecture Overview](documentation/issuer_architecture.svg)

*[1]* [TCA controller](https://github.com/uzhAndy/fed-gov-ddos-data-mesh/tree/main/controller), 
*[2]* [acapy](https://github.com/hyperledger/aries-cloudagent-python),
*[3]* [indy-tails-server](https://github.com/bcgov/indy-tails-server),
*[4]* [lifecycle-api](https://github.com/uzhAndy/fed-gov-ddos-data-mesh/tree/main/lifecycle-api)

## Running a local TCA instance
A local instance differs from the shown architecture mainly in the fact that a local instance can be hosted from a single `docker compose` after setting some environment variables.
After the prerequisits have been installed, a simple `./manage build; ./manage provision` gets the software system running.
Make sure a .env file lives in the root directory of this repository.

### Prerequisits
Before running an instance of a TCA, make sure that you have the following prerequisites installed on your system:
|||
|-|-|
| git 
| ngrok
| jq
| Angular CLI
| npm
| Pipenv

### Clone this Repository

Clone the repository and its submodules with:
```
$: git clone git@github.com:uzhAndy/federated-governance-in-a-digital-trust-coalition.git
```
You should receive the following directory structure: 
```
./ddos-data-mesh-network/
├── .env
├── .gitmodules
├── ...
├── /controller
│    └── ...
├── /indy-tails-server
│    └── ...
├── /lifecycle-api
│    └── ...
├── ...
```
These three sub-modules need to be built before the TCA can be started.

### Build the Project
The `./manage` bash script builds the project with the command 
`./manage build`.
The Angular application is built with the system's `ng build`.
Python is used as the base for the `lifecycle-api (fastapi)` that runs behing a `uvicorn` server.
Similarly, the `indy-tails-server` is served from `aiohttp` instance.

### Initial Startup
For an initial startup, the acapy agent needs to registered after which the schema and credential definition need to be published.
This is done with `./manage provision`.
After a successful run of the script, your local TCA instance is served on [localhost](http://localhost).

### Subsequent Startups
One of the Docker services is called `wallet-db`.
It holds the private key of the public key that is associated with the generated seed in the `.env`-file.
After a seed has been created by the `provision` command, the TCA instance can be restarted with `./manage start`

### System Shutdown
To shut the software system down, use the `./manage stop`.
This script kills the ngrok tunnels that have been setup to allow for the usage of the BC Wallet and terminates all active Docker containers.
