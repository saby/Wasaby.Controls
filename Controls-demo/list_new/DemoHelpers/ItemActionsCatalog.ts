import {showType} from "Controls/Utils/Toolbar"

function getActionsForContacts(): Array<{
    id: number
    title: string
    showType: number
    icon?: string
    iconStyle?: string
    handler?: Function
    parent?: number
    'parent@'?: true | false
}> {
    return [
        {
            id: 1,
            title: 'Прочитано',
            showType: showType.TOOLBAR,
        },
        {
            id: 2,
            icon: 'icon-PhoneNull',
            title: 'Позвонить',
            showType: showType.MENU_TOOLBAR,
        },
        {
            id: 3,
            icon: 'icon-EmptyMessage',
            title: 'Написать',
            'parent@': true,
            showType: showType.TOOLBAR,
        },
        {
            id: 4,
            icon: 'icon-Chat',
            title: 'Диалог',
            showType: showType.MENU_TOOLBAR,
            parent: 3,
        },
        {
            id: 5,
            icon: 'icon-Email',
            title: 'Email',
            showType: showType.MENU,
            parent: 3,
        },
        {
            id: 6,
            icon: 'icon-Profile',
            title: 'Профиль пользователя',
            showType: showType.MENU,
        },
        {
            id: 7,
            title: 'Удалить',
            showType: showType.MENU,
            icon: 'icon-Erase',
            iconStyle: 'danger',
        }
    ]
}

function getMoreActions(): Array<{
    id: number
    title: string
    showType?: number
    icon?: string
    iconStyle?: string
    handler?: Function
    parent?: number
    'parent@'?: true | false
}> {
    return [
        {
            id: 10,
            icon: 'icon-Erase icon-error',
            title: 'delete pls',
            showType: showType.TOOLBAR,
            handler: () => { console.log('click to error-icon') }
        },
        {
            id: 12,
            icon: 'icon-View icon-small',
            title: 'view',
            showType: showType.TOOLBAR,
            handler: () => { console.log('click to View-icon') }
        },
        {
            id: 13,
            icon: 'icon-Motion icon-small',
            title: 'motion',
            showType: showType.TOOLBAR,
            handler: () => { console.log('click to Motion-icon') }
        }
    ]
}

export {
    getActionsForContacts,
    getMoreActions
}
