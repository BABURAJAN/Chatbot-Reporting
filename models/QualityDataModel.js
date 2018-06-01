/**
 * User Model
 *
 * @author Shubham Jolly
 */
var mongoose = require('mongoose');

var qualityDataSchema = new mongoose.Schema({
    dms  :   String,
    ct  :    String,
    cstm  :  String,
    lct  :   String,
    cc  :    String,
    rhid  :  String,
    wyr  :   String,
    ofn  :   String,
    ofd  :   String,
    sud  :   String,
    ns  :    Number,
    rsp  :   Number,
    ft  :    String,
    msn  :   String,
    pnd  :   String,
    mi  :    String,
    mf  :    String,
    ins  :   String,
    cus  :   Number,
    wfs  :   Number,
    olr  :   Number,
    ist  :   Number,
    fyt  :   Number,
    nst  :   Number,
    mem  :   Number,
    olt  :   Number,
    ine  :   Number,
    inp  :   Number,
    inc  :   Number,
    ina  :   Number,
    inm  :   Number,
    ccm  :   Number,
    ccs  :   Number,
    ccl  :   Number,
    cct  :   Number,
    fh  :    Number,
    cmf  :   Number,
    hh  :    Number,
    trc  :   String,
    fc  :    String,
    cuc  :   String,
    insp  :  Number,
    fp  :    Number,
    sla  :   Number,
    qn  :    String,
    fad  :   Number,
    nps  :   Number,
    ovd  :   Number  
}, {
    collection: 'quality_datas'
}, {
    versionKey: false
});


//if number type with default value {type :Number, default: 0}
// create the model for quality_datas and expose it to our app
module.exports = mongoose.model('QualityDataModel', qualityDataSchema);