export interface BooksPaginated {
  count:    number;
  next:     null | string;
  previous: null | string;
  results:  Book[];
}

export interface Book {
  id:               number;
  title:            string;
  author:           string;
  publication_year: Date;
  isbn:             string;
  available_copies: number;
}
