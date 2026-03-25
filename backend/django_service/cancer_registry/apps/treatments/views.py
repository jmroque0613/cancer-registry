from rest_framework import viewsets, filters
from .models import Treatment
from .serializers import TreatmentSerializer


class TreatmentViewSet(viewsets.ModelViewSet):
    queryset = Treatment.objects.select_related("case__patient").all()
    serializer_class = TreatmentSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "case__patient__mrn", "case__patient__last_name"]
    ordering_fields = ["start_date", "created_at"]

    def get_queryset(self):
        queryset = super().get_queryset()
        case_id = self.request.query_params.get("case")
        if case_id:
            queryset = queryset.filter(case_id=case_id)
        return queryset