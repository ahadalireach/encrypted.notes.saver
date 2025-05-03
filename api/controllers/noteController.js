import Note from "../models/noteModel.js";
import { encrypt, decrypt } from "../utils/encryption.js";

export const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const encryptedContent = encrypt(content);

    const note = await Note.create({
      user: req.user._id,
      title,
      content: encryptedContent,
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      note: {
        _id: note._id,
        title: note.title,
        content: content,
        tags: note.tags,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating note",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({
      updatedAt: -1,
    });

    const decryptedNotes = notes.map((note) => {
      return {
        _id: note._id,
        title: note.title,
        content: decrypt(note.content),
        tags: note.tags,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      };
    });

    res.json({
      success: true,
      count: notes.length,
      notes: decryptedNotes,
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching notes",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this note",
      });
    }

    const decryptedContent = decrypt(note.content);

    res.json({
      success: true,
      note: {
        _id: note._id,
        title: note.title,
        content: decryptedContent,
        tags: note.tags,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get note by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching note",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this note",
      });
    }

    note.title = title || note.title;

    if (content) {
      note.content = encrypt(content);
    }

    if (tags) {
      note.tags = tags;
    }

    const updatedNote = await note.save();

    res.json({
      success: true,
      note: {
        _id: updatedNote._id,
        title: updatedNote.title,
        content: content || decrypt(updatedNote.content),
        tags: updatedNote.tags,
        createdAt: updatedNote.createdAt,
        updatedAt: updatedNote.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating note",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this note",
      });
    }

    await note.deleteOne();

    res.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting note",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
