const express = require("express")
const path = require("path")
const bodyParser = require('body-parser')
const mongo = require("mongoose")
var cors = require('cors');
const { WebSocketServer } = require('ws')
const { MongoClient, ObjectId } = require("mongodb")
const { exec } = require('child_process');


const db = mongo.connect("mongodb://localhost:27017/shufleTV", function (err, res) {
    if (err) { console.log(err) }
    else {
        // console.log('Connected to ' + db, ' + ', res)
    }
})

const app = express()
const PORT = process.env.PORT || 9091

const corsOptions = {
    origin: '*',
    optionsSccessStatus: 200
}

app.use(cors(corsOptions))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow', 'http://thisisshuffletv.:9091')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})

var videoSchema = require('./schemas').videoSchema
var SelectedCanalSchema = require('./schemas').SelectedCanalSchema
var CanaisSchema = require('./schemas').CanaisSchema
var programaDeTvSchema = require('./schemas').programaDeTvSchema
var pontoDePartidaSchema = require('./schemas').pontoDePartidaSchema

var dubladoModel = mongo.model('dublado', videoSchema, 'dublado')
var noiteModel = mongo.model('noite', videoSchema, 'noite')
var madrugadaModel = mongo.model('madrugada', videoSchema, 'madrugada')
var novelasModel = mongo.model('novelas', videoSchema, 'novelas')
var intervalosModel = mongo.model('intervalos', videoSchema, 'intervalos')
var originaisModel = mongo.model('originais', videoSchema, 'originais')
var moviesModel = mongo.model('movies', videoSchema, 'movies')
var dvdModel = mongo.model('dvds', videoSchema, 'dvds')

var canaisModel = mongo.model('canais', CanaisSchema, 'canais')
var selectedCanalModel = mongo.model('seletorDeCanais', SelectedCanalSchema, 'seletorDeCanais')

var pontoDePartidaModel = mongo.model('pontoDePartida', pontoDePartidaSchema, 'pontoDePartida')

var programaDeTvModel = mongo.model('programasDeTv', programaDeTvSchema, 'programasDeTv')

var collections = [{ col: 'noite', model: noiteModel },
{ col: 'dublado', model: dubladoModel },
{ col: 'madrugada', model: madrugadaModel },
{ col: 'novelas', model: novelasModel },
{ col: 'intervalos', model: intervalosModel },
{ col: 'originais', model: originaisModel },
{ col: 'movies', model: moviesModel },
{ col: 'dvds', model: dvdModel }]

let getTest = ()=>{
    let searchObj={
        programaDeTv: { $eq: "kolchak" }
    }
        dubladoModel.find(searchObj,function(err, data){
            if (err) {
                console.log("err", err)
            } else {
                console.log("data", data)
            }

        })
}

collections.map(col => {

    app.get("/api/" + col.col, function (req, res) {
        col.model.find({}, function (err, data) {
            if (err) {
                console.log("err", err)
                res.send(err)
            } else {
                res.send(data)
            }
        })
    })

    app.post("/api/" + col.col, function (req, res) {
        let searchObj = {
            programaDeTv: { $eq: req.body.programaDeTv }
        }
        col.model.find(searchObj, function (err, data) {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
            }
        })
    })

    app.post("/api/delete" + col.col, function (req, res) {
        col.model.remove({ _id: req.body.id }, (err) => {
            if (err) {
                console.log("err", err)
                res.send(err)
            } else {
                res.send({ data: "Record has been Deleted..!!" })
                backup("1")
            }
        })
    })

    app.post("/api/getVideoById/" + col.col, function (req, res) {
        col.model.findById({ _id: req.body.id }, (err, data) => {
            if (err) {
                console.log("err", err)
                res.send(err)
            } else {
                res.send(data)
            }
        })
    })



    app.post("/api/update" + col.col, function (req, res) {

        col.model.findByIdAndUpdate(req.body.id, req.body.content, (err, data) => {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
            }
        })
    })

    app.post("/api/create" + col.col, function (req, res) {
        var video = new col.model(req.body.content)
        video.save(function (err, data) {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
                backup("3")
            }
        })
    })
})


app.get("/api/getPontoDePartida", function (req, res) {
    pontoDePartidaModel.find({}, function (err, data) {
        if (err) {
            console.log("err", err)
            res.send(err)
        } else {
            res.send(data)
        }
    })
})

app.post("/api/updatePontoDePartida", function (req, res) {
    // console.log(req.body.id)
    // console.log(req.body.content)
    pontoDePartidaModel.findByIdAndUpdate('63e70a49f18161f7457be722', req.body.content,
        function (err, data) {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
            }
        }
    )
})


app.get("/api/getSelectedCanal", function (req, res) {
    selectedCanalModel.find({}, function (err, data) {
        if (err) {
            console.log("err", err)
            res.send(err)
        } else {
            res.send(data)
        }
    })
})


app.get("/api/getCanais", function (req, res) {
    canaisModel.find({}, function (err, data) {
        if (err) {
            console.log("err", err)
            res.send(err)
        } else {
            res.send(data)
        }
    })
})


app.get("/api/getListaDeProgramasDeTv", function (req, res) {
    programaDeTvModel.find({}, function (err, data) {
        if (err) {
            console.log("err", err)
            res.send(err)
        } else {
            res.send(data)
        }
    })
})

app.post("/api/findProgramaById", (req, res) => {
    collections.map(col => {
        col.model.findById({ _id: req.body.id }, (err, data) => {
            if (data) {
                res.send(data)
            }
        })
    })
})

app.post("/api/createProgramaDeTv", function (req, res) {
    var proramaDeTvMod = new programaDeTvModel(req.body.content)
    proramaDeTvMod.save(function (err, data) {
        if (err) {
            res.send(err)
        } else {
            res.send(data)
            backup("4")
        }
    })
})

app.post("/api/updateProgramaDeTv", function (req, res) {
    // console.log(req.body.id)
    // console.log(req.body.content)
    programaDeTvModel.findByIdAndUpdate(req.body.id, req.body.content, { new: true },
        function (err, data) {
            if (err) {
                res.send(err)
            } else {
                console.log(data)
                res.send(data)
                backup("5")
            }
    })
})

app.post("/api/updateCanais", function (req, res) {
    canaisModel.findByIdAndUpdate(req.body.id, req.body.content,
        function (err, data) {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
                backup("6")
            }
    })
})

app.post("/api/updateSelectedCanal", function (req, res) {
    selectedCanalModel.findByIdAndUpdate(req.body.id, req.body.content,
        function (err, data) {
            if (err) {
                res.send(err)
            } else {
                res.send(data)
                backup("7")
            }
    })
})

app.post("/api/saveUser", function (req, res) {
    var mod = new model(req.body)
    if (req.body.mode == "Save") {
        mod.save(function (err, data) {
            if (err) {
                res.send(err)
            } else {
                res.send({ data: "Record has been Inserted..!!" })
                backup("8")
            }
        })
    } else {
        model.findByIdAndUpdate(req.body.id, { name: req.body.name, address: req.body, address },
            function (err, data) {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ data: "Record has been Updated..!" })
                    backup("9")
                }
            }
        )
    }
})

app.post("/api/deleteUser", function (req, res) {
    model.remove({ _id: req.body.id }, function (err) {
        if (err) {
            res.send(err)
        } else {
            res.send({ data: "Record has been Deleted..!!" })
            backup("10")
        }
    })
})

const server = app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`)
})


// Attach the WebSocket server to the existing HTTP server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');


  async function watchChanges() {
    console.log('Watching for changes...');
    const client = new MongoClient("mongodb://localhost:27017/shufleTV");
    await client.connect();

    const db = client.db('shufleTV');
    const collection = db.collection('pontoDePartida');
    const pipeline = [
        {
          $match: {
            "updateDescription.updatedFields.idDoFilme": { $exists: true }
          },
        },
      ];

    // Watch for changes on the collection
    const changeStream = collection.watch(pipeline);

    changeStream.on('change', (change) => {

      ws.send(JSON.stringify(change));
    });
  }

  watchChanges().catch(console.error);
});

function backup (point) {
    console.log(point)
    exec('docker exec mongo1 mongodump --archive=/backups/mongodb_backup.archive', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });    
}   