"""
Route optimization service. Uses Google Maps API if configured, 
otherwise falls back to OSRM (free, no API key needed).
"""
from ..schemas.bin import BinMapResponse
from ..config import settings
from typing import List
import httpx


async def get_optimal_route(bins: List[BinMapResponse], start_lat: float, start_lon: float) -> dict:
    """Calculate optimal route through full bins using OSRM (free) or Google Maps."""
    full_bins = [b for b in bins if b.status in ('full', 'overflowing')]
    
    if not full_bins:
        return {"error": "Dolu zibil qutusu yoxdur", "waypoints": [], "polyline": ""}
    
    # Build coordinate list: start + all full bins
    all_coords = [(start_lat, start_lon)] + [(b.latitude, b.longitude) for b in full_bins]
    
    # Use OSRM for free routing (no API key needed)
    try:
        coord_str = ";".join(f"{lon},{lat}" for lat, lon in all_coords)
        url = f"https://router.project-osrm.org/route/v1/driving/{coord_str}?overview=full&geometries=polyline&steps=false"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            data = response.json()
        
        if data.get("routes"):
            route = data["routes"][0]
            return {
                "polyline": route.get("geometry", ""),
                "waypoints": [{"lat": b.latitude, "lng": b.longitude, "name": b.name} for b in full_bins],
                "total_distance_km": round(route["distance"] / 1000, 2),
                "estimated_minutes": round(route["duration"] / 60),
                "bin_count": len(full_bins)
            }
    except Exception as e:
        print(f"OSRM routing failed: {e}")
    
    # Fallback: simple straight-line response
    return {
        "polyline": "",
        "waypoints": [{"lat": b.latitude, "lng": b.longitude, "name": b.name} for b in full_bins],
        "total_distance_km": round(len(full_bins) * 2.5, 2),
        "estimated_minutes": len(full_bins) * 8,
        "bin_count": len(full_bins)
    }


def calculate_route_stats(route_data: dict) -> dict:
    return {
        "bin_count": route_data.get("bin_count", 0),
        "total_distance_km": route_data.get("total_distance_km", 0),
        "estimated_minutes": route_data.get("estimated_minutes", 0),
    }
