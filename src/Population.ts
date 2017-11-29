import Individual from "./Individual";
import Utils from "./Utils";


export default class Population {
    protected individuals: Individual[] = [];
    private dirty: boolean = true;

    public get length(): number {
        return this.individuals.length;
    }

    public sortByFitness(): void {
        this.individuals.sort((a, b) => b.fitness - a.fitness);
    }

    public forEach(fn: (ind:Individual) => void | boolean): void {
        let len = this.individuals.length;
        for (let i = 0; i < len; i ++) {
            let shouldContinue = fn(this.individuals[i]);
            if (shouldContinue == false) break;
        }
    }

    public get(index: number): Individual {
        return this.individuals[index];
    }

    public add(ind: Individual): void {
        this.individuals.push(ind);
        this.dirty = true;
    }

    public addAll(inds: Individual[]): void {
        inds.forEach(ind => this.add(ind));
    }

    public removeByIndex(index: number): void {
        this.individuals.splice(index, 1);
    }

    public isDirty(): boolean {
        return this.dirty;
    }

    public getUsingRoullete(): Individual {
        if (this.isDirty()) {
            // TODO: add the roullete implementation
        }

        // TODO: Improve this
        return Utils.getRandomlyFromList(this.individuals);
    }
}