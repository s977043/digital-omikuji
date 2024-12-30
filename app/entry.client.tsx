import { RemixBrowser } from '@remix-run/react';
import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';

function ClientModals() {
  // クライアントサイドで表示したいモーダルなどをここに記述
  return null;
}

startTransition(() => {
  hydrateRoot(
    document,
    <RemixBrowser>
      <ClientModals />
    </RemixBrowser>,
  );
});
