# Generated by Django 3.0 on 2020-06-06 14:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lists', '0007_auto_20200606_2213'),
    ]

    operations = [
        migrations.AlterField(
            model_name='list',
            name='name',
            field=models.CharField(max_length=63),
        ),
    ]
