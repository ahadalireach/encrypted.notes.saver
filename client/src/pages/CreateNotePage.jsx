import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createNote, resetNoteState } from "../redux/slices/noteSlice";
import NoteForm from "../components/NoteForm";
import toast from "react-hot-toast";

const CreateNotePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.notes);

  useEffect(() => {
    dispatch(resetNoteState());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Note created successfully");
      dispatch(resetNoteState());
      navigate("/notes");
    }

    if (error) {
      toast.error(error);
      dispatch(resetNoteState());
    }
  }, [success, error, navigate, dispatch]);

  const handleSubmit = (noteData) => {
    dispatch(createNote(noteData));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Note</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <NoteForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
};

export default CreateNotePage;
