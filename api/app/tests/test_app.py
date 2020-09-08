""" App Tests """
import utils.functions as f

def test_geocoding_1() -> None:
    """ Test """
    broker_address = '1710 Berryessa Rd Ste 102, San Jose, CA 95133'
    matching_agencies = [
        {'id': 1, 'address': '4418 N Rancho Dr, Las Vegas, NV 89130'}
    ]
    result = f.calculate_agency(broker_address, matching_agencies)
    assert result

def test_geocoding_2() -> None:
    """ Test """
    broker_address = '175 Paoakalani Ave, Honolulu, HI 96815'
    matching_agencies = []
    result = f.calculate_agency(broker_address, matching_agencies)
    assert not result

def test_geocoding_3() -> None:
    """ Test """
    broker_address = '320 Bayshore Blvd, San Francisco, CA 94124'
    matching_agencies = [
        {'id': 3, 'address': '876 Geary St, San Francisco, CA 94109'},
        {'id': 4, 'address': '148 W 72nd St, New York, NY 10023'},
        {'id': 5, 'address': '1575 SW 8th St, Miami, FL 33135'}
    ]
    result = f.calculate_agency(broker_address, matching_agencies)

    assert result
