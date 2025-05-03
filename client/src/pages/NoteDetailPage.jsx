import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getNoteById, deleteNote, clearNote } from "../redux/slices/noteSlice";
import { PencilIcon, TrashIcon, ArrowLeftIcon } from "@heroicons/react/outline";
import ReactMarkdown from "react-markdown";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const NoteDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { note, loading, error } = useSelector((state) => state.notes);

  useEffect(() => {
    dispatch(getNoteById(id));

    return () => {
      dispatch(clearNote());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await dispatch(deleteNote(id)).unwrap();
        toast.success("Note deleted successfully");
        navigate("/notes");
      } catch (error) {
        toast.error(error || "Failed to delete note");
      }
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="py-10 text-center">
        <Loader size="large" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Note not found
        </h3>
        <p className="text-gray-500 mb-6">
          The note you're looking for doesn't exist or you don't have permission
          to view it.
        </p>
        <Link
          to="/notes"
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Notes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/notes"
          className="text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Notes
        </Link>

        <div className="flex space-x-2">
          <Link
            to={`/notes/edit/${note._id}`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
          >
            <PencilIcon className="h-5 w-5 mr-1" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
          >
            <TrashIcon className="h-5 w-5 mr-1" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{note.title}</h1>

        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6">
          <span className="mr-4">Created: {formatDate(note.createdAt)}</span>
          <span>Updated: {formatDate(note.updatedAt)}</span>
        </div>

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose max-w-none markdown-content">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
