from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from rest_framework.decorators import api_view
from .models import Book
from .serializers import BookSerializer
# Create your views here.

CURRENT_YEAR = datetime.now().year 

class BookPagination(PageNumberPagination):
    page_size = 10 
    page_size_query_param = 'page_size'  
    max_page_size = 100  

@api_view(['GET'])
def getBooks(request):
    books = Book.objects.all().order_by('-id')
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
    publication_year = request.data.get('publication_year', None)
    
    # Verify if ISBN already exists
    if isbn and Book.objects.filter(isbn=isbn).exists():
        return Response(
            {"error": "A book with this ISBN already exists."},
            status=status.HTTP_400_BAD_REQUEST  # Bad request
        )
    
    # Validate publication year
    validation_error = validate_publication_year(publication_year)
    if validation_error:
        return Response(validation_error, status=status.HTTP_400_BAD_REQUEST)

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
    
    publication_year = request.data.get('publication_year', None)

    # Validate publication year
    validation_error = validate_publication_year(publication_year)
    if validation_error:
        return Response(validation_error, status=status.HTTP_400_BAD_REQUEST)
    
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

def validate_publication_year(publication_year):
    """Valida que el año de publicación esté en el rango permitido."""
    if publication_year is not None:
        try:
            year = int(publication_year)
            if not (1000 <= year <= CURRENT_YEAR):
                return {"error": f"Publication year must be between 1000 and {CURRENT_YEAR}."}
        except ValueError:
            return {"error": "Publication year must be a valid integer."}
    return None