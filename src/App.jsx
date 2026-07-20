import React, { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "keep-clone-notes";

// --- Inline icons (no external icon library needed) ---
const iconProps = (size) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

function NotebookPen({ size = 18 }) {
  return (
    <svg {...iconProps(size)}>
      <path d="M2 6a2 2 0 0 1 2-2h11v20H4a2 2 0 0 1-2-2Z" />
      <path d="M15 4h4a2 2 0 0 1 2 2v13.5" />
      <path d="M9.5 14.5 8 19l4.5-1.5L21 9l-3.5-3.5Z" />
    </svg>
  );
}

function Archive({ size = 16 }) {
  return (
    <svg {...iconProps(size)}>
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
      <path d="M10 13h4" />
    </svg>
  );
}

function ArchiveRestore({ size = 16 }) {
  return (
    <svg {...iconProps(size)}>
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
      <path d="M12 16v-4" />
      <path d="M9.5 14.5 12 12l2.5 2.5" />
    </svg>
  );
}

function Trash2({ size = 16 }) {
  return (
    <svg {...iconProps(size)}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function Pin({ size = 16 }) {
  return (
    <svg {...iconProps(size)}>
      <path d="M12 17v5" />
      <path d="M9 3h6l1 7H8L9 3Z" />
      <path d="M9 10v4l3 3 3-3v-4" />
    </svg>
  );
}

function Copy({ size = 16 }) {
  return (
    <svg {...iconProps(size)}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function Bell({ size = 16 }) {
  return (
    <svg {...iconProps(size)}>
      <path d="M18 8a6 6 0 0 0-12 0c0 3-1 4-1 4h14s-1-1-1-4" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function LabelTag({ size = 16 }) {
  return (
    <svg {...iconProps(size)}>
      <path d="M3 7.5 12 2l9 5.5-9 8.5L3 7.5Z" />
      <path d="M12 2v8" />
    </svg>
  );
}

function Search({ size = 16, style }) {
  return (
    <svg {...iconProps(size)} style={style}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function X({ size = 16 }) {
  return (
    <svg {...iconProps(size)}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function useLocalNotes() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // storage unavailable (e.g. sandboxed preview) — fail silently
    }
  }, [notes]);

  return [notes, setNotes];
}

function NoteCreator({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const textRef = useRef(null);

  function close() {
    setOpen(false);
    setTitle("");
    setText("");
  }

  function submit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({ title: title.trim(), text: trimmed });
    close();
  }

  return (
    <section
      style={{
        width: "100%",
        maxWidth: 640,
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        marginBottom: 32,
      }}
    >
      <form onSubmit={submit}>
        {open && (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            aria-label="Note title"
            style={inputBase(true)}
          />
        )}
        <textarea
          ref={textRef}
          value={text}
          onFocus={() => setOpen(true)}
          onChange={(e) => setText(e.target.value)}
          placeholder="Take a note..."
          rows={open ? 3 : 1}
          required
          aria-label="Note content"
          style={inputBase(false)}
        />
        {open && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
            <button type="submit" style={formBtn} title="Add note to your list">
              Add Note
            </button>
            <button type="button" onClick={close} style={formBtn} title="Close note creator">
              Close
            </button>
          </div>
        )}
      </form>
    </section>
  );
}

function inputBase(isTitle) {
  return {
    width: "100%",
    background: "none",
    border: "none",
    color: "var(--text-primary)",
    fontSize: "1rem",
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
    fontWeight: isTitle ? 700 : 400,
    marginBottom: isTitle ? 10 : 0,
  };
}

const formBtn = {
  background: "none",
  border: "none",
  color: "var(--text-secondary)",
  cursor: "pointer",
  fontWeight: 600,
  padding: "6px 10px",
  fontSize: "0.95rem",
};

function NoteCard({ note, onOpen, onToggleArchive, onTogglePin, onCopy, onDelete, onRestore }) {
  const isDeleted = note.isDeleted;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${isDeleted ? "View deleted note" : `Open note titled ${note.title || "Untitled"}`}`}
      onClick={() => !isDeleted && onOpen(note)}
      onKeyDown={(e) => !isDeleted && e.key === "Enter" && onOpen(note)}
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${note.isPinned ? "var(--accent)" : note.isArchived ? "var(--accent)" : "var(--border-color)"}`,
        borderRadius: 10,
        padding: 18,
        cursor: isDeleted ? "default" : "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (!isDeleted) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <h4 style={{ marginBottom: 10, fontSize: "1.05rem" }}>{note.title || "Untitled"}</h4>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "0.95rem",
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
        }}
      >
        {note.text}
      </p>
      <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap" }}>
        {isDeleted ? (
          <>
            <button
              type="button"
              title="Restore note"
              onClick={(e) => {
                e.stopPropagation();
                onRestore(note.id);
              }}
              style={iconBtn}
            >
              <ArchiveRestore size={16} />
              Restore
            </button>
            <button
              type="button"
              title="Delete note permanently"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id, true);
              }}
              style={{ ...iconBtn, color: "var(--text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ff6b6b")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              <Trash2 size={16} />
              Delete forever
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              title={note.isPinned ? "Unpin note" : "Pin note"}
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(note.id);
              }}
              style={{ ...iconBtn, color: note.isPinned ? "var(--accent)" : "var(--text-secondary)" }}
            >
              <Pin size={16} />
              {note.isPinned ? "Unpin" : "Pin"}
            </button>
            <button
              type="button"
              title="Copy note to clipboard"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(note);
              }}
              style={iconBtn}
            >
              <Copy size={16} />
              Copy
            </button>
            <button
              type="button"
              title={note.isArchived ? "Move back to notes" : "Archive note"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleArchive(note.id);
              }}
              style={iconBtn}
            >
              {note.isArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
              {note.isArchived ? "Unarchive" : "Archive"}
            </button>
            <button
              type="button"
              title="Send note to trash"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              style={{ ...iconBtn, color: "var(--text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ff6b6b")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              <Trash2 size={16} />
              Trash
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const iconBtn = {
  background: "none",
  border: "none",
  color: "var(--text-secondary)",
  cursor: "pointer",
  fontSize: "0.85rem",
  display: "flex",
  alignItems: "center",
  gap: 4,
};

function EditModal({ note, onClose, onSave }) {
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          padding: 24,
          borderRadius: 10,
          width: "min(500px, 90%)",
        }}
      >
        <h3 style={{ marginBottom: 4 }}>Edit Note</h3>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Edit note title"
          style={modalField}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          aria-label="Edit note content"
          style={modalField}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
          <button
            onClick={() => onSave({ title: title.trim(), text: text.trim() })}
            style={{
              padding: "8px 14px",
              border: "none",
              cursor: "pointer",
              borderRadius: 6,
              background: "var(--accent)",
              color: "#000",
              fontWeight: 700,
            }}
          >
            Save
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "8px 14px",
              border: "none",
              cursor: "pointer",
              borderRadius: 6,
              background: "var(--bg-hover)",
              color: "var(--text-primary)",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const modalField = {
  width: "100%",
  background: "var(--bg-main)",
  border: "1px solid var(--border-color)",
  color: "var(--text-primary)",
  padding: 10,
  marginTop: 12,
  borderRadius: 6,
  outline: "none",
  fontFamily: "inherit",
  fontSize: "0.95rem",
  resize: "none",
};

export default function App() {
  const [notes, setNotes] = useLocalNotes();
  const [view, setView] = useState("notes"); // 'notes' | 'archive' | 'trash' | 'labels' | 'reminders'
  const [search, setSearch] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  // Kokesto dark mode feature:
  // Persists light/dark theme selection and defaults to the user's system preference.
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return (
      localStorage.getItem("keep-clone-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
  });

  useEffect(() => {
    try {
      localStorage.setItem("keep-clone-theme", theme);
    } catch {
      // ignore if storage isn't available
    }
  }, [theme]);

  function addNote({ title, text }) {
    setNotes((prev) => [
      ...prev,
      { id: Date.now(), title, text, isArchived: false, isPinned: false, isDeleted: false },
    ]);
  }

  function togglePin(id) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  }

  async function copyNote(note) {
    const content = note.title ? `${note.title}\n\n${note.text}` : note.text;
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      window.prompt("Copy this note:", content);
    }
  }

  function toggleArchive(id) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isArchived: !n.isArchived } : n))
    );
  }

  function deleteNote(id, permanent = false) {
    if (!window.confirm(permanent ? "Delete this note permanently?" : "Move this note to Trash?")) {
      return;
    }

    setNotes((prev) =>
      prev.flatMap((n) => {
        if (n.id !== id) return n;
        if (permanent || n.isDeleted) return [];
        return { ...n, isDeleted: true, isArchived: false, isPinned: false };
      })
    );
  }

  function restoreNote(id) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isDeleted: false } : n))
    );
  }

  function saveEdit(id, updates) {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
    setEditingNote(null);
  }

  const query = search.trim().toLowerCase();

  const sidebarLinks = [
    { key: "notes", label: "Notes", icon: NotebookPen },
    { key: "reminders", label: "Reminders", icon: Bell },
    { key: "labels", label: "Edit labels", icon: LabelTag },
    { key: "archive", label: "Archive", icon: Archive },
    { key: "trash", label: "Trash", icon: Trash2 },
  ];

  const staticLabels = ["Shopping", "Work", "Personal", "Recipes"];

  const filtered = notes
    .filter((n) => {
      if (view === "trash") return n.isDeleted;
      if (view === "archive") return n.isArchived && !n.isDeleted;
      if (view === "notes") return !n.isArchived && !n.isDeleted;
      return false;
    })
    .filter((n) => {
      const matchesSearch = !query || `${n.title} ${n.text}`.toLowerCase().includes(query);
      return matchesSearch;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.id - a.id;
    });

  const themeVars = theme === "dark" ? {
    "--bg-main": "#0f111a",
    "--bg-card": "#171a26",
    "--bg-hover": "#202436",
    "--sidebar-bg": "#161b26",
    "--text-primary": "#f8f9fa",
    "--text-secondary": "#9aa0a6",
    "--empty-heading": "#ffd700",
    "--accent": "#ffd700",
    "--border-color": "#2d3142",
    background: "linear-gradient(135deg, #0f111a, #131723)",
  } : {
    "--bg-main": "#f8f8f2",
    "--bg-card": "#ffffff",
    "--bg-hover": "#f1f3f4",
    "--sidebar-bg": "#ffffff",
    "--text-primary": "#202124",
    "--text-secondary": "#5f6368",
    "--empty-heading": "#202124",
    "--accent": "#f6c244",
    "--border-color": "#dadce0",
    background: "#f8f8f2",
  };

  return (
    <div
      style={{
        ...themeVars,
        color: "var(--text-primary)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          padding: "14px 24px",
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2965/2965358.png"
            alt="Google Keep Clone logo"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              objectFit: "cover",
              background: "#fff",
            }}
          />
          <h1 style={{ fontSize: "1.3rem", fontWeight: 400 }}>
            Google Keep <span style={{ color: "var(--accent)", fontWeight: 400 }}>Clone</span>
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, width: "min(450px, 70vw)" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)",
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              aria-label="Search notes"
              style={{
                width: "100%",
                background: "var(--bg-main)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                padding: "10px 16px 10px 38px",
                borderRadius: 999,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            style={{
              border: "1px solid var(--border-color)",
              borderRadius: 999,
              padding: "10px 16px",
              cursor: "pointer",
              background: "var(--bg-main)",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "inherit",
            }}
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        <aside
          aria-label="Note sections"
          style={{
            width: 220,
            background: "var(--sidebar-bg)",
            padding: "20px 10px",
            borderRight: "1px solid var(--border-color)",
          }}
        >
          <div style={{ padding: "0 16px", marginBottom: 18 }}>
            <h2 style={{
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              margin: 0,
            }}>
              Keep sections
            </h2>
          </div>

          <div style={{ display: "grid", gap: 6, padding: "0 16px" }}>
            {sidebarLinks.slice(0, 3).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setView(tab.key)}
                  aria-pressed={view === tab.key}
                  style={{
                    width: "100%",
                    background: view === tab.key ? "var(--bg-hover)" : "none",
                    border: "none",
                    color: view === tab.key ? "var(--accent)" : "var(--text-secondary)",
                    padding: "12px 14px",
                    textAlign: "left",
                    fontSize: "0.95rem",
                    borderRadius: "0 25px 25px 0",
                    cursor: "pointer",
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    fontFamily: "inherit",
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 18, display: "grid", gap: 6, padding: "0 16px" }}>
            {sidebarLinks.slice(3).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setView(tab.key)}
                  aria-pressed={view === tab.key}
                  style={{
                    width: "100%",
                    background: view === tab.key ? "var(--bg-hover)" : "none",
                    border: "none",
                    color: view === tab.key ? "var(--accent)" : "var(--text-secondary)",
                    padding: "12px 14px",
                    textAlign: "left",
                    fontSize: "0.95rem",
                    borderRadius: "0 25px 25px 0",
                    cursor: "pointer",
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    fontFamily: "inherit",
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 26, padding: "0 16px" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", margin: "0 0 10px" }}>Labels</p>
            {staticLabels.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setView("labels")}
                style={{
                  width: "100%",
                  background: view === "labels" ? "var(--bg-hover)" : "none",
                  border: "none",
                  color: view === "labels" ? "var(--accent)" : "var(--text-secondary)",
                  padding: "10px 14px",
                  textAlign: "left",
                  fontSize: "0.95rem",
                  borderRadius: "0 20px 20px 0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: "inherit",
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--text-secondary)" }} />
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setView("labels")}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                color: "var(--accent)",
                padding: "10px 14px",
                textAlign: "left",
                fontSize: "0.95rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              + Create label
            </button>
          </div>
        </aside>

        <main
          style={{
            flex: 1,
            padding: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <NoteCreator onAdd={addNote} />

          <section
            aria-live="polite"
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 20,
            }}
          >
            {view === "labels" ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: 28,
                  textAlign: "center",
                  color: "var(--text-secondary)",
                  background: "#ffffff",
                  border: "1px dashed var(--border-color)",
                  borderRadius: 10,
                }}
              >
                <h3 style={{ marginBottom: 10, color: "var(--empty-heading)", fontWeight: 400 }}>
                  Edit labels
                </h3>
                <p>Use labels to keep related notes together. This clone includes a sidebar preview for labels.</p>
              </div>
            ) : view === "reminders" ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: 28,
                  textAlign: "center",
                  color: "var(--text-secondary)",
                  background: "#ffffff",
                  border: "1px dashed var(--border-color)",
                  borderRadius: 10,
                }}
              >
                <h3 style={{ marginBottom: 10, color: "var(--empty-heading)", fontWeight: 400 }}>
                  Reminders
                </h3>
                <p>Reminders are not implemented yet, but this section matches the Keep experience.</p>
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: 28,
                  textAlign: "center",
                  color: "var(--text-secondary)",
                  background: "#ffffff",
                  border: "1px dashed var(--border-color)",
                  borderRadius: 10,
                }}
              >
                <h3 style={{ marginBottom: 6, color: "var(--empty-heading)", fontWeight: 400 }}>
                  {view === "archive"
                    ? "No archived notes yet"
                    : view === "trash"
                    ? "No notes in Trash"
                    : "No notes found"}
                </h3>
                <p>{search ? "Try a different search term." : view === "notes" ? "Create your first note to get started." : "Switch to Notes to create or view your notes."}</p>
              </div>
            ) : (
              filtered.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onOpen={setEditingNote}
                  onToggleArchive={toggleArchive}
                  onTogglePin={togglePin}
                  onCopy={copyNote}
                  onDelete={deleteNote}
                  onRestore={restoreNote}
                />
              ))
            )}
          </section>
        </main>
      </div>

      {editingNote && (
        <EditModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onSave={(updates) => saveEdit(editingNote.id, updates)}
        />
      )}
    </div>
  );
}