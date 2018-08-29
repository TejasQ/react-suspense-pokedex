import React from "react";
import { title } from "case";

interface InfoProps {
  name: string;
  sprite: string;
  stats: any[];
}

const Info: React.SFC<InfoProps> = ({ name, sprite, stats }) => (
  <div className="pokemon-info">
    <div className="pokemon-photo">
      <img alt={name} src={sprite} />
    </div>
    <div className="pokemon-properties">
      <div className="info pokemon-stats">
        <ul>
          {stats.map(({ stat, base_stat }: any) => (
            <li>
              {title(stat.name)}
              <div className="pokemon-stats__stat-container">
                <progress className="pokemon-stats__stat" value={base_stat} max="252" />
                <div className="pokemon-stats__stat-value">{base_stat} / 252</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default Info;
