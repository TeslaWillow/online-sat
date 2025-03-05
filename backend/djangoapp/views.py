from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import Book
from .serializers import BookSerializer
# Create your views here.

class BookPagination(PageNumberPagination):
    page_size = 10 
    page_size_query_param = 'page_size'  
    max_page_size = 100  

@api_view(['GET'])
def getBooks(request):
    books = Book.objects.all()
    paginator = BookPagination()
    result_page = paginator.paginate_queryset(books, request)
    serializer = BookSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def getBook(request, pk):
    try:
        book = Book.objects.get(id=pk)
    except Book.DoesNotExist:
        return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)
    serializer = BookSerializer(book, many=False)
    return Response(serializer.data)

#Add a new book
@api_view(['POST'])
def addBook(request):
    isbn = request.data.get('isbn', None)  # GET ISBN from request
    
    # Verify if ISBN already exists
    if isbn and Book.objects.filter(isbn=isbn).exists():
        return Response(
            {"error": "A book with this ISBN already exists."},
            status=status.HTTP_400_BAD_REQUEST  # Bad request
        )

    serializer = BookSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#Update a book
@api_view(['PUT'])
def updateBook(request, pk):
    try:
        # Verify if book exist
        book = Book.objects.get(id=pk)
    except Book.DoesNotExist:
        # If not exist 404
        return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = BookSerializer(instance=book, data=request.data, partial=True)
    # Validate
    if serializer.is_valid():
        # Save
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Delete a book
@api_view(['DELETE'])
def deleteBook(request, pk):
    try:
        book = Book.objects.get(id=pk)
    except Book.DoesNotExist:
        return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)
    book.delete()
    return Response({'detail': 'Book deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
