export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type Pagination = {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
};
