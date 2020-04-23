/* eslint-disable */
define('Controls/interface/IPromisedSelectable', [
], function() {

   /**
    * Интерфейс для поддержки выбора элементов в списках, где одновременно можно выбрать несколько элементов и количество выбранных элементов неизвестно. Этот интерфейс подходит для деревьев или списков с бесконечным скроллом, где пользователь может выбрать элементы, которые еще не загружены (например, через Панель управления).
    * @interface Controls/interface/IPromisedSelectable
    * @public
    * @author Авраменко А.С.
    * @see Controls/_interface/ISingleSelectable
    * @see Controls/interface/IMultiSelectable
    */

   /*
    * Interface for item selection in lists where multiple items can be selected at a time and the number of selected items is unknown. This interface is suitable for trees or lists with infinite scrolling where user can select items which are not loaded yet (e.g. through operations panel).
    * @interface Controls/interface/IPromisedSelectable
    * @public
    * @author Авраменко А.С.
    * @see Controls/_interface/ISingleSelectable
    * @see Controls/interface/IMultiSelectable
    */

   /**
    * @typedef {Object} Selection
    * @property {Array.<Number|String>} selection.selected Массив выбранных ключей.
    * @property {Array.<Number|String>} selection.excluded Массив исключенных ключей.
    * @see Controls/_interface/ISource#keyProperty
    * @see selectedKeys
    * @see excludedKeys
    */

   /*
    * @typedef {Object} Selection
    * @property {Array.<Number|String>} selection.selected Array of selected keys.
    * @property {Array.<Number|String>} selection.excluded Array of excluded keys.
    * @see Controls/_interface/ISource#keyProperty
    * @see selectedKeys
    * @see excludedKeys
    */

   /**
    * @name Controls/interface/IPromisedSelectable#selectedKeys
    * @cfg {Array.<Number|String>} Массив ключей выбранных элементов.
    * @remark
    * См. <a href="/materials/Controls-demo/app/Controls-demo%2FList%2FList%2FMultiselectPG">демо-пример</a>
    * @default []
    * @remark
    * Чтобы выбрать все элементы внутри узла, необходимо в selectedKeys передать значение {@link Controls/_interface/ISource#keyProperty keyProperty} этого узла.
    * Чтобы выбрать все элементы, необходимо в selectedKeys передать [null].
    * @example
    * В следующем примере создается список и выбираются все элементы, кроме двух. Последующие изменения, внесенные в selectedKeys и excludedKeys, будут синхронизированы посредством биндинга.
    * TMPL:
    * <pre>
    *    <Controls.operations:Controller bind:selectedKeys="_selectedKeys" bind:excludedKeys="_excludedKeys" />
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKeys = [null];
    *       this._excludedKeys = [1, 2];
    *    }
    * </pre>
    * @see Controls/_interface/ISource#keyProperty
    * @see excludedKeys
    * @see selectedKeysChanged
    */

   /*
    * @name Controls/interface/IPromisedSelectable#selectedKeys
    * @cfg {Array.<Number|String>} Array of selected items' keys.
    * <a href="/materials/Controls-demo/app/Controls-demo%2FList%2FList%2FMultiselectPG">Example</a>.
    * @default []
    * @remark
    * You can pass node's {@link Controls/_interface/ISource#keyProperty key property} to select every item inside that node. To select every item in the list you should pass [null].
    * @example
    * The following example creates List and selects everything except two items. Subsequent changes made to selectedKeys and excludedKeys will be synchronized through binding mechanism.
    * TMPL:
    * <pre>
    *    <Controls.operations:Controller bind:selectedKeys="_selectedKeys" bind:excludedKeys="_excludedKeys" />
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKeys = [null];
    *       this._excludedKeys = [1, 2];
    *    }
    * </pre>
    * @see Controls/_interface/ISource#keyProperty
    * @see excludedKeys
    * @see selectedKeysChanged
    */

   /**
    * @name Controls/interface/IPromisedSelectable#excludedKeys
    * @cfg {Array.<Number|String>} Набор ключей элементов, которые должны быть исключены из выборки.
    * @remark
    * См. <a href="/materials/Controls-demo/app/Controls-demo%2FList%2FList%2FMultiselectPG">демо-пример</a>
    * @default []
    * @remark
    * Узел будет отмечен как частично выбранный, если ключ любого из его дочерних элементов находится в excludedKeys. Такие узлы обычно отображаются с флагом в неопределенном состоянии рядом с ними.
    * @example
    * В следующем примере создается список и выбираются все элементы, кроме двух. Последующие изменения, внесенные в selectedKeys и excludedKeys, будут синхронизированы посредством биндинга.
    * TMPL:
    * <pre>
    *    <Controls.operations:Controller bind:selectedKeys="_selectedKeys" bind:excludedKeys="_excludedKeys" />
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKeys = [null];
    *       this._excludedKeys = [1, 2];
    *    }
    * </pre>
    * @see Controls/_interface/ISource#keyProperty
    * @see selectedKeys
    * @see excludedKeysChanged
    */

   /*
    * @name Controls/interface/IPromisedSelectable#excludedKeys
    * @cfg {Array.<Number|String>} Array of keys of items that should be excluded from the selection.
    * <a href="/materials/Controls-demo/app/Controls-demo%2FList%2FList%2FMultiselectPG">Example</a>.
    * @default []
    * @remark
    * A node will be marked as partially selected if key of any of its children is in excludedKeys. Partially selected nodes are usually rendered with checkbox in indeterminate state near them.
    * @example
    * The following example creates List and selects everything except two items. Subsequent changes made to selectedKeys and excludedKeys will be synchronized through binding mechanism.
    * TMPL:
    * <pre>
    *    <Controls.operations:Controller bind:selectedKeys="_selectedKeys" bind:excludedKeys="_excludedKeys" />
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKeys = [null];
    *       this._excludedKeys = [1, 2];
    *    }
    * </pre>
    * @see Controls/_interface/ISource#keyProperty
    * @see selectedKeys
    * @see excludedKeysChanged
    */

   /**
    * @event Controls/interface/IPromisedSelectable#selectedKeysChanged Происходит при изменении набора выбранных элементов списка.
    * <a href="/materials/Controls-demo/app/Controls-demo%2FList%2FList%2FMultiselectPG">Example</a>.
    * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
    * @param {Array.<Number|String>} keys Массив ключей выбранных элементов.
    * @param {Array.<Number|String>} added Массив ключей, добавленных в selectedKeys.
    * @param {Array.<Number|String>} deleted Массив ключей, удаленных из selectedKeys.
    * @remark
    * Важно помнить, что мы не мутируем массив selectedKeys из опций. Таким образом, ключи в аргументах события и selectedKeys в параметрах компонента не являются одним и тем же массивом.
    * @example
    * В следующем примере создается список с пустым выбором. Последующие изменения, внесенные в selectedKeys и excludedKeys, будут синхронизированы посредством биндинга. Источник панели операций будет обновляться при каждом изменении в selectedKeys.
    * TMPL:
    * <pre>
    *    <Controls.operations:Controller on:selectedKeysChanged="onSelectedKeysChanged()" bind:selectedKeys="_selectedKeys" bind:excludedKeys="_excludedKeys">
    *       <Controls.operations:Panel source="{{ _panelSource }} />
    *    </Controls.operations:Controller>
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKeys = [];
    *       this._excludedKeys = [];
    *    },
    *    onSelectedKeysChanged: function(e, selectedKeys, added, deleted) {
    *       this._panelSource = this._getPanelSource(selectedKeys); //Note that we simultaneously have event handler and bind for the same option, so we don't have to update state manually.
    *    }
    * </pre>
    * @see selectedKeys
    */

   /*
    * @event Controls/interface/IPromisedSelectable#selectedKeysChanged Occurs when selection was changed.
    * <a href="/materials/Controls-demo/app/Controls-demo%2FList%2FList%2FMultiselectPG">Example</a>.
    * @param {Vdom/Vdom:SyntheticEvent} eventObject Descriptor of the event.
    * @param {Array.<Number|String>} keys Array of selected items' keys.
    * @param {Array.<Number|String>} added Array of keys added to selectedKeys.
    * @param {Array.<Number|String>} deleted Array of keys deleted from selectedKeys.
    * @remark
    * It's important to remember that we don't mutate selectedKeys array from options (or any other option). So keys in the event arguments and selectedKeys in the component's options are not the same array.
    * @example
    * The following example creates List with empty selection. Subsequent changes made to selectedKeys and excludedKeys will be synchronized through binding mechanism. Source of the operations panel will be updated every time selectedKeys change.
    * TMPL:
    * <pre>
    *    <Controls.operations:Controller on:selectedKeysChanged="onSelectedKeysChanged()" bind:selectedKeys="_selectedKeys" bind:excludedKeys="_excludedKeys">
    *       <Controls.operations:Panel source="{{ _panelSource }} />
    *    </Controls.operations:Controller>
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKeys = [];
    *       this._excludedKeys = [];
    *    },
    *    onSelectedKeysChanged: function(e, selectedKeys, added, deleted) {
    *       this._panelSource = this._getPanelSource(selectedKeys); //Note that we simultaneously have event handler and bind for the same option, so we don't have to update state manually.
    *    }
    * </pre>
    * @see selectedKeys
    */

   /**
    * @event Controls/interface/IPromisedSelectable#excludedKeysChanged Происходит при изменении набора исключенных из выбора элементов списка.
    * <a href="/materials/Controls-demo/app/Controls-demo%2FList%2FList%2FMultiselectPG">Example</a>.
    * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
    * @param {Array.<Number|String>} keys Набор ключей элементов, которые должны быть исключены из выборки.
    * @param {Array.<Number|String>} added Массив ключей, добавленных в excludedKeys.
    * @param {Array.<Number|String>} deleted Массив ключей, удаленных из excludedKeys.
    * @remark
    * Важно помнить, что мы не мутируем массив selectedKeys из опций. Таким образом, ключи в аргументах события и selectedKeys в параметрах компонента не являются одним и тем же массивом.
    * @example
    * В следующем примере создается список с пустым выбором. Последующие изменения, внесенные в selectedKeys и excludedKeys, будут синхронизированы посредством биндинга. Источник панели операций будет обновляться при каждом изменении в excludedKeys.
    * TMPL:
    * <pre>
    *    <Controls.operations:Controller on:excludedKeysChanged="onExcludedKeysChanged()" bind:selectedKeys="_selectedKeys" bind:excludedKeys="_excludedKeys">
    *       <Controls.operations:Panel source="{{ _panelSource }} />
    *    </Controls.operations:Controller>
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKeys = [];
    *       this._excludedKeys = [];
    *    },
    *    onExcludedKeysChanged: function(e, excludedKeys, added, deleted) {
    *       this._panelSource = this._getPanelSource(excludedKeys); //Note that we simultaneously have event handler and bind for the same option, so we don't have to update state manually.
    *    }
    * </pre>
    * @see excludedKeys
    */

   /*
    * @event Controls/interface/IPromisedSelectable#excludedKeysChanged Occurs when selection was changed.
    * <a href="/materials/Controls-demo/app/Controls-demo%2FList%2FList%2FMultiselectPG">Example</a>.
    * @param {Vdom/Vdom:SyntheticEvent} eventObject Descriptor of the event.
    * @param {Array.<Number|String>} keys Array of keys of items that should be excluded from the selection.
    * @param {Array.<Number|String>} added Array of keys added to excludedKeys.
    * @param {Array.<Number|String>} deleted Array of keys deleted from excludedKeys.
    * @remark
    * It's important to remember that we don't mutate excludedKeys array from options (or any other option). So keys in the event arguments and excludedKeys in the component's options are not the same array.
    * @example
    * The following example creates List with empty selection. Subsequent changes made to selectedKeys and excludedKeys will be synchronized through binding mechanism. Source of the operations panel will be updated every time excludedKeys change.
    * TMPL:
    * <pre>
    *    <Controls.operations:Controller on:excludedKeysChanged="onExcludedKeysChanged()" bind:selectedKeys="_selectedKeys" bind:excludedKeys="_excludedKeys">
    *       <Controls.operations:Panel source="{{ _panelSource }} />
    *    </Controls.operations:Controller>
    * </pre>
    * JS:
    * <pre>
    *    _beforeMount: function() {
    *       this._selectedKeys = [];
    *       this._excludedKeys = [];
    *    },
    *    onExcludedKeysChanged: function(e, excludedKeys, added, deleted) {
    *       this._panelSource = this._getPanelSource(excludedKeys); //Note that we simultaneously have event handler and bind for the same option, so we don't have to update state manually.
    *    }
    * </pre>
    * @see excludedKeys
    */

});
