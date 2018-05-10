define('Controls-demo/MiniCard/MiniCard',
   [
      'Core/Control',
      'tmpl!Controls-demo/MiniCard/MiniCard'
   ],
   function(Control, template) {

      'use strcit';

      var name = ['Maxim', 'Andrei', 'Valera'];

      var MiniCard = Control.extend({
         _template: template,

         _mouseenterHandler: function(event) {
            this._children.miniCard.open({
               target: event.target
            }, 'hover');
         },

         _open: function() {
            var activeTarget = this._children[name[Math.floor(Math.random() * name.length)]];

            this._activeTarget = activeTarget.name;
            this._children.miniCard.open({
               target: activeTarget
            });
         },

         _close: function() {
            this._children.miniCard.close();
         }
      });

      return MiniCard;
   }
);