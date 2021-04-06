import Router from "express";
import Offer from "../models/offer.js";
import auth from "../auth/auth.js";
const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const offers = await Offer.find();
    res.status(200).json(offers);
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

router.post("/", auth, async (req, res) => {
  req.body.email = req.user.email;
  req.body.phone = req.user.phone;
  const offer = new Offer(req.body);
  try {
    const newOffer = await offer.save();
    res.status(201).json(newOffer);
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

export default router;
