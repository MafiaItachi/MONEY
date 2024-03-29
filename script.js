document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('transaction-form');
  const transactionList = document.querySelector('.transactions');
  const friend1Summary = document.getElementById('friend1-summary');
  const friend2Summary = document.getElementById('friend2-summary');
  const debtSummary = document.getElementById('debt-summary');
  const clearAllButton = document.getElementById('clear-all');
  const transactionsSection = document.querySelector('.transactions');


  let currentPayer = 'friend1'; // Assuming friend1 starts as payer
  let totalFriend1 = 0;
  let totalFriend2 = 0;

  // Retrieve transactions and summary from localStorage if available
  const savedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const savedSummary = JSON.parse(localStorage.getItem('summary')) || {};

  function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(savedTransactions));
    localStorage.setItem('summary', JSON.stringify(savedSummary));
  }

  function loadSavedData() {
    savedTransactions.forEach((transaction) => {
      addTransactionToDOM(transaction);
    });

    totalFriend1 = savedSummary.totalFriend1 || 0;
    totalFriend2 = savedSummary.totalFriend2 || 0;
    updateSummary();
  }

  loadSavedData();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = +document.getElementById('amount').value;
    const date = new Date().toLocaleDateString(); // Get current date

    addTransaction(amount, date, currentPayer);
    updateSummary();
    updateLocalStorage();
    form.reset();
  });
  clearAllButton.addEventListener('click', () => {
    localStorage.removeItem('transactions');
    localStorage.removeItem('summary');
    savedTransactions.length = 0;
    transactionList.innerHTML = ''; // Clear transaction history
    friend1Summary.textContent = 'Bipul Total: ₹ 0.00'; // Reset summary
    friend2Summary.textContent = 'Subho Total: ₹ 0.00';
    debtSummary.textContent = '';
  });

  const payerRadios = document.querySelectorAll('input[name="payer"]');
  payerRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      currentPayer = radio.value;
    });
  });

   // Function to add transaction to the DOM
   function addTransactionToDOM(transaction) {
    const transactionElement = document.createElement('p');
    transactionElement.textContent = transaction;
    transactionsSection.appendChild(transactionElement);
    if (transactionsSection.firstChild) {
      transactionsSection.insertBefore(transactionElement, transactionsSection.firstChild);
    } else {
      transactionsSection.appendChild(transactionElement);
    }
  }

  function addTransaction(amount, date, payer) {
    const payerName = payer === 'friend1' ? 'Bipul' : 'Subho';
    const receiver = payer === 'friend1' ? 'Subho' : 'Bipul';
    const transactionText = `${payerName} paid ₹ ${amount.toFixed(2)} for ${receiver} on ${date}`;

    addTransactionToDOM(transactionText);
    savedTransactions.push(transactionText);

    if (payer === 'friend1') {
      totalFriend1 += amount;
    } else {
      totalFriend2 += amount;
    }
  }

  function updateSummary() {
    friend1Summary.textContent = `Bipul Total: ₹ ${totalFriend1.toFixed(2)}`;
    friend2Summary.textContent = `Subho Total: ₹ ${totalFriend2.toFixed(2)}`;

    const debtAmount = Math.abs(totalFriend1 - totalFriend2);
    if (totalFriend1 > totalFriend2) {
      debtSummary.textContent = `Subho Will pay back Bipul: ₹ ${debtAmount.toFixed(2)}`;
    } else if (totalFriend2 > totalFriend1) {
      debtSummary.textContent = `Bipul Will pay back Subho: ₹ ${debtAmount.toFixed(2)}`;
    } else {
      debtSummary.textContent = 'No debts between friends.';
    }

    // Update summary object in local storage
    savedSummary.totalFriend1 = totalFriend1;
    savedSummary.totalFriend2 = totalFriend2;
  }
});


