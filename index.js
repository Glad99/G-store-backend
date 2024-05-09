import express from "express";
import cors from "cors"
import bodyParser from "body-parser"
import mongoose from "mongoose";
import dotenv from "dotenv/config.js";


const app = express();
// Allow requests from the Vercel domain
const corsOptions = {
    origin: 'https://g-store-frontend.vercel.app',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};


//middlewares
app.use(express.json({limit : "10mb"}));
app.use (bodyParser.json())
app.use(cors(corsOptions));

const PORT = process.env.PORT || 4000

const environment = process.env.ENVIRONMENT || "sandbox"

const client_id = process.env.CLIENT_ID

const client_secret = process.env.CLIENT_SECRET

const endpoint_url = environment === "sandbox" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com"

//mongodb connection
console.log(process.env.MONGODB_URL);
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("connect to Database"))
.catch((err)=>console.log(err))

//schema
const userSchema = mongoose.Schema({
    name : String,
    email: {
        type :String,
        unique : true,
    },
    password : String,
    confirmPassword : String,
    image : String,
})

const userModel = mongoose.model("user", userSchema)

//api
app.get("/", (req, res)=> {
    res.send("Server is running")
})

//sign up api
app.post("/signup", (req, res)=>{
    console.log(req.body);
    const {email} = req.body

    // userModel.findOne({email : email}, (err,result)=>{
    //     console.log(result);
    //     console.log(err);
    //     if(result){
    //         res.send({message : "Email id is already registered"})
    //     }
    //     else{
    //         const data = userModel(req.body)
    //         const save = data.save()
    //         res.send({message : "Successfully sign up"})
    //     }
    // })

userModel.findOne({ email: email })
    .then(result => {
        console.log(result);
        if (result) {
            res.send({ message: "Email id is already registered", alert: false });
        } else {
            const data = new userModel(req.body);
            return data.save();
        }
    })
    .then(savedData => {
        if (savedData) {
            res.send({ message: "Successfully sign up", alert: true });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    });
    })

    // log in api
    app.post("/login", (req, res)=>{
        const {email} = req.body
        userModel.findOne({ email: email })
        .then(result => {
            console.log(result);
            if (result) {
                const dataSend = {
                    _id:result._id,
                    name: result.name,
                    email: result.email,
                    image: result.image,
                };
                console.log(dataSend);
                res.send({message : "Login is successfull", alert : true, data : dataSend })
            }
            else{
                res.send({message : "Email is not available, please sign up", alert : false, data : dataSend })
            }
        })
    });


    //product section

    const schemaProduct = mongoose.Schema({
        name : String,
        category : String,
        image : String,
        price : String,
        description : String,
    });
const productModel = mongoose.model("product", schemaProduct)


//save product in data
//api
app.post("/uploadProduct", async(req, res)=>{
    console.log(req.body);
    const data = await productModel(req.body)
    const datasave = await data.save()
    res.send({message : "upload succefully"})
})

//
app.get("/product", async(req, res)=>{
    const data = await productModel.find({})
    res.send(JSON.stringify(data))
})

//payment gateway
app.get("/")

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})




export default app


