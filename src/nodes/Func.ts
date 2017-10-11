import Node from "./Node";


export default class Func implements Node {
    public static placeholder: string = "•";
    public static options: string[] = ["•", "•*+", "•++", "•?+", "(•)", "[•]", "[^•]", "^•", "•$", "•|•"];

    public left: Node;
    public right: Node;
    public type: string = Func.placeholder;
}
