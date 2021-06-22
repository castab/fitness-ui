import PropTypes from 'prop-types';
import { useWorkout } from '../hooks/fetchers';
import { Grid } from '@material-ui/core';
import ExerciseCard from './ExerciseCard';
import NewExerciseCard from './NewExerciseCard';
import { DateTime } from 'luxon';
import Head from 'next/head';

export default function WorkoutCard(props) {
    const { workoutId } = props;
    const { workout, isLoading, isError, mutate } = useWorkout(workoutId);
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error :(</div>;
    return (
        <Grid container spacing={2}>
            <Head>
                <title>{`Workout ${DateTime.fromISO(workout.timestamp).toLocaleString(
                    DateTime.DATE_SHORT
                )}`}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Exercises exercises={workout.exercises} workoutMutate={mutate} />
            <Grid item xs={12}>
                <NewExerciseCard workoutId={workoutId} workoutMutate={mutate} />
            </Grid>
        </Grid>
    );
}

function Exercises(props) {
    const { exercises, workoutMutate } = props;
    if (exercises == null) return null;
    return exercises.map((exercise) => (
        <Grid item xs={12} md={6} lg={4} xl={3} key={exercise.id}>
            <ExerciseCard
                exerciseId={exercise.id}
                initialData={exercise}
                workoutMutate={workoutMutate}
            />
        </Grid>
    ));
}

WorkoutCard.propTypes = {
    workoutId: PropTypes.string
};
