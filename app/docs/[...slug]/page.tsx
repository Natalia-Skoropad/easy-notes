interface DocsPageProps {
  params: { slug?: string[] };
}

//===============================================================

async function DocsPage({ params }: DocsPageProps) {
  const { slug } = params;

  return (
    <div>
      <h1>Docs page</h1>
      <p>Current path: {slug?.join(' / ') || 'home'}</p>
    </div>
  );
}

export default DocsPage;
