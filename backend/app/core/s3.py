"""
S3 storage service. Gracefully handles missing boto3 or credentials.
If S3 is not configured, returns a local placeholder URL.
"""
import uuid
import os
from ..config import settings

def upload_image(file_bytes: bytes, filename: str, content_type: str) -> str:
    """Upload image to S3 or return placeholder URL if not configured."""
    try:
        import boto3
        from botocore.exceptions import NoCredentialsError

        if not settings.AWS_ACCESS_KEY_ID or not settings.AWS_S3_BUCKET:
            print("S3 not configured, using placeholder URL")
            return f"https://placehold.co/400x300/png?text=FixiFy+Photo"

        s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        ext = os.path.splitext(filename)[1] or '.jpg'
        unique_filename = f"{uuid.uuid4()}{ext}"
        try:
            s3.put_object(
                Bucket=settings.AWS_S3_BUCKET,
                Key=unique_filename,
                Body=file_bytes,
                ContentType=content_type,
                ACL='public-read'
            )
            return f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{unique_filename}"
        except NoCredentialsError:
            return f"https://placehold.co/400x300/png?text=FixiFy+Photo"
        except Exception as e:
            print(f"Error uploading to S3: {e}")
            return f"https://placehold.co/400x300/png?text=FixiFy+Photo"
    except ImportError:
        print("boto3 not installed, using placeholder URL")
        return f"https://placehold.co/400x300/png?text=FixiFy+Photo"


def delete_image(url: str):
    """Delete image from S3. Silently skips if not configured."""
    try:
        import boto3
        if not settings.AWS_ACCESS_KEY_ID or not settings.AWS_S3_BUCKET:
            return
        s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        filename = url.split('/')[-1]
        s3.delete_object(Bucket=settings.AWS_S3_BUCKET, Key=filename)
    except Exception as e:
        print(f"Error deleting from S3: {e}")
