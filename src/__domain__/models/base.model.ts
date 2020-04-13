export class BaseModel<T> {
    constructor(props?: { [P in keyof T]?: T[P] }) {
        if (props) {
            Object.assign(this, props);
        }
    }
}
