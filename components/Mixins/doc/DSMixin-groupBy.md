Данный механизм позволяет группировать элементы коллекции в любых списках.
Подробнее о группировках вы можете прочитать в <a href='/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/groups/index/'>этой статье</a>.
Чтобы группировка работал правильно, данные должны поступить {@link sorting отсортированными} по полю группировки (см. подопцию field}.
Если установить только поле группировки field, то все элементы будут сгруппированы по блокам с одинаковыми данными, без отрисовки заголовков групп:
![](/DSMixin09.png)   

Чтобы установить группировку элементов коллекции по типу {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/list-visual-display/ladder/ "Лесенка"}, необходимо в опции {@link SBIS3.CONTROLS.DataGridView#ladder}
перечислить названия полей, по которым этот тип группировки будет организован.

Изменить группировку элементов коллекции можно с помощью метода {@link setGroupBy}.
