interface IEvent<T> {
    notify(value?: T)
    subscribe(fn: any): any
}

export = IEvent;