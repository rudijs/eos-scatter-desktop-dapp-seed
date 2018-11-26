## Hello World Smart Contract

## Install the EOSIO Contract Development Toolkit.

The docs here will show the Linux Ubuntu binaries, see the [official docs](https://developers.eos.io/eosio-home/docs/installing-the-contract-development-toolkit) for how to on other platforms.

1. `wget https://github.com/eosio/eosio.cdt/releases/download/v1.3.2/eosio.cdt-1.3.2.x86_64.deb`
2. `sudo apt install ./eosio.cdt-1.3.2.x86_64.deb`

Example install output for Ubuntu Linux:

```
Reading package lists... Done
Building dependency tree
Reading state information... Done
Note, selecting 'eosio.cdt' instead of './eosio.cdt-1.3.2.x86_64.deb'
The following NEW packages will be installed:
  eosio.cdt
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 0 B/68.4 MB of archives.
After this operation, 0 B of additional disk space will be used.
Get:1 /home/rudi/Downloads/eosio.cdt-1.3.2.x86_64.deb eosio.cdt amd64 1.3.2 [68.4 MB]
Selecting previously unselected package eosio.cdt.
(Reading database ... 174048 files and directories currently installed.)
Preparing to unpack .../eosio.cdt-1.3.2.x86_64.deb ...
Unpacking eosio.cdt (1.3.2) ...
Setting up eosio.cdt (1.3.2) ...
```

## Compile and deploy hello-world to your local EOSIO blockchain

- `cd contracts/hello`
- Compile the contract
- `eosio-cpp -o hello.wasm hello.cpp --abigen`
- Create an account for the contract
- `cleos create account eosio hello $PUBLIC_KEY -p eosio@active`
- Broadcast the compiled wasm to the blockchain using cleos set contract
- `cleos set contract hello /tmp/contracts/hello -p hello@active`
- Push an action to the contract
- `cleos push action hello hi '["alice"]' -p alice@active`
- Note this version of the contract uses _require_auth_
