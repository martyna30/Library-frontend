import {BookTag} from './bookTag';
import {Author} from './author';
import {AuthorValidationError} from './authorValidationError';

export interface BookValidationError {
  title?: string;
  yearOfPublication?: string;
  signature?: string;
  bookTags?: Array<BookTag>;
  authors?: Array<AuthorValidationError>;
}
