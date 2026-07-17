import React, { useState } from 'react';
import { useFilmStore } from '../store/useFilmStore';
import { deleteFilm } from '../services/firebaseService';

export default function FilmCard({ film }) {
  const { adminMode, openEditModal } = useFilmStore();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que quer apagar este filme?')) return;
    try {
      setDeleting(true);
      await deleteFilm(film.id);
    } catch (error) {
      console.error('Error deleting film:', error);
      alert('Erro ao apagar filme');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="card bg-slate-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all border border-slate-700">
      <img
        src={film.imagem}
        alt={film.nome}
        className="w-full h-64 object-cover"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x450?text=Sem+Imagem';
        }}
      />

      <div className="p-4">
        <h3 className="text-lg font-bold truncate">{film.nome}</h3>

        {film.descricao && (
          <p className="text-sm text-slate-400 line-clamp-2 mt-2">{film.descricao}</p>
        )}

        {film.lancamento && (
          <p className="text-xs text-slate-500 mt-2">
            <span className="font-semibold">Lançamento:</span> {new Date(film.lancamento).toLocaleDateString('pt-BR')}
          </p>
        )}

        <p className="text-xs text-slate-500 mt-2">
          <span className="font-semibold">Adicionado por:</span> {film.adicionadoPor || 'Desconhecido'}
        </p>

        {adminMode && (
          <div className="admin-section mt-4 pt-4 border-t border-slate-700">
            <button
              onClick={() => openEditModal(film)}
              className="admin-btn flex-1 mr-2"
            >
              ✏️ Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="admin-btn flex-1 bg-red-700 hover:bg-red-800 disabled:opacity-50"
            >
              {deleting ? '...' : '🗑️ Apagar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
