define(['js!Controls/Toggle/Checkbox'], function (Checkbox) {
   var CB, changeValue, eventValue;
   describe('SBIS3.CONTROLS/Checkbox', function () {
      describe('click to checkbox', function () {
         beforeEach(function () {
            CB = new Checkbox({});
            changeValue = false;
            CB.subscribe('valueChanged', function (e, value) {
               eventValue = value;
               changeValue = true;
            });
            var opt= {
               value: false
            };
         });

         afterEach(function () {
            CB.destroy();
            changeValue = undefined;
            eventValue = undefined;
         });

         it('checkbox no select => select, tristate false', function () {
            var opt= {
               value: false,
               triState: false
            };
            CB.saveOptions(opt);
            CB._clickHandler();
            assert(changeValue && eventValue === true);
         });

         it('checkbox select => not select, tristate false', function () {
            var opt= {
               value: true,
               triState: false
            };
            CB.saveOptions(opt);
            CB._clickHandler();
            assert(changeValue && eventValue === false);
         });

         it('checkbox not select => select, tristate true', function () {
            var opt= {
               value: false,
               triState: true
            };
            CB.saveOptions(opt);
            CB._clickHandler();
            assert(changeValue && eventValue === true);
         });

         it('checkbox select => triState, tristate true', function () {
            var opt= {
               value: true,
               triState: true
            };
            CB.saveOptions(opt);
            CB._clickHandler();
            assert(changeValue && eventValue === null);
         });

         it('checkbox in triState => not select, tristate true', function () {
            var opt= {
               value: null,
               triState: true
            };
            CB.saveOptions(opt);
            CB._clickHandler();
            assert(changeValue && eventValue === false);
         });
      });
   });
});