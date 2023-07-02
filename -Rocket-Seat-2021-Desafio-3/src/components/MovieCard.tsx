import React from "react";
import { Star, Clock } from "react-feather";

import "../styles/movie-card.scss";

interface MovieCardProps {
  title: string;
  poster: string;
  rating: string;
  runtime: string;
}

const MemoizedStar = React.memo(Star);
const MemoizedClock = React.memo(Clock);

export function MovieCard(props: MovieCardProps) {
  return (
    <div className="movie-card">
      <img src={props.poster} alt={props.title} />

      <div>
        <div className="movie-info">
          <span>{props.title}</span>
          <div className="meta">
            <div>
              <MemoizedStar /> {props.rating}
            </div>

            <div>
              <MemoizedClock /> {props.runtime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
