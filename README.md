# Listeefy

A minimalistic to-do list which allows you to create your own unique list name with a unique URL and create to-dos, as many as you like.


## About The Project

A slew of to-do lists today provide features that users do not need. A **simple user interface** that enables you to take down your tasks straightaway is sometimes all that you might need. Too many features just clutter things up. And Listeefy is built with that in mind.

### Built With

* [Django](https://www.djangoproject.com/) - The web framework used
* [Django Rest Framework](https://www.django-rest-framework.org/) - Building APIs for AJAX requests for real time updates of to-do items 
* [jQuery](https://jquery.com/) - Calling AJAX requests with DRF and some DOM manipulation 


## Getting Started

### Prerequisites

* [Python and pip](https://www.python.org/)
* [PostgreSQL](https://www.postgresql.org/) 

*Note: PostgreSQL is optional if you like to use the default SQLite3 by Django instead. However, for larger applications, PostgreSQL is highly recommended.*

### Installation

1. Install dependencies on your local machine:

```
git clone https://github.com/sebbycake/superlists.git
pip install -r requirements.txt
```

2. Create database and give the new user access to administer the database:

open `psql` (PostgreSQL terminal-based front-end)

```
postgres=# CREATE DATABASE <your_database_name>;
postgres=# CREATE USER <your_username> WITH PASSWORD '<your_password>';
postgres=# GRANT ALL PRIVILEGES ON DATABASE <your_database_name> TO <your_username>;
postgres=# \q
``` 

3. Update database configuration settings to the above Postgre settings at `settings.py`:

```
# PostgreSQL database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': <your_database_name>,
        'USER': <your_username>,
        'PASSWORD': <your_password>,
        'HOST': 'localhost',
    }
}
```

4. Run database migration files:
```
python manage.py makemigrations
python manage.py migrate
```

5. Create a superuser to access admin site:

```
python manage.py createsuperuser
```

### Usage

Run the code with Django development server:
```
python manage.py runserver
```

## Deployment

Important files for deployment on Heroku:

* Procfile
* gunicorn and django-heroku packages
* Configured STATIC_ROOT settings
* Update SECRET_KEY and DEBUG values to environment variables

For more information, please refer to [Heroku documentation](https://devcenter.heroku.com/articles/getting-started-with-python).

## License

This project is licensed under the BSD License.