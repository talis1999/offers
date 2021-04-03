import Router from "express";
import User from "../models/user.js";
import auth from "../auth/auth.js";
const router = Router();

router.post("/", async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.find({ email });
    if (user) {
      if (user.comparePassword(password)) {
        res.status(200).json(await user.generateToken());
      } else throw new Error();
    } else throw new Error();
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

router.post("/logout",auth, async (req, res) => {
    try {
        const user = await User.find({_id:req.user._id});
        await user.deleteToken()
        res.status(200).json({message:'logout complete'});
    } catch (e) {
        res.status(400).json({ message: e });
    }

});

router.get("/info", auth, (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (e) {
         res.status(400).json({ message: e });
    }
});

export default router;