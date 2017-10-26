import Func from "./nodes/Func";
import Individual from "./Individual";
import IndividualFactory from "./IndividualFactory";
import Terminal from "./nodes/Terminal";
import Utils from "./Utils";


export default class Program {
    public left: string[] = [];
    public right: string[] = [];
    public chars: {left: {[key: string]: number}, right: {[key: string]: number}} = {left: {}, right: {}};
    public factory: IndividualFactory;

    public get maxEvaluations(): number {
        return 50000;
    }

    public get validLeftChars(): string[] {
        return Object.keys(this.chars.left);
    }

    public get validRigthChars(): string[] {
        return Object.keys(this.chars.right);
    }

    public get leftCharsNotInRight(): string[] {
        return this.validRigthChars.filter(char => this.validLeftChars.indexOf(char) === -1);
    }

    public get rightCharsNotInLeft(): string[] {
        return this.validLeftChars.filter(char => this.validRigthChars.indexOf(char) === -1);
    }

    constructor(public instanceName: string) {
        let instance = Utils.loadInstance(instanceName);
        this.left = instance.left;
        this.right = instance.right;
    }

    public init(): void {
        this.chars.left = this.extractUniqueChars(this.left);
        this.chars.right = this.extractUniqueChars(this.right);
        this.factory = new IndividualFactory(this.validLeftChars, this.validRigthChars);
    }

    public extractUniqueChars(text: string[]): {[key: string]: number} {
        let chars: {[key: string]: number} = {};
        text.forEach(name => {
            let uniqueChars = new Set();
            name.split('').forEach(letter => uniqueChars.add(letter));

            uniqueChars.forEach(char => {
                if(!(char in chars)) chars[char] = 0;
                chars[char] += 1;
            });
        });

        return Utils.sortObjectByValue(chars);
    }

    public isValidLeft(ind: Individual): boolean {
        return this.left.every(name => ind.test(name));
    }

    public isValid(ind: Individual): boolean {
        this.evaluate(ind);
        return ind.fitness >= this.left.length;
    }

    public isBest(ind: Individual): boolean {
        this.evaluate(ind);
        let quantity = this.left.length + this.right.length;
        return ind.fitness >= quantity;
    }

    public evaluate(ind: Individual): void {
        let regex = ind.toRegex();
        let fitness = 0;

        this.left .forEach(name => fitness += regex.test(name) ? 1 : 0);
        this.right.forEach(name => fitness += regex.test(name) ? 0 : 1);
        ind.fitness = fitness;
    }

    public generateInitialIndividual(): Individual {
        let index = 0;
        let maxIndex = this.validLeftChars.length - 1;

        let ind = new Individual();
        ind.tree = new Func();
        ind.tree.type = Func.Types.concatenation;
        ind.tree.left = new Terminal(this.validLeftChars[index]);
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
            func.left = new Terminal(this.validLeftChars[index]);
            func.right = new Terminal(this.validLeftChars[index + 1]);

            current.right = func;
            current = func;
        }

        return ind;
    }

    public * generateNeighborhood(ind: Individual) {
        // Swapping
        this.leftCharsNotInRight.forEach(char => {

        });
        // Appending

        let newInd = ind.clone();
        newInd.tree.type = Func.Types.lineBegin;
        yield newInd;

        newInd = ind.clone();
        newInd.tree.type = Func.Types.lineEnd;
        yield newInd;

        let chars = this.getCharsInLeftNotInRight();
        for (let i = 0; i < chars.length; i++) {
            newInd = ind.clone();
            let leaf = newInd.tree.getLeastFunc();

            let func = new Func();
            func.type = Func.Types.concatenation;
            func.left = leaf.right;
            func.right = new Terminal(chars[i]);
            yield newInd;
        }

        for (let i = 0; i < chars.length; i++) {
            newInd = ind.clone();
            let leaf = newInd.tree;

            let func = new Func();
            func.type = Func.Types.concatenation;
            func.right = leaf;
            func.left = new Terminal(chars[i]);
            newInd.tree = func;
            yield newInd;
        }
    }

    public getRandomNeighbor(ind: Individual): Individual {
        return this.factory.generateRandomlyFrom(ind);
    }
}
