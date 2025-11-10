import css from './notes.module.css';

//===========================================================================

interface NotesLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

//===========================================================================

function NotesLayout({ children, sidebar }: NotesLayoutProps) {
  return (
    <section className={css.wrap}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.content}>{children}</div>
    </section>
  );
}

export default NotesLayout;
