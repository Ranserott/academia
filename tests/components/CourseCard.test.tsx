import { render, screen } from '@testing-library/react'
import { CourseCard } from '@/components/CourseCard'

describe('CourseCard', () => {
  it('renders course title', () => {
    render(<CourseCard title="Test Course" price={100} />)
    expect(screen.getByText('Test Course')).toBeInTheDocument()
  })
})
