
const express = require('express');
const bodyParser = require('body-parser');


const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const savingsRoutes = require('./routes/savingsRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authMiddleware = require('./middlewares/authMiddleware');


const app = express();

require('dotenv').config();


// Middleware
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);
app.use('/transactions',authMiddleware, transactionRoutes);
app.use('/categories',authMiddleware, categoryRoutes);
app.use('/savings',authMiddleware, savingsRoutes);
app.use('/reports',authMiddleware, reportRoutes);

// let vaoo = process.env.NODE_ENV === "development";
// console.log("Environment:", process.env.NODE_ENV); 
// console.log("pppppppppppppppppppppppppp", vaoo);

// console.log("NODE_ENV value with quotes:", `"${process.env.NODE_ENV}"`);


if (process.env.NODE_ENV === 'development' ) {
    const PORT = 3000;
    console.log( "cdcds",process.env.NODE_ENV);
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;