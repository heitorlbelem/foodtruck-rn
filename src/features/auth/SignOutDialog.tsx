import { Dialog } from '@/components/Dialog';
import { useAuth } from '@/model/AuthContext';

const BACK = 'Para voltar, vai precisar do e-mail e da senha.';

/** Asks before signing out: a stray tap at the counter must not log the owner out. */
export function SignOutDialog({ onCancel }: { onCancel: () => void }) {
  const { user, signOut } = useAuth();
  return (
    <Dialog
      title="Sair da conta?"
      text={user ? `Você entrou como ${user.name} (${user.email}). ${BACK}` : BACK}
      confirmLabel="Sair da conta"
      onConfirm={signOut}
      cancelLabel="Continuar aqui"
      onCancel={onCancel}
    />
  );
}
