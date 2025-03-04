from django.urls import path
from . import views

urlpatterns = [
    path('', views.getBooks, name='books'),
    path('read/<str:pk>', views.getBook, name='book'),
    path('create', views.addBook, name='add-book'),
    path('update/<str:pk>', views.updateBook, name='update-book'),
    path('delete/<str:pk>', views.deleteBook, name='delete-book')
]
