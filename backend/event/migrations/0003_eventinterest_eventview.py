# Generated manually for event view and interest analytics.

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("event", "0002_eventregistrationclick"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="EventView",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("viewed_at", models.DateTimeField(auto_now_add=True)),
                ("event", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="view_logs", to="event.event")),
                ("viewer", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="viewed_events", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name="EventInterest",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("event", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="interests", to="event.event")),
                ("student", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="interested_events", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddIndex(
            model_name="eventview",
            index=models.Index(fields=["event", "-viewed_at"], name="event_event_event_i_c06205_idx"),
        ),
        migrations.AddIndex(
            model_name="eventview",
            index=models.Index(fields=["viewer", "event", "-viewed_at"], name="event_event_viewer__d13fd3_idx"),
        ),
        migrations.AddConstraint(
            model_name="eventinterest",
            constraint=models.UniqueConstraint(fields=("event", "student"), name="unique_event_interest"),
        ),
        migrations.AddIndex(
            model_name="eventinterest",
            index=models.Index(fields=["event", "student"], name="event_event_event_i_050887_idx"),
        ),
        migrations.AddIndex(
            model_name="eventinterest",
            index=models.Index(fields=["student", "-created_at"], name="event_event_student_3af2c8_idx"),
        ),
    ]
