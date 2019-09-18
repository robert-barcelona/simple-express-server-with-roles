import mongoose from "mongoose";


const clientSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String
  },
  email: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin']
  }
});


const Client = mongoose.model("Client", clientSchema);
export default Client;
