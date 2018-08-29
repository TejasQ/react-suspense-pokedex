import { title } from "case";
import React, { Component } from "react";

import Spinner from "../../Spinner";

interface Props {
  breed?: string;
  onChooseBreed: (breed: string) => void;
}

interface State {
  loading: boolean;
  data: any;
}

class PokemonList extends Component<Props, State> {
  public state: State = {
    loading: false,
    data: null,
  };

  public async componentDidMount() {
    const data = await this.getData();
    this.props.onChooseBreed(data[0].name);
  }

  public getData = async () => {
    try {
      this.setState(() => ({ loading: true }));
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=151");
      const { results } = await response.json();
      this.setState(() => ({ loading: false, data: results }));
      return results;
    } catch (e) {
      throw Error(e);
    }
  };

  public render() {
    return this.state.loading ? (
      <Spinner />
    ) : (
      this.state.data && (
        <ul>
          {this.state.data.map(({ name }: { name: string }) => (
            <li onClick={() => this.props.onChooseBreed(name)}>{title(name)}</li>
          ))}
        </ul>
      )
    );
  }
}

export default PokemonList;
