define(['js!SBIS3.CONTROLS.DataGridView'], function (DataGridView) {
   'use strict';

   describe('SBIS3.CONTROLS.DataGridView', function () {
      // this.timeout(1500000);


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

   });
});
