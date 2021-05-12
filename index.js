const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');

const app = express();

(async () => {
  const url = 'mongodb+srv://admin:ga4pdERcIqBILbuk@cluster0.xfhit.mongodb.net/ocean_db?retryWrites=true&w=majority ';
  const dbName = 'ocean_db';
  console.info('Conectando ao banco de dados...');
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  console.info('MongoDB conectado com sucesso!!'); 
  const db = client.db(dbName);



app.use(express.json());
 
app.get('/hello', (req, res) => {
    res.send('<h2>Hello World</h2>');
  });

const mensagens = ['Essa é a primeira mensagem', 'Segunda mensagem', 'Bom Dia, Luisa!', 'Aula show'];
const mensagensCollection = db.collection('mensagens');

// GET READ ALL
app.get('/mensagens', async (req, res) => {
    const listaMensagens = await mensagensCollection.find().toArray();
    res.send(listaMensagens);
    
  });

// GET SINGLE
app.get('/mensagens/:id', async (req, res) => {
    const id = req.params.id;

    const mensagem = await mensagensCollection.findOne({_id: ObjectId(id)}) ;

    if (!mensagem) {
      res.send('mensagem não encontrada');
    }

    res.send(mensagem);
  });

// POST
app.post('/mensagens', async (req, res) => {

  const mensagem = req.body;

  await mensagensCollection.insertOne(mensagem)

  res.send(mensagem);
});

// PUT

app.put('/mensagens/:id', async (req, res) => {
  const id = req.params.id;

  const mensagem = req.body;

  await mensagensCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: mensagem }
  );

  res.send('Mensagem editada com sucesso.');
});


// DELETE
app.delete('/mensagens/:id', async (req, res) => {
  const id = req.params.id;

  await mensagensCollection.deleteOne({ _id: ObjectId(id) });

  res.send('Mensagem removida com sucesso.');
});

})();
 
app.listen(process.env.PORT || 3000);