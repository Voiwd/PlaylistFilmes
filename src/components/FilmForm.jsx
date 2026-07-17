import { useState } from 'react';
import { addFilm } from '../services/firebaseService';

export default function FilmForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    } catch (err) {
      setError('Erro ao adicionar filme. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-700"
    >
      <h2 className="text-xl font-bold mb-4">Adicionar Novo Filme</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <input
          type="text"
          name="nome"
          placeholder="Nome do filme *"
          required
          disabled={loading}
          className="w-full px-4 py-2 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        />

        <input
          type="url"
          name="imagem"
          placeholder="URL da imagem (opcional)"
          disabled={loading}
          className="w-full px-4 py-2 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        />

        <textarea
          name="descricao"
          placeholder="Descrição (opcional)"
          rows="3"
          disabled={loading}
          className="w-full px-4 py-2 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        />

        <input
          type="date"
          name="lancamento"
          disabled={loading}
          className="w-full px-4 py-2 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        />

        <input
          type="text"
          name="adicionadoPor"
          placeholder="Seu nome (opcional)"
          disabled={loading}
          className="w-full px-4 py-2 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adicionando...' : 'Adicionar Filme'}
        </button>
      </div>
    </form>
  );
}
