function getItemActions() {
    return [
       {
          id: 1,
          icon: 'icon-PhoneNull',
          title: 'phone'
       },
       {
          id: 2,
          icon: 'icon-EmptyMessage',
          title: 'message',
          parent: null,
          'parent@': true
       },
       {
          id: 6,
          title: 'call',
          parent: 2,
          'parent@': null
       },
       {
          id: 4,
          icon: 'icon-Erase',
          iconStyle: 'danger',
          title: 'delete pls',
          showType: 2
       }
    ];
}


export {
   getItemActions
}