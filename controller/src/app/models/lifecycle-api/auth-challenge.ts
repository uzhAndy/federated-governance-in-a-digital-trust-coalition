export interface AuthChallengeRequestBody{
    domain: string
    walletPubKey: string
}

export interface ChallengeECDH{
    cipher_text: string;
    method: string;
    note: string;
    my_pubkey: string;
    your_pubkey: string;
}
export interface ChallengeRSA{
    cipher_text: string;
    method: string;
    note: string;
    your_rsa_pubkey: string;
}