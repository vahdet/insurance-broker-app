""" Tests """
import utils.functions as f

def test_check_password() -> None:
    """ Test """
    assert f.check_password('admin', 'admin')
    assert not f.check_password('ADMIN', 'ADMIN')
    assert not f.check_password('admin', 'iampass')
