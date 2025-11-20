'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/app/components';
import css from './LayoutNotes.module.css';

//===========================================================================

interface NotesLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

//===========================================================================

function NotesLayout({ children, sidebar }: NotesLayoutProps) {
  const pathname = usePathname();

  let tag: string | undefined;

  if (pathname?.startsWith('/notes/filter/')) {
    const raw = pathname.replace('/notes/filter/', '');
    const decoded = decodeURIComponent(raw);

    if (decoded && decoded !== 'all') {
      tag = decoded;
    }
  }

  const breadcrumbItems = tag
    ? [
        { label: 'Home', href: '/' },
        { label: 'All notes', href: '/notes/filter/all' },
        { label: `${tag} notes` },
      ]
    : [{ label: 'Home', href: '/' }, { label: 'All notes' }];

  return (
    <>
      <div className={css.breadcrumbsTop}>
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <section className={css.container}>
        <aside className={css.sidebar}>{sidebar}</aside>
        <div className={css.notesWrapper}>{children}</div>
      </section>
    </>
  );
}

export default NotesLayout;
