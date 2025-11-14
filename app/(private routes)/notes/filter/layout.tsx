import css from './LayoutNotes.module.css';

//===========================================================================

interface NotesLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

//===========================================================================

function NotesLayout({ children, sidebar }: NotesLayoutProps) {
  return (
    <section className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.notesWrapper}>{children}</div>
    </section>
  );
}

export default NotesLayout;
