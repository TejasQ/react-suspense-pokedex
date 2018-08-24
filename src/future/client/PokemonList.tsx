import { title } from "case";
import React from "react";

import "isomorphic-unfetch";
// @ts-ignore
import { createResource } from "simple-cache-provider";

import cache from "../react/cache";

interface Props {
  breed?: string;
  onChooseBreed: (breed: string) => void;
}

// @ts-ignore
const pokemonListResource = createResource(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/?limit=151").then(r => r.json()),
);

const PokemonList: React.SFC<Props> = ({ onChooseBreed }) => (
  <ul>
    {pokemonListResource.read(cache).results.map(({ name }: { name: string }) => (
      <li key={name} onClick={() => onChooseBreed(name)}>
        {title(name)}
      </li>
    ))}
  </ul>
);

export default PokemonList;
