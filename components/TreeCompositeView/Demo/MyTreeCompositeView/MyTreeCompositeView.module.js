define('js!SBIS3.CONTROLS.Demo.MyTreeCompositeView',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!WS.Data/Source/Memory',
      'js!SBIS3.CONTROLS.ComponentBinder',
      'html!SBIS3.CONTROLS.Demo.MyTreeCompositeView/resources/tileTpl',
      'html!SBIS3.CONTROLS.Demo.MyTreeCompositeView/resources/listTpl',
      'html!SBIS3.CONTROLS.Demo.MyTreeCompositeView/resources/folderTpl',
      'html!SBIS3.CONTROLS.Demo.MyTreeCompositeView',
      'css!SBIS3.CONTROLS.Demo.MyTreeCompositeView',
      'js!SBIS3.CONTROLS.TreeCompositeView',
      'js!SBIS3.CONTROLS.BreadCrumbs',
      'js!SBIS3.CONTROLS.BackButton',
      'js!SBIS3.CONTROLS.RadioGroup'
   ],
   function(CompoundControl, StaticSource, ComponentBinder, tileTpl, listTpl, folderTpl, dotTplFn) {
      var moduleClass = CompoundControl.extend({
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               tileTpl: tileTpl,
               listTpl: listTpl,
               folderTpl: folderTpl
            }
         },
         init: function() {
            moduleClass.superclass.init.call(this);
               var items = [
                  {'title': 'Медведь',          'id':1,  'parent@': true,  'image': 'https://inside.tensor.ru/docview/service/sbis-rpc-service300.dll?method=DocView.ReadAttachmentAsPreviewSync&params=eyJTZXJ2aWNlIjoiaHR0cHM6Ly9pbnNpZGUudGVuc29yLnJ1L2Rpc2svYXBpL3YxL3NlcnZpY2UvIiwiT2JqZWN0IjoiRmlsZVNEIiwgIklEIjoiY2NiZjIyYTUtNmE4MC00MTEyLWFkYzMtNDFjM2E5Yzc3Yzc4IiwiSURSZWRhY3Rpb24iOiJjY2JmMjJhNS02YTgwLTQxMTItYWRjMy00MWMzYTljNzdjNzhfZTVlNWVhZWItOTBjOC00NjM1LTgwZTEtYjk3OTI4ZTFhZTc4IiwiVmVyc2lvbiI6IjIwMTctMDEtMjcgMTc6NTk6MDMuNzY2NjE1IiwiV2lkdGgiOiIxOTAwIiwiSGVpZ2h0IjoiOTAwIn0%3D&id=0'},
                  {'title': 'Кот',              'id':2,  'parent@': true,  'image': 'https://inside.tensor.ru/docview/service/sbis-rpc-service300.dll?method=DocView.ReadAttachmentAsPreviewSync&params=eyJTZXJ2aWNlIjoiaHR0cHM6Ly9pbnNpZGUudGVuc29yLnJ1L2Rpc2svYXBpL3YxLyIsIk9iamVjdCI6IkZpbGVTRCIsICJJRCI6IjFlZGJlN2NkLTgxYTctNDVlOC1hMjRkLTJmOWQ0MDVkOGYzMiIsIklEUmVkYWN0aW9uIjoiMWVkYmU3Y2QtODFhNy00NWU4LWEyNGQtMmY5ZDQwNWQ4ZjMyX2QzYWZmOWEyLWE1NTQtNDdhMi1iOWI0LTE0NjU5NzJlNzc3NiIsIlZlcnNpb24iOiIyMDE3LTAxLTI3IDE3OjU5OjAzLjk1MTI5MyIsIldpZHRoIjoiMTkwMCIsIkhlaWdodCI6IjkwMCJ9&id=0',  'parent' : 1 },
                  {'title': 'Котик', 				 'id':3,  'parent@': true,  'image': 'https://inside.tensor.ru/docview/service/sbis-rpc-service300.dll?method=DocView.ReadAttachmentAsPreviewSync&params=eyJTZXJ2aWNlIjoiaHR0cHM6Ly9pbnNpZGUudGVuc29yLnJ1L2Rpc2svYXBpL3YxLyIsIk9iamVjdCI6IkZpbGVTRCIsICJJRCI6IjE4NmUyZGMxLWI5MjYtNGE0Mi1iM2MxLWU2ZjRiNTQzZTYzZCIsIklEUmVkYWN0aW9uIjoiMTg2ZTJkYzEtYjkyNi00YTQyLWIzYzEtZTZmNGI1NDNlNjNkXzZkNTE4ZWY1LWYyZTItNGRjZS05ZDFhLTg3MTMzMjg5NjQzYiIsIlZlcnNpb24iOiIyMDE3LTAxLTI3IDE3OjU5OjA0LjEyODE4MSIsIldpZHRoIjoiMTkwMCIsIkhlaWdodCI6IjkwMCJ9&id=0',  'parent' : 2 },
                  {'title': 'Собака с бровями', 'id':4,  'parent@': null, 'image': 'https://inside.tensor.ru/docview/service/sbis-rpc-service300.dll?method=DocView.ReadAttachmentAsPreviewSync&params=eyJTZXJ2aWNlIjoiaHR0cHM6Ly9pbnNpZGUudGVuc29yLnJ1L2Rpc2svYXBpL3YxLyIsIk9iamVjdCI6IkZpbGVTRCIsICJJRCI6ImY1ZDFiYTg1LTlmMDEtNDU2OS05MDJmLWQ0YTI3ZjdmOWNkZiIsIklEUmVkYWN0aW9uIjoiZjVkMWJhODUtOWYwMS00NTY5LTkwMmYtZDRhMjdmN2Y5Y2RmX2YyMjdlNzY0LWE0NzktNGY1NC05MWFkLWFiMjVkODA5ZGY2NiIsIlZlcnNpb24iOiIyMDE3LTAxLTI3IDE3OjU5OjA0LjI2NDkwOCIsIldpZHRoIjoiMTkwMCIsIkhlaWdodCI6IjkwMCJ9&id=0',  'parent' : 3 },
                  {'title': 'Собака',           'id':5,  'parent@': null, 'image': 'https://inside.tensor.ru/docview/service/sbis-rpc-service300.dll?method=DocView.ReadAttachmentAsPreviewSync&params=eyJTZXJ2aWNlIjoiaHR0cHM6Ly9pbnNpZGUudGVuc29yLnJ1L2Rpc2svYXBpL3YxLyIsIk9iamVjdCI6IkZpbGVTRCIsICJJRCI6IjViYmFiNTExLTJjZDYtNDFhMS05MTU2LTk1NTdlNThhNmI4NCIsIklEUmVkYWN0aW9uIjoiNWJiYWI1MTEtMmNkNi00MWExLTkxNTYtOTU1N2U1OGE2Yjg0X2NiMmYzM2QxLTY3MjEtNDM2Ni05M2MxLWUyM2I0OTZlMWY1OCIsIlZlcnNpb24iOiIyMDE3LTAxLTI3IDE3OjU5OjA0LjM4NTc0OCIsIldpZHRoIjoiMTkwMCIsIkhlaWdodCI6IjkwMCJ9&id=0',  'parent' : 1 },
                  {'title': 'Лягушка',          'id':6,  'parent@': true,  'image': 'https://inside.tensor.ru/docview/service/sbis-rpc-service300.dll?method=DocView.ReadAttachmentAsPreviewSync&params=eyJTZXJ2aWNlIjoiaHR0cHM6Ly9pbnNpZGUudGVuc29yLnJ1L2Rpc2svYXBpL3YxLyIsIk9iamVjdCI6IkZpbGVTRCIsICJJRCI6IjgwNzQwYzJlLTBmNjgtNGViNS1hNDgxLTI3YTcyYjZiNTllZSIsIklEUmVkYWN0aW9uIjoiODA3NDBjMmUtMGY2OC00ZWI1LWE0ODEtMjdhNzJiNmI1OWVlXzU2NzFmNDA5LWM4YzctNDRmZC05YWM1LTE4MGJkNzE0OGYyZCIsIlZlcnNpb24iOiIyMDE3LTAxLTI3IDE3OjU5OjA0LjU0MzY4NSIsIldpZHRoIjoiMTkwMCIsIkhlaWdodCI6IjkwMCJ9&id=0' },
                  {'title': 'Козел', 				 'id':7,  'parent@': null, 'image': 'https://inside.tensor.ru/docview/service/sbis-rpc-service300.dll?method=DocView.ReadAttachmentAsPreviewSync&params=eyJTZXJ2aWNlIjoiaHR0cHM6Ly9pbnNpZGUudGVuc29yLnJ1L2Rpc2svYXBpL3YxLyIsIk9iamVjdCI6IkZpbGVTRCIsICJJRCI6IjIzYjVlZTQxLTZmYjMtNDYwNy1iNmMwLTU0ZGYwZjI5NDgzMyIsIklEUmVkYWN0aW9uIjoiMjNiNWVlNDEtNmZiMy00NjA3LWI2YzAtNTRkZjBmMjk0ODMzXzg3ODFiNDMzLTlkMTUtNDM3YS05MGE5LTM2NjliNDM3OThkYiIsIlZlcnNpb24iOiIyMDE3LTAxLTI3IDE3OjU5OjA0LjcyOTM4MiIsIldpZHRoIjoiMTkwMCIsIkhlaWdodCI6IjkwMCJ9&id=0',  'parent' : 6 },
                  {'title': 'Горилла',          'id':8,  'parent@': null, 'image': 'https://inside.tensor.ru/docview/service/sbis-rpc-service300.dll?method=DocView.ReadAttachmentAsPreviewSync&params=eyJTZXJ2aWNlIjoiaHR0cHM6Ly9pbnNpZGUudGVuc29yLnJ1L2Rpc2svYXBpL3YxLyIsIk9iamVjdCI6IkZpbGVTRCIsICJJRCI6IjQxZTAyNDVjLWQxZDItNDQzYS1iMTgzLTA0NmNhNzQyM2JkOCIsIklEUmVkYWN0aW9uIjoiNDFlMDI0NWMtZDFkMi00NDNhLWIxODMtMDQ2Y2E3NDIzYmQ4XzkzMTZmNTIyLWRlNDgtNDk5My1hYmI2LTY3YzM2NTBkMTg1YiIsIlZlcnNpb24iOiIyMDE3LTAxLTI3IDE3OjU5OjA1LjIzOTEwNiIsIldpZHRoIjoiMTkwMCIsIkhlaWdodCI6IjkwMCJ9&id=0', 'parent' : 6 },
                  {'title': 'Панда',            'id':9,  'parent@': null, 'image': 'https://inside.tensor.ru/docview/service/sbis-rpc-service300.dll?method=DocView.ReadAttachmentAsPreviewSync&params=eyJTZXJ2aWNlIjoiaHR0cHM6Ly9pbnNpZGUudGVuc29yLnJ1L2Rpc2svYXBpL3YxLyIsIk9iamVjdCI6IkZpbGVTRCIsICJJRCI6IjI0NmFiNzNmLTRkNDItNDBjMy1iZGIxLTRkODlhYTg0ODRkNiIsIklEUmVkYWN0aW9uIjoiMjQ2YWI3M2YtNGQ0Mi00MGMzLWJkYjEtNGQ4OWFhODQ4NGQ2XzhmNTNiMTIwLTEzNzYtNGNmMy1iZjRiLTc5NjZmMDZlNzI0MSIsIlZlcnNpb24iOiIyMDE3LTAxLTI3IDE3OjU5OjA1LjQyMDMwMSIsIldpZHRoIjoiMTkwMCIsIkhlaWdodCI6IjkwMCJ9&id=0'},
                  {'title': 'Голубь',           'id':10, 'parent@': null, 'image': 'https://inside.tensor.ru/docview/service/sbis-rpc-service300.dll?method=DocView.ReadAttachmentAsPreviewSync&params=eyJTZXJ2aWNlIjoiaHR0cHM6Ly9pbnNpZGUudGVuc29yLnJ1L2Rpc2svYXBpL3YxLyIsIk9iamVjdCI6IkZpbGVTRCIsICJJRCI6IjU4YzNhNTNhLWU4ZDItNDg1Yy1hMGZjLWEwODdiMWJhM2M2NSIsIklEUmVkYWN0aW9uIjoiNThjM2E1M2EtZThkMi00ODVjLWEwZmMtYTA4N2IxYmEzYzY1XzI5MmQ2MmY1LTIzNzUtNDIyOS1hNTI5LWEyYWExODJkZWJkMSIsIlZlcnNpb24iOiIyMDE3LTAxLTI3IDE3OjU5OjA1LjU4Mjg1NiIsIldpZHRoIjoiMTkwMCIsIkhlaWdodCI6IjkwMCJ9&id=0'},
                  {'title': 'Мопс',             'id':11, 'parent@': null, 'image': 'https://inside.tensor.ru/docview/service/sbis-rpc-service300.dll?method=DocView.ReadAttachmentAsPreviewSync&params=eyJTZXJ2aWNlIjoiaHR0cHM6Ly9pbnNpZGUudGVuc29yLnJ1L2Rpc2svYXBpL3YxLyIsIk9iamVjdCI6IkZpbGVTRCIsICJJRCI6IjQyMGYyMDMxLTYyNDMtNDUzZi05YjZjLTE0NjZiZTlhMzQyNCIsIklEUmVkYWN0aW9uIjoiNDIwZjIwMzEtNjI0My00NTNmLTliNmMtMTQ2NmJlOWEzNDI0X2QxYTkwNTIwLWM4ODItNDliNy1iOGJiLTA1Njc1MzgzYzZiNSIsIlZlcnNpb24iOiIyMDE3LTAxLTI3IDE3OjU5OjA1Ljc5MjU5MSIsIldpZHRoIjoiMTkwMCIsIkhlaWdodCI6IjkwMCJ9&id=0'},
                  {'title': 'Енотик',           'id':12, 'parent@': null, 'image': 'https://inside.tensor.ru/docview/service/sbis-rpc-service300.dll?method=DocView.ReadAttachmentAsPreviewSync&params=eyJTZXJ2aWNlIjoiaHR0cHM6Ly9pbnNpZGUudGVuc29yLnJ1L2Rpc2svYXBpL3YxLyIsIk9iamVjdCI6IkZpbGVTRCIsICJJRCI6Ijg1YmYxODJjLTE5MmQtNGY2Ni1iN2U4LTIxN2U2NDRlOWZkZSIsIklEUmVkYWN0aW9uIjoiODViZjE4MmMtMTkyZC00ZjY2LWI3ZTgtMjE3ZTY0NGU5ZmRlXzVjZmEyOTI2LWZlN2MtNDA4Yy05OGNhLTk0ZjY2NTMwZDJlMSIsIlZlcnNpb24iOiIyMDE3LTAxLTI3IDE3OjU5OjA1Ljk2MDE5MyIsIldpZHRoIjoiMTkwMCIsIkhlaWdodCI6IjkwMCJ9&id=0'}
               ],
               source = new StaticSource({
                  data: items,
                  idProperty: 'id'
               }),
               treeCompositeView = this.getChildControlByName('MyTreeCompositeView'),
               breadCrumbs = this.getChildControlByName('MyBreadCrumbs'),
               backButton = this.getChildControlByName('MyBackButton'),
               radioGroup = this.getChildControlByName('RadioGroup'),
               componentBinder = new ComponentBinder({
                  view: treeCompositeView
               });

               treeCompositeView._options.tileTemplate = tileTpl;
               treeCompositeView._options.listTemplate = listTpl;
               treeCompositeView._options.folderTemplate = folderTpl;
               componentBinder.bindBreadCrumbs(breadCrumbs, backButton, treeCompositeView);
               treeCompositeView.setDataSource(source);
               radioGroup.subscribe('onSelectedItemChange', function(eventObject, key) {
                  switch(key) {
                     case 1:
                        treeCompositeView.setViewMode('table');
                        treeCompositeView.reload();
                        break;
                     case 2:
                        treeCompositeView.setViewMode('tile');
                        treeCompositeView.reload();
                        break;
                     case 3:
                        treeCompositeView.setViewMode('list');
                        treeCompositeView.reload();
                        break;
                  }
               });
            },
         deleteHandler: function(item){
            this.deleteRecords(item.data('id'));
         }
      });
      return moduleClass;
   }
);