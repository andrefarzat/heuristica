import Program from "./Program";


const program = new Program('names');
program.init();

var ind = program.generateInitialIndividual();
let solution = ind.toString();
let bestFitness = program.evaluateString(solution);
console.log('Initial: ', solution);

console.log('[leftCharsNotInRight]: ', program.leftCharsNotInRight);
console.log('[rightCharsNotInLeft]: ', program.rightCharsNotInLeft);

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