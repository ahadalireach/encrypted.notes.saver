import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getNoteById,
  updateNote,
  resetNoteState,
} from "../redux/slices/noteSlice";
import NoteForm from "../components/NoteForm";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const EditNotePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { note, loading, error, success } = useSelector((state) => state.notes);

  useEffect(() => {
    dispatch(getNoteById(id));

    return () => {
      dispatch(resetNoteState());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      toast.success("Note updated successfully");
      navigate(`/notes/${id}`);
    }

    if (error) {
      toast.error(error);
    }
  }, [success, error, navigate, id]);

  const handleSubmit = (noteData) => {
    dispatch(updateNote({ id, noteData }));
  };

  if (loading && !note) {
    return (
      <div className="py-10 text-center">
        <Loader size="large" />
      </div>
    );
  }

  if (!note && !loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Note not found
        </h3>
        <p className="text-gray-500 mb-6">
          The note you're trying to edit doesn't exist or you don't have
          permission to edit it.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Note</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {note && (
          <NoteForm
            initialData={note}
            onSubmit={handleSubmit}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default EditNotePage;
