import React, { Component } from "react";
import { Spinner, SidenavItem } from "@operational/components";

class DogList extends Component {
  state = {
    loading: false,
    data: null,
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    try {
      this.setState(() => ({ loading: true }));
      const response = await fetch("https://dog.ceo/api/breeds/list");
      const data = await response.json();
      this.setState(() => ({ loading: false, data }));
    } catch (e) {
      throw Error(e);
    }
  };

  render() {
    return this.state.loading ? (
      <Spinner />
    ) : (
      this.state.data &&
        this.state.data.message.map(breed => (
          <SidenavItem onClick={() => this.props.onChooseBreed(breed)} label={breed} />
        ))
    );
  }
}

export default DogList;
