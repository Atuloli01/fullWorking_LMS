import { Button } from "./ui/button";
import { toast } from "sonner"; // Keep toast for success messages
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import PropTypes from "prop-types"; // Import PropTypes for prop validation

const BuyCourseButton = ({ courseId }) => {
  // Initialize the navigate hook
  const navigate = useNavigate();

  // This function will be called when the "Enroll Course Now" button is clicked.
  const handleEnrollAndRedirect = () => {
    // 1. Display a success message to the user.
    // In a real application, you might make a backend API call here
    // to officially "enroll" the user in the course (without payment).
    // This API call would mark the course as purchased/enrolled in your database.
    toast.success(
      "Successfully enrolled in the course! Redirecting to content."
    );

    console.log("Course id is : ", courseId);

    // 2. Call the onEnrollSuccess prop function.
    // This prop is passed from the parent component (CourseDetail.jsx)
    // and helps update its 'purchased' state, which might change UI elements
    // like showing 'PlayCircle' icons instead of 'Lock' icons.

    // 3. Navigate the user to the course progress page.
    // The `courseId` is used to construct the correct URL for the specific course.
    navigate(`/course-progress/${courseId}`);
  };

  return (
    // The button that triggers the enrollment and redirection.
    // It takes the full width and calls handleEnrollAndRedirect on click.
    <Button onClick={handleEnrollAndRedirect} className="w-full">
      Enroll Course Now
    </Button>
  );
};

BuyCourseButton.propTypes = {
  courseId: PropTypes.string.isRequired, // courseId must be a string and is required
  onEnrollSuccess: PropTypes.func.isRequired, // onEnrollSuccess must be a function and is required
};

export default BuyCourseButton;
