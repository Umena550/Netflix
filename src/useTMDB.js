import { useState, useEffect } from 'react';
import { MOVIES, TMDB_API_KEY, TMDB_IMG, TMDB_BG } from './data';

// Pick the best trailer from TMDB videos list:
// Priority: Official Trailer > Trailer > Teaser > any YouTube video
function pickBestTrailer(videos) {
  if (!videos || !videos.length) return null;
  const yt = videos.filter(v => v.site === 'YouTube');
  if (!yt.length) return null;
  const priority = ['Official Trailer', 'Trailer', 'Teaser', 'Clip', 'Featurette'];
  for (const label of priority) {
    const match = yt.find(v => v.type === 'Trailer' && v.name.includes(label))
                || yt.find(v => v.name.includes(label));
    if (match) return match.key;
  }
  // fallback: first YouTube Trailer, then any YouTube video
  return (yt.find(v => v.type === 'Trailer') || yt[0]).key;
}

// Fetch poster + backdrop + trailer in ONE API call using append_to_response
async function fetchByID(movie) {
  try {
    const type = movie.tmdbType === 'tv' ? 'tv' : 'movie';
    const url = `https://api.themoviedb.org/3/${type}/${movie.tmdbId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();

    const videoId = pickBestTrailer(data.videos?.results) || movie.videoId || null;

    return {
      id:       movie.id,
      thumb:    data.poster_path   ? TMDB_IMG + data.poster_path   : null,
      backdrop: data.backdrop_path ? TMDB_BG  + data.backdrop_path : null,
      videoId,
    };
  } catch {
    return { id: movie.id, thumb: null, backdrop: null, videoId: movie.videoId || null };
  }
}

export function useTMDBPosters() {
  const [movies, setMovies] = useState(MOVIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      const BATCH = 6;
      const results = {};

      for (let i = 0; i < MOVIES.length; i += BATCH) {
        const batch = MOVIES.slice(i, i + BATCH);
        const fetched = await Promise.all(batch.map(fetchByID));
        fetched.forEach(r => { results[r.id] = r; });
        if (i + BATCH < MOVIES.length) {
          await new Promise(r => setTimeout(r, 150));
        }
      }

      if (!cancelled) {
        setMovies(MOVIES.map(m => ({
          ...m,
          thumb:    results[m.id]?.thumb    || null,
          backdrop: results[m.id]?.backdrop || null,
          videoId:  results[m.id]?.videoId  || m.videoId || null,
        })));
        setLoading(false);
      }
    }

    loadAll();
    return () => { cancelled = true; };
  }, []);

  return { movies, loading };
}
