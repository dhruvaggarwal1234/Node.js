import express from "express"

const app = express()

const Note= []
app.use(express.json())



app.post('/Notes', (req,res)=>{
    // res.send("this is the working")
    const {title,description} = req.body;
    const exists = Note.some((m) => m.title === title)

    if(!title){
        res.status(400).json({
            message:"title is missing"
        })
    }else if(!description){
        res.status(400).json({
            message:"description is the missing"
        })

    }else if(exists){
        res.status(400).json({
            message:"title all ready exists"
        })
    }

    const newNote = {title,description};


    Note.push(newNote)

    res.status(201).json({
        title:`${req.body.title}`,
        message:"note created Sucessfully"
        

    })
    
} )

app.get('/Notes',(req, res) =>{

    if(Note.length===0){
        res.status(200).json({
            success:false,
            notes:[],
            message:"No data Found"

        })
    }
    res.status(200).json({
        success:true,
        notes: Note,
        message:"Data fetched Sucessfully"
    })
})

app.delete('/Notes/:index', (req, res) => {
    const index = parseInt(req.params.index)

    if (index < 0 || index >= Note.length) {
        return res.status(404).json({
            message: "Invalid index"
        })
    }

    Note.splice(index, 1)

    res.status(200).json({
        message: "Note deleted successfully"
    })
})

app.patch('/Notes/:index', (req, res) => {
    const index = parseInt(req.params.index)

    if (index < 0 || index >= Note.length) {
        return res.status(404).json({
            message: "Invalid index"
        })
    }

    const existingNote = Note[index]

    // partial update
    const updatedNote = {
        ...existingNote,
        ...req.body
    }

    Note[index] = updatedNote

    res.status(200).json({
        message: "Note updated successfully",
        data: updatedNote
    })
})

export {app}