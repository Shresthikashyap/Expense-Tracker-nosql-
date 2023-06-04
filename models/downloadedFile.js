const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DownloadedFileSchema = new Schema({

   url:{
    type:String,
    required:true
   },
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }
});

module.exports = mongoose.model('downloadedFile',DownloadedFileSchema);