import { Post } from "./type";

export default function chronDate(notes: Post[]) {
  // console.log('generate-chron called');

  const sortedNotes = notes.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  let y: string | null = null;
  let m: string | null = null;
  let d: string | null = null;

  sortedNotes.forEach((note) => {
    const date = note.publishedAt.split(".");
    const year = date[0];
    const month = date[1];
    const day = date[2];
    if (!note.chron) {
      note.chron = {};
    }

    if (year !== y) {
      y = year;
      m = null;
      d = null;
      note.chron.year = year;
    }

    if (month !== m) {
      m = month;
      d = null;
      note.chron.month = month;
    }

    if (day !== d) {
      d = day;
      note.chron.day = day;
    }
  });

  return sortedNotes;
}
