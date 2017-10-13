
export default interface Node {
    clone(): Node;
    mutate(values: string[]): void;
    toString(): string;
    toRegex(): RegExp;
}

