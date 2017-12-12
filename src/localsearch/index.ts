const colors = require('colors/safe');
import Program from "./Program";
import Utils from "../Utils";


const program = new Program('ranges');
program.init();


const LOG_LEVEL = 2;
function log(level: number, message: string) {
    if (level <= LOG_LEVEL) console.log(message);
}

const DEPTH = 5;

log(1, `[Instance]: ${program.instanceName}`);
log(1, `[left Phrases]: ${program.left}`);
log(1, `[right Phrases]: ${program.right}`);

log(1, `[left Chars]: ${program.validLeftChars}`);
log(1, `[right Chars]: ${program.validRigthChars}`);
log(1, `[left Chars Not In Right]: ${program.leftCharsNotInRight}`);
log(1, `[right Chars Not In Left]: ${program.rightCharsNotInLeft}`);


//var ind = program.generateInitialIndividual();
let ind = program.factory.generateRandom(DEPTH);
program.budget = 100000 * 6;


let solution = ind.toString();
let bestFitness = program.evaluateString(solution);
log(1, '');
log(1, colors.green(`Initial: ${solution}`));

do {
    var hasFoundBetter = false;

    if (program.isBestRegex(solution)) {
        program.addSolution(solution);
    }

    if (program.shouldStop()) break;
    log(3, colors.magenta(`[Evaluations ${program.evalutionCount} of ${program.budget}]`));

    let neighborhood = program.generateNeighborhood(solution);
    let bestNeighbor = null;
    do {
        var neighbor = neighborhood.next();
        if (neighbor.done) break;
        let fitness = program.evaluateString(neighbor.value);
        log(4, `[Neighbor]: ${neighbor.value}`);

        if (fitness > bestFitness) {
            bestFitness = fitness;
            solution = neighbor.value;
            hasFoundBetter = true;
            log(3, `[Found better]: ${neighbor.value} ${fitness} of ${program.getMaxFitness()} o/`);
        } else {
            if (fitness == bestFitness && solution != neighbor.value && neighbor.value.length < solution.length) {
                bestNeighbor = neighbor.value;
                log(3, `[Found shorter]: ${neighbor.value} ${fitness} of ${program.getMaxFitness()} o/`);
            }
        }
    } while(true)

    if (bestNeighbor) {
        solution = bestNeighbor;
        continue;
    }

    if (!hasFoundBetter) {
        log(2, colors.yellow(`[Best local is]: ${solution} ${bestFitness} of ${program.getMaxFitness()}`));
        program.localSolutions.push(solution);

        // We restart randonlly
        let ind = program.factory.generateRandom(DEPTH);
        solution = ind.toString();
        bestFitness = program.evaluateString(solution);
        log(2, ' ');
        log(2, colors.green(`[Jumped to]: ${solution} ${bestFitness} of ${program.getMaxFitness()}`));
    }

} while(true);

function sorter(a:string, b: string): number {
    let Afitness = program.evaluateString(a);
    let Bfitness = program.evaluateString(b);
    if (Afitness > Bfitness) return -1;
    if (Afitness < Bfitness) return 1;

    if (a.length > b.length) return 1;
    if (a.length < b.length) return -1;

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
    let fitness = program.evaluateString(solution);
    log(3, `[Local Solution]: ${solution}; [Fitness ${fitness} of ${program.getMaxFitness()}]; [Length ${solution.length}]`);
});

log(3, ' ');
log(1, `Was found ${program.solutions.length} solution(s)`);

program.solutions.sort(sorter);
program.solutions.forEach((solution, i) => {
    let fitness = program.evaluateString(solution);
    let txt = `[Solution]: ${solution}; [Fitness ${fitness} of ${program.getMaxFitness()}]; [Length ${solution.length}]`;
    log(1, (i == 0) ? colors.green(txt) : txt);
});