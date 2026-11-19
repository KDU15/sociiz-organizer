/** Próximo id sequencial no formato PREFIXO-NNN a partir dos ids existentes. */
export function proximoId(prefixo: string, ids: string[], largura = 3) {
  const max = ids.reduce((m, id) => Math.max(m, Number(id.split('-')[1]) || 0), 0)
  return `${prefixo}-${String(max + 1).padStart(largura, '0')}`
}
