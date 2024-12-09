// https://adventofcode.com/2024/day/9

import { readFileSync } from 'fs';

type File = {
  id: number;
  size: number;
};

type FreeSpace = {
  size: number;
};

type DiskChunk = File | FreeSpace;

type Disk = DiskChunk[];

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const line = inputLines[0];

  const disk = parseInput(line);
  const compactedDisk = compact(disk);
  const checksum = getChecksum(compactedDisk);

  return {
    part1: checksum,
  };
}

function parseInput(line: string): Disk {
  const disk: Disk = [];
  let currId = 0;
  let isFile = true;

  for (let i = 0; i < line.length; i++) {
    const size = Number(line[i]);

    if (isFile) {
      disk.push({
        id: currId,
        size,
      });
      currId++;
      isFile = false;
    } else {
      disk.push({ size });
      isFile = true;
    }
  }

  return disk;
}

function compact(disk: Disk) {
  const newDisk = [];

  let startIndex = 0;
  let endIndex = disk.length;
  let currentSpace: FreeSpace;
  let currentFile: File;

  newDisk.push({ ...disk[startIndex] });
  startIndex++;

  currentSpace = disk[startIndex];

  endIndex--;
  currentFile = disk[endIndex] as any;
  while (!('id' in currentFile)) {
    endIndex--;
    currentFile = disk[endIndex] as File;
  }

  while (endIndex > startIndex) {
    if (currentSpace.size >= currentFile.size) {
      newDisk.push({
        id: currentFile.id,
        size: currentFile.size,
      });
      currentSpace.size = currentSpace.size - currentFile.size;

      if (currentSpace.size === 0) {
        startIndex++;
        newDisk.push({ ...disk[startIndex] });

        startIndex++;
        currentSpace = disk[startIndex] as FreeSpace;
      }

      endIndex--;
      // skip free space

      endIndex--;
      currentFile = disk[endIndex] as File;
    } else {
      newDisk.push({
        id: currentFile.id,
        size: currentSpace.size,
      });

      currentFile.size = currentFile.size - currentSpace.size;

      startIndex++;
      newDisk.push({ ...disk[startIndex] });

      startIndex++;
      currentSpace = disk[startIndex] as FreeSpace;
    }
  }

  return newDisk;
}

function getChecksum(disk: Disk): number {
  let n = 0;
  let checksum = 0;

  for (let i = 0; i < disk.length; i++) {
    const file = disk[i] as File;
    for (let j = 0; j < file.size; j++) {
      checksum += n * file.id;
      n++;
    }
  }

  return checksum;
}
