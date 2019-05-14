var SuaVez="O";
var argCel = "";
var lock;
var cel = new Array('a','b','c','d','e','f','g','h','i');
var fechou = [];
var o = 0;
//var v = 0;
//ConexÃ£o Online
//var socket = io();

function Jogo(id){
	if(id[0] == lock || argCel == ""){
		argCel = id[0];
		lock = lockCels(id);
		var img=Troca(id);
		if(img=="Vazio.png"){
			document.getElementById(id).src="https://kadkest-projeto.000webhostapp.com/kadkest/img/"+SuaVez+".png";
			if(Eonara()){
				document.getElementById('casa_menor'+argNum(argCel)).innerHTML = "<tr id='linha'><td><img src='https://kadkest-projeto.000webhostapp.com/kadkest/img/"+SuaVez+".png' id='x"+argNum(id[0])+"' class='casas_maiores'></td></tr>";
				guardaFechou();
				if(Eonara("x")){
					//Bloco que serÃƒÆ’Ã‚Â¡ desparado quando houver vitÃƒÆ’Ã‚Â³ria sendo SuaVez o vencedor;
					alert(SuaVez+" Ganhou!!!");
				}
			}else if(Velha()){
				document.getElementById('casa_menor'+argNum(argCel)).innerHTML = "<tr id='linha'><td><img src='https://i.ibb.co/cy129GN/V.png' id='x"+argNum(id[0])+"' class='casas_maiores'></td></tr>";
				guardaFechou();
				try{ //Teoricamente mais processamento (testada);
					if(Velha("x")){
						alert("Velha");
					}
				}catch(e){
					//
				}
				/*if(v == 81){ //Teoricamente menos processamento (nÃƒÆ’Ã‚Â£o testada);
					alert("Velha");
				}*/
			}
			if(SuaVez=="X"){
				SuaVez="O";
			}else{
				SuaVez="X";
			}
		}
	}
	verificaFechou(lock);
	online(id);
	//v++; //Variavel que conta o nÃƒÆ’Ã‚Âºmero de jogadas, caso seja 81 ÃƒÆ’Ã‚Â© velha (declarada como global acima e comentada);
	// argCel = "";
}
function Troca(id){
	var img = document.getElementById(id).src;
	return img.substring(img.length -9, img.length);
}
function guardaFechou(){
	fechou[o] = argCel;
	o++;
	argCel = "";
}
function verificaFechou(lock){

	for(var y = 0; y<fechou.length;y++){
		if(lock == fechou[y] ){
			argCel = ""; // libera o jogo caso uma casa jÃƒÆ’Ã‚Â¡ tenha sido fechada
		}
	}
}
function Eonara(argQuad = argCel){ // Para reutilizar a Eonara deve se primeiro setar o argCel com a letra do quadrante a ser verificado;
	var c; var r = c = 1; // C --> Contador e R --> RazÃƒÆ’Ã‚Â£o para o if;
	p = 3; // O quanto o J se deslocarÃƒÆ’Ã‚Â¡ para se posicionar na casa correta;
	q = 8; // O quanto as primeiras casas se deslocam umas das outras;
	var x = [];

	for(var j=1; j<=9; j++){ //Onde serÃƒÆ’Ã‚Â¡ construido o vetor com os ids das casas de cada jogo;
		x[j-1] = argQuad+""+j.toString();
	}

	for(var y = 1;y<=3;y++){
		for(var j=0; j<=q; j=j+p){
			if(c>=1 && c<=3){
				r = 1;
				p = 3;
			}else if(c>=4 && c<=6){
				r = 3;
				p = 1;
				q = 2;
			}else if(c == 7){
				r = 4;
				p = 2;
			}else{
				r = 2;
			}
			try{
				if(Troca(x[j])==Troca(x[j+r]) && Troca(x[j])==Troca(x[j+(2*r)]) && Troca(x[j])!="Vazio.png" && Troca(x[j])!="V.png"){
					return true;
				}
			}catch(e){
				//Caso necessite do tratamento do erro, o parametro recebido --> e <-- ÃƒÆ’Ã‚Â© o objeto da exception;
			}
			c++;
		}
	}
	return false;
}
function Velha(argQuad = argCel){
	var cont = 0;
	var x = [];
	for(var j=1; j<=9; j++){ //Onde serÃƒÆ’Ã‚Â¡ construido o vetor com os ids das casas de cada jogo;
		x[j-1] = argQuad+""+j.toString();
		if(Troca(x[j-1])!="Vazio.png"){
			cont++;
		}
	}
	if(cont == 9){
		return true;
	}return false;
}
function lockCels(argId){
	return cel[argId[1]-1];
}
function argNum(argLetra){
	for(var i=0; i<9; i++){
		if(cel[i]==argLetra){
			return i+1;
		}
	}
}
function online(id){
        var socket = io();
        src = document.getElementById(id).src;
        socket.emit('jogada', {id:id, vez:SuaVez});
}
