import Program from "./Program";


const program = new Program('books');
program.init();

var ind = program.generateInitialIndividual();
let solution = ind.toString();
let bestFitness = program.evaluateString(solution);
console.log('Initial: ', ind.toString());

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
            if (fitness == bestFitness && solution != neighbor.value) {
                bestNeighbor = neighbor.value;
            }
            console.log(neighbor.value, fitness);
        }
    } while(true)

    if (bestNeighbor) {
        solution = bestNeighbor;
        continue;
    }

} while(hasFoundBetter);


console.log('Solution: ', solution, bestFitness);

/*

var maxEvaluations = 50000;

do {
    if (program.isBest(ind)) break;

    let neighbor = program.getRandomNeighbor(ind);
    program.evaluate(neighbor);

    if (neighbor.fitness > ind.fitness) {
        console.log(`Better: [${ind.toString()} ${ind.fitness}] -> [${neighbor.toString()} ${neighbor.fitness}]`);
        ind = neighbor;
    } else if (neighbor.fitness == ind.fitness) {
        // tiebreaker
        if (neighbor.tree.toString().length <= ind.tree.toString().length) {
            ind = neighbor;
        }
    }

} while(--maxEvaluations > 0);

console.log('Solution', ind.toString(), ind.fitness);
*/
