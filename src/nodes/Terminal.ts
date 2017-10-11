import Node from "./Node";


export default class Terminal implements Node {
    constructor(public value: string = '') {
        // pass
    }

    public toString(): string {
        return this.value.toString();
    }

    public toRegex(): RegExp {
        return new RegExp(this.toString());
    }
}
