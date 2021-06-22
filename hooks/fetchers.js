import axios from 'axios';
import useSWR from 'swr';

const fetchGET = (url) => {
    if (url == null || url == '') return Promise.reject('Invalid request');
    if (url == 'http://localhost:8080/workout/undefined') return Promise.reject('Invalid request');
    return axios.get(url).then((res) => res.data);
};

export function useWorkout(id) {
    const { data, error, mutate } = useSWR(`http://localhost:8080/workout/${id}`, fetchGET);
    return {
        workout: data,
        isLoading: !error && !data,
        isError: error,
        mutate: mutate
    };
}

export function useFitnessMeasures() {
    const { data, error } = useSWR(`http://localhost:8080/measure`, fetchGET, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    };
}

export function useExercise(exerciseId, initialData) {
    const { data, error, mutate } = useSWR(
        `http://localhost:8080/exercise/${exerciseId}`,
        fetchGET,
        {
            initialData: initialData,
            revalidateOnFocus: false,
            revalidateOnReconnect: true
        }
    );
    return {
        exercise: data,
        isLoading: !error && !data,
        isError: error,
        mutate: mutate
    };
}

export function useRecentActivity() {
    const { data, error, mutate } = useSWR(`http://localhost:8080/workouts`, fetchGET);
    return {
        workouts: data,
        isLoading: !error & !data,
        isError: error,
        mutate: mutate
    };
}
