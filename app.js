var express= require('express');
var keys= require("./keys/keys")
var stripe= require('stripe')(keys.StripeSecretKey);
var exphbs= require('express-handlebars');
var bodyParser= require('body-parser');
var app= express();
var port =process.env.PORT||3000;

//handlebars template
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set Static Folder
app.use(express.static(`${__dirname}/public`));

//Index route
app.get('/', (req, res)=>{
    res.render('index', {
        StripePublishableKey: keys.StripePublishableKey
    });
})

app.post('/charge', (req, res)=>{
    console.log(req.body);
    var amount=2500;
    stripe.customers.create({
        email:req.body.stripeEmail,
        source: req.body.stripeToken
    }).then((customer)=>{
        return stripe.charges.create({
            amount,
            customer:customer.id,
            description:"Web Dev Book",
            currency:'usd'
        })
    }).then(charge=>{
        res.render('success');
    }).catch((e)=>{
        console.log(e);
    })

})

app.listen(port, ()=>{
    console.log(`Server is up and running at ${port}`);
})