import React from "react";
import { title } from "case";

import Info from "./Info";
import Moves from "./Moves";

import "isomorphic-unfetch";
// @ts-ignore
import { createResource } from "simple-cache-provider";
import cache from "../react/cache";

interface Props {
  name: string;
}

// @ts-ignore
const pokemonResource = createResource(pokemon =>
  fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon).then(r => r.json()),
);

const Pokemon: React.SFC<Props> = ({ name }) => {
  const { name: pokemonName, stats, sprites, types, moves } = pokemonResource.read(cache, name);

  return (
    <>
      <div>
        <h1>{title(pokemonName)}</h1>
        {types.map(({ type }: any) => (
          <span className="pokemon-types__type">{type.name}</span>
        ))}
        <Info name={pokemonName} sprite={sprites.front_default} stats={stats} />
      </div>
      <Moves moves={moves.slice(0, 4).map(({ move }: any) => move)} />
    </>
  );
};

export default Pokemon;
