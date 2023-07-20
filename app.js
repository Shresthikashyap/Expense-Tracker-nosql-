const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const compression = require('compression');
const morgan = require('morgan');


const errorController = require('./controllers/error');

const userRoutes = require('./routes/user');
const premiumUser = require('./routes/premium');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase'); 
const resetPasswordRoutes =  require('./routes/resetpassword');
const downloadRoutes = require('./routes/expense')
const allDownloadedFiles = require('./routes/allDownloads');

//var cors = require('cors');
const app = express();

require('dotenv').config({ path: './.env' });
const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flag : 'a'}
)


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//app.use(cors()); 
//app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream : accessLogStream}));
app.use(express.static('public'));

app.use('/users',userRoutes);

app.use('/expense',expenseRoutes);

app.use('/user',expenseRoutes)
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumUser);
app.use('/password',resetPasswordRoutes);
app.use('/download',downloadRoutes);
app.use('/downloadedFiles',allDownloadedFiles);
app.use('*',errorController.get404);
app.use((req,res) => {
    console.log('Request url ',req.url);
    console.log('request is successful')
    res.sendFile(path.join(_dirname,`public/${req.url}`));
})

mongoose.connect('mongodb+srv://sk2929542:1234shit@cluster0.7ypej7u.mongodb.net/expense-tracker?retryWrites=true&w=majority')
.then(()=>{
    app.listen(3000,()=>{
        console.log('server is listening');
    })
})
.catch(err=>{
    console.log(err);
})