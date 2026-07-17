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
      className="bg-gray-900 p-5 rounded-lg shadow-lg border border-gray-800"
    >
      <h2 className="text-lg font-bold mb-4 text-gray-100">Adicionar Novo Filme</h2>

      {error && (
        <div className="mb-4 p-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <input
          type="text"
          name="nome"
          placeholder="Nome do filme *"
          required
          disabled={loading}
          className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:opacity-50 text-sm"
        />

        <input
          type="url"
          name="imagem"
          placeholder="URL da imagem (opcional)"
          disabled={loading}
          className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:opacity-50 text-sm"
        />

        <textarea
          name="descricao"
          placeholder="Descrição (opcional)"
          rows="2"
          disabled={loading}
          className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:opacity-50 text-sm resize-none"
        />

        <input
          type="date"
          name="lancamento"
          disabled={loading}
          className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:opacity-50 text-sm"
        />

        <input
          type="text"
          name="adicionadoPor"
          placeholder="Seu nome (opcional)"
          disabled={loading}
          className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:opacity-50 text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {loading ? 'Adicionando...' : '➕ Adicionar Filme'}
        </button>
      </div>
    </form>
  );
}
