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

    public * generateNeighborhood(solution: string) {
        let len = solution.length;
        let firstLetter = solution.substr(0, 1);
        let lastLetter  = solution.substr(-1);
        let chars = this.validLeftChars.concat(['', '^', '$', '*']);

        // Operator: Concatenation
        for(let i = 0; i <= len; i++) {
            for(let j = 0; j < chars.length; j++) {
                let char = chars[j];
                if (char == '^' && firstLetter == '^') continue;
                if (char == '$' && lastLetter  == '$') continue;

                // Swapping
                let currentSolution = solution.split('');
                currentSolution[i] = char;
                yield currentSolution.join('');

                // Appending
                yield solution.substr(0, i) + char + solution.substr(i)
            }
        }

        // Operator: Or
        for(let i = 0; i <= len; i++) {
            for(let j = 0; j < chars.length; j++) {
                let char = chars[j];
                yield solution.substr(0, i) + '|' + solution.substr(i);
                yield solution.substr(0, i) + char + '|' + solution.substr(i);
                yield solution.substr(0, i) + '|' + char + solution.substr(i);
            }
        }

        // Operator: Range
        let ranges: string[] = [];
        this.validLeftChars.forEach(c => {
            this.validLeftChars.forEach(cc => {
                if (c < cc) ranges.push(`[${c}-${cc}]`)
            });
        });

        for(let i = 0; i <= len; i++) {
            for(let j = 0; j < ranges.length; j++) {
                let range = ranges[j];

                let currentSolution = solution.split('');
                currentSolution[i] = range;
                yield currentSolution.join('');
                yield solution.substr(0, i) + range + solution.substr(i);
            }
        }

        // Operator: Negation
        for(let i = 0; i <= len; i++) {
            for(let j = 0; j < this.rightCharsNotInLeft.length; j++) {
                let char = '[^'+ this.rightCharsNotInLeft[j] + ']';
                yield solution.substr(0, i) + char + solution.substr(i);
            }
        }

        // zeroOrMore = "•*+",
        // oneOrMore = "•?+",
        // group = "(•)",
        // more = "•++",
    }

    public getRandomNeighbor(ind: Individual): Individual {
        return this.factory.generateRandomlyFrom(ind);
    }
}
