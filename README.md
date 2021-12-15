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

### get-info function
This returns key data of the contract including the seed data.
This can be provided as metadata to other marketplaces.
We would suggest reviewing this in process SIP for NFT Metadata:
https://github.com/stacksgov/sips/issues/17


## How to use

```sh
cd clarity
make test-all
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

