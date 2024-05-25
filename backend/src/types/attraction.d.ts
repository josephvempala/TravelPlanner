export interface Attraction {
  id?: number;
  name: string;
  description: string;
  category: string;
  image_url?: string;
  rating: number;
  city_id?: number;
}
