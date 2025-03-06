const mongo = require("mongoose")

var Schema = mongo.Schema

var testSchema = new Schema({
    firstName: { type: String }
},{ versionKey: false })

var programaDeTvSchema = new Schema({
    titulo: { type: String },
    value: { type: String },
    canal: { type: String },
    tipo: { type: String },
    prePos: { type: Boolean },
    anexos: { type: Object }
},{ versionKey: false })

var pontoDePartidaSchema = new Schema({
    idDoFilme: { type: String },
    horario: { type: String },
    play: { type: Boolean }
},{ versionKey: false })

var videoSchema = new Schema({
    sub: { type: Boolean },
    comComerciais: {type: Boolean},
    added: { type: Boolean },
    cortesParaIntervalo: { type: Array },
    corteInicio: { type: Number },
    corteFinal: { type: Number },
    canal: { type: String },
    tipo: { type: String },
    programaDeTv: { type: String },
    tituloAtracao: { type: String },
    titulo: { type: String },
    order: { type: Number },
    duracao: { type: Number },
    pontoDePartida: { type: Number }
},{ versionKey: false })

var CanaisSchema = new Schema({
    sabado: { type: Array },
    quarta: { type: Array },
    segundaBloco: { type: Array },
    quintaBloco: { type: Array },
    quartaBloco: { type: Array },
    sextaBloco: { type: Array },
    sabadoBloco: { type: Array },
    sexta: { type: Array },
    domingo: { type: Array },
    canal: { type: String },
    emissora: { type: String },
    domingoBloco: { type: Array },
    segunda: { type: Array },
    quinta: { type: Array },
    terca: { type: Array },
    tercaBloco: { type: Array }
},{ versionKey: false })

var SelectedCanalSchema = new Schema({
    canal: { type: Number }
},{ versionKey: false })

module.exports = { SelectedCanalSchema, CanaisSchema, videoSchema, programaDeTvSchema, testSchema, pontoDePartidaSchema }