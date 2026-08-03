# Generated manually for organization follow support.

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("network", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="OrganizationFollow",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="organization_followers", to=settings.AUTH_USER_MODEL)),
                ("student", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="followed_organizations", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddConstraint(
            model_name="organizationfollow",
            constraint=models.UniqueConstraint(fields=("student", "organization"), name="unique_student_organization_follow"),
        ),
        migrations.AddIndex(
            model_name="organizationfollow",
            index=models.Index(fields=["student", "organization"], name="network_org_student_64c42a_idx"),
        ),
        migrations.AddIndex(
            model_name="organizationfollow",
            index=models.Index(fields=["organization"], name="network_org_organiz_7df8ed_idx"),
        ),
        migrations.AddIndex(
            model_name="organizationfollow",
            index=models.Index(fields=["student"], name="network_org_student_5dbf87_idx"),
        ),
    ]
