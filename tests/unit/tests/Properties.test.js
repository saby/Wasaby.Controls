/**
 * Created by dv.zuev on 18.05.2017.
 */
define([
   'Core/Control',
   'Core/vdom/Synchronizer/resources/SyntheticEvent'
], function (
   Base,
   SyntheticEvent
) {
   'use strict';

   describe('Properties', function () {

      var cfg = {
         enabled: false,
         visible: false
      };

      Base.iWantVDOM = true;
      var baseDis = new Base(cfg);
      var base = new Base({});

      /* Список всех опций
       this._thisIsInstance;
       this._icanrulefocus;
       this._parent;
       this._context;
       this._$independentContext;
       this._$contextRestriction;
       this._$record;
       this._$modal;
       this._$validateIfHidden;
       this._$handleFocusCatch;
       this._$ignoreTabCycles;
       this._$groups;
       this._$currentTemplate;
       this._$isRelativeTemplate;
       this._$children;
       this._$_doGridCalculation;
       this._horizontalAlignment;
       this._pending;
       this._pendingTrace;
       this._waiting;
       this._groupInstances;
       this._activeChildControl;
       this._activatedWithTabindex;
       this._childControls;
       this._childNonControls;
       this._childsMapName;
       this._childsMapId;
       this._childsMapNameCache;
       this._childsMapIdCache;
       this._childContainers;
       this._childsTabindex;
       this._childsSizes;
       this._maxTabindex;
       this._keysWeHandle;
       this._dChildReady;
       this._isInitialized;
       this._isReady;
       this._resizer;
       this._toolbarCount;
       this._defaultButton;
       this._activationIndex;
       this._opener;
       this._isModal;
       this._waitersByName;
       this._waitersById;
       this._onDestroyOpener;
       this._isInitComplete;
       this._prevEnabled;
       this._options;
       this._options.name;
       this._options.sbisname;
       this._options.id;
       this._options.tabIndex;
       this._options.id;
       this._id;
       this._handlers;
       this._subscriptions;
       this._subDestroyControls;
       this._isDestroyed;
       this._childControls;
       this._childContainers;
       this._childsMapId;
       this._childsMapName;
       */

      function assertInitProperties() {
         assert.isTrue(typeof this._thisIsInstance === 'boolean');
         assert.isTrue(this.hasOwnProperty('_parent'));
         assert.isTrue(this.hasOwnProperty('_compatContext'));
         assert.isTrue(typeof this._$independentContext === 'boolean');
         assert.isTrue(this.hasOwnProperty('_$contextRestriction'));
         assert.isTrue(typeof this._$record === 'boolean');
         assert.isTrue(typeof this._$modal === 'boolean');
         assert.isTrue(typeof this._$validateIfHidden === 'boolean');
         assert.isTrue(typeof this._$handleFocusCatch === 'boolean');
         assert.isTrue(typeof this._$ignoreTabCycles === 'boolean');
         assert.isTrue(this.hasOwnProperty('_$groups'));
         assert.isTrue(this.hasOwnProperty('_$currentTemplate'));
         assert.isTrue(typeof this._$isRelativeTemplate === 'boolean');
         assert.isTrue(Array.isArray(this._$children));
         assert.isTrue(typeof this._$_doGridCalculation === 'boolean');
         assert.isTrue(this.hasOwnProperty('_horizontalAlignment'));
         assert.isTrue(Array.isArray(this._pending));
         assert.isTrue(Array.isArray(this._pendingTrace));
         assert.isTrue(Array.isArray(this._waiting));
         assert.isTrue(this.hasOwnProperty('_groupInstances'));
         assert.isTrue(this.hasOwnProperty('_activeChildControl'));
         assert.isTrue(this.hasOwnProperty('_activatedWithTabindex'));
         assert.isTrue(Array.isArray(this._childControls));
         assert.isTrue(Array.isArray(this._childNonControls));
         assert.isTrue(this.hasOwnProperty('_childsMapName'));
         assert.isTrue(this.hasOwnProperty('_childsMapId'));
         assert.isTrue(this.hasOwnProperty('_childsMapNameCache'));
         assert.isTrue(this.hasOwnProperty('_childsMapIdCache'));
         assert.isTrue(Array.isArray(this._childContainers));
         assert.isTrue(this.hasOwnProperty('_childsTabindex'));
         assert.isTrue(this.hasOwnProperty('_childsSizes'));
         assert.isTrue(this.hasOwnProperty('_maxTabindex'));
         assert.isTrue(typeof this._keysWeHandle === "object");
         assert.isTrue(this.hasOwnProperty('_dChildReady'));
         assert.isTrue(this._isInitialized === true);
         assert.isTrue(this._isReady === true);
         assert.isTrue(this.hasOwnProperty('_resizer'));
         assert.isTrue(this.hasOwnProperty('_toolbarCount'));
         assert.isTrue(this.hasOwnProperty('_defaultButton'));
         assert.isTrue(this.hasOwnProperty('_activationIndex'));
         assert.isTrue(this.hasOwnProperty('_opener'));
         assert.isTrue(this.hasOwnProperty('_isModal'));
         assert.isTrue(this.hasOwnProperty('_waitersByName'));
         assert.isTrue(this.hasOwnProperty('_waitersById'));
         assert.isTrue(this.hasOwnProperty('_onDestroyOpener'));
         assert.isTrue(this.hasOwnProperty('_isInitComplete'));
         assert.isTrue(this.hasOwnProperty('_prevEnabled'));
         assert.isTrue(this.hasOwnProperty('_options'));
         assert.isTrue(this.hasOwnProperty('_handlers'));
         assert.isTrue(Array.isArray(this._subscriptions));
         assert.isTrue(Array.isArray(this._subDestroyControls));
         assert.isTrue(this._isDestroyed === false);
         assert.isTrue(Array.isArray(this._childControls));
         assert.isTrue(Array.isArray(this._childContainers));
         assert.isTrue(this.hasOwnProperty('_childsMapId'));
         assert.isTrue(this.hasOwnProperty('_childsMapName'));
      };

      function assertAllEventsPublished() {
         var self = this;
         var allEvents = ['onInit', 'onInitComplete', 'onReady', 'onDestroy', 'onChange', 'onKeyPressed', 'onClick', 'onFocusIn',
               'onFocusOut', 'onStateChanged', 'onTooltipContentRequest', 'onPropertyChanged', 'onPropertiesChanged',
               'onCommandCatch', 'onResize', 'onActivate', 'onBeforeShow', 'onAfterShow', 'onBeforeLoad',
               'onAfterLoad', 'onBeforeControlsLoad', 'onBatchFinished'],
            allExists = true;

         allEvents.forEach(function(item) {
            if(!self.hasEvent(item)) {
               allExists = false;
            }
         })
         assert.isTrue(allExists);
      }

      describe('VDom API for Control', function(){
         beforeEach(function () {
            if (typeof $ === 'undefined') {
               this.skip();
            }
         });
         it('propertiesInit', function(done) {
            var testBase = new Base({});
            assertInitProperties.call(testBase);
            done();
         });

         it('eventsPublished', function(done) {
            var testBase = new Base({});
            assertAllEventsPublished.call(testBase);
            done();
         });

      });

   });

});
