import { error } from "console";
import fs from "fs";

// this the sync function for the write in the file 

  fs.writeFileSync("./test.txt" , "Hello this is the Dhruv.");

// this is the Async function for the write the file 

fs.writeFile("./test1.txt" , "This is the other file for the testing." , (err) => {});

//this is sync for the reading 

let data = fs.readFileSync("./test.txt" ,"utf-8")
console.log(data);

//But we cant store in the async directlly

fs.readFile("./test1.txt" , "utf-8" , (err,result)=>{
    if(err) return console.log("Error in file ",err)
    else return console.log(result)
})

//this is add the for the entry 
//Commet the fileWriteSync because when you run it re write the file so you append think not working

fs.appendFileSync("" , `${Date.now()} hello \n`);

//this is the appendfile same as the sync but there is the callback alss

fs.appendFile("test.txt" , "hellppy" , (err) =>{});


//how to copy the 

fs.cpSync("./test.txt" ,"./copy.txt")

//how to delete

// fs.unlinkSync("./test.txt")