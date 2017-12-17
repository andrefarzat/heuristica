import BaseProgram from "../BaseProgram";
import Population from "../Population";
import Func from "../nodes/Func";
import Individual from "../Individual";
import IndividualFactory from "../IndividualFactory";
import Terminal from "../nodes/Terminal";
import MutationOperator from "../operators/MutationOperator";
import CrossoverOperator from "../operators/CrossoverOperator";
import SubtreeCrossover from "../operators/SubtreeCrossover";
import PointMutation from "../operators/PointMutation";
import Utils from "../Utils";


export default class Program extends BaseProgram {
    readonly crossoverProbability = 80;
    readonly mutationProbability = 30;
    readonly populationSize = 1000;
    readonly maxGenerationNumber = 300;
    public readonly maxInitialDepth = 5;

    public generationNumber = 0;
    private crossoverOperator: CrossoverOperator;
    private mutationOperator: MutationOperator;

    constructor(public instanceName: string) {
        super(instanceName);

        this.crossoverOperator = new SubtreeCrossover();
        this.mutationOperator = new PointMutation();
    }

    public generateInitialPopulation(): Population {
        let pop = new Population();

        // 1. One individual for each string in left
        this.left.forEach(phrase => {
            let neo = this.factory.createFromString(phrase);
            pop.add(neo);
        });

        // 2. One individual for each valid char in left
        this.validLeftChars.forEach(letter => {
            let neo = this.factory.createFromString(letter);
            pop.add(neo);
        });

        // 3. Generate individuals until we finish our population
        while (pop.length < this.populationSize) {
            let depth = Utils.nextInt(this.maxInitialDepth);
            let neo = this.factory.generateRandom(depth);
            pop.add(neo);
        }

        return pop;
    }

    public shouldStop(population: Population): boolean {
        let hasFound = false;

        population.forEach(ind => {
            if (this.isBest(ind)) {
                hasFound = true;
                return false; // stop
            }
        });

        // if (hasFound) return hasFound;
        return this.generationNumber >= this.maxGenerationNumber;
    }

    public doCrossover(father: Individual, population: Population): Individual {
        let mother = population.getUsingRoullete();
        return this.crossoverOperator.cross(father, mother);
    }

    public doMutation(father: Individual): Individual {
        let chars = this.validLeftChars.concat(this.validRightChars);
        return this.mutationOperator.mutate(father, chars);
    }

    public doSelection(population: Population): void {
        // selecting by elitism
        population.sortToElitism();

        let len = population.length;

        while (len > this.populationSize) {
            len -= 1;
            population.pop();
        }

        this.generationNumber ++;
    }

}
