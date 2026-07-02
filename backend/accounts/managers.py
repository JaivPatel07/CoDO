from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


class UserManager(BaseUserManager):

    def create_user(self, email, username, password=None, **extra_fields):

        if not email:
            raise ValueError("Email is required")

        if not password:
            raise ValueError("Password is required")

        user = self.model(
            email=email,
            username=username,
            **extra_fields,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, username, password=None):

        user = self.create_user(
            email=email,
            username=username,
            password=password,
        )

        user.is_staff = True
        user.is_superuser = True

        user.save(using=self._db)

        return user

