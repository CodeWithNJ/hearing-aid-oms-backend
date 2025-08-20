import app from "./app.js";
import connectDB from "./db/dbConnect.js";

const port = process.env.PORT || 8100;

connectDB();

app.listen(port, () => {
  console.log(`Server Running On Port ${port}`);
});
