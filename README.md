# Rewardable V2 Contracts

## Audit

### General Comments

1. Overview Section, page 7

> Add RewardDistributorV1LZ contract in the report Overview section, it is the most important contract in the project and is missing in the list, even though it was audited.

### Issues

1. MAC - Missing Access Control - FIXED, added a check that the method can be called only by user himself or by approved sponsor admin addresses

2. ISRP - Inadequate Signature Replay Protection - ACKNOWLEDGE, NOT A BUG, SEE BELOW

> We have adequate replay protection mechanism, as backend always signs number of all REWARDS accrued per user.
> Contract keeps track in in `withdrawnRewards` how much was already withdrawn. So even if someone tries to reuse
> signature, he cannot be able to withdraw more than `totalAmount - withdrawnRewards`, you can see it in line 253.

3. PLAM - Potential Liquidity Amount Manipulation - FIXED, added a fixed range restriction for positions, that can be staked
4. APW - Admin Privileged Withdrawals - ACKNOWLEDGE, multisig is used
5. CCR - Contract Centralization Risk - ACKNOWLEDGE, multisig is used
6. IAC - Inadequate Access Control - FIXED, added onlyOwner modifier
7. IAI - Inadequate Admin Initialization - ACKNOWLEDGE, the checks are performed in the deployment scripts
8. ISV - Inadequate Signature Verification - ACKNOWLEDGE, NOT A BUG, we actually check that tokenAdmin signed the message
9. MCM - Misleading Comment Messages - FIXED, added correct comment message
10. MEM - Missing Error Messages - FIXED, error message added
11. MSC - Missing Sanity Check - FIXED, sanity check added
12. MTLV - Missing Time Lock Validation - ACKNOWLEDGE
13. MU - Modifiers Usage - ACKNOWLEDGE
14. PL TM - Potential Lock Time Manipulation - ACKNOWLEDGE
15. PTAI - Potential Transfer Amount Inconsistency - ACKNOWLEDGE, there is no tax on token transfers
16. RFD - Redundant Function Declaration - ACKNOWLEDGE
17. RSML - Redundant SafeMath Library - ACKNOWLEDGE
18. SVMC - Signature Validation Missing ChainID - ACKNOWLEDGE
19. TSI - Tokens Suﬃciency Insurance - ACKNOWLEDGE, the process is intentionally split to two methods to align with offchain processes
20. L04 - Conformance to Solidity Naming Conventions - ACKNOWLEDGE
21. L16 - Validate Variable Setters - ACKNOWLEDGE
22. L19 - Stable Compiler Version - ACKNOWLEDGE

We do believe that these findings are not a bug and can be completely removed from the audit: 2. ISRP - Inadequate Signature Replay Protection 8. ISV - Inadequate Signature Verification
