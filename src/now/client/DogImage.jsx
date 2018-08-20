import React, { Component } from "react";
import { Spinner, Card } from "@operational/components";

class DogImage extends Component {
  state = {
    loading: false,
    data: null,
  };

  componentDidUpdate(nextProps) {
    if (nextProps.breed === this.props.breed) {
      return;
    }
    this.getData();
  }

  getData = async () => {
    try {
      this.setState(() => ({ loading: true }));
      const response = await fetch("https://dog.ceo/api/breed/" + this.props.breed + "/images");
      const data = await response.json();
      this.setState(() => ({ loading: false, data }));
    } catch (e) {
      throw Error(e);
    }
  };

  render() {
    return (
      <Card title={this.props.breed}>
        {this.state.loading ? (
          <Spinner />
        ) : (
          <img alt={this.props.breed} src={((this.state.data || {}).message || [])[0]} />
        )}
      </Card>
    );
  }
}

export default DogImage;
