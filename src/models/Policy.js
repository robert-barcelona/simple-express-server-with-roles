import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
  id: {
    type: String,
  },
  amountInsured: {
    type: Number,
  },
  email:{
    type:String,
  },
  inceptionDate: {
    type:String
  },
  installmentPayment:{
    type:Boolean
  },
  clientId: {
   type:String
  }
});


const Policy = mongoose.model("Policy", policySchema);
export default Policy;
