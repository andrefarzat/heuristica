import BaseProgram from "../BaseProgram";
import Func from "../nodes/Func";
import Individual from "../Individual";
import Terminal from "../nodes/Terminal";
import Utils from "../Utils";

export interface Solution {
    regex: string;
    fitness: number;
    date: Date;
    count: number;
}


export default class Program extends BaseProgram {
    public budget: number = 2000;
    public solutions: Solution[] = [];
    public localSolutions: Solution[] = [];

    public shouldStop(): boolean {
        if (this.evalutionCount >= this.budget) {
            this.endTime = new Date();
            return true;
        }

        return false;
    }

    public addSolution(solution: string) {
        let fitness = this.evaluateString(solution)
        this.solutions.push({regex: solution, fitness, date: new Date(), count: this.evalutionCount});
    }

    public addLocalSolution(solution: string) {
        let fitness = this.evaluateString(solution);
        this.localSolutions.push({regex: solution, fitness, date: new Date(), count: this.evalutionCount});
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

    public getNeighborhoodLength(solution: string): number {
        let ret = 0;
        let len = solution.length;
        let chars = this.validLeftChars.length + 4;

        ret += (chars * len) * 2;
        ret += (chars * len) * 3;
        ret += ((this.validLeftChars.length * 2) * len) * 2;
        ret += (this.rightCharsNotInLeft.length) * len;
        ret += (this.rightCharsNotInLeft.length * 2) * len;

        return ret;
    }

    public * generateNeighborhood(solution: string) {
        let len = solution.length;
        let firstLetter = solution.substr(0, 1);
        let lastLetter  = solution.substr(-1);
        let chars = this.validLeftChars.concat(['', '^', '$', '*']);

        let isValid = (text: string | string[]): boolean => {
            if (Array.isArray(text)) text = text.join('');
            return this.isValidRegex(text);
        };

        // Operation: Removing a char
        for (let i = 0; i <= len; i++) {
            yield solution.substr(0, i) + solution.substr(i + 1);
        }

        // Operator: Concatenation
        for(let i = 0; i <= len; i++) {
            for(let j = 0; j < chars.length; j++) {
                let char = chars[j];
                // if (char == '^' && firstLetter == '^') continue;
                // if (char == '$' && lastLetter  == '$') continue;

                // Swapping
                let currentSolution = solution.split('');
                currentSolution[i] = char;
                if (isValid(currentSolution)) yield currentSolution.join('');

                // Appending
                let anotherSolution = solution.substr(0, i) + char + solution.substr(i)
                if (isValid(anotherSolution)) yield anotherSolution;
            }
        }

        // Operator: Or
        for(let i = 0; i <= len; i++) {
            for(let j = 0; j < chars.length; j++) {
                let char = chars[j];

                let currentSolution = solution.substr(0, i) + '|' + solution.substr(i);
                if (isValid(currentSolution)) yield currentSolution;

                currentSolution = solution.substr(0, i) + char + '|' + solution.substr(i);
                if (isValid(currentSolution)) yield currentSolution;

                currentSolution = solution.substr(0, i) + '|' + char + solution.substr(i);
                if (isValid(currentSolution)) yield currentSolution;
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
                if (isValid(currentSolution)) yield currentSolution.join('');

                let anotherSolution = solution.substr(0, i) + range + solution.substr(i);
                if (isValid(anotherSolution)) yield anotherSolution;
            }
        }

        // Operator: Negation
        for(let i = 0; i <= len; i++) {
            for(let j = 0; j < this.rightCharsNotInLeft.length; j++) {
                let char = '[^'+ this.rightCharsNotInLeft[j] + ']';
                let currentSolution = solution.substr(0, i) + char + solution.substr(i);
                if (isValid(currentSolution)) yield currentSolution;
            }
        }

        // Operator: Concatenation (but from right chars not in left)
        for(let i = 0; i <= len; i++) {
            for(let j = 0; j < this.rightCharsNotInLeft.length; j++) {
                let char = chars[j];

                // Swapping
                let currentSolution = solution.split('');
                currentSolution[i] = char;
                if (isValid(currentSolution)) yield currentSolution.join('');

                // Appending
                let anotherSolution = solution.substr(0, i) + char + solution.substr(i)
                if (isValid(anotherSolution)) yield anotherSolution;
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

    public getBestSolution(): Solution {
        return this.solutions.length > 0 ? this.solutions[0] : this.localSolutions[0];
    }

    public generateViaILS(solution: string): Individual {
        let count = 0;
        let ind = this.factory.createFromString(solution);

        while (count < 5) {
            let neo = this.factory.generateRandomlyFrom(ind);
            if (!this.isValidRegex(neo.toString())) continue;

            ind = neo;
            count ++;
        }

        return ind;
    }

    public _generateViaILS(solution: string): Individual {
        let count = 0;

        while (count < 5) {
            let maxLength = this.getNeighborhoodLength(solution);
            let index = Utils.nextInt(maxLength);

            let neighborhood = this.generateNeighborhood(solution);
            let i = 0;
            let neighbor;
            while (i < index) {
                neighbor = neighborhood.next();
                if (neighbor.done) break;
                i ++;
            }

            // There is a chance that we don't get a valid solution
            // In this case, let's generate one with the same length #shrug
            if (!this.isValidRegex(neighbor.value)) {
                let ind = this.factory.generateRandom(neighbor.value.length);
                neighbor.value = ind.toString();
            }

            solution = neighbor.value;
            count ++;
        }

        let ind = this.factory.createFromString(solution);
        return ind;
    }
}
