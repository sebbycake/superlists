# Generated by Django 3.0 on 2020-07-04 04:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lists', '0008_auto_20200606_2222'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='item',
            options={'ordering': ['-is_pinned', 'timestamp']},
        ),
        migrations.AddField(
            model_name='item',
            name='is_pinned',
            field=models.BooleanField(default=False),
        ),
    ]
