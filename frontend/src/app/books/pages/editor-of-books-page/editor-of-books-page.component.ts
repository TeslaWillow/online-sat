import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editor-of-books-page',
  imports: [ FormsModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './editor-of-books-page.component.html',
  styleUrl: './editor-of-books-page.component.css'
})
export default class EditorOfBooksPageComponent implements OnInit {

  public bookForm!: FormGroup;

  private _fb = inject(FormBuilder);
  private _bookService = inject(BookService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  public readonly actual_year = new Date().getFullYear();
  public isEditing: boolean = false;
  public bookId: any;

  constructor() {}

  ngOnInit(): void {
    this._createForm();

    const bookId = this._activatedRoute.snapshot.paramMap.get('id');

    if (bookId) {
      this.bookId = +bookId;
      this.isEditing = true;
      this._getBook(this.bookId);
    }
  }

  private _getBook(bookId: number): void {
    this._bookService.getBook(bookId).subscribe({
      next: (book) => {
        this.bookForm.get('title')?.setValue(book.title);
        this.bookForm.get('author')?.setValue(book.author);
        this.bookForm.get('publication_year')?.setValue(book.publication_year);
        this.bookForm.get('isbn')?.setValue(book.isbn);
        this.bookForm.get('available_copies')?.setValue(book.available_copies);
      },
      error: (err) => {
        console.error('Error al obtener el libro', err);
      }
    });
  }

  private _createForm(): void {
    this.bookForm = this._fb.group({
      title: ['', [
        Validators.required,
        Validators.maxLength(255)
      ]],
      author: ['', [
        Validators.required,
        Validators.maxLength(255)
      ]],
      publication_year: ['', [
        Validators.required,
        Validators.min(1000),
        Validators.max(this.actual_year)
      ]],
      isbn: ['', [
        Validators.required,
        Validators.minLength(13),
        Validators.maxLength(13),
        Validators.pattern(/^\d{13}$/)
      ]],
      available_copies: ['', [
        Validators.required,
        Validators.min(0)
      ]]
    });
  }

  public isInvalid( controlName: string ): boolean {
    return this.bookForm.get(controlName)!.invalid && this.bookForm.get(controlName)!.touched;
  }

  public onSubmit(): void {

    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    if( !this.bookId ){
      this._saveBook();
      return;
    }

    this._updateBook();
  }

  private _saveBook(): void {
    this._bookService.saveBook( this.bookForm.value ).subscribe({
      next: () => {
        this._router.navigateByUrl('/books')
      }
    });
  }

  private _updateBook(): void {
    this._bookService.updateBook( this.bookId,  this.bookForm.value ).subscribe({
      next: () => {
        this._router.navigateByUrl('/books')
      }
    });
  }

}
