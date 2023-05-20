import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
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


  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCancelRequest(false);

    while (!cancelRequest) {
      try {
        const response = await fetch('https://react-http-ca306-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json');
        if (!response.ok) {
          throw new Error('Something went wrong! ...Retrying');
        }
        
        const data = await response.json();
  
        const loadedMovies = [];

        for(const key in data) {
          loadedMovies.push({
            id:key,
            title: data[key].title,
            openingText: data[key].openingText,
            releaseDate: data[key].releaseDate,
          })
        }

        setMovies(loadedMovies);
        setIsLoading(false);
        setError(null);
        return;
      } catch (error) {
        setError(error.message);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for the specified delay before retrying
      }
    }
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [])

  async function addMoviesHandler(movie) {
    const response = await fetch('https://react-http-ca306-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      header: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  }

  function handleCancelRequest() {
    setCancelRequest(true);
  }

  async function deleteMoviesHandler(movie) {
    const response = await fetch(`https://react-http-ca306-default-rtdb.asia-southeast1.firebasedatabase.app/movies/${movie.id}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const updatedMovies = movies.filter((m) => m.id !== movie.id);
    setMovies(updatedMovies);
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMoviesHandler}/>
      </section>
      <section>
        <button onClick={fetchMoviesHandler} disabled={isLoading}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} onDeleteMovie={deleteMoviesHandler} />}
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
