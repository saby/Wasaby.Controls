//это конфиг, который задает юзер для окошка не путать с IPopupOptions
interface IPopupItemOptions{
    width: number;
    height: number;
    modal: Boolean;
    target?: ITargetOptions; //контейнер, относительно которого рассчитывать положение
    autoHide: boolean
}