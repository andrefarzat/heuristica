import Func from "./nodes/Func";


export default class Individual {
    public tree: Func;
    public fitness: number;

    public toString(): string {
        return `[Individual] ${this.tree.toString()}`;
    }

    public toRegex(): RegExp {
        return this.tree.toRegex();
    }

    public test(name: string): boolean {
        return this.tree.toRegex().test(name);
    }
}
