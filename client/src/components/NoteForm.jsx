import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import toast from "react-hot-toast";

const NoteForm = ({ initialData = {}, onSubmit, isLoading }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData.title) setTitle(initialData.title);
    if (initialData.content) setContent(initialData.content);
    if (initialData.tags) setTags(initialData.tags.join(", "));
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const tagArray = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];

    onSubmit({
      title,
      content,
      tags: tagArray,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Note title"
          required
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Content (Markdown supported)
        </label>
        <div data-color-mode="light">
          <MDEditor
            value={content}
            onChange={setContent}
            height={400}
            preview="edit"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tags (comma separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="work, personal, important"
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50"
        >
          {isLoading
            ? "Saving..."
            : initialData.title
            ? "Update Note"
            : "Create Note"}
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
