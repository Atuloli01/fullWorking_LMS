// purchaseCourse.route.js
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getCourseDetailWithPurchaseStatus,
  getAllPurchasedCourse,
  simulateCoursePurchase,
} from "../controllers/coursePurchase.controller.js";
import { getCourseProgress } from "../controllers/courseProgress.controller.js";

const router = express.Router();

router.get(
  "/course/:courseId/detail-with-status",
  isAuthenticated,
  getCourseDetailWithPurchaseStatus
);
router.get("/purchased-courses", isAuthenticated, getAllPurchasedCourse);
router.post(
  "/checkout/simulate-payment",
  isAuthenticated,
  simulateCoursePurchase
);

router.get("/course/:courseId", isAuthenticated, getCourseProgress);

export default router;
