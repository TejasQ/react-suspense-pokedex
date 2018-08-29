// @ts-ignore
import React, { Component, Placeholder } from "react";

import Spinner from "../../Spinner";
import Pokemon from "./Pokemon";
import PokemonList from "./PokemonList";

interface State {
  pokemon: string;
}

class App extends Component<{ pokemon?: string }, State> {
  public state: State = { pokemon: this.props.pokemon || "bulbasaur" };

  public setBreed = (pokemon: string) => this.setState({ pokemon });

  public render() {
    const { pokemon } = this.state;
    return (
      <Placeholder delayMs={0} fallback={<Spinner />}>
        <div className="app">
          <div className="header">Pokedex</div>
          <div className="container">
            <div className="pokemon-list">
              <PokemonList onChooseBreed={this.setBreed} />
            </div>
            <div className="pokemon-detail">
              <Pokemon name={pokemon} />
            </div>
          </div>
        </div>
      </Placeholder>
    );
  }
}

export default App;
