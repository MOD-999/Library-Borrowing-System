from rest_framework import serializers
from .models import BorrowRequest, statusChoices

class BorrowRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BorrowRequest
        fields = "__all__"
        read_only_fields = ['user', 'request_date']
    
    def validate_book(self, value):
        if not value.is_available:
            raise serializers.ValidationError("This book is currently not available for borrowing.")
        return value

    def validate(self, attrs):
        request = self.context.get("request")
        new_status = attrs.get("status")

        # Only staff can change status
        if new_status is not None and request and not request.user.is_staff:
            raise serializers.ValidationError("Only staff can change request status.")
        
        # On update, enforce one-way transition from Pending only
        if self.instance and new_status is not None:
            current_status = self.instance.status
            if current_status in [statusChoices.A, statusChoices.R]:
                raise serializers.ValidationError("Final requests cannot be changed.")
            if current_status == statusChoices.P and new_status not in [statusChoices.A, statusChoices.R]:
                raise serializers.ValidationError("Pending request can only become Approved or Rejected.")

        return attrs