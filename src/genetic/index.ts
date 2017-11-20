import Program from "./Program";
import Individual from "../Individual";
import Population from "../Population";
import Utils from "../Utils";


const program = new Program('four');
program.init();


// 1. Gerar geração inicial
var population = program.generateInitialPopulation();

do {
    // 2. Avaliar geração
    population.forEach(ind => program.evaluate(ind));

    if (program.shouldStop(population)) {
        break;
    }

    // 3. Reprodução
    population.forEach(ind => {
        let chance = Utils.nextInt(100);
        if (chance < program.crossoverProbability) {
            let newInd = program.doCrossover(ind, population);
            population.add(newInd);
        }

        chance = Utils.nextInt(100);
        if (chance < program.mutationProbability) {
            let newInd = program.doMutation(ind);
        }
    });

    // 4. Seleção
    population = program.doSelection(population);

    // 5. Repeat
} while (true);

debugger;
var a = 1;