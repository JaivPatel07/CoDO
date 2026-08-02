# Generated manually for organization dashboard analytics.

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("OrganizationProfile", "0002_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="OrganizationProfileView",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("viewed_at", models.DateTimeField(auto_now_add=True)),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="organization_profile_views", to=settings.AUTH_USER_MODEL)),
                ("viewer", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="viewed_organization_profiles", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddIndex(
            model_name="organizationprofileview",
            index=models.Index(fields=["organization", "-viewed_at"], name="Organizatio_organiz_e4ec07_idx"),
        ),
        migrations.AddIndex(
            model_name="organizationprofileview",
            index=models.Index(fields=["viewer", "organization", "-viewed_at"], name="Organizatio_viewer__d23ed8_idx"),
        ),
    ]
