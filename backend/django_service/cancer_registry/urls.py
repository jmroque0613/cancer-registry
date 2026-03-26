from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/registry/patients/", include("cancer_registry.apps.patients.urls")),
    path("api/v1/registry/cases/",    include("cancer_registry.apps.cases.urls")),
    path("api/v1/registry/treatments/", include("cancer_registry.apps.treatments.urls")),
    path("api/v1/registry/followups/",   include("cancer_registry.apps.followup.urls")),
]
