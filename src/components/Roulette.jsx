import { useEffect, useRef, useState } from 'react';
import { useFilmStore } from '../store/useFilmStore';
import { ConfettiSystem } from '../utils/confetti';

export default function Roulette() {
  const { films } = useFilmStore();
  const [selectedFilm, setSelectedFilm] = useState(null);
  const canvasRef = useRef(null);
  const confettiRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      confettiRef.current = new ConfettiSystem(canvasRef.current);
    }

    return () => confettiRef.current?.destroy();
  }, []);

  const handleSpin = () => {
    if (films.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * films.length);
    setSelectedFilm(films[randomIndex]);
    confettiRef.current?.spawn();
  };

  return (
    <div className="py-4 px-0 text-center">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[60] pointer-events-none"
        aria-hidden="true"
      />
      <button
        onClick={handleSpin}
        disabled={films.length === 0}
        className="interactive-button px-4 py-2 bg-gray-100 hover:bg-white text-black font-bold rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🌐 Sortear Filme
      </button>

      {selectedFilm && (
        <div
          className="roulette-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="roulette-film-title"
          onClick={() => setSelectedFilm(null)}
        >
          <div
            className="roulette-card relative w-full max-w-sm overflow-hidden rounded-lg border border-gray-700 bg-gray-900 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="interactive-button absolute right-3 top-2 z-10 text-3xl leading-none text-gray-200"
              onClick={() => setSelectedFilm(null)}
              aria-label="Fechar filme sorteado"
            >
              ×
            </button>
            <img
              src={selectedFilm.imagem}
              alt={selectedFilm.nome}
              className="w-full aspect-[2/3] object-cover bg-gray-800"
              onError={(event) => {
                event.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect fill="%23262626" width="300" height="450"/><text x="50%" y="50%" font-size="16" fill="%23a3a3a3" text-anchor="middle" dominant-baseline="middle" font-family="Arial">Sem Imagem</text></svg>';
              }}
            />
            <div className="p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-300">Filme sorteado</p>
              <h2 id="roulette-film-title" className="mt-1 text-xl font-bold text-gray-100">{selectedFilm.nome}</h2>
            </div>
          </div>
        </div>
      )}

      {films.length === 0 && (
        <p className="mt-3 text-gray-400 text-sm">
          Nenhum filme na playlist. Adicione alguns para começar!
        </p>
      )}
    </div>
  );
}
