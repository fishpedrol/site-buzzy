# Guia: publicar o site do Buzzy no GitHub Pages

Passo a passo para configurar o repositório, gerar, conferir e publicar este site (Astro + Tailwind CSS) como GitHub Pages de projeto em `https://fishpedrol.github.io/site-buzzy/`, e para ativar o download do Buzzy quando houver uma versão validada.

Os commits e o push são do dono do repositório. As configurações do GitHub descritas na seção 6 podem ser feitas pela interface ou pela linha de comando (`gh`), e a seção 6.7 mostra como conferir cada uma.

## Estado atual

| Item | Estado | Evidência |
|---|---|---|
| Site publicado | **VERIFIED** | `https://fishpedrol.github.io/site-buzzy/` responde 200 com o HTML gerado pelo Astro; o CSS em `/site-buzzy/_astro/` responde 200 |
| Workflow do Actions | **VERIFIED** | Execução `37405333130` de "Publicar no GitHub Pages" (push na `main`, 2026-10-05): jobs `build` e `deploy` em verde |
| Fonte do Pages | **VERIFIED** = GitHub Actions | Trocada de "Deploy from a branch" para "GitHub Actions" em 2026-10-05 (seção 6.2); `gh api repos/fishpedrol/site-buzzy/pages --jq .build_type` devolve `workflow` |
| HTTPS obrigatório | **VERIFIED** | `https_enforced: true` na API do Pages |
| Página 404 própria | **VERIFIED** no build local; entra no ar no próximo push | `src/pages/404.astro` gera `dist/404.html`; no `npm run preview`, um endereço inexistente devolve 404 com o título "Página não encontrada — Buzzy" |
| Download do `.exe` | **UNCERTAIN**: em andamento | No site publicado, o botão está desativado (`urlDoDownload: null` no commit `1d947fc`). Na árvore de trabalho, `src/config/release.ts` já traz a v0.1.0 (61.971.074 bytes, SHA-256 `7E182274…3C8A17`), mas em 2026-10-05 a release `v0.1.0` de `fishpedrol/Buzzy` ainda não existia (`gh release view v0.1.0` → "release not found"; a URL do asset devolve 404). **Não faça push desse arquivo antes de a release existir e os números conferirem** (seção 9), ou o botão publicado levaria a um 404 |

## 1. Pré-requisitos

- Node.js **22.12 ou mais recente** (exigência do Astro 7; o workflow usa o Node 24) e o npm que vem com ele.
- Git e acesso de escrita ao repositório `fishpedrol/site-buzzy`.
- No GitHub: permissão de administrador no repositório, para mudar **Settings → Pages**, **Actions** e **Environments**.
- Opcional, para conferir e configurar pela linha de comando: o [GitHub CLI](https://cli.github.com/) (`gh`) autenticado com `gh auth login`.
- Para ativar o download: uma release do `Buzzy.exe` já validada no passo F9-P10 do projeto principal (veja a seção 9).

## 2. Estrutura do projeto

```text
site/
├── .github/workflows/deploy.yml   Build e publicação no Pages pelo GitHub Actions
├── public/assets/                 Pixel art, copiada sem mudanças para dist/assets/
├── src/
│   ├── config/release.ts          ÚNICO arquivo da release: versão, URL do .exe, tamanho, SHA-256
│   ├── pages/index.astro          Monta a página com as seções
│   ├── pages/404.astro            Página "não encontrada" própria (vira dist/404.html)
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
npm run build    # gera o site estático em dist/ (index.html, 404.html, _astro/, assets/)
npm run preview  # serve o dist/ como no Pages: http://localhost:4321/site-buzzy/
```

Abra sempre o endereço **com** `/site-buzzy/`: a raiz `http://localhost:4321/` não mostra o site, porque ele vive nessa subpasta, como no Pages. Confira no `preview` antes de cada push: imagens carregam, os links do menu levam às seções, `http://localhost:4321/site-buzzy/nao-existe/` mostra a página 404 do Buzzy e o console do navegador não mostra erros.

## 4. Configuração `site` e `base`

Em `astro.config.mjs`:

```js
site: "https://fishpedrol.github.io",
base: "/site-buzzy/",
trailingSlash: "always",
build: { format: "directory" },
```

- `site` é o domínio; `base` é a subpasta do Pages de projeto (o nome do repositório).
- Todas as imagens, o ícone e o link de volta ao início passam por `caminho()` (`src/lib/caminho.ts`), que acrescenta a base. Ao criar uma imagem nova, use `src={caminho("assets/arquivo.png")}`, nunca `/assets/...` fixo.
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

O workflow não usa segredos, tokens pessoais nem variáveis: a identidade vem do OIDC (`id-token: write`) e o `GITHUB_TOKEN` padrão basta.

## 6. Configurar o repositório no GitHub (passo a passo)

São cinco ajustes, todos em **Settings** do repositório `fishpedrol/site-buzzy`. Todos já estão feitos; a seção 6.7 mostra como conferir, e este roteiro serve para refazer a configuração num repositório novo ou renomeado.

### 6.1 Visibilidade: público

**Settings → General → Danger Zone → Change repository visibility → Public.**

O GitHub Pages gratuito só publica repositórios públicos (em privados, exige plano pago). O repositório também precisa ser público para os visitantes abrirem o código-fonte e o ZIP do projeto principal `fishpedrol/Buzzy`, que o site linka.

### 6.2 Pages: fonte = GitHub Actions (o passo que mais importa)

**Settings → Pages → Build and deployment → Source → GitHub Actions.**

Não escolha "Deploy from a branch". Com essa opção, o GitHub roda um build Jekyll da `main` em paralelo ao workflow, e os dois publicam no mesmo endereço: quem terminar por último vence. Neste repositório o Jekyll falha (ele tenta processar `src/` e não tem `node_modules`), e, quando funciona, publica o repositório cru, sem o HTML gerado pelo Astro. Foi isso que aconteceu nos primeiros pushes: a execução "pages build and deployment" `37405331393` falhou enquanto o workflow do Astro publicava.

Pela linha de comando, o mesmo ajuste é:

```bash
gh api -X PUT repos/fishpedrol/site-buzzy/pages -f build_type=workflow
```

Não é preciso escolher branch nem pasta: quem publica é o workflow. Se o Pages ainda não estiver ativado, o próprio `deploy-pages` o ativa na primeira execução; se preferir ativar antes, use `gh api -X POST repos/fishpedrol/site-buzzy/pages -f build_type=workflow`.

### 6.3 Actions: habilitado e com permissão de leitura

**Settings → Actions → General:**

- **Actions permissions:** "Allow all actions and reusable workflows" (estado atual) ou, mais restrito, "Allow fishpedrol, and select non-fishpedrol, actions" marcando "Allow actions created by GitHub". As quatro ações do workflow são do GitHub (`actions/*`).
- **Workflow permissions:** "Read repository contents and packages permissions" basta. O `deploy.yml` declara as suas próprias permissões (`pages: write`, `id-token: write`), que o GitHub concede por workflow mesmo com o padrão em leitura. Não é preciso "Read and write permissions".
- "Allow GitHub Actions to create and approve pull requests" fica desmarcado.

### 6.4 Ambiente `github-pages`: a `main` pode publicar

**Settings → Environments → github-pages → Deployment branches and tags.**

O ambiente é criado sozinho na primeira publicação, com a regra "Selected branches and tags" contendo a `main`. Só precisa de atenção se a branch principal mudar de nome: adicione o nome novo à lista, ou o `deploy` falha com "Branch ... is not allowed to deploy to github-pages". Não adicione revisores obrigatórios: o deploy ficaria parado esperando aprovação.

### 6.5 HTTPS obrigatório

**Settings → Pages → Enforce HTTPS** marcado. Para `*.github.io` o GitHub já o marca; com domínio próprio, só fica disponível depois que o certificado é emitido (minutos a uma hora após o DNS propagar).

### 6.6 O que não precisa

- Nenhum **secret**, **token** ou **variable** em Settings → Secrets and variables.
- Nenhuma **branch protection** ou **ruleset**: o fluxo é commit direto na `main`.
- Nenhum arquivo `.nojekyll`: o artefato enviado pelo workflow já é servido sem Jekyll.
- Nenhuma pasta `docs/` nem branch `gh-pages`.

### 6.7 Conferir tudo pela linha de comando

```bash
gh repo view fishpedrol/site-buzzy --json visibility --jq .visibility
# PUBLIC

gh api repos/fishpedrol/site-buzzy/pages --jq '{build_type, html_url, https_enforced, status}'
# {"build_type":"workflow","html_url":"https://fishpedrol.github.io/site-buzzy/","https_enforced":true,"status":"built"}

gh api repos/fishpedrol/site-buzzy/actions/permissions --jq '{enabled, allowed_actions}'
# {"enabled":true,"allowed_actions":"all"}

gh api repos/fishpedrol/site-buzzy/actions/permissions/workflow --jq .default_workflow_permissions
# read

gh api repos/fishpedrol/site-buzzy/environments/github-pages --jq .deployment_branch_policy
# {"protected_branches":false,"custom_branch_policies":true}

gh run list --repo fishpedrol/site-buzzy --workflow "Publicar no GitHub Pages" --limit 3
# a última linha deve ser "completed  success"
```

Se algum valor for diferente, volte ao item correspondente desta seção.

## 7. Publicar

A primeira publicação já aconteceu (veja "Estado atual"). Cada push na `main` publica de novo; para uma publicação sem mudança de código, use **Actions → Publicar no GitHub Pages → Run workflow** ou:

```bash
gh workflow run "Publicar no GitHub Pages" --repo fishpedrol/site-buzzy
gh run watch --repo fishpedrol/site-buzzy
```

Fluxo de uma publicação:

1. Rode `npm ci` e `npm run build` localmente e confira no `npm run preview`.
2. Faça o commit (sem `dist/` nem `node_modules/`) e o push na `main`.
3. Em **Actions**, acompanhe **Publicar no GitHub Pages**: os jobs `build` e `deploy` devem terminar em verde. Não deve aparecer nenhuma execução nova de "pages build and deployment"; se aparecer, a fonte voltou para "Deploy from a branch" (seção 6.2).
4. Abra `https://fishpedrol.github.io/site-buzzy/`. A publicação leva de um a alguns minutos; o navegador pode guardar a versão antiga em cache (recarregue com Ctrl+F5).

## 8. Validar depois de publicar

No site publicado, com as ferramentas do navegador abertas (F12, abas Console e Rede):

- **Assets:** todas as imagens e o CSS (`/site-buzzy/_astro/...`) respondem 200; nenhum pedido vai para `https://fishpedrol.github.io/assets/...` (sem a base), o que indicaria caminho fixo.
- **Ícone da aba:** aparece o Buzzy.
- **Links internos:** "O Buzzy", "Privacidade", "Ajustes", "Baixar" e "Voltar ao topo" rolam até a seção certa, também no menu do celular.
- **Links externos:** "Ver código-fonte no GitHub" abre `https://github.com/fishpedrol/Buzzy`; "baixe o código em ZIP" baixa o ZIP da `main`. O repositório `fishpedrol/Buzzy` é público, então funciona para visitantes.
- **Download:** sem release, o botão "Baixar Buzzy para Windows" aparece desativado com "Ainda não há versão publicada". Com release, baixa o `.exe` direto e o SHA-256 do arquivo baixado é igual ao da ficha.
- **404:** `https://fishpedrol.github.io/site-buzzy/nao-existe/` mostra a página 404 do Buzzy (título "Página não encontrada — Buzzy"), com o botão "Voltar ao início" levando a `/site-buzzy/`. O Pages usa o `404.html` da raiz do artefato sozinho.
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

## 10. Problemas comuns

| Sintoma | Causa provável | Correção |
|---|---|---|
| Job `deploy` falha com "Get Pages site failed" ou "Not Found" | Pages desativado ou fonte diferente de GitHub Actions | Seção 6.2 |
| Job `deploy` falha com "Resource not accessible by integration" | Actions desabilitado ou permissões do workflow bloqueadas por política da conta | Seção 6.3 |
| Job `deploy` falha com "Branch ... is not allowed to deploy to github-pages" | A branch que fez o push não está na lista do ambiente | Seção 6.4 |
| Job `deploy` fica "Waiting" sem terminar | Revisor obrigatório no ambiente `github-pages` | Remova o revisor (seção 6.4) |
| O site mostra o README ou uma página do Jekyll, ou aparece uma execução "pages build and deployment" | A fonte voltou para "Deploy from a branch" | Seção 6.2 |
| Imagens ou CSS com 404 e pedidos para `fishpedrol.github.io/assets/...` | Caminho fixo sem a base | Use `caminho()` (seção 4) |
| Job `build` falha em `npm ci` | `package-lock.json` desatualizado ou ausente | Rode `npm install` localmente e faça commit do lockfile |
| Job `build` falha em `astro build` com erro de `src/config/release.ts` | Release preenchida pela metade | Seção 9, passo 6 |
| A página publicada parece antiga | Cache do navegador ou publicação ainda em andamento | Ctrl+F5; confira a execução em Actions |

## 11. O que nunca fazer

- **Publicar ou apontar o botão para um `.exe` não validado** no F9-P10, nem para um arquivo cujo SHA-256 não confere com o da validação.
- **Hospedar o `.exe` dentro do site** (em `public/`): o download vem do asset versionado da release.
- **Adicionar analytics, rastreadores, pixels, fontes remotas ou scripts de terceiros.** O Buzzy não tem rede nem telemetria, e o site segue a mesma linha.
- **Inventar números na ficha:** versão, tamanho e SHA-256 vêm só do arquivo da release.
- **Divulgar o conteúdo adulto** opcional do aplicativo, nem usar nomes ou imagens oficiais de terceiros.
- **Prometer que o aviso do Windows sempre pode ser contornado:** sem assinatura, o Smart App Control pode bloquear o arquivo.
- **Fazer commit de `dist/` ou `node_modules/`**, ou dar ao workflow permissões além das três listadas.
- **Voltar a fonte do Pages para "Deploy from a branch"**: o Jekyll passaria a disputar a publicação com o workflow.
