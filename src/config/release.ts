/**
 * Release do Buzzy oferecida pelo site — o ÚNICO lugar a editar para ativar o download (DEC-042).
 *
 * Enquanto `urlDoDownload` for `null`, o botão "Baixar Buzzy para Windows" aparece desativado,
 * com o aviso "Ainda não há versão publicada", e a ficha mostra "a definir na primeira versão".
 *
 * Preencha com uma release pública e informe separadamente se a execução em Windows limpo continua
 * pendente. Publicar o arquivo não significa que essa validação foi concluída.
 *
 * Como preencher, quando houver uma release:
 *   1. versao: a versão do .exe, sem "v" (ex.: "0.1.0").
 *   2. urlDoDownload: o endereço do asset na release do GitHub, que baixa o arquivo direto
 *      (ex.: "https://github.com/fishpedrol/Buzzy/releases/download/v0.1.0/Buzzy-0.1.0-win-x64.exe").
 *      O nome do arquivo mostrado no site sai do fim desta URL.
 *   3. tamanhoEmBytes: o tamanho exato do arquivo baixado da release, em bytes
 *      (PowerShell: (Get-Item .\Buzzy-0.1.0-win-x64.exe).Length).
 *   4. sha256: o hash do arquivo BAIXADO da release, 64 caracteres hexadecimais
 *      (PowerShell: (Get-FileHash .\Buzzy-0.1.0-win-x64.exe -Algorithm SHA256).Hash).
 *   5. assinado: true só se o .exe tiver assinatura digital válida (Get-AuthenticodeSignature).
 *   6. dataDaVersao: a data da release, no formato "AAAA-MM-DD".
 *
 * Com `urlDoDownload` preenchida, o build falha se faltar versão, tamanho, SHA-256 ou data,
 * para o site nunca oferecer um download sem os dados de conferência.
 */
/**
 * A edição completa (DEC-044): o mesmo formato, com o .exe "Buzzy-<versão>-completo-win-x64.exe", oferecido só na página
 * separada /ilicitas/, que não tem link no site nem é indexada. Enquanto `urlDoDownload` for `null`, o botão de lá fica
 * desativado. A versão pública (a de cima) não tem as drogas ilícitas.
 */
export const releaseCompleta: ArquivoDaRelease = {
  versao: "0.1.3",
  urlDoDownload: "https://github.com/fishpedrol/Buzzy/releases/download/v0.1.3/Buzzy-0.1.3-completo-win-x64.exe",
  tamanhoEmBytes: 61974291,
  sha256: "90D91B740A416B7AA5007A1B91589F10C71772C7DE6FBFFCEEF8DC96D88A6AC0",
  dataDaVersao: "2026-10-06",
};

export const release: Release = {
  versao: "0.1.3",
  urlDoDownload: "https://github.com/fishpedrol/Buzzy/releases/download/v0.1.3/Buzzy-0.1.3-win-x64.exe",
  tamanhoEmBytes: 61974286,
  sha256: "E981D00818EEB7EDEF50CA46AA29059CF23628C9B140C5375D16F0B866008CE8",
  assinado: false,
  dataDaVersao: "2026-10-06",
  validacaoWindowsLimpoPendente: true,

  /**
   * Repositório do código-fonte (ação separada do download): o `origin` público do projeto principal.
   * O brief citava fishpedrol/Claudio, que não existe (404). Se o repositório for renomeado, o GitHub
   * redireciona o endereço antigo, mas vale trocar aqui também.
   */
  urlDoCodigo: "https://github.com/fishpedrol/Buzzy",
  /** ZIP do código gerado pelo GitHub a partir da branch principal. */
  urlDoZipDoCodigo: "https://github.com/fishpedrol/Buzzy/archive/refs/heads/main.zip",
};

/** Os dados de conferência de um .exe publicado. */
export interface ArquivoDaRelease {
  versao: string | null;
  urlDoDownload: string | null;
  tamanhoEmBytes: number | null;
  sha256: string | null;
  dataDaVersao: string | null;
}

export interface Release {
  versao: string | null;
  urlDoDownload: string | null;
  tamanhoEmBytes: number | null;
  sha256: string | null;
  assinado: boolean;
  dataDaVersao: string | null;
  validacaoWindowsLimpoPendente: boolean;
  urlDoCodigo: string;
  urlDoZipDoCodigo: string;
}
