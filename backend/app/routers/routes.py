from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from ..database import get_db
from ..models.bin import TrashBin
from ..schemas.bin import BinMapResponse
from ..services.route_service import get_optimal_route, calculate_route_stats

router = APIRouter()

@router.get("/optimize")
def optimize_route(municipality_id: UUID, start_lat: float, start_lon: float, db: Session = Depends(get_db)):
    # Fetch bins for this municipality
    bins = db.query(TrashBin).filter(TrashBin.municipality_id == municipality_id).all()
    
    # Convert to MapResponse format
    bin_responses = [BinMapResponse(
        id=b.id,
        latitude=b.latitude,
        longitude=b.longitude,
        status=b.status,
        color_code="red" if b.status in ["full", "overflowing"] else "green",
        name=b.name
    ) for b in bins]
    
    # Get route
    route_data = get_optimal_route(bin_responses, start_lat, start_lon)
    stats = calculate_route_stats(route_data)
    
    return {
        "route": route_data,
        "stats": stats
    }
