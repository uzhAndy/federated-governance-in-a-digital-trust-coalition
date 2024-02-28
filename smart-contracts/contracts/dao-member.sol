contract CredentialDAO {
    struct Application {
        Company applier;
        uint256 applicationTime;
        uint256 applicationTimeEnd;
        uint256 membersCount;
        uint256 yesVotes;
        uint256 noVotes;
        bool accepted;
        bool active;
        address[] voted;
    }
    struct Company {
        string contactPersonFirstname;
        string contactPersonLastname;
        string contactPersonEmail;
        string companyName;
        string companyDomain;
        string credentialDefinition;
        address walletAddress;
    }

    address public chairperson;
    uint256 membersCount;
    Application[] public activeJoinerRequests;
    Application[] public archivedJoinerRequests;

    mapping(address => Company) members;
    mapping(string => Company) membersByDomain;
    mapping(address => Application) joinerRequests;
    mapping(string => Application) acceleratedJoinerRequests;
    mapping(string => string) challenges;

    event MembershipRequested(address indexed requester, Company company);

    event Voted(address indexed voter, bool vote, Application application);

    constructor() {
        chairperson = msg.sender;
    }

    function publishChallenge(string memory domain, string memory passphrase)
        public
    {
        require(
            bytes(acceleratedJoinerRequests[domain].applier.companyName)
                .length != 0,
            "not registered"
        );
        require(
                msg.sender == chairperson,
                "not allowed"
        );
        challenges[domain] = passphrase;
    }

    function equalStrings(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function submitChallengeAnswer(string memory domain, string memory answer)
        public
        returns (bool)
    {
        require(
            bytes(challenges[domain]).length != 0,
            "not allowed"
        );
        string memory passphrase = challenges[domain];
        require(equalStrings(passphrase, answer), "incorrect");
        Application
            memory acceleratedJoinerApplication = acceleratedJoinerRequests[
                domain
            ];
        acceleratedJoinerApplication.accepted = true;
        acceleratedJoinerApplication.active = false;
        Company memory applicant = acceleratedJoinerApplication.applier;
        members[applicant.walletAddress] = applicant;
        membersByDomain[applicant.companyDomain] = applicant;
        return true;
    }

    function hasAppliedForAcceleratedOnboarding(string memory domain)
        public
        view
        returns (bool)
    {
        bool hasApplied = bytes(
            acceleratedJoinerRequests[domain].applier.companyName
        ).length != 0;
        return hasApplied;
    }

    // Function to request membership
    function requestMembership(Company memory newCompany, bool accelerated)
        public
        returns (Application memory)
    {
        require(
            joinerRequests[newCompany.walletAddress].applier.walletAddress ==
                address(0),
            "duplicate"
        );

        uint32 ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

        Application memory newApp = Application({
            applier: newCompany,
            applicationTime: block.timestamp,
            applicationTimeEnd: block.timestamp + ONE_WEEK_IN_SECONDS,
            membersCount: membersCount,
            yesVotes: 0,
            noVotes: 0,
            voted: new address[](membersCount),
            accepted: false,
            active: true
        });

        if (accelerated) {
            acceleratedJoinerRequests[newCompany.companyDomain] = newApp;
        } else {
            // Store the joiner request
            joinerRequests[newCompany.walletAddress] = newApp;
            activeJoinerRequests.push(newApp);
        }
        return newApp;
    }

    function isInAddressArray(address[] memory votes, address _address)
        internal
        pure
        returns (bool)
    {
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function updateJoinerRequest(Application memory update) internal {
        for (uint256 i = 0; i < activeJoinerRequests.length; i++) {
            Application memory currApp = activeJoinerRequests[i];
            if (currApp.applier.walletAddress == update.applier.walletAddress) {
                if (!update.active) {
                    // delete inactive application, add the last active application to it place and reduce the array's size by one
                    archivedJoinerRequests.push(update);
                    delete activeJoinerRequests[i];
                    activeJoinerRequests[i] = activeJoinerRequests[
                        activeJoinerRequests.length - 1
                    ];
                    activeJoinerRequests.pop();
                } else {
                    activeJoinerRequests[i] = update;
                }
            }
        }
    }

    function setCredentialsDefinition(string memory credDef) public {
        require(
            members[msg.sender].walletAddress != address(0),
            "not allowed"
        );

        Company memory member = members[msg.sender];
        string memory domain = member.companyDomain;

        members[msg.sender].credentialDefinition = credDef;
        membersByDomain[domain].credentialDefinition = credDef;
    }

    function vote(bool voteYes, address joinerAddress)
        public
        returns (Application memory)
    {
        require(
            members[msg.sender].walletAddress != address(0) || msg.sender == chairperson,
            "not allowed"
        );

        Application storage joinerRequest = joinerRequests[joinerAddress];
        require(
            joinerRequest.applier.walletAddress != address(0),
            "Invalid"
        );
        require(
            !isInAddressArray(joinerRequest.voted, msg.sender),
            "duplicate"
        );

        joinerRequest.voted.push(msg.sender);

        if (voteYes) {
            joinerRequest.yesVotes++;
            if ((joinerRequest.yesVotes > (membersCount * 66) / 100) || msg.sender == chairperson) {
                membersCount += 1;
                joinerRequest.accepted = true;
                joinerRequest.active = false;
                membersByDomain[
                    joinerRequest.applier.companyDomain
                ] = joinerRequest.applier;
            }
        } else {
            joinerRequest.noVotes++;
            if ((joinerRequest.noVotes > (membersCount * 34) / 100) || msg.sender == chairperson) {
                joinerRequest.active = false;
                joinerRequest.accepted = false;
            }
        }

        updateJoinerRequest(joinerRequest);
        return joinerRequest;
    }

    function getCompanyByDomain(string memory domain)
        public
        view
        returns (Company memory)
    {
        require(
            bytes(membersByDomain[domain].companyDomain).length != 0,
            "Domain not found"
        );
        return membersByDomain[domain];
    }

    function getActiveJoinerRequests()
        public
        view
        returns (Application[] memory)
    {
        return activeJoinerRequests;
    }
}
