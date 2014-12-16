class BField:
   def __init__(self, v = None ):
      self._value = v

   def Value(self):
      return self._value;

class IntField(BField):
   pass

class FloatField(BField):
   pass

class BoolField(BField):
   pass

class StringField(BField):
   pass

class UuidField(BField):
   pass

class DateField(BField):
   pass

class TimeField(BField):
   pass

class DateTimeField(BField):
   pass
