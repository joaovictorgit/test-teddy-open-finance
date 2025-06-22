<p align="center">
  <a href="#" target="blank"><img src="https://teddydigital.io/wp-content/uploads/2025/05/logo-branco.png" width="120" alt="Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <h3 align="center"><strong>API que encurta URLs</strong></h3>
    

## Descrição

-  Construido com uma estrutura de tabelas que para o projeto usando um banco relacional.

- Construido endpoints para autenticação de e-mail e senha que retorna um Bearer Token.

- Construido um endpoint para encurtar o URL, que recebe um URL de origem e aceita requisições com e sem autenticação, e retorna o url encurtado - incluindo o domínio..

- Construido endpoints que aceitam apenas requisições autenticadas:
  - Listagem de URL Encurtados pelo usuário com contabilização de clicks
  - Deletar URL Encurtado
  - Atualizar a origem de um URL encurtado.



## Setup

<h3 style="font-size: 18px;">🧬 Clonando repositório</h3>

```bash
git clone https://github.com/joaovictorgit/test-teddy-open-finance.git
```

<h3 style="font-size: 18px;">📂 Instalar dependências</h3>

```bash
cd test-teddy-open-finance
npm install
```

## Adicionando variáveis de ambiente

<h3 style="font-size: 18px">⚙ Crie um arquivo <strong>.env</strong> na raiz do projeto</h3>

- *Observação*: Os valores **DB_USERNAME** e **DB_PASSWORD** estão configurados para o container MySQL criado via Docker. Se estiver utilizando um servidor MySQL diferente (fora do Docker), substitua pelas credenciais correspondentes ao seu ambiente.

```bash
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=shortUrl
```

## Compilar e executar o projeto via docker

<h3 style="font-size: 18px;">💻 Executar Aplicação</h3>

```bash
docker-compose up --build
```

<h3 style="font-size: 18px;">📂 Coleção com as requisições da API</h3>

[Download da coleção](./assets/OpenDevFinance)

- **Importe a coleção no Insomnia para realizar as requisições.**

## Rodar os testes

```bash
# testes unitários
npm run test
```

## Tecnologias
- Node.js
- Npm
- Nestjs
- Typescript
- Jest
- Swagger

## Author

- GitHub: [joaovictorgit](https://github.com/joaovictorgit)
- LinkedIn: [joaovictordev](https://www.linkedin.com/in/joaovictordev/)