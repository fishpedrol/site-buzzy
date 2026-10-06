<p align="center">
  <img src="public/assets/parado-8x.png" alt="Buzzy, o mascote em pixel art" width="152" />
</p>

<h1 align="center">Buzzy</h1>

<p align="center">
  <strong>Um companheiro em pixels para o seu desktop.</strong><br />
  Site de apresentação do mascote de desktop para Windows 10 e 11.
</p>

<p align="center">
  <a href="#sobre">Sobre</a> ·
  <a href="#prévia-local">Prévia local</a> ·
  <a href="#downloads">Downloads</a>
</p>

---

## Sobre

Esta página apresenta o Buzzy e explica como ele se movimenta, reage e respeita o espaço de quem usa o computador. O site acompanha a identidade do aplicativo com pixel art própria, paleta inspirada no chapéu de palha e uma interface leve, responsiva e acessível.

O repositório contém somente o site. O código do aplicativo está no [repositório principal do Buzzy](https://github.com/fishpedrol/Buzzy).

## Prévia local

O site é feito com [Astro](https://astro.build/) e [Tailwind CSS](https://tailwindcss.com/). Com Node.js 22.12 ou mais recente:

```bash
npm ci           # instala as dependências fixadas no package-lock.json
npm run dev      # servidor de desenvolvimento em http://localhost:4321/site-buzzy/
npm run build    # gera o site estático em dist/
npm run preview  # serve o dist/ em http://localhost:4321/site-buzzy/
```

## Downloads

| Opção | Destino | Situação |
|---|---|---|
| Buzzy para Windows | Um único `.exe` para Windows 10 ou 11 x64, sem instalador nem pacotes extras (o .NET vai dentro) | Publicado: o botão aponta para a release definida em `src/config/release.ts` (hoje a v0.1.1); sem URL ali, ele fica desativado |
| Código-fonte | [Repositório no GitHub](https://github.com/fishpedrol/Buzzy) ou [ZIP da branch `main`](https://github.com/fishpedrol/Buzzy/archive/refs/heads/main.zip) | Ação separada do download |

Versão, tamanho, SHA-256, assinatura e endereço do `.exe` ficam num só arquivo, `src/config/release.ts`. Com a URL preenchida, o build falha se faltar algum dado de conferência.

## Publicação

O site está publicado como GitHub Pages de projeto em **[fishpedrol.github.io/site-buzzy](https://fishpedrol.github.io/site-buzzy/)**, pelo workflow `.github/workflows/deploy.yml` (GitHub Actions) a cada push na `main`. A fonte do Pages é "GitHub Actions" (não "Deploy from a branch"). O `astro.config.mjs` define `site` e `base` (`/site-buzzy/`), e todos os caminhos de imagens e estilos respeitam essa base. O passo a passo da configuração do repositório, da publicação, da validação e da ativação do download está em [GUIA_GITHUB_PAGES.md](GUIA_GITHUB_PAGES.md).

## Estrutura

```text
site/
├── .github/workflows/  deploy.yml: build e publicação no GitHub Pages
├── public/assets/      Pixel art e imagens usadas pela página
├── src/
│   ├── config/         release.ts: o único arquivo da release (versão, URL, tamanho, SHA-256)
│   ├── pages/          index.astro (a página) e 404.astro (página "não encontrada")
│   ├── layouts/        Documento HTML base (cabeçalho do documento, estilos)
│   ├── components/     Uma seção por arquivo: cabeçalho, herói, faixa, movimento,
│   │                   personalidade, privacidade, ajustes, download e rodapé
│   ├── lib/            Caminhos com a base, leitura da release e classes compartilhadas
│   └── styles/         global.css: Tailwind, paleta em @theme e as cenas em pixel art
├── astro.config.mjs    Endereço, base e Tailwind
├── package.json        Scripts e versões fixadas
├── .gitignore          Arquivos locais e gerados
├── GUIA_GITHUB_PAGES.md  Publicação, validação e ativação do download
└── README.md           Este arquivo
```

O repositório contém apenas os arquivos usados para apresentar e publicar o site.

## Acessibilidade e privacidade

- Navegação por teclado, foco visível e textos alternativos nas imagens.
- Animações respeitam a preferência de movimento reduzido do sistema.
- Sem fontes remotas, analytics ou dependências carregadas de terceiros.
