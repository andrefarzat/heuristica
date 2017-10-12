
export default interface Node {
    mutate(values: string[]): void;
    toString(): string;
    toRegex(): RegExp;
}

