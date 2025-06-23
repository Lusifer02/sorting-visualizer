// Main application state
const state = {
    array: [],
    arraySize: 20,
    speed: 5,
    algorithm: null,
    isSorting: false,
    comparisons: 0,
    swaps: 0,
    startTime: null,
    timeoutIds: [],
};

// Initialize the application
function init() {
    generateNewArray();
    setupEventListeners();
}

// Generate a new random array
function generateNewArray() {
    state.array = [];
    const min = 5;
    const max = 100;
    
    for (let i = 0; i < state.arraySize; i++) {
        state.array.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    
    renderBars();
    updateStats();
    setStatus('ready');
}

// Render the array as bars
function renderBars(highlightIndices = []) {
    const container = document.getElementById('visualization');
    container.innerHTML = '';
    
    const maxHeight = Math.max(...state.array);
    const containerHeight = container.clientHeight;
    
    state.array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar transition-all duration-75 ease-in';
        bar.style.height = `${(value / maxHeight) * 100}%`;
        bar.style.width = `${100 / state.arraySize}%`;
        bar.style.backgroundColor = highlightIndices.includes(index) ? 'var(--bar-highlight)' : 'var(--bar-color)';
        container.appendChild(bar);
    });
}

// Update statistics display
function updateStats() {
    document.getElementById('comparisons').textContent = state.comparisons;
    document.getElementById('swaps').textContent = state.swaps;
    
    if (state.startTime) {
        const elapsedTime = Date.now() - state.startTime;
        document.getElementById('time').textContent = elapsedTime;
    }
}

// Set status message
function setStatus(status) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = status === 'ready' ? 'Ready' : 
                              status === 'sorting' ? 'Sorting...' : 
                              'Sorted!';
    statusElement.className = '';
    statusElement.classList.add(status);
}

// Clear all timeouts
function clearTimeouts() {
    state.timeoutIds.forEach(id => clearTimeout(id));
    state.timeoutIds = [];
}

// Start the sorting process
function startSorting() {
    if (state.isSorting || !state.algorithm) return;
    
    state.isSorting = true;
    state.comparisons = 0;
    state.swaps = 0;
    state.startTime = Date.now();
    setStatus('sorting');
    
    // Execute the selected algorithm
    const sortingAlgorithms = {
        bubble: bubbleSort,
        selection: selectionSort,
        insertion: insertionSort,
        merge: mergeSort,
        quick: quickSort,
        heap: heapSort,
    };
    
    sortingAlgorithms[state.algorithm]([...state.array]);
}

// Finish sorting
function finishSorting() {
    state.isSorting = false;
    setStatus('sorted');
    renderBars();
}

// Setup event listeners
function setupEventListeners() {
    // Array size slider
    const arraySizeSlider = document.getElementById('array-size');
    const arraySizeValue = document.getElementById('array-size-value');
    
    arraySizeSlider.addEventListener('input', () => {
        state.arraySize = parseInt(arraySizeSlider.value);
        arraySizeValue.textContent = state.arraySize;
        generateNewArray();
    });
    
    // Speed slider
    const speedSlider = document.getElementById('speed');
    speedSlider.addEventListener('input', () => {
        state.speed = parseInt(speedSlider.value);
    });
    
    // Algorithm buttons
    document.querySelectorAll('.algo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.algo-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.algorithm = btn.dataset.algo;
        });
    });
    
    // Generate new array button
    document.getElementById('generate-btn').addEventListener('click', () => {
        if (!state.isSorting) {
            generateNewArray();
        }
    });
    
    // Sort button
    document.getElementById('sort-btn').addEventListener('click', () => {
        if (!state.isSorting) {
            startSorting();
        }
    });
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
}

// Toggle between light and dark theme
function toggleTheme() {
    const themeStyle = document.getElementById('theme-style');
    const isDark = themeStyle.getAttribute('href').includes('dark');
    
    if (isDark) {
        themeStyle.setAttribute('href', 'styles/light.css');
    } else {
        themeStyle.setAttribute('href', 'styles/dark.css');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);