/** plural(1, 'item', 'itens') → "1 item"; plural(3, …) → "3 itens" */
export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
