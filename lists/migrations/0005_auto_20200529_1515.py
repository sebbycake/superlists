# Generated by Django 3.0 on 2020-05-29 07:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lists', '0004_auto_20200525_1533'),
    ]

    operations = [
        migrations.AlterField(
            model_name='list',
            name='slug',
            field=models.SlugField(),
        ),
    ]