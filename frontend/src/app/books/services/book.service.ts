import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Book, BooksPaginated } from '../interfaces/books.interface';
import { SaveBook } from '../interfaces/save-book.interface';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly base_url: string = environment.BASE_URL;
  private readonly endpoint: string = 'books'

  private http = inject(HttpClient);

  constructor() { }

  public getBooks(): Observable<BooksPaginated> {
    return this.http.get<BooksPaginated>(`${this.base_url}/${this.endpoint}`);
  }

  public getBook( id: number ): Observable<Book> {
    return this.http.get<Book>(`${this.base_url}/${this.endpoint}/read/${id}`);
  }

  public changePage( url: string ): Observable<BooksPaginated> {
    return this.http.get<BooksPaginated>(`${url}`);
  }

  public updateBook( id: number, data: SaveBook ): Observable<Book>{
    return this.http.put<Book>(`${this.base_url}/${this.endpoint}/update/${id}`, data);
  }

  public saveBook( data: SaveBook ): Observable<Book> {
    return this.http.post<Book>(`${this.base_url}/${this.endpoint}/create`, data);
  }

  public deleteBook( id: number ): Observable<void> {
    return this.http.delete<void>(`${this.base_url}/${this.endpoint}/delete/${id}`);
  }

}
