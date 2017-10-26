import Func from "./nodes/Func";
import Node from "./nodes/Node";


export default class Individual {
    public tree: Func;
    public fitness: number;

    public toString(): string {
        return this.tree.toString();
    }

    public toRegex(): RegExp {
        return this.tree.toRegex();
    }

    public test(name: string): boolean {
        return this.tree.toRegex().test(name);
    }

    public clone(): Individual {
        let ind = new Individual();
        ind.tree = this.tree.clone();
        ind.fitness = this.fitness;
        return ind;
    }

    public getParentOf(node: Node): {func: Func, side: 'left' | 'right'} {
        let funcs = this.tree.getFuncs();

        for(let i = 0; i < funcs.length; i ++) {
            let current = funcs[i];
            if (current.left  === node) return {func: current, side: 'left'};
            if (current.right === node) return {func: current, side: 'right'};
        }

        return null;
    }
}
