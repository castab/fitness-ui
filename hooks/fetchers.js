import axios from 'axios';
import useSWR from 'swr';

const fetchGET = (url) => {
    if (url == null || url == '') return Promise.reject('Invalid request');
    if (url == `${process.env.NEXT_PUBLIC_API_HOST}/workout/undefined`)
        return Promise.reject('Invalid request');
    return axios.get(url).then((res) => res.data);
};

export function useWorkout(id) {
    const { data, error, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_API_HOST}/workout/${id}`,
        fetchGET
    );
    return {
        workout: data,
        isLoading: !error && !data,
        isError: error,
        mutate: mutate
    };
}

export function useFitnessMeasures() {
    const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_HOST}/measure`, fetchGET, {
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
        `${process.env.NEXT_PUBLIC_API_HOST}/exercise/${exerciseId}`,
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

export function usePersonalRecord(exerciseName) {
    const name = encodeURIComponent(exerciseName);
    const { data, error, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_API_HOST}/exercise/pr?name=${name}`,
        (url) => axios.get(url)
            .then((res) => res.data)
            .catch((err) => {
                if (err.response && err.response.data && err.response.status == 404) {
                    return null
                }
                throw err
            }),
        {
            revalidateOnMount: true,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 300000
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
    const { data, error, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_API_HOST}/workouts`,
        fetchGET
    );
    return {
        workouts: data,
        isLoading: !error & !data,
        isError: error,
        mutate: mutate
    };
}
