# CalcPath

CalcPath e um MVP em React + Vite + TypeScript para diagnosticar lacunas em Calculo I e gerar uma rota adaptativa de estudo usando conceitos de Algoritmos e Estruturas de Dados.

## Rodar localmente

```powershell
npm install
npm run dev
```

Abra a URL mostrada no terminal, normalmente:

```text
http://127.0.0.1:5173/
```

## Testar e gerar build

```powershell
npm test
npm run build
```

O build de producao fica na pasta `dist/`.

## Publicar no GitHub Pages

Este projeto ja tem o workflow em `.github/workflows/deploy.yml`.

Passo a passo:

1. Crie um repositorio no GitHub.
2. No terminal, dentro da pasta do projeto, rode:

```powershell
git init
git add .
git commit -m "Initial CalcPath MVP"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
git push -u origin main
```

3. No GitHub, abra o repositorio.
4. Va em `Settings` > `Pages`.
5. Em `Build and deployment`, escolha `Source: GitHub Actions`.
6. Aguarde a action `Deploy CalcPath to GitHub Pages` terminar.
7. A URL final aparecera em `Settings` > `Pages` e tambem no resumo da action.

## Observacao importante sobre dados

O CalcPath nao usa backend. Os resultados reais da turma ficam no `localStorage` do navegador em que foram salvos. Isso e suficiente para apresentacao local em sala, mas nao sincroniza dados entre computadores.

## Guia tecnico

Leia o arquivo [GUIA_DO_CODIGO.md](./GUIA_DO_CODIGO.md) para entender a estrutura, sintaxe, componentes, grafo, algoritmo de diagnostico e fila de prioridade.
