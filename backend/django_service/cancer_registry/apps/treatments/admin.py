from django.contrib import admin
from .models import Treatment


@admin.register(Treatment)
class TreatmentAdmin(admin.ModelAdmin):
    list_display = ["case", "treatment_type", "name", "start_date", "end_date", "status"]
    search_fields = ["case__patient__mrn", "case__patient__last_name", "name"]
    list_filter = ["treatment_type", "status"]
    readonly_fields = ["id", "created_at", "updated_at"]