import { render, screen } from "@testing-library/react";
import { CourseCard } from "@/components/CourseCard";

const mockCourse = {
  title: "Test Course",
  description: "Test Description",
  rating: 4.5,
  reviews: "100",
  duration: "10 hours",
  level: "Beginner",
  price: "$29",
  instructor: "John Doe",
  image: "/test.jpg",
};

describe("CourseCard", () => {
  it("renders course title", () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText("Test Course")).toBeInTheDocument();
  });

  it("renders course description", () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });
});
