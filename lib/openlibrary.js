function buildRequestUrl(action, params = {}) {
  const qs = new URLSearchParams()
  qs.set("action", action)
  for (const [key, value] of Object.entries(params)) {
    qs.set(key, value)
  }
  return `/api/openlibrary?${qs.toString()}`
}

async function request(action, params = {}) {
  const res = await fetch(buildRequestUrl(action, params))

  if (!res.ok) {
    const text = await res.text()
    let message = `Request failed with status ${res.status}`
    try {
      const data = JSON.parse(text)
      message = data.error || message
    } catch {
      // keep default message
    }
    throw new Error(message)
  }

  return res.json()
}

export async function searchBooks(query, page = 1, limit = 20) {
  if (!query || query.trim() === "") {
    throw new Error("Search query is required");
  }

  return request("search", { query: query.trim(), page: String(page), limit: String(limit) });
}

export async function getBookDetails(workId) {
  if (!workId) {
    throw new Error("Work ID is required");
  }

  return request("work", { workId });
}

export async function getAuthorDetails(authorId) {
  if (!authorId) {
    throw new Error("Author ID is required");
  }

  return request("author", { authorId });
}

export async function getAuthorWorks(authorId, limit = 20) {
  if (!authorId) {
    throw new Error("Author ID is required");
  }

  return request("author-works", { authorId, limit: String(limit) });
}

export async function getSubjectBooks(subject, limit = 20) {
  if (!subject) {
    throw new Error("Subject is required");
  }

  return request("subject", { subject, limit: String(limit) });
}

export async function searchGoogleBooks(query) {
  if (!query || query.trim() === "") {
    throw new Error("Search query is required");
  }

  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&printType=books`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Google Books results");
  }

  return res.json();
}
