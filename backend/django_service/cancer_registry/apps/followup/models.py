import uuid
from django.db import models
from auditlog.registry import auditlog
from cancer_registry.apps.cases.models import CancerCase


class FollowUp(models.Model):
    PATIENT_STATUS_CHOICES = [
        ("alive_no_evidence", "Alive — No Evidence of Disease"),
        ("alive_with_disease", "Alive — With Disease"),
        ("alive_unknown", "Alive — Unknown Status"),
        ("deceased_disease", "Deceased — Due to Disease"),
        ("deceased_other", "Deceased — Other Causes"),
        ("lost_to_followup", "Lost to Follow-up"),
    ]

    CONTACT_METHOD_CHOICES = [
        ("clinic_visit", "Clinic Visit"),
        ("phone_call", "Phone Call"),
        ("letter", "Letter"),
        ("home_visit", "Home Visit"),
        ("other", "Other"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case = models.ForeignKey(CancerCase, on_delete=models.PROTECT, related_name="followups")

    followup_date = models.DateField(verbose_name="Follow-up Date")
    next_followup_date = models.DateField(null=True, blank=True, verbose_name="Next Follow-up Date")

    patient_status = models.CharField(max_length=30, choices=PATIENT_STATUS_CHOICES)
    contact_method = models.CharField(max_length=20, choices=CONTACT_METHOD_CHOICES, default="clinic_visit")

    weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="Weight (kg)")
    performance_status = models.CharField(max_length=10, blank=True, verbose_name="ECOG Performance Status")

    disease_status = models.CharField(max_length=200, blank=True, verbose_name="Disease Status Notes")
    complications = models.TextField(blank=True, verbose_name="Complications / Side Effects")
    remarks = models.TextField(blank=True)

    attending_physician = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-followup_date"]
        verbose_name = "Follow-up"
        verbose_name_plural = "Follow-ups"

    def __str__(self):
        return f"{self.case.patient} — Follow-up {self.followup_date}"


auditlog.register(FollowUp)