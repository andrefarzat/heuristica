import Program from "./Program";


const program = new Program('books');
program.init();

var ind = program.generateInitialIndividual();
console.log('Initial', ind.toString());

var maxEvaluations = program.maxEvaluations;

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
