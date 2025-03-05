from django.db import models

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    publication_year = models.PositiveIntegerField()
    isbn = models.CharField(max_length=13, unique=False)
    available_copies = models.PositiveIntegerField()