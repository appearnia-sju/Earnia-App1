import { NGO, Post } from "../types";
import { SAMPLE_NGOS, SAMPLE_POSTS } from "../data/sampleData";

const KEYS = {
  NGOS: "earnia_ngos",
  POSTS: "earnia_posts",
  ADMIN: "earnia_admin"
};

export const getNGOs = (): NGO[] => {
  const data = localStorage.getItem(KEYS.NGOS);
  if (!data) {
    localStorage.setItem(KEYS.NGOS, JSON.stringify(SAMPLE_NGOS));
    return SAMPLE_NGOS;
  }
  return JSON.parse(data);
};

export const addNGO = (ngo: Omit<NGO, "id" | "createdAt" | "verified" | "status">): NGO => {
  const ngos = getNGOs();
  
  // Duplicate detection
  const isDuplicate = ngos.some(
    (n) => n.name.toLowerCase() === ngo.name.toLowerCase() && 
           n.city.toLowerCase() === ngo.city.toLowerCase()
  );

  const newNGO: NGO = {
    ...ngo,
    id: `ngo-${Date.now()}`,
    createdAt: new Date().toISOString(),
    verified: false,
    status: "pending",
    isDuplicate
  };

  const updatedNGOs = [...ngos, newNGO];
  localStorage.setItem(KEYS.NGOS, JSON.stringify(updatedNGOs));
  return newNGO;
};

export const updateNGO = (id: string, updates: Partial<NGO>): NGO | null => {
  const ngos = getNGOs();
  const index = ngos.findIndex((n) => n.id === id);
  if (index === -1) return null;

  const updatedNGO = { ...ngos[index], ...updates };
  ngos[index] = updatedNGO;
  localStorage.setItem(KEYS.NGOS, JSON.stringify(ngos));
  return updatedNGO;
};

export const deleteNGO = (id: string): void => {
  const ngos = getNGOs();
  const updatedNGOs = ngos.filter((n) => n.id !== id);
  localStorage.setItem(KEYS.NGOS, JSON.stringify(updatedNGOs));
};

export const getPosts = (): Post[] => {
  const data = localStorage.getItem(KEYS.POSTS);
  if (!data) {
    localStorage.setItem(KEYS.POSTS, JSON.stringify(SAMPLE_POSTS));
    return SAMPLE_POSTS;
  }
  return JSON.parse(data);
};

export const addPost = (post: Omit<Post, "id" | "createdAt">): Post => {
  const posts = getPosts();
  const newPost: Post = {
    ...post,
    id: `post-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  const updatedPosts = [newPost, ...posts];
  localStorage.setItem(KEYS.POSTS, JSON.stringify(updatedPosts));
  return newPost;
};

export const exportNGOsToCSV = () => {
  const ngos = getNGOs();
  const headers = ["Name", "City", "State", "Email", "Phone", "Website", "Status", "Verified"];
  const rows = ngos.map(n => [
    n.name,
    n.city,
    n.state,
    n.email,
    n.phone,
    n.website,
    n.status,
    n.verified ? "Yes" : "No"
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.map(v => `"${v}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "earnia_ngos.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
