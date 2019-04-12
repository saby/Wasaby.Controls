define(['Controls/toggle'], function (toggle) {
   var CB, changeValue, eventValue;
   describe('Controls/Toggle/Checkbox', function () {
      describe('click to checkbox', function () {
         beforeEach(function () {
            CB = new toggle.Checkbox({});
            //subscribe на vdom компонентах не работает, поэтому мы тут переопределяем _notify
            //(дефолтный метод для vdom компонент который стреляет событием).
            //он будет вызван вместо того что стрельнет событием, тем самым мы проверяем что отправили
            //событие и оно полетит с корректными параметрами.
            CB._notify = function (e, value) {
               eventValue = value[0];
               changeValue = false;
               if (e === 'valueChanged') {
                  changeValue = true;
               }
            };
            var opt= {
               value: false
            };
         });

         afterEach(function () {
            CB = undefined;
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