import React, { Component } from 'react'
import axios from 'axios'

import PageHeader from '../template/PageHeader'
import TodoForm from './TodoForm'
import TodoList from './TodoList'

const URL = 'http://localhost:3003/api/todos'

export default class Todo extends Component {

    constructor(props) {
        super(props)

        this.state = { description: '', list: [] }
        this.refresh()
    }

    handleAdd() {
        const description = this.state.description
        axios.post(URL, { description })
            .then(resp => this.refresh())

        this.refresh()
    }

    refresh(description = '') {
        const search = description ? `&description__regex=/${description}/` : ''
        axios.get(`${URL}?sort=createdAt${search}`)
            .then((resp) => this.setState({ ...this.state, description, list: resp.data }))
    }

    handleChange(e) {
        this.setState({ ...this.state, description: e.target.value })
    }

    handleRemove(todo) {
        axios.delete(`${URL}/${todo._id}`)
            .then(resp => this.refresh(this.state.description))
    }

    handleMarkAsDone(todo) {
        axios.put(`${URL}/${todo._id}`, {  ...todo, done: true })
            .then(resp => this.refresh(this.state.description))
    }

    handleMarkAsPending(todo) {
        axios.put(`${URL}/${todo._id}`, {  ...todo, done: false })
            .then(resp => this.refresh(this.state.description))
    }

    handleSearch(){
        this.refresh(this.state.description)
    }

    handleClear() {
        this.refresh()
    }

    render() {
        return (
            <div>
                <PageHeader name='Tarefas' small='Cadastro' />
                <TodoForm 
                    handleSearch={() => this.handleSearch()}
                    description={this.state.description}
                    handleAdd={() => this.handleAdd()} 
                    handleChange={(e) => this.handleChange(e)}
                    handleClear={() => this.handleClear()}
                />
                <TodoList 
                    handleRemove={(todo) => this.handleRemove(todo)}
                    handleMarkAsDone={(todo) => this.handleMarkAsDone(todo)}
                    handleMarkAsPending={(todo) => this.handleMarkAsPending(todo)}
                    list={this.state.list} />
            </div>
        )
    }
}