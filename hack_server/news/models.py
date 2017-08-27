from django.db import models


class Reporter(models.Model):
    star = models.IntegerField(default=0)
    email = models.CharField(max_length=255, unique=True)
    good = models.IntegerField(default=0)
    bad = models.IntegerField(default=0)

    def __str__(self):
        return self.email


class News(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    good = models.IntegerField(default=0)
    bad = models.IntegerField(default=0)
    reporter = models.ForeignKey(Reporter, on_delete=models.CASCADE)
    url = models.CharField(max_length=255, unique=True)
    checked = models.IntegerField(default=0)

    def __str__(self):
        return self.reporter.email
