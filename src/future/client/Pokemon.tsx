import { title } from "case";
// @ts-ignore
import React, { Placeholder } from "react";

import Info from "./Info";
import Moves from "./Moves";

import "isomorphic-unfetch";
// @ts-ignore
import { createResource } from "simple-cache-provider";
import Spinner from "../../Spinner";
import cache from "../react/cache";

interface Props {
  name: string;
}

// @ts-ignore
const pokemonResource = createResource(pokemon =>
  fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon).then(r => r.json()),
);

const Pokemon: React.SFC<Props> = ({ name }) => {
  const { name: pokemonName, stats, sprites = {}, types = [], moves = [] } = pokemonResource.read(cache, name);
  const getRandomColorValue = () => Math.floor(Math.random() * 255) + 1;

  return (
    <>
      <div>
        <h1>{title(pokemonName)}</h1>
        {types.map(({ type }: any) => (
          <span
            key={type}
            className="pokemon-types__type"
            style={{
              backgroundColor: `hsla(${getRandomColorValue()}, 50%, 70%,.2)`,
            }}
          >
            {type.name}
          </span>
        ))}
        <Info name={pokemonName} sprite={sprites.front_default} stats={stats} />
      </div>
      <Placeholder delayMs={10e200} fallback={<Spinner />}>
        <Moves moves={moves.slice(0, 4).map(({ move }: any) => move)} />
      </Placeholder>
    </>
  );
};

export default Pokemon;
