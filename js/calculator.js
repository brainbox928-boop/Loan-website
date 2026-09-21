document.addEventListener('DOMContentLoaded', () => {
  const amount = document.querySelector('#loanAmount');
  const rate = document.querySelector('#interestRate');
  const term = document.querySelector('#loanTerm');
  const monthly = document.querySelector('#monthlyPayment');
  const total = document.querySelector('#totalRepayment');
  const interest = document.querySelector('#totalInterest');
  if (!amount || !rate || !term) return;

  const format = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  const calculate = () => {
    const principal = Number(amount.value) || 0;
    const months = Number(term.value) || 1;
    const monthlyRate = (Number(rate.value) || 0) / 100 / 12;
    const payment = monthlyRate ? principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1) : principal / months;
    monthly.textContent = format(payment);
    total.textContent = format(payment * months);
    interest.textContent = format(Math.max(0, payment * months - principal));
  };
  [amount, rate, term].forEach(input => input.addEventListener('input', calculate));
  calculate();
});
