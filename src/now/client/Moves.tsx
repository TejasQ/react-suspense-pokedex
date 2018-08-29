import React from "react";
import { title } from "case";

import Spinner from "../../Spinner";

interface MovesProps {
  moves: any[];
}

interface MovesState {
  loading: boolean;
  data?: any;
  currentMove?: any;
}

class Moves extends React.Component<MovesProps, MovesState> {
  public state: MovesState = {
    loading: false,
  };

  public componentDidMount() {
    this.getData();
  }

  public componentDidUpdate(nextProps: MovesProps) {
    if (nextProps.moves === this.props.moves) {
      return;
    }
    this.getData();
  }

  public getData = async () => {
    try {
      this.setState(() => ({ loading: true }));
      const response = await fetch((this.state.currentMove || {}).url || this.props.moves[0].url);
      const data = await response.json();
      this.setState(() => ({ loading: false, data }));
    } catch (e) {
      throw Error(e);
    }
  };

  public setMove = (currentMove?: string) => {
    this.setState(() => ({ currentMove }));
    this.getData();
  };

  public render() {
    const { moves } = this.props;
    const { data } = this.state;
    return (
      <div className="pokemon-moves">
        <h2>Moves</h2>
        <div className="pokemon-moves__content">
          <div className="pokemon-moves__list">
            <ul>
              {moves.map((move, index) => (
                <li
                  className={`pokemon-move${
                    move.name === (this.state.currentMove || {}).name || (!this.state.currentMove && index === 0)
                      ? " pokemon-move_active"
                      : ""
                  }`}
                  onClick={() => this.setMove(move)}
                  key={move.name}
                >
                  {title(move.name)}
                </li>
              ))}
            </ul>
          </div>
          <div className="pokemon-moves__details">
            {data ? (
              <>
                <div className="pokemon-move-info">
                  <div className="pokemon-move-info__key">Type</div>
                  <div className="pokemon-move-info__value">{title(data.type.name)}</div>
                </div>
                <div className="pokemon-move-info">
                  <div className="pokemon-move-info__key">Accuracy</div>
                  <div className="pokemon-move-info__value">{data.accuracy}</div>
                </div>
                <div className="pokemon-move-info">
                  <div className="pokemon-move-info__key">Power</div>
                  <div className="pokemon-move-info__value">{data.power}</div>
                </div>
                <div className="pokemon-move-info">
                  <div className="pokemon-move-info__key">PP</div>
                  <div className="pokemon-move-info__value">{data.pp}</div>
                </div>
              </>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Moves;
