import React, { useState } from 'react';
import './Split.css'
function Split() {
  const [expense, setExpense] = useState([

  ]);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  function handleInputName(event) {
    setNewName(event.target.value);
  }

  function handleInputAmount(event) {
    setNewAmount(event.target.value);
  }

  function addExpense() {
    if (newName !== "" && newAmount !== "") {
      const updateExpense = { name: newName, amount: Number(newAmount) };
      setExpense([...expense, updateExpense]);
      setNewName("");
      setNewAmount("");
    }
  }

  function deleteExpense(index) {
    const updatedList = expense.filter((_, i) => i !== index);
    setExpense(updatedList);
  }

  // 1. Calculate total sum
  let sum = 0;
  expense.forEach(e => {
    sum += e.amount;
  });

  // 2. Get unique names
  const uniqueNames = [];
  for (let i = 0; i < expense.length; i++) {
    if (!uniqueNames.includes(expense[i].name)) {
      uniqueNames.push(expense[i].name);
    }
  }

  // 3. Calculate how much each person should have paid
  const payPerPerson = sum / uniqueNames.length;

  // 4. Tally actual amounts paid
  const balances = {};
  uniqueNames.forEach(name => {
    balances[name] = 0;
  });
  for (let i = 0; i < expense.length; i++) {
    balances[expense[i].name] += expense[i].amount;
  }

  // 5. Calculate overall balance
  const overallBalance = {};
  uniqueNames.forEach(name => {
    overallBalance[name] = balances[name] - payPerPerson;
  });

  // 6. Split into owes and owed
  const owes = [];
  const owed = [];
  for (let name in overallBalance) {
    const balance = overallBalance[name];
    if (balance < 0) {
      owes.push({ name: name, amount: -balance });
    } else if (balance > 0) {
      owed.push({ name: name, amount: balance });
    }
  }

  // 7. Create transactions
  const transactions = [];
  for (let i = 0; i < owes.length; i++) {
    let personOwes = owes[i];
    for (let j = 0; j < owed.length; j++) {
      let personOwed = owed[j];
      if (personOwes.amount === 0 || personOwed.amount === 0) {
        continue;
      }
      const pay = Math.min(personOwes.amount, personOwed.amount);
      transactions.push(`${personOwes.name} pays ${personOwed.name} $${pay.toFixed(2)}`);
      personOwes.amount -= pay;
      personOwed.amount -= pay;
    }
  }

  return (
    <>
      <div className="split-money">
        <div className="input-info">
          <div className="name-amount-add">
            <input
              className="input-name"
              type="text"
              placeholder="Enter your name"
              value={newName}
              onChange={handleInputName}
            />

            <input
              className="input-num"
              type="number"
              placeholder="Enter amount"
              value={newAmount}
              onChange={handleInputAmount}
            />

            <button className="add-btn" onClick={addExpense}>
              Add
            </button>
          </div>

            <div className="listofAmounts">
                {expense.map((expense, index) => (
              <li key={index} className="list">
                <span className="text">
                  {expense.name}: ${expense.amount}
                </span>
                <button className="delete-button" onClick={() => deleteExpense(index)}>
                  Delete
                </button>
              </li>
             ))}
            </div>
            
           
         

          <h2 className="balances">Balances</h2>
          <ul className="balances-list">
            {uniqueNames.map(name => (
              <li key={name}  
                className = {overallBalance[name] < 0 ? "owes" : "owed"}>
                {name} {overallBalance[name] < 0 ? "owes" : "is owed"} ${Math.abs(overallBalance[name]).toFixed(2)}
              </li>
            ))}
          </ul>

          <h2 className="summary">Summary</h2>
          <ul className="summary-list">
            {transactions.map((t, index) => (
              <li key={index}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Split;
