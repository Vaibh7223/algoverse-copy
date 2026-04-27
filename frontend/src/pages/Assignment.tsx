import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, Printer, Download, Check, FileText, BarChart2, Code, Lightbulb, Target, List } from 'lucide-react';
import { MOCK_COURSES, BADGE_META, DIFFICULTY_META } from './Courses';

// ─── Study Guide Data ─────────────────────────────────────────────────────────
interface GuideSection { title: string; icon: string; content: string; visual?: string; code?: string; table?: string[][]; }
interface StudyGuide { overview: string; objectives: string[]; sections: GuideSection[]; tips: string[]; problems: { title: string; diff: string; hint: string }[]; }

const GUIDES: Record<string, StudyGuide> = {
  // ── BEGINNER ──────────────────────────────────────────────────────────────
  default_beginner: {
    overview: 'This course builds your foundational understanding of computer science concepts. You will explore core data structures and algorithmic thinking from ground zero.',
    objectives: ['Understand fundamental data structures','Analyze time and space complexity','Write clean, efficient code','Solve basic algorithmic problems'],
    sections: [
      { title:'What Are Data Structures?', icon:'📦', content:'A data structure is a way of organizing and storing data so it can be accessed and modified efficiently. The choice of data structure directly impacts performance.',
        visual:`LINEAR: Array [1] → [2] → [3] → [4] → [5]
                Stack (LIFO)  ↑ push / pop top
                Queue (FIFO)  enqueue → [A][B][C] → dequeue

NON-LINEAR:      Tree            Graph
              [Root]           A — B
             /      \\         |   |
          [L]      [R]        C — D`,
        table:[['Structure','Insert','Delete','Search','Space'],['Array','O(n)','O(n)','O(n) unsorted / O(log n) sorted','O(n)'],['Stack','O(1)','O(1)','O(n)','O(n)'],['Queue','O(1)','O(1)','O(n)','O(n)'],['Hash Table','O(1) avg','O(1) avg','O(1) avg','O(n)'],['BST (balanced)','O(log n)','O(log n)','O(log n)','O(n)']]},
      { title:'Time & Space Complexity', icon:'⏱', content:'Algorithm efficiency is measured using Big-O notation. It describes how runtime or memory grows relative to input size n.',
        visual:`Growth Rate (slowest to fastest):
O(1) ──────────────────── Constant       ████
O(log n) ──────────────── Logarithmic    ████▌
O(n) ──────────────────── Linear         ████████
O(n log n) ─────────────── Linearithmic  ██████████▌
O(n²) ──────────────────── Quadratic     █████████████████
O(2ⁿ) ──────────────────── Exponential   ████████████████████████████`,
        code:`// O(1): Constant time
function getFirst(arr) { return arr[0]; }

// O(n): Linear time - one loop
function findMax(arr) {
  let max = arr[0];
  for (let x of arr) if (x > max) max = x;
  return max;
}

// O(n²): Quadratic time - nested loops
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++)
    for (let j = 0; j < arr.length - i - 1; j++)
      if (arr[j] > arr[j+1]) [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
}`},
      { title:'Key Problem-Solving Framework', icon:'🧠', content:'Follow this systematic approach for every coding problem: Understand → Plan → Code → Test → Optimize.',
        visual:`STEP 1: UNDERSTAND
  → Read carefully, identify inputs/outputs/constraints

STEP 2: EXAMPLES
  → Draw 2-3 examples, find the pattern

STEP 3: BRUTE FORCE
  → Write the simplest correct solution first

STEP 4: OPTIMIZE
  → Identify bottlenecks, apply better data structures

STEP 5: CODE & TEST
  → Write clean code, test edge cases (empty, single, max input)`},
    ],
    tips:['Always clarify constraints before coding','Start with brute force, then optimize','Think about edge cases: empty input, single element, duplicates','Practice drawing out examples on paper first'],
    problems:[
      { title:'Two Sum', diff:'Easy', hint:'Use a hash map to store complements — O(n) time' },
      { title:'Valid Parentheses', diff:'Easy', hint:'Use a stack — push opening, pop & check closing' },
      { title:'Reverse Linked List', diff:'Easy', hint:'Use three pointers: prev, curr, next' },
      { title:'Maximum Subarray (Kadane)', diff:'Medium', hint:'Track max ending here = max(a[i], prev+a[i])' },
    ],
  },

  // ── SORTING ──────────────────────────────────────────────────────────────
  b10: {
    overview: 'Sorting is one of the most studied problems in computer science. This guide covers the three elementary O(n²) sorts and builds intuition before advanced algorithms.',
    objectives:['Implement Bubble, Selection & Insertion sort','Compare their time and space complexities','Understand stability and in-place properties','Recognize when simple sorts outperform advanced ones'],
    sections:[
      { title:'Bubble Sort', icon:'🫧', content:'Repeatedly swaps adjacent elements that are out of order. Like bubbles rising to the surface.',
        visual:`PASS 1: [5][3][8][1][2]
  Compare (5,3) → swap: [3][5][8][1][2]
  Compare (5,8) → ok  : [3][5][8][1][2]
  Compare (8,1) → swap: [3][5][1][8][2]
  Compare (8,2) → swap: [3][5][1][2][8] ← 8 settled

After n passes, array is sorted.
Best: O(n) with early exit flag  Worst: O(n²)`,
        code:`function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // Already sorted — O(n) best case
  }
  return arr;
}`},
      { title:'Selection Sort', icon:'🎯', content:'Finds the minimum element and places it at the beginning. Repeats for each position.',
        visual:`[64][25][12][22][11]
 Find min in [0..4] = 11 → swap with 64
[11][25][12][22][64]
 Find min in [1..4] = 12 → swap with 25
[11][12][25][22][64]
 Find min in [2..4] = 22 → swap with 25
[11][12][22][25][64] ✓`,
        table:[['Algorithm','Best','Average','Worst','Space','Stable'],['Bubble Sort','O(n)','O(n²)','O(n²)','O(1)','✓ Yes'],['Selection Sort','O(n²)','O(n²)','O(n²)','O(1)','✗ No'],['Insertion Sort','O(n)','O(n²)','O(n²)','O(1)','✓ Yes']]},
      { title:'Insertion Sort', icon:'🃏', content:'Builds a sorted sub-array one element at a time — like sorting playing cards in your hand.',
        code:`function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    // Shift elements greater than key to the right
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}
// 💡 Best case O(n) — nearly sorted arrays!
// Used inside TimSort (Python/Java) for small subarrays`},
    ],
    tips:['Insertion Sort is best for nearly-sorted data (< 20 elements)','Selection Sort makes exactly O(n²/2) comparisons regardless of input','Bubble Sort with early-exit is adaptive — it detects sorted arrays','None of these are used in production for large arrays — they teach concepts'],
    problems:[
      { title:'Sort Colors (Dutch Flag)', diff:'Medium', hint:'3-way partition: track low, mid, high pointers' },
      { title:'Find K-th Largest Element', diff:'Medium', hint:'Quickselect — O(n) average using partition' },
      { title:'Merge Sorted Arrays', diff:'Easy', hint:'Two-pointer merge from the end' },
      { title:'Count Inversions', diff:'Hard', hint:'Modified merge sort — count swaps across halves' },
    ],
  },

  // ── GRAPH ALGORITHMS ─────────────────────────────────────────────────────
  i3: {
    overview:'Graph algorithms power GPS, social networks, web crawlers, and compilers. This guide covers BFS, DFS, and shortest-path algorithms with visual walkthroughs.',
    objectives:['Implement BFS and DFS from scratch','Find shortest paths with Dijkstra','Detect negative cycles with Bellman-Ford','Perform topological sort on DAGs'],
    sections:[
      { title:'Graph Representation', icon:'🕸', content:'Graphs have vertices (nodes) and edges (connections). Choose representation based on density.',
        visual:`ADJACENCY LIST (sparse graphs):        ADJACENCY MATRIX (dense graphs):
A → [B, C]                                  A  B  C  D
B → [A, D]                              A [ 0  1  1  0 ]
C → [A, D]                              B [ 1  0  0  1 ]
D → [B, C]                              C [ 1  0  0  1 ]
Space: O(V + E)                         D [ 0  1  1  0 ]
                                        Space: O(V²)`,
        table:[['Operation','Adj List','Adj Matrix'],['Space','O(V+E)','O(V²)'],['Add Edge','O(1)','O(1)'],['Remove Edge','O(V)','O(1)'],['Check Edge','O(V)','O(1)'],['Get Neighbors','O(degree)','O(V)'],['Best For','Sparse Graphs','Dense Graphs']]},
      { title:'BFS — Breadth-First Search', icon:'🌊', content:'Explores level by level using a queue. Guarantees shortest path in unweighted graphs.',
        visual:`Graph:  A — B — D
               |
               C — E

BFS from A (queue: [A]):
  Visit A → enqueue B, C → queue: [B, C]
  Visit B → enqueue D   → queue: [C, D]
  Visit C → enqueue E   → queue: [D, E]
  Visit D              → queue: [E]
  Visit E              → done

Order: A → B → C → D → E
Distances: A=0, B=1, C=1, D=2, E=2`,
        code:`function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}`},
      { title:"Dijkstra's Shortest Path", icon:'🗺', content:'Greedily picks the node with the smallest tentative distance. Requires non-negative weights.',
        visual:`Graph (weighted):
    A --4-- B --2-- D
    |       |
    2       1
    |       |
    C --3-- B

From A: dist = {A:0, B:∞, C:∞, D:∞}
  Pick A(0) → update B=4, C=2
  Pick C(2) → update B=min(4,3)=3
  Pick B(3) → update D=5
  Pick D(5) → done!
Result: A→C→B→D = 5`,
        code:`function dijkstra(graph, start) {
  const dist = {};
  const pq = [[0, start]]; // [distance, node]
  for (const node in graph) dist[node] = Infinity;
  dist[start] = 0;

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d > dist[u]) continue; // stale entry
    for (const [v, weight] of graph[u]) {
      const newDist = dist[u] + weight;
      if (newDist < dist[v]) {
        dist[v] = newDist;
        pq.push([newDist, v]);
      }
    }
  }
  return dist;
}`},
    ],
    tips:['BFS = shortest path (unweighted), DFS = connectivity, cycles, topological order',"Dijkstra fails on negative edges — use Bellman-Ford instead",'For dense graphs, use adjacency matrix; for sparse, use adjacency list','Topological sort only works on DAGs (Directed Acyclic Graphs)'],
    problems:[
      { title:'Number of Islands', diff:'Medium', hint:'DFS/BFS from each unvisited land cell, mark visited' },
      { title:'Course Schedule (Topo Sort)', diff:'Medium', hint:'Detect cycle in directed graph using DFS colors' },
      { title:'Shortest Path in Binary Matrix', diff:'Medium', hint:'BFS with 8-directional movement' },
      { title:'Network Delay Time', diff:'Medium', hint:"Dijkstra from source, answer = max dist" },
    ],
  },

  // ── DYNAMIC PROGRAMMING ──────────────────────────────────────────────────
  a1: {
    overview:'Dynamic Programming breaks problems into overlapping subproblems and stores results to avoid recomputation. It turns exponential algorithms into polynomial ones.',
    objectives:['Identify DP-suitable problems using optimal substructure','Implement top-down (memoization) and bottom-up (tabulation)','Solve classic DP problems: knapsack, LCS, LIS, coin change','Reconstruct solutions from DP tables'],
    sections:[
      { title:'DP Fundamentals: When to Use It', icon:'🧩', content:'A problem is suitable for DP if it has: 1) Optimal substructure — optimal solution built from subproblem optima. 2) Overlapping subproblems — same subproblems recomputed many times.',
        visual:`Fibonacci Naive Recursion (Exponential):
        fib(5)
       /      \\
   fib(4)    fib(3)       ← fib(3) computed TWICE
   /    \\    /    \\
fib(3) fib(2) fib(2) fib(1)  ← fib(2) computed THREE times!
Total calls: O(2^n)

With Memoization (cache results):
fib(5) → fib(4) → fib(3) → fib(2) → fib(1)=1
                   ↑ cached!    ↑ cached!
Total calls: O(n)`},
      { title:'Two Approaches: Top-Down vs Bottom-Up', icon:'⬆⬇', content:'Top-down uses recursion + cache. Bottom-up fills a table iteratively. Both give O(n) for Fibonacci.',
        code:`// TOP-DOWN (Memoization)
const memo = {};
function fib(n) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  return memo[n] = fib(n-1) + fib(n-2);
}

// BOTTOM-UP (Tabulation)  ← usually faster (no recursion overhead)
function fibDP(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++)
    dp[i] = dp[i-1] + dp[i-2];
  return dp[n];
}

// SPACE OPTIMIZED (O(1) space!)
function fibOpt(n) {
  let [a, b] = [0, 1];
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`},
      { title:'Classic: 0/1 Knapsack', icon:'🎒', content:'Given n items with weights and values, maximize value with capacity W. Each item used at most once.',
        visual:`Items: [(w=2,v=6), (w=2,v=10), (w=3,v=12)]  Capacity W=5

DP Table dp[i][w] = max value using items 0..i with capacity w:
     w=  0  1  2  3  4  5
i=0      0  0  6  6  6  6   (item 0: w=2,v=6)
i=1      0  0 10 10 16 16   (item 1: w=2,v=10)
i=2      0  0 10 12 16 22   (item 2: w=3,v=12)

Answer: dp[2][5] = 22  (take items 1 and 2)`,
        code:`function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array.from({length: n+1}, () => new Array(W+1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      dp[i][w] = dp[i-1][w]; // don't take item i
      if (weights[i-1] <= w)
        dp[i][w] = Math.max(dp[i][w], values[i-1] + dp[i-1][w - weights[i-1]]);
    }
  }
  return dp[n][W];
}
// Time: O(nW)  Space: O(nW) → can optimize to O(W) with 1D DP`},
      { title:'Classic: Longest Common Subsequence', icon:'🔤', content:'Find the longest subsequence common to two strings. Classic DP on two sequences.',
        visual:`s1="ABCBDAB"  s2="BDCAB"
     ""  B  D  C  A  B
  ""  0  0  0  0  0  0
  A   0  0  0  0  1  1
  B   0  1  1  1  1  2
  C   0  1  1  2  2  2
  B   0  1  1  2  2  3
  D   0  1  2  2  2  3
  A   0  1  2  2  3  3
  B   0  1  2  2  3  4  ← LCS length = 4 (BCAB)`,
        table:[['DP Pattern','Recurrence','Classic Problems'],['1D DP','dp[i] depends on dp[i-1]','Fibonacci, Climb Stairs, House Robber'],['2D DP','dp[i][j] uses dp[i-1][j] etc.','LCS, Edit Distance, 0/1 Knapsack'],['Interval DP','dp[i][j] uses dp[i][k]+dp[k][j]','Matrix Chain, Burst Balloons'],['Tree DP','DP over rooted tree','Max Path Sum, Binary Tree Cameras'],['Bitmask DP','dp[mask] over subsets','TSP, Assignment Problem']]},
    ],
    tips:["Always identify the state first: 'what changes between subproblems?'",'Draw the recurrence tree to spot overlapping subproblems','Start with the recursive solution, then add memoization','Bottom-up avoids stack overflow for large inputs'],
    problems:[
      { title:'Coin Change', diff:'Medium', hint:'dp[amount] = min(dp[amount-coin]+1) for each coin' },
      { title:'Longest Increasing Subsequence', diff:'Medium', hint:'O(n²) DP or O(n log n) with patience sorting' },
      { title:'Edit Distance', diff:'Hard', hint:'dp[i][j] = min of insert/delete/replace operations' },
      { title:'Burst Balloons', diff:'Hard', hint:'Interval DP: try each balloon as the LAST to burst' },
    ],
  },

  // Fallback for all other courses
  default_intermediate: {
    overview:'This course deepens your understanding of algorithms and data structures, bridging fundamentals to advanced problem-solving.',
    objectives:['Master intermediate data structures','Solve medium-difficulty algorithmic problems','Understand trade-offs between different approaches','Prepare for technical interviews'],
    sections:[
      { title:'Core Concepts Overview', icon:'📚', content:'At the intermediate level, you\'ll combine data structures and algorithms to solve complex problems efficiently. Pattern recognition is key.',
        visual:`Common Algorithm Patterns:
  ┌──────────────────────────────────────────┐
  │ Two Pointers     → Array/String problems  │
  │ Sliding Window   → Subarray problems      │
  │ Binary Search    → Sorted data problems   │
  │ BFS/DFS          → Graph/Tree traversal   │
  │ Dynamic Prog.    → Optimization problems  │
  │ Greedy           → Selection problems     │
  │ Divide & Conquer → Recursive splitting    │
  └──────────────────────────────────────────┘`,
        table:[['Pattern','When to Use','Time Complexity'],['Two Pointers','Sorted data, pairs/triplets','O(n)'],['Sliding Window','Subarray/substring max/min','O(n)'],['Binary Search','Sorted arrays, answer ranges','O(log n)'],['BFS','Shortest path, level-order','O(V+E)'],['DP','Overlapping subproblems','O(n²) typical'],['Greedy','Local optimum = global optimum','O(n log n)']]},
      { title:'Complexity Analysis Deep Dive', icon:'📊', content:'Understanding why an algorithm is O(n log n) vs O(n²) is what separates good engineers from great ones.',
        code:`// Recognize time complexity patterns:

// Halving → O(log n)
for (let i = n; i > 0; i = Math.floor(i/2)) { ... }

// One loop → O(n)
for (let i = 0; i < n; i++) { ... }

// Halving + loop → O(n log n)
function mergeSort(arr) { /* split, sort halves, merge */ }

// Nested loops → O(n²)
for (let i = 0; i < n; i++)
  for (let j = 0; j < n; j++) { ... }

// Recursive tree with branching factor b, depth d → O(b^d)
function fib(n) { return fib(n-1) + fib(n-2); } // O(2^n)`},
    ],
    tips:['Master 10-15 core patterns — most problems are variations','Time yourself: aim for 20-25 min per medium problem','Always discuss trade-offs with your interviewer','Practice explaining your thought process out loud'],
    problems:[
      { title:'Contains Duplicate', diff:'Easy', hint:'Use a Set for O(n) time' },
      { title:'3Sum', diff:'Medium', hint:'Sort + two pointers for each fixed element' },
      { title:'Longest Substring Without Repeat', diff:'Medium', hint:'Sliding window with a Set' },
      { title:'Word Search', diff:'Medium', hint:'DFS with backtracking on the grid' },
    ],
  },
  default_advanced: {
    overview:'Advanced algorithms require mastery of complex data structures and the ability to combine multiple techniques to solve hard problems efficiently.',
    objectives:['Implement advanced tree and graph structures','Apply DP to complex state spaces','Design and analyze algorithms for hard problems','Develop competitive programming intuition'],
    sections:[
      { title:'Advanced Data Structures Overview', icon:'🏗', content:'At the advanced level, you\'ll use specialized structures that provide O(log n) operations for complex queries.',
        visual:`Segment Tree (Range Queries):
          [0..7: sum=36]
         /              \\
    [0..3: 10]        [4..7: 26]
    /       \\          /       \\
 [0..1:3] [2..3:7] [4..5:9] [6..7:17]
 /   \\    /   \\   /   \\    /   \\
[1] [2] [3] [4] [4] [5] [8] [9]

Range sum query O(log n)
Point update     O(log n)`,
        table:[['Structure','Build','Query','Update','Space','Use Case'],['Segment Tree','O(n)','O(log n)','O(log n)','O(n)','Range sum/min/max'],['Fenwick Tree (BIT)','O(n)','O(log n)','O(log n)','O(n)','Prefix sums, simpler code'],['Sparse Table','O(n log n)','O(1)','N/A','O(n log n)','Static range minimum'],['Sqrt Decomp','O(√n)','O(√n)','O(√n)','O(√n)','Offline queries']]},
      { title:'Advanced DP Patterns', icon:'🎯', content:'Beyond basic DP: bitmask DP for subsets, digit DP for counting, tree DP for rerooting.',
        code:`// Bitmask DP — Traveling Salesman (TSP)
// State: dp[mask][u] = min cost to visit nodes in 'mask', ending at u
function tsp(dist, n) {
  const INF = 1e9;
  const dp = Array.from({length: 1<<n}, () => new Array(n).fill(INF));
  dp[1][0] = 0; // start at node 0, visited = {0}
  for (let mask = 1; mask < (1<<n); mask++) {
    for (let u = 0; u < n; u++) {
      if (!(mask & (1<<u)) || dp[mask][u] === INF) continue;
      for (let v = 0; v < n; v++) {
        if (mask & (1<<v)) continue;
        const newMask = mask | (1<<v);
        dp[newMask][v] = Math.min(dp[newMask][v], dp[mask][u] + dist[u][v]);
      }
    }
  }
  const fullMask = (1<<n) - 1;
  return Math.min(...dp[fullMask].map((d, u) => d + dist[u][0]));
}`},
    ],
    tips:['Think about offline vs online processing for query problems','For hard problems: solve a simpler version first, then generalize','Competitive programmers memorize templates — build your own template library','Time-space trade-offs: sometimes O(n log n) time + O(n) space beats O(n²)'],
    problems:[
      { title:'Range Sum Query (Mutable)', diff:'Medium', hint:'Segment tree or Fenwick tree for O(log n) updates' },
      { title:'Minimum Spanning Tree', diff:'Medium', hint:"Kruskal's = sort edges + Union-Find" },
      { title:'Regular Expression Matching', diff:'Hard', hint:'2D DP where dp[i][j] = s[0..i] matches p[0..j]' },
      { title:'Count Distinct Palindromes', diff:'Hard', hint:'Suffix arrays + LCP for O(n log n)' },
    ],
  },
  default_expert: {
    overview:'Expert-level algorithms are at the frontier of computer science. This content prepares you for research, competitive programming at the highest level, and system design.',
    objectives:['Understand NP-hardness reductions','Design approximation algorithms with provable guarantees','Implement advanced competitive programming techniques','Analyze streaming and online algorithms'],
    sections:[
      { title:'Complexity Theory Overview', icon:'🔬', content:'Complexity theory classifies problems by their inherent difficulty. Understanding this determines which problems can be solved efficiently.',
        visual:`COMPLEXITY CLASSES:
  P ⊆ NP ⊆ PSPACE ⊆ EXPTIME

  P:    Problems solvable in polynomial time (sorting, shortest path)
  NP:   Solutions verifiable in polynomial time (3-SAT, Hamiltonian)
  NP-C: Hardest problems in NP (every NP reduces to them)
  NP-H: At least as hard as NP-C (may not be in NP)

  If P = NP (unproven):  All NP problems have polynomial solutions
  If P ≠ NP (likely):    NP-Complete problems have no fast solution

  Examples of NP-Complete problems:
  ✗ 3-SAT        ✗ Vertex Cover    ✗ Subset Sum
  ✗ Hamiltonian  ✗ Graph Coloring  ✗ TSP`,
        table:[['Problem','Class','Best Known Algorithm'],['Sorting','P','O(n log n) Merge/Heap Sort'],['Shortest Path','P','O(E log V) Dijkstra'],['2-SAT','P','O(V+E) strongly connected components'],['3-SAT','NP-Complete','No polynomial algorithm known'],['TSP (exact)','NP-Hard','O(n² 2^n) Held-Karp DP'],['TSP (approx)','PTAS','1.5-approx Christofides if metric']]},
    ],
    tips:['Prove NP-hardness by reducing from a known NP-hard problem','For approximation: prove the ratio, not just "it works in practice"','The best competitive programmers know 200+ algorithms — start building your collection','Read recent ICPC and IOI editorials to see current competitive techniques'],
    problems:[
      { title:'Traveling Salesman (Bitmask DP)', diff:'Hard', hint:'O(n² 2^n) is optimal exact — use for n ≤ 20' },
      { title:'Maximum Bipartite Matching', diff:'Hard', hint:'Hungarian algorithm O(V³) or Hopcroft-Karp O(E√V)' },
      { title:'Minimum Vertex Cover via NP reduction', diff:'Expert', hint:'Equivalent to max matching (König\'s theorem for bipartite)' },
      { title:'FFT-based Polynomial Multiplication', diff:'Expert', hint:'Use FFT to multiply in O(n log n) instead of O(n²)' },
    ],
  },
};

function getGuide(courseId: string): StudyGuide {
  // 1. Check for hand-crafted guides
  if (GUIDES[courseId]) return GUIDES[courseId];

  // 2. Fallback to dynamic generation using course metadata
  const course = MOCK_COURSES.find(c => c.id === courseId);
  if (!course) return GUIDES.default_beginner;

  // Create a specific guide based on course data
  return {
    overview: course.description,
    objectives: [
      `Master the core principles of ${course.title}`,
      ...course.topics.map(t => `Understand ${t} in depth`),
      `Apply ${course.difficulty} level problem-solving techniques`,
      `Earn ${course.xp} XP and progress towards your ${course.badge} badge`
    ],
    sections: [
      {
        title: `Introduction to ${course.title}`,
        icon: '🚀',
        content: `Welcome to ${course.title}. In this course, we explore ${course.topics.join(', ')} to build a strong foundation in computer science and algorithmic thinking.`,
        visual: `COURSE: ${course.title.toUpperCase()}\nLEVEL:  ${course.difficulty.toUpperCase()}\nTOPICS: ${course.topics.join(' → ')}`
      },
      {
        title: 'Key Concepts & Curriculum',
        icon: '📚',
        content: `This course covers several critical areas: ${course.topics.join(', ')}. Each topic is essential for mastering ${course.difficulty} level algorithms.`,
        table: [['Topic', 'Difficulty', 'Goal'], ...course.topics.map(t => [t, course.difficulty, 'Mastery'])]
      },
      {
        title: 'Implementation Strategy',
        icon: '💻',
        content: `When working through ${course.title}, focus on understanding the underlying patterns before jumping into code. Use the visualizer to trace every step of the algorithms.`,
        code: `// Sample pattern for ${course.topics[0] || 'Algorithm'}\nfunction solveProblem(input) {\n  // 1. Initialize state\n  // 2. Process ${course.topics[0] || 'data'}\n  // 3. Return result\n}`
      }
    ],
    tips: [
      `Pay close attention to ${course.topics[0] || 'the core concepts'}`,
      'Always analyze time and space complexity before optimizing',
      'Use the AlgoVerse visualizer to see the data structures in action',
      `Complete the assessment to earn your ${course.xp} XP`
    ],
    problems: [
      { title: `${course.topics[0] || 'Concept'} Application`, diff: 'Easy', hint: `Focus on the basic implementation of ${course.topics[0] || 'the topic'}` },
      { title: `${course.topics[1] || 'Intermediate'} Challenge`, diff: 'Medium', hint: `Try to optimize your solution for ${course.topics[1] || 'the concept'}` },
    ]
  };
}

// ─── PDF Generator ─────────────────────────────────────────────────────────────
function buildPDF(course: (typeof MOCK_COURSES)[0], guide: StudyGuide): string {
  const bm = BADGE_META[course.badge];
  const dm = DIFFICULTY_META[course.difficulty];
  const date = new Date().toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' });

  const sectionHTML = guide.sections.map((s, i) => `
    <div style="margin-bottom:28px;page-break-inside:avoid">
      <h2 style="font-size:18px;font-weight:800;color:#1e293b;border-left:4px solid #6366f1;padding-left:12px;margin-bottom:12px">
        ${s.icon} ${s.title}
      </h2>
      <p style="color:#475569;font-size:14px;line-height:1.7;margin-bottom:12px">${s.content}</p>
      ${s.visual ? `<pre style="background:#0f172a;color:#94a3b8;padding:16px;border-radius:10px;font-size:12px;overflow-x:auto;white-space:pre-wrap;margin-bottom:12px;border:1px solid #1e293b">${s.visual}</pre>` : ''}
      ${s.code ? `<pre style="background:#020617;color:#7dd3fc;padding:16px;border-radius:10px;font-size:12px;overflow-x:auto;white-space:pre-wrap;margin-bottom:12px;border:1px solid #1e293b;font-family:monospace">${s.code}</pre>` : ''}
      ${s.table ? `<table style="width:100%;border-collapse:collapse;margin-bottom:12px;font-size:13px">
        ${s.table.map((row, ri) => `<tr style="background:${ri===0?'#6366f1':ri%2===0?'#f8fafc':'#fff'}">
          ${row.map(cell => `<${ri===0?'th':'td'} style="padding:8px 12px;border:1px solid #e2e8f0;${ri===0?'color:white;font-weight:700;':'color:#334155;'}">${cell}</${ri===0?'th':'td'}>`).join('')}
        </tr>`).join('')}
      </table>` : ''}
    </div>`).join('');

  return `<!DOCTYPE html><html>
<head><meta charset="UTF-8"><title>AlgoVerse Study Guide — ${course.title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Inter',sans-serif;color:#1e293b;padding:40px;background:#fff;max-width:900px;margin:0 auto}
  @media print{body{padding:20px;max-width:100%}}
  .header{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:28px;border-radius:16px;margin-bottom:28px}
  .badge{display:inline-block;padding:4px 14px;border-radius:999px;font-size:12px;font-weight:700;background:rgba(255,255,255,0.2);margin-top:8px}
  .objectives{background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:16px;margin-bottom:24px}
  .tips{background:#fefce8;border:1px solid #fde047;border-radius:12px;padding:16px;margin-bottom:24px}
  .problems{background:#fdf4ff;border:1px solid #d8b4fe;border-radius:12px;padding:16px;margin-bottom:24px}
  .footer{border-top:1px solid #e2e8f0;padding-top:12px;font-size:11px;color:#94a3b8;text-align:center;margin-top:24px}
  ul{padding-left:18px;margin-top:8px} li{margin-bottom:4px;font-size:13px;color:#475569}
</style></head>
<body>
  <div class="header">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <p style="font-size:11px;opacity:.7;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px">AlgoVerse Study Guide</p>
        <h1 style="font-size:26px;font-weight:900;margin-bottom:4px">${course.title}</h1>
        <p style="font-size:14px;opacity:.8">${course.description}</p>
        <span class="badge">${bm.icon} ${bm.label} Course · ${course.difficulty} · ${course.duration}</span>
      </div>
      <div style="text-align:right;font-size:12px;opacity:.7"><p>${date}</p><p>+${course.xp} XP</p></div>
    </div>
  </div>

  <div class="objectives">
    <h2 style="font-size:15px;font-weight:700;color:#0369a1;margin-bottom:8px">📌 Learning Objectives</h2>
    <ul>${guide.objectives.map(o => `<li>${o}</li>`).join('')}</ul>
  </div>

  <p style="color:#64748b;font-size:14px;margin-bottom:20px;line-height:1.7">${guide.overview}</p>

  ${sectionHTML}

  <div class="tips">
    <h2 style="font-size:15px;font-weight:700;color:#854d0e;margin-bottom:8px">💡 Pro Tips & Interview Tricks</h2>
    <ul>${guide.tips.map(t => `<li>${t}</li>`).join('')}</ul>
  </div>

  <div class="problems">
    <h2 style="font-size:15px;font-weight:700;color:#7e22ce;margin-bottom:12px">🎯 Practice Problems</h2>
    ${guide.problems.map(p => `<div style="margin-bottom:10px;padding:10px;background:white;border-radius:8px;border:1px solid #e9d5ff">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-weight:700;font-size:13px">${p.title}</span>
        <span style="font-size:11px;font-weight:700;color:${p.diff==='Easy'?'#16a34a':p.diff==='Medium'?'#ca8a04':'#dc2626'}">${p.diff}</span>
      </div>
      <p style="font-size:12px;color:#64748b">💡 Hint: ${p.hint}</p>
    </div>`).join('')}
  </div>

  <div class="footer">AlgoVerse Study Guide · ${course.title} · Generated ${date} · Save this PDF for offline reference</div>
</body></html>`;
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Assignment() {
  const [selectedId, setSelectedId] = useState('');
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [generating, setGenerating] = useState(false);

  const course = MOCK_COURSES.find(c => c.id === selectedId);
  const guide = course ? getGuide(course.id) : null;

  // Reset generating flag whenever the selected course changes
  useEffect(() => {
    setGenerating(false);
  }, [selectedId]);

  const handleGenerate = useCallback(() => {
    if (!course || !guide) return;
    // Capture the current course/guide at the moment of click
    const currentCourse = course;
    const currentGuide = guide;
    setGenerating(true);
    setTimeout(() => {
      const html = buildPDF(currentCourse, currentGuide);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
        setTimeout(() => {
          try { win.print(); } catch (_) {}
          setGenerating(false);
          URL.revokeObjectURL(url);
        }, 600);
      } else {
        setGenerating(false);
        URL.revokeObjectURL(url);
      }
    }, 400);
  }, [course, guide]);

  const SECTION_ICONS: Record<string, React.ReactNode> = {
    overview: <BookOpen className="w-4 h-4" />, visual: <BarChart2 className="w-4 h-4" />,
    code: <Code className="w-4 h-4" />, tips: <Lightbulb className="w-4 h-4" />, problems: <Target className="w-4 h-4" />,
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-black mb-2">Course <span className="text-gradient">Assignments</span></h2>
        <p className="text-slate-400 text-lg max-w-2xl">
          Select any course and get a fully prepared, detailed study guide — complete with visual diagrams, code walkthroughs, complexity tables, and practice problems. Download as PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-8">
        {/* ── Left: Course picker ── */}
        <div>
          <div className="glass-panel p-5 border border-white/5 sticky top-0">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <List className="w-4 h-4" /> Choose Course
            </h3>

            {/* Custom select */}
            <div className="relative mb-5">
              <button onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white font-semibold text-sm hover:border-indigo-500/40 transition-colors">
                <span className={course ? 'text-white' : 'text-slate-400'}>
                  {course ? course.title : 'Select a course…'}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-8 }}
                    className="absolute z-50 top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto custom-scrollbar">
                    {(['Beginner','Intermediate','Advanced','Expert'] as const).map(diff => (
                      <div key={diff}>
                        <div className="px-3 py-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800/50 sticky top-0">
                          {BADGE_META[MOCK_COURSES.find(c=>c.difficulty===diff)!.badge].icon} {diff}
                        </div>
                        {MOCK_COURSES.filter(c => c.difficulty === diff).map(c => (
                          <button key={c.id} onClick={() => { setSelectedId(c.id); setOpen(false); setActiveSection(0); }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${selectedId===c.id ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                            {c.title}
                          </button>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Selected course meta */}
            {course && (
              <motion.div initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} className="space-y-3">
                <img src={course.thumbnail} alt={course.title} className="w-full aspect-video object-cover rounded-xl" />
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${DIFFICULTY_META[course.difficulty].bg} ${DIFFICULTY_META[course.difficulty].color}`}>{course.difficulty}</span>
                  <span className="text-xs text-indigo-400 font-bold">+{course.xp} XP · {course.duration}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {course.topics.map(t => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">{t}</span>
                  ))}
                </div>

                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  onClick={handleGenerate} disabled={generating}
                  className={`w-full py-3.5 rounded-xl font-black text-white flex items-center justify-center gap-2 text-sm shadow-lg transition-all ${generating ? 'opacity-60 cursor-not-allowed bg-slate-700' : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500'}`}>
                  {generating
                    ? <motion.div animate={{ rotate:360 }} transition={{ duration:0.8,repeat:Infinity,ease:'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    : <Printer className="w-4 h-4" />}
                  {generating ? 'Opening PDF…' : 'Download as PDF'}
                </motion.button>

                <p className="text-[10px] text-slate-500 text-center">Opens print dialog → Save as PDF to your device or Send to printer</p>
              </motion.div>
            )}

            {!course && (
              <div className="text-center py-10">
                <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Select a course to view its complete study guide</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Study Guide ── */}
        <div>
          {!guide && (
            <div className="glass-panel p-16 border border-white/5 flex flex-col items-center justify-center text-center h-full min-h-96">
              <BookOpen className="w-16 h-16 text-slate-700 mb-4" />
              <h3 className="text-xl font-bold text-slate-400 mb-2">No Course Selected</h3>
              <p className="text-slate-500">Choose a course from the left panel to view its complete study guide with visual explanations, code examples, and practice problems.</p>
            </div>
          )}

          {guide && course && (
            <motion.div key={course.id} initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.4 }}>
              {/* Guide header */}
              <div className="glass-panel p-6 mb-6 border border-indigo-500/10 bg-gradient-to-r from-indigo-900/10 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
                <div className="flex items-start justify-between relative z-10 flex-wrap gap-4">
                  <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${BADGE_META[course.badge].gradient} mb-3`}>
                      <span className="text-white text-xs font-black">{BADGE_META[course.badge].icon} {BADGE_META[course.badge].label} Study Guide</span>
                    </div>
                    <h2 className="text-2xl font-black text-white mb-1">{course.title}</h2>
                    <p className="text-slate-400 text-sm">{guide.overview}</p>
                  </div>
                </div>

                {/* Objectives */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 relative z-10">
                  {guide.objectives.map((o, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" /> {o}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section tabs */}
              <div className="flex gap-2 flex-wrap mb-6">
                {guide.sections.map((s, i) => (
                  <button key={i} onClick={() => setActiveSection(i)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${activeSection === i ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-500'}`}>
                    <span>{s.icon}</span> {s.title.length > 22 ? s.title.slice(0,22)+'…' : s.title}
                  </button>
                ))}
                <button onClick={() => setActiveSection(guide.sections.length)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${activeSection === guide.sections.length ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-500'}`}>
                  💡 Tips & Problems
                </button>
              </div>

              {/* Active section content */}
              <AnimatePresence mode="wait">
                {activeSection < guide.sections.length && (() => {
                  const s = guide.sections[activeSection];
                  return (
                    <motion.div key={activeSection} initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-16 }} className="space-y-5">
                      <div className="glass-panel p-6 border border-white/5">
                        <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                          <span className="text-2xl">{s.icon}</span> {s.title}
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-5">{s.content}</p>

                        {s.visual && (
                          <div className="mb-5">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                              <BarChart2 className="w-3.5 h-3.5" /> Visual Diagram
                            </div>
                            <pre className="bg-slate-950 text-slate-300 p-5 rounded-xl text-xs leading-relaxed overflow-x-auto custom-scrollbar border border-slate-800 whitespace-pre-wrap font-mono">
                              {s.visual}
                            </pre>
                          </div>
                        )}

                        {s.code && (
                          <div className="mb-5">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                              <Code className="w-3.5 h-3.5" /> Code Implementation
                            </div>
                            <pre className="bg-slate-950 text-sky-300 p-5 rounded-xl text-xs leading-relaxed overflow-x-auto custom-scrollbar border border-slate-800 whitespace-pre-wrap font-mono">
                              {s.code}
                            </pre>
                          </div>
                        )}

                        {s.table && (
                          <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                              <List className="w-3.5 h-3.5" /> Comparison Table
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-slate-800">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-indigo-500/20">
                                    {s.table[0].map((h, i) => (
                                      <th key={i} className="px-3 py-2.5 text-left text-indigo-300 font-black border-b border-slate-700/50">{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {s.table.slice(1).map((row, ri) => (
                                    <tr key={ri} className={ri % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/10'}>
                                      {row.map((cell, ci) => (
                                        <td key={ci} className="px-3 py-2 text-slate-300 border-b border-slate-800/50 font-mono">{cell}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })()}

                {activeSection === guide.sections.length && (
                  <motion.div key="tips" initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-16 }} className="space-y-5">
                    {/* Tips */}
                    <div className="glass-panel p-6 border border-amber-500/10">
                      <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-amber-400" /> Pro Tips & Interview Tricks
                      </h3>
                      <div className="space-y-3">
                        {guide.tips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                            <span className="text-amber-400 font-black text-sm flex-shrink-0">{i+1}.</span>
                            <p className="text-slate-300 text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Practice Problems */}
                    <div className="glass-panel p-6 border border-purple-500/10">
                      <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-400" /> Practice Problems
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {guide.problems.map((p, i) => {
                          const dc = p.diff==='Easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : p.diff==='Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : p.diff==='Hard' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-purple-400 bg-purple-500/10 border-purple-500/20';
                          return (
                            <div key={i} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-purple-500/20 transition-colors">
                              <div className="flex items-start justify-between mb-2 gap-2">
                                <p className="font-bold text-white text-sm">{p.title}</p>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border flex-shrink-0 ${dc}`}>{p.diff}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-snug">💡 {p.hint}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <button onClick={() => setActiveSection(s => Math.max(0, s-1))} disabled={activeSection===0}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-bold border border-slate-700 hover:border-slate-500 disabled:opacity-30 transition-all">
                  ← Previous
                </button>
                <button onClick={() => setActiveSection(s => Math.min(guide.sections.length, s+1))} disabled={activeSection===guide.sections.length}
                  className="px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 text-sm font-bold border border-indigo-500/20 hover:bg-indigo-500/30 disabled:opacity-30 transition-all">
                  Next →
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
