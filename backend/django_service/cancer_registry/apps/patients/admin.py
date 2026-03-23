from django.contrib import admin
from .models import Patient


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ["mrn", "last_name", "first_name", "date_of_birth", "sex", "created_at"]
    search_fields = ["mrn", "first_name", "last_name", "philhealth_id"]
    list_filter = ["sex", "is_active", "province"]
    readonly_fields = ["id", "created_at", "updated_at"]