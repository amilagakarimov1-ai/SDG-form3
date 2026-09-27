"""
Push notification service. Gracefully handles missing firebase_admin.
"""
from ..config import settings

_firebase_initialized = False


def _init_firebase():
    global _firebase_initialized
    if _firebase_initialized:
        return True
    try:
        import firebase_admin
        from firebase_admin import credentials
        if settings.FIREBASE_CREDENTIALS_PATH:
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)
            _firebase_initialized = True
            return True
    except ImportError:
        print("firebase_admin not installed, push notifications disabled")
    except Exception as e:
        print(f"Failed to initialize Firebase: {e}")
    return False


def send_push(fcm_token: str, title: str, body: str, data: dict = None) -> bool:
    if not fcm_token or not _init_firebase():
        return False
    try:
        from firebase_admin import messaging
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            data=data or {},
            token=fcm_token,
        )
        messaging.send(message)
        return True
    except Exception as e:
        print(f"Failed to send push notification: {e}")
        return False


def send_to_many(tokens: list, title: str, body: str, data: dict = None) -> bool:
    if not tokens or not _init_firebase():
        return False
    try:
        from firebase_admin import messaging
        message = messaging.MulticastMessage(
            notification=messaging.Notification(title=title, body=body),
            data=data or {},
            tokens=tokens,
        )
        messaging.send_multicast(message)
        return True
    except Exception as e:
        print(f"Failed to send multicast push notification: {e}")
        return False
