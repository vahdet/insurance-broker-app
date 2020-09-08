""" Auxiliary Functions """
from urllib.parse import urlencode
from typing import List
import asyncio
import aiohttp
import config
from geopy.distance import geodesic


async def fetch(session, agency):
    """ Async Fetch """
    async with session.get(agency.get('url')) as response:
        result = await response.json()
        first_item = next(iter(result.get('items') or []), None)
        position = first_item.get('position', None) if first_item else None
        return {
            'id': agency.get('id'),
            'position': position
        }


async def dispatch(agencies: List[dict]):
    """ Dispatch the requests to the URLs """
    async with aiohttp.ClientSession() as session:
        return await asyncio.gather(
            *[fetch(session, agency) for agency in agencies],
            return_exceptions=True
        )


def calculate_agency(broker_address: str, agencies: List[dict]) -> str:
    """ Find agency among the matching agencies based on the broker address """
    if not agencies:
        return None
    # Agency URL prep
    for agency in agencies:
        qs = urlencode({'q': agency.get('address'),
                        'apiKey': config.GEOCODING_API.get('key')})
        agency.update(
            {'url': f'https://geocode.search.hereapi.com/v1/geocode?{qs}'})
    # Broker URL prep
    broker_qs = urlencode(
        {'q': broker_address, 'apiKey': config.GEOCODING_API.get('key')})
    brokers = [{
        'id': 0,
        'address': broker_address,
        'url': f'https://geocode.search.hereapi.com/v1/geocode?{broker_qs}'
    }]
    # Make API calls and gather results
    agencies_geocoding_results = asyncio.run(
        dispatch(agencies)) or []
    broker_geocoding_results = asyncio.run(dispatch(brokers)) or []
    broker_geocoding_result = next(iter(broker_geocoding_results), None)

    for agency in agencies_geocoding_results:
        broker_pos = (broker_geocoding_result.get('position').get(
            'lat'), broker_geocoding_result.get('position').get('lng'))
        agency_pos = (
            agency.get('position').get('lat'),
            agency.get('position').get('lng')
        )
        dist = geodesic(broker_pos, agency_pos)
        agency.update({'distance': dist.miles})

    closest_agency = min(
        agencies_geocoding_results,
        key=lambda a: a.get('distance')
    )
    return closest_agency.get('id', None)
