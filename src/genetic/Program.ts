import BaseProgram from "../BaseProgram";
import Population from "../Population";
import Func from "../nodes/Func";
import Individual from "../Individual";
import IndividualFactory from "../IndividualFactory";
import Terminal from "../nodes/Terminal";
import MutationOperator from "../operators/MutationOperator";
import CrossoverOperator from "../operators/CrossoverOperator";
import SubtreeCrossover from "../operators/SubtreeCrossover";
import Utils from "../Utils";


export default class Program extends BaseProgram {
    public crossoverProbability = 80;
    public mutationProbability = 30;

    private crossoverOperator: CrossoverOperator;
    private mutationOperator: MutationOperator;

    constructor(public instanceName: string) {
        super(instanceName);

        this.crossoverOperator = new SubtreeCrossover();
    }

    public generateInitialPopulation(): Population {
        return new Population();
    }

    public doCrossover(father: Individual, population: Population): Individual {
        let mother = population.getUsingRoullete();
        return this.crossoverOperator.cross(father, mother);
    }

    public doMutation(father: Individual): Individual {
        let chars = this.validLeftChars.concat(this.validRigthChars);
        return this.mutationOperator.mutate(father, chars);
    }

}
