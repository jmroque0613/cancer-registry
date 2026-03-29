from rest_framework import serializers
from .models import CancerCase
from cancer_registry.apps.patients.serializers import PatientListSerializer


class CancerCaseSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.full_name", read_only=True)
    patient_mrn = serializers.CharField(source="patient.mrn", read_only=True)

    class Meta:
        model = CancerCase
        fields = [
            "id", "patient", "patient_name", "patient_mrn",
            "primary_site", "primary_site_code",
            "histology", "histology_code",
            "behavior", "laterality",
            "stage", "tnm_t", "tnm_n", "tnm_m",
            "diagnosis_date", "status", "remarks",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class CancerCaseListSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.full_name", read_only=True)
    patient_mrn = serializers.CharField(source="patient.mrn", read_only=True)
    sex = serializers.CharField(source="patient.sex", read_only=True)

    class Meta:
        model = CancerCase
        fields = ["id", "patient", "patient_name", "patient_mrn", "sex", "primary_site", "histology", "stage", "diagnosis_date", "status"]
