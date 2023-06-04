const mongoose =  require('mongoose');

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({

    cost: {
      type: Number,
      required: true
      }, 
    description: {
        type: String,
        required: true
      },
    category: {
        type: String,
        required: true
      },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Expense',ExpenseSchema);