import { useEffect } from 'react';
import { useFilmStore } from '../store/useFilmStore';
import { useSearchStore } from '../store/useSearchStore';
import { listenToFilms } from '../services/firebaseService';
import FilmCard from './FilmCard';

export default function FilmList() {
  const { films, setFilms } = useFilmStore();
  const { sortFilms, filterFilms } = useSearchStore();

  useEffect(() => {
    const unsubscribe = listenToFilms((updatedFilms) => {
      setFilms(updatedFilms);
    });

    return unsubscribe;
  }, [setFilms]);

  // Apply search filter and sorting
  const filteredFilms = filterFilms(films);
  const displayedFilms = sortFilms(filteredFilms);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
      {displayedFilms.length > 0 ? (
        displayedFilms.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))
      ) : films.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-slate-400 text-lg">Nenhum filme adicionado ainda. Comece agora!</p>
        </div>
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-slate-400 text-lg">Nenhum filme encontrado com essa busca.</p>
        </div>
      )}
    </div>
  );
}
