**À propos du projet**

Nous avons réalisé une application de chat avec nodeJS. Celle ci permet de communiquer entre plusieurs utilisateurs différents.

Les fonctionnalités présentes dans notre appliction sont :
- Envoyer un message à tous les utilisateurs lorsque quelqu'un se connecte ou se déconnecte (cette dernière s'affiche environ dix secondes dnas la convversation des autres utilisateurs)
- Support des pseudonymes
- Lorsqu'un utilisateur envoie un message, ce message s'ajoute directement à sa conversation locale (gestion de l'historique des messages)
- "is typing" s'affiche à côté du pseudonyme de l'utilisateur lorsque celui-ci est en train de taper au clavier
- La liste des utilisateurs en ligne se trouve à gauche de l'écran
- Possibilité d'envoyer des messages privés en cliquant sur la personnne avec qui on veut parler. Pour retour à la conversation principal, il suffit de cliquer sur le chanel principal
- Cchoix de l'avatar à la page d'accueil, mais choix parmis les images du système d'exploitation non faite car chrome ne permet pas d'ouvrir celui-ci

Ces deux fonctionnalités quant à elles, n'ont pas pu être terminées dans les temps et ne seront donc pas inclus dans l'application :
- Possibilité de créer des channels/salons de discussions
- Afficher la liste des channels/messages privés de l'utilisateur

**Pour lancer l'application**

Il est nécessaire de rajouter les modules "express" et "socket.io" avec la commande :
npm install express@4
npm install socket.io

Pour lancer l'appli à partir du terminal, il suffit de se mettre dans le dossier à la racine du projet et écrire la commande "node app.js". L'application se lancera qur la localhost 3000. Il suffit donc après de s'y rendre pour tester.
