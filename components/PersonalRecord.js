import { Grid, Typography } from '@material-ui/core'
import { usePersonalRecord } from '../hooks/fetchers'

export default function PersonalRecord({exerciseName}) {
    const emptyContainer = (
        <Grid container style={{height: "20px"}}>
            <Grid item xs={12}>
                <Typography variant="caption" component="p">
                    No PR to report.
                </Typography>
            </Grid>
        </Grid>
    )
    if (!exerciseName || exerciseName == "") return emptyContainer
    
    const {exercise, isLoading, isError} = usePersonalRecord(exerciseName)
    if (isLoading || isError || !exercise) return emptyContainer

    const prReps = exercise.sets.length;
    const prUnit = exercise.measure.unit;
    const prMax =  Math.max.apply(Math, exercise.sets.map((set) => set.of));


    return <Grid container style={{height: "20px"}}>
        <Grid item xs={12}>
            <Typography variant="caption" component="p">
                PR: {prReps} reps maxing at {prMax} {prUnit}.
            </Typography>
        </Grid>
</Grid>
}