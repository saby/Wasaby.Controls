Данный механизм позволяет группировать элементы коллекции в списках любых типов. Подробнее о группировках вы
можете прочитать в {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/groups/ этой статье}.
Для правильной работы группировки данные от источника должны поступить {@link sorting отсортированными} по полю группировки (см. подопцию field}.
Если установить только поле группировки field, то все элементы будут сгруппированы по блокам с одинаковыми данными, без отрисовки заголовков групп:
![](/DSMixin09.png)   

Чтобы установить группировку элементов коллекции по типу {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/ladder/ "Лесенка"}, необходимо в опции {@link SBIS3.CONTROLS.DataGridView#ladder}
перечислить названия полей, по которым этот тип группировки будет организован.

Изменить группировку элементов коллекции можно с помощью метода {@link setGroupBy}.
