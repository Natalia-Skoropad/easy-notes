import { getSingleNote } from '@/lib/api/clientApi';
import { Modal } from '@/app/components';

//===========================================================================

interface NotePreviewProps {
  params: Promise<{ id: string }>;
}

//===========================================================================

async function NotePreview({ params }: NotePreviewProps) {
  const { id } = await params;
  const note = await getSingleNote(id);

  return (
    <Modal>
      {note ? (
        <>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </>
      ) : (
        <>
          <h2>Не вдалося завантажити нотатку</h2>
          <p>Сервер повернув помилку. Спробуйте ще раз або пізніше.</p>
        </>
      )}
    </Modal>
  );
}

export default NotePreview;
