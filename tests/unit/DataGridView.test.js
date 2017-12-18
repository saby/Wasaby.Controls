define(['SBIS3.CONTROLS/DataGridView'], function (DataGridView) {
   'use strict';

   describe('SBIS3.CONTROLS/DataGridView', function () {
      // this.timeout(1500000);
      beforeEach(function () {
         if (typeof $ === 'undefined') {
            this.skip();
         }
      });

      describe('._addStickyToGroups', function () {
         let _this, obj;

         beforeEach(function () {
            _this = {
               _options: {
                  stickyHeader: true,
                  groupBy: {notEmpty: ''}
               }
            };
            obj = {data: {}, tpl: 'some tmpl'}
         });

         it('should set stickyHeader field to true', function () {
            DataGridView.prototype._addStickyToGroups.call(_this, [obj]);
            assert.equal(obj.data.stickyHeader, true);
         });
         it('should not set stickyHeader field to true if stickyHeader control option not set', function () {
            _this._options.stickyHeader = false;
            DataGridView.prototype._addStickyToGroups.call(_this, [obj]);
            assert.equal(obj.data.stickyHeader, undefined);
         });
         it('should not set stickyHeader field to true if groupBy control option is empty object', function () {
            _this._options.groupBy = {};
            DataGridView.prototype._addStickyToGroups.call(_this, [obj]);
            assert.equal(obj.data.stickyHeader, undefined);
         });
         it('should not set stickyHeader field to true if groupBy.data control option is not set', function () {
            obj = {tpl: 'some tmpl'};
            DataGridView.prototype._addStickyToGroups.call(_this, [obj]);
            assert.equal(obj.data, undefined);
         });
         it('should not set stickyHeader field to true if groupBy.tpl control option is not set', function () {
            obj = {data: {}};
            DataGridView.prototype._addStickyToGroups.call(_this, [obj]);
            assert.equal(obj.data.stickyHeader, undefined);
         });
      });
   
      describe('._setPartScrollShift', function () {
         it('shift without ratio', function() {
            var dgv = new DataGridView();
            dgv._thumb = $(document.createElement('div'));
            dgv._checkThumbPosition = function(){
               return 0;
            };
            dgv._setPartScrollShift();
            assert.equal(dgv._options._columnsShift, 0);
            dgv.destroy();
         });
      });

   });
});
