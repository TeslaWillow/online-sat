from django.db import models

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    publication_year = models.DateField()
    isbn = models.CharField(max_length=13, unique=True)
    available_copies = models.PositiveIntegerField()