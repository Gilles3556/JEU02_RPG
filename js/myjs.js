/* -------------------------- */
/* MEP jQuery et fonctions    */
/* -------------------------- */
$(document).ready(function(){
	console.log(">>jQuery OK");
    /* déclaration des globales */
	var monsters='{"Monsters":['+
	'{"nom":"#m1","pv":100,"att":10,"t":150,"l":150},'+
	'{"nom":"#m2","pv":100,"att":10,"t":150,"l":450},'+
	'{"nom":"#m3","pv":100,"att":10,"t":480,"l":250}]}';

	var joueur='{"nom":"#J1","pv":75,"att":25,"t":300,"l":250}';
	var obj_J = JSON.parse(joueur);
	var obj_M = JSON.parse(monsters);
	var action_M = [0,0,0];

	var currentMousePos = {};

	/* ---------------------------------
	Placement des monstres et du joueur
	------------------------------------*/
	function init(){
		for(var i=0;i<obj_M.Monsters.length;i++){
			unMonstre = obj_M.Monsters[i];
			placerElement(unMonstre.nom, unMonstre.t, unMonstre.l);
		}
		placerElement(obj_J.nom, obj_J.t, obj_J.l);

	}

	function placerElement(id, t, l){
		//Solution pure JS 
		document.querySelector(id).style.top=t+"px";
		document.querySelector(id).style.left=l+"px";
		}
	/* ---------------------------------
	Affichage/effacement des menus
	------------------------------------*/
	function toggleMenus(id){
	
		if ($(id).css("display")=="none"){
			if (id=="#menuJ"){
				t = currentMousePos.y-25;
				l = currentMousePos.x+25;
			}
			if (id=="#menuDir"){
				t = currentMousePos.y-26;
				l = currentMousePos.x+80;
			}
			placerElement(id,t,l);
			$(id).css("display","inline-block");
		} else {
			displayNone(id);
			if (id=="#menuJ"){
				displayNone("#menuDir");
			}
		}
	}
	function displayNone(id){
		$(id).css("display","none");
	}

	/* ---------------------------------------
	Teste si t,l sont dans la carte (800x600)
	-----------------------------------------*/
	function isInside(c){
		return  ( (c.t<0 || c.l>0 || c.t>600 || c.l>800));	
	}

	function deplacerJoueur(d){
		newCoords= {"t":obj_J.t, "l":obj_J.l};
		
		switch(d){
		case "N":
			newCoords.t-=4;
			break;
		case "S":
			newCoords.t+=4;
			break;
		case "E":
			newCoords.l+=4;
			break;
		case "O":
			newCoords.l-=4;
			break;
		case "NO":
			newCoords.t-=4;
			newCoords.l-=4;
			break;
		case "NE":
			newCoords.t-=4;
			newCoords.l+=4;
			break;
		case "SO":
			newCoords.t+=4;
			newCoords.l-=4;
			break;
		case "SE":
			newCoords.t+=4;
			newCoords.l+=4;
			break;
		
		}
		
		if (isInside(newCoords)){
			obj_J.t = newCoords.t;
			obj_J.l = newCoords.l;
			placerElement("#J1", newCoords.t, newCoords.l);
			isDetected();
		} else {
			alert("/!\\ Déplacement NON autorisé!")
		}
	}
	/*
	Calcul de la distance entre le J et un Monstre.
	*/
	function calculerDistance(noM){
		tm = obj_M.Monsters[noM].t;
		lm = obj_M.Monsters[noM].l;

		tj = obj_J.t;
		lj = obj_J.l;
		
		d= Math.trunc(Math.sqrt((tm-tj)*(tm-tj)+ (lm-lj)*(lm-lj)));
		return d;
	}
	/*
	MAJ le tableau:
	 action_M[0,0,0] => pas de mvt des monstres
	 action_M[1,0,0] => mvt du monstre 1 
	*/
	function isDetected(){
		// calculer la distance entre M1, M2, M3 et J1
		for(var m=0;m<obj_M.Monsters.length;m++){
			d = calculerDistance(m);
			
			if (d<=150){
				if (action_M[m]==0){
					action_M[m]=1;
					$("#m1").trigger("blur"); //lancement de l'evt BLUR sur #m1
					agirMonstre(m);			
				}
			}
		}
		//console.log(action_M);
	}
	function deplacerMonstre(idxm,dir_j){
	for(var f=0;f<2;f++){
		switch(dir_j){
			case "N":
				obj_M.Monsters[idxm].t-=4;
				break;
			case "S":
				obj_M.Monsters[idxm].t+=4;
				break;
			case "E":
				obj_M.Monsters[idxm].l+=4;
				break;
			case "O":
				newCoords.l-=4;
				break;
			case "NO":
				obj_M.Monsters[idxm].t-=4;
				obj_M.Monsters[idxm].l-=4;
				break;
			case "NE":
				obj_M.Monsters[idxm].t-=4;
				obj_M.Monsters[idxm].l+=4;
				break;
			case "SO":
				obj_M.Monsters[idxm].t+=4;
				obj_M.Monsters[idxm].l-=4;
				break;
			case "SE":
				obj_M.Monsters[idxm].t+=4;
				obj_M.Monsters[idxm].l+=4;
				break;
			
			}
			console.log(obj_M.Monsters[idxm]);
					
			placerElement("#m"+(idxm+1), obj_M.Monsters[idxm].t, obj_M.Monsters[idxm].l);
		}
				
	}
	function agirMonstre(idx_m){
		agir = setInterval(function(){
			//console.log("fn agirMonstre(), pour monstre:"+(idx_m+1));
			//choix action
			
			if (idx_m !=2){
				//DFLT: deplacement aléatoire pour les monstres 1 et 2
				hasard = Math.trunc(Math.random()*4);
				
				for(var f=0;f<5;f++){
				
					switch (hasard){
					case 0: //N
						obj_M.Monsters[idx_m].t -= 4;
					break;
					case 1: //S
						obj_M.Monsters[idx_m].t += 4;
					break;
					case 2: //E
						obj_M.Monsters[idx_m].l += 4;
					break;
					case 3: //O
						obj_M.Monsters[idx_m].l -= 4;
					break;
					}
				}
				placerElement("#m"+(idx_m+1), obj_M.Monsters[idx_m].t, obj_M.Monsters[idx_m].l);
				//gerer la rencontre ICI
				
			}else{
				//1) le monstre 2 se lance à lapoursuite du J1
				if (idx_m==2){
					//lancer la poursuite
					d= calculerDistance(idx_m);
					dirJ = calculerDirectionDuJoueur(idx_m);
					if (d>25){
						deplacerMonstre(idx_m,dirJoueur);
					}else{
					  clearInterval(agir);
					  console.log("CONTACT avec #J1 !!!");
					  infecter();
					}
				}
			}
			//2) attaquer
			//3) fuir
			
		},2000);			
				
	}
    function infecter(){
		console.log(">>infection lancée!");
		infection = setInterval(function(){
		     obj_J.pv -=1;
			 //MAJ de la bordure
			 if (obj_J.pv>90 && obj_J.pv<100){
				 console.log(">>virus stade1: J.PV="+obj_J.pv);
				$("#J1").addClass("malade1");
			 }
			 if (obj_J.pv>60 && obj_J.pv<=89){
				 console.log(">>virus stade2: J.PV="+obj_J.pv);
				$("#J1").removeClass("malade1");
				$("#J1").addClass("malade2");
				
			 }
			 if (obj_J.pv>30 && obj_J.pv<=59){
				console.log(">>virus stade3: J.PV="+obj_J.pv);
			    $("#J1").removeClass("malade2");
				$("#J1").addClass("malade3");
			 }
			 if (obj_J.pv>0 && obj_J.pv<=29){
				console.log(">>virus stade4: J.PV="+obj_J.pv);
				$("#J1").removeClass("malade3");
				$("#J1").addClass("malade4");
				 clearInterval(infection);
				 alert(">>Vous êtes mort! FIN DE LA PARTIE !!!");
				 
				 //effacement de tous les éléments de la page
				 $("#menuJ").hide("fast");
				 $("#menuDir").hide("fast");
				 
				 $("#J1").hide(2000);
				 $("#m1").hide(3000);
				 $("#m2").hide(3000);
				 $("#m3").hide(3000);
				 
				 $("figure[class*='map']").hide(4000);
			 }
			 
		},2000);
	}
	function calculerDirectionDuJoueur(idxm){
		dirJoueur = "";
		//ANALYSE pour TOP
		if (obj_J.t == obj_M.Monsters[idxm].t){
		   //No move en t
		}else{
			if (obj_J.t <  obj_M.Monsters[idxm].t){
			   dirJoueur += "N";
			 }else{
			   dirJoueur += "S";
			 }
		}
		//ANALYSE pour LEFT
		if (obj_J.l  == obj_M.Monsters[idxm].l){
			//No move pour LEFT
		}else{
			if (obj_J.l <obj_M.Monsters[idxm].l){
				dirJoueur+="O";
			}else{
				dirJoueur+="E";
			}
		}
		return dirJoueur;
	}
	init();
	//MEP du déplacement
	$("#dirN").click(function(){ deplacerJoueur("N"); });
	$("#dirS").click(function(){ deplacerJoueur("S"); });
	$("#dirE").click(function(){ deplacerJoueur("E"); });
	$("#dirO").click(function(){ deplacerJoueur("O"); });
	
	$("#dirNE").click(function(){ deplacerJoueur("NE"); });
	$("#dirNO").click(function(){ deplacerJoueur("NO"); });
	$("#dirSE").click(function(){ deplacerJoueur("SE"); });
	$("#dirSO").click(function(){ deplacerJoueur("SO"); });
		
	
	$("#J1").click(function(event){
	    currentMousePos.x= event.pageX;
		currentMousePos.y= event.pageY;
	
		toggleMenus("#menuJ");
	});
	$("#actionj1").click(function(){
	    /* SOLUTION 1 
		toggleMenuJ();
		dir = prompt("Quelle direction: N,S,E,O ?","N,S,E,O");
		*/
		currentMousePos.x= event.pageX;
		currentMousePos.y= event.pageY;
		toggleMenus("#menuDir");
	});
	$("#m1").on("blur",function(){
		console.log("#M1 fn blur()");
	});
});







