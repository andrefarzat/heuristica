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
var ind = program.factory.generateRandom(Utils.nextInt(5));

let solution = ind.toString();
let bestFitness = program.evaluateString(solution);
console.log('');
console.log('Initial: ', solution);


do {
    var hasFoundBetter = false;
    if (program.isBestRegex(solution)) break;

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
            console.log(neighbor.value, fitness, 'o/');
        } else {
            if (fitness == bestFitness && solution != neighbor.value && neighbor.value.length < solution.length) {
                bestNeighbor = neighbor.value;
            }
        }
    } while(true)

    if (bestNeighbor) {
        solution = bestNeighbor;
        continue;
    }

} while(hasFoundBetter);


console.log(`Solution: ${solution}`);
console.log(`Fitness: ${bestFitness} of ${program.left.length + program.right.length}`);