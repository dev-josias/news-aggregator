export type User = { id: number; name: string; email: string };

export type Article = {
  id: number;
  title: string;
  source: string;
  description: string;
  bookmarked?: boolean;
  imageUrl: string;
  category: string;
  publishedAt: string;
  author: string;
  url: string;
};

export interface ModalProps {
  onClose: () => void;
}
