import Node from "./Node";


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

    public static get options(): string[] {
        return Object.keys(FuncTypes)
    }

    public left: Node;
    public right: Node;
    public type: FuncTypes = Func.placeholder;

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
}
