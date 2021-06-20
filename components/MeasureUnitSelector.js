import { Grid, Select } from '@material-ui/core'
import { useFitnessMeasures } from '../hooks/fetchers'

export default function MeasureUnitSelector(props) {
  const { currentUnit, selectorFn } = props
  const { data, isLoading, isError } = useFitnessMeasures()
  const selectableUnits = (!isLoading && !isError) ? new Set(data.units) : new Set()
  return <Grid container item xs={5} justify="flex-end" alignItems="center" spacing={2}>
    <Grid item>
      <Select native onChange={selectorFn} value={currentUnit}>
        {[...selectableUnits].map( unit => (
          <option 
            key={unit}
            value={unit}
            disabled={unit==currentUnit}
          >
            {unit}
          </option>
        ))}
      </Select>
    </Grid>
  </Grid>
}