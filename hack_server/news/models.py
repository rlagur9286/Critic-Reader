from django.db import models


class News(models.Model):
    header = models.CharField(max_length=30, unique=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    vote = models.IntegerField(default=0, blank=True)
    reporter = models.CharField(max_length=255)

    def __str__(self):
        return self.header
