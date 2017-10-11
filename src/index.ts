import Func from "./nodes/Func";
import Individual from "./Individual";
import Utils from "./Utils";


class Program {
    public validChars: string[] = [];
    public left: string[] = [];
    public right: string[] = [];

    constructor(public instanceName: string) {
        let instance = Utils.loadInstance(instanceName);
        this.left = instance.left;
        this.right = instance.right;
    }

    public init(): void {
        this.validChars = this.extractUniqueChars(this.left);
    }

    public extractUniqueChars(text: string[]): string[] {
        let letters = new Set();
        this.left.forEach(name => name.split('').forEach(letter => letters.add(letter)));

        let chars: string[] = [];
        letters.forEach(letter => chars.push(letter));
        return chars;
    }

    public isValidLeftSolution(regex: RegExp): boolean {
        return this.left.every(name => regex.test(name));
    }
}



const program = new Program('family');
program.init();







// const matchList: string[] = ["andre", "bruno"];
// const unmatchList: string[] = ["adriana", "victor"];
// const options: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
//                            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
//                            "\w"];


// var current = "a";


// function isValidSolution(solution: string): boolean {
//     let regex = new RegExp(solution);
//     return matchList.every(item => regex.test(item)) && unmatchList.every(item => !regex.test(item));
// }

// function evaluteSolution(solution: string): number {
//     let score = 0;
//     let regex = new RegExp(solution);
//     matchList.forEach(item => score += regex.test(item) ? 1 : 0);
//     unmatchList.forEach(item => score -= regex.test(item) ? 1 : 0);
//     return score;
// }

// function* generateNeighbors(solution: string) {
//     let ret: string[] = [];

//     let options = ['^', '$'];

//     yield* options;
// }


// while (!isValidSolution(current)) {
//     let neighbors = generateNeighbors(current);
// }
