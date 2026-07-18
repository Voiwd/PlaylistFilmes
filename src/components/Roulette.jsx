import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useFilmStore } from '../store/useFilmStore';
import { ConfettiSystem } from '../utils/confetti';

const Roulette = forwardRef(function Roulette({ showTrigger = true }, ref) {
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

  useImperativeHandle(ref, () => ({
    spin: handleSpin,
  }));

  return (
    <div className="py-4 px-0 text-center">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[40] pointer-events-none"
        aria-hidden="true"
      />

      {showTrigger && (
        <button
          onClick={handleSpin}
          disabled={films.length === 0}
          className="interactive-button group relative overflow-hidden rounded-xl border border-green-400/40 bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(16,185,129,0.25)] transition duration-300 hover:bg-gradient-to-g hover:from-fuchsia-500 hover:via-cyan-500 hover:to-emerald-500 hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="relative z-10">🎊 Sortear Filme</span>
        </button>
      )}

      {selectedFilm && (
        <div
          className="roulette-overlay fixed inset-0 z-[50] flex items-start justify-center overflow-y-auto bg-black bg-opacity-75 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="roulette-film-title"
          onClick={() => setSelectedFilm(null)}
        >
          <div
            className="roulette-card relative z-[60] flex w-full max-w-sm max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-900 text-center shadow-2xl"
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
            <div className="min-h-0 flex-1 overflow-y-auto">
              <img
                src={selectedFilm.posterUrl || selectedFilm.imagem}
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
        </div>
      )}

      {films.length === 0 && (
        <p className="mt-3 text-gray-400 text-sm">
          Nenhum filme na playlist. Adicione alguns para começar!
        </p>
      )}
    </div>
  );
});

export default Roulette;
