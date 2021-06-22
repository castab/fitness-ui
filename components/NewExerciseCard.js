import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Grid, TextField, Button, Typography } from '@material-ui/core';
import axios from 'axios';

export default function NewExerciseCard(props) {
    const { workoutId, workoutMutate } = props;
    const [name, setName] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    const handleSubmit = () => {
        setIsSubmitDisabled(true);
        axios
            .post(`http://localhost:8080/workout/${workoutId}/exercise`, { name: name })
            .then((resp) => {
                workoutMutate(resp.data, false);
                setName('');
            })
            .catch((e) => {
                console.log('error creating new exercise', e);
            })
            .finally(() => {
                setIsSubmitDisabled(false);
            });
    };

    return (
        <Card>
            <CardContent>
                <Grid container justify="center" alignItems="center" spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            label="Exercise Name"
                            variant="outlined"
                            size="small"
                            value={name}
                            disabled={isSubmitDisabled}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            size="small"
                            disabled={isSubmitDisabled}
                            onClick={handleSubmit}>
                            <Typography>Add exercise</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

NewExerciseCard.propTypes = {
    workoutId: PropTypes.string,
    workoutMutate: PropTypes.func
};
