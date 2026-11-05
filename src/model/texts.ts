import type { ApiError } from '@/api/http';
import type { Resource } from '@/api/types';

/** UI texts for each record type, with the right grammatical gender. */
export const texts: Record<
  Resource,
  {
    saved: string;
    archived: (name: string) => string;
    restored: (name: string) => string;
    notFound: string;
    nameTaken: (name: string) => string;
    nameTakenArchived: (name: string) => string;
  }
> = {
  categories: {
    saved: 'Categoria salva',
    archived: (n) => `Categoria ${n} arquivada`,
    restored: (n) => `Categoria ${n} restaurada`,
    notFound: 'Essa categoria não existe mais.',
    nameTaken: (n) => `Já existe uma categoria chamada ${n}.`,
    nameTakenArchived: (n) => `Já existe uma categoria ${n} arquivada`,
  },
  items: {
    saved: 'Item salvo',
    archived: (n) => `${n} arquivado`,
    restored: (n) => `${n} restaurado`,
    notFound: 'Esse item não existe mais.',
    nameTaken: (n) => `Já existe um item chamado ${n}.`,
    nameTakenArchived: (n) => `Já existe um ${n} arquivado`,
  },
  addons: {
    saved: 'Adicional salvo',
    archived: (n) => `${n} arquivado`,
    restored: (n) => `${n} restaurado`,
    notFound: 'Esse adicional não existe mais.',
    nameTaken: (n) => `Já existe um adicional chamado ${n}.`,
    nameTakenArchived: (n) => `Já existe um adicional ${n} arquivado`,
  },
  combos: {
    saved: 'Combo salvo',
    archived: (n) => `${n} arquivado`,
    restored: (n) => `${n} restaurado`,
    notFound: 'Esse combo não existe mais.',
    nameTaken: (n) => `Já existe um combo chamado ${n}.`,
    nameTakenArchived: (n) => `Já existe um ${n} arquivado`,
  },
};

const names = (refs: { name: string }[] = []) => refs.map((r) => r.name).join(', ');

/** Messages that don't depend on the record type, always derived from `code`. */
export function errorMessage(error: ApiError): string {
  const d = error.details;
  switch (error.code) {
    case 'NETWORK':
      return 'Sem conexão com o servidor. Confira a internet e tente de novo.';
    case 'IN_USE':
      return `Não dá para arquivar: usado por ${names([...(d.combos ?? []), ...(d.items ?? [])])}.`;
    case 'RESTORE_BLOCKED':
      return `Restaure antes: ${[
        ...(d.categories ?? []).map((c) => `categoria ${c.name}`),
        ...(d.items ?? []).map((i) => i.name),
      ].join(', ')}.`;
    case 'INVALID_REFERENCE':
      return 'Uma das opções escolhidas não existe mais. Confira e salve de novo.';
    case 'FORBIDDEN':
      return 'Você não tem permissão para isso.';
    case 'NOT_ARCHIVED':
      return 'Isso já estava de volta no cardápio.';
    default:
      return 'Algo deu errado. Tente de novo.';
  }
}
