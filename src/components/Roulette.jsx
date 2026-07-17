import { useRef, useState, useEffect } from 'react';
import { useFilmStore } from '../store/useFilmStore';
import { ConfettiSystem } from '../utils/confetti';

export default function Roulette() {
  const { films } = useFilmStore();
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const canvasRef = useRef(null);
  const confettiRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && !confettiRef.current) {
      confettiRef.current = new ConfettiSystem(canvasRef.current);
    }
  }, []);

  const handleSpin = () => {
    if (films.length === 0) {
      setSelectedFilm(null);
      return;
    }

    setIsSpinning(true);
    setSelectedFilm(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * films.length);
      const chosen = films[randomIndex];
      setSelectedFilm(chosen);
      setIsSpinning(false);

      if (confettiRef.current) {
        confettiRef.current.spawn();
      }
    }, 600);
  };

  return (
    <div className="py-4 px-0 text-center">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40"
        style={{ width: '100vw', height: '100vh' }}
      />

      <button
        onClick={handleSpin}
        disabled={isSpinning || films.length === 0}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        🌐 {isSpinning ? 'Girando...' : 'Sortear Filme'}
      </button>

      {selectedFilm && (
        <div className="show mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800 inline-block">
          <p className="text-lg font-bold mb-2">
            🎬 Filme sorteado:
          </p>
          <p className="text-xl font-bold text-green-400">{selectedFilm.nome}</p>
          {selectedFilm.descricao && (
            <p className="text-gray-400 mt-2 text-sm">{selectedFilm.descricao}</p>
          )}
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
