import Individual from "../Individual";


export default interface MutationOperator {
    mutate(father: Individual, values: string[]): Individual;
}