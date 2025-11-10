import { getCategories } from '@/lib/api/clientApi';
import { NoteForm } from '@/app/components';

//===========================================================================

async function CreateNote() {
  const categories = await getCategories();

  return (
    <>
      <NoteForm categories={categories} />
    </>
  );
}

export default CreateNote;
