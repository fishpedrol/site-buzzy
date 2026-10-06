/**
 * Release do Buzzy oferecida pelo site — o ÚNICO lugar a editar para ativar o download (DEC-042).
 *
 * Enquanto `urlDoDownload` for `null`, o botão "Baixar Buzzy para Windows" aparece desativado,
 * com o aviso "Ainda não há versão publicada", e a ficha mostra "a definir na primeira versão".
 *
 * Só preencha DEPOIS de validar o .exe no passo F9-P10 do projeto principal: portão aprovado,
 * execução em Windows x64 limpo (10 ou 11) sem .NET instalado, sem elevação, gravações só nas pastas
 * previstas e publicação autorizada pelo usuário. Nunca aponte para um .exe não validado.
 *
 * Como preencher, quando houver a release validada:
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
export const release: Release = {
  versao: null,
  urlDoDownload: null,
  tamanhoEmBytes: null,
  sha256: null,
  assinado: false,
  dataDaVersao: null,

  /**
   * Repositório do código-fonte (ação separada do download): o `origin` público do projeto principal.
   * O brief citava fishpedrol/Claudio, que não existe (404). Se o repositório for renomeado, o GitHub
   * redireciona o endereço antigo, mas vale trocar aqui também.
   */
  urlDoCodigo: "https://github.com/fishpedrol/Buzzy",
  /** ZIP do código gerado pelo GitHub a partir da branch principal. */
  urlDoZipDoCodigo: "https://github.com/fishpedrol/Buzzy/archive/refs/heads/main.zip",
};

export interface Release {
  versao: string | null;
  urlDoDownload: string | null;
  tamanhoEmBytes: number | null;
  sha256: string | null;
  assinado: boolean;
  dataDaVersao: string | null;
  urlDoCodigo: string;
  urlDoZipDoCodigo: string;
}
