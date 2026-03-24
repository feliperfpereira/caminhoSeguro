# Caminho Seguro

Aplicação web para sugerir trajetos urbanos com base em rotas do Google Maps e em um histórico de ocorrências da SSP-SP, ajudando o usuário a escolher o caminho com menor exposição registrada.

## Origem do projeto

Este projeto foi desenvolvido durante o hackathon Build with TRAE @Brasil São Paulo, realizado em 22/03/2026.

Participantes:

- Felipe Fonseca: https://www.linkedin.com/in/feliperfonseca/
- Cesar Bahiense Porto: https://www.linkedin.com/in/cesar-bahiense-porto/
- Raphaela Medeiros Costa: https://www.linkedin.com/in/raphaelamedeiroscosta/

Link do evento: https://luma.com/eidos6qb?locale=pt

## Visão geral

O Caminho Seguro permite:

- informar origem, destino e meio de transporte
- consultar rotas alternativas via Google Routes API
- cruzar o trajeto com uma base de ocorrências agregadas da SSP-SP
- ordenar as rotas da mais segura para a menos segura
- visualizar no mapa os pontos com registros ao longo do percurso
- compartilhar a rota por link ou WhatsApp

## Como o sistema funciona

1. O usuário informa origem, destino e modo de deslocamento.
2. O frontend chama uma função HTTP no Firebase para geocodificar os endereços e buscar rotas.
3. A função consulta a Google Routes API e retorna até 3 opções de trajeto.
4. O frontend cruza a polyline da rota com o arquivo `data/ocorrencias_agrupadas.json`.
5. As rotas são classificadas pelo total de ocorrências encontradas no entorno do percurso.
6. O usuário pode abrir o detalhamento da rota, ver os pontos no mapa e compartilhar o trajeto.

## Principais funcionalidades

- seleção de origem e destino com interface mobile-first
- suporte a carro, caminhada, bicicleta e transporte público
- recomendação automática da rota com menor histórico de ocorrências
- detalhamento por rua com total de registros encontrados
- mapa com percurso, origem, destino e marcadores de risco
- compartilhamento rápido por link e WhatsApp
- página especial de apresentação em `/pitch`

## Stack utilizada

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Firebase Functions v2
- Firebase Hosting
- Google Maps Geocoding API
- Google Routes API

### Dados

- base local em `data/ocorrencias_agrupadas.json`
- histórico de ocorrências utilizado para estimar segurança do trajeto

## Estrutura do projeto

```text
.
├─ src/
│  ├─ pages/        # telas principais da aplicação
│  ├─ components/   # componentes visuais
│  └─ services/     # integração com rotas, mapa e análise de segurança
├─ data/            # base de ocorrências usada no cruzamento das rotas
├─ functions/       # funções HTTP do Firebase
├─ public/          # arquivos públicos do frontend
└─ design/          # referências visuais e protótipos
```

## Pré-requisitos

Antes de rodar o projeto, tenha instalado:

- Node.js
- npm
- Firebase CLI

Para trabalhar com as funções localmente, este projeto declara `Node 24` em `functions/package.json`.

## Como rodar o projeto

### 1. Instale as dependências do frontend

```bash
npm install
```

### 2. Instale as dependências das funções

```bash
cd functions
npm install
cd ..
```

### 3. Configure a variável de ambiente das funções

Crie o arquivo `functions/.env` com a chave da Google Maps API:

```env
GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

Você pode usar `functions/.env.example` como referência.

### 4. Inicie o frontend

```bash
npm run dev
```

O frontend ficará disponível normalmente em:

```text
http://localhost:5173
```

## Rodando as funções localmente

Dentro da pasta `functions`, execute:

```bash
npm run serve
```

Isso inicia o emulador do Firebase Functions.

## Importante sobre desenvolvimento local

Atualmente o frontend está configurado para consumir endpoints publicados em produção para:

- obter a chave do Google Maps
- buscar múltiplas rotas

Ou seja, para abrir a interface localmente, basta rodar o frontend e ter conectividade com esses endpoints já publicados.

Se você quiser usar exclusivamente o backend local via emulador, será necessário ajustar as URLs dos serviços no frontend:

- `src/services/googleRoutes.ts`
- `src/services/mapsLoader.ts`

## Scripts disponíveis

### Raiz do projeto

```bash
npm run dev
npm run build
npm run lint
npm run preview
npm run deploy
```

### Pasta `functions`

```bash
npm run build
npm run build:watch
npm run serve
npm run shell
npm run deploy
npm run logs
```

## Build de produção

Para gerar o build do frontend:

```bash
npm run build
```

Os arquivos finais serão gerados em `dist/`.

## Deploy

### Hosting

```bash
npm run deploy
```

### Functions

```bash
cd functions
npm run deploy
```

## Fluxo da experiência

- tela inicial com proposta do produto
- formulário para origem, destino e modo de transporte
- seleção de rotas ordenadas por segurança
- detalhamento do trajeto com mapa e ocorrências
- compartilhamento com contato de confiança

## Observações

- a análise usa histórico de ocorrências, não previsão em tempo real
- ausência de ocorrências no sistema não significa ausência total de risco
- as funções HTTP possuem validação de origem para restringir chamadas

## Licença

Este projeto não possui uma licença definida no repositório até o momento.
