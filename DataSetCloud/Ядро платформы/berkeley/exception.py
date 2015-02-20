from sbis import Error

class BerkeleyException( Error ):
    """Исключение при работе с Berkeley DB"""
    
    def __init__( self, details, error_code = -1 ):
        self.details = details
        self.error_code = error_code
      
    def __str__( self ):
        return '{error_code} {details}'.format( classname=__class__, error_code=self.error_code, details=self.details )
    
class BerkeleyBrokenException( BerkeleyException ):
    """Исключение при поломке базы Berkeley DB"""
    pass
    
class BerkeleyNoDiskSpaceException( BerkeleyException ):
    """Исключение при нехватке места на диске во время работы с Berkeley DB"""
    pass
