# dCards Contracts

## Clarity Contracts and test cases

A number of example clarity contracts for an NFT project.
It's far better to have your contracts reviewed and tested before you release, since everything is visible to the world anyway!

The [dcards-nft.clar](./contracts/dcards-nft.clar) contract implement some recent [SIP](https://github.com/stacksgov/sips) ideas to enable advanced features for NFTs in the Stacks ecosystem.

###  SIP009 (NFT trait) compliant
[Definition is here](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md)

### Operable/transferable traits
[Discussion is here](https://github.com/stacksgov/sips/issues/52)

This allows delegated/non-custodial markerplace trading.

### Postman function
Related to the 'transfer' method.
For our greeting card app we enable a Postman function to allow an NFT to be claimed by a user other than the person who minted it. This can only be called by the 'postman' account which is the wallet that deployed the contract. You usually would call this from your own server code, so you'll need private keys to a wallet on your server. Be careful!
The method to protect access to the claim must be provided by your own web application.

### Seed Data
The contract mint function accepts a 64 byte hex string as seed data.
This allows deterministic/reproducible outcomes for use cases like algorithmic art.
This is held in a map.

### get-info function for metadata SIP-016 (Draft)
This returns key data of the contract including the seed data.
This can be provided as metadata to other marketplaces.
We would suggest reviewing this in process SIP for NFT Metadata:
- [discussion](https://github.com/stacksgov/sips/issues/17)
- [SIP-016 Draft](https://github.com/stacksgov/sips/blob/37116cdad76bcf5177442a53161be154332a7ad7/sips/sip-16/sip-016-token-metadata.md)

## How to use

```sh
cd clarity
make test-all
```

## Costs

```

Contract calls cost synthesis
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
|                                   | Runtime (units) | Read Count | Read Length (bytes) | Write Count | Write Length (bytes) | Tx per Block |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
| dcards-nft::can-transfer          | 6797060 (0.14%) |  6 (0.08%) |        6771 (0.01%) |           0 |                    0 |          735 |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
| dcards-nft::get-info              | 6319225 (0.13%) |  9 (0.12%) |        6280 (0.01%) |           0 |                    0 |          791 |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
| dcards-nft::get-last-token-id     | 6094281 (0.12%) |  4 (0.05%) |        6094 (0.01%) |           0 |                    0 |          820 |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
| dcards-nft::get-owner             | 6094395 (0.12%) |  4 (0.05%) |        6078 (0.01%) |           0 |                    0 |          820 |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
| dcards-nft::get-seed              | 6226139 (0.12%) |  4 (0.05%) |        6226 (0.01%) |           0 |                    0 |          803 |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
| dcards-nft::get-token-uri         | 6131606 (0.12%) |  4 (0.05%) |        6131 (0.01%) |           0 |                    0 |          815 |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
| dcards-nft::mint                  | 6607775 (0.13%) | 12 (0.15%) |        6279 (0.01%) |   5 (0.06%) |          185 (0.00%) |          645 |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
| dcards-nft::mint-many             | 7176168 (0.14%) | 12 (0.15%) |        6279 (0.01%) |   5 (0.06%) |          185 (0.00%) |          645 |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
| dcards-nft::set-approved          | 6439312 (0.13%) |  4 (0.05%) |        6077 (0.01%) |   1 (0.01%) |          359 (0.00%) |          776 |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
| dcards-nft::set-approved-all      | 6414188 (0.13%) |  4 (0.05%) |        6077 (0.01%) |   1 (0.01%) |          334 (0.00%) |          779 |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
| dcards-nft::set-mint-price        | 6226766 (0.12%) |  4 (0.05%) |        6226 (0.01%) |           0 |                    0 |          802 |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
| dcards-nft::transfer              | 6096418 (0.12%) |  4 (0.05%) |        6078 (0.01%) |           0 |                    0 |          820 |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
| dcards-nft::transfer-memo         | 6106960 (0.12%) |  4 (0.05%) |        6078 (0.01%) |   1 (0.01%) |            1 (0.00%) |          818 |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
|                                                                                                                                            |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
| Mainnet Block Limits (Stacks 2.0) |      5000000000 |       7750 |           100000000 |        7750 |             15000000 |            / |
+-----------------------------------+-----------------+------------+---------------------+-------------+----------------------+--------------+
```

## Other contracts

- [Megapont](https://github.com/Megapont/megapont-ape-club-contracts)
- [BoomCrypto](https://github.com/boomcrypto/clarity-deployed-contracts)

Collection from Frieger's [Awesome Stacks](https://github.com/friedger/awesome-stacks-chain#contracts) repo.

please ping us or send a PR if you have other contracts you'd like to add!

# Test Suite

Using test functions from here

https://deno.land/x/clarinet@v0.12.0/index.ts


## Next steps

It would be good to build a small repo that shows calling these various methods from javascript. If you're interested in working on this please post an issue or contact us!

