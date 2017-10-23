import Program from "./Program";


const program = new Program('books');
program.init();

var ind = program.generateInitialIndividual();
console.log('Initial', ind.toString());

/*
do {
    if (program.isValid(ind)) break;

    var neighborhood = program.generateNeighborhood(ind);
    while (true) {
        var item = neighborhood.next();
        if (item.done) break;

        var neighbor = item.value;
        program.evaluate(neighbor);
        console.log('neighbor', neighbor.toString(), neighbor.fitness);

        if(neighbor.fitness > ind.fitness) {
            ind = neighbor;
        } else if (neighbor.fitness == ind.fitness) {
            // tiebreaker
            if (neighbor.tree.toString().length < ind.tree.toString().length) {
                ind = neighbor;
            }
        }
    }

} while (true);
*/


do {
    if (program.isValid(ind)) break;

    let chars = program.getCharsInLeftNotInRight();
    let neighbor = program.getRandomNeighbor(ind, chars);

    program.evaluate(neighbor);
    console.log('neighbor', neighbor.toString(), neighbor.fitness);

    if (neighbor.fitness > ind.fitness) {
        ind = neighbor;
    } else if (neighbor.fitness == ind.fitness) {
        // tiebreaker
        if (neighbor.tree.toString().length < ind.tree.toString().length) {
            ind = neighbor;
        }
    }

} while(true);

console.log('Solution', ind.toString());
