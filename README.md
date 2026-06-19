# Fashion App — React Native (Expo)

Aplicativo mobile desenvolvido em React Native utilizando Expo para gerenciamento de um catálogo de produtos de moda, integrado a uma API REST hospedada no Render.

## Estrutura do Projeto

```text
FashionApp/
├── screens/
│   ├── HomeScreen.js   → Lista de produtos (catálogo)
│   └── FormScreen.js   → Cadastro e edição de produtos
├── services/
│   └── api.js          → Comunicação com a API
├── App.js              → Configuração da navegação
├── index.js            → Ponto de entrada da aplicação
├── app.json
├── babel.config.js
└── package.json
```

## Backend

URL Base:

https://fashionapp-backend-orzu.onrender.com/api/entries

### Endpoints

* GET / → Listar todos os produtos
* GET /:id → Buscar produto por ID
* POST / → Cadastrar produto
* PUT /:id → Atualizar produto
* DELETE /:id → Remover produto

## Tecnologias Utilizadas

* React Native
* Expo
* JavaScript
* React Navigation

## Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
```

2. Instale as dependências:

```bash
npm install
```

## Execução

Inicie o projeto com:

```bash
npx expo start
```

Após iniciar o Expo, utilize um dispositivo físico ou emulador para executar a aplicação.

## Dependências Principais

* @react-navigation/native
* @react-navigation/native-stack
* react-native-screens
* react-native-safe-area-context
* expo ~52.0.0

```
```
## Desenvolvedor
Tamirys Maria
