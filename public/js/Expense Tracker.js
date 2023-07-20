/********************  decode the token  *****************/
function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

const premium = ()=>{
  document.getElementById('premium').style.display = 'none';
  document.getElementById('message').textContent = `You are a premium user  `;
}
 
const renderTable = (data) => {

  let leaderBoard = document.getElementById('leaderBoard');
  leaderBoard.innerHTML = '<h3>Leader Board</h3>';

  let table = document.getElementById('table');
  
  const headers = ['Name', 'Email', 'isPremium', 'Expenses Amount'];
  
  let tableHead = document.createElement('thead');
  table.className = 'thead';

  let headerRow = document.createElement('tr');
  headers.forEach(header => {
   let th = document.createElement('th');
   th.textContent = header;
   headerRow.appendChild(th);
  });

  tableHead.appendChild(headerRow);
  table.appendChild(tableHead);
  // Get the table body element
  let tableBody = document.createElement('tbody');
  
  // Loop through the data and create a row for each user
  data.leaderboardofuser.forEach(user => {
    
    if(user.isPremium === true){user.isPremium = true}
    else{user.isPremium = false}
    let row = document.createElement('tr');

    // Add the user's name
    let nameCell = document.createElement('td');
    nameCell.textContent = user.name;
    row.appendChild(nameCell);

    // Add the user's email
    let emailCell = document.createElement('td');
    emailCell.textContent = user.email;
    row.appendChild(emailCell);

    // Add the user's premium status
    let premiumCell = document.createElement('td');
    premiumCell.textContent = user.isPremium;
    row.appendChild(premiumCell);

    // Add the user's total expenses
    let expenseCell = document.createElement('td');
    expenseCell.textContent = user.totalExpense;
    row.appendChild(expenseCell);

    // Add the row to the table body
    tableBody.appendChild(row);
  });

let tfoot = document.createElement('tfoot');
let row = document.createElement('tr');
const tableFooter = document.createElement('td');
tableFooter.colSpan = 5;
tableFooter.textContent = `Total Expense Sum : Rs. ${data.totalExpenseSum[0].totalExpenseSum}`;console.log(data.totalExpenseSum[0])
row.appendChild(tableFooter);
tfoot.appendChild(row);

// Add the table to the document body
table.appendChild(tableBody);  
table.appendChild(tfoot);
};

const premiumFeature = () => {

  const leaderBoardButton = document.getElementById('leaderBoardButton');
  leaderBoardButton.textContent = 'LeaderBoard';
  leaderBoardButton.className = 'btn btn-secondary btn-sm';
  document.getElementById('message').append(leaderBoardButton);

  const load = document.getElementById('downloadexpense');
  load.textContent = 'Download File';
  load.className = 'btn btn-success btn-sm';

  const loadFiles = document.getElementById('downloadedFiles');
  loadFiles.textContent = 'Downloaded Files';
  loadFiles.className = 'btn btn-secondary btn-sm';
}

document.getElementById('leaderBoardButton').onclick = async() => {
  
  let page = 1;                // Set the initial page number
  let limit = localStorage.getItem('scroller');

  if(!limit){ limit = 5 }
    
  const token = localStorage.getItem('token');
  let response = await axios.get(`http://13.51.197.130/premium/leadership?page=${page}&limit=${limit}`, { headers: {"Authorization": token}});
    
    const leaderBoardData = response.data.leaderboardofuser;
    
    //Pagination options
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = 'Rows per page';
    pagination.style.fontWeight= "600";
    pagination.style.fontFamily = 'Franklin Gothic Medium, Arial Narrow, Arial, sans-serif';

    const scroller = document.createElement('input');
    scroller.type = 'number';
    scroller.className = 'input-group-text';
    scroller.min = 1;
    scroller.max = leaderBoardData.length;
    pagination.appendChild(scroller);
    
    renderTable(response.data);
     
      // Add button to get next page
      const nextButton = document.createElement('button');
      const prevButton = document.createElement('button');
      nextButton.textContent = 'Next >>';
      nextButton.className = 'btn btn-danger btn-sm';
      prevButton.textContent = '<< Prev';
      prevButton.className = 'btn btn-danger btn-sm';

    nextButton.onclick = async () => {

      localStorage.setItem('scroller',scroller.value);
      limit = localStorage.getItem('scroller');

      page++;
      const response = await axios.get(`http://13.51.197.130/premium/leadership?page=${page}&pageSize=${limit}`, {
        headers: { "Authorization": token }});

      if(scroller.value <= response.data.leaderboardofuser.length && response.data.leaderboardofuser.length !== 0){
      table.textContent = '';      // Clear any existing rows from the table body
      renderTable(response.data);
      }
    };
    
    prevButton.onclick = async () => {

      localStorage.setItem('scroller',scroller.value);
      limit = localStorage.getItem('scroller');

      page = 1;
      const response = await axios.get(`http://13.51.197.130/premium/leadership?page=${page}&pageSize=${limit}`, {
        headers: { "Authorization": token }
      });   
      
      table.textContent = '';          // Clear any existing rows from the table body
      renderTable(response.data);
    };

    pagination.appendChild(prevButton);
    pagination.appendChild(nextButton);
  }

const download = async() => {
  try{
  const token = localStorage.getItem('token');
  await axios.get('http://13.51.197.130/user/download', { headers: {"Authorization" : token} })
  .then((response) => {
      if(response.status === 200){
        alert('You successfully downloaded the file');
      }
      if(response.status === 201){
          //the backend is essentially sending a download link
          //  which if we open in browser, the file would download
          var a = document.createElement("a");
          a.href = response.data.fileUrl;
          a.download = 'myexpense.csv';
          a.click();
      } 
      else {
          throw new Error(response.data.message)
      }
    })
  }
  catch(error){
      console.log(error)
      document.getElementById('error').innerHTML = `!!${error.message}`;
  }
}

const downloadedFiles = async() => {

  const token = localStorage.getItem('token');
  const response = await axios.get('http://13.51.197.130/downloadedFiles/all', { headers: {"Authorization" : token} })
  const data = response.data; 
  console.log('all downloads',data);
 
  if(data.length >0){ 
  const urls = document.getElementById('list2');
  urls.textContent = 'Downloaded Files';
  urls.style.fontWeight= "500";

  for(let i=0; i<data.length; i++){
    
    const link = document.createElement('a');
    link.href = data[i];
    link.textContent = data[i].slice(0, 50 - 3) + "...";
    
    const urlList = document.createElement('li');
    urlList.appendChild(link);
    urls.appendChild(urlList);
    }
  }else{
    alert(`You haven't downloaded any file yet`);
  }
}

/********      Load previous data with async/await     ******/
window.addEventListener("DOMContentLoaded",async ()=>{
  try{
    
    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    console.log('user is premium ',decodedToken);
    if(decodedToken.isPremium){
        premium()
        premiumFeature();  
      }

        let response = await  axios.get("http://13.51.197.130/expense/get-expenses", {
        headers: {"Authorization": token}})
        
        console.log(response);
        for(var i=0;i<response.data.expenses.length;i++){
        showExpenses(response.data.expenses[i])
        }                     
      }
    catch(error){  
        document.getElementById('error').innerHTML = `!!${error.message}`;
    }
  });

  let expenseId = null;

  async function save(event){ 
  event.preventDefault();   
  const cost = event.target.cost.value;
  const desc = event.target.description.value;
  const cat = event.target.category.value;

  const obj = { cost,desc,cat}
 
    try {
        let response;
        const token  = localStorage.getItem('token');
       
        if(expenseId !== null){
            console.log(expenseId);
            response = await axios.post(`http://13.51.197.130/expense/update-expense/${expenseId}`,obj,{headers:{"Authorization":token}});
            expenseId=null;
            showExpenses(response.data.expense); 
        }
        else{    
            response = await axios.post("http://13.51.197.130/expense/add-expense", obj,{headers:{"Authorization":token}});         
            showExpenses(response.data.expense); 
          } 
    }         
    catch (error) {
             document.getElementById('error').innerHTML = `!!${error.message}`;
             console.log(error);
    } 
  }

 // Premium user
 document.getElementById('premium').onclick = async(e)=>{
    
   const token = localStorage.getItem('token');
   
   const response =await axios.get('http://13.51.197.130/purchase/premiummembership',
   {headers:{"Authorization":token}});

   console.log(response.data.key_id);
   console.log(response.data.order.id);

   var options={
    "key" : response.data.key_id,
    "order_id" :response.data.order.id,
    "handler" : async function(response){
        await axios.post('http://13.51.197.130/purchase/updatetransactionstatus',{
            order_id : options.order_id,
            payment_id : response.razorpay_payment_id,
        },{ headers: {"Authorization":token}});
        
        alert('You are a Premium User');
        
        premium();
        premiumFeature();
    }
   }
   
   const rzp1 = new Razorpay(options);
      rzp1.open();
      e.preventDefault();

      rzp1.on('payment.failed',function(response){
        console.log(response);
        alert('Something went wrong');
      });
 }

// show expenses with edit and delete button 
  function showExpenses(obj){
      const expenseList = document.getElementById('list1');
      const expense = document.createElement('li');

      expense.textContent = obj.cost+' , '+obj.description+' , '+obj.category+' ';
  
      const editbtn = document.createElement('button');
      editbtn.className = 'btn btn-secondary btn-sm ';
      editbtn.textContent=' Edit Expense ';
      editbtn.onclick=()=>{
          expenseId = obj._id.toString();
          console.log('expense id ',expenseId);
          expenseList.removeChild(expense);
          document.getElementById('ex').value = obj.cost;
          document.getElementById('de').value = obj.description;
          document.getElementById('ca').value = obj.category; 
      }
      
      const dltbtn = document.createElement('button');
      dltbtn.className = 'btn btn-danger btn-sm delete';
      dltbtn.textContent=' Delete Expense ';
      dltbtn.onclick=()=>{
          const token  = localStorage.getItem('token');
          expenseList.removeChild(expense);
          axios.delete(`http://13.51.197.130/expense/delete-expense/${obj._id.toString()}`,{headers:{"Authorization":token}});   
      }
      expense.appendChild(editbtn);
      expense.appendChild(dltbtn);
      expenseList.appendChild(expense);
  }

  // for logging out 
 const logOut = () =>{
  window.location.href='login.html';
}