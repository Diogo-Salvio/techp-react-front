# Top 5 - As Mais Tocadas de Tião Carreiro e Pardinho

As Mais Tocadas de Tião Carreiro e Pardinho

## Como Rodar

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd react-frontend

# 2. Inicie com Docker
docker-compose up --build

# 3. Acesse: http://localhost:3000
```

**Pré-requisito**: Docker e Docker Compose instalados

## Funcionalidades

- Sugerir músicas via YouTube
- Visualizar músicas aprovadas
- Painel administrativo para gerenciar sugestões
- Aprovar/reprovar sugestões
- Remover músicas aprovadas

## Credenciais Admin

- **Email**: `fanumero1dotiaoecarreiro@admin.com`
- **Senha**: `boisoberano`

## Comandos Úteis

```bash
# Parar aplicação
docker-compose down

# Ver logs
docker-compose logs -f frontend

# Executar testes
docker-compose exec frontend npm test

# Entrar no container
docker-compose exec frontend sh
```

## Tecnologias

- React 18
- Material-UI
- Axios
- Docker
- Jest + React Testing Library