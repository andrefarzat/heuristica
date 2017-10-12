import Func from "./nodes/Func";
import Individual from "./Individual";
import Terminal from "./nodes/Terminal";
import Utils from "./Utils";


export default class Program {
    public left: string[] = [];
    public right: string[] = [];
    public chars: {[key: string]: number} = {};

    public get validChars(): string[] {
        return Object.keys(this.chars);
    }

    constructor(public instanceName: string) {
        let instance = Utils.loadInstance(instanceName);
        this.left = instance.left;
        this.right = instance.right;
    }

    public init(): void {
        this.extractUniqueChars(this.left);
    }

    public extractUniqueChars(text: string[]): void {
        this.left.forEach(name => {
            let uniqueChars = new Set();
            name.split('').forEach(letter => uniqueChars.add(letter));

            uniqueChars.forEach(char => {
                if(!(char in this.chars)) this.chars[char] = 0;
                this.chars[char] += 1;
            });
        });

        this.chars = Utils.sortObjectByValue(this.chars);
    }

    public isValidLeft(ind: Individual): boolean {
        return this.left.every(name => ind.test(name));
    }

    public evaluate(ind: Individual): void {
        let regex = ind.toRegex();
        let fitness = 0;

        this.left.forEach(name => fitness += regex.test(name) ? 1 : 0);
        this.right.forEach(name => fitness -= regex.test(name) ? 1 : 0);
        ind.fitness = fitness;
    }

    public generateInitialIndividual(): Individual {
        let index = 0;
        let maxIndex = this.validChars.length - 1;

        let ind = new Individual();
        ind.tree = new Func();
        ind.tree.type = Func.Types.concatenation;
        ind.tree.left = new Terminal(this.validChars[index]);
        ind.tree.right = new Terminal('');

        if (this.isValidLeft(ind)) {
            return ind;
        }

        let current = ind.tree;
        while (!this.isValidLeft(ind)) {
            current.type = Func.Types.or;
            index ++;

            if ((index + 1) > maxIndex) {
                break;
            }

            let func = new Func();
            func.type = Func.Types.or;
            func.left = new Terminal(this.validChars[index]);
            func.right = new Terminal(this.validChars[index + 1]);

            current.right = func;
            current = func;
        }

        return ind;
    }

    public * generateNeighbors(ind: Individual) {
        let ret: string[] = [];

        let options = ['^', '$'];

        yield* options;
    }
}
