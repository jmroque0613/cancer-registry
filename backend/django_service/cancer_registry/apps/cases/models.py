import uuid
from django.db import models
from auditlog.registry import auditlog
from cancer_registry.apps.patients.models import Patient


class CancerCase(models.Model):
    BEHAVIOR_CHOICES = [
        ("0", "Benign"),
        ("1", "Uncertain"),
        ("2", "In situ"),
        ("3", "Malignant"),
    ]

    LATERALITY_CHOICES = [
        ("0", "Not applicable"),
        ("1", "Right"),
        ("2", "Left"),
        ("3", "Bilateral"),
        ("9", "Unknown"),
    ]

    STATUS_CHOICES = [
        ("active", "Active"),
        ("remission", "Remission"),
        ("deceased", "Deceased"),
        ("lost_to_followup", "Lost to Follow-up"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(Patient, on_delete=models.PROTECT, related_name="cases")
    
    primary_site = models.CharField(max_length=200, verbose_name="Primary Site")
    primary_site_code = models.CharField(max_length=10, blank=True, verbose_name="ICD-O Site Code")
    histology = models.CharField(max_length=200, verbose_name="Histology")
    histology_code = models.CharField(max_length=10, blank=True, verbose_name="ICD-O Histology Code")
    behavior = models.CharField(max_length=1, choices=BEHAVIOR_CHOICES, default="3")
    laterality = models.CharField(max_length=1, choices=LATERALITY_CHOICES, default="0")

    stage = models.CharField(max_length=20, blank=True, verbose_name="Overall Stage")
    tnm_t = models.CharField(max_length=10, blank=True, verbose_name="TNM - T")
    tnm_n = models.CharField(max_length=10, blank=True, verbose_name="TNM - N")
    tnm_m = models.CharField(max_length=10, blank=True, verbose_name="TNM - M")

    diagnosis_date = models.DateField(verbose_name="Date of Diagnosis")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")

    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-diagnosis_date"]
        verbose_name = "Cancer Case"
        verbose_name_plural = "Cancer Cases"

    def __str__(self):
        return f"{self.patient} — {self.primary_site} ({self.diagnosis_date})"


auditlog.register(CancerCase)