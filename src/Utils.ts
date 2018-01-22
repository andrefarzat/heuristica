import * as fs from "fs";
import * as path from "path";
import Func from "./nodes/Func";
import Node from "./nodes/Node";


export default class Utils {
    static loadInstance(instanceName: string): {left: string[], right: string[]} {
        let pathToLeftFile  = path.join(__dirname, '..', 'instances', instanceName, 'left.txt');
        let pathToRightFile = path.join(__dirname, '..', 'instances', instanceName, 'right.txt');

        return {
            left: Utils.getTxtFileAsArray(pathToLeftFile),
            right: Utils.getTxtFileAsArray(pathToRightFile)
        };
    }

    static getTxtFileAsArray(pathToFile: string): string[] {
        let fileContent = fs.readFileSync(pathToFile);
        return fileContent.toString().split('\n').map(line => line.trim()).filter(line => line);
    }

    static nextInt(max: number = 10): number {
        return Math.round(Math.random() * max);
    }

    static nextBoolean(): boolean {
        return Utils.nextInt(1) == 0;
    }

    static sortObjectByValue(obj: {[key: string]: number}): {[key: string]: number} {
        let items = Object.keys(obj).map(key => [key, obj[key]]);
        items.sort((first, second) => (<number>second[1]) - (<number>first[1]));

        let newObj: {[key: string]: number} = {};
        items.forEach(item => {
            newObj[item[0]] = item[1] as number;
        });
        return newObj;
    }

    static getRandomlyFromList<T>(list: T[]) {
        let len = list.length;
        let index = Utils.nextInt(len > 0 ? len - 1 : 0);
        return list[index];
    }

    static getUniqueChars(str: string): string {
        let ret: string[] = [];
        (new Set(str)).forEach(s => ret.push(s));
        return ret.join('');
    }
}
