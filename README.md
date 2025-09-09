# Top 5 - As Mais Tocadas de Tião Carreiro e Pardinho

Uma aplicação web que permite aos fãs de Tião Carreiro e Pardinho sugerir suas músicas favoritas via YouTube e visualizar o ranking das mais tocadas. O sistema inclui um painel administrativo completo para gerenciar sugestões e manter o top atualizado.

## Como Rodar

```bash
# 1. Clone o repositório
git clone `https://github.com/Diogo-Salvio/techp-react-front.git`
cd techp-react-front

# 2. Inicie com Docker
docker compose up --build

# 3. Acesse: http://localhost:3000
```

**Pré-requisito**: Docker e Docker Compose instalados

## Funcionalidades

- **Sugestão de Músicas**: Usuários podem sugerir músicas via links do YouTube
- **Visualização do Top 5**: Interface para visualizar as músicas aprovadas e mais tocadas
- **Painel Administrativo**: Área restrita para administradores gerenciarem o conteúdo
- **Moderação de Conteúdo**: Sistema para aprovar/reprovar sugestões de usuários
- **Gerenciamento de Músicas**: Funcionalidade para remover músicas aprovadas quando necessário
- **Atualização Automática**: Sistema que atualiza automaticamente título, thumbnail e visualizações ao alterar links do YouTube

## Credenciais Admin

- **Email**: `fanumero1dotiaoecarreiro@admin.com`
- **Senha**: `boisoberano`

## Tecnologias

- React 18
- Material-UI
- Axios
- Docker
- Jest + React Testing Library