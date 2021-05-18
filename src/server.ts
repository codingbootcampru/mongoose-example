import * as express from "express";
import { Request, Response } from "express";
import * as mongoose from "mongoose";

mongoose.connect("mongodb://localhost/test_mg", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("we are connected");
});

// const kittySchema = new mongoose.Schema({
//     name: String,
// });
// const Kitten = mongoose.model("Kitten", kittySchema);
// const silence = new Kitten({ name: "Silence" });
// silence.save();

// USERS
const krUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "student" },
    name: String,
    image: String,
    date: Date,
});
const KrUser = mongoose.model("KrUser", krUserSchema);

// COURSES
const krCourseSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "KrUser" },
    status: String,
    comment: String,
    dateStart: Date,
    dateEnd: Date,
});
const KrCourse = mongoose.model("KrCourse", krCourseSchema);

// SESSIONS
const krSessionSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: "KrCourse" },
    date: Date,
    description: String,
    videolink: String,
    feedback: String,
});
const KrSession = mongoose.model("KrSession", krSessionSchema);

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.get("/courses", (req: Request, res: Response) => {
    return res.json({
        course: {
            sessions: [],
            courseId: 1,
        },
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
