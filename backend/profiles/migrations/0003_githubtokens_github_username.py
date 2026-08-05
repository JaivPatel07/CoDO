from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0002_savedcollaborationpost_savedevent_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='githubtokens',
            name='github_username',
            field=models.CharField(null=True),
        ),
    ]
