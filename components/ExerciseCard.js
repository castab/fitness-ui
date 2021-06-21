import { useState } from 'react'
import axios from 'axios'
import cloneDeep from 'lodash.clonedeep'
import { Card, CardContent, Typography, TextField, Box } from '@material-ui/core'
import { IconButton, Grid, Button, Divider } from '@material-ui/core'
import { Delete as DeleteIcon, Clear as ClearIcon, DeleteForever as DeleteForeverIcon, Add as AddIcon } from '@material-ui/icons'
import { useExercise } from '../hooks/fetchers'
import MeasureUnitSelector from './MeasureUnitSelector'

export default function ExerciseCard(props) {
  const { exerciseId, initialData, workoutMutate } = props
  const { exercise, isLoading, isError, mutate } = useExercise(exerciseId, initialData)
  const [ reps, setReps ] = useState("")
  const [ of, setOf ] = useState("")
  const [ isSubmitDisabled, setIsSubmitDisabled ] = useState(false)
  const [ isDeleteConfirm, setIsDeleteConfirm ] = useState(false)
  const [ timerId, setTimerId ] = useState(null)
  
  if (isLoading) return null
  if (isError) return null

  const { id, workoutId, name, order, sets, measure } = exercise

  const handleAddSetButton = () => {
    setIsSubmitDisabled(true)
    const newSet = {
      id: "unsaved", // Provisioned by API service
      exerciseId: id,
      reps: reps,
      of: of,
      order: 10000 // High default value to guarantee order
    }
    let updatedData = cloneDeep(exercise)
    updatedData.sets.push(newSet)
    mutate(updatedData, false)
    axios.post(`http://localhost:8080/exercise/${id}/set`, newSet)
      .then( resp => {
        mutate(resp.data, false)
        setReps("")
        setOf("")
      })
      .catch( () => {
        // Do something to show error, retreive data to revert view
        mutate()
      })
      .finally( () => {setIsSubmitDisabled(false)})
  }

  const handleDeleteSetButton = setId => () => {
    axios.delete(`http://localhost:8080/set/${setId}`)
      .then( resp => {
        mutate(resp.data, false)
      })
  }

  const handleUnitChange = e => {
    let updatedView = cloneDeep(exercise)
    updatedView.measure = {
      type: "NONE", // Set by API
      unit: e.target.value
    }
    mutate(updatedView, false)
    axios.patch(`http://localhost:8080/exercise/${id}/measure`, {unit: e.target.value})
      .then( resp => {
        mutate(resp.data, false)
      })
      .catch( () => {mutate(exercise, false)})
  }

  const handleDeleteExerciseButton = () => {
    if (isDeleteConfirm) {
      axios.delete(`http://localhost:8080/exercise/${id}`)
        .then( resp => {
          workoutMutate(resp.data, false)
        })
        .finally( () => {clearTimeout(timerId)})
      return
    }
    setTimerId(setTimeout( () => {
      setIsDeleteConfirm(false)
    }, 1600))
    setIsDeleteConfirm(true)
  }

  return <Card>
    <CardContent>
      <Grid container>
        <Grid container item justify="space-between">
          <Grid item xs={10}>
            <Typography variant='h5' component='h2'>
              {name}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Box height="35px">
              <Button
                fullWidth
                color="secondary"
                variant={isDeleteConfirm ? "contained" : "outlined"}
                onClick={handleDeleteExerciseButton}
              >
                  {isDeleteConfirm ? <DeleteForeverIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      { sets.length > 0 && (
        <Grid container>
          <Grid container item justify="space-around" alignItems="center">
            <Grid item xs={4}>
              <Typography>Reps</Typography>
            </Grid>
            <Grid item xs={7}>
              <MeasureUnitSelector 
                currentUnit={measure.unit}
                selectorFn={handleUnitChange}
              />
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
          <Grid item xs={12}>
            <Box pt={1}>
              <Divider />
            </Box>
          </Grid>
          {sets.map( set => (
            <Grid container item alignItems="center" justify="space-around" key={set.id}>
              <Grid item xs={4}>
                <Typography>{set.reps}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>{set.of}</Typography>
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={handleDeleteSetButton(set.id)}
                >
                  <ClearIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
          ))}
        </Grid>
      )}
    <Box mt={1}>
    <Grid container justify="space-between" alignItems="center">
      <Grid container item xs={10} spacing={1}>
        <Grid item xs={6}>
          <TextField 
            label="Reps"
            size="small"
            variant="outlined"
            fullWidth
            inputProps={{ inputMode: 'numeric' }}
            value={reps}
            onChange={ e => {setReps(e.target.value)}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField 
            label="Measure"
            size="small"
            variant="outlined"
            fullWidth
            inputProps={{ inputMode: 'numeric' }}
            value={of}
            onChange={ e => {setOf(e.target.value)}}
          />
        </Grid>
      </Grid>
          <Grid item xs={2}>
            <Button 
              fullWidth
              color="primary"
              variant="contained"
              onClick={handleAddSetButton}
              disabled={isSubmitDisabled}
            >
              <AddIcon />
            </Button>  
          </Grid>
      </Grid>
    </Box>
    </CardContent>
  </Card>
}