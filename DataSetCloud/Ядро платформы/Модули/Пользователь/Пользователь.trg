<?xml version="1.0" encoding="WINDOWS-1251"?>
<trigger_library version="1.02">

  <trigger last_changed="Buravlevms" name="УдалитьРевизиюПользователя" responsible="Buravlevms">
    <definition>
      <language>PLPGSQL</language>
      <body>BEGIN
   DELETE FROM "НеактуальныйПользователь" WHERE "Пользователь" = OLD."@Пользователь";
   RETURN NULL;
END;</body>
    </definition>
  </trigger>

</trigger_library>
