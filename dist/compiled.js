function game(){function e(){if(t(),n.textAlign="left",n.fillText(u.gameState,i.width-200,20),n.fillText("player 1: "+u.playerOneHealth,10,i.height-50),n.fillText("player 2: "+u.playerTwoHealth,i.width-200,i.height-50),"toss"===u.gameState)if(s.getScore()<k&&y.getScore()<k)s.draw(n),y.draw(n);else{var a="";120>g?(g++,a=s.getScore()>=k?"player one":"player two",u.tossWinner=s.getScore()>=k?1:2,a+=" has the power"):240>g?(a="choose your attack",g++):a=null,n.textAlign="center",null!==a?n.fillText(a,r().x,r().y):u.gameState="attackSelection"}else if("attackSelection"==u.gameState)h.displayAttacks(r()),h.selectedAttack(f),g=0;else if("attack"==u.gameState){n.textAlign="center";var l="player "+u.tossWinner+" does a "+u.chosenAttack+" attack";n.fillText(l,r().x,r().y),g++,g>=120&&(u.gameState="defense",g=0)}else if("defense"==u.gameState){n.textAlign="center";var c=1===u.tossWinner?2:1;n.fillText("player "+c+", reverse it!",r().x,r().y),g++,g>=120&&(1===c?u.playerOneHealth-=10:u.playerTwoHealth-=10,g=0,u.gameState="toss",s.resetScore(),y.resetScore())}window.requestAnimationFrame(e)}function t(){n.clearRect(0,0,i.width,i.height)}function a(e,t,a){var r=0;return n.font="22px sans-serif",{draw:function(){n.fillText(a.getLetter(),e,t),n.fillText(r,e,t+50)},getScore:function(){return r},updateScore:function(e){r+=10},resetScore:function(){r=0}}}function r(){return{x:i.width/2,y:i.height/2}}var i=document.getElementById("canvas"),n=i.getContext("2d");i.width=800,i.height=400;var l=new AvailableKeys,c=new KeyStroke(l.getKey()),o=new KeyStroke(l.getKey()),s=a(10,20,c),y=a(100,20,o),h=new Attack(n),f=null,g=0,u={gameState:"toss",attackingPlayer:null,playerOneHealth:100,playerTwoHealth:100,tossWinner:null,chosenAttack:null},k=10;window.requestAnimationFrame(e),window.addEventListener("keydown",function(e){if("toss"===u.gameState)e.keyCode===c.currentLetter?(l.keys[c.currentLetter-65].available=!0,c.assignLetter(l.getKey()),s.updateScore()):e.keyCode===o.currentLetter&&(l.keys[o.currentLetter-65].avaialble=!0,o.assignLetter(l.getKey()),y.updateScore());else if("attackSelection"===u.gameState&&h.available)switch(e.keyCode){case 87:f="water",h.available=!1,u.gameState="attack",u.chosenAttack="water";break;case 70:f="fire",h.available=!1,u.gameState="attack",u.chosenAttack="fire";break;case 69:f="electric",h.available=!1,u.gameState="attack",u.chosenAttack="electric";break;case 83:f="special",h.available=!1,u.gameState="attack",u.chosenAttack="special"}})}function rnd(e,t){return Math.floor(Math.random()*(t-e+1))+e}function KeyStroke(e){this.currentLetter=e}function AvailableKeys(){this.keys=[];for(var e=65;91>e;e++)this.keys.push({key:e,available:!0})}function Attack(e){this.ctx=e,this.available=!1}KeyStroke.prototype.assignLetter=function(e){this.currentLetter=e},KeyStroke.prototype.getLetter=function(){return String.fromCharCode(this.currentLetter).toUpperCase()},KeyStroke.prototype.getRandom=function(e,t){return Math.floor(Math.random()*(t-e+1))+e},AvailableKeys.prototype.getKey=function(){var e=rnd(0,this.keys.length-1),t=this.keys[e];return t.available?(this.keys[e].available=!1,t.key):this.getKey()},Attack.prototype.displayAttacks=function(e){this.available=!0,this.ctx.fillText("fire",e.x-100,e.y),this.ctx.fillText("water",e.x,e.y-100),this.ctx.fillText("electric",e.x+100,e.y),this.ctx.fillText("special",e.x,e.y+100)},Attack.prototype.selectedAttack=function(e){this.available&&(this.ctx.textAlign="left",this.ctx.fillText(e+" selected",20,100))};