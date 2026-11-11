import express from 'express';
import db from './repository/index.js';

const app = express();
const port = 3000;
app.use(express.json())

// C
app.post('/api/v1/tarefa', (req, res) => {
    const { id, descricao, data } = req.body

    if (!id || !descricao || !data) {
        res.send({ message: "Cadastro não efetuado." })
        return
    }
    db.push({ id, descricao, data, concluido: false })
    res.send({ message: "Tarefa cadastrada com sucesso!" })
});

// R
app.get('/api/v1/tarefa/:id', (req, res) => {
    const { id } = req.params;
    const tarefa = db.find(p => p.id == id);

    if (!tarefa) {
        return res.send({ message: 'Tarefa não encontrada.' });
    }

    res.send(tarefa);
});
// R
app.get('/api/v1/tarefa/status/teste', (req, res) => {
    const { concluido } = req.params;
    const tarefa = db.filter(p => p.concluido == false);

    if (!tarefa) {
        return res.send({ message: 'Nenhuma tarefa concluida.' });
    }

    res.send(tarefa);
});


// U
app.put('/api/v1/tarefa/:id', (req, res) => {
    const { id } = req.params;
    const tarefa = db.find(p => p.id == id);
    const { descricao, data } = req.body;

    if (!tarefa) {
        return res.status(404).send({ message: 'Tarefa não encontrada.' });
    }

    if (!descricao && !data) {
        return res.status(400).send({ message: 'Insira algum dado para modificar!' });
    }

    if (descricao) tarefa.descricao = descricao;
    if (data) tarefa.data = data;

    res.send(tarefa);
});

app.put('/api/v1/tarefa/status/:id', (req, res) => {
    const { id } = req.params;
    const tarefa = db.find(p => p.id == id);

    if (!tarefa) {
        return res.status(404).send({ message: 'Tarefa não encontrada.' });
    }

    tarefa.concluido = !tarefa.concluido;

    res.send(tarefa);
});

// D
app.delete('/api/v1/tarefa/:id', (req, res) => {
    const { id } = req.params;
    const index = db.findIndex(p => p.id == id);

    if (index === -1) {
        return res.status(404).send({ message: 'Tarefa não encontrada.' });
    }

    db.splice(index, 1);

    res.send({ message: 'Tarefa deletada com sucesso!' });
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});