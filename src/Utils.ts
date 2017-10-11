import * as fs from "fs";
import * as path from "path";


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
}
