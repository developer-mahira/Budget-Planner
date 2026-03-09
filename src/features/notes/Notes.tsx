import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Search, Pin, Edit2, Trash2, PinOff } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Monthly Budget Meeting',
      content: 'Discuss budget allocation for next quarter. Need to reduce entertainment expenses.',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      isPinned: true,
    },
    {
      id: '2',
      title: 'Savings Goals',
      content: 'Save $5,000 for emergency fund by June. Current progress: $2,500',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
      isPinned: true,
    },
    {
      id: '3',
      title: 'Expense Categories Review',
      content: 'Review and update expense categories based on spending patterns.',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05',
      isPinned: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort by pinned first, then by updated date
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, searchTerm]);

  const handleAddNote = useCallback(() => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      isPinned: false,
    };

    setNotes([newNote, ...notes]);
    resetForm();
  }, [notes, formData]);

  const handleUpdateNote = useCallback(() => {
    if (!editingNote || !formData.title.trim() || !formData.content.trim()) return;

    setNotes(notes.map(note =>
      note.id === editingNote.id
        ? {
            ...note,
            title: formData.title,
            content: formData.content,
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : note
    ));

    resetForm();
  }, [notes, editingNote, formData]);

  const handleDeleteNote = useCallback((id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  }, [notes]);

  const togglePinNote = useCallback((id: string) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, isPinned: !note.isPinned }
        : note
    ));
  }, [notes]);

  const resetForm = () => {
    setFormData({ title: '', content: '' });
    setEditingNote(null);
    setIsModalOpen(false);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Notes</h1>
          <p className="text-gray-600 text-sm sm:text-base">Keep track of your financial thoughts and ideas</p>
        </div>
        <Button
          onClick={() => {
            setEditingNote(null);
            setFormData({ title: '', content: '' });
            setIsModalOpen(true);
          }}
          icon={<Plus className="w-4 h-4" />}
          size="sm"
        >
          <span className="hidden sm:inline">Add Note</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="h-full flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{note.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Updated: {note.updatedAt}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePinNote(note.id)}
                className="p-1"
              >
                {note.isPinned ? (
                  <Pin className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ) : (
                  <PinOff className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 line-clamp-4">{note.content}</p>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditModal(note)}
                icon={<Edit2 className="w-3 h-3" />}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteNote(note.id)}
                icon={<Trash2 className="w-3 h-3" />}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Note Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingNote ? 'Edit Note' : 'Add New Note'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter note title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none h-48"
              placeholder="Enter your note content..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              onClick={editingNote ? handleUpdateNote : handleAddNote}
              disabled={!formData.title.trim() || !formData.content.trim()}
            >
              {editingNote ? 'Update Note' : 'Add Note'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Notes;