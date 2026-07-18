import { useEffect, useRef, useState } from 'react';
import { useFilmStore } from './store/useFilmStore';
import Header from './components/Header';
import FilmForm from './components/FilmForm';
import FilterSortBar from './components/FilterSortBar';
import FilmList from './components/FilmList';
import AdminBar from './components/AdminBar';
import EditFilmModal from './components/Modal/EditFilmModal';
import FilmDetailsModal from './components/Modal/FilmDetailsModal';
import AdminPasswordModal from './components/Modal/AdminPasswordModal';
import Roulette from './components/Roulette';

function App() {
  const { toggleAdminMode, isPasswordModalOpen, openPasswordModal, closePasswordModal } = useFilmStore();
  const rouletteRef = useRef(null);
  const [isFilmModalOpen, setIsFilmModalOpen] = useState(false);

  // Listen for Ctrl+Alt+0 to toggle admin mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key === '0') {
        openPasswordModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openPasswordModal]);

  return (
    <div className="min-h-screen bg-gray-950">
      <AdminBar />
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsFilmModalOpen(true)}
            className="interactive-button rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-100 shadow-lg transition duration-300 hover:bg-gray-700"
          >
            ➕ Cadastrar Filme
          </button>
          <button
            type="button"
            onClick={() => rouletteRef.current?.spin()}
            className="interactive-button group relative overflow-hidden rounded-xl border border-green-400/40 bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(16,185,129,0.25)] transition duration-300 hover:bg-gradient-to-g hover:from-fuchsia-500 hover:via-cyan-500 hover:to-emerald-500 hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="relative z-10">🎊 Sortear Filme</span>
          </button>
        </div>

        <section>
          <Roulette ref={rouletteRef} showTrigger={false} />
        </section>

        <section>
          <FilmForm
            isOpen={isFilmModalOpen}
            onClose={() => setIsFilmModalOpen(false)}
          />
        </section>

        <FilterSortBar />

        <section>
          <FilmList />
        </section>
      </main>

      <EditFilmModal />
      <FilmDetailsModal />
      <AdminPasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
        onSubmit={() => {
          toggleAdminMode();
          closePasswordModal();
        }}
      />
    </div>
  );
}

export default App;
