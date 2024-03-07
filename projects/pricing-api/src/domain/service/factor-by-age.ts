import * as fs from 'fs';

import { InvalidAgeError } from '@domain/error';

export class FactorByAge {
  static instance: FactorByAge;
  private root: TreeNode;

  private constructor() {
    this.init();
  }

  static getInstance() {
    if (!FactorByAge.instance) {
      FactorByAge.instance = new FactorByAge();
    }
    return FactorByAge.instance;
  }

  private init(): void {
    const data = JSON.parse(
      fs.readFileSync(`${process.cwd()}/ages.json`, 'utf8'),
    );
    this.root = this.createTree(data);
  }

  private createTree(data: { age: number; factor: number }[]): TreeNode {
    if (data.length === 0) {
      return null;
    }
    const sortedData = data.sort((a, b) => a.age - b.age);
    function createNode(start: number, end: number): TreeNode {
      if (start > end) {
        return null;
      }
      const mid = Math.ceil((start + end) / 2);
      const newNode: TreeNode = {
        age: sortedData[mid].age,
        factor: sortedData[mid].factor,
        left: createNode(start, mid - 1),
        right: createNode(mid + 1, end),
      };
      return newNode;
    }
    return createNode(0, sortedData.length - 1);
  }

  private getNodeByAge(age: number): TreeNode {
    if (age < 18 || age > 60) throw new InvalidAgeError();
    let current = this.root;
    let closest = this.root;
    while (current) {
      if (current.age === age) {
        return current;
      } else if (current.age < age) {
        current = current.right;
      } else {
        closest = current;
        current = current.left;
      }
    }
    return closest;
  }

  getFactor(age: number): number {
    return this.getNodeByAge(age).factor;
  }
}

interface TreeNode {
  age: number;
  factor: number;
  left?: TreeNode;
  right?: TreeNode;
}
