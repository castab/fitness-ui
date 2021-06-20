import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'
import { Card, CardContent, Typography, TableContainer, CardActions, IconButton, TextField } from '@material-ui/core'
import { TableRow, TableCell, TableHead, TableBody, Table } from '@material-ui/core'
import { Grid, Button, FormControl, InputLabel, Select } from '@material-ui/core'
import { AddCircle as AddIcon } from '@material-ui/icons'
import { useWorkout, useFitnessMeasures, useAddExercise, useWeekWorkouts, useEditExerciseUnit } from '../../hooks/fetchers'

function Exercises() {
  const router = useRouter()
  const { id } = router.query

  const { data, isLoading, isError } = useWorkout(id)
  if (isLoading) return <h2>Loading...</h2>
  if (isError) return <h2>Error :(</h2>
  return <Grid container spacing={2}>
      {data.exercises.map( exercise => (
        <Grid key={exercise.id} item xs={12} sm={6} md={6} lg={4}>
          <ExerciseCard workoutId={id} exercise={exercise} />
        </Grid>
      ))}
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <NewExercise id={id} />
      </Grid>
  </Grid>
}

function ExerciseCard(props) {
  const { exercise, workoutId } = props
  const handleUnitChange = e => useEditExerciseUnit(workoutId, exercise.id, e.target.value)

  return <Card>
    <CardContent>
      <Grid container justify="space-between">
        <Grid item xs={7}>
          <Typography variant='h5' component='h2'>
            {exercise.name}
          </Typography>
        </Grid>
        <MeasurementUnitSelector 
          currentUnit={exercise.unit.measure}
          selectorFn={handleUnitChange}
        />
      </Grid>
      {exercise.sets.length > 0 && (<TableContainer>
      <Table aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Reps</TableCell>
            <TableCell>{exercise.unit.measure}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exercise.sets.map( set => (
            <TableRow key={set.id}>
              <TableCell>{set.reps}</TableCell>
              <TableCell>{sets.of}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>)}
    <CardActions>
    <Grid container spacing={2} justify="flex-end" alignItems="center">
            <Grid item xs={4}>
                <TextField 
                  label="Reps"
                  size="small"
                  variant="outlined"
                  inputProps={{ inputMode: 'numeric' }}
                  //value={name}
                  //onChange={ e => {setName(e.target.value)}}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField 
                  label="Measure"
                  size="small"
                  variant="outlined"
                  inputProps={{ inputMode: 'numeric' }}
                  //value={name}
                  //onChange={ e => {setName(e.target.value)}}
                />
              </Grid>
              <Grid container item xs={4} justify="flex-end">
                <Grid item xs={8}>
                <Button 
                  fullWidth
                  color="primary"
                  variant="outlined"
                >
                  <Typography style={{fontSize: "14px"}}>
                    Add
                  </Typography>
                </Button>  
                </Grid>
              </Grid>
          </Grid>
          </CardActions>
    </CardContent>
  </Card>
}

function NewExercise(props) {
  const { id } = props
  const [ name, setName ] = useState("")
  return <Card>
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
            onChange={ e => {setName(e.target.value)}}
          />
        </Grid>
        <Grid item xs={12}>
          <Button 
            fullWidth
            color="primary"
            variant="contained"
            size="small"
            onClick={ () => {
              setName('')
              useAddExercise(id, name)
            }}
          >
            <Typography>
              Add exercise
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
}

function MeasurementUnitSelector(props) {
  const { currentUnit, selectorFn } = props
  const { data, isLoading, isError } = useFitnessMeasures()
  const selectableUnits = (!isLoading && !isError) ? new Set(data.units) : new Set()
  return <Grid container item xs={5} justify="flex-end" alignItems="center" spacing={2}>
    <Grid item>
      <Select native onChange={selectorFn} defaultValue={currentUnit}>
        {selectableUnits.size > 0 && [...selectableUnits].map( unit => (
          <option key={unit} value={unit}>{unit}</option>
        ))}
        <option value={currentUnit}>{currentUnit}</option>
      </Select>
    </Grid>
  </Grid>
}

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Fitness UI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Exercises />
      </main>
    </div>
  )
}
