from rest_framework import serializers
from .models import BorrowRequest

class BorrowRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BorrowRequest
        fields = "__all__"
        read_only_fields = ['user', 'request_date']
    
    def validate_book(self, value):
        if not value.is_available:
            raise serializers.ValidationError("This book is currently not available for borrowing.")
        return value

    def validate_status(self, value):
        request = self.context.get("request")
        if request and not request.user.is_staff:
            raise serializers.ValidationError("Only staff can change request status.")
        return value