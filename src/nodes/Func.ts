import Node from "./Node";
import Terminal from "./Terminal";
import Utils from "../Utils";


enum FuncTypes {
    concatenation = "•",
    or = "•|•",
    lineBegin = "^•",
    lineEnd = "•$",
    zeroOrMore = "•*+",
    oneOrMore = "•?+",
    group = "(•)",
    negation = "[^•]",
    range = "[•]",
    more = "•++",
}


export default class Func implements Node {
    public static placeholder: FuncTypes = FuncTypes.concatenation;
    public static Types = FuncTypes;
    private static _options: string[] = null;

    public static get options(): FuncTypes[] {
        if (!Func._options) { Func._options = Object.keys(FuncTypes).map(key => (FuncTypes as any)[key]); }
        return Func._options as FuncTypes[];
    }

    public left: Node;
    public right: Node;
    public type: FuncTypes = Func.placeholder;

    public mutate(values: string[]): void {
        this.type = Utils.getRandomlyFromList(Func.options);
    }

    public toString(): string {
        let left  = this.left ? this.left.toString() : '';
        let right = this.right ? this.right.toString() : '';

        if (this.type == FuncTypes.or) {
            return left + "|" + right;
        }

        let txt = left + right;
        return this.type.replace(Func.placeholder, txt);
    }

    public toRegex(): RegExp {
        return new RegExp(this.toString());
    }

    public clone(): Func {
        let func = new Func();
        func.left = this.left.clone();
        func.right = this.right.clone();
        func.type = this.type;
        return func;
    }

    public getLeastTerminal(): Terminal {
        let current: Node = this.right;
        while (current instanceof Func) {
            current = current.right;
        }
        return current as Terminal;
    }

    public getLeastFunc(): Func {
        if (this.right instanceof Terminal) {
            return this;
        }

        let current: Func = this.right as Func;
        while (!(current.right instanceof Terminal)) {
            current = current.right as Func;
        }

        return current;
    }
}
