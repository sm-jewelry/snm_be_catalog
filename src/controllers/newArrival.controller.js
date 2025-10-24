import * as newArrivalService from "../services/newArrival.service.js";

export const getNewArrivals = async (req, res) => {
  try {
    const products = await newArrivalService.getNewArrivals();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
