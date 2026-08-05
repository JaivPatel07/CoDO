from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from event.models import Event
from usercollabration.models import CollabrationEventPost, OpenSourceProject

from .models import SavedItem
from .serializers import SavedItemSerializer

TARGET_MODELS = {
    SavedItem.EVENT: (Event, "event"),
    SavedItem.PROJECT: (OpenSourceProject, "project"),
    SavedItem.COLLABRATION: (CollabrationEventPost, "collabration"),
}


class SavedItemListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = SavedItem.objects.filter(user=request.user).select_related(
            "event", "event__organization", "project", "project__owner", "collabration", "collabration__owner"
        )

        item_type = request.query_params.get("item_type")
        if item_type:
            if item_type not in TARGET_MODELS:
                return Response({"error": "Invalid item type."}, status=status.HTTP_400_BAD_REQUEST)
            queryset = queryset.filter(item_type=item_type)

        limit = request.query_params.get("limit")
        if limit:
            try:
                queryset = queryset[:max(int(limit), 1)]
            except ValueError:
                return Response({"error": "Invalid limit."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = SavedItemSerializer(queryset, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        item_type = request.data.get("item_type")
        item_id = request.data.get("item_id")

        if item_type not in TARGET_MODELS:
            return Response({"error": "Invalid item type."}, status=status.HTTP_400_BAD_REQUEST)

        model, field = TARGET_MODELS[item_type]
        target = get_object_or_404(model, pk=item_id)

        saved_item, created = SavedItem.objects.get_or_create(
            user=request.user,
            item_type=item_type,
            **{field: target}
        )

        serializer = SavedItemSerializer(saved_item, context={"request": request})
        return Response(
            {"is_saved": True, "created": created, "saved_item": serializer.data},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


class SavedItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_type, item_id):
        if item_type not in TARGET_MODELS:
            return Response({"error": "Invalid item type."}, status=status.HTTP_400_BAD_REQUEST)

        _, field = TARGET_MODELS[item_type]
        deleted_count, _unused = SavedItem.objects.filter(
            user=request.user,
            item_type=item_type,
            **{f"{field}_id": item_id}
        ).delete()

        return Response(
            {
                "is_saved": False,
                "removed": bool(deleted_count),
            },
            status=status.HTTP_200_OK
        )
