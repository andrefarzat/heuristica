import Func from "./nodes/Func";


export default class Individual {
    public tree: Func;

    public toString(): string {
        return `[Individual] ${this.tree.toString()}`;
    }

    public test(name: string): boolean {
        return this.tree.toRegex().test(name);
    }
}
