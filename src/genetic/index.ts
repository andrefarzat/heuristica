import Program from "./Program";
import Individual from "../Individual";
import Population from "../Population";
import Utils from "../Utils";


const program = new Program('abba');
program.init();


// 1. Gerar geração inicial
var population = program.generateInitialPopulation();

// 2. Avaliar geração
population.forEach(ind => program.evaluate(ind));

do {

    if (program.shouldStop(population)) {
        break;
    }

    // 3. Reprodução
    let len = population.length;
    for(let i = 0; i < len; i ++) {
        let ind = population.get(i);

        let chance = Utils.nextInt(100);
        if (chance < program.crossoverProbability) {
            let neo = program.doCrossover(ind, population);
            program.evaluate(neo);
            population.add(neo);
        }

        chance = Utils.nextInt(100);
        if (chance < program.mutationProbability) {
            let neo = program.doMutation(ind);
            program.evaluate(neo);
            population.add(neo);
        }
    }

    // 3.5 Adicionando 10% de população aleatória
    let qty = Math.round(program.populationSize * 0.10);
    while (qty > 0) {
        let depth = Utils.nextInt(program.maxInitialDepth);
        let neo = program.factory.generateRandom(depth);
        program.evaluate(neo);
        population.add(neo);

        qty --;
    }

    // 4. Seleção
    program.doSelection(population);
    let text = [
        `[gen ${program.generationNumber} of ${program.maxGenerationNumber}]`,
        `[Current best ${population.get(0).fitness} of ${program.getMaxFitness()}] ${population.get(0).toString()}`
    ];
    console.log(text.join(''));

    // 5. Repeat
} while (true);


console.log(`[Best found ${program.currentBest.fitness} of ${program.getMaxFitness()}] ${program.currentBest.toString()}`)