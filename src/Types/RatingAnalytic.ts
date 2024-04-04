import { RatingData } from './RatingData';

export interface RatingAnalytic {
  rating: {
    user_id?: number;
    quiz_id?: number;
    rating: RatingData[];
  }[];
}