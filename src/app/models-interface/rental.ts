import {BookTag} from './bookTag';
import {Author} from './author';

export interface Rental {
  id?: number;
  title: string;
  startingDate?: Date;
  finishDate?: Date;
  amountOfBorrowedBooks: number;
}

