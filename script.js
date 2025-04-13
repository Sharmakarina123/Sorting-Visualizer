
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    // Simulate loading time
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 3000); // Adjust time as needed (3000ms = 3 seconds)
});

const arrayVisualization = document.createElement('div');
arrayVisualization.className = 'array-visualization';
[3, 1, 4, 1, 5, 9, 2, 6].forEach(num => {
    const bar = document.createElement('div');
    bar.className = 'array-bar';
    bar.style.height = `${num * 5}px`;
    arrayVisualization.appendChild(bar);
});
document.querySelector('.cyber-loader').appendChild(arrayVisualization);




let array = [];
let isSorting = false;
let soundEnabled = false;
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let animationSpeed = 50;

const algorithms = {
    bubble: {
        code: `function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
}`,
        time: 'O(n²)',
        space: 'O(1)'
    },
    merge: {
        code: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    let result = [];
    while (left.length && right.length) {
        result.push(left[0] < right[0] ? left.shift() : right.shift());
    }
    return result.concat(left, right);
}`,
        time: 'O(n log n)',
        space: 'O(n)'
    },
    quick: {
        code: `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,
        time: 'O(n log n) average, O(n²) worst',
        space: 'O(log n)'
    },

        insertion: {
            code: `function insertionSort(arr) {
        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }`,
            time: 'O(n²)',
            space: 'O(1)'
        },
        selection: {
            code: `function selectionSort(arr) {
        for (let i = 0; i < arr.length; i++) {
            let minIdx = i;
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        }
    }`,
            time: 'O(n²)',
            space: 'O(1)'
        },

            heap: {
                code: `function heapSort(arr) {
            // Build max heap
            for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
                heapify(arr, arr.length, i);
            }
            
            // Extract elements from heap
            for (let i = arr.length - 1; i > 0; i--) {
                [arr[0], arr[i]] = [arr[i], arr[0]];
                heapify(arr, i, 0);
            }
        }
        
        function heapify(arr, n, i) {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;
        
            if (left < n && arr[left] > arr[largest]) largest = left;
            if (right < n && arr[right] > arr[largest]) largest = right;
        
            if (largest !== i) {
                [arr[i], arr[largest]] = [arr[largest], arr[i]];
                heapify(arr, n, largest);
            }
        }`,
                time: 'O(n log n)',
                space: 'O(1)'
            },
            shell: {
                code: `function shellSort(arr) {
            let gap = Math.floor(arr.length / 2);
            
            while (gap > 0) {
                for (let i = gap; i < arr.length; i++) {
                    const temp = arr[i];
                    let j = i;
                    
                    while (j >= gap && arr[j - gap] > temp) {
                        arr[j] = arr[j - gap];
                        j -= gap;
                    }
                    arr[j] = temp;
                }
                gap = Math.floor(gap / 2);
            }
        }`,
                time: 'O(n log²n)',
                space: 'O(1)'
            },

    linear: {
        code: `function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}`,
        time: 'O(n)',
        space: 'O(1)'
    },
    binary: {
        code: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
        time: 'O(log n)',
        space: 'O(1)'
    }
};

function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById('soundToggle').textContent = 
        soundEnabled ? "🔊 Sound On" : "🔈 Sound Off";
}

function toggleSection(section) {
    const element = document.getElementById(`${section}Section`);
    const arrow = document.getElementById(`${section}Arrow`);
    element.classList.toggle('hidden');
    arrow.textContent = element.classList.contains('hidden') ? '▼' : '▲';
}

function toggleSearchInput() {
    const algorithm = document.getElementById('algorithm').value;
    const searchInput = document.getElementById('searchInput');
    searchInput.classList.toggle('hidden', !['linear', 'binary'].includes(algorithm));
}



function generateNewArray() {
    if(isSorting) return;
    
    const size = parseInt(document.getElementById('arraySize').value);
    array = Array.from({length: size}, () => Math.floor(Math.random() * 90) + 10);
    renderBars();
}

function useCustomArray() {
    if(isSorting) return;
    
    try {
        const customInput = document.getElementById('customArray').value;
        const newArray = customInput.split(',')
                          .map(num => parseInt(num.trim()))
                          .filter(num => !isNaN(num));
        
        if(newArray.length < 5 || newArray.length > 50) {
            throw new Error('Array must contain 5-50 numbers');
        }
        
        array = newArray;
        document.getElementById('arraySize').value = newArray.length;
        document.getElementById('currentSize').textContent = newArray.length;
        renderBars();
    } catch (error) {
        alert(`Invalid array: ${error.message}`);
    }
}

function renderBars(highlightIndices = [], sortedIndices = [], highlightClass = 'bg-rose-500', rangeStart = -1, rangeEnd = -1) {
    const container = document.getElementById('visualization');
    container.innerHTML = ''; 
    const maxValue = Math.max(...array, 1); 

    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = `bar bg-emerald-400/80 text-center text-white rounded-t 
                       transition-all duration-300 ease-in-out flex items-end justify-center
                       hover:brightness-125 cursor-pointer`;
        bar.style.width = `${100 / array.length}%`;
        bar.style.height = `${(value / maxValue) * 80}%`;
        bar.textContent = value;

        if (index >= rangeStart && index <= rangeEnd) {
            bar.classList.add('bg-blue-500/30');
        }

        if (sortedIndices.includes(index)) {
            bar.classList.add('bg-indigo-500');
        }
        if (highlightIndices.includes(index)) {
            bar.classList.add('bg-rose-500', 'highlight');
        }

        if (sortedIndices.length === array.length) {
            bar.classList.add('sorted-complete');
        } else if (sortedIndices.includes(index)) {
            bar.classList.add('bg-indigo-500');
        }
        bar.style.width = `${100 / array.length}%`;
        bar.style.height = `${(value / maxValue) * 80}%`;
        bar.textContent = value;
        container.appendChild(bar); 
    });
}
async function startVisualization() {
    if (isSorting) return;
    isSorting = true;
    const visualizeBtn = document.getElementById('visualizeBtn');
    visualizeBtn.disabled = true;
    

    try {
        const algorithm = document.getElementById('algorithm').value;
        document.getElementById('codeSection').textContent = algorithms[algorithm].code;
        document.getElementById('timeSection').textContent = algorithms[algorithm].time;
        document.getElementById('spaceSection').textContent = algorithms[algorithm].space;
        switch(algorithm) {
            case 'bubble': await bubbleSort(); break;
            case 'merge': await mergeSort(); break;
            case 'quick': await quickSort(); break;
            case 'insertion': await insertionSort(); break;
            case 'selection': await selectionSort(); break;
            case 'heap': await heapSort(); break;
            case 'shell': await shellSort(); break;
            case 'linear': await linearSearch(); break;
            case 'binary': await binarySearch(); break;
        }
    
    } catch (error) {
        alert(error.message);
    }
    finally {
        isSorting = false;
        visualizeBtn.disabled = false;
        // Reset all bars to original color
        renderBars([], array.map((_, i) => i));
    }
}

async function bubbleSort() {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            playSound(300 + j*10, 0.05);
            if (array[j] > array[j + 1]) {
                playSound(600, 0.1);
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                renderBars([j, j + 1]);
                await sleep();
            }
        }
        renderBars([], Array.from({length: i + 1}, (_, k) => array.length - k - 1));
    }
}

async function mergeSort() {
    async function performMergeSort(start, end) {
        if (end - start <= 1) return;
        
        const mid = Math.floor((start + end) / 2);
        await performMergeSort(start, mid);
        await performMergeSort(mid, end);
        
        let result = [];
        let i = start, j = mid;
        
        while (i < mid && j < end) {
            playSound(400 + (i*5), 0.05);
            if (array[i] < array[j]) {
                result.push(array[i++]);
            } else {
                result.push(array[j++]);
            }
        }
        
        result = result.concat(array.slice(i, mid), array.slice(j, end));
        for (let k = 0; k < result.length; k++) {
            playSound(500 + (k*10), 0.05);
            array[start + k] = result[k];
            renderBars([start + k]);
            await sleep();
        }
    }
    
    await performMergeSort(0, array.length);
    renderBars([], array.map((_, i) => i));
}

async function quickSort() {
    async function performQuickSort(low, high) {
        if (low < high) {
            const pi = await partition(low, high);
            await performQuickSort(low, pi - 1);
            await performQuickSort(pi + 1, high);
        }
    }

    async function partition(low, high) {
        const pivot = array[high];
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            playSound(300 + j*10, 0.05);
            if (array[j] < pivot) {
                i++;
                playSound(600, 0.1);
                [array[i], array[j]] = [array[j], array[i]];
                renderBars([i, j, high]);
                await sleep();
            }
        }
        
        playSound(800, 0.2);
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        renderBars([i + 1, high]);
        await sleep();
        return i + 1;
    }
    
    await performQuickSort(0, array.length - 1);
    renderBars([], array.map((_, i) => i));
}

// Insertion Sort
async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        
        // Highlight current key
        renderBars([i], []);
        await sleep();
        
        while (j >= 0 && array[j] > key) {
            playSound(500, 0.1);
            array[j + 1] = array[j];
            renderBars([j, j + 1], []);
            await sleep();
            j--;
        }
        array[j + 1] = key;
        
        // Show final position
        renderBars([j + 1], []);
        await sleep();
    }
    renderBars([], array.map((_, i) => i));
}

// Selection Sort
async function selectionSort() {
    for (let i = 0; i < array.length; i++) {
        let minIdx = i;
        
        // Highlight initial minimum
        renderBars([minIdx], []);
        await sleep();
        
        for (let j = i + 1; j < array.length; j++) {
            // Highlight current comparison
            renderBars([j, minIdx], []);
            await sleep();
            
            if (array[j] < array[minIdx]) {
                minIdx = j;
                // Update minimum highlight
                renderBars([minIdx], []);
                await sleep();
            }
        }
        
        if (minIdx !== i) {
            playSound(700, 0.2);
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            renderBars([i, minIdx], []);
            await sleep();
        }
        
        // Mark sorted position
        renderBars([], [...Array(i + 1).keys()]);
    }
}

// Heap Sort Implementation
async function heapSort() {
    const n = array.length;
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }
    
    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
        playSound(800, 0.2);
        [array[0], array[i]] = [array[i], array[0]];
        renderBars([0, i], Array.from({length: n - i}, (_, k) => i + k));
        await sleep();
        await heapify(i, 0);
    }
    renderBars([], array.map((_, i) => i));
}

async function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    // Highlight parent and children
    renderBars([i, left, right]);
    await sleep();

    if (left < n && array[left] > array[largest]) largest = left;
    if (right < n && array[right] > array[largest]) largest = right;

    if (largest !== i) {
        playSound(600, 0.1);
        [array[i], array[largest]] = [array[largest], array[i]];
        renderBars([i, largest]);
        await sleep();
        await heapify(n, largest);
    }
}

// Shell Sort Implementation
async function shellSort() {
    let gap = Math.floor(array.length / 2);
    
    while (gap > 0) {
        for (let i = gap; i < array.length; i++) {
            const temp = array[i];
            let j = i;
            
            // Highlight current elements being compared
            renderBars([j, j - gap]);
            await sleep();
            
            while (j >= gap && array[j - gap] > temp) {
                playSound(400 + (j * 10), 0.05);
                array[j] = array[j - gap];
                renderBars([j, j - gap]);
                await sleep();
                j -= gap;
            }
            array[j] = temp;
            
            // Show final position
            renderBars([j]);
            await sleep();
        }
        gap = Math.floor(gap / 2);
    }
    renderBars([], array.map((_, i) => i));
}

async function linearSearch() {
    const target = parseInt(document.getElementById('searchValue').value);
    if (isNaN(target)) throw new Error('Please enter a valid search value');
    
    let found = false;
    
    for (let i = 0; i < array.length; i++) {
        playSound(400 + (i * 20), 0.1);
        renderBars([i], [], 'bg-yellow-500'); // Current element in yellow
        await sleep();
        
        if (array[i] === target) {
            playSound(800, 0.5);
            renderBars([i], [], 'bg-green-500'); // Found element in green
            await sleep(1000);
            found = true;
            break;
        }
    }
    
    if (!found) {
        playSound(200, 1);
        renderBars([...Array(array.length).keys()], [], 'bg-red-500'); // All red for failure
        await sleep(1000);
        throw new Error('Value not found in array');
    }
}

async function binarySearch() {
    const target = parseInt(document.getElementById('searchValue').value);
    if (isNaN(target)) throw new Error('Please enter a valid search value');
    
    // Visualize sorted array first
    array = [...array].sort((a, b) => a - b);
    renderBars([], array.map((_, i) => i)); // Show sorted array
    await sleep(1000); // Pause to show sorted state
    
    let left = 0;
    let right = array.length - 1;
    let found = false;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        // Highlight search range and mid point
        renderBars([mid], [], 'bg-yellow-500', left, right); // Mid in yellow, range in blue
        playSound(500 + (mid * 10), 0.1);
        await sleep();
        
        if (array[mid] === target) {
            playSound(800, 0.5);
            renderBars([mid], [], 'bg-green-500'); // Found in green
            await sleep(1000);
            found = true;
            break;
        } else if (array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    if (!found) {
        playSound(200, 1);
        renderBars([...Array(array.length).keys()], [], 'bg-red-500'); // All red for failure
        await sleep(1000);
        throw new Error('Value not found in array');
    }
}

function playSound(frequency = 440, duration = 0.1) {
    if (!soundEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

function sleep() {
    const scaledSpeed = animationSpeed * (Math.log(animationSpeed + 1) / 4);
    return new Promise(resolve => setTimeout(resolve, scaledSpeed));
}

document.addEventListener('DOMContentLoaded', () => {
    // Existing initialization code
    generateNewArray();
    toggleSearchInput();

    // Speed control
    document.getElementById('speed').addEventListener('input', function(e) {
        animationSpeed = parseInt(e.target.value);
        if(animationSpeed < 10) animationSpeed = 10;
        if(animationSpeed > 100) animationSpeed = 100;
    });

    // Array size control
    document.getElementById('arraySize').addEventListener('input', function(e) {
        document.getElementById('currentSize').textContent = e.target.value;
        generateNewArray();
    });

    // Generate random code lines for preloader
    const codePattern = document.querySelector('.code-pattern');
    const codeSnippets = [
        'function merge() { ... }',
        'const arr = [5, 2, 9, 1];',
        'let pivot = arr[high];',
        'swap(arr, i, j);',
        'while (left <= right) {',
        'return sortedArray;',
        'const mid = Math.floor(arr.length / 2);',
        'if (arr[j] > arr[j + 1])'
    ];

    for (let i = 0; i < 40; i++) {
        const line = document.createElement('div');
        line.className = 'code-line';
        line.style.left = `${Math.random() * 100}%`;
        line.style.animationDelay = `${Math.random() * 10}s`;
        line.style.opacity = Math.random() * 0.3 + 0.1;
        line.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        codePattern.appendChild(line);
    }
});

// Custom array validation
document.getElementById('customArray').addEventListener('input', function(e) {
    const isValid = e.target.value.split(',').every(num => !isNaN(parseInt(num.trim())));
    e.target.classList.toggle('border-rose-500', !isValid);
});



document.querySelectorAll('.algorithm-code, #timeSection, #spaceSection').forEach(section => {
    section.addEventListener('click', () => {
        document.getElementById('readStatus').textContent = 
            `Ready to read: ${section.parentElement.previousElementSibling.querySelector('h3').textContent}`;
    });
});

