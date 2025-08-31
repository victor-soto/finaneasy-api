import { Category } from './category.model';
import { User } from './user.model';

export class Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  user: User;
  category: Category;
}
