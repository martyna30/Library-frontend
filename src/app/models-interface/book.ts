import {BookTag} from './bookTag';
import {Author} from './author';
import {Rental} from './rental';

export interface Book {
  id: number;
  title: string;
  yearOfPublication: number;
  signature: string;
  bookTags: Array<BookTag>;
  authors: Array<Author>;
  amountOfBook?: number;
  borrowedBooks?: Array<Rental>;
}
