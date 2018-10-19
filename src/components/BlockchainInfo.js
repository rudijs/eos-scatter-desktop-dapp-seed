import React, { Component } from "react";

export default class BlockchainInfo extends Component {
  state = {
    info: {}
  };

  componentDidMount() {
    fetch("http://localhost:7777/v1/chain/get_info")
      .then(res => res.json())
      .then(res => this.setState({ info: res }))
      .catch(err => this.setState({ info: { error: err.message } }));
  }

  render() {
    const info = Object.keys(this.state.info).map((key, index) => {
      return (
        <p key={index}>
          <span style={{ fontWeight: "bold" }}>{key}</span>:
          {this.state.info[key]}
        </p>
      );
    });

    return (
      <div>
        <h1>EOS Blockchain Info</h1>
        {info}
      </div>
    );
  }
}
