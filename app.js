const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

/**
 * List of connected users
 */
var users = [];
/**
 * Historique des messages
 */
var messages = [];
/**
 * Liste des utilisateurs en train de saisir un message
 */
var typingUsers = [];

app.use(express.static(__dirname)); // allows to use css

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/app.html');
})

io.sockets.on('connection', function (socket) {
  /** Utilisateur connecté à la socket*/
  var current_user;

  /** Connexion d'un utilisateur via le formulaire*/
  socket.on('user-login', function (loggedUser, callback) {
    console.log('User logged in : ' + loggedUser.username);
    console.log('Avatar : ' +loggedUser.avatar);
    console.log(loggedUser.mdp);
    // Vérification que l'utilisateur n'existe pas
    var userIndex = -1;
    for (i = 0; i < users.length; i++) {
      if (users[i].username === loggedUser.username) {
        userIndex = i;
      }
    }
    if (loggedUser.username !== undefined && userIndex === -1 && loggedUser.mdp!=="") {
      current_user = loggedUser; // sauvegarde utilisateur
      users.push(current_user); // remplissage liste users connectés
      // Envoi message de connnecion
      var serviceMessage = {
        text: 'User "' + current_user.username + '" logged in'
      };
      socket.broadcast.emit('service-message', serviceMessage);
      // Emission de 'updateUsersin' et appel du callback
      io.emit('updateUsersin', current_user);
      callback(true);
    }
    else{
      callback(false);
      // l'utilisateur n'a pas rentré d'identifiant
      if(loggedUser.username==undefined){
        socket.emit('Alert_identifiant');
      }
      // l'utilisateur n'a pas rentré de mdp
      if(loggedUser.mdp==""){
        socket.emit('Alert_mdp');
      }
    }
  });

  /** Emission d'un événement "updateUsersin" pour chaque utilisateur connecté*/
  for (i = 0; i < users.length; i++) {
    socket.emit('updateUsersin', users[i]);
  }

  /** Emission d'un événement "handleNewMsg" pour chaque message de l'historique*/
  for (i = 0; i < messages.length; i++) {
    socket.emit("handleNewMsg", messages[i]);
  }

  /**
   * Réception de l'événement 'start-typing'
   * L'utilisateur commence à saisir son message
   */
  socket.on('start-typing', function () {
    // Ajout du user à la liste des utilisateurs en cours de saisie
    if (typingUsers.indexOf(current_user) === -1) {
      typingUsers.push(current_user);
    }
    io.emit('update-typing', typingUsers);
  });

  /**
   * Réception de l'événement 'stop-typing'
   * L'utilisateur a arrêter de saisir son message
   */
  socket.on('stop-typing', function () {
    var typingUserIndex = typingUsers.indexOf(current_user);
    if (typingUserIndex !== -1) {
      typingUsers.splice(typingUserIndex, 1);
    }
    io.emit('update-typing', typingUsers);
  });

  /**
  * Réception de l'événement 'newMsg' et réémission vers tous les utilisateurs
  * Ajout à la liste des messages et purge si nécessaire
  */
   socket.on("newMsg", function (message) {
     message.username = current_user.username; // On intègre ici le nom d'utilisateur au message
     message.avatar = current_user.avatar;
     message.socketId = current_user.socketId
     io.emit("handleNewMsg", message);
     console.log('Message de : ' + current_user.username);
     messages.push(message);
     if (messages.length > 150) {
       messages.splice(0, 1);
     }
   });

   /**
   * Réception de l'événement 'private_msg' et réémission vers l'utilisateur receveur et envoyeur
   */
   socket.on("private_msg", (message) => {
    message.from = socket.id;
    message.avatar= current_user.avatar;
    message.username=current_user.username;
    console.log("private_msg");
    io.to(message.to).emit("private message",message);
    io.to(message.from).emit("private message",message);
    //socket.to(message.to).emit("private message",message);
  });


   /** Déconnexion d'un utilisateur : broadcast d'un 'service-message'*/
   socket.on('disconnect', function () {
     if (current_user !== undefined) {
       console.log('user disconnected : ' + current_user.username);
       var serviceMessage = {
         text: 'User "' + current_user.username + '" disconnected'
       };
       socket.broadcast.emit('service-message', serviceMessage);
       // Suppression de la liste des connectés
       var userIndex = users.indexOf(current_user);
       if (userIndex !== -1) {
         users.splice(userIndex, 1); // splice(index de début,nb de valeur à supprimer)
       }
       // Emission d'un 'updateUsers' contenant le user
       io.emit('updateUsersout', current_user);
       // Si jamais il était en train de saisir un texte, on l'enlève de la liste
       var typingUserIndex = typingUsers.indexOf(current_user);
       if (typingUserIndex !== -1) {
         typingUsers.splice(typingUserIndex, 1);
       }
     }
   });

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
