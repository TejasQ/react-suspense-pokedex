import { title } from "case";
import React from "react";

// @ts-ignore
import { createResource } from "simple-cache-provider";

import "isomorphic-unfetch";

import cache from "../react/cache";

interface MovesProps {
  moves: any[];
}

interface MovesState {
  currentMove?: any;
}

// @ts-ignore
const moveResource = createResource(url => fetch(url).then(r => r.json()));

class Moves extends React.Component<MovesProps, MovesState> {
  public state = {
    currentMove: this.props.moves[0] || {},
  };

  public setMove = (currentMove?: string) => {
    this.setState(() => ({ currentMove }));
  };

  public render() {
    const { moves } = this.props;
    const { type, accuracy, power, pp } = moveResource.read(cache, this.state.currentMove.url);
    return (
      <div className="pokemon-moves">
        <h2>Moves</h2>
        <div className="pokemon-moves__content">
          <div className="pokemon-moves__list">
            <ul>
              {moves.map(move => (
                <li
                  className={`pokemon-move${move.name === this.state.currentMove.name ? " pokemon-move_active" : ""}`}
                  onClick={() => this.setMove(move)}
                  key={move.name}
                >
                  {title(move.name)}
                </li>
              ))}
            </ul>
          </div>
          <div className="pokemon-moves__details">
            <div className="pokemon-move-info">
              <div className="pokemon-move-info__key">Type</div>
              <div className="pokemon-move-info__value">{title(type.name)}</div>
            </div>
            <div className="pokemon-move-info">
              <div className="pokemon-move-info__key">Accuracy</div>
              <div className="pokemon-move-info__value">{accuracy}</div>
            </div>
            <div className="pokemon-move-info">
              <div className="pokemon-move-info__key">Power</div>
              <div className="pokemon-move-info__value">{power}</div>
            </div>
            <div className="pokemon-move-info">
              <div className="pokemon-move-info__key">PP</div>
              <div className="pokemon-move-info__value">{pp}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Moves;
