import {showType} from 'Controls/Utils/Toolbar';
import {IItemAction} from 'Controls/_list/interface/IList';

function getActionsForContacts(): IItemAction[] {
    return [
        {
            id: 1,
            title: 'Прочитано',
            showType: showType.TOOLBAR
        },
        {
            id: 2,
            icon: 'icon-PhoneNull',
            title: 'Позвонить',
            showType: showType.MENU_TOOLBAR
        },
        {
            id: 3,
            icon: 'icon-EmptyMessage',
            title: 'Написать',
            'parent@': true,
            showType: showType.TOOLBAR
        },
        {
            id: 4,
            icon: 'icon-Chat',
            title: 'Диалог',
            showType: showType.MENU_TOOLBAR,
            parent: 3
        },
        {
            id: 5,
            icon: 'icon-Email',
            title: 'Email',
            showType: showType.MENU,
            parent: 3
        },
        {
            id: 6,
            icon: 'icon-Profile',
            title: 'Профиль пользователя',
            showType: showType.MENU
        },
        {
            id: 7,
            title: 'Удалить',
            showType: showType.MENU,
            icon: 'icon-Erase',
            iconStyle: 'danger'
        }
    ];
}

function getActionsWithDisplayMode(): IItemAction[] {
    return [{
            id: 1,
            icon: 'icon-Email',
            caption: 'Email',
            tooltip: 'Электронная почта',
            showType: showType.TOOLBAR
        },
        {
            id: 2,
            caption: 'Профиль пользователя',
            showType: showType.TOOLBAR
        },
        {
            id: 3,
            tooltip: 'Удалить',
            showType: showType.TOOLBAR,
            icon: 'icon-Erase',
            iconStyle: 'danger'
        }];
}

export {
    getActionsForContacts,
    getActionsWithDisplayMode
}
