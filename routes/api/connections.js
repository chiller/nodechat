var mongo = require('mongodb');
var url = require('url');
module.exports = function (db, sa) {
    "use strict";

    var docs = db.collection("docs");

    this.create = function(req,res){
        var oid = mongo.BSONPure.ObjectID(req.params.id)
        docs.update({_id:oid},{ $push: {connections: {from:req.body.from, to: req.body.to}}}  ,function(obj){
           sa.broadcast(req.params.id,"connection:create",{"msg":"created", obj:{from:req.body.from, to: req.body.to}});
           res.json({"msg":"created", obj:{from:req.body.from, to: req.body.to}});
        })


    };
    this.remove = function(req,res){

        var url_parts = url.parse(req.url, true);
        var oid = mongo.BSONPure.ObjectID(url_parts.query._id)
        docs.update({_id:oid},{ $pull: {connections: {from:url_parts.query.from, to: url_parts.query.to}}}  ,function(obj){
            sa.broadcast(url_parts.query.id,"connection:delete", {msg:"deleted",obj: {from:url_parts.query.from, to: url_parts.query.to}});
            res.json({msg:"deleted",obj: {from:url_parts.query.from, to: url_parts.query.to}}) ;
        })

    };
}