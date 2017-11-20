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
            let neo = program.doCrossover(ind, population);
            population.add(neo);
        }

        chance = Utils.nextInt(100);
        if (chance < program.mutationProbability) {
            let neo = program.doMutation(ind);
            population.add(neo);
        }
    });

    // 4. Seleção
    program.doSelection(population);

    // 5. Repeat
} while (true);

debugger;
var a = 1;