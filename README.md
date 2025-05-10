# MLCrawler

D6Lab é uma plataforma on-premise para intermediação de compras B2P (Business-to-Procurement) automatizadas em marketplaces como o Mercado Livre.

## Descrição

Este projeto é uma API que consulta a API oficial do Mercado Livre para buscar produtos e retornar informações formatadas. Serve como um buscador B2B de produtos no Mercado Livre.

## Funcionalidades

- Endpoint GET `/buscar?q=...` que busca produtos no Mercado Livre
- Retorna os 3 primeiros resultados com as seguintes informações:
  - Título
  - Preço
  - Link direto
  - ID da categoria
  - Condição (novo/usado)
  - ID do vendedor

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- Axios
- Dotenv

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/mlcrawler.git
   cd mlcrawler
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env` com seu token de acesso:
   ```
   PORT=3000
   MERCADO_LIVRE_ACCESS_TOKEN=seu_token_aqui
   ```

## Uso

1. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse a API através do navegador ou ferramentas como Postman:
   ```
   http://localhost:3000/buscar?q=smartphone
   ```

## Compilação para Produção

```bash
npm run build
npm start
```

## Estrutura do Projeto

```
├── src/
│   ├── controllers/
│   │   └── search-controller.ts
│   ├── services/
│   │   └── mercado-livre-service.ts
│   ├── models/
│   │   └── product.ts
│   ├── routes/
│   │   └── api-routes.ts
│   ├── middlewares/
│   │   └── error-middleware.ts
│   └── index.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```
