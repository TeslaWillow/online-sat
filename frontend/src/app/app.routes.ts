import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'books',
    loadComponent: () => import('./books/pages/list-of-books-page/list-of-books-page.component'),
  },
  {
    path: 'create-book',
    loadComponent: () => import('./books/pages/editor-of-books-page/editor-of-books-page.component'),
  },
  {
    path: 'books/:id',
    loadComponent: () => import('./books/pages/editor-of-books-page/editor-of-books-page.component'),
  },
  {
    path: '**',
    redirectTo: 'books'
  }
];
