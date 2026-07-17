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
        imagem: editingFilm.imagem || '',
        descricao: editingFilm.descricao || '',
        lancamento: editingFilm.lancamento || '',
      });
      setError('');
    }
  }, [editingFilm]);

  if (!isEditModalOpen || !editingFilm) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        imagem: formData.imagem?.trim() || '',
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full border border-gray-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">Editar Filme</h2>
          <button
            onClick={closeEditModal}
            className="text-gray-400 hover:text-gray-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Nome do Filme *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome || ''}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:opacity-50 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">URL da Imagem</label>
            <input
              type="url"
              name="imagem"
              value={formData.imagem || ''}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:opacity-50 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Descrição</label>
            <textarea
              name="descricao"
              value={formData.descricao || ''}
              onChange={handleChange}
              rows="3"
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:opacity-50 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Data de Lançamento</label>
            <input
              type="date"
              name="lancamento"
              value={formData.lancamento || ''}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:opacity-50 text-sm"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg font-medium disabled:opacity-50 text-sm"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={closeEditModal}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg font-medium disabled:opacity-50 text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
