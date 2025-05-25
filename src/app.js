const express = require("express");

const app = express();

app.use("/part-1",(req,res)=>{
    res.send("Response from part-1")
})

app.use("/part-2",(req,res)=>{
    res.send("Response from part-2")
})

app.use((req, res) => {
  res.send("Hello from the server");
});



app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
