import uuid
from django.db import models
from auditlog.registry import auditlog
from cancer_registry.apps.cases.models import CancerCase


class Treatment(models.Model):
    TREATMENT_TYPE_CHOICES = [
        ("surgery", "Surgery"),
        ("chemotherapy", "Chemotherapy"),
        ("radiation", "Radiation Therapy"),
        ("immunotherapy", "Immunotherapy"),
        ("hormone", "Hormone Therapy"),
        ("targeted", "Targeted Therapy"),
        ("palliative", "Palliative Care"),
        ("other", "Other"),
    ]

    STATUS_CHOICES = [
        ("planned", "Planned"),
        ("ongoing", "Ongoing"),
        ("completed", "Completed"),
        ("discontinued", "Discontinued"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case = models.ForeignKey(CancerCase, on_delete=models.PROTECT, related_name="treatments")

    treatment_type = models.CharField(max_length=20, choices=TREATMENT_TYPE_CHOICES)
    name = models.CharField(max_length=200, verbose_name="Treatment Name / Protocol")
    institution = models.CharField(max_length=200, blank=True, verbose_name="Institution")
    physician = models.CharField(max_length=200, blank=True, verbose_name="Attending Physician")

    start_date = models.DateField(verbose_name="Start Date")
    end_date = models.DateField(null=True, blank=True, verbose_name="End Date")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="planned")

    dose = models.CharField(max_length=100, blank=True, verbose_name="Dose / Cycles")
    response = models.CharField(max_length=200, blank=True, verbose_name="Treatment Response")
    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_date"]
        verbose_name = "Treatment"
        verbose_name_plural = "Treatments"

    def __str__(self):
        return f"{self.get_treatment_type_display()} — {self.case}"


auditlog.register(Treatment)