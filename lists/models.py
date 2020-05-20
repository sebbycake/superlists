from django.db import models
from django.urls import reverse
from django.utils.text import slugify
from django.utils import timezone

# Create your models here.

class List(models.Model):
    name = models.CharField(max_length=63, unique=True)
    slug = models.SlugField()

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('list_detail', kwargs={'list_slug': self.slug})
        # or return reverse('view_list', args=[self.id])
    
    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        return super().save()


class Item(models.Model):
    text = models.TextField(default='')
    list = models.ForeignKey(List, default=None, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('id',)
        unique_together = ('list', 'text')

    def __str__(self):
        return self.text

