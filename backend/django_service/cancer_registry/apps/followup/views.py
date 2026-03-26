from rest_framework import viewsets, filters
from .models import FollowUp
from .serializers import FollowUpSerializer


class FollowUpViewSet(viewsets.ModelViewSet):
    queryset = FollowUp.objects.select_related("case__patient").all()
    serializer_class = FollowUpSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["case__patient__mrn", "case__patient__last_name", "case__primary_site"]
    ordering_fields = ["followup_date", "created_at"]

    def get_queryset(self):
        queryset = super().get_queryset()
        case_id = self.request.query_params.get("case")
        patient_id = self.request.query_params.get("patient")
        if case_id:
            queryset = queryset.filter(case_id=case_id)
        if patient_id:
            queryset = queryset.filter(case__patient_id=patient_id)
        return queryset