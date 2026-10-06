// Monta caminhos que respeitam a base do site (/site-buzzy/ no GitHub Pages).
const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

export function caminho(relativo: string): string {
  return base + relativo.replace(/^\.?\//, "");
}
