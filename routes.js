const fs = require('fs');
const User = require('./models/user');

//run the text file
const runFile =  (filename) =>  {
    fs.readFile(filename, 'utf8', async (err, data) => {
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
            const inputCommand = d[0];  //parsing the input command 

            const loan = async() => {
                try{
                const bankName = d[1];
                const borrowerName = d[2];
                const principal = d[3];
                const years = d[4];
                const rate = d[5];
                const interest = (principal*years*rate)/100;
                const amount = parseFloat(interest) + parseFloat(principal) ;
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
                const lumpSum = d[3];
                const emiLumpsumNo = d[4];

                const existingUser = await User.findOne({bankName,borrowerName});
                const emiPaid = existingUser.interestPerMonth * emiLumpsumNo;
                const totalAmountPaid = parseFloat(lumpSum) + parseFloat(emiPaid);

                existingUser.totalAmountPaid = totalAmountPaid;
                existingUser.lumpSum = lumpSum;
                existingUser.emiLumpsumNo = emiLumpsumNo;
                await existingUser.save();
                }catch(error){
                    console.log(error);
                }
            }
                

            const balance = async() => {
                try{
                const bankName = d[1];
                const borrowerName = d[2];
                const emiNo = d[3];
                const existingUser = await User.findOne({bankName,borrowerName})
                const months = (existingUser.years) * 12;
                const { lumpSum,emiLumpsumNo,interestPerMonth,amount,totalAmountPaid} = existingUser;
                if(lumpSum){
                    if(emiNo >= emiLumpsumNo){
                        const fullEmiLeft = (amount-totalAmountPaid)/interestPerMonth; //exact no of full EMI left
                        const noOfEmiLeft = Math.ceil(fullEmiLeft); //exact no of total EMI left
                        const totalMonths = parseInt(noOfEmiLeft) + parseInt(emiLumpsumNo); //total period calculated after the lumpSum amount was paid
                        const remainingEmi = totalMonths - emiNo; //months left to pay the EMI after the lumpSum amount was submitted
                        const amountPaid = parseFloat(lumpSum) + parseFloat(emiNo * interestPerMonth) ; 
                        return console.log(bankName,borrowerName,amountPaid,remainingEmi)
                    }
                }
                        const remainingEmi = months-emiNo;
                        const amountPaid = emiNo * interestPerMonth;
                        console.log(bankName,borrowerName,amountPaid,remainingEmi);
                }catch(error){
                    console.log(error);
                }
            }

            if(inputCommand === 'LOAN'){
                await loan();
            }
            if(inputCommand === 'PAYMENT'){
                await payment();
            }
            if(inputCommand === 'BALANCE'){
                await balance();
            }

    }
};

module.exports = runFile