import React, { Component } from "react";
import { title } from "case";

import Info from "./Info";
import Moves from "./Moves";
import Spinner from "../../Spinner";

interface Props {
  name: string;
}

interface State {
  loading: boolean;
  data: any;
}

class Pokemon extends Component<Props, State> {
  public state: State = {
    loading: false,
    data: null,
  };

  public componentDidMount() {
    this.getData();
  }

  public componentDidUpdate(nextProps: Props) {
    if (nextProps.name === this.props.name) {
      return;
    }
    this.getData();
  }

  public getData = async () => {
    try {
      this.setState(() => ({ loading: true }));
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + this.props.name);
      const data = await response.json();
      this.setState(() => ({ loading: false, data }));
    } catch (e) {
      throw Error(e);
    }
  };

  public render() {
    const { data } = this.state;
    const getRandomColorValue = () => Math.floor(Math.random() * 255) + 1;
    return this.state.loading || !data ? (
      <Spinner />
    ) : (
      <>
        <div>
          <h1>{title(this.props.name)}</h1>
          {data.types.map(({ type }: any) => (
            <span
              className="pokemon-types__type"
              style={{
                backgroundColor: `hsla(${getRandomColorValue()}, 50%, 70%, .2)`,
              }}
            >
              {type.name}
            </span>
          ))}
          <Info name={data.name} sprite={data.sprites.front_default} stats={data.stats} />
        </div>

        <Moves moves={data ? data.moves.slice(0, 4).map(({ move }: any) => move) : []} />
      </>
    );
  }
}

export default Pokemon;
