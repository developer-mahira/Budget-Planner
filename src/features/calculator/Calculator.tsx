import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CalculatorIcon, Users, Target, CreditCard, Keyboard, Plus } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';

const Calculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: 'Basic Calculator', icon: CalculatorIcon },
    { id: 'split', label: 'Expense Split', icon: Users },
    { id: 'savings', label: 'Savings Calculator', icon: Target },
    { id: 'emi', label: 'EMI Calculator', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Calculators</h1>
        <p className="text-gray-600">Various calculators to help with your financial planning</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'basic' && <EnhancedCalculator />}
          {activeTab === 'split' && <ExpenseSplitCalculator />}
          {activeTab === 'savings' && <SavingsCalculator />}
          {activeTab === 'emi' && <EMICalculator />}
        </div>
        <div>
          <Card title="How to use">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Keyboard className="w-4 h-4" />
                  Keyboard Support
                </h4>
                <p className="text-sm text-gray-600">
                  Press number keys (0-9), operators (+, -, *, /), Enter (=), Escape (C), and period (.)
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Basic Calculator</h4>
                <p className="text-sm text-gray-600">
                  Full-featured calculator with memory, history, and keyboard support.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Expense Split</h4>
                <p className="text-sm text-gray-600">
                  Split bills among friends with tax and tip calculations.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Savings Calculator</h4>
                <p className="text-sm text-gray-600">
                  Plan your savings goals with compound interest calculations.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">EMI Calculator</h4>
                <p className="text-sm text-gray-600">
                  Calculate Equated Monthly Installments for loans with detailed breakdown.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Enhanced Calculator Component with Keyboard Support
const EnhancedCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);
  const [isError, setIsError] = useState(false);

  // Memoized handlers
  const handleNumberClick = useCallback((num: string) => {
    if (isError) {
      setDisplay(num);
      setIsError(false);
    } else if (display === '0' || operation !== null) {
      setDisplay(num);
      setOperation(null);
    } else {
      setDisplay(display + num);
    }
  }, [display, isError, operation]);

  const handleOperationClick = useCallback((op: string) => {
    if (previousValue === null) {
      setPreviousValue(display);
      setDisplay('0');
      setOperation(op);
    } else {
      calculateResult();
      setOperation(op);
    }
  }, [previousValue, display]);

  const calculateResult = useCallback(() => {
    if (previousValue && operation) {
      const prev = parseFloat(previousValue);
      const current = parseFloat(display);

      let result: number;
      switch (operation) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '×':
          result = prev * current;
          break;
        case '÷':
          if (current === 0) {
            setDisplay('Error');
            setIsError(true);
            return;
          }
          result = prev / current;
          break;
        default:
          return;
      }

      const calculation = `${prev} ${operation} ${current} = ${result}`;
      setHistory(prevHistory => [calculation, ...prevHistory.slice(0, 4)]);
      
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
    }
  }, [previousValue, operation, display]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setIsError(false);
  }, []);

  const handleClearEntry = useCallback(() => {
    setDisplay('0');
  }, []);

  const handleBackspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display]);

  const handleDecimalClick = useCallback(() => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display]);

  const handlePercentage = useCallback(() => {
    const value = parseFloat(display);
    setDisplay((value / 100).toString());
  }, [display]);

  const handlePlusMinus = useCallback(() => {
    const value = parseFloat(display);
    setDisplay((value * -1).toString());
  }, [display]);

  const handleMemoryClear = useCallback(() => {
    setMemory(0);
    toast.success('Memory cleared');
  }, []);

  const handleMemoryRecall = useCallback(() => {
    setDisplay(memory.toString());
  }, [memory]);

  const handleMemoryAdd = useCallback(() => {
    const value = parseFloat(display);
    setMemory(prev => prev + value);
    toast.success(`Added ${value} to memory`);
  }, [display]);

  const handleMemorySubtract = useCallback(() => {
    const value = parseFloat(display);
    setMemory(prev => prev - value);
    toast.success(`Subtracted ${value} from memory`);
  }, [display]);

  const handleSquare = useCallback(() => {
    const value = parseFloat(display);
    setDisplay((value * value).toString());
  }, [display]);

  const handleSquareRoot = useCallback(() => {
    const value = parseFloat(display);
    if (value < 0) {
      setDisplay('Error');
      setIsError(true);
      return;
    }
    setDisplay(Math.sqrt(value).toString());
  }, [display]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for calculator keys only
      if (/[\d+\-*/.=]|Enter|Escape|Backspace/.test(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          handleNumberClick(e.key);
          break;
        case '+':
          handleOperationClick('+');
          break;
        case '-':
          handleOperationClick('-');
          break;
        case '*':
          handleOperationClick('×');
          break;
        case '/':
          handleOperationClick('÷');
          break;
        case '.':
          handleDecimalClick();
          break;
        case '=':
        case 'Enter':
          calculateResult();
          break;
        case 'Escape':
          handleClear();
          break;
        case 'Backspace':
          handleBackspace();
          break;
        case 'm':
        case 'M':
          if (e.ctrlKey) {
            handleMemoryAdd();
          }
          break;
        case 'r':
        case 'R':
          if (e.ctrlKey) {
            handleMemoryRecall();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumberClick, handleOperationClick, calculateResult, handleClear, handleBackspace, handleDecimalClick, handleMemoryAdd, handleMemoryRecall]);

  const buttons = [
    [{ label: 'MC', action: handleMemoryClear, variant: 'secondary' },
     { label: 'MR', action: handleMemoryRecall, variant: 'secondary' },
     { label: 'M+', action: handleMemoryAdd, variant: 'secondary' },
     { label: 'M-', action: handleMemorySubtract, variant: 'secondary' }],
    
    [{ label: 'C', action: handleClear, variant: 'secondary' },
     { label: 'CE', action: handleClearEntry, variant: 'secondary' },
     { label: '⌫', action: handleBackspace, variant: 'secondary' },
     { label: '÷', action: () => handleOperationClick('÷'), variant: 'accent' }],
    
    [{ label: '7', action: () => handleNumberClick('7') },
     { label: '8', action: () => handleNumberClick('8') },
     { label: '9', action: () => handleNumberClick('9') },
     { label: '×', action: () => handleOperationClick('×'), variant: 'accent' }],
    
    [{ label: '4', action: () => handleNumberClick('4') },
     { label: '5', action: () => handleNumberClick('5') },
     { label: '6', action: () => handleNumberClick('6') },
     { label: '-', action: () => handleOperationClick('-'), variant: 'accent' }],
    
    [{ label: '1', action: () => handleNumberClick('1') },
     { label: '2', action: () => handleNumberClick('2') },
     { label: '3', action: () => handleNumberClick('3') },
     { label: '+', action: () => handleOperationClick('+'), variant: 'accent' }],
    
    [{ label: '±', action: handlePlusMinus, variant: 'secondary' },
     { label: '0', action: () => handleNumberClick('0') },
     { label: '.', action: handleDecimalClick },
     { label: '=', action: calculateResult, variant: 'primary' }],
    
    [{ label: 'x²', action: handleSquare, variant: 'secondary' },
     { label: '√', action: handleSquareRoot, variant: 'secondary' },
     { label: '%', action: handlePercentage, variant: 'secondary' }]
  ];

  return (
    <Card title="Advanced Calculator" padding="lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="max-w-lg mx-auto">
            <div className="mb-6 space-y-2">
              <div className="bg-gray-100 rounded-lg p-4 text-right">
                <div className="text-sm text-gray-500 h-6 overflow-x-auto whitespace-nowrap">
                  {previousValue} {operation}
                </div>
                <div className={`text-4xl font-bold overflow-x-auto whitespace-nowrap ${
                  isError ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {display}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Memory:</span>
                  <span className="font-medium">{memory}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Keyboard className="w-4 h-4" />
                  <span>Keyboard support enabled</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {buttons.flat().map((btn, index) => (
                <Button
                  key={`${btn.label}-${index}`}
                  onClick={btn.action as () => void}
                  variant={btn.variant as any || 'ghost'}
                  className={`
                    h-14 text-lg font-medium transition-all
                    ${btn.label === '=' ? 'col-span-1' : ''}
                  `}
                >
                  {btn.label}
                </Button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Keyboard Shortcuts</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">0-9</kbd>
                  <span className="text-gray-600">Numbers</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">+ - * /</kbd>
                  <span className="text-gray-600">Operations</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Enter</kbd>
                  <span className="text-gray-600">Equals</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Escape</kbd>
                  <span className="text-gray-600">Clear</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">.</kbd>
                  <span className="text-gray-600">Decimal</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Backspace</kbd>
                  <span className="text-gray-600">Delete</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl+M</kbd>
                  <span className="text-gray-600">Memory Add</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl+R</kbd>
                  <span className="text-gray-600">Memory Recall</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card title="Calculation History" padding="lg">
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="text-sm text-gray-600 font-mono">{item}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">No calculations yet</div>
                <p className="text-sm text-gray-500">
                  Start calculating to see history here
                </p>
              </div>
            )}
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHistory([])}
                fullWidth
                className="mt-4"
              >
                Clear History
              </Button>
            )}
          </Card>
        </div>
      </div>
    </Card>
  );
};

// Other calculator components
const ExpenseSplitCalculator: React.FC = () => {
  const [totalAmount, setTotalAmount] = useState('');
  const [numPeople, setNumPeople] = useState('2');
  const [tipPercentage, setTipPercentage] = useState('15');
  const [taxPercentage, setTaxPercentage] = useState('8');
  const [roundUp, setRoundUp] = useState(false);

  const splitAmount = useMemo(() => {
    const amount = parseFloat(totalAmount) || 0;
    const people = parseInt(numPeople) || 1;
    const tip = parseFloat(tipPercentage) || 0;
    const tax = parseFloat(taxPercentage) || 0;
    
    const totalWithTaxAndTip = amount * (1 + (tip + tax) / 100);
    let perPerson = people > 0 ? totalWithTaxAndTip / people : 0;
    
    if (roundUp) {
      perPerson = Math.ceil(perPerson);
    }
    
    return {
      original: perPerson,
      rounded: roundUp ? perPerson : null,
      total: totalWithTaxAndTip,
      taxAmount: amount * (tax / 100),
      tipAmount: amount * (tip / 100),
    };
  }, [totalAmount, numPeople, tipPercentage, taxPercentage, roundUp]);

  return (
    <Card title="Expense Split Calculator" padding="lg">
      <div className="max-w-md mx-auto space-y-6">
        <Input
          label="Total Amount ($)"
          type="number"
          placeholder="100.00"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
        />
        
        <Input
          label="Number of People"
          type="number"
          value={numPeople}
          onChange={(e) => setNumPeople(e.target.value)}
          min="1"
        />

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tip Percentage: {tipPercentage}%
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={tipPercentage}
              onChange={(e) => setTipPercentage(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Percentage: {taxPercentage}%
            </label>
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={taxPercentage}
              onChange={(e) => setTaxPercentage(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="roundUp"
            checked={roundUp}
            onChange={(e) => setRoundUp(e.target.checked)}
            className="w-4 h-4 text-accent rounded focus:ring-accent"
          />
          <label htmlFor="roundUp" className="text-sm text-gray-700">
            Round up to nearest dollar
          </label>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600">Each person pays</p>
              <p className="text-3xl font-bold text-accent">
                ${splitAmount.rounded || splitAmount.original.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const SavingsCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState('1000');
  const [monthlyContribution, setMonthlyContribution] = useState('100');
  const [annualRate, setAnnualRate] = useState('5');
  const [years, setYears] = useState('10');

  const results = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const PMT = parseFloat(monthlyContribution) || 0;
    const r = parseFloat(annualRate) / 100 / 12;
    const n = parseFloat(years) * 12;
    
    const futureValue = P * Math.pow(1 + r, n) + 
                        PMT * ((Math.pow(1 + r, n) - 1) / r);
    const totalInvested = P + (PMT * n);
    const interestEarned = futureValue - totalInvested;
    
    return {
      futureValue,
      totalInvested,
      interestEarned,
      roi: totalInvested > 0 ? (interestEarned / totalInvested) * 100 : 0,
    };
  }, [principal, monthlyContribution, annualRate, years]);

  return (
    <Card title="Savings Calculator" padding="lg">
      <div className="max-w-md mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Initial Amount ($)"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
          <Input
            label="Monthly Contribution ($)"
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Annual Interest Rate (%)"
            type="number"
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
            step="0.1"
          />
          <Input
            label="Years to Save"
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Future Value</p>
              <p className="text-3xl font-bold text-primary">
                ${results.futureValue.toFixed(2)}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-600">Total Invested</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${results.totalInvested.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-600">Interest Earned</p>
                <p className="text-lg font-semibold text-green-600">
                  ${results.interestEarned.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const EMICalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState('200000');
  const [interestRate, setInterestRate] = useState('7.5');
  const [loanTerm, setLoanTerm] = useState('20');

  const emiDetails = useMemo(() => {
    const P = parseFloat(loanAmount) || 0;
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(loanTerm) * 12;
    
    if (r === 0) {
      const emi = P / n;
      return {
        emi,
        totalPayment: emi * n,
        totalInterest: emi * n - P,
      };
    }
    
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    
    return {
      emi: isNaN(emi) ? 0 : emi,
      totalPayment: isNaN(totalPayment) ? 0 : totalPayment,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
    };
  }, [loanAmount, interestRate, loanTerm]);

  return (
    <Card title="EMI Calculator" padding="lg">
      <div className="max-w-md mx-auto space-y-6">
        <Input
          label="Loan Amount ($)"
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Interest Rate (%)"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            step="0.1"
          />
          <Input
            label="Loan Term (Years)"
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            min="1"
          />
        </div>

        <div className="p-4 bg-blue-50 rounded-lg space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Monthly EMI</p>
            <p className="text-3xl font-bold text-accent">
              ${emiDetails.emi.toFixed(2)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Total Payment</p>
              <p className="text-lg font-semibold text-gray-900">
                ${emiDetails.totalPayment.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Total Interest</p>
              <p className="text-lg font-semibold text-red-600">
                ${emiDetails.totalInterest.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default calculator;