const BASE_URL = "https://openlibrary.org/search.json";

export async function searchBooks(query, page = 1, limit = 20) {
  if (!query || query.trim() === "") {
    throw new Error("Search query is required");
  }

  const res = await fetch(
    `${BASE_URL}?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  return res.json();
}