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

    public get validLeftChars(): string[] {
        return Object.keys(this.chars.left);
    }

    public get validRigthChars(): string[] {
        return Object.keys(this.chars.right);
    }

    public get leftCharsNotInRight(): string[] {
        return this.validLeftChars.filter(char => this.validRigthChars.indexOf(char) === -1);
    }

    public get rightCharsNotInLeft(): string[] {
        return this.validRigthChars.filter(char => this.validLeftChars.indexOf(char) === -1);
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

    public isBestRegex(regex: RegExp | string): boolean {
        if (typeof regex == "string") {
            regex = new RegExp(regex);
        }

        let fitness = this.evaluateRegex(regex);
        let quantity = this.left.length + this.right.length;
        return fitness >= quantity;
    }

    public evaluateRegex(regex: RegExp): number {
        let fitness = 0;
        this.left .forEach(name => fitness += regex.test(name) ? 1 : 0);
        this.right.forEach(name => fitness += regex.test(name) ? 0 : 1);
        return fitness;
    }

    public evaluateString(str: string): number {
        try {
            let regex = new RegExp(str);
            return this.evaluateRegex(regex);
        } catch(e) {
            return 0;
        }
    }

    public evaluate(ind: Individual): void {
        let regex = ind.toRegex();
        ind.fitness = this.evaluateRegex(regex);
    }
}
