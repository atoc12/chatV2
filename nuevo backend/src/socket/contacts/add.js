/* 
    Esta función tiene por objetivo añadir un usuario a la lista de contacto de otro usuario solo si se le ha enviado una solicitud anteriormente
    Se debe buscar al usuario que tenga la solicitud de ahí se realiza un populate para obtener los datos de los usuario que enviaron una solicitud
    luego se debe realizar una busqueda de coincidencias, tiene que concordar dos datos quien envió la solicitud y quien le dio al boton de aceptar 
    si ambos datos coinciden significa que son los mismos usuarios por ende se puede añadir al usuario    
*/
const User = require('../../../config/databases/schemas/user/user_schema');

async function AddContact (datos,socket){
    try{
        const {user,value} = datos;
        let response1  = await User.findById(user);
        response1 = await response1.addContact({_id:value});
        response1 = await response1.populate("contactos",{name:1,_id:1,email:1});
        response1 = await response1.populate("solicitud",{name:1,_id:1,email:1});

        let response2 = await User.findById(value).populate("contactos",{name:1,_id:1,email:1});

        socket.join(value);
        socket.emit("recive-solicitud",response1.solicitud);
        socket.emit("recive-contact",response1.contactos);
        socket.emit("recive-chats",response1.chats)
        socket.emit("recive-alert-news",{content:`${response2.name} se ha añadido a tus contactos`});
        socket.to(value).emit("recive-contact",response2.contactos);
        socket.to(value).emit("recive-chats",response2.chats);
        socket.to(value).emit("recive-alert-news",{content:`${response1.name} se ha añadido a tus contactos`});
        

    }catch(err){
        console.log(err);
    }
}

module.exports = AddContact;