import React, { Component } from "react";

import Pokemon from "./Pokemon";
import PokemonList from "./PokemonList";

interface State {
  pokemon?: string;
}

class App extends Component<{}, State> {
  public state: State = {};

  public setBreed = (pokemon: string) => this.setState({ pokemon });

  public render() {
    const { pokemon } = this.state;
    return (
      <div className="app">
        <div className="header">Pokedex</div>
        <div className="container">
          <div className="pokemon-list">
            <PokemonList onChooseBreed={this.setBreed} />
          </div>
          <div className="pokemon-detail">{pokemon && <Pokemon name={pokemon} />}</div>
        </div>
      </div>
    );
  }
}

export default App;
