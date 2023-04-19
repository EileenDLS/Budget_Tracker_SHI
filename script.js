$(document).ready(() => {
  // set current month as the default month
  const current = new Date();
  const year = current.getFullYear();
  const month = String(current.getMonth() + 1).padStart(2, "0");
  $("#month").val(`${year}-${month}`);
  loadSessionStorage($("#month").val());
});

let budgetData = [];
let expenditures = [];
// bind with "edit budget" (Add a new month and new budget)
$("#editBudget").click(() => {
  const budget = prompt("plz input your budget:");
  if (!isNaN(budget)) {
    $("#budget").text(budget);
  } else {
    alert("Plz input number!");
  }
  addData(budget);
  calculateResidual();
});
// bind with "add expenditure"
$("#add").click(() => {
  $("#input_container").css("display", "");
  $("#add").css("display", "none");
});

// bind with save button
$("#saveBtn").click(() => {
  createTrEle($("#input_text").val(), $("#input_num").val());
  // saveToLocalStorage($("#input_text").val());
  addData($("#budget").text(), $("#input_text").val(), $("#input_num").val());
  calculateResidual();
  // clear and hide input text area and display "add task"
  $("#input_text").val("");
  $("#input_container").css("display", "none");
  $("#add").css("display", "");
});

// create <tr> element insert into table
function createTrEle(textContent, money) {
  const text = $("<div>").text(textContent).css({
    display: "inline",
    "margin-right": "30px",
  });
  const num = $("<div>")
    .text("$" + money)
    .css({
      display: "inline",
      "margin-right": "30px",
    });
  // bind with edit button
  const editBtn = $("<button>")
    .text("Edit")
    .click((event) => {
      const updateText = prompt("Edit your description:", textContent);
      const updateMoney = prompt("Edit your cost:", money);
      const selectedRecord = $(event.target).closest("tr");
      const index = $("tr").index(selectedRecord);
      if (index !== -1) {
        expenditures[index - 1].description = updateText;
        expenditures[index - 1].cost = updateMoney;
        addData();
      }
      $(event.target).parent().children().eq(0).text(updateText);
      $(event.target)
        .parent()
        .children()
        .eq(1)
        .text("$" + updateMoney);
    });
  // bind with delete button
  const deleteBtn = $("<button>")
    .text("Delete")
    .click((event) => {
      const selectedRecord = $(event.target).closest("tr");
      const index = $("tr").index(selectedRecord);
      if (index !== -1) {
        expenditures.splice(index - 1, 1);
        addData();
      }
      $(event.target).parent().remove();
    });
  const item = $("<tr>");
  item.append(
    $("<td>").append(text).append(num).append(editBtn).append(deleteBtn)
  );
  $("#table").append(item);
}

// store budget data
function addData(budget, des, cost) {
  const get_date = $("#month").val();
  // store expenditures data
  const expend = {
    description: des,
    cost: cost,
  };
  if (des !== undefined) {
    expenditures.push(expend);
  }
  const data = {
    date: get_date,
    budget: budget,
    expenditures: expenditures,
  };
  // check budgetData: if no month records, add one; if have, only add expenditures records
  if (budgetData.length === 0) {
    budgetData.push(data);
  } else {
    $.each(budgetData, (_, item) => {
      if (item.date === get_date) {
        item.budget = budget;
        item.expenditures = expenditures;
      } else {
        budgetData.push(data);
      }
    });
  }
  //
  console.log(budgetData);
  // store data to sessionStorage
  sessionStorage.setItem(`${get_date}`, JSON.stringify(budgetData));
}

// change month: save previous data to sessionStorage and show corresponding expenditure
$("#month").change((event) => {
  $("#budget").text("null");
  $("#residual").text("null");
  $("#input_container").css("display", "none");
  $("#add").css("display", "");
  $("table tr:gt(0)").remove();
  loadSessionStorage($(event.target).val());
});

// load data from sessionStorage
function loadSessionStorage(date) {
  const data = JSON.parse(sessionStorage.getItem(date));
  if (data === null) {
    // no data in this month
    budgetData = [];
    expenditures = [];
  } else {
    // have data in this month, load it
    budgetData = data;
    expenditures = data[0].expenditures;
    $.each(data, (_, item) => {
      $("#budget").text(`${item.budget}`);
      $.each(item.expenditures, (_, expend) => {
        createTrEle(expend.description, expend.cost);
      });
    });
    calculateResidual();
  }
}

// calculate residual limit
function calculateResidual() {
  let sum = 0;
  $.each(expenditures, (_, expend) => {
    sum += Number(expend.cost);
  });
  const rest = Number(budgetData[0].budget) - sum;
  $("#residual").text(rest);
}
