from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()

@register.filter
@stringfilter
def upto(value, delimiter=None):
    """
    Clean timesince template tag to show only a single unit of time
    E.g. 1 day, 12 hours => 1 day, 3 hours, 34 minutes => 3 hours
    """
    return value.split(delimiter)[0]
upto.is_safe = True