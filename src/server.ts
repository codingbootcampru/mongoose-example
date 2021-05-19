import * as express from "express";
import { Request, Response } from "express";
import * as mongoose from "mongoose";
import { Document } from "mongoose";
import * as bodyParser from "body-parser";

mongoose.connect("mongodb://localhost/test_mg", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("we are connected");
});

// USERS
// interface IKrUser extends Document {
//     email: string;
//     role: string;
//     name: string;
//     image: string;
//     date: Date;
// }
const krUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "student" },
    name: String,
    image: String,
    date: Date
});
const KrUser = mongoose.model("KrUser", krUserSchema);

// COURSES
// interface IKrCourse extends Document {
//     student: any,
//     status: string,
//     comment: string,
//     dateStart: Date,
//     dateEnd: Date
// }
const krCourseSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "KrUser", required: true },
    status: String,
    comment: String,
    dateStart: Date,
    dateEnd: Date
});
const KrCourse = mongoose.model("KrCourse", krCourseSchema);

// SESSIONS
// interface IKrSession extends Document {
//     course: any,
//     date: Date,
//     description: string,
//     videolink: string,
//     feedback: string
// }
const krSessionSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: "KrCourse", required: true },
    date: Date,
    description: String,
    videolink: String,
    feedback: String
});
const KrSession = mongoose.model("KrSession", krSessionSchema);

const app = express();

// parse application/json
app.use(bodyParser.json());

const port = 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.post("/users", async (req: Request, res: Response) => {
    const userData = req.body;
    try {
        const user = new KrUser(userData);
        const savedUser = await user.save();
        return res.json(savedUser);
    } catch (e) {
        return res.status(400).json(e);
    }
});

app.get("/users", async (req: Request, res: Response) => {
    try {
        const users = await KrUser.find({});
        return res.json(users);
    } catch (e) {
        return res.status(400).json(e);
    }
});

app.get("/users/:id", async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const user = await KrUser.findById(userId);
        const courses = await KrCourse.find({ student: userId });
        const coursesResArr = [];
        for (let i=0; i< courses.length ; i++) {
            const courseId = courses[i]._id;
            const sessions = await KrSession.find({ course: courseId });
            const coursesRes = { ...courses[i]._doc, sessions };
            coursesResArr.push(coursesRes);
        }
        const userRes = { ...user._doc, courses: coursesResArr };
        return res.json(userRes);
    } catch (e) {
        return res.status(400).json(e);
    }
});

app.post("/courses", async (req: Request, res: Response) => {
    const courseData = req.body;
    try {
        const course = new KrCourse(courseData);
        const savedCourse = await course.save();
        return res.json(savedCourse);
    } catch (e) {
        return res.status(400).json(e);
    }
});

app.get("/courses", async (req: Request, res: Response) => {
    try {
        const courses = await KrCourse.find({}).populate("student");
        return res.json(courses);
    } catch (e) {
        return res.status(400).json(e);
    }
});

app.post("/sessions", async (req: Request, res: Response) => {
    const sessionData = req.body;
    try {
        const session = new KrSession(sessionData);
        const savedSession = await session.save();
        return res.json(savedSession);
    } catch (e) {
        return res.status(400).json(e);
    }
});

app.get("/sessions", async (req: Request, res: Response) => {
    try {
        const sessions = await KrSession.find({}).populate({
            path: "course",
            populate: {
                path: "student"
            }
        });
        return res.json(sessions);
    } catch (e) {
        return res.status(400).json(e);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
