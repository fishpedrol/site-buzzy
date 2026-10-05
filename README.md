<p align="center">
  <img src="assets/parado-8x.png" alt="Buzzy, o mascote em pixel art" width="152" />
</p>

<h1 align="center">Buzzy</h1>

<p align="center">
  <strong>Um companheiro em pixels para o seu desktop.</strong><br />
  Site de apresentação do mascote de desktop para Windows 11.
</p>

<p align="center">
  <a href="#sobre">Sobre</a> ·
  <a href="#prévia-local">Prévia local</a> ·
  <a href="#downloads">Downloads</a>
</p>

---

## Sobre

Esta página apresenta o Buzzy e explica como ele se movimenta, reage e respeita o espaço de quem usa o computador. O site acompanha a identidade do aplicativo com pixel art original, paleta inspirada no chapéu de palha e uma interface leve, responsiva e acessível.

O repositório contém somente o site. O código do aplicativo está no [repositório principal do Buzzy](https://github.com/fishpedrol/Claudio).

## Prévia local

Abra `index.html` em um navegador. O site é estático: não precisa instalar dependências nem executar um processo de build.

## Downloads

| Opção | Destino | Situação |
|---|---|---|
| Código-fonte | [Baixar ZIP do projeto](https://github.com/fishpedrol/Claudio/archive/refs/heads/main.zip) | Link direto para a branch `main` do repositório principal |
| Aplicativo portátil | — | Ainda não há pacote publicado; o botão permanece desativado até existir uma release |

## Publicação

Os arquivos estão prontos para uma hospedagem estática: `index.html` fica na raiz, e as folhas de estilo, o JavaScript e as imagens usam caminhos relativos. O site ainda não foi publicado e não tem uma URL de produção.

## Estrutura

```text
site/
├── assets/       Pixel art e imagens usadas pela página
├── index.html    Conteúdo e estrutura
├── main.js       Navegação para telas pequenas
├── styles.css    Identidade visual e layout responsivo
├── .gitignore    Arquivos locais e gerados
└── README.md     Este guia
```

O repositório contém apenas os arquivos usados para apresentar e publicar o site.

## Acessibilidade e privacidade

- Navegação por teclado, foco visível e textos alternativos nas imagens.
- Animações respeitam a preferência de movimento reduzido do sistema.
- Sem fontes remotas, analytics ou dependências carregadas de terceiros.
