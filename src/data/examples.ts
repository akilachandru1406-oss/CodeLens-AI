import { SupportedLanguage } from "../types";

export interface CodeExample {
  id: string;
  title: string;
  language: SupportedLanguage;
  description: string;
  code: string;
}

export const CODE_EXAMPLES: CodeExample[] = [
  {
    id: "nested-loops",
    title: "Nested Matrix Iteration (O(n²))",
    language: "C++",
    description: "Classic nested loops demonstrating quadratic time complexity derivation",
    code: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    for(int i = 0; i < n; i++) {
        for(int j = 0; j < n; j++) {
            cout << i << " " << j << endl;
        }
    }

    return 0;
}`
  },
  {
    id: "two-sum-brute",
    title: "Two Sum Problem (Brute Force O(n²))",
    language: "C++",
    description: "Pair search with nested loops demonstrating Hash Map optimization & Time-Space tradeoff",
    code: `#include <vector>
#include <iostream>
using namespace std;

// Brute-force Two Sum searching all pairs
vector<int> twoSum(vector<int>& nums, int target) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    if (!result.empty()) {
        cout << "Indices: " << result[0] << ", " << result[1] << endl;
    }
    return 0;
}`
  },
  {
    id: "binary-search",
    title: "Binary Search (O(log n))",
    language: "Python",
    description: "Divide-and-conquer logarithmic search on sorted sequence",
    code: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1

    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1

# Sample execution
numbers = [1, 3, 5, 7, 9, 11, 13, 15]
index = binary_search(numbers, 7)
print("Found target at index:", index)`
  },
  {
    id: "fibonacci-recursive",
    title: "Recursive Fibonacci (Exponential O(2ⁿ))",
    language: "Java",
    description: "Naive recursion showcasing recursion tree and stack frame memory usage",
    code: `public class Fibonacci {
    // Naive recursive calculation
    public static int fib(int n) {
        if (n <= 1) {
            return n;
        }
        return fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        int n = 6;
        System.out.println("Fibonacci of " + n + " is: " + fib(n));
    }
}`
  }
];
