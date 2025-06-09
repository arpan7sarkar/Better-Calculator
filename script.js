/**
 * Scientific Calculator Pro
 * A fully functional scientific calculator with advanced operations
 * Built with vanilla JavaScript for optimal performance
 */

class ScientificCalculator {
    constructor() {
        this.display = document.getElementById('result');
        this.expression = document.getElementById('expression');
        this.angleToggle = document.getElementById('angleToggle');
        
        // Calculator state
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.waitingForNewInput = false;
        this.angleMode = 'DEG'; // DEG or RAD
        this.memory = 0;
        this.lastResult = 0;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateDisplay();
    }
    
    bindEvents() {
        // Button click events
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => this.handleButtonClick(e));
        });
        
        // Angle toggle
        this.angleToggle.addEventListener('click', () => this.toggleAngleMode());
        
        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Prevent context menu on buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('contextmenu', (e) => e.preventDefault());
        });
    }
    
    handleButtonClick(event) {
        const button = event.target;
        const number = button.dataset.number;
        const action = button.dataset.action;
        
        // Add visual feedback
        this.addButtonFeedback(button);
        
        if (number !== undefined) {
            this.inputNumber(number);
        } else if (action) {
            this.handleAction(action);
        }
    }
    
    addButtonFeedback(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }
    
    handleKeyPress(event) {
        const key = event.key;
        
        // Prevent default for calculator keys
        if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Escape') {
            event.preventDefault();
        }
        
        if ('0123456789'.includes(key)) {
            this.inputNumber(key);
        } else if (key === '.') {
            this.handleAction('.');
        } else if (key === '+') {
            this.handleAction('+');
        } else if (key === '-') {
            this.handleAction('-');
        } else if (key === '*') {
            this.handleAction('*');
        } else if (key === '/') {
            this.handleAction('/');
        } else if (key === '=' || key === 'Enter') {
            this.handleAction('=');
        } else if (key === 'Escape') {
            this.handleAction('ac');
        } else if (key === 'Backspace') {
            this.handleAction('ce');
        }
    }
    
    inputNumber(num) {
        if (this.waitingForNewInput) {
            this.currentInput = num;
            this.waitingForNewInput = false;
        } else {
            this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
        }
        this.updateDisplay();
    }
    
    handleAction(action) {
        try {
            switch (action) {
                case '+':
                case '-':
                case '*':
                case '/':
                    this.handleOperator(action);
                    break;
                case '=':
                    this.calculate();
                    break;
                case '.':
                    this.inputDecimal();
                    break;
                case '±':
                    this.toggleSign();
                    break;
                case 'ac':
                    this.allClear();
                    break;
                case 'ce':
                    this.clearEntry();
                    break;
                case 'sqrt':
                    this.calculateSquareRoot();
                    break;
                case 'square':
                    this.calculateSquare();
                    break;
                case 'factorial':
                    this.calculateFactorial();
                    break;
                case 'sin':
                    this.calculateTrig('sin');
                    break;
                case 'cos':
                    this.calculateTrig('cos');
                    break;
                case 'tan':
                    this.calculateTrig('tan');
                    break;
                case 'ms':
                    this.memoryStore();
                    break;
                case 'mr':
                    this.memoryRecall();
                    break;
                case 'mc':
                    this.memoryClear();
                    break;
            }
        } catch (error) {
            this.showError();
        }
    }
    
    handleOperator(nextOperator) {
        const inputValue = parseFloat(this.currentInput);
        
        if (this.previousInput === '') {
            this.previousInput = this.currentInput;
        } else if (this.operator && !this.waitingForNewInput) {
            const result = this.performCalculation();
            this.currentInput = String(result);
            this.lastResult = result;
        }
        
        this.waitingForNewInput = true;
        this.operator = nextOperator;
        this.updateExpression();
        this.updateDisplay();
    }
    
    calculate() {
        if (this.operator && this.previousInput !== '' && !this.waitingForNewInput) {
            const result = this.performCalculation();
            this.currentInput = String(result);
            this.lastResult = result;
            this.operator = null;
            this.previousInput = '';
            this.waitingForNewInput = true;
            this.expression.textContent = '';
            this.updateDisplay();
        }
    }
    
    performCalculation() {
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        
        if (isNaN(prev) || isNaN(current)) return current;
        
        switch (this.operator) {
            case '+':
                return prev + current;
            case '-':
                return prev - current;
            case '*':
                return prev * current;
            case '/':
                if (current === 0) {
                    throw new Error('Division by zero');
                }
                return prev / current;
            default:
                return current;
        }
    }
    
    inputDecimal() {
        if (this.waitingForNewInput) {
            this.currentInput = '0.';
            this.waitingForNewInput = false;
        } else if (this.currentInput.indexOf('.') === -1) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }
    
    toggleSign() {
        if (this.currentInput !== '0') {
            this.currentInput = this.currentInput.startsWith('-') 
                ? this.currentInput.slice(1) 
                : '-' + this.currentInput;
        }
        this.updateDisplay();
    }
    
    allClear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.waitingForNewInput = false;
        this.expression.textContent = '';
        this.updateDisplay();
    }
    
    clearEntry() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }
    
    calculateSquareRoot() {
        const value = parseFloat(this.currentInput);
        if (value < 0) {
            throw new Error('Invalid input for square root');
        }
        const result = Math.sqrt(value);
        this.currentInput = String(result);
        this.waitingForNewInput = true;
        this.updateDisplay();
    }
    
    calculateSquare() {
        const value = parseFloat(this.currentInput);
        const result = value * value;
        this.currentInput = String(result);
        this.waitingForNewInput = true;
        this.updateDisplay();
    }
    
    calculateFactorial() {
        const value = parseInt(this.currentInput);
        if (value < 0 || !Number.isInteger(parseFloat(this.currentInput))) {
            throw new Error('Invalid input for factorial');
        }
        if (value > 170) {
            throw new Error('Number too large for factorial');
        }
        
        let result = 1;
        for (let i = 2; i <= value; i++) {
            result *= i;
        }
        
        this.currentInput = String(result);
        this.waitingForNewInput = true;
        this.updateDisplay();
    }
    
    calculateTrig(func) {
        const value = parseFloat(this.currentInput);
        let angleInRadians = this.angleMode === 'DEG' 
            ? value * (Math.PI / 180) 
            : value;
        
        let result;
        switch (func) {
            case 'sin':
                result = Math.sin(angleInRadians);
                break;
            case 'cos':
                result = Math.cos(angleInRadians);
                break;
            case 'tan':
                result = Math.tan(angleInRadians);
                break;
        }
        
        // Handle very small numbers (close to zero)
        if (Math.abs(result) < 1e-10) {
            result = 0;
        }
        
        this.currentInput = String(result);
        this.waitingForNewInput = true;
        this.updateDisplay();
    }
    
    toggleAngleMode() {
        this.angleMode = this.angleMode === 'DEG' ? 'RAD' : 'DEG';
        this.angleToggle.textContent = this.angleMode;
        
        // Add visual feedback
        this.angleToggle.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.angleToggle.style.transform = '';
        }, 150);
    }
    
    memoryStore() {
        this.memory = parseFloat(this.currentInput);
        this.showMemoryFeedback('MS');
    }
    
    memoryRecall() {
        this.currentInput = String(this.memory);
        this.waitingForNewInput = true;
        this.updateDisplay();
        this.showMemoryFeedback('MR');
    }
    
    memoryClear() {
        this.memory = 0;
        this.showMemoryFeedback('MC');
    }
    
    showMemoryFeedback(action) {
        const originalText = this.expression.textContent;
        this.expression.textContent = `Memory ${action}`;
        this.expression.style.color = '#4A90E2';
        
        setTimeout(() => {
            this.expression.textContent = originalText;
            this.expression.style.color = '';
        }, 1000);
    }
    
    updateExpression() {
        if (this.operator && this.previousInput) {
            const operatorSymbol = {
                '+': '+',
                '-': '−',
                '*': '×',
                '/': '÷'
            }[this.operator] || this.operator;
            
            this.expression.textContent = `${this.previousInput} ${operatorSymbol}`;
        }
    }
    
    updateDisplay() {
        // Format the number for display
        let displayValue = this.currentInput;
        
        // Handle very long numbers
        if (displayValue.length > 12) {
            const num = parseFloat(displayValue);
            if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
                displayValue = num.toExponential(6);
            } else {
                displayValue = num.toPrecision(12).replace(/\.?0+$/, '');
            }
        }
        
        this.display.textContent = displayValue;
        
        // Remove error class if present
        this.display.classList.remove('error');
    }
    
    showError() {
        this.display.textContent = 'Error';
        this.display.classList.add('error');
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.waitingForNewInput = false;
        this.expression.textContent = '';
        
        // Auto-clear error after 2 seconds
        setTimeout(() => {
            if (this.display.textContent === 'Error') {
                this.allClear();
            }
        }, 2000);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScientificCalculator();
});

// Service Worker Registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
