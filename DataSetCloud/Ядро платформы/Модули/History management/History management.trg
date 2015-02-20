<?xml version="1.0" encoding="WINDOWS-1251"?>
<trigger_library version="1.02">

  <trigger last_changed="Ткачук М.И." name="DenyDelete" responsible="Ткачук М.И.">
    <definition>
      <language>PLPGSQL</language>
      <body>begin
   raise exception 'Запрещено удаление записи истории!';
end</body>
    </definition>
  </trigger>

  <trigger last_changed="Ткачук М.И." name="DenyUpdate" responsible="Ткачук М.И.">
    <definition>
      <language>PLPGSQL</language>
      <body>begin
   raise exception 'Запрещено изменение записи истории!';
end</body>
    </definition>
  </trigger>

</trigger_library>
