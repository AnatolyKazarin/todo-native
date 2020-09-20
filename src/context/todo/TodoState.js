import React, { useReducer, useContext } from 'react'
import { Alert } from 'react-native'
import { TodoContext } from './todoContext'
import { ScreenContext } from '../screen/screenContext'
import { todoReducer } from './todoReducer'
import { ADD_TODO, REMOVE_TODO, UPDATE_TODO, SHOW_LOADER, HIDE_LOADER, FETCH_TODOS, SHOW_ERROR, CLEAR_ERROR } from '../types'
import { Http } from '../../http'

export const TodoState = ({ children }) => {
  const initialState = {
    todos: [
      {id: '1', title: 'Выучить Реакт'},
      {id: '2', title: 'Написать приложение'}
    ],
    loading: false,
    error: null
  }
  const { changeScreen } = useContext(ScreenContext)
  
  const [state, dispatch] = useReducer(todoReducer, initialState)
  
  const addTodo = async title => {
    clearError()
    try {
      const data = await Http.post('https://rn-todo-app-e470d.firebaseio.com/todos.json', {title})
      dispatch({ type: ADD_TODO, title, id: data.name })
    } catch (e) {
      showError('Что-то пошло не так...')
    }
  }
  
  const removeTodo = id => {
    const todo = state.todos.find(t => t.id === id)
    
    Alert.alert(
      'Удаление элемента',
      `Вы уверены, что хотите удалить "${todo.title}"?`,
      [
        {
          text: 'Отмена',
          style: 'cancel'
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            clearError()
            try {
              changeScreen(null)
              await Http.delete(`https://rn-todo-app-e470d.firebaseio.com/todos/${id}.json`)
              dispatch({type: REMOVE_TODO, id})
            } catch (e) {
              showError('Что-то пошло не так...')
            }
          }
        }
      ],
      {cancelable: false}
    )
  }
  
  const fetchTodos = async () => {
    showLoader()
    clearError()
    try {
      const data = await Http.get('https://rn-todo-app-e470d.firebaseio.com/todos.json')
      let todos = []
      if(data !== null) {
        todos = Object.keys(data).map(key => ({...data[key], id: key}))
      }
      dispatch({type: FETCH_TODOS, todos})
    } catch (e) {
      showError('Что-то пошло не так...')
    } finally {
      hideLoader()
    }
  }
  
  const updateTodo = async (id, title) => {
    clearError()
    try {
      await Http.patch(`https://rn-todo-app-e470d.firebaseio.com/todos/${id}.json`, {id, title})
      dispatch({type: UPDATE_TODO, id, title})
    } catch (e) {
      showError('Что-то пошло не так...')
    }
  }
  
  const showLoader = () => dispatch({type: SHOW_LOADER})
  
  const hideLoader = () => dispatch({type: HIDE_LOADER})
  
  const showError = error => dispatch({type: SHOW_ERROR, error})
  
  const clearError = () => dispatch({type: CLEAR_ERROR})
  
  return (
    <TodoContext.Provider 
      value={{
        todos: state.todos,
        loading: state.loading,
        error: state.error,
        addTodo,
        removeTodo,
        updateTodo,
        fetchTodos
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}