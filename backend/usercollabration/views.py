from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from accounts.models import User
from profiles.models import UserProfile
from rest_framework.response import Response
from rest_framework import status
from . import serializers
from .models import CollabrationPost
import datetime

# Create your views here.

# it manage al the funtionality of sending and gettiong post data and prediction
class CollabrationView(APIView):
    permission_classes = [IsAuthenticated]

    # fetch all post from db 
    def get(self, request):
        posts = CollabrationPost.objects.all()

        filter_type = request.GET.get('filter_type')
        sort = request.GET.get('sort')

        
        final_data = []


        

        if not posts.exists():
            return Response(
                {"message": "No Collaboration Added Yet!"},
                status=status.HTTP_204_NO_CONTENT
            )

        
        posts = CollabrationPost.objects.all()


        if filter_type == "Hackathon":
            posts = posts.filter(event_type="Hackathon")

        elif filter_type == "Side Project":
            posts = posts.filter(event_type="Side Project")

        elif filter_type == "Open Source":
            posts = posts.filter(event_type="Open Source")

        elif filter_type == "My Post":
            posts = posts.filter(user=request.user)
        

        if sort == "Latest":
            posts = posts.order_by("-post_date")

        serializer = serializers.FetchPostSerializer(posts, many=True)
        # print('dfksjldkfj')

        for i in serializer.data:
            temp = i
            udata = User.objects.get(id=i['user'])
            pdata = UserProfile.objects.get(user_id=i['user'])
            temp['owner_name'] = f"{pdata.firstname} {pdata.lastname}"
            temp['owner_pic_url'] = pdata.profile_pic

            # to send user name which is unique
            temp['owner_user_name'] = udata.username
            final_data.append(temp)

            

        return Response(final_data, status=status.HTTP_200_OK)
    
    def post(self,request):
        try:
            udata = User.objects.get(id = request.user.id)
            serializer = serializers.AddPostSerializer(data=request.data)
            print(request.data)
            if serializer.is_valid():
                serializer.save(user=udata)
                return Response("created",status.HTTP_201_CREATED)
            else:
                # print(serializer.errors)
                return Response(serializer.errors,status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return("UnAuthorized",status.HTTP_401_UNAUTHORIZED)



