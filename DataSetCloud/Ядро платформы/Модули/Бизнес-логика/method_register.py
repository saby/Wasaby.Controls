import sbis
class MethodRegister( object ):

   method_dict = dict()

   @staticmethod
   def register_method( name_object, name_method ):
      if name_method and name_object:
         MethodRegister.method_dict[ name_object ] = name_method
         return True
      else:
         if name_method:
            sbis.ErrorMsg( 'При регистрации в реестре методов истории не передан объект истории' )
         else:
            sbis.ErrorMsg( 'При регистрации в реестре методов истории не передано имя метода' )

   @staticmethod
   def get_method( name_object ):
      if len( MethodRegister.method_dict ):
         if name_object in MethodRegister.method_dict:
            return MethodRegister.method_dict[ name_object ]
         else:
            sbis.ErrorMsg( 'Объект "' + name_object + '" не зарегистрирован в реестре методов')
      else:
         sbis.ErrorMsg( 'В реестре методов не зарегистрирован ни один объект.')

      return None
