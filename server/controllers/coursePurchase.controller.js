// coursePurchase.controller.js
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

export const simulateCoursePurchase = async (req, res) => {
  try {
    console.log("🔁 simulateCoursePurchase called");

    const userId = req.id;
    const { courseId } = req.body;

    console.log("👉 userId:", userId);
    console.log("👉 courseId:", courseId);

    const course = await Course.findById(courseId);
    if (!course) {
      console.log("❌ Course not found");
      return res.status(404).json({ message: "Course not found!" });
    }

    const existingPurchase = await CoursePurchase.findOne({ courseId, userId });
    if (existingPurchase) {
      console.log("❌ Course already purchased");
      return res.status(400).json({ message: "Course already purchased." });
    }

    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "completed",
      paymentId: `dummy_${Date.now()}`,
    });

    await newPurchase.save();
    console.log("✅ Purchase saved");

    if (course.lectures && course.lectures.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: course.lectures } },
        { $set: { isPreviewFree: true } }
      );
      console.log("✅ Lectures unlocked");
    }

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: course._id } },
      { new: true }
    );
    await Course.findByIdAndUpdate(
      course._id,
      { $addToSet: { enrolledStudents: userId } },
      { new: true }
    );

    console.log("✅ User and Course updated");

    return res.status(200).json({
      success: true,
      message: "Dummy Payment Successful!",
      redirectUrl: `http://localhost:5173/course-progress/${courseId}`,
    });
  } catch (error) {
    console.error("❌ Simulated payment error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    console.log("🔍 Called getCourseDetailWithPurchaseStatus");
    console.log("👉 req.id:", req.id);
    console.log("👉 req.params.courseId:", req.params.courseId);

    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    const purchased = await CoursePurchase.findOne({ userId, courseId });

    return res.status(200).json({
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    console.log("❌ Error in getCourseDetailWithPurchaseStatus:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPurchasedCourse = async (req, res) => {
  try {
    const userId = req.id;

    const purchasedCourse = await CoursePurchase.find({
      userId,
      status: "completed",
    }).populate("courseId");

    return res.status(200).json({
      purchasedCourse: purchasedCourse || [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while fetching purchased courses.",
    });
  }
};
