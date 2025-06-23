// Delay function for visualization
function delay() {
    return new Promise(resolve => {
        const speedMap = {
            1: 500, 2: 400, 3: 300, 4: 200, 5: 100,
            6: 50, 7: 25, 8: 10, 9: 5, 10: 1
        };
        
        const timeoutId = setTimeout(() => {
            resolve();
            state.timeoutIds = state.timeoutIds.filter(id => id !== timeoutId);
        }, speedMap[state.speed]);
        
        state.timeoutIds.push(timeoutId);
    });
}

// Swap two elements in the array and visualize
async function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    state.swaps++;
    renderBars([i, j]);
    updateStats();
    await delay();
}

// Bubble Sort
async function bubbleSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            state.comparisons++;
            updateStats();
            
            if (arr[j] > arr[j + 1]) {
                await swap(arr, j, j + 1);
            }
            
            if (!state.isSorting) return;
        }
    }
    
    state.array = arr;
    finishSorting();
}

// Selection Sort
async function selectionSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        
        for (let j = i + 1; j < n; j++) {
            state.comparisons++;
            updateStats();
            
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
            
            renderBars([i, j, minIdx]);
            await delay();
            if (!state.isSorting) return;
        }
        
        if (minIdx !== i) {
            await swap(arr, i, minIdx);
        }
    }
    
    state.array = arr;
    finishSorting();
}

// Insertion Sort
async function insertionSort(arr) {
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            state.comparisons++;
            arr[j + 1] = arr[j];
            state.swaps++;
            renderBars([j, j + 1]);
            updateStats();
            await delay();
            if (!state.isSorting) return;
            j--;
        }
        
        arr[j + 1] = key;
        renderBars([j + 1]);
        await delay();
    }
    
    state.array = arr;
    finishSorting();
}

// Merge Sort
async function mergeSort(arr) {
    await _mergeSort(arr, 0, arr.length - 1);
    if (state.isSorting) {
        state.array = arr;
        finishSorting();
    }
}

async function _mergeSort(arr, l, r) {
    if (l >= r || !state.isSorting) return;
    
    const m = Math.floor((l + r) / 2);
    await _mergeSort(arr, l, m);
    await _mergeSort(arr, m + 1, r);
    await merge(arr, l, m, r);
}

async function merge(arr, l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;
    
    const L = new Array(n1);
    const R = new Array(n2);
    
    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    let i = 0, j = 0, k = l;
    
    while (i < n1 && j < n2 && state.isSorting) {
        state.comparisons++;
        updateStats();
        
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        
        renderBars([k]);
        await delay();
        k++;
    }
    
    while (i < n1 && state.isSorting) {
        arr[k] = L[i];
        renderBars([k]);
        await delay();
        i++;
        k++;
    }
    
    while (j < n2 && state.isSorting) {
        arr[k] = R[j];
        renderBars([k]);
        await delay();
        j++;
        k++;
    }
}

// Quick Sort
async function quickSort(arr) {
    await _quickSort(arr, 0, arr.length - 1);
    if (state.isSorting) {
        state.array = arr;
        finishSorting();
    }
}

async function _quickSort(arr, low, high) {
    if (low < high && state.isSorting) {
        const pi = await partition(arr, low, high);
        await _quickSort(arr, low, pi - 1);
        await _quickSort(arr, pi + 1, high);
    }
}

async function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        state.comparisons++;
        updateStats();
        
        if (arr[j] < pivot) {
            i++;
            await swap(arr, i, j);
        }
        
        renderBars([j, high]);
        await delay();
        if (!state.isSorting) return;
    }
    
    await swap(arr, i + 1, high);
    return i + 1;
}

// Heap Sort
async function heapSort(arr) {
    const n = arr.length;
    
    // Build heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i);
        if (!state.isSorting) return;
    }
    
    // One by one extract an element from heap
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        await swap(arr, 0, i);
        
        // call max heapify on the reduced heap
        await heapify(arr, i, 0);
        if (!state.isSorting) return;
    }
    
    state.array = arr;
    finishSorting();
}

async function heapify(arr, n, i) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    
    state.comparisons++;
    updateStats();
    
    if (l < n && arr[l] > arr[largest]) {
        largest = l;
    }
    
    state.comparisons++;
    updateStats();
    
    if (r < n && arr[r] > arr[largest]) {
        largest = r;
    }
    
    if (largest !== i) {
        await swap(arr, i, largest);
        await heapify(arr, n, largest);
    }
    
    renderBars([i, largest, l, r].filter(idx => idx < n));
    await delay();
}