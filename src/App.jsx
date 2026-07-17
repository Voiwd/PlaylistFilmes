import { useEffect } from 'react';
import { useFilmStore } from './store/useFilmStore';
import Header from './components/Header';
import FilmForm from './components/FilmForm';
import FilterSortBar from './components/FilterSortBar';
import FilmList from './components/FilmList';
import AdminBar from './components/AdminBar';
import EditFilmModal from './components/Modal/EditFilmModal';
import AdminPasswordModal from './components/Modal/AdminPasswordModal';
import Roulette from './components/Roulette';

function App() {
  const { toggleAdminMode, isPasswordModalOpen, openPasswordModal, closePasswordModal } = useFilmStore();

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
        <section>
          <FilmForm />
        </section>

        <section>
          <Roulette />
        </section>

        <FilterSortBar />

        <section>
          <FilmList />
        </section>
      </main>

      <EditFilmModal />
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
