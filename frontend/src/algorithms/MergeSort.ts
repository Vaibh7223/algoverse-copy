export type SortStep = {
  array: number[];
  comparing: number[]; // indices currently being compared
  swapping: number[];  // indices currently moving/swapping
  sorted: number[];    // indices confirmed in final position (optional for merge sort to mark segments later)
  activeRange: [number, number] | null; // [start, end] of current subarray
  message: string;
};

export function getMergeSortSteps(initialArray: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const array = [...initialArray];

  // Helper to push a step frame safely
  const recordStep = (
    arr: number[],
    comparing: number[] = [],
    swapping: number[] = [],
    activeRange: [number, number] | null = null,
    message: string = ""
  ) => {
    steps.push({
      array: [...arr],
      comparing,
      swapping,
      sorted: [], // We'll populate this later if we want a global sweep
      activeRange,
      message,
    });
  };

  recordStep(array, [], [], [0, array.length - 1], "Initial array");

  function merge(left: number, mid: number, right: number) {
    const temp: number[] = [];
    let i = left;
    let j = mid + 1;

    recordStep(array, [], [], [left, right], `Merging subarrays: [${left}-${mid}] and [${mid + 1}-${right}]`);

    while (i <= mid && j <= right) {
      recordStep(array, [i, j], [], [left, right], `Comparing ${array[i]} and ${array[j]}`);

      if (array[i] <= array[j]) {
        temp.push(array[i]);
        i++;
      } else {
        temp.push(array[j]);
        j++;
      }
    }

    while (i <= mid) {
      temp.push(array[i]);
      i++;
    }

    while (j <= right) {
      temp.push(array[j]);
      j++;
    }

    // Copy temp array back to the original array
    for (let k = 0; k < temp.length; k++) {
      const idx = left + k;
      array[idx] = temp[k];
      recordStep(array, [], [idx], [left, right], `Placed ${temp[k]} into position ${idx}`);
    }
    
    recordStep(array, [], [], null, `Merged section is sorted`);
  }

  function mergeSort(left: number, right: number) {
    if (left >= right) {
      return;
    }

    const mid = Math.floor((left + right) / 2);

    recordStep(array, [], [], [left, right], `Dividing array from index ${left} to ${right}`);

    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  }

  mergeSort(0, array.length - 1);
  
  // Final step
  recordStep(array, [], [], null, "Array is fully sorted!");

  return steps;
}
