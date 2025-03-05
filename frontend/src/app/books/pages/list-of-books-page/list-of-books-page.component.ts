import { Component, inject, OnInit, signal } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book, BooksPaginated } from '../../interfaces/books.interface';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-list-of-books-page',
  imports: [ CommonModule, RouterLink ],
  templateUrl: './list-of-books-page.component.html',
  styleUrl: './list-of-books-page.component.css'
})
export default class ListOfBooksPageComponent implements OnInit {

  private _booksService = inject(BookService);

  public booksPaginated: BooksPaginated | null = null;

  public get books(): Book[] {
    return this.booksPaginated?.results || [];
  }

  ngOnInit(): void { this._getBooks(); }

  private _getBooks(): void {
    this._booksService.getBooks().subscribe({
      next: (booksPaginated) => {
        this.booksPaginated = booksPaginated;
        console.log(this.booksPaginated);
      }
    });
  }

  public askToDeleteBook( id: number ): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You can not revert this action',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._deleteBook(id);
      }
    });
  }

  private _deleteBook( id: number ): void {
    this._booksService.deleteBook(id).subscribe({
      next: () => { this._getBooks(); },
      error: (err) => { console.error(err); }
    });
  }

}
