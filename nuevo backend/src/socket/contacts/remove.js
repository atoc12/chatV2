/* 
    Esta función tiene por objetivo añadir un usuario a la lista de contacto de otro usuario solo si se le ha enviado una solicitud anteriormente
    Se debe buscar al usuario que tenga la solicitud de ahí se realiza un populate para obtener los datos de los usuario que enviaron una solicitud
    luego se debe realizar una busqueda de coincidencias, tiene que concordar dos datos quien envió la solicitud y quien le dio al boton de aceptar 
    si ambos datos coinciden significa que son los mismos usuarios por ende se puede añadir al usuario    
*/
const Chat = require('../../../config/databases/schemas/chat/chat_schema');
const User = require('../../../config/databases/schemas/user/user_schema');

async function RemoveContact (datos,socket){
    try{
        const {user , value } = datos; // se realiza una destructuración para evitar posibles errores

        //usuario main
        let response1 = await User.findOne(user);
        response1 = await response1.removeContact(value);
        
        //usuario secondary
        let response2 = await User.findById(value._id).populate('contactos',{email:1,name:1,_id:1});
        response1=await response1.populate('contactos',{email:1,name:1,_id:1});

        //chat 
        let chat_search =await Chat.findOne({typeChat:"private", participants: { $all: [user._id, value._id], $size: 2 }})
        if(chat_search){
            chat_search.status = false;
            await chat_search.save();
        }
        
        //response socket
        socket.emit("recive-contact", response1.contactos);
        socket.emit("recive-chats", response1.chats);
        socket.to(value._id).emit("recive-contact",response2.contactos);
        socket.to(value._id).emit("recive-chats",response2.chats);
        socket.leave(value._id);









        // let userPrimary = await User.findById(user,{solicitud:1})//se pide el usuario 
        //                                 .populate("contactos",{contactos:1});//Utilizo populate para pedir los datos del otro usuario
        // let userSecondary = null;   
        // userPrimary.contactos.forEach((e) => { // se inicia un foreach para recorrer la lista de Solicitudes

        //     if(e._id.toString() === value){ // si en el caso que algún elemento encuentre una coincidencia con el valor indicado  (HAY COINCIDENCIAS DE _id EN EL CAMPO DE SOLICITUD)
        //         userPrimary.contactos.pull(value); // se realiza un push es decir se agrega un elemento
        //       userSecondary = e;
        //       return   // da por finalizado el foreach
        //     }
            
        //   })
          
        // userSecondary.contactos.pull(userPrimary._id); //se añade al segundo usuario un contacto
        // userPrimary = await userPrimary.save();
        // userSecondary = await userSecondary.save();

        // socket.join(user);
        // socket.to(user).emit("recive-contact", userPrimary.contactos);
        // socket.emit("recive-contact",userSecondary.contactos);
        // socket.leave(user);

    }catch(err){
        console.log(err);
    }
}

module.exports = RemoveContact;