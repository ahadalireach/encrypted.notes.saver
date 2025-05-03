import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteNote } from "../redux/slices/noteSlice";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";

const NoteCard = ({ note }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await dispatch(deleteNote(note._id)).unwrap();
        toast.success("Note deleted successfully");
      } catch (error) {
        toast.error(error || "Failed to delete note");
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 text-indigo-700">
          {note.title}
        </h3>

        <div className="mb-4">
          <p className="text-gray-600">{truncateContent(note.content)}</p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p>Updated: {formatDate(note.updatedAt)}</p>
          </div>

          <div className="flex space-x-2">
            <Link
              to={`/notes/${note._id}`}
              className="text-blue-600 hover:text-blue-800"
              title="View"
            >
              <EyeIcon className="h-5 w-5" />
            </Link>
            <Link
              to={`/notes/edit/${note._id}`}
              className="text-green-600 hover:text-green-800"
              title="Edit"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
              title="Delete"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
