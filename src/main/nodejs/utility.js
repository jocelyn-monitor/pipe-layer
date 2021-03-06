// based on http://jsfromhell.com/array/search with sort added.
var binarySearch = function(o, v, s, i){
	
	if(!s) s= function(a,b){return a-b}
	var h = o.length, l = -1, m
	while(h - l > 1) {
		if(s(o[m = h + l >> 1],v,s)<0) l = m
		else h = m
	}
	return o[h] != v ? i ? h : -1 : h
}

var orderedInsert = function(target,element,sort) {
	
	var i = binarySearch(target,element,sort,true)
	target.splice(i,0,element)
	return i
}

var bind = function(f,ctx) {

	return new function(g,ctxb) {
		return function()
		{
			return g.apply(ctxb,arguments)
		}	
	}(f,ctx)
}

var forkjoin = function(waitState)
{
	this.final = arguments.length
	this.count = 0

	this.join = function() {
	
		if(++this.count==this.final) 
			this.emit('success',this)
	}

	// bind callback
	for(var i in arguments)
		if(arguments[i] instanceof events.Promise)
			arguments[i].addListener(waitState?waitState:'success', bind(this.join,this) )
	
	// TODO: understand desired behavior for errback.
	// TODO: expose co-routine return values?
}

forkjoin.prototype = new events.EventEmitter()
