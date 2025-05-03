import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getNotes } from "../redux/slices/noteSlice";
import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import NoteCard from "../components/NoteCard";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const NotesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const dispatch = useDispatch();
  const { notes, loading, error } = useSelector((state) => state.notes);

  useEffect(() => {
    dispatch(getNotes());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const allTags = notes.reduce((tags, note) => {
    if (note.tags && note.tags.length > 0) {
      note.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    }
    return tags;
  }, []);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      searchTerm === "" ||
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag =
      selectedTag === "" || (note.tags && note.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
        <Link
          to="/notes/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          New Note
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search notes..."
            />
          </div>

          <div className="md:w-1/4">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Tags</option>
              {allTags.map((tag, index) => (
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center">
          <Loader size="large" />
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No notes found
          </h3>
          {notes.length === 0 ? (
            <p className="text-gray-500 mb-6">
              You haven't created any notes yet. Get started by creating your
              first note.
            </p>
          ) : (
            <p className="text-gray-500 mb-6">
              No notes match your search criteria. Try adjusting your search or
              filters.
            </p>
          )}
          <Link
            to="/notes/create"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Create Note
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
