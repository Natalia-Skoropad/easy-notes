import css from './Footer.module.css';

//===========================================================================

function Footer() {
  return (
    <footer className={`${css.container} ${css.footer}`}>
      <p>
        Created <time dateTime="2025">2025</time>
      </p>
    </footer>
  );
}

export default Footer;
