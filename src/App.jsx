import { useEffect } from 'react';
import { useFilmStore } from './store/useFilmStore';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilmForm from './components/FilmForm';
import FilterSortBar from './components/FilterSortBar';
import FilmList from './components/FilmList';
import AdminBar from './components/AdminBar';
import EditFilmModal from './components/Modal/EditFilmModal';
import Roulette from './components/Roulette';

function App() {
  const { toggleAdminMode } = useFilmStore();

  // Listen for Ctrl+Alt+0 to toggle admin mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key === '0') {
        toggleAdminMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleAdminMode]);

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminBar />
      <Header />
      <SearchBar />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <Roulette />

        <section>
          <FilmForm />
        </section>

        <FilterSortBar />

        <section>
          <FilmList />
        </section>
      </main>

      <EditFilmModal />
    </div>
  );
}

export default App;
