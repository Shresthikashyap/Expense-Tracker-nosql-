const save = async (event) => {
    try{
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;
     
        const obj= {
        email,password
        }
        
        let response = await axios.post("http://localhost:3000/users/login",obj);

        localStorage.setItem('token',response.data.token)
 
        window.location.href = 'Expense Tracker.html';
        
        //document.getElementById('success').innerHTML = `${response.data.message}`;
    }
    catch(err){
        console.log(err.response.data.error)
        document.getElementById('failure').innerHTML = `Error: ${err.response.data.error}`;
    }
}
