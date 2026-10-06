// Lê src/config/release.ts, confere os dados e prepara os textos da seção de download.
// Nada aqui inventa valor: o que não está na configuração vira "a definir na primeira versão".
import { release } from "../config/release";

export const aDefinir = "a definir na primeira versão";

export interface Download {
  /** Endereço direto do .exe validado. */
  url: string;
  nomeDoArquivo: string;
  versao: string;
  tamanho: string;
  sha256: string;
  data: string;
}

function falhar(motivo: string): never {
  throw new Error(`src/config/release.ts: ${motivo}`);
}

function formatarTamanho(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  const numero = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(mb);
  const exato = new Intl.NumberFormat("pt-BR").format(bytes);
  return `${numero} MB (${exato} bytes)`;
}

function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(ano, mes - 1, dia)),
  );
}

/** O download só existe com todos os dados de conferência; meio preenchido, o build para. */
function montarDownload(): Download | null {
  const { urlDoDownload, versao, tamanhoEmBytes, sha256, dataDaVersao } = release;
  if (urlDoDownload === null) return null;

  let url: URL;
  try {
    url = new URL(urlDoDownload);
  } catch {
    falhar("urlDoDownload não é uma URL válida.");
  }
  if (url.protocol !== "https:") falhar("urlDoDownload precisa usar https.");
  const nomeDoArquivo = decodeURIComponent(url.pathname.split("/").pop() ?? "");
  if (!/\.exe$/i.test(nomeDoArquivo)) falhar("urlDoDownload precisa terminar no arquivo .exe.");
  if (!versao) falhar("preencha versao junto com urlDoDownload.");
  if (!tamanhoEmBytes || !Number.isInteger(tamanhoEmBytes) || tamanhoEmBytes <= 0) {
    falhar("preencha tamanhoEmBytes (inteiro, em bytes) junto com urlDoDownload.");
  }
  if (!sha256 || !/^[0-9a-f]{64}$/i.test(sha256)) {
    falhar("preencha sha256 (64 caracteres hexadecimais) junto com urlDoDownload.");
  }
  if (!dataDaVersao || !/^\d{4}-\d{2}-\d{2}$/.test(dataDaVersao)) {
    falhar('preencha dataDaVersao no formato "AAAA-MM-DD" junto com urlDoDownload.');
  }

  return {
    url: url.href,
    nomeDoArquivo,
    versao,
    tamanho: formatarTamanho(tamanhoEmBytes),
    sha256: sha256.toUpperCase(),
    data: formatarData(dataDaVersao),
  };
}

/** `null` enquanto não houver release validada: o botão fica desativado. */
export const download = montarDownload();

/** Nome usado no comando de conferência do SHA-256. */
export const nomeDoArquivo = download?.nomeDoArquivo ?? "Buzzy-<versão>-win-x64.exe";

export const assinado = release.assinado;
export const repositorio = release.urlDoCodigo;
export const zipDoCodigo = release.urlDoZipDoCodigo;
