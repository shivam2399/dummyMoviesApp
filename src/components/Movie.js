import React from 'react';

import classes from './Movie.module.css';

const Movie = (props) => {
  const handleDelete= () => {
    props.onDelete();
  }
  return (
    <li className={classes.movie}>
        <div>
        <h2>{props.title}</h2>
        <h3>{props.releaseDate}</h3>
        <p>{props.openingText}</p>
        </div>
        <div>
         <button onClick={handleDelete}>Delete</button>
        </div>
    </li>
  );
};

export default Movie;
