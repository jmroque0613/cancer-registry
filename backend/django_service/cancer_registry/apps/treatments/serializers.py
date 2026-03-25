from rest_framework import serializers
from .models import Treatment


class TreatmentSerializer(serializers.ModelSerializer):
    treatment_type_display = serializers.CharField(source="get_treatment_type_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Treatment
        fields = [
            "id", "case",
            "treatment_type", "treatment_type_display",
            "name", "institution", "physician",
            "start_date", "end_date",
            "status", "status_display",
            "dose", "response", "remarks",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]