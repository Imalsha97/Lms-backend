const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");
const Book = require("./models/book");
const Member =require("./models/member");


const server = express();
server.use(cors());

const databaseURL = "mongodb+srv://imalsha:imalsha123@student.3uh4o.mongodb.net/lms?retryWrites=true&w=majority";
const PORT = process.env.PORT || 3000;

mongoose.connect(databaseURL,{
    useNewUrlParser : true,
    useUnifiedTopology: true,
})
.then((result) => {
    console.log("Connected to DB");
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((err)=> {
    console.log(err);
});


// let books = [
//     {
//         id : "1",
//         title:"Harry potter",
//         author:"J.K.Rowling",
//         isAvailable : true,
//         burrowedMemberId:"",
//         burrowedDate:""

//     },{

//         id : "2",
//         title:"Charlie and the Chocolate Factory",
//         author:"Jane Roald",
//         isAvailable : true,
//         burrowedMemberId:"",
//         burrowedDate:""

//     },
// ];

const convertToBook =  (book) => {
    return {
        id : book._id,
        title:book.title,
        author:book.author,
        isAvailable : book.isAvailable,
        burrowedMemberId:book.burrowedMemberId,
        burrowedDate:book.burrowedDate,
    };
};

const sendBook = async (res, id) => {
    const book = await Book.findById(id);
    res.send(convertToBook(book));
}

// /book: view all books
server.get("/book",async(req,res) => {
    // res.send(books);
    const books = await Book.find();
    res.send(books.map((book) => {
        return convertToBook(book)
    }));
});

server.use(express.urlencoded({extended:true}));
server.use(express.json());

// /book/1 : View book 1 
// /book/:id
//comment

server.get("/book/:id",async(req,res) => {
    const id = req.params.id;
    // console.log(id);
    // const book = books.find((book) => book.id === id);
    // // console.log(book);
    // res.send(book);

   sendBook(res,id);
});

// /book : post :create book
//title, author
server.post("/book",async (req,res) => {
    // console.log(req.body);
    const { title , author } = req.body;

    // const book = {
    //     //generate random id
    //     id: Math.random().toString(16).slice(2),
    //     title,
    //     author,
    //     isAvailable : true,
    //     burrowedMemberId:"",
    //     burrowedDate:""
    // };
    // books.push(book);
    // res.send(book);
    const book = new Book({
        title,
        author,
        isAvailable : true,
        burrowedMemberId:"",
        burrowedDate:""
    }
        );
    const response = await book.save();
    // console.log(response);
    res.send(convertToBook(response));

});

// /book/:id/burrow: Burrow book
// /book/1/burrow
// burrowedMemberId, burrowedDate
server.put("/book/:id/burrow",async(req,res) => {
    const id = req.params.id;
    const { burrowedMemberId, burrowedDate } = req.body;
    // console.log(id,burrowedDate,burrowedMemberId);
    // const bookIndex = books.findIndex((book) => book.id === id);
    // books[bookIndex] = {
    //     ...books[bookIndex],
    //     isAvailable : false,
    //     burrowedMemberId,
    //     burrowedDate
    // }
    // res.send(books[bookIndex]);
    const book = await Book.findByIdAndUpdate(id,
        {
            isAvailable : false,
            burrowedMemberId,
            burrowedDate,
        });
        sendBook(res,id);
});

// /book/:id/return : Return book
// /book/:id/return
//comment
server.put("/book/:id/return",async (req, res) => {
    const id = req.params.id;
  
    // const bookIndex = books.findIndex((book) => book.id === id);
    // books[bookIndex] = {
    //   ...books[bookIndex],
    //   isAvailable: true,
    //   burrowedMemberId: "",
    //   burrowedDate: "",
    // };
  
    // res.send(books[bookIndex]);
    const book = await Book.findByIdAndUpdate(id,
        {
            isAvailable : true,
            burrowedMemberId: "",
            burrowedDate: "",
        });
        sendBook(res,id);

  });

// /boo/:id put : Edit book
// title , author
server.put("/book/:id",async (req, res) => {
    const id = req.params.id;
    const { title, author } = req.body;
  
    // const bookIndex = books.findIndex((book) => book.id === id);
    // books[bookIndex] = {
    //   ...books[bookIndex],
    //   title,
    //   author,
    // };
  
    // res.send(books[bookIndex]);
    const book = await Book.findByIdAndUpdate(id,
        {
            title,
            author,
        });
        sendBook(res,id);
  });

  // /book/:id: Delete :Delete book
// /book/1
server.delete("/book/:id",async (req, res) => {
    const id = req.params.id;
  
    const book = await Book.findByIdAndDelete(id);
    res.send(book);
  });

//members
  const convertToMember =  (member) => {
    return {
        id : member._id,
        nic:member.nic,
        firstName:member.firstName,
        middleName : member.middleName,
        lastName:member.lastName,
        contactNumber:member.contactNumber,
        address:member.address,
        userType:member.userType,
    };
};

const sendMember = async (res, id) => {
    const member = await Member.findById(id);
    res.send(convertToMember(member));
}
//member api
//create member
server.post("/member",async (req,res) => {
    const { nic,firstName,middleName,lastName,contactNumber,address,userType } = req.body;
    const member = new Member({
         nic,
         firstName,
         middleName,
         lastName,
         contactNumber,
         address,
         userType });
    const response = await member.save();
    // console.log(response);
    res.send(convertToMember(response));
});
//get all members 
server.get("/member", async (req,res) => {
    const members = await Member.find();
    res.send(members.map((member) => {
        return convertToMember(member)
    }));

});

//get a one member
server.get("/member/:id",async(req,res) => {
    const id = req.params.id;
   sendMember(res,id);
});

//update a member
server.put("/member/:id",async(req,res) => {
    const id = req.params.id;
    const { nic,firstName,middleName,lastName,contactNumber,address,userType } = req.body;
    const member = await Member.findByIdAndUpdate(id,{
        nic,
        firstName,
        middleName,
        lastName,
        contactNumber,
        address,
        userType,
    });
   sendMember(res,id);
});

//delete member 
server.delete("/member/:id" ,async (req,res) => {
    const id = req.params.id;
    const member = await Member.findByIdAndDelete(id);
    res.send(member);
});
