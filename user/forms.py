from django import forms
from django.core.exceptions import ValidationError
from .models import CustomUser

class CustomUserCreationForm(forms.ModelForm):
    email = forms.CharField(label='email', widget=forms.EmailInput(
        attrs={
                'id': 'register-email',
                # 'placeholder': 'Email'
            }
        ))
    password1 = forms.CharField(label='password',
        widget=forms.PasswordInput(
            attrs={
                'id': 'register-password1',
                # 'placeholder': 'Password'
            }
        ))
    password2 = forms.CharField(label='confirm password',
        widget=forms.PasswordInput(
            attrs={
                'id': 'register-password2',
                # 'placeholder': 'Confirm Password'
            }
        ))

    class Meta:
        model = CustomUser
        fields = ('email', 'password1', 'password2',)
 
    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        r = CustomUser.objects.filter(email=email)
        if r.exists():
            raise ValidationError("Email already exists.")
        return email
 
    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
 
        if password1 and password2 and password1 != password2:
            raise ValidationError("Password doesn't match.")

        return password2

    # this SAVED MY FAILED LOGIN AUTH!!
    # password hashing issue?
    def save(self, commit=True):
        user = CustomUser.objects.create_user(
            self.cleaned_data['email'],
            self.cleaned_data['password1']
        )
        return user