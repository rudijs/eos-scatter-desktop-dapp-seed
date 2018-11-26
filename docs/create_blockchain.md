## Create Local Development EOS Blockchain

These notes are based on the [EOS Developer Documentation](https://developers.eos.io/eosio-home/docs/introduction)

![EOSIO Stack](images/582e059-411_DevRelations_NodeosGraphic_Option3.png)

- `cd eos-scatter-desktop-dapp-seed`
- Create a developerment blockchain:

```
docker run --name eosio \
  --publish 7777:7777 \
  --publish 127.0.0.1:5555:5555 \
  --volume $(pwd)/contracts:/tmp/contracts \
  --detach \
  eosio/eos:v1.4.2 \
  /bin/bash -c \
  "keosd --http-server-address=0.0.0.0:5555 & exec nodeos -e -p eosio --plugin eosio::producer_plugin --plugin eosio::chain_api_plugin --plugin eosio::history_plugin --plugin eosio::history_api_plugin --plugin eosio::http_plugin -d /mnt/dev/data --config-dir /mnt/dev/config --http-server-address=0.0.0.0:7777 --access-control-allow-origin=* --contracts-console --http-validate-host=false --filter-on='*'"
```

- `docker logs --tail 10 eosio`
- Setup `cleos` alias
- `alias cleos='docker exec -it eosio /opt/eosio/bin/cleos --url http://127.0.0.1:7777 --wallet-url http://127.0.0.1:5555'`
- `cleos wallet list`
- Create a development wallet
- `cleos wallet create --to-console`
- Save the default wallet password to `/tmp/wallet-password.txt` (/tmp files are git ignored)
- Open and unlock the default wallet
- `cleos wallet open && cleos wallet unlock && cleos wallet list`
- Setup keys
- `cleos wallet create_key`
- Export the public key to an env var for easier use coming up
- `export PUBLIC_KEY=EOS*************************`
- `cleos wallet import`
- You'll be prompted for a private key, enter the eosio development key provided below
- `5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3` (this private key is publicly known)
- **Important**: Never use the development key for a production account! Doing so will most certainly result in the loss of access to your account.
- Setups accounts
- `cleos create account eosio bob $PUBLIC_KEY`
- `cleos create account eosio alice $PUBLIC_KEY`
- List keys
- `cleos wallet keys`
- `cleos wallet private_keys`
