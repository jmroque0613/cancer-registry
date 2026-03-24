from rest_framework import viewsets, filters
from .models import CancerCase
from .serializers import CancerCaseSerializer, CancerCaseListSerializer


class CancerCaseViewSet(viewsets.ModelViewSet):
    queryset = CancerCase.objects.select_related("patient").all()
    serializer_class = CancerCaseSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["patient__mrn", "patient__first_name", "patient__last_name", "primary_site"]
    ordering_fields = ["diagnosis_date", "created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return CancerCaseListSerializer
        return CancerCaseSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        patient_id = self.request.query_params.get("patient")
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        return queryset