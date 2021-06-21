import { Grid, Button, Typography, Box } from '@material-ui/core'
import { Edit as EditIcon } from '@material-ui/icons'
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useRecentActivity } from '../hooks/fetchers'
import { DateTime } from 'luxon'

function RecentActivity() {
  const router = useRouter()
  const {workouts, isLoading, isError} = useRecentActivity()
  if (isLoading || isError) return null
  const sortedWorkouts = workouts.sort((a, b) => {
    let aTimestamp = DateTime.fromISO(a.timestamp)
    let bTimestamp = DateTime.fromISO(b.timestamp)
    return bTimestamp > aTimestamp
  })
  return <>
    <Grid item xs={12}>
      <Typography variant="h4">Recent Activity</Typography>
    </Grid>
    {sortedWorkouts.map(workout => (
      <Grid item xs={12} sm={6} md={4}>
        <Button
          color="primary"
          fullWidth
          variant="contained"
          size="small"
          onClick={() => {router.push(`/workout/${workout.id}`)}}
        >
          <Typography>{DateTime.fromISO(workout.timestamp).toLocaleString(DateTime.DATETIME_SHORT)}</Typography>
        </Button>
      </Grid>
    ))}
    </>
}

export default function Home() {
  const router = useRouter()
  const [ isSubmitDisabled, setIsSubmitDisabled ] = useState(false)
  
  const handleNewExerciseClick = () => {
    setIsSubmitDisabled(true)
    axios.post(`http://localhost:8080/workout`)
      .then( resp => {
        router.push(`/workout/${resp.data.id}`)
      })
      .catch( e => {
        console.log("Something went wrong with the request: ", e)
        setIsSubmitDisabled(false)
      })
  }

  return (
    <div className="container">
      <Head>
        <title>Fitness UI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Grid container justify="center" alignContent="center" spacing={4}>
          <Grid container item xs={8} align="center" spacing={2}>
            <RecentActivity />
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              color="primary"
              variant="contained"  
              onClick={handleNewExerciseClick}
              disabled={isSubmitDisabled}
            >
              Start A New Workout
            </Button>
              <Link href='/workout/53e2f9cf-85ca-4474-989b-b3577cba2677'>
                <a>
                  <Typography>
                    Go to a workout in testing
                  </Typography>
                </a>
              </Link>
          </Grid>
        </Grid>
      </main>
    </div>
  )
}
