export interface Publication {
  id: string;
  title: string;
  abstract: string;
  urls?: string[];
  authors: string[];
  keywords?: string[];
  year: number;
  doi?: string;
}

// Example: src/api.js
export async function fetchPublications(skip = 0, limit = 20): Promise<Publication[]>{
  const res = await fetch(
    `https://knowbiols-backend-d8gcc2beabaafnc7.canadacentral-01.azurewebsites.net/publications?skip=${skip}&limit=${limit}`
  );
  if (!res.ok) throw new Error("Failed to fetch publications");
  return await res.json();
}

export async function fetchPublication(id): Promise<Publication> {
  const res = await fetch(
    `https://knowbiols-backend-d8gcc2beabaafnc7.canadacentral-01.azurewebsites.net/publications/${id}`
  );
  if (!res.ok) throw new Error("Publication not found");
  return await res.json();
}

export async function searchPublications(query) {
  const res = await fetch(
    `https://knowbiols-backend-d8gcc2beabaafnc7.canadacentral-01.azurewebsites.net/search?query=${encodeURIComponent(
      query
    )}`
  );
  if (!res.ok) throw new Error("Search failed");
  return await res.json();
}
