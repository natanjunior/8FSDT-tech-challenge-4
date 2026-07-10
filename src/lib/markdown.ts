/**
 * Remove a sintaxe Markdown comum, deixando prosa limpa.
 * Uso: excerpt de cards. NÃO é um parser completo — é regex do subconjunto comum.
 * A ordem importa: remoções ancoradas em início de linha (^...gm) acontecem ANTES
 * do colapso final de \s+, e marcadores de lista antes da ênfase (para não confundir
 * "* item" com "*ênfase*").
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // imagens ![alt](url) -> alt
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links [texto](url) -> texto
    .replace(/^\s*#{1,6}\s+/gm, '') // títulos
    .replace(/^\s*>\s?/gm, '') // citações
    .replace(/^\s*\d+\.\s+/gm, '') // lista ordenada
    .replace(/^\s*[-*+]\s+/gm, '') // lista não-ordenada
    .replace(/`+/g, '') // código inline/cerca
    .replace(/(\*\*|\*|__|_)/g, '') // ênfase
    .replace(/\s+/g, ' ') // colapsa quebras/espaços
    .trim();
}
