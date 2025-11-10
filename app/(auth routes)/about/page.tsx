import css from './about.module.css';

//===========================================================================

export const metadata = {
  title: 'About - Easy Notes',
  description: 'Learn more about the Easy Notes application.',
};

//===========================================================================

function AboutPage() {
  return (
    <section className={css.section}>
      <div className={css.badge}>About Easy Notes</div>

      <h1 className={css.title}>A focused space for your notes</h1>

      <p className={css.text}>
        Easy Notes is a lightweight notes manager built with modern Next.js
        tooling, secure authentication, and protected routes. It keeps your
        ideas, tasks, and references in one clean place without distractions.
      </p>

      <p className={css.text}>
        You can sign up, log in, create notes with tags, filter them, preview
        details in a modal, and manage your profile — all powered by SSR + CSR,
        cookies-based sessions, and a responsive UI.
      </p>

      <div className={css.grid}>
        <div className={css.card}>
          <h2>Secure by design</h2>
          <p>
            Private routes, token-based sessions, and access checks on every
            request help keep your data safe.
          </p>
        </div>
        <div className={css.card}>
          <h2>Fast & clean</h2>
          <p>
            TanStack Query, server routes, and minimal UI make navigation and
            note management feel instant.
          </p>
        </div>
        <div className={css.card}>
          <h2>Made for learning</h2>
          <p>
            The project showcases modern Next.js patterns: App Router, API
            routes, middleware, Zustand, and more.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutPage;
