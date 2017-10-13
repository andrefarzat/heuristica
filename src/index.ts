import Program from "./Program";


const program = new Program('books');
program.init();

var ind = program.generateInitialIndividual();
console.log('Initial', ind.toString());

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
        }
    }

} while (true);



console.log('Solution', ind.toString());
