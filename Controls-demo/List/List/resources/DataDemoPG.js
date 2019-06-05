define('Controls-demo/List/List/resources/DataDemoPG', [],
   function() {
      var showType = {

         //show only in Menu
         MENU: 0,

         //show in Menu and Toolbar
         MENU_TOOLBAR: 1,

         //show only in Toolbar
         TOOLBAR: 2
      };
      return {
         gadgets: [
            {
               id: '1',
               title: 'So long name of the record that it does not fit into the maximum size 1',
               description: 'Some item 1',
               mytemp: 'wml!Controls-demo/List/List/resources/ItemTemplatePG/CustomItemTemplate',
               saleTemplate: 'wml!Controls-demo/List/List/resources/ItemTemplatePG/CustomItemTemplateTwo'
            },
            {
               id: '2',
               title: 'Notebooks 2',
               description: 'Some description',
               boldTemplate: 'wml!Controls-demo/List/List/resources/ItemTemplatePG/CustomItemTemplateOne',
               saleTemplate: 'wml!Controls-demo/List/List/resources/ItemTemplatePG/CustomItemTemplateTwo'

            },
            {
               id: '3',
               title: 'Smartphones 3 ',
               description: 'Don\'t know',
               mytemp: 'wml!Controls-demo/List/List/resources/ItemTemplatePG/CustomItemTemplate',
            },
            {
               id: '4',
               title: 'Tablets 4',
               description: 'iPads, Samsungs and others',
               boldTemplate: 'wml!Controls-demo/List/List/resources/ItemTemplatePG/CustomItemTemplateOne',
            },
            {
               id: '5',
               title: 'Ultra 4K TV 5',
               description: 'TV with large displays',
               saleTemplate: 'wml!Controls-demo/List/List/resources/ItemTemplatePG/CustomItemTemplateTwo'
            }
         ],
         groupGadgets: [
            {
               id: '1',
               title: 'Apple MacBook Pro MF839',
               description: 'description of item with id 1',
               brand: 'apple',
               year: 2007
            },
            {
               id: '2',
               title: 'ASUS X751SA-TY124D',
               description: 'description of item with id 2',
               brand: 'asus',
               year: 2008
            },
            {
               id: '3',
               title: 'HP 250 G5 (W4N28EA)',
               description: 'description of item with id 3',
               brand: 'hp',
               year: 2007

            },
            {
               id: '4',
               title: 'ACER One 10 S1002-15GT',
               description: 'description of item with id 4',
               brand: 'acer',
               year: 2008
            },
            {
               id: '5',
               title: 'ASUS X541SA-XO056D',
               description: 'description of item with id 5',
               brand: 'asus',
               year: 2008
            },
            {
               id: '6',
               title: 'ACER Aspire F 15 F5-573G-51Q7',
               description: 'description of item with id 6',
               brand: 'acer',
               year: 2006
            },
            {
               id: '7',
               title: 'HP 250 G5 (W4M56EA)',
               description: 'description of item with id 7',
               brand: 'hp',
               year: 2006
            }
         ],
         music: [
            {
               id: '1',
               title: 'Love The Way You Lie 1',
               description: 'Skylar Grey'
            },
            {
               id: '2',
               title: 'My Life Be Like(Grits) 2',
               description: 'L. Starz'
            },
            {
               id: '3',
               title: 'Veorra 3 ',
               description: 'Veorra'

            },
            {
               id: '4',
               title: 'Partystarter 4',
               description: 'Bakermat'
            },
            {
               id: '5',
               title: 'White Flag VIP 5',
               description: 'Delta Heavy'
            }
         ],
         firstItemActionsArray: [
            {
               id: '5',
               title: 'Mark as read',
               showType: showType.TOOLBAR,
               handler: function() {
                  console.log('itemActionsClick(Mark as read)');
               }
            },
            {
               id: '1',
               icon: 'icon-PhoneNull',
               title: 'Call',
               handler: function(item) {
                  console.log('itemActionsClick(Call)', item);
               }
            },
            {
               id: '2',
               icon: 'icon-EmptyMessage',
               title: 'Send',
               parent: null,
               'parent@': true,
               handler: function() {
                  console.log('itemActionsClick(Message)');
               }
            },
            {
               id: '3',
               icon: 'icon-Profile',
               title: 'Profile',
               showType: showType.MENU_TOOLBAR,
               parent: null,
               'parent@': null,
               handler: function() {
                  console.log('itemActionsClick(Profile)');
               }
            },
            {
               id: '6',
               icon: 'icon-Email',
               title: 'Email',
               parent: 2,
               'parent@': null,
               handler: function() {
                  console.log('itemActionsClick(Email)');
               }
            },
            {
               id: '4',
               icon: 'icon-Erase',
               iconStyle: 'danger',
               title: 'Remove',
               showType: showType.TOOLBAR,
               handler: function() {
                  console.log('itemActionsClick(Remove)');
               }
            }
         ],
         secondItemActionsArray: [
            {
               id: '1',
               icon: 'icon-PhoneNull',
               title: 'Skype',
               showType: showType.MENU,
               handler: function(item) {
                  console.log('itemActionsClick(Skype)', item);
               }
            },
            {
               id: '2',
               icon: 'icon-EmptyMessage',
               title: 'Viber Message',
               showType: showType.MENU,
               handler: function() {
                  console.log('itemActionsClick(Viber Message)');
               }
            },
            {
               id: '3',
               icon: 'icon-Erase',
               iconStyle: 'danger',
               title: 'Remove',
               showType: showType.MENU_TOOLBAR,
               handler: function() {
                  console.log('itemActionsClick(Remove)');
               }
            }
         ]
      }
   });
