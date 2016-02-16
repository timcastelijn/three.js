
// Inheritance
Function.prototype.inheritsFrom = function( parentClassOrObject ){
	if ( parentClassOrObject.constructor == Function )
	{
		//Normal Inheritance
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	}
	else
	{
		//Pure Virtual Inheritance
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	}
	return this;
}
//

//module base class
Module = {
	beBorn : function(){
		this.alive = true;
	}


}
//

// parent class ModuleSmall
function ModuleSmall(name){
	this.name=name;
	this.offspring=[];
}
ModuleSmall.inheritsFrom( Module );

// function to create offspring
ModuleSmall.prototype.haveABaby=function(){
	this.parent.beBorn.call(this);
	var newBaby = new this.constructor( "Baby " + this.name );
	this.offspring.push(newBaby);
	return newBaby;
}
//

// child class heater module
function ModuleHeater( name ){
	this.name=name;
}

ModuleHeater.inheritsFrom( ModuleSmall );
ModuleHeater.prototype.haveABaby=function(){
	var theKitten = this.parent.haveABaby.call(this);
	alert("mew!");
	return theKitten;
}

ModuleHeater.prototype.toString=function(){
	return '[Cat "'+this.name+'"]';
}
