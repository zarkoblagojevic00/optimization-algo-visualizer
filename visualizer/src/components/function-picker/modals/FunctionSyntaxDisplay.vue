<template>
    <div>
        <div class="reference-lib">
            Taken from
            <a
                href="https://github.com/bugwheels94/math-expression-evaluator#supported-symbols"
                target="_blank"
                rel="noopener noreferrer"
                >math-expression-evaluator GitHub page.</a
            >
        </div>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Explanation</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>+</strong></td>
                        <td>Addition Operator eg. 2+3 results 5</td>
                    </tr>
                    <tr>
                        <td><strong>-</strong></td>
                        <td>Subtraction Operator eg. 2-3 results -1</td>
                    </tr>
                    <tr>
                        <td><strong>/</strong></td>
                        <td>Division operator eg 3/2 results 1.5</td>
                    </tr>
                    <tr>
                        <td><strong>*</strong></td>
                        <td>Multiplication Operator eg. 2*3 results 6</td>
                    </tr>
                    <tr>
                        <td><strong>Mod</strong></td>
                        <td>Modulus Operator eg. 3 Mod 2 results 1</td>
                    </tr>
                    <tr>
                        <td><strong>(</strong></td>
                        <td>Opening Parenthesis</td>
                    </tr>
                    <tr>
                        <td><strong>)</strong></td>
                        <td>Closing Parenthesis</td>
                    </tr>
                    <tr>
                        <td><strong>&amp;</strong></td>
                        <td>Bitwise AND eg. 3&amp;1 results 1</td>
                    </tr>
                    <tr>
                        <td><strong>Sigma</strong></td>
                        <td>Summation eg. Sigma(1,100,n) results 5050</td>
                    </tr>
                    <tr>
                        <td><strong>Pi</strong></td>
                        <td>Product eg. Pi(1,10,n) results 3628800</td>
                    </tr>
                    <tr>
                        <td><strong>n</strong></td>
                        <td>Variable for Summation or Product</td>
                    </tr>
                    <tr>
                        <td><strong>pi</strong></td>
                        <td>Math constant pi returns 3.14</td>
                    </tr>
                    <tr>
                        <td><strong>e</strong></td>
                        <td>Math constant e returns 2.71</td>
                    </tr>
                    <tr>
                        <td><strong>C</strong></td>
                        <td>Combination operator eg. 4C2 returns 6</td>
                    </tr>
                    <tr>
                        <td><strong>P</strong></td>
                        <td>Permutation operator eg. 4P2 returns 12</td>
                    </tr>
                    <tr>
                        <td><strong>!</strong></td>
                        <td>factorial operator eg. 4! returns 24</td>
                    </tr>
                    <tr>
                        <td><strong>log</strong></td>
                        <td>
                            logarithmic function with base 10 eg. log 1000
                            returns 3
                        </td>
                    </tr>
                    <tr>
                        <td><strong>ln</strong></td>
                        <td>
                            natural log function with base e eg. ln 2 returns
                            .3010
                        </td>
                    </tr>
                    <tr>
                        <td><strong>pow</strong></td>
                        <td>
                            power function with two operator pow(2,3) returns 8
                        </td>
                    </tr>
                    <tr>
                        <td><strong>^</strong></td>
                        <td>power operator eg. 2^3 returns 8</td>
                    </tr>
                    <tr>
                        <td><strong>root</strong></td>
                        <td>underroot function root 4 returns 2</td>
                    </tr>
                    <tr>
                        <td><strong>sin</strong></td>
                        <td>Sine function</td>
                    </tr>
                    <tr>
                        <td><strong>cos</strong></td>
                        <td>Cosine function</td>
                    </tr>
                    <tr>
                        <td><strong>tan</strong></td>
                        <td>Tangent function</td>
                    </tr>
                    <tr>
                        <td><strong>asin</strong></td>
                        <td>Inverse Sine function</td>
                    </tr>
                    <tr>
                        <td><strong>acos</strong></td>
                        <td>Inverse Cosine function</td>
                    </tr>
                    <tr>
                        <td><strong>atan</strong></td>
                        <td>Inverse Tangent function</td>
                    </tr>
                    <tr>
                        <td><strong>sinh</strong></td>
                        <td>Hyperbolic Sine function</td>
                    </tr>
                    <tr>
                        <td><strong>cosh</strong></td>
                        <td>Hyperbolic Cosine function</td>
                    </tr>
                    <tr>
                        <td><strong>tanh</strong></td>
                        <td>Hyperbolic Tangent function</td>
                    </tr>
                    <tr>
                        <td><strong>asinh</strong></td>
                        <td>Inverse Hyperbolic Sine function</td>
                    </tr>
                    <tr>
                        <td><strong>acosh</strong></td>
                        <td>Inverse Hyperbolic Cosine function</td>
                    </tr>
                    <tr>
                        <td><strong>atanh</strong></td>
                        <td>Inverse Hyperbolic Tangent function</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style scoped>
.reference-lib {
    text-align: left;
    font-size: 0.9rem;
    margin-bottom: 0.5em;
}
.table-wrapper {
    overflow-y: auto;
    padding: 0.5em 1.2em;
    height: 350px;
}

table {
    border: 2px solid var(--control-border-color-focused);
    border-collapse: collapse;
    width: 100%;
}

th,
td {
    border: 1px solid var(--control-border-color);
    padding: 0.2em 0.5em;
    font-size: 0.95rem;
}

td:last-child {
    text-align: justify;
}

::-webkit-scrollbar {
    width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    background: #c0c0c0;
    border-radius: 0.25em;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 0.25em;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
