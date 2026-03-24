from django.contrib import admin
from .models import CancerCase


@admin.register(CancerCase)
class CancerCaseAdmin(admin.ModelAdmin):
    list_display = ["patient", "primary_site", "histology", "stage", "diagnosis_date", "status"]
    search_fields = ["patient__mrn", "patient__first_name", "patient__last_name", "primary_site"]
    list_filter = ["status", "behavior", "laterality"]
    readonly_fields = ["id", "created_at", "updated_at"]
    autocomplete_fields = ["patient"]