const errorescatch = require("../../errors/errors");

async function Add({base,campo,elements}){
    try{
        Array.isArray(elements) ? base[campo].push(elements) : base[campo]=elements;
        return await base.save();
    }catch(err){
        return errorescatch(err);
    }
}

async function Remove({base,campo,elements}){
    try{
        base[campo].pull(elements);
        return await base.save();
    }catch(err){
        return errorescatch(err);
    }
}

module.exports ={
    Add,
    Remove
}