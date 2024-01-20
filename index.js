const express = require('express');
const  app = express();

const PORT = process.env?.EXPRESS_PORT ?? 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());

const filesRoutes = require("./routes/files.route");
const userRoutes = require("./routes/user.route");
const classRoutes = require("./routes/class.route");
const { API_NOT_FOUND } = require('./src/constants/response');
;
app.use("/files", filesRoutes);
app.use("/user", userRoutes);
app.use("/class", classRoutes);

app.all("*", (req, res) => {
    
    res.status(API_NOT_FOUND.responseStatus).json({
        ...API_NOT_FOUND,
        responseMessage: API_NOT_FOUND.responseMessage()
    })
})
app.listen(PORT, () => {
    try {
        console.log("Server Running on port", PORT);
    } catch (error) {
        console.log("Something went wrong", error);
    }
})