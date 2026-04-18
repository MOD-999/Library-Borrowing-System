# Generated migration to convert old status values to new format

from django.db import migrations

def migrate_status_forward(apps, schema_editor):
    """Convert old P/A/R status values to Pending/Approved/Rejected"""
    BorrowRequest = apps.get_model('loans', 'BorrowRequest')
    
    # Map old values to new values
    status_map = {
        'P': 'Pending',
        'A': 'Approved',
        'R': 'Rejected'
    }
    
    # Update all records with old status values
    for old_status, new_status in status_map.items():
        BorrowRequest.objects.filter(status=old_status).update(status=new_status)

def migrate_status_backward(apps, schema_editor):
    """Revert new status values back to P/A/R (if needed)"""
    BorrowRequest = apps.get_model('loans', 'BorrowRequest')
    
    status_map = {
        'Pending': 'P',
        'Approved': 'A',
        'Rejected': 'R'
    }
    
    for new_status, old_status in status_map.items():
        BorrowRequest.objects.filter(status=new_status).update(status=old_status)

class Migration(migrations.Migration):

    dependencies = [
        ('loans', '0003_alter_borrowrequest_status'),
    ]

    operations = [
        migrations.RunPython(migrate_status_forward, migrate_status_backward),
    ]
