export interface MembershipApplication {
    accepted: boolean;
    active: boolean;
    applicationTime: bigint;
    applicationTimeEnd: bigint;
    applier: Company;
    membersCount: bigint;
    noVotes: bigint;
    yesVotes: bigint;
    voted: string[];
}

export interface Company {
    companyDomain: string;
    companyName: string;
    contactPersonEmail: string;
    contactPersonFirstname: string;
    contactPersonLastname: string;
    credentialDefinition: string;
    walletAddress: string;
}