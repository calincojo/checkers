
/*=========variabile globale=========================*/


var square_class = document.getElementsByClassName("square");
var white_checker_class = document.getElementsByClassName("white_checker");
var black_checker_class = document.getElementsByClassName("black_checker");

var selectedPiece,selectedPieceindex;
var upRight,upLeft,downLeft,downRight;  // toate variantele posibile de mers pt o  dama
var contor = 0;

var block = [];
var w_checker = [];
var b_checker = [];
var the_checker ;
var mustAttack = false;
var multiplier = 1 // 2 daca face saritura 1 in caz contrat

var tableLimit,reverse_tableLimit ,  moveUpLeft,moveUpRight, moveDownLeft,moveDownRight , tableLimitLeft, tableLimitRight;

/*================================*/


/*================declararea claselor=========*/

var square_p = function(square,index){
	this.id = square;
	this.ocupied = false;
	this.pieceId = undefined;
	this.id.onclick = function() {
		makeMove(index);
	}
}

var checker = function(piece,color,square) {
	this.id = piece;
	this.color = color;
	this.king = false;
	this.ocupied_square = square;
	this.alive = true;
	this.attack = false;
	if(square%8){
		this.coordX= square%8;
		this.coordY = Math.floor(square/8) + 1 ;
	}
	else{
		this.coordX = 8;
		this.coordY = square/8 ;
	}
	this.id.onclick = function  () {
		showMoves(piece);	
	}
}

checker.prototype.setCoord = function(X,Y){
	var x = (this.coordX - 1  ) * 80 + 10;
	var y = (this.coordY - 1 ) * 80  + 10;
	this.id.style.top = y + 'px';
	this.id.style.left = x + 'px';
}

checker.prototype.changeCoord = function(X,Y){
	this.coordY +=Y;
	this.coordX += X;
}

checker.prototype.checkIfKing = function () {
	if(this.coordY == 8 && !this.king &&this.color == "white")
		this.king = true;
	if(this.coordY == 1 && !this.king &&this.color == "black")
		this.king = true;
}

/*===============Initializarea campurilor de joc =================================*/


for (var i = 1; i <=64; i++)
	block[i] =new square_p(square_class[i],i);

/*==================================================*/


/*================initializarea damelor =================================*/

	// damele albe 
for (var i = 1; i <= 4; i++){
	w_checker[i] = new checker(white_checker_class[i], "white", 2*i -1 );
	w_checker[i].setCoord(0,0);
	block[2*i - 1].ocupied = true;
	block[2*i - 1].pieceId =w_checker[i];
}

for (var i = 5; i <= 8; i++){
	w_checker[i] = new checker(white_checker_class[i], "white", 2*i );
	w_checker[i].setCoord(0,0);
	block[2*i].ocupied = true;
	block[2*i].pieceId = w_checker[i];
}

for (var i = 9; i <= 12; i++){
	w_checker[i] = new checker(white_checker_class[i], "white", 2*i - 1 );
	w_checker[i].setCoord(0,0);
	block[2*i - 1].ocupied = true;
	block[2*i - 1].pieceId = w_checker[i];
}

//damele negre
for (var i = 1; i <= 4; i++){
	b_checker[i] = new checker(black_checker_class[i], "black", 56 + 2*i  );
	b_checker[i].setCoord(0,0);
	block[56 +  2*i ].ocupied = true;
	block[56+  2*i ].pieceId =b_checker[i];
}

for (var i = 5; i <= 8; i++){
	b_checker[i] = new checker(black_checker_class[i], "black", 40 +  2*i - 1 );
	b_checker[i].setCoord(0,0);
	block[ 40 + 2*i - 1].ocupied = true;
	block[ 40 + 2*i - 1].pieceId = b_checker[i];
}

for (var i = 9; i <= 12; i++){
	b_checker[i] = new checker(black_checker_class[i], "black", 24 + 2*i  );
	b_checker[i].setCoord(0,0);
	block[24 + 2*i ].ocupied = true;
	block[24 + 2*i ].pieceId = b_checker[i];
}

/*========================================================*/



/*================SELECTIA UNEI PIESE==============*/
the_checker = w_checker;

function showMoves (piece) {
	/* daca a fost selectat inainte o piesa stergem drumurile ei actualizand nu drumurile piesei noi s
	electate
	*/
	var match = false;
	mustAttack = false;
	if(selectedPiece){
			erase_roads(selectedPiece);
	}
	selectedPiece = piece;
	var i,j; // retine indicele damei
	for ( j = 1; j <= 12; j++){
		if(the_checker[j].id == piece){
			i = j;
			selectedPieceindex = j;
			match = true;
		}
	}
	if(!match)  return 0 ; // daca nu a fost gasit nicio potrivire ; se intampla cand de exemplu rosu muta iar tu apasi pe negru

	/*===acum in functie de culoarea lor setez marginile si miscarile damei===*/
	if(the_checker[i].color =="white"){
		tableLimit = 8;
		tableLimitRight = 1;
		tableLimitLeft = 8;
		moveUpRight = 7;
		moveUpLeft = 9;
		moveDownRight = - 9;
		moveDownLeft = -7;
	}
	else{
		tableLimit = 1;
		tableLimitRight = 8;
		tableLimitLeft = 1;
		moveUpRight = -7;
		moveUpLeft = -9;
		moveDownRight = 9;
		moveDownLeft = 7;
	}
 	/*===========VERIFIC DACA POT ATACA====*/


 	/*
 	if(x.coordX >= 3 && x.coordY <=6 && block[x.ocupied_square + 7].ocupied && block[x.ocupied_square + 7].pieceId.color != x.color && !block[x.ocupied_square + 14].ocupied){
 		mustAttack = true;
 		downLeft = x.ocupied_square + 14;
 		block[downLeft].id.style.background = "black";
 	}
 	*/
 	upRight = checkAttack( the_checker[i] , 6, 3 , -1 , -1 , -7, upRight );
 	upLeft = checkAttack( the_checker[i], 3 , 3 , 1 , -1 , -9 , upLeft );
 	if(the_checker[i].king){
	 	downLeft = checkAttack( the_checker[i] , 3, 6, 1 , 1 , 7 , downLeft );
 		downRight = checkAttack( the_checker[i] , 6 , 6 , -1, 1 ,9 , downRight );
 	}
 	
 	if(the_checker[i].color== "black"){
	 	var p = upLeft;
	 	upLeft = downLeft;
	 	downLeft = p;
	 	p = upRight;
	 	upRight = downRight;
	 	downRight = p;
	 	p = downLeft ;
	 	downLeft = downRight;
	 	downRight = p;

	 	p = upRight ;
	 	upRight = upLeft;
	 	upLeft = p;

 	}



 	// x <= 6 <=> -x >= -6 
	/*========DACA NU POT ATACA VERIFIC DACA POT MERGE======*/

 	if(!mustAttack){
 	  downLeft = checkMove( the_checker[i] , tableLimit , tableLimitRight , moveUpRight , downLeft);
		downRight = checkMove( the_checker[i] , tableLimit , tableLimitLeft , moveUpLeft , downRight);
		if(the_checker[i].king){
			upLeft = checkMove( the_checker[i] , reverse_tableLimit , tableLimitRight , moveDownRight , upLeft);
			upRight = checkMove( the_checker[i], reverse_tableLimit , tableLimitLeft , moveDownLeft, upRight)
		}
	}
	
}


function erase_roads(piece){
	if(downRight) block[downRight].id.style.background = "#197519";
	if(downLeft) block[downLeft].id.style.background = "#197519";
	if(upRight) block[upRight].id.style.background = "#197519";
	if(upLeft) block[upLeft].id.style.background = "#197519";
}
		
/*=============MUTAREA PIESEI======*/

function makeMove (index) {
	var isMove = false;
	if(!selectedPiece) // daca jocu de abea a inceput si nu a fost selectata nicio piesa
		return 0;

 /* =========perspectiva e a jucatorului care muta ======*/
	if(the_checker[1].color=="white"){
		cpy_downRight = upRight;
		cpy_downLeft = upLeft;
		cpy_upLeft = downLeft;
		cpy_upRight = downRight;
	}
	else{
		cpy_downRight = upLeft;
		cpy_downLeft = upRight;
		cpy_upLeft = downRight;
		cpy_upRight = downLeft;
	}  

	if(mustAttack) 
		multiplier = 2;
	else
		multiplier = 1;


		if(index == cpy_upRight){
			isMove = true;		
			if(the_checker[1].color=="white"){
				// muta piesa
				executeMove( multiplier * 1, multiplier * 1, multiplier * 9 );
				if(mustAttack) eliminateCheck(index - 9);
			}
			else
				executeMove( multiplier * 1, multiplier * -1, multiplier * -7);
		}

		if(index == cpy_upLeft){
			isMove = true;
			if(the_checker[1].color=="white"){
				executeMove( multiplier * -1, multiplier * 1, multiplier * 7);
				//elimina piesa daca a fost executata o saritura
			 	if(mustAttack)	eliminateCheck(index - 7 );				
			}
			else{
				alert(index);
				executeMove( multiplier * -1, multiplier * -1, multiplier * -9);
	
			}
		}

		if(the_checker[selectedPieceindex].king){

			if(index == cpy_downRight){
				isMove = true;
				if(the_checker[1].color=="white")
					executeMove( multiplier * 1, multiplier * -1, multiplier * -7);
				else
					executeMove( multiplier * 1, multiplier * 1, multiplier * 9);
			}

		if(index == cpy_downLeft){
			isMove = true;
				if(the_checker[1].color=="white")
					executeMove( multiplier * -1, multiplier * -1, multiplier * -9);
				else
					executeMove( multiplier * -1, multiplier * 1, multiplier * 7);
			}
		}

	erase_roads(0);
	the_checker[selectedPieceindex].checkIfKing();

	// schimb randul
	if (isMove) {
		if(the_checker[1].color=="white")
			the_checker = b_checker;
		else
			the_checker = w_checker;
	}
}

/*===========MUTAREA PIESEI-SCHIMBAREA COORDONATELOR======*/

function executeMove (X,Y,nSquare){
	// schimb coordonate piesei mutate
	the_checker[selectedPieceindex].changeCoord(X,Y); 
	the_checker[selectedPieceindex].setCoord(0,0);
	// eliberez campul pe care il ocupa piesa si il ocup pe cel pe care il va ocupa
	block[the_checker[selectedPieceindex].ocupied_square].ocupied = false;			
	//alert (the_checker[selectedPieceindex].ocupied_square);
	block[the_checker[selectedPieceindex].ocupied_square + nSquare].ocupied = true;
	block[the_checker[selectedPieceindex].ocupied_square + nSquare].pieceId = 	block[the_checker[selectedPieceindex].ocupied_square ].pieceId;
	block[the_checker[selectedPieceindex].ocupied_square ].pieceId = undefined; 	
	the_checker[selectedPieceindex].ocupied_square += nSquare;

}

function checkMove(Apiece,tLimit,tLimit_Side,moveDirection,theDirection){
	if(Apiece.coordY != tLimit){
		if(Apiece.coordX != tLimit_Side && !block[ Apiece.ocupied_square + moveDirection ].ocupied){
			block[ Apiece.ocupied_square + moveDirection ].id.style.background = "red";
			theDirection = Apiece.ocupied_square + moveDirection;
		}
	else
			theDirection = undefined;
	}
	else
		theDirection = undefined;
	return theDirection;
}



function  checkAttack( check , X, Y , negX , negY, squareMove, direction){
	if(check.coordX * negX >= 	X * negX && check.coordY *negY <= Y * negY && block[check.ocupied_square + squareMove ].ocupied && block[check.ocupied_square + squareMove].pieceId.color != check.color && !block[check.ocupied_square + squareMove * 2 ].ocupied){
		mustAttack = true;
		direction = check.ocupied_square +  squareMove*2 ;
		block[direction].id.style.background = "black";
		return direction ;
	}
	else
		direction =  undefined;
		return direction;
}

function eliminateCheck(index){

	var x =block[ index ].pieceId ;
	x.alive =false;
	block[ index ].ocupied = false;
	x.id.style.display  = "none";

}

/* ce imi trebuie: ca argumente trimit checkerul , apoi incerc sa vad daca pot sa atac in stanga jos 
	pt asta mai intai blocul pe care se alfa trebuie coordY <=6 si coordX >=3  daca da
	apoi trebuie sa vad daca blocul din stanga jos e ocupat de o piesa adversa 
	apoi trebuie sa vad daca blocul de stanga jos * 2 e liber 
	daca toate astea se indeplinesc downLeft primeste valoare stanga jos * 2 
	si s-a gasit un atac posibil astfel variablia mustAttack devine 1
	altfef
	downleft va fi unedifined
	deci functia va fi ceva de genul functie(checker , coordx coordy) 
	va fi cam asa 
	daca diferenta in modul dintre coordY 
	coordX - 2  > 0 ATUNCI POT
	8 - coordX > 2

	if (this.coordX >= 3 && this.coordY <= 6 && block [ checker[i].square + 7].ocupied && )
 */
