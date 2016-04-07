Механизм группировки позволяет группировать элементы коллекции в списках любых типов. Подробнее о группировках вы
можете прочитать в {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/groups/ этой статье}.
Для правильной работы группировки данные должны прийти уже {@link sorting отсортированными} по полю группировки field.
Если установить только поле группировки field, то все элементы будут просто сгруппированы по блокам с одинаковыми
данными, без отрисовки заголовков групп:
![](/DSMixin09.png)   

Для группировки элементов коллекции по типу {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/ladder/ "Лесенка"} -
когда одинаковые значения будут скрыты, необходимо в опции {@link SBIS3.CONTROLS.DataGridView#ladder}
перечислить названия полей, по которым лесенка будет организована.
