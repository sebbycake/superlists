from django.db import models
from django.urls import reverse
from django.conf import settings

# Create your models here.

class List(models.Model):
    name = models.CharField(max_length=63)
    slug = models.SlugField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        unique_together = ('name', 'user')
    
    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('list_detail', kwargs={'list_id': self.pk, 'list_slug': self.slug})


class Item(models.Model):
    text = models.TextField(default='')
    list = models.ForeignKey(List, default=None, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_pinned = models.BooleanField(default=False)

    class Meta:
        ordering = ['-is_pinned', 'timestamp']
        unique_together = ('list', 'text')

    def __str__(self):
        return self.text

