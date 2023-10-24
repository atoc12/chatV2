async function isRepeat (data){
    try{
        const {elements , body ,campo ,autoRemove} = data;
        const uniqueUserIds = new Set();
        for (const element of elements) {
            if (uniqueUserIds.has(element._id.toString())){
                if(autoRemove){
                    console.log("remover")
                    body[campo].pull(element._id.toString());
                    await body.save();
                }
                return false;
            }
            uniqueUserIds.add(element._id.toString());
        }
        return true;
    }catch(err){
        
    }
}

module.exports = isRepeat;