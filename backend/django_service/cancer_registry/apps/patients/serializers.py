from rest_framework import serializers
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Patient
        fields = [
            "id", "mrn", "first_name", "middle_name", "last_name",
            "full_name", "date_of_birth", "sex", "philhealth_id",
            "contact_number", "address", "city", "province",
            "is_active", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class PatientListSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Patient
        fields = ["id", "mrn", "full_name", "date_of_birth", "sex", "contact_number"]