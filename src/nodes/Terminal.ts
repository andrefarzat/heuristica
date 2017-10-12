import Node from "./Node";
import Utils from "../Utils";


export default class Terminal implements Node {
    constructor(public value: string = '') {
        // pass
    }

    public mutate(values: string[]): void {
        this.value = Utils.getRandomlyFromList(values);
    }

    public toString(): string {
        return this.value.toString();
    }

    public toRegex(): RegExp {
        return new RegExp(this.toString());
    }
}
