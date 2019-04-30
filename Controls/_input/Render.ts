import Env = require('Env/Env');
import Control = require('Core/Control');
import entity = require('Types/entity');
import tmplNotify = require('Controls/Utils/tmplNotify');
import template = require('wml!Controls/_input/Render/Render');


      var Render = Control.extend({
         _template: template,

         /**
          * @type {Boolean} The content has active.
          * @private
          */
         _contentActive: false,

         _notifyHandler: tmplNotify,

         _getState: function(contentActive) {
            if (this._options.readOnly) {
               if (this._options.multiline) {
                  return '_readOnly_multiline';
               }

               return '_readOnly';
            }

            //return "_active" state only for ie and edge. Other browsers can work with :focus-within pseudo selector
            if (contentActive && Env.detection.isIE) {
               return '_active';
            }

            return '';
         },

         _contentFocusInHandler: function() {
            this._contentActive = true;
         },

         _contentFocusOutHandler: function() {
            this._contentActive = false;
         }
      });

      Render._theme = ['Controls/input'];

      Render.getDefaultTypes = function() {
         return {
            content: entity.descriptor(Function).required(),
            afterFieldWrapper: entity.descriptor(Function),
            beforeFieldWrapper: entity.descriptor(Function),
            multiline: entity.descriptor(Boolean).required(),
            roundBorder: entity.descriptor(Boolean).required(),
            size: entity.descriptor(String).oneOf([
               's',
               'm',
               'l',
               'default'
            ]).required(),
            fontStyle: entity.descriptor(String).oneOf([
               'default',
               'primary',
               'secondary'
            ]).required(),
            textAlign: entity.descriptor(String).oneOf([
               'left',
               'right'
            ]).required(),
            style: entity.descriptor(String).required(),
            tagStyle: entity.descriptor(String).oneOf([
               'info',
               'danger',
               'primary',
               'success',
               'warning',
               'secondary'
            ])
         };
      };

      export = Render;

