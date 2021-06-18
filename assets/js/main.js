const renderPaidCard = (transaction, index, date) => {
  return `
    <div class="row" style="flex-direction: row-reverse;">
      <div class="col-md-6">
        <div class="transaction card">
          <div class="transaction_amount_type">
            <div class="transaction_amount">₹ ${transaction.amount}</div>
            <div class="transaction_type"><span>
                <svg class="icon-check">
                  <use xlink:href="assets/images/sprite.svg#icon-check"></use>
                </svg>
              </span> You paid</div>
          </div>
          <div class="transaction_id_details">
            <div class="transaction_id">
              <span>Transaction ID</span>
              <p>${transaction.id}</p>

            </div>
            <div class="transaction_details_btn">
              <button type="button" name="button" class="view_details_btn" data-index="${index}" data-date="${date}">
                <svg>
                  <use xlink:href="assets/images/sprite.svg#icon-chevron-thin-right"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="transaction_time">${transaction.endDate}</div>
      </div>
    </div>
  `;
};

const renderPaymentRequestSentCard = (transaction, index, date) => {
  return `
    <div class="row" style="flex-direction: row-reverse;">
      <div class="col-md-6">
        <div class="transaction card">
          <div class="transaction_amount_type">
            <div class="transaction_amount">₹ ${transaction.amount}</div>
            <div class="transaction_type"><span>
                <svg class="icon-timer">
                  <use xlink:href="assets/images/sprite.svg#icon-timer"></use>
                </svg>
              </span> You requested</div>
          </div>
          <div class="transaction_id_details">
            <button type="button" name="button" class="transaction_cancel_btn">Cancel</button>
            <div class="transaction_details_btn">
              <button type="button" name="button" class="view_details_btn" data-index="${index}" data-date="${date}">
                <svg>
                  <use xlink:href="assets/images/sprite.svg#icon-chevron-thin-right"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="transaction_time">${transaction.endDate.toLocaleString()}</div>
      </div>
    </div>
  `;
};

const renderPaymentRecievedCard = (transaction, index, date) => {
  return `
    <div class="row">
      <div class="col-md-6">
        <div class="transaction card">
          <div class="transaction_amount_type">
            <div class="transaction_amount">₹ ${transaction.amount}</div>
            <div class="transaction_type"><span>
                <svg class="icon-check">
                  <use xlink:href="assets/images/sprite.svg#icon-check"></use>
                </svg>
              </span> You recieved</div>
          </div>
          <div class="transaction_id_details">
            <div class="transaction_id">
              <span>Transaction ID</span>
              <p>${transaction.id}</p>

            </div>
            <div class="transaction_details_btn">
              <button type="button" name="button" class="view_details_btn" data-index="${index}" data-date="${date}">
                <svg>
                  <use xlink:href="assets/images/sprite.svg#icon-chevron-thin-right"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="transaction_time">${transaction.endDate.toLocaleString()}</div>
      </div>
    </div>
  `;
};
const renderPaymentRequestRecievedCard = (transaction, index, date) => {
  return `
    <div class="row">
      <div class="col-md-6">
        <div class="transaction card">
          <div class="transaction_amount_type">
            <div class="transaction_amount">₹ ${transaction.amount}</div>
            <div class="transaction_type"><span>
                <svg class="icon-timer">
                  <use xlink:href="assets/images/sprite.svg#icon-timer"></use>
                </svg>
              </span> Request recieved</div>
          </div>
          <div class="transaction_id_details">
            <div class="transaction_approval_btns">
              <button type="button" name="button" class="transaction_pay_btn">Pay</button>
              <button type="button" name="button" class="transaction_decline_btn">Decline</button>
            </div>
            <div class="transaction_details_btn">
              <button type="button" name="button" class="view_details_btn"  data-index="${index}" data-date="${date}">
                <svg>
                  <use xlink:href="assets/images/sprite.svg#icon-chevron-thin-right"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="transaction_time">${transaction.endDate.toLocaleString()}</div>
      </div>
    </div>
  `;
};

const getFullDate = (dateString) => {
  return dateString.split('T')[0];
};

const getTimeFromDate = (dateString) => {
  dateString = getFullDate(dateString);
  return new Date(dateString).getTime();
};

let transactions = [];
let dates = [];
let date_transactions;
/**
 * Cards for sent payments and requests
 */
const renderSentCard = (transaction, index, date) => {
  let transaction_list = '';
  if (transaction.type == 1 && transaction.status == 2) {
    transaction_list += renderPaidCard(transaction, index, date);
  } else if (transaction.type == 2 && transaction.status == 1) {
    transaction_list += renderPaymentRequestSentCard(transaction, index, date);
  }
  return transaction_list;
};

/**
 * Cards for received payments and requests
 */
const renderRecievedCard = (transaction, index, date) => {
  let transaction_list = '';
  if (transaction.type == 2 && transaction.status == 2) {
    transaction_list += renderPaymentRecievedCard(transaction, index, date);
  }
  else if (transaction.type == 1 && transaction.status == 2) {
    transaction_list += renderPaymentRequestRecievedCard(transaction, index, date);
  }
  return transaction_list;
};


const getAllTransactionDates = (transactions) => {
  const dates = [];
  let current_date = '';
  transactions.forEach(transaction => {
    const date = getTimeFromDate(transaction.endDate);
    if (date != current_date) {
      dates.push(date);
      current_date = date;
    }
  });
  return dates;
};

const arrangeTransactionsByDates = (transactions, dates) => {
  const date_transactions = [];

  dates.forEach(date => {
    transactions.forEach((transaction) => {
      let endDate = getTimeFromDate(transaction.endDate);
      if (date == endDate) {
        if (!date_transactions[date]) {
          date_transactions[date] = [transaction];
        } else {
          date_transactions[date].push(transaction);
        }
      }
    });
  });
  return date_transactions;
};


const renderTransactions = (date_transactions) => {
  for (const date in date_transactions) {
    let node;
    let transaction_list = '';
    if (date_transactions.hasOwnProperty(date)) {
      const transactions = date_transactions[date];
      const temp_date = new Date(parseInt(date)).toLocaleDateString("en-US");
      const date_html = `<div class="transaction_date">${temp_date}</div>`;

      transactions.forEach((transaction, index) => {

        if (transaction.direction == 1) {
          transaction_list +=  renderSentCard(transaction, index, date);
        } else if (transaction.direction == 2) {
          transaction_list +=  renderRecievedCard(transaction, index, date);
        }
      });

      transaction_list = `<div class="transaction_list">${transaction_list}</div>`;
      output = `<div class="transactions">${date_html + transaction_list}</div>`;

      const new_output = `<div>${output}</div>`;

      node = document.createElement('div');
      node.innerHTML = output;
    }
    document.querySelector('.container').appendChild(node);
  }
};


fetch('https://dev.onebanc.ai/assignment.asmx/GetTransactionHistory?userId=1&recipientId=2')
    .then(response => response.json())
    .then(data => {
      transactions = data.transactions;
      dates = getAllTransactionDates(transactions);
      date_transactions = arrangeTransactionsByDates(transactions, dates);
      renderTransactions(date_transactions);

      Array.from(document.getElementsByClassName('view_details_btn')).forEach((btn) => {
        const transaction = date_transactions[btn.dataset.date][btn.dataset.index];
        btn.addEventListener('click', () => {
          console.log(transaction);
        });
      });
    });
