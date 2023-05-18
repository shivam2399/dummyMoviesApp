import React, { useState, useEffect } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancelRequest, setCancelRequest] = useState(false);
  
  useEffect(() => {
    if (cancelRequest) {
      setIsLoading(false);
      setError(null);
      setCancelRequest(false);
    }
  }, [cancelRequest]);

  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);
    setCancelRequest(false);

    while (!cancelRequest) {
      try {
        const response = await fetch('https://swapi.dev/api/films');
        if (!response.ok) {
          throw new Error('Something went wrong! ...Retrying');
        }
        
        const data = await response.json();
  
        const transformedMovies = data.results.map(movieData => ({
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date
        }));
        
        setMovies(transformedMovies);
        setIsLoading(false);
        setError(null);
        return;
      } catch (error) {
        setError(error.message);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for the specified delay before retrying
      }
    }
  }

  function handleCancelRequest() {
    setCancelRequest(true);
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} disabled={isLoading}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>No movies found</p>}
        {isLoading && !error && <p>Loading...</p>}
        {isLoading && error && <p>{error}</p>}
        {isLoading && (
        <div>
          <button onClick={handleCancelRequest}>Cancel</button>
        </div>
      )}
      </section>
    </React.Fragment>
  );
}

export default App;
