const express = require("express");

const server = express();
server.use(express.json());

const projects = [];
var requisicao = 0;

server.use((req, res, next) => {
    requisicao++;
    console.log('Quantidade de Requisições ao Servidor: ' + requisicao);
    return next();
})

function projectExist(req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);
    if (!project) {
        return res.status(400).json({ error:'Project informado não existe!'});    
    }
    req.project = project;
    return next();
}

server.get('/projects', (req, res) => {
    res.json(projects);
})

server.put('/projects/:id', projectExist, (req, res) => {

    const index = projects.indexOf(req.project);
    projects[index].name = req.body.name;

    return res.json( { Mensagem: 'Project alterado com sucesso!!!'});
})

server.delete('/projects/:id', projectExist, (req, res) => {

    const index = projects.indexOf(req.project);
    projects.splice(index, 1);

    return res.json( { Mensagem: 'Project Deletado com sucesso!!!'});
})

server.post('/projects', (req, res) => {

    const { id, name } = req.body;
    if(!id || !name) {
        return res.status(400).json({ error:'Id ou Name do Project não enviados!'});
    }

    const project = projects.find(p => p.id == id);
    if (project) {
        return res.status(400).json({ error:'Projeto já cadastrado!'});    
    }

    projects.push({
        id: id,
        name: name,
        tasks: []
    });

    return res.json( { Mensagem: 'Project criado com sucesso!!!'});
    
})

server.post('/projects/:id/tasks', projectExist, (req, res) => {

    const index = projects.indexOf(req.project);
    const { title } = req.body;
    if(!title) {
        return res.status(400).json({ error:'Task não enviada!'});
    }
    projects[index].tasks.push(title);

    return res.json( { Mensagem: 'Task criada com sucesso!!!'});
})

server.listen(3000);