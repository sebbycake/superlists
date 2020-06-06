from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.
class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **kwargs):
        email = self.normalize_email(email)
        is_staff = kwargs.pop('is_staff', False)
        is_superuser = kwargs.pop('is_superuser', False)
        user = self.model(
            email=email,
            is_active = True,
            is_staff = is_staff,
            is_superuser = is_superuser,
            **kwargs
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
        
    def create_user(self, email, password=None, **extra_fields):
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        return self._create_user(email, password, is_staff=True, is_superuser=True, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField('Email', max_length=254, unique=True)
    is_staff = models.BooleanField('staff status', default=False, 
    help_text=' Designates whether the user can log into this admin site.')
    is_active = models.BooleanField('active', default=True, help_text=(
        'Designates whether this user should '
        'be treated as active. Unselect this instead of deleting accounts.'))
    # username_field informs Django which of our fields is to be used for login and the like
    USERNAME_FIELD = 'email'    
    # To connect our UserManager to the User model by overriding the objects attribute
    objects = UserManager()
    
    def __str__(self):
        return self.email






