const colors = require('colors/safe');
import Program from "./Program";
import Utils from "../Utils";


const program = new Program('books');
program.init();

console.log('[Instance]: ', program.instanceName);
console.log('[left Phrases]: ', program.left);
console.log('[right Phrases]: ', program.right);

console.log(`[left Chars]: ${program.validLeftChars}`);
console.log(`[right Chars]: ${program.validRigthChars}`);
console.log('[left Chars Not In Right]: ', program.leftCharsNotInRight);
console.log('[right Chars Not In Left]: ', program.rightCharsNotInLeft);


//var ind = program.generateInitialIndividual();
let ind = program.factory.generateRandom(Utils.nextInt(5));
program.budget = 100;


let solution = ind.toString();
let bestFitness = program.evaluateString(solution);
console.log('');
console.log(colors.green(`Initial: ${solution}`));

do {
    var hasFoundBetter = false;

    if (program.isBestRegex(solution)) {
        program.addSolution(solution);
    }

    if (program.shouldStop()) break;
    program.i += 1;
    if (program.i % 10 == 0) {
        console.log(' ');
        console.log(colors.magenta(`[loop ${program.i} of ${program.budget}]`));
        console.log(' ');
    }

    let neighborhood = program.generateNeighborhood(solution);
    let bestNeighbor = null;
    do {
        var neighbor = neighborhood.next();
        if (neighbor.done) break;
        let fitness = program.evaluateString(neighbor.value);

        if (fitness > bestFitness) {
            bestFitness = fitness;
            solution = neighbor.value;
            hasFoundBetter = true;
            console.log(`[Found better]: ${neighbor.value} ${fitness} of ${program.getMaxFitness()} o/`);
        } else {
            if (fitness == bestFitness && solution != neighbor.value && neighbor.value.length < solution.length) {
                bestNeighbor = neighbor.value;
                console.log(`[Found shorter]: ${neighbor.value} ${fitness} of ${program.getMaxFitness()} o/`);
            }
        }
    } while(true)

    if (bestNeighbor) {
        solution = bestNeighbor;
        continue;
    }

    if (!hasFoundBetter) {
        console.log(colors.yellow(`[Best local is]: ${solution} ${bestFitness} of ${program.getMaxFitness()}`));

        // We restart randonlly
        let ind = program.factory.generateRandom(Utils.nextInt(5));
        solution = ind.toString();
        bestFitness = program.evaluateString(solution);
        console.log(' ');
        console.log(colors.green(`[Jumped to]: ${solution} ${bestFitness} of ${program.getMaxFitness()}`));
    }

} while(true);


console.log(' ');
console.log(`Was found ${program.solutions.length} solution(s)`);


program.solutions.sort((a, b) => {
    let Afitness = program.evaluateString(a);
    let Bfitness = program.evaluateString(b);
    if (Afitness > Bfitness) return -1;
    if (Afitness < Bfitness) return 1;

    if (a.length > b.length) return 1;
    if (a.length < b.length) return -1;

    return 0;
});

program.solutions.forEach(solution => {
    let fitness = program.evaluateString(solution);
    console.log(`[Solution]: ${solution}; [Fitness ${fitness} of ${program.getMaxFitness()}]; [Length ${solution.length}]`);
});