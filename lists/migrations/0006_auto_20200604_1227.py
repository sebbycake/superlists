# Generated by Django 3.0 on 2020-06-04 04:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lists', '0005_auto_20200529_1515'),
    ]

    operations = [
        migrations.AlterField(
            model_name='list',
            name='name',
            field=models.CharField(max_length=63, unique=True),
        ),
    ]
