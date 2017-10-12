import Program from "./Program";


const program = new Program('family');
program.init();

var ind = program.generateInitialIndividual();
console.log(ind.toString());



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
