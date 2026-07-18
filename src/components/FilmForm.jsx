import { useState } from 'react';
import { addFilm } from '../services/firebaseService';

export default function FilmForm({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.target);
    const nome = formData.get('nome').trim();
    const imagem = formData.get('imagem').trim() || 'https://via.placeholder.com/300x450?text=Sem+Imagem';
    const descricao = formData.get('descricao').trim();
    const lancamento = formData.get('lancamento') || '';
    const adicionadoPor = formData.get('adicionadoPor').trim() || 'Anônimo';

    if (!nome) {
      setError('O nome do filme é obrigatório');
      return;
    }

    try {
      setLoading(true);
      await addFilm({
        nome,
        imagem,
        descricao,
        lancamento,
        adicionadoPor,
      });
      e.target.reset();
      onClose?.();
    } catch (err) {
      setError('Erro ao adicionar filme. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="roulette-overlay fixed inset-0 z-[50] flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-film-title"
      onClick={onClose}
    >
      <div
        className="roulette-card relative z-[60] w-full max-w-lg overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-800 p-5">
          <h2 id="add-film-title" className="text-xl font-bold text-gray-100">
            Adicionar Novo Filme
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="interactive-button text-3xl leading-none text-gray-400 hover:text-gray-200"
            aria-label="Fechar cadastro de filme"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          {error && (
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-gray-200">
              {error}
            </div>
          )}

          <input
            type="text"
            name="nome"
            placeholder="Nome do filme *"
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
          />

          <input
            type="url"
            name="imagem"
            placeholder="URL da imagem (opcional)"
            disabled={loading}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
          />

          <textarea
            name="descricao"
            placeholder="Descrição (opcional)"
            rows="3"
            disabled={loading}
            className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
          />

          <input
            type="date"
            name="lancamento"
            disabled={loading}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
          />

          <input
            type="text"
            name="adicionadoPor"
            placeholder="Seu nome (opcional)"
            disabled={loading}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition-colors duration-150 hover:bg-gray-700 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-100 transition-colors duration-150 hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Adicionando...' : '➕ Adicionar Filme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
