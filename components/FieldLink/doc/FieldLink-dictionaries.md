Справочник - это диалог выбора значений. Набор значений диалога строится на основе любого компонента,
который можно использовать для {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/ отображения данных в списках}.

Подробнее об опциях справочника вы можете прочитать {@link SBIS3.CONTROLS.FieldLink/Dictionaries.typedef здесь}.

Открыть справочник можно через меню выбора справочников или с помощью метода {@link showSelector}.
Когда для поля связи установлен только один справочник, клик по кнопке меню производит его открытие.
Когда для поля связи установлено несколько справочников, клик по кнопке меню открывает подменю для выбора нужного справочника.

Опишем основные шаги в настройке справочника для поля связи:

1. Организуем компонент, на основе которого будет построен набор значений диалога выбора для поля связи.
   Компонент, который будет использован для построения диалога выбора значений, как правило строится на основе списочных контролов.
   Например, {@link https://wi.sbis.ru/docs/3-8-0/SBIS3/CONTROLS/DataGridView/ DataGridView} или {@link https://wi.sbis.ru/docs/3-8-0/SBIS3/CONTROLS/TreeDataGridView/ TreeGridView}. Его настройки не требуют какой-то специфики.
   
2. Для организованного компонента:
   1. {@link https://wi.sbis.ru/doc/platform/developmentapl/workdata/binding-data-and-views/ Определим} и {@link https://wi.sbis.ru/doc/platform/developmentapl/workdata/logicworkapl/logic/source/ зададим} источник данных.
   2. Определим режим выбора записей: единичный или множественный.
      Если поле связи будет установлено в режим единичного выбора значений, списочный контрол также следует
      установить в тот же режим работы. Выбор значения будет производиться кликом по нужному элементу списка.
      Если поле связи будет установлено в режим множественного выбора значений, списочный контрол также следует
      установить в тот же режим работы с помощью опции {@link multiselect}.
      Чтобы передать в поле связи набор выбранных значений в режиме множественного выбора, можно использовать
      обработчик на событие клика по кнопке. В качестве кнопки используют различные классы.
      Например, для {@link SBIS3.CONTROLS.Button} обработчик должен выглядеть следующим образом:
      <pre>
          this.getChildControlByName('Button').subscribe('onActivated', function() {
             self.sendCommand('close', MyDataGridView.getSelectedKeys());  // Вторым аргументом передаём набор идентификаторов выбранных элементов
          });
      </pre>
      Чтобы кнопка выбора была удобно размещена в верхней части всплывающей панели, в вёрстке компонента
      нужно использовать контейнер с классом "ws-window-titlebar-custom". Это внутренний CSS-класс. В
      содержимое контейнера можно разместить контролы, которые будут отображены над содержимым списка.
      <pre class="brush: xml">
         <div class="ws-window-titlebar-custom"> <!-- На данный элемент установлен служебный CSS-класс, который прижимает его к верху диалога выбора -->
            <component data-component="SBIS3.CONTROLS.Button" name="SelectButton" class="controls-demo-FieldLinkDemoTemplate__SelectButton"> <!-- Конфигурация кнопки, используется для подтверждения выбранных значений -->
               <option name="caption">Выбрать</option> <!-- Устанавливаем подпись на кнопке -->
            </component>
         </div>
      </pre>
	  
3. Настраиваем справочник в поле связи. Организованный компонент указываем в опции {@link SBIS3.CONTROLS.FieldLink/Dictionaries.typedef template}:
   <pre class="brush: xml">
       <options name="dictionaries" type="array">
          <options>
             <option name="template">js!SBIS3.MyArea.MyDict01</option>
             . . .
          </options>
       </options>
   </pre>
   
Когда для поля связи требуется выбор данных из нескольких справочников, нужно организовать несколько компонентов.
В настройках справочников для поля связи, в опции {@link SBIS3.CONTROLS.FieldLink/Dictionaries.typedef caption} для каждого компонента следует указать название,
которое определит его название в меню выбора нужного справочника:
<pre class="brush: xml">
    <options name="dictionaries" type="array">
       <options>
          <option name="caption">Филиал 1</option>
          <option name="template">js!SBIS3.MyArea.MyDict01</option>
          . . .
       </options>
       <options>
          <option name="caption">Филиал 2</option>
          <option name="template">js!SBIS3.MyArea.MyDict02</option>
          . . .
       </options>
    </options>
</pre>

Открывается справочник либо в новом окне, либо во всплывающей панели; нужный режим можно
установить с помощью опции {@link chooserMode}.
Установить набор справочников для поля связи можно с помощью метода {@link setDictionaries}.
