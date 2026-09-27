"""
AI image analysis service. Gracefully handles missing openai package.
When OpenAI API key is not set, returns a simulated confirmed result for local dev.
"""
from ..schemas.report import AIAnalysisResult
from ..models.report import AIVerdictEnum
from ..config import settings
import json
import random


def analyze_bin_image(image_url: str) -> AIAnalysisResult:
    """Analyze trash bin image using GPT-4o Vision. Falls back to simulation if not configured."""
    if not settings.OPENAI_API_KEY:
        # Simulate AI analysis for local development
        confidence = round(random.uniform(0.76, 0.99), 2)
        return AIAnalysisResult(
            verdict=AIVerdictEnum.confirmed,
            confidence=confidence,
            message=f"AI Simulyasiyası: Zibil qutusu dolu görünür (etibar: {confidence})"
        )

    try:
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Analyze this image of a trash bin. Is it full or overflowing? Respond in JSON with keys: 'verdict' (confirmed, rejected, manual_review), 'confidence' (float 0.0-1.0), and 'reason' (string). If it's clearly full or overflowing and you're confident, return confirmed. If it's empty, return rejected. If unsure, return manual_review."},
                        {"type": "image_url", "image_url": {"url": image_url}},
                    ],
                }
            ],
            max_tokens=300,
        )
        content = response.choices[0].message.content
        data = json.loads(content)

        confidence = float(data.get("confidence", 0.0))
        verdict_str = data.get("verdict", "manual_review")

        if confidence > 0.75 and verdict_str == "confirmed":
            verdict = AIVerdictEnum.confirmed
        elif verdict_str == "rejected":
            verdict = AIVerdictEnum.rejected
        else:
            verdict = AIVerdictEnum.manual_review

        return AIAnalysisResult(verdict=verdict, confidence=confidence, message=data.get("reason", ""))
    except ImportError:
        confidence = round(random.uniform(0.76, 0.99), 2)
        return AIAnalysisResult(verdict=AIVerdictEnum.confirmed, confidence=confidence, message="openai paketi qurulmayıb, simulyasiya istifadə olunur")
    except Exception as e:
        print(f"AI Analysis Error: {e}")
        return AIAnalysisResult(verdict=AIVerdictEnum.manual_review, confidence=0.0, message=f"Xəta: {str(e)}")


def analyze_city_problem(image_url: str, report_type: str) -> AIAnalysisResult:
    """Analyze city problem image. Falls back to simulation if not configured."""
    if not settings.OPENAI_API_KEY:
        confidence = round(random.uniform(0.76, 0.99), 2)
        return AIAnalysisResult(
            verdict=AIVerdictEnum.confirmed,
            confidence=confidence,
            message=f"AI Simulyasiyası: Problem təsdiqləndi - {report_type}"
        )

    try:
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f"Analyze this image for the problem: {report_type}. Respond in JSON with keys: 'verdict' (confirmed, rejected, manual_review), 'confidence' (float 0.0-1.0), and 'reason' (string)."},
                        {"type": "image_url", "image_url": {"url": image_url}},
                    ],
                }
            ],
            max_tokens=300,
        )
        content = response.choices[0].message.content
        data = json.loads(content)
        confidence = float(data.get("confidence", 0.0))
        verdict_str = data.get("verdict", "manual_review")

        if confidence > 0.75 and verdict_str == "confirmed":
            verdict = AIVerdictEnum.confirmed
        elif verdict_str == "rejected":
            verdict = AIVerdictEnum.rejected
        else:
            verdict = AIVerdictEnum.manual_review

        return AIAnalysisResult(verdict=verdict, confidence=confidence, message=data.get("reason", ""))
    except ImportError:
        confidence = round(random.uniform(0.76, 0.99), 2)
        return AIAnalysisResult(verdict=AIVerdictEnum.confirmed, confidence=confidence, message="Simulyasiya")
    except Exception as e:
        print(f"AI Analysis Error: {e}")
        return AIAnalysisResult(verdict=AIVerdictEnum.manual_review, confidence=0.0, message=f"Xəta: {str(e)}")
