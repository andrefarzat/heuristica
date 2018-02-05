const colors = require('colors/safe');
const args = require('args');
import * as moment from "moment";
import Program, {Solution} from "./Program";
import Utils from "../Utils";
import Logger from "../Logger";

interface Args {
    name: string;
    depth: number;
    csv: boolean;
    logLevel: number;
    index: number;
    timeout: number;
}


args.option('name', 'O nome da instancia')
    .option('depth', 'O tamanho do depth', 5)
    .option('csv', 'Resultado em csv', false)
    .option('log-level', "Log level entre 1 e 5", 3)
    .option('index', 'O índice da execução', 1)
    .option('timeout', "Timeout em miliseconds", 1000 * 60);

const flags: Args = args.parse(process.argv);

if (!flags.name) {
    args.showHelp();
    process.exit();
}

function vai() {
    Utils.setIndex(flags.index);
    const DEPTH = flags.depth;
    const NAME = flags.name;
    const INDEX = flags.index;
    const TIMEOUT = flags.timeout;
    Logger.setLogLevel(flags.csv ? 0 : flags.logLevel);

    const maxTimeout = moment().add(TIMEOUT, 'milliseconds');
    let hasTimedOut: boolean = false;

    const program = new Program(flags.name);
    program.init();

    function log(level: number, message: string) {
        return Logger.log(level, message);
    }

    log(1, `[Instance]: ${program.instanceName}`);
    log(1, `[left Phrases]: ${program.left}`);
    log(1, `[right Phrases]: ${program.right}`);

    log(1, `[left Chars]: ${program.validLeftChars}`);
    log(1, `[right Chars]: ${program.validRightChars}`);
    log(1, `[left Chars Not In Right]: ${program.leftCharsNotInRight}`);
    log(1, `[right Chars Not In Left]: ${program.rightCharsNotInLeft}`);

    let currentSolution = program.factory.generateRandom(DEPTH);
    // let currentSolution = program.generateInitialIndividual();
    program.budget = 100000 * 6;

    log(1, '');
    log(1, colors.green(`Initial: ${currentSolution.toString()}`));

    do {
        if (maxTimeout.diff(new Date()) < 0) {
            hasTimedOut = true;
        }

        if (hasTimedOut) break;
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

            if (neighbor.value.isBetterThan(currentSolution)) {
                currentSolution = neighbor.value;
                hasFoundBetter = true;
            }
        } while(true)

        if (!hasFoundBetter) {
            log(2, colors.yellow(`[Best local is]: ${currentSolution.toString()} ${currentSolution.fitness} of ${program.getMaxFitness()}`));
            program.addLocalSolution(currentSolution);

            // We try to shrink our currentSolution
            let shunkCurrentSolution = currentSolution.shrink();
            program.evaluate(shunkCurrentSolution);

            log(2, ' ');
            if (shunkCurrentSolution.isBetterThan(currentSolution)) {
                let from = currentSolution.toString().length;
                let to = shunkCurrentSolution.toString().length;
                currentSolution = shunkCurrentSolution;

                log(2, `[Shrunk from size ${from} to ${to}`);
            } else {
                // We restart randonly
                // currentSolution = program.factory.generateRandom(DEPTH);
                // program.evaluate(currentSolution);

                // We restart using ILS
                currentSolution = program.generateViaILS(currentSolution);
                program.evaluate(currentSolution);
                log(2, colors.green(`[Jumped to]: ${currentSolution} ${currentSolution.fitness} of ${program.getMaxFitness()}`));
            }

        }

    } while(true);

    function sorter(a: Solution, b: Solution): number {
        if (a.ind.fitness > b.ind.fitness) return -1;
        if (a.ind.fitness < b.ind.fitness) return 1;

        if (a.ind.toString().length > b.ind.toString().length) return 1;
        if (a.ind.toString().length < b.ind.toString().length) return -1;

        return 0;
    };

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



    if (flags.csv === false) process.exit();

    !function() {
        let bestSolution = program.getBestSolution();
        if (!bestSolution) {
            let totalTime = moment(program.endTime).diff(program.startTime, 'milliseconds');
            let txt = [flags.name, DEPTH, INDEX, 'N/A', 0, 0, totalTime, totalTime, hasTimedOut].join(',');
            console.log(txt);
            return;
        }
        let time = moment(bestSolution.date).diff(program.startTime, 'milliseconds');
        let totalTime = moment(program.endTime).diff(program.startTime, 'milliseconds');

        // Nome, Depth, i, Melhor solução, Melhor fitness, Número de comparações, Tempo para encontrar melhor solução, Tempo total, Timed out
        let txt = [flags.name, DEPTH, INDEX, bestSolution.ind.toString(), bestSolution.ind.fitness, bestSolution.count, time, totalTime, hasTimedOut].join(',');
        console.log(txt);
    }();
}


// for (let ii = 1; ii <= 30; ii++) vai(ii);
vai();