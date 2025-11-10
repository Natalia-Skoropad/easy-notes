import css from './loading.module.css';

//===========================================================================

function Loading() {
  return (
    <div className={css.wrap}>
      <div className={css.spinner}></div>
      <p>Loading data...</p>
    </div>
  );
}

export default Loading;
