import { getNotes } from '@/lib/api/clientApi';
import { NoteList } from '@/app/components';

//===========================================================================

interface NotesByCategoryProps {
  params: Promise<{ slug: string[] }>;
}
//===========================================================================

async function NotesByCategory({ params }: NotesByCategoryProps) {
  const { slug } = await params;
  const category = slug[0] === 'all' ? undefined : slug[0];
  const response = await getNotes(category);

  return (
    <div>
      <h1>Notes List</h1>
      {response?.notes?.length > 0 && <NoteList notes={response.notes} />}
    </div>
  );
}

export default NotesByCategory;
