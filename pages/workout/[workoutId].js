import PathPropertyExtractor from "../../components/PathPropertyExtractor"
import WorkoutCard from "../../components/WorkoutCard"

export default function Workout() {
  return (
    <PathPropertyExtractor property="workoutId">
      <WorkoutCard />
    </PathPropertyExtractor>
  )
}