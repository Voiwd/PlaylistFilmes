import { useEffect, useState } from 'react';
import { useFilmStore } from '../../store/useFilmStore';
import { updateFilm } from '../../services/firebaseService';

export default function EditFilmModal() {
  const { editingFilm, isEditModalOpen, closeEditModal } = useFilmStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (editingFilm) {
      setFormData({
        nome: editingFilm.nome || '',
        imagem: editingFilm.imagem || editingFilm.posterUrl || '',
        posterUrl: editingFilm.posterUrl || editingFilm.imagem || '',
        descricao: editingFilm.descricao || editingFilm.overview || '',
        overview: editingFilm.overview || editingFilm.descricao || '',
        lancamento: editingFilm.lancamento || '',
      });
      setError('');
    }
  }, [editingFilm]);

  if (!isEditModalOpen || !editingFilm) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => {
      const next = { ...current, [name]: value };

      if (name === 'imagem' && !current.posterUrl) {
        next.posterUrl = value;
      }

      if (name === 'posterUrl' && !current.imagem) {
        next.imagem = value;
      }

      if (name === 'descricao' && !current.overview) {
        next.overview = value;
      }

      if (name === 'overview' && !current.descricao) {
        next.descricao = value;
      }

      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.nome.trim()) {
      setError('O nome do filme é obrigatório');
      return;
    }

    try {
      setLoading(true);
      await updateFilm(editingFilm.id, {
        nome: formData.nome.trim(),
        descricao: formData.descricao?.trim() || '',
        overview: formData.overview?.trim() || formData.descricao?.trim() || '',
        imagem: formData.imagem?.trim() || '',
        posterUrl: formData.posterUrl?.trim() || formData.imagem?.trim() || '',
        lancamento: formData.lancamento || '',
      });
      closeEditModal();
    } catch (err) {
      setError('Erro ao atualizar filme');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center">
      <div className="flex w-full max-w-lg max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-100">Editar Filme</h2>
            <p className="mt-1 text-xs text-gray-400">
              Alterações manuais preservam os campos TMDB/Watchmode já salvos.
            </p>
          </div>
          <button
            onClick={closeEditModal}
            className="text-2xl leading-none text-gray-400 hover:text-gray-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-6">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
              {error}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-3 text-xs text-gray-400">
              <span className="block font-semibold text-gray-300">TMDB ID</span>
              <span>{editingFilm.tmdbId || 'Não definido'}</span>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-3 text-xs text-gray-400">
              <span className="block font-semibold text-gray-300">Watchmode ID</span>
              <span>{editingFilm.watchmodeId || 'Não definido'}</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-200">Nome do Filme *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome || ''}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-200">Poster URL</label>
            <input
              type="url"
              name="posterUrl"
              value={formData.posterUrl || ''}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-200">Imagem legado</label>
            <input
              type="url"
              name="imagem"
              value={formData.imagem || ''}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-200">Sinopse</label>
            <textarea
              name="descricao"
              value={formData.descricao || ''}
              onChange={handleChange}
              rows="4"
              disabled={loading}
              className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-200">Overview legado</label>
            <textarea
              name="overview"
              value={formData.overview || ''}
              onChange={handleChange}
              rows="4"
              disabled={loading}
              className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-200">
              Data de Lançamento
            </label>
            <input
              type="date"
              name="lancamento"
              value={formData.lancamento || ''}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-500 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={closeEditModal}
              disabled={loading}
              className="flex-1 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-700 disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
