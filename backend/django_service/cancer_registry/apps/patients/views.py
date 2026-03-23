from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Patient
from .serializers import PatientSerializer, PatientListSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["mrn", "first_name", "last_name", "philhealth_id"]
    ordering_fields = ["last_name", "created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return PatientListSerializer
        return PatientSerializer

    @action(detail=True, methods=["get"])
    def cases(self, request, pk=None):
        patient = self.get_object()
        return Response({"patient_id": str(patient.id), "cases": []})