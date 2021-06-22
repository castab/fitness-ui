import PathPropertyExtractor from '../../components/PathPropertyExtractor';
import ExerciseCard from '../../components/ExerciseCard';

export default function Exercise() {
    return (
        <PathPropertyExtractor property="exerciseId">
            <ExerciseCard />
        </PathPropertyExtractor>
    );
}
