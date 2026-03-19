const BASE_URL = "https://openlibrary.org";

export async function searchBooks(query, page = 1, limit = 20) {
  if (!query || query.trim() === "") {
    throw new Error("Search query is required");
  }

  const res = await fetch(
    `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&fields=title,author_name,cover_i,first_publish_year,ia,public_scan_b,key`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  return res.json();
}

export async function getBookDetails(workId) {
  if (!workId) {
    throw new Error("Work ID is required");
  }

  const res = await fetch(`${BASE_URL}/works/${workId}.json`);

  if (!res.ok) {
    throw new Error("Failed to fetch book details");
  }

  return res.json();
}

export async function getAuthorDetails(authorId) {
  if (!authorId) {
    throw new Error("Author ID is required");
  }

  const res = await fetch(`${BASE_URL}/authors/${authorId}.json`);

  if (!res.ok) {
    throw new Error("Failed to fetch author details");
  }

  return res.json();
}

export async function getAuthorWorks(authorId, limit = 20) {
  if (!authorId) {
    throw new Error("Author ID is required");
  }

  const res = await fetch(`${BASE_URL}/authors/${authorId}/works.json?limit=${limit}`);

  if (!res.ok) {
    throw new Error("Failed to fetch author works");
  }

  return res.json();
}

export async function getSubjectBooks(subject, limit = 20) {
  if (!subject) {
    throw new Error("Subject is required");
  }

  const res = await fetch(`${BASE_URL}/subjects/${subject}.json?limit=${limit}`);

  if (!res.ok) {
    throw new Error("Failed to fetch subject books");
  }

  return res.json();
}