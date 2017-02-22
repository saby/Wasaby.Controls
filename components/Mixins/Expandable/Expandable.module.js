/**
 * Created by as.avramenko on 07.09.2016.
 */
define('js!SBIS3.CONTROLS.Expandable', ['Core/CommandDispatcher'], function(CommandDispatcher) {

   /**
    * Миксин, добавляющий поведение хранения состояния развернутости
    * @mixin SBIS3.CONTROLS.Expandable
    * @public
    * @author Авраменко Алексей Сергеевич
    */

   var Expandable = /**@lends SBIS3.CONTROLS.Expandable.prototype  */{
       /**
        * @event onExpandedChange При изменении состояния развернутости
        * @param {$ws.proto.EventObject} Дескриптор события.
        * @param {Boolean} expanded Признак состояния:
        * <ul>
        *    <li>true - развернуто;</li>
        *    <li>false - свернуто.</li>
        * </ul>
        * @see expanded
        * @see setExpanded
        * @see toggleExpanded
        * @see isExpanded
        */
      $protected: {
         _options: {
            expandedClassName: 'controls-Expandable_expanded',
            collapsedClassName: 'controls-Expandable_collapsed',
            /**
             * @cfg {Boolean} Состояние развернутости
             * Возмозможные значения:
             * <ul>
             *    <li>true - развернуто;</li>
             *    <li>false - свернуто.</li>
             * </ul>
             * @example
             * <pre>
             *     <option name="expanded">true</option>
             * </pre>
             * @see setExpanded
             * @see toggleExpanded
             * @see isExpanded
             * @see onExpandedChange
             */
            expanded: false
         }
      },

      $constructor: function() {
         this._publish('onExpandedChange');
         CommandDispatcher.declareCommand(this, 'toggleExpanded', this.toggleExpanded);
      },
      /**
       * Устанавливает состояние развернутости.
       * @param {Boolean} expanded Признак состояния кнопки true/false.
       * @see expanded
       * @see toggleExpanded
       * @see isExpanded
       * @see onExpandedChange
       */
      setExpanded: function(expanded) {
         var
            newValue = !!expanded;
         if (this._options.expanded !== newValue) {
            this._options.expanded = newValue;
            this._container
               .toggleClass(this._options.expandedClassName, this._options.expanded)
               .toggleClass(this._options.collapsedClassName, !this._options.expanded);
            this._notify('onExpandedChange', this._options.expanded);
            this._notifyOnPropertyChanged('expanded');
            this._notifyOnSizeChanged();
         }
      },
      /**
       * Инвертирует состояние развернутости.
       * @param {Boolean} expanded Признак состояния кнопки true/false.
       * @see expanded
       * @see setExpanded
       * @see isExpanded
       * @see onExpandedChange
       */
      toggleExpanded: function(expanded) {
         if (expanded !== undefined) {
            this.setExpanded(expanded);
         } else {
            this.setExpanded(!this.isExpanded());
         }
      },
      /**
       * Признак текущего состояния развернутости.
       * Возможные значения:
       * <ul>
       *    <li>true - развернуто;</li>
       *    <li>false - свернуто.</li>
       * </ul>
       * @see expanded
       * @see setExpanded
       * @see toggleExpanded
       * @see onExpandedChange
       */
      isExpanded: function() {
         return this._options.expanded;
      }
   };
   return Expandable;
});
