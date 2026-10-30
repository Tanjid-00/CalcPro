const notesPanel = document.getElementById("notesPanel");
const notesMenuItem = document.getElementById("notesMenuItem");
const closeNotes = document.getElementById("closeNotes");

const noteInput = document.getElementById("noteInput");
const saveNoteButton = document.getElementById("saveNote");
const notesList = document.getElementById("notesList");

const NOTES_KEY = "moneyCalculatorNotes";

function getNotes() {
  try {
    const data = JSON.parse(localStorage.getItem(NOTES_KEY) || "[]");

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

// function renderNotes() {
//   const notes = getNotes();

//   notesList.replaceChildren();

//   notes.forEach((note, index) => {
//     const li = document.createElement("li");
//     const text = document.createElement("span");
//     const deleteButton = document.createElement("button");

//     text.textContent = note.text;

//     deleteButton.textContent = "Delete";
//     deleteButton.type = "button";

//     deleteButton.addEventListener("click", () => {
//       const updatedNotes = getNotes();
//       updatedNotes.splice(index, 1);

//       saveNotes(updatedNotes);
//       renderNotes();
//     });

//     li.append(text, " ", deleteButton);
//     notesList.appendChild(li);
//   });
// }

function renderNotes() {
  const notes = getNotes();

  notesList.replaceChildren();

  notes.forEach((note) => {
    const li = document.createElement("li");
    const text = document.createElement("span");
    const deleteButton = document.createElement("button");

    // Note text
    text.className = "note-text";
    text.textContent = note.text;

    // Delete button
    deleteButton.className = "delete-note";
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", "Delete note");

    deleteButton.addEventListener("click", () => {
      const updatedNotes = getNotes();

      // Find the note by its unique ID
      const noteIndex = updatedNotes.findIndex((item) => item.id === note.id);

      if (noteIndex === -1) return;

      updatedNotes.splice(noteIndex, 1);

      saveNotes(updatedNotes);
      renderNotes();
    });

    // Keep text and button in separate elements
    li.append(text, deleteButton);
    notesList.appendChild(li);
  });
}

notesMenuItem.addEventListener("click", () => {
  document.getElementById("appMenu").hidden = true;
  document.getElementById("menuToggle").setAttribute("aria-expanded", "false");

  notesPanel.hidden = false;
  renderNotes();
});

closeNotes.addEventListener("click", () => {
  notesPanel.hidden = true;
});

saveNoteButton.addEventListener("click", () => {
  const text = noteInput.value.trim();

  if (!text) {
    alert("Please write a note first.");
    return;
  }

  const notes = getNotes();

  notes.push({
    id: Date.now(),
    text: text,
    createdAt: new Date().toISOString(),
  });

  try {
    saveNotes(notes);
  } catch {
    alert("Could not save the note. Browser storage may be full.");
    return;
  }

  noteInput.value = "";
  renderNotes();
});
