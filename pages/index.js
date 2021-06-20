import { Grid, Button, Typography } from '@material-ui/core'
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [ isSubmitDisabled, setIsSubmitDisabled ] = useState(false)
  
  const handleNewExerciseClick = () => {
    setIsSubmitDisabled(true)
    axios.post(`http://ultra6mobile:8080/workout`)
      .then( resp => {
        router.push(`/workout/${resp.data.id}`)
      })
      .finally( () => {
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
        <Grid container direction="column" justify="center" alignContent="center">
          <Grid item>
            <Button
              color="primary"
              variant="contained"  
              onClick={handleNewExerciseClick}
              disabled={isSubmitDisabled}
            >
              Start A New Workout
            </Button>
            <Grid item>
              <Link href='/workout/53e2f9cf-85ca-4474-989b-b3577cba2677'>
                <a>
                  <Typography align="center">
                    Go to a workout in testing
                  </Typography>
                </a>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </main>
    </div>
  )
}
