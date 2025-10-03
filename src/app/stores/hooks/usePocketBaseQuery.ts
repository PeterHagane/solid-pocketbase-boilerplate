import { createSignal, createEffect, mergeProps } from 'solid-js'
import PocketBase from 'pocketbase'
import { pb } from '../pocketBase'
import { notify } from '../../components/notify'
import { t } from '../translationStore'

type QueryOptions<T> = {
  queryFn: (pb: PocketBase) => Promise<T>
  enabled?: boolean
  manual?: boolean
  successMessage?: string
  errorMessage?: string
  backupData?: boolean
}

const DEFAULT_SUCCESS_MESSAGE = 'Operation successful'
const DEFAULT_ERROR_MESSAGE = 'Operation failed'

export function usePBQuery<T>(_props: QueryOptions<T>) {
  const [data, setData] = createSignal<T | undefined>()
  const [isPending, setIsPending] = createSignal(false)
  const [error, setError] = createSignal<Error | null>(null)
  const [isFetching, setIsFetching] = createSignal(false)
  const [didFetch, setDidFetch] = createSignal(false)

  const props = mergeProps({ enabled: true, manual: false, backupData: true }, _props)

  const refetch = async () => {
    if (!props.enabled) return
    setDidFetch(false)
    setIsFetching(true)
    if (!data()) {
      setIsPending(true)
    }
    try {
      const result = await props.queryFn(pb)
      setData(() => result)
      setDidFetch(true)
      setError(null)
      notify({ 
        title: t(props.successMessage ?? DEFAULT_SUCCESS_MESSAGE), 
        color: "hsla(var(--r-good), 0.6)", 
        duration: 3000 
      })
    } catch (err) {
      setError(err as Error)
      setDidFetch(false)
      if(!props.backupData)setData(undefined)
      notify({ 
        title: t(props.errorMessage ?? DEFAULT_ERROR_MESSAGE), 
        message: t((err as Error).message),
        color: "hsla(var(--r-danger), 0.8)", 
        duration: 6000,
        dismissible: true 
      })
    } finally {
      setIsPending(false)
      setIsFetching(false)
    }
  }

  const fetch = refetch

  createEffect(() => {
    if (props.enabled && !props.manual) {
      refetch()
    }
  })

  return {
    data,
    isPending,
    error,
    isFetching,
    refetch,
    fetch,
    didFetch
  }
} 

export default usePBQuery


// // example usage
// usePocketBaseQuery({
//   queryKey: ['users'],
//   queryFn: (pb) => pb.collection('users').getList(),
//   successMessage: 'Users loaded successfully',
//   errorMessage: 'Failed to load users'
// })

// // For creating a record
// usePocketBaseQuery({
//   queryKey: ['users'],
//   queryFn: (pb) => pb.collection('users').create(data),
//   successMessage: 'User created successfully',
//   errorMessage: 'Failed to create user'
// })

// // For updating a record
// usePocketBaseQuery({
//   queryKey: ['users'],
//   queryFn: (pb) => pb.collection('users').update(id, data),
//   successMessage: 'User updated successfully',
//   errorMessage: 'Failed to update user'
// })