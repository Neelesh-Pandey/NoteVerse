import Image from "next/image";

interface Note {
  id: string;
  title: string;
  content: string;
  user: {
    name: string;
    imageUrl?: string;
  } | null;
}

interface NoteDetailsProps {
  note: Note | null;
}

const NoteDetails = ({ note }: NoteDetailsProps) => {
  // Ensure note and user exist before rendering
  if (!note || !note.user) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4">
        {note.user.imageUrl ? (
          <Image
            src={note.user.imageUrl}
            alt={note.user.name || "User"}
            width={40}
            height={40}
            className="rounded-full"
            unoptimized
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
        )}
        <span className="text-lg font-semibold">{note.user.name}</span>
      </div>

      {/* Note Content */}
      <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
      <p className="text-gray-700">{note.content}</p>
    </div>
  );
};

export default NoteDetails;
