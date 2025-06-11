import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);

  // Fetch course progress manually
  const fetchCourseProgress = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8088/api/v1/progress/course/${courseId}`,
        {
          credentials: "include",
        }
      );
      console.log("response is : ", res);
      if (!res.ok) throw new Error("Failed to fetch course progress");
      const json = await res.json();
      setCourseData(json.data);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseProgress();
  }, [courseId]);

  // Helpers
  const isLectureCompleted = (lectureId) => {
    return courseData?.progress.some(
      (prog) => prog.lectureId === lectureId && prog.viewed
    );
  };

  const handleLectureProgress = async (lectureId) => {
    try {
      await fetch(`http://localhost:8088/api/v1/progress/${courseId}/lecture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ courseId, lectureId }),
      });
      fetchCourseProgress();
    } catch (err) {
      toast.error("Failed to update lecture progress.");
    }
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    try {
      const res = await fetch(
        `http://localhost:8088/api/v1/progress/complete/${courseId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const json = await res.json();
      toast.success(json.message);
      fetchCourseProgress();
    } catch {
      toast.error("Failed to mark as complete.");
    }
  };

  const handleInCompleteCourse = async () => {
    try {
      const res = await fetch(
        `http://localhost:8088/api/v1/progress/incomplete/${courseId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const json = await res.json();
      toast.success(json.message);
      fetchCourseProgress();
    } catch {
      toast.error("Failed to mark as incomplete.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error || !courseData) return <p>Failed to load course details</p>;

  const { courseDetails, progress, completed } = courseData;
  const { courseTitle, lectures } = courseDetails;

  const initialLecture = currentLecture || (lectures && lectures[0]);

  console.log("current lecture is : ", currentLecture);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseTitle}</h1>
        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          variant={completed ? "outline" : "default"}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Completed</span>
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Video Section */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <video
            src={currentLecture?.videoUrl || initialLecture?.videoUrl}
            controls
            className="w-full h-auto md:rounded-lg"
            onPlay={() =>
              handleLectureProgress(currentLecture?._id || initialLecture._id)
            }
          />
          <div className="mt-2">
            <h3 className="font-medium text-lg">
              {`Lecture ${
                lectures.findIndex(
                  (lec) =>
                    lec._id === (currentLecture?._id || initialLecture._id)
                ) + 1
              }: ${
                currentLecture?.lectureTitle || initialLecture.lectureTitle
              }`}
            </h3>
          </div>
        </div>

        {/* Lecture Sidebar */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
          <div className="flex-1 overflow-y-auto">
            {lectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${
                  lecture._id === currentLecture?._id
                    ? "bg-gray-200 dark:dark:bg-gray-800"
                    : ""
                }`}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <CardTitle className="text-lg font-medium">
                      {lecture.lectureTitle}
                    </CardTitle>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      variant={"outline"}
                      className="bg-green-200 text-green-600"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
