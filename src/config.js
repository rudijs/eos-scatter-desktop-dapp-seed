const config = {
  appName: "EOS ScatterJS Dapp Seed",
  networks: [
    // {
    //   blockchain: "eos",
    //   protocol: "https",
    //   host: "nodes.get-scatter.com",
    //   port: 443,
    //   chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
    // },
    {
      blockchain: "eos",
      protocol: "http",
      host: "localhost",
      port: 777,
      chainId:
        "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
    }
  ],
  personal: ["firstname", "lastname"]
};

export default config;
