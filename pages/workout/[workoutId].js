import PathPropertyExtractor from "../../components/PathPropertyExtractor"
import WorkoutCard from "../../components/WorkoutCard"
import NewExerciseCard from "../../components/NewExerciseCard"

export default function Workout() {
  return (
    <PathPropertyExtractor property="workoutId">
      <WorkoutCard />
    </PathPropertyExtractor>
  )
}