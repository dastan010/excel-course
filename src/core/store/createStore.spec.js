import {createStore} from './createStore'

const initialState = {
  count: 0
}

const reducer = (state, action) => {
  if (action.type === 'ADD') {
    return {...state, count: state.count + 1}
  }
  return state
}

describe('createStore', () => {
  let store,
      handler

  beforeEach(() => {
    store = createStore(reducer, initialState)
    handler = jest.fn()
  })
  
  test('should return object', () => {
      expect(store.dispatch).toBeDefined()
      expect(store.getState).toBeDefined()
      expect(store.subscribe).not.toBeUndefined()
  })

  test('should return state as object', () => {
      expect(store.getState()).toBeInstanceOf(Object)
  })

  test('should return initialState', () => {
      expect(store.getState()).toEqual(initialState)
  })

  test('should change state if action exists', () => {
      store.dispatch({type: 'ADD'})
      expect(store.getState().count).toBe(1)
  })
  
  test('should NOT change state if action doesn\'t exist', () => {
      store.dispatch({type: 'NOT_EXIST_ACTION'})
      expect(store.getState().count).toBe(0)
  })

  test('should call subscriber function', () => {
      store.subscribe(handler)
      store.dispatch({type: 'ADD'})
      expect(handler).toHaveBeenCalled()
      expect(handler).toHaveBeenCalledWith(store.getState())
  })

  test('should not call subscriber function', () => {
      const sub = store.subscribe(handler)
      sub.unsubscribe()
      store.dispatch({type: 'ADD'})
      expect(handler).not.toHaveBeenCalled()
  })

  test('should dispatch in async way', () => {
      setTimeout(() => {
        store.dispatch({type: 'ADD'})
      }, 500)

      setTimeout(() => {
        expect(store.getState().count).toBe(1)
        resolve()
      }, 1000)
  })
})