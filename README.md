

# Playlist de Filmes - React Edition 🎬

Site para gerenciar uma playlist colaborativa de filmes.

**[Acesse o site aqui!](https://voiwd.github.io/PlaylistFilmes/)** 🎞️📽️

## Funcionalidades

- ✅ Adicionar novos filmes à playlist
- ✅ Buscar filmes por nome, descrição, autor e disponibilidade
- ✅ Identificar filmes via TMDB e enriquecer com pôster/sinopse
- ✅ Mostrar onde assistir e preço via Watchmode
- ✅ Ordenar filmes por data de adição, lançamento ou nome
- ✅ Sortear filme aleatório (com efeito confete! 🎉)
- ✅ Modo admin para editar ou apagar filmes
- ✅ Interface moderna com Tailwind CSS
- ✅ Sincronização em tempo real com Firebase

## Stack Técnico

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Firebase Realtime Database
- **Integrações**: TMDB + Watchmode
- **Build**: Vite

## Setup e Desenvolvimento

### Pré-requisitos
- Node.js 16+ e npm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Voiwd/PlaylistFilmes.git
cd PlaylistFilmes

# Instale as dependências
npm install
```

### Variáveis de Ambiente

1. Copie `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

2. Preencha os valores publicos do Firebase e as variaveis privadas das Functions em `.env.local`:
```env
APP_FIREBASE_API_KEY=sua_chave_aqui
APP_FIREBASE_AUTH_DOMAIN=seu_dominio.firebaseapp.com
# ... outros valores
TMDB_API_KEY=sua_tmdb_key_aqui
WATCHMODE_API_KEY=sua_watchmode_key_aqui
ADMIN_PASSWORD=uma_senha_forte
APP_DEFAULT_COUNTRY=BR
```

**⚠️ IMPORTANTE**: Nunca comite `.env.local`! Ele está no `.gitignore`. Na Vercel, cadastre `TMDB_API_KEY`, `TMDB_ACCESS_TOKEN` (se usar), `WATCHMODE_API_KEY` e `ADMIN_PASSWORD` nas Environment Variables do projeto.

### Executar em Desenvolvimento

```bash
npm run dev
```

O app será aberto em `http://localhost:5173`

Para testar também as Vercel Functions localmente, use:

```bash
npm run dev:vercel
```

### Build para Produção

```bash
npm run build
```

A build será gerada em `./dist/`

## Como Usar

### Adicionar Filme
1. Busque o filme no TMDB
2. Selecione o resultado correto e confira os dados preenchidos
3. Clique em "Salvar filme"
4. O filme aparecerá na grid com pôster, sinopse e disponibilidade

### Buscar Filme
Use a barra de busca no topo - ela filtra por nome, sinopse, autor e fornecedores em tempo real.

### Ordenar Filmes
Use o dropdown "Ordenar por" para escolher:
- Data de Adição (mais recentes primeiro)
- Data de Lançamento
- Nome (A-Z)

### Sortear Filme
Clique no botão "🌐 Sortear Filme" para escolher um aleatoriamente. Confete explode! 🎉

### Modo Admin
**Atalho**: `Ctrl + Alt + 0`

No modo admin, você pode:
- ✏️ Editar filmes (formulário modal, melhor que prompts!)
- 🗑️ Apagar filmes

## Estrutura do Projeto

```
src/
├── App.jsx                    # Componente raiz
├── main.jsx                   # Entry point
├── index.css                  # Tailwind + estilos
├── components/
│   ├── Header.jsx
│   ├── SearchBar.jsx
│   ├── FilmForm.jsx
│   ├── FilmCard.jsx
│   ├── FilmList.jsx
│   ├── FilterSortBar.jsx
│   ├── AdminBar.jsx
│   ├── Roulette.jsx
│   └── Modal/
│       └── EditFilmModal.jsx
├── store/
│   ├── useFilmStore.js        # Zustand: filmes, admin mode
│   └── useSearchStore.js      # Zustand: busca, ordenação
├── services/
│   └── firebaseService.js     # Operações Firebase CRUD
└── utils/
    └── confetti.js            # Sistema de confete
```

## Segurança

- 🔐 Chaves TMDB, Watchmode e senha admin ficam somente nas Vercel Functions
- 🚫 `.gitignore` protege variáveis de ambiente locais
- ✅ O bundle do navegador não contém esses segredos

## Melhorias Implementadas

vs. versão anterior (single-file HTML):

1. **Modularização**: Componentes reutilizáveis e organizados
2. **UX de Edição**: Modal com form em vez de series de prompts
3. **Barra de Busca**: Filtro em tempo real
4. **Segurança**: API key em variáveis de ambiente
5. **Performance**: Build otimizado com Vite
6. **Manutenibilidade**: Código limpo e bem estruturado
7. **State Management**: Zustand para estado previsível

## Problemas Conhecidos e Resolvidos

- ✅ API key do Firebase exposta no código → Movida para `.env.local`
- ✅ Edição via prompts era ruim → Substituída por modal
- ✅ Sem busca/filtro → Implementada com store compartilhado
- ✅ Código em single file → Refatorado em componentes

## Contribuindo

Sinta-se livre para abrir issues e pull requests!

## Licença

MIT

