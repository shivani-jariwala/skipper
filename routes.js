const fs = require('fs');
const User = require('./models/user');

const runFile =  function(filename)  {
     fs.readFile(filename, 'utf8', async function(err, data) {
        if (err) {
            return console.log("ERR ", err);
        }
        await parseFile(data);
    });
};

// Parse the file being read
const parseFile = async function(data) {
    var commandList = data.split("\r\n");
    for (var j = 0; j < commandList.length; j++) {
        const d = commandList[j].split(" ")
            const name = d[0];

            const loan = async() => {
                try{
                const bankName = d[1];
                const borrowerName = d[2];
                const principal = d[3];
                const years = d[4];
                const rate = d[5];
                const interest = Math.ceil((principal*years*rate)/100);
                const amount = parseInt(interest) + parseInt(principal) ;
                const interestPerMonth = Math.ceil(amount/(years*12));
                const body = {
                    bankName,borrowerName,principal,years,rate,interest,amount,interestPerMonth
                }   
                await User.create(body);
                }catch(error){
                    console.log(error);
                }
            }

            const payment = async() => {
                try{
                const bankName = d[1];
                const borrowerName = d[2];
                const lumpsum = d[3];
                const emi_lumpsum = d[4];

                const newU = await User.findOne({bankName:bankName,borrowerName:borrowerName});
                const emiPaid = newU.interestPerMonth * emi_lumpsum;
                const totalAmountPaid = Math.ceil(parseInt(lumpsum) + parseInt(emiPaid));

                newU.totalAmountPaid = totalAmountPaid;
                newU.lumpsum = lumpsum;
                newU.emi_lumpsum = emi_lumpsum;
                await newU.save();

                }catch(error){
                    console.log(error);
                }
            }
                

            const balance = async() => {
                try{
                const bankName = d[1];
                const borrowerName = d[2];
                const emiPaid = d[3];
                const newU = await User.findOne({bankName:bankName,borrowerName:borrowerName})
                const time = (newU.years) * 12;
                const lumpsumA = newU.lumpsum;
                const lumpSumEmiNo = newU.emi_lumpsum;
                const perMonthInterest = newU.interestPerMonth;
                const amount = newU.amount;
                const totalAmountPaid = newU.totalAmountPaid;
                if(lumpsumA){
                    if(emiPaid >= lumpSumEmiNo){
                        const answer = (amount-totalAmountPaid)/perMonthInterest;
                        const integerValue = Math.ceil(answer);
                        const totalMonths = parseInt(integerValue) + parseInt(lumpSumEmiNo);
                        const remainingEmi = totalMonths - emiPaid;
                        const amountPaid = parseInt(lumpsumA) + parseInt(emiPaid * perMonthInterest) ; 
                        console.log(bankName,borrowerName,amountPaid,remainingEmi)
                    }else{
                        const remainingEmi = time-emiPaid;
                        const amountPaid = emiPaid * perMonthInterest;
                        console.log(bankName,borrowerName,amountPaid,remainingEmi);
                    }
                }else{
                        const remainingEmi = time-emiPaid;
                        const amountPaid = emiPaid * perMonthInterest;
                        console.log(bankName,borrowerName,amountPaid,remainingEmi)
                } 
                }catch(error){
                    console.log(error);
                }
            }

            if(name === 'LOAN'){
                await loan();
            }
            if(name === 'PAYMENT'){
                await payment();
            }
            if(name === 'BALANCE'){
                await balance();
            }

    }
};

module.exports = runFile