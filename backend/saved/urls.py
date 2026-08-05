from django.urls import path

from .views import SavedItemDetailView, SavedItemListView

urlpatterns = [
    path('', SavedItemListView.as_view()),
    path('<str:item_type>/<int:item_id>/', SavedItemDetailView.as_view()),
]
