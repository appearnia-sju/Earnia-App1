export interface NGO {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  description: string;
  category: string[];
  causes: string[];
  city: string;
  state: string;
  verified: boolean;
  pan: string;
  registrationCert: string;
  email: string;
  phone: string;
  website: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
  isDuplicate?: boolean;
}

export interface Post {
  id: string;
  ngoId: string;
  title: string;
  content: string;
  images: string[];
  createdAt: string;
}

export interface Admin {
  email: string;
  password: string;
}

export type Theme = "light" | "dark";
