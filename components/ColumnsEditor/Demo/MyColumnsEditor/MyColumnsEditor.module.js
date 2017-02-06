define('js!SBIS3.CONTROLS.Demo.MyColumnsEditor', [
      'js!SBIS3.CORE.CompoundControl',
      'js!WS.Data/Collection/RecordSet',
      'tmpl!SBIS3.CONTROLS.Demo.MyColumnsEditor',
      'css!SBIS3.CONTROLS.Demo.MyColumnsEditor',
      'js!SBIS3.CONTROLS.Browser'
   ], function(CompoundControl, RecordSet, dotTplFn) {

      var
         moduleClass = CompoundControl.extend({
            _dotTplFn: dotTplFn,

            $protected: {
               _options: {
                  columns: []
               }
            },

            _modifyOptions: function () {
               var
                  cfg = moduleClass.superclass._modifyOptions.apply(this, arguments);
               cfg._columns = [
                  {
                     title: 'id',
                     field: 'id'
                  },
                  {
                     title: 'title',
                     field: 'title'
                  }
               ];
               cfg._items = [
                  {
                     id: 11,
                     title: 'Item 1-1',
                     flag: true,
                     par: 1,
                     'par@': true,
                     'par$': true
                  },
                  {
                     id: '11*',
                     title: 'Item 1-1',
                     flag: true,
                     par: 11,
                     'par@': null,
                     'par$': true
                  },
                  {
                     id : '11x',
                     title: 'Item 1-1-x',
                     flag: true,
                     par: 11,
                     'par@': true
                  },
                  {
                     id: 1,
                     title: 'Item 1',
                     flag: true,
                     par: null,
                     'par@': true,
                     'par$': true
                  },

                  {
                     id: 222,
                     title: 'Item 2-2-2',
                     flag: true,
                     par: 22,
                     'par@': false,
                     'par$': false
                  },
                  {
                     id: 111,
                     title: 'Item 1-1-1',
                     flag: true,
                     par: 11,
                     'par@': true
                  },
                  {
                     id: 112,
                     title: 'Item 1-1-2',
                     flag: true,
                     par: 111,
                     'par@': null
                  },
                  {
                     id: 113,
                     title: 'Item 1-1-3',
                     flag: true,
                     par: '11x',
                     'par@': null
                  },
                  {
                     id: 2,
                     title: 'Item 2',
                     flag: false,
                     par: null,
                     'par@': true,
                     'par$': true
                  },
                  {
                     id: 22,
                     title: 'Item 2-2',
                     flag: true,
                     par: 2,
                     'par@': true,
                     'par$': true
                  },

                  {
                     id: 3,
                     title: 'Item 3',
                     flag: true,
                     par: null,
                     'par@': true,
                     'par$': true
                  },
                  {
                     id: 33,
                     title: 'Title 3-3',
                     flag: true,
                     par: 3,
                     'par@': false,
                     'par$': false
                  }
               ];
               cfg._columnsConfig = {
                  columns: new RecordSet({
                     rawData: [
                        {
                           id: '1',
                           title: 'id',
                           fixed: true,
                           selected: true,
                           columnConfig: {
                              className: "column1",
                              field: "id",
                              title: ""
                           }
                        },
                        {
                           id: '2',
                           title: 'title',
                           fixed: true,
                           selected: true,
                           columnConfig: {
                              className: "column2",
                              field: "title",
                              title: "title"
                           }
                        },
                        {
                           id: '3',
                           title: 'flag',
                           fixed: false,
                           selected: false,
                           columnConfig: {
                              className: "column3",
                              field: "flag",
                              title: "flag"
                           }
                        },
                        {
                           id: '4',
                           title: 'parent',
                           fixed: false,
                           selected: false,
                           columnConfig: {
                              className: "column4",
                              field: "par",
                              title: "parent"
                           }
                        }
                     ],
                        idProperty: 'id'
                     })};
               return cfg;
            }
         });
      return moduleClass;
   }
);