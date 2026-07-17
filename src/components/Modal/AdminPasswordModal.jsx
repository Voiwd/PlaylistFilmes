import { useState } from 'react';

export default function AdminPasswordModal({ isOpen, onClose, onSubmit }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    if (password === correctPassword) {
      onSubmit();
      setPassword('');
    } else {
      setError('Senha incorreta!');
      setPassword('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">🔐 Modo Admin</h2>
        <p className="text-gray-300 mb-4 text-sm">Digite a senha para acessar o modo admin:</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 text-sm"
            autoFocus
          />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setPassword('');
                setError('');
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded font-medium transition text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition text-sm"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
