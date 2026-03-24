from rest_framework.routers import DefaultRouter
from .views import CancerCaseViewSet

router = DefaultRouter()
router.register(r"", CancerCaseViewSet, basename="case")

urlpatterns = router.urls