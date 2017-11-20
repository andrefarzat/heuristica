import BaseProgram from "../BaseProgram";
import Func from "../nodes/Func";
import Individual from "../Individual";
import Terminal from "../nodes/Terminal";


export default class Program extends BaseProgram {

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
