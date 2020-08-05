import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, SubmitButton, List } from './styles';
import Container from '../../componentes/Container';

export default class Main extends Component {
    state = {
        newRepo: '',
        repositories: [],
        loading: false
    };

    componentDidMount() {
        try {
            const repositories = localStorage.getItem('repositories');

            if (repositories) {
                this.setState({ repositories: JSON.parse(repositories) });
            }
        } catch (erro) {
            toast("Wow so easy !");
        }

    }

    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;
        if (prevState.repositories !== repositories) {
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }
    handleInputChange = e => {
        this.setState({ newRepo: e.target.value });
    };
    handleSubmit = async e => {
        try {
            e.preventDefault();

            this.setState({ loading: true });

            const { newRepo, repositories } = this.state;

            const response = await api.get(`/repos/${newRepo}`);

            const data = {
                name: response.data.full_name,
            };
            this.setState({
                repositories: [...repositories, data],
                newRepo: '',
                loading: false
            })
        } catch (erro) {
            toast.error("Repositorio nao encontrado")
            console.log("Chegou")
        }


    };
    render() {
        const { newRepo, repositories, loading } = this.state;

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositorios
                </h1>
                <Form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Adicionar repositorio"
                        required
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />
                    <SubmitButton >
                        <FaPlus color="#fff" size={14} />
                    </SubmitButton>
                </Form>
                <List>
                    {repositories.length > 0 && repositories.map(repository => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
                        </li>
                    ))}
                </List>

                <ToastContainer />
            </Container>
        );
    }
}
