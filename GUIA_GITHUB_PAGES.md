# Guia: publicar o site do Buzzy no GitHub Pages

Passo a passo para gerar, conferir e publicar este site (Astro + Tailwind CSS) como GitHub Pages de projeto em `https://fishpedrol.github.io/site-buzzy/`, e para ativar o download do Buzzy quando houver uma versão validada.

Os commits, o push, a ativação do Pages e a publicação são feitos pelo dono do repositório; nenhum agente publica.

## 1. Pré-requisitos

- Node.js **22.12 ou mais recente** (exigência do Astro 7; o workflow usa o Node 24) e o npm que vem com ele.
- Git e acesso de escrita ao repositório `fishpedrol/site-buzzy`.
- No GitHub: permissão de administrador no repositório, para mudar **Settings → Pages**.
- Para ativar o download: uma release do `Buzzy.exe` já validada no passo F9-P10 do projeto principal (veja a seção 9).

## 2. Estrutura do projeto

```text
site/
├── .github/workflows/deploy.yml   Build e publicação no Pages pelo GitHub Actions
├── public/assets/                 Pixel art, copiada sem mudanças para dist/assets/
├── src/
│   ├── config/release.ts          ÚNICO arquivo da release: versão, URL do .exe, tamanho, SHA-256
│   ├── pages/index.astro          Monta a página com as seções
│   ├── layouts/BaseLayout.astro   Documento HTML base
│   ├── components/                Uma seção por arquivo (Download.astro é a de download)
│   ├── lib/                       Caminhos com a base, leitura da release, classes compartilhadas
│   └── styles/global.css          Tailwind, paleta "chapéu de palha" e as cenas em pixel art
├── astro.config.mjs               Endereço (site) e subpasta (base)
├── package.json / package-lock.json   Scripts e versões fixadas
├── README.md                      Apresentação do repositório
└── GUIA_GITHUB_PAGES.md           Este guia
```

`dist/`, `node_modules/` e `.astro/` são gerados e ficam fora do Git (`.gitignore`).

## 3. Build local

Na pasta do site:

```bash
npm ci           # instala exatamente as versões do package-lock.json
npm run dev      # servidor de desenvolvimento: http://localhost:4321/site-buzzy/
npm run build    # gera o site estático em dist/
npm run preview  # serve o dist/ como no Pages: http://localhost:4321/site-buzzy/
```

Abra sempre o endereço **com** `/site-buzzy/`: a raiz `http://localhost:4321/` não mostra o site, porque ele vive nessa subpasta, como no Pages. Confira no `preview` antes de cada push: imagens carregam, os links do menu levam às seções e o console do navegador não mostra erros.

## 4. Configuração `site` e `base`

Em `astro.config.mjs`:

```js
site: "https://fishpedrol.github.io",
base: "/site-buzzy/",
trailingSlash: "always",
build: { format: "directory" },
```

- `site` é o domínio; `base` é a subpasta do Pages de projeto (o nome do repositório).
- Todas as imagens e o ícone passam por `caminho()` (`src/lib/caminho.ts`), que acrescenta a base. Ao criar uma imagem nova, use `src={caminho("assets/arquivo.png")}`, nunca `/assets/...` fixo.
- Se o repositório mudar de nome, troque a `base` para `/novo-nome/`.

**Com domínio próprio** (por exemplo `buzzy.exemplo.com.br`):

1. Mude `site` para `"https://buzzy.exemplo.com.br"` e `base` para `"/"`.
2. Crie `public/CNAME` contendo só o domínio, numa linha.
3. No provedor de DNS, crie um registro `CNAME` de `buzzy` apontando para `fishpedrol.github.io`.
4. Em **Settings → Pages → Custom domain**, informe o domínio e, depois da verificação, marque **Enforce HTTPS**.

## 5. O workflow

`.github/workflows/deploy.yml` roda em todo push na `main` e também manualmente (**Actions → Publicar no GitHub Pages → Run workflow**).

- **build:** `actions/checkout@v7` → `actions/setup-node@v7` (Node 24, cache do npm) → `npm ci` → `npm run build` → `actions/upload-pages-artifact@v5` com a pasta `dist`.
- **deploy:** `actions/deploy-pages@v5` publica o artefato no ambiente `github-pages` e mostra a URL no resumo da execução.
- **Permissões mínimas:** `contents: read`, `pages: write` e `id-token: write`. Nada mais.
- **Concorrência:** uma publicação por vez (`group: pages`), sem cancelar a que já está em andamento.

As ações estão fixadas pela tag maior (`@v7`, `@v5`): recebem correções sem mudar de versão maior. Para atualizar uma delas, troque a tag e confira o resultado numa execução manual.

## 6. Ativar o Pages (uma vez)

1. No GitHub, abra o repositório `fishpedrol/site-buzzy`.
2. **Settings → Pages**.
3. Em **Build and deployment → Source**, escolha **GitHub Actions** (não "Deploy from a branch").
4. Não é preciso escolher branch nem pasta: quem publica é o workflow.

## 7. Primeira publicação

1. Rode `npm ci` e `npm run build` localmente e confira no `npm run preview`.
2. Faça o commit (incluindo `package-lock.json` e `.github/workflows/deploy.yml`) e o push na `main`.
3. Em **Actions**, acompanhe **Publicar no GitHub Pages**: os jobs `build` e `deploy` devem terminar em verde.
4. Se o `deploy` falhar com erro de permissão ou de ambiente, confira o passo 6 (Source = GitHub Actions) e, em **Settings → Environments → github-pages**, que a `main` pode publicar.
5. Abra `https://fishpedrol.github.io/site-buzzy/`. A primeira publicação pode levar alguns minutos para aparecer.

## 8. Validar depois de publicar

No site publicado, com as ferramentas do navegador abertas (F12, abas Console e Rede):

- **Assets:** todas as imagens e o CSS (`/site-buzzy/_astro/...`) respondem 200; nenhum pedido vai para `https://fishpedrol.github.io/assets/...` (sem a base), o que indicaria caminho fixo.
- **Ícone da aba:** aparece o Buzzy.
- **Links internos:** "O Buzzy", "Privacidade", "Ajustes", "Baixar" e "Voltar ao topo" rolam até a seção certa, também no menu do celular.
- **Links externos:** "Ver código-fonte no GitHub" abre `https://github.com/fishpedrol/Buzzy`; "baixe o código em ZIP" baixa o ZIP da `main`. O repositório precisa estar público para isso funcionar para visitantes.
- **Download:** sem release, o botão "Baixar Buzzy para Windows" aparece desativado com "Ainda não há versão publicada". Com release, baixa o `.exe` direto e o SHA-256 do arquivo baixado é igual ao da ficha.
- **404:** `https://fishpedrol.github.io/site-buzzy/nao-existe/` mostra a página 404 padrão do GitHub Pages. Para uma 404 própria, crie `src/pages/404.astro`; o Astro gera `404.html`, que o Pages usa sozinho.
- **Sem terceiros:** a aba Rede só mostra pedidos para `fishpedrol.github.io`.
- **Celular:** a página não rola na horizontal a 390 px de largura.

## 9. Atualizar o conteúdo

1. Edite os componentes em `src/components/` (cada seção num arquivo) ou as imagens em `public/assets/`.
2. Confira com `npm run build` e `npm run preview`.
3. Commit e push na `main`: o workflow publica sozinho.

### Ativar o download quando houver a release

O botão fica desativado enquanto `urlDoDownload` for `null` em `src/config/release.ts`. Para ativá-lo:

1. **Antes de tudo:** o `.exe` precisa ter passado pelo F9-P10 do projeto principal (portão aprovado, execução em Windows x64 limpo, 10 ou 11, sem .NET instalado, sem elevação, gravações só nas pastas previstas) e a publicação precisa da autorização do usuário.
2. Crie a release no repositório `fishpedrol/Buzzy` com o `.exe` como asset (por exemplo `Buzzy-0.1.0-win-x64.exe`).
3. Copie a URL do asset: na página da release, botão direito no arquivo → copiar endereço do link. Ela tem a forma `https://github.com/fishpedrol/Buzzy/releases/download/v0.1.0/Buzzy-0.1.0-win-x64.exe`.
4. **Baixe o arquivo da própria release** e meça no PowerShell, na pasta do download:

   ```powershell
   (Get-Item .\Buzzy-0.1.0-win-x64.exe).Length
   (Get-FileHash .\Buzzy-0.1.0-win-x64.exe -Algorithm SHA256).Hash
   ```

   Os valores precisam bater com os registrados na validação do F9-P10. Se não baterem, pare: o arquivo publicado não é o validado.
5. Preencha `src/config/release.ts`: `versao`, `urlDoDownload`, `tamanhoEmBytes`, `sha256`, `dataDaVersao` (`"AAAA-MM-DD"`) e `assinado` (`true` só com assinatura digital válida).
6. `npm run build`: o build **falha de propósito** se a URL estiver preenchida e faltar versão, tamanho, SHA-256 ou data, ou se a URL não for `https` terminando em `.exe`.
7. No `npm run preview`, confira o botão, a ficha da versão e o comando de conferência; baixe pelo botão e compare o SHA-256.
8. Commit e push na `main`.

Para tirar uma versão do ar, volte `urlDoDownload` para `null` (e os outros campos da versão também), faça o build e publique.

## 10. O que nunca fazer

- **Publicar ou apontar o botão para um `.exe` não validado** no F9-P10, nem para um arquivo cujo SHA-256 não confere com o da validação.
- **Hospedar o `.exe` dentro do site** (em `public/`): o download vem do asset versionado da release.
- **Adicionar analytics, rastreadores, pixels, fontes remotas ou scripts de terceiros.** O Buzzy não tem rede nem telemetria, e o site segue a mesma linha.
- **Inventar números na ficha:** versão, tamanho e SHA-256 vêm só do arquivo da release.
- **Divulgar o conteúdo adulto** opcional do aplicativo, nem usar nomes ou imagens oficiais de terceiros.
- **Prometer que o aviso do Windows sempre pode ser contornado:** sem assinatura, o Smart App Control pode bloquear o arquivo.
- **Fazer commit de `dist/` ou `node_modules/`**, ou dar ao workflow permissões além das três listadas.
