define(['SBIS3.CONTROLS/BreadCrumbs',
      'SBIS3.CONTROLS/Tree/DataGridView',
      'SBIS3.CONTROLS/Button/BackButton',
      'SBIS3.CONTROLS/ComponentBinder/BreadCrumbsController'
   ],

   function (BreadCrumbs, TreeDataGridView, BackButton, BreadCrumbsController) {

      'use strict';
      var
         breadCrumbsController,
         view,
         bButton,
         breadCrumbs;

      describe('SBIS3.CONTROLS/BreadCrumbsController', function () {
         before(function () {
            if (typeof $ === 'undefined') {
               this.skip();
            }
            var container = $('<div></div>');
            $('#mocha').append(container);

            view = new TreeDataGridView();
            bButton = new BackButton({element: container});
            breadCrumbs = new BreadCrumbs();

            breadCrumbsController = new BreadCrumbsController({
               view: view,
               backButton: bButton,
               breadCrumbs: breadCrumbs
            });

            breadCrumbsController.bindBreadCrumbs();
         });

         beforeEach(function () {
            if (typeof $ === 'undefined') {
               this.skip();
            }
         });

         describe('Подписки на событие', function () {
            it('View', function () {
               assert.isTrue(view.hasEventHandlers('onSetRoot'));
               assert.isTrue(view.hasEventHandlers('onKeyPressed'));
               view.destroy();
               assert.isFalse(view.hasEventHandlers('onSetRoot'));
               assert.isFalse(view.hasEventHandlers('onKeyPressed'));
            });

            it('BackButton', function () {
               assert.isTrue(bButton.hasEventHandlers('onActivated'));
               bButton.destroy();
               assert.isFalse(bButton.hasEventHandlers('onActivated'));
            });

            it('BreadCrumbs', function () {
               assert.isTrue(breadCrumbs.hasEventHandlers('onItemClick'));
               breadCrumbs.destroy();

               assert.isFalse(breadCrumbs.hasEventHandlers('onItemClick'));
            });
         });

      });
   }
);