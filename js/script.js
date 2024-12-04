// Seletores e variáveis globais
const form = document.getElementById('transaction-form');
const transactionsTableBody = document.querySelector('#transactions-table tbody');
const totalReceitasEl = document.getElementById('total-receitas');
const totalDespesasEl = document.getElementById('total-despesas');
const saldoFinalEl = document.getElementById('saldo-final');
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Formatar valor para moeda brasileira
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// Atualizar LocalStorage
function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Atualizar Resumo Financeiro
function updateSummary() {
  const receitas = transactions.filter(t => t.category === 'Receita').reduce((sum, t) => sum + t.value, 0);
  const despesas = transactions.filter(t => t.category === 'Despesa').reduce((sum, t) => sum + t.value, 0);
  const saldo = receitas - despesas;

  totalReceitasEl.textContent = formatCurrency(receitas);
  totalDespesasEl.textContent = formatCurrency(despesas);
  saldoFinalEl.textContent = formatCurrency(saldo);
}

// Renderizar Lista de Transações
function renderTransactions() {
  transactionsTableBody.innerHTML = '';
  transactions.forEach((t, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.description}</td>
      <td>${t.category}</td>
      <td>${t.date}</td>
      <td>${formatCurrency(t.value)}</td>
      <td>
        <button onclick="editTransaction(${index})">Editar</button>
        <button onclick="deleteTransaction(${index})">Excluir</button>
      </td>
    `;
    transactionsTableBody.appendChild(row);
  });
  updateSummary();
}

// Adicionar ou Editar Transação
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('transaction-id').value;
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;
  const value = parseFloat(document.getElementById('value').value);

  const transaction = { description, category, date, value };

  if (id) {
    transactions[id] = transaction;
  } else {
    transactions.push(transaction);
  }

  saveTransactions();
  renderTransactions();
  form.reset();
});

// Editar Transação
function editTransaction(index) {
  const transaction = transactions[index];
  document.getElementById('transaction-id').value = index;
  document.getElementById('description').value = transaction.description;
  document.getElementById('category').value = transaction.category;
  document.getElementById('date').value = transaction.date;
  document.getElementById('value').value = transaction.value;
}

// Excluir Transação
function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveTransactions();
  renderTransactions();
}

// Inicialização
renderTransactions();
