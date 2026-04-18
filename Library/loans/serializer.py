from rest_framework import serializers
from .models import BorrowRequest

class BorrowRequestSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    
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
        
        # On create, prevent staff from creating requests (they manage, not borrow)
        if not self.instance and request:
            if request.user.is_staff:
                raise serializers.ValidationError("Staff users cannot create borrow requests.")
        
        # On create, prevent duplicate pending/approved requests for same book by same user
        if not self.instance and request:
            book = attrs.get("book")
            if book:
                existing = BorrowRequest.objects.filter(
                    user=request.user,
                    book=book,
                    status__in=["Pending", "Approved"]
                ).exists()
                if existing:
                    raise serializers.ValidationError("You already have a pending or approved request for this book.")
        
        # On update, enforce one-way transition from Pending only
        if self.instance and new_status is not None:
            current_status = self.instance.status
            if current_status in ["Approved", "Rejected"]:
                raise serializers.ValidationError("Final requests cannot be changed.")
            if current_status == "Pending" and new_status not in ["Approved", "Rejected"]:
                raise serializers.ValidationError("Pending request can only become Approved or Rejected.")

        return attrs