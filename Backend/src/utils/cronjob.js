const cron = require('node-cron');

// cron.schedule("0 8 * * *",()=>{
//     console.log("hello world",new Date().toLocaleString());
// })

//* *     *     *     *     *  
//| │     │     │     │     │
//| │     │     │     │     └─── Day of the week (0 - 7) (Sunday is 0 or 7)
//| │     │     │     └───────── Month (1 - 12)
//| │     │     └─────────────── Day of the month (1 - 31)
//| │     └───────────────────── Hour (0 - 23)
//| └─────────────────────────── Minute (0 - 59)
//|______________________________ Seconds (optional  0-59)