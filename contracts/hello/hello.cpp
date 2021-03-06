#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>

using namespace eosio;

class hello : public contract
{
  public:
    using contract::contract;

    [[eosio::action]] void hi(name user) {
        require_auth(user);
        print("Hello, ", user);
    }
};

EOSIO_DISPATCH(hello, (hi))
