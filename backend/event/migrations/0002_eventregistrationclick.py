# Generated manually for timestamped registration analytics.

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("event", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="EventRegistrationClick",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("clicked_at", models.DateTimeField(auto_now_add=True)),
                ("clicked_by", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="event_registration_clicks", to=settings.AUTH_USER_MODEL)),
                ("event", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="registration_click_logs", to="event.event")),
            ],
        ),
        migrations.AddIndex(
            model_name="eventregistrationclick",
            index=models.Index(fields=["event", "-clicked_at"], name="event_event_event_i_7782ca_idx"),
        ),
        migrations.AddIndex(
            model_name="eventregistrationclick",
            index=models.Index(fields=["clicked_at"], name="event_event_clicked_82c89c_idx"),
        ),
    ]
