from rest_framework import serializers
from .models import FollowUp


class FollowUpSerializer(serializers.ModelSerializer):
    patient_status_display = serializers.CharField(source="get_patient_status_display", read_only=True)
    contact_method_display = serializers.CharField(source="get_contact_method_display", read_only=True)
    patient_name = serializers.CharField(source="case.patient.full_name", read_only=True)
    patient_mrn = serializers.CharField(source="case.patient.mrn", read_only=True)
    primary_site = serializers.CharField(source="case.primary_site", read_only=True)

    class Meta:
        model = FollowUp
        fields = [
            "id", "case",
            "patient_name", "patient_mrn", "primary_site",
            "followup_date", "next_followup_date",
            "patient_status", "patient_status_display",
            "contact_method", "contact_method_display",
            "weight_kg", "performance_status",
            "disease_status", "complications", "remarks",
            "attending_physician",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]