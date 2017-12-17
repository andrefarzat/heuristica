const colors = require('colors/safe');
const args = require('args');
import * as moment from "moment";
import Program, {Solution} from "./Program";
import Utils from "../Utils";


args.option('name', 'O nome da instancia')
    .option('depth', 'O tamanho do depth (default 5)');

const flags = args.parse(process.argv);

if (!flags.name) {
    args.showHelp();
    process.exit();
}

function vai(index: number) {
    const program = new Program(flags.name);
    program.init();


    const LOG_LEVEL = 3;
    function log(level: number, message: string) {
        if (level <= LOG_LEVEL) console.log(message);
    }

    const DEPTH = flags.depth || 5;

    log(1, `[Instance]: ${program.instanceName}`);
    log(1, `[left Phrases]: ${program.left}`);
    log(1, `[right Phrases]: ${program.right}`);

    log(1, `[left Chars]: ${program.validLeftChars}`);
    log(1, `[right Chars]: ${program.validRightChars}`);
    log(1, `[left Chars Not In Right]: ${program.leftCharsNotInRight}`);
    log(1, `[right Chars Not In Left]: ${program.rightCharsNotInLeft}`);


    // let ind = program.factory.generateRandom(DEPTH);
    let currentSolution = program.generateInitialIndividual();
    program.budget = 100000 * 6;

    log(1, '');
    log(1, colors.green(`Initial: ${currentSolution.toString()}`));

    do {
        var hasFoundBetter = false;

        if (program.isBest(currentSolution)) {
            program.addSolution(currentSolution);
        }

        if (program.shouldStop()) break;
        log(3, colors.magenta(`[Evaluations ${program.evalutionCount} of ${program.budget}]`));

        let neighborhood = program.generateNeighborhood(currentSolution);
        do {
            var neighbor = neighborhood.next();
            if (neighbor.done) break;
            program.evaluate(neighbor.value);
            log(4, `[Neighbor] ${neighbor.value} [fitness] ${neighbor.value.fitness}`);

            if (neighbor.value.fitness > currentSolution.fitness) {
                log(3, `[Found better ${neighbor.value}] from fitness ${currentSolution.fitness} to ${neighbor.value.fitness} of ${program.getMaxFitness()} o/`);
                currentSolution = neighbor.value;
                hasFoundBetter = true;
            } else {
                let theyAreDiffAndHaveTheSameFitness = neighbor.value.fitness == currentSolution.fitness && currentSolution.toString() != neighbor.value.toString();
                if (theyAreDiffAndHaveTheSameFitness) {
                    let newSolutionIsLessen = neighbor.value.toString().length < currentSolution.toString().length;
                    if (newSolutionIsLessen) {
                        log(3, `[Found shorter ${neighbor.value.toString()}] from length ${currentSolution.toString().length} to ${neighbor.value.toString().length} o/`);
                        currentSolution = neighbor.value;
                        hasFoundBetter = true;
                        continue;
                    }

                    let hasBetterLeftFitness = neighbor.value.leftFitness > currentSolution.leftFitness;
                    if (hasBetterLeftFitness) {
                        log(3, `[Found better left fitness ${neighbor.value.toString()}] from ${currentSolution.leftFitness} to ${neighbor.value.leftFitness} of ${program.getMaxFitness()} o/`);
                        currentSolution = neighbor.value;
                        hasFoundBetter = true;
                        continue;
                    }
                }
            }
        } while(true)

        if (!hasFoundBetter) {
            log(2, colors.yellow(`[Best local is]: ${currentSolution.toString()} ${currentSolution.fitness} of ${program.getMaxFitness()}`));
            program.addLocalSolution(currentSolution);

            // We restart randonly
            currentSolution = program.factory.generateRandom(DEPTH);
            program.evaluate(currentSolution);

            // We restart using ILS
            // solution = program.generateViaILS(solution);
            // bestFitness = program.evaluate(solution);
            log(2, ' ');
            log(2, colors.green(`[Jumped to]: ${currentSolution} ${currentSolution.fitness} of ${program.getMaxFitness()}`));
        }

    } while(true);

    function sorter(a: Solution, b: Solution): number {
        if (a.ind.fitness > b.ind.fitness) return -1;
        if (a.ind.fitness < b.ind.fitness) return 1;

        if (a.ind.toString().length > b.ind.toString().length) return 1;
        if (a.ind.toString().length < b.ind.toString().length) return -1;

        return 0;
    };

    // // Local solutions
    // log(2, ' ');
    // log(2, `Was found ${program.localSolutions.length} local solution(s)`);

    // Solutions
    log(1, ' ');
    log(2, `Was found ${program.localSolutions.length} local solution(s)`);
    program.localSolutions.sort(sorter);
    program.localSolutions.forEach(solution => {
        log(3, `[Local Solution]: ${solution.ind.toString()} [Fitness ${solution.ind.fitness} of ${program.getMaxFitness()}] [Length ${solution.ind.toString().length}]`);
    });

    log(3, ' ');
    log(1, `Was found ${program.solutions.length} solution(s)`);

    program.solutions.sort(sorter);
    program.solutions.forEach((solution, i) => {
        let txt = `[Solution]: ${solution.ind.toString()} [Fitness ${solution.ind.fitness} of ${program.getMaxFitness()}] [Length ${solution.ind.toString().length}]`;
        log(1, (i == 0) ? colors.green(txt) : txt);
    });



    if (LOG_LEVEL > 0) process.exit();

    !function() {
        let bestSolution = program.getBestSolution();
        let time = moment(bestSolution.date).diff(program.startTime, 'milliseconds');
        let totalTime = moment(program.endTime).diff(program.startTime, 'milliseconds');

        // Nome, Depth, i, Melhor solução, Melhor fitness, Número de comparações, Tempo para encontrar melhor solução, Tempo total
        let txt = [flags.name, DEPTH, index, bestSolution.toString(), bestSolution.ind.fitness, bestSolution.count, time, totalTime].join(',');
        console.log(txt);
    }();
}


for (let ii = 1; ii <= 30; ii++) vai(ii);