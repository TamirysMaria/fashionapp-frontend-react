# Fashion App — React Native (Expo)

Aplicativo mobile para gerenciar o catálogo de produtos de moda, conectado ao backend deployado no Render.

## Estrutura do projeto

```
FashionApp/
├── screens/
│   ├── HomeScreen.js   → Lista de produtos (catálogo)
│   └── FormScreen.js   → Criar / editar produto
├── services/
│   └── api.js          → Chamadas ao backend (GET, POST, PUT, DELETE)
├── App.js              → Navegação entre telas
├── index.js            → Entry point do Expo
├── app.json
├── babel.config.js
└── package.json
```

## Backend

URL base: `https://fashionapp-backend-orzu.onrender.com/api/entries`

Endpoints:
- `GET /` — listar todos os produtos
- `GET /:id` — buscar produto por ID
- `POST /` — criar produto
- `PUT /:id` — atualizar produto
- `DELETE /:id` — excluir produto

## Instalação

```bash
npm install
npx expo start
```

## Dependências principais

- `@react-navigation/native` + `@react-navigation/native-stack` — navegação entre telas
- `react-native-screens` + `react-native-safe-area-context` — dependências da navegação
- `expo ~52.0.0`
