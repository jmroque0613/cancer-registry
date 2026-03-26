from django.contrib import admin
from .models import FollowUp


@admin.register(FollowUp)
class FollowUpAdmin(admin.ModelAdmin):
    list_display = ["case", "followup_date", "patient_status", "contact_method", "next_followup_date"]
    search_fields = ["case__patient__mrn", "case__patient__last_name", "case__primary_site"]
    list_filter = ["patient_status", "contact_method"]
    readonly_fields = ["id", "created_at", "updated_at"]