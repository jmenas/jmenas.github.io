(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.webFontTxtInst = {}; 
var loadedTypekitCount = 0;
var loadedGoogleCount = 0;
var gFontsUpdateCacheList = [];
var tFontsUpdateCacheList = [];
lib.ssMetadata = [];



lib.updateListCache = function (cacheList) {		
	for(var i = 0; i < cacheList.length; i++) {		
		if(cacheList[i].cacheCanvas)		
			cacheList[i].updateCache();		
	}		
};		

lib.addElementsToCache = function (textInst, cacheList) {		
	var cur = textInst;		
	while(cur != null && cur != exportRoot) {		
		if(cacheList.indexOf(cur) != -1)		
			break;		
		cur = cur.parent;		
	}		
	if(cur != exportRoot) {		
		var cur2 = textInst;		
		var index = cacheList.indexOf(cur);		
		while(cur2 != null && cur2 != cur) {		
			cacheList.splice(index, 0, cur2);		
			cur2 = cur2.parent;		
			index++;		
		}		
	}		
	else {		
		cur = textInst;		
		while(cur != null && cur != exportRoot) {		
			cacheList.push(cur);		
			cur = cur.parent;		
		}		
	}		
};		

lib.gfontAvailable = function(family, totalGoogleCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], gFontsUpdateCacheList);		

	loadedGoogleCount++;		
	if(loadedGoogleCount == totalGoogleCount) {		
		lib.updateListCache(gFontsUpdateCacheList);		
	}		
};		

lib.tfontAvailable = function(family, totalTypekitCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], tFontsUpdateCacheList);		

	loadedTypekitCount++;		
	if(loadedTypekitCount == totalTypekitCount) {		
		lib.updateListCache(tFontsUpdateCacheList);		
	}		
};
// symbols:



(lib.aptbldg = function() {
	this.initialize(img.aptbldg);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,489,612);


(lib.cloud14x8 = function() {
	this.initialize(img.cloud14x8);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,335,87);


(lib.cloud24x8 = function() {
	this.initialize(img.cloud24x8);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,205,74);


(lib.cloud34x8 = function() {
	this.initialize(img.cloud34x8);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,251,92);


(lib.cloud44x8 = function() {
	this.initialize(img.cloud44x8);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,174,74);


(lib.cloud54x8 = function() {
	this.initialize(img.cloud54x8);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,114,69);


(lib.coffeecup = function() {
	this.initialize(img.coffeecup);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,412,331);


(lib.disclosures_page02 = function() {
	this.initialize(img.disclosures_page02);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,768,1020);


(lib.disclosures_page03 = function() {
	this.initialize(img.disclosures_page03);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,768,1020);


(lib.disclosures_page1 = function() {
	this.initialize(img.disclosures_page1);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,768,1020);


(lib.gambeloak = function() {
	this.initialize(img.gambeloak);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,678,605);


(lib.grassBitmap = function() {
	this.initialize(img.grassBitmap);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1280,722);


(lib.japanesemaple = function() {
	this.initialize(img.japanesemaple);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,678,605);


(lib.magnifying_lens = function() {
	this.initialize(img.magnifying_lens);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2000,2000);


(lib.manila_envelope = function() {
	this.initialize(img.manila_envelope);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1178,794);


(lib.manila_envelope_flap = function() {
	this.initialize(img.manila_envelope_flap);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,536,117);


(lib.pen = function() {
	this.initialize(img.pen);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,100,500);


(lib.phone = function() {
	this.initialize(img.phone);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,316,600);


(lib.redmaple = function() {
	this.initialize(img.redmaple);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,678,605);


(lib.road = function() {
	this.initialize(img.road);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,150,150);


(lib.tabletop_scene = function() {
	this.initialize(img.tabletop_scene);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1280,720);


(lib.wood = function() {
	this.initialize(img.wood);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,430,556);// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.whitegradient = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["rgba(255,255,255,0)","#FFFFFF"],[0,0.431],640.2,0.1,-640.1,0.1).s().p("EhkAA4bMAAAhw1MDIBAAAMAAABw1g");
	this.shape.setTransform(640.1,361.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,1280.3,722.3);


(lib.white_bg = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("EhidA4QQhiAAAAhcMAAAhtnQAAhcBiAAMDE7AAAQBiAAAABcMAAABtnQAABchiAAg");
	this.shape.setTransform(640,360);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.white_bg, new cjs.Rectangle(0,0,1280,720), null);


(lib.tabletop_zoom = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.tabletop_scene();
	this.instance.parent = this;
	this.instance.setTransform(0,0,1.18,1.18);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.tabletop_zoom, new cjs.Rectangle(0,0,1510.4,849.6), null);


(lib.table = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.bf(img.wood, null, new cjs.Matrix2D(1,0,0,1,-219,-283.5)).s().p("EhkOA4kMAAAhxHMDIcAAAMAAABxHg");
	this.shape.setTransform(641.5,362);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,1282.9,724);


(lib.sky = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#FFFFFF","#73B3FF"],[0.051,0.639],0,323.2,0,-360.9).s().p("EhOCAiNIhggCQiTgEkZgNQlHgOjFAFIlCAQIgkACMAAAhEPMDIBAAAMAAAA6RQl+gLktgCQi6gBjoADImjAGQkYAFwGAvQwGAvvWBAQvXBAsXA8QsYA7xPBZQxOBZlTAgImwAoQklAdjUANQj1APjUAAIgxAAgEAnvARWIAmgBIgmgCg");
	this.shape.setTransform(640.1,218.9);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,1280.3,437.8);


(lib.road_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#779933").ss(1,1,1,3,true).p("EhSuAIhQDIAACVgBQM0AHMUAFQYYAIEvgUQLjgyJxiXQMHi9M0mEQDmhtFpi8QGajWFHi5QCmhfDBhMQBrgqClg6QDyhcEDhJQGGhvDcgEIG5gVIErgMQj3A7ktBaQpYCzkGCYQjpCImJEqQneFtj3CmQnlFDptEfQptEfqEDAQqEDBuOBnQuNBmoGAcQm1AYjlAFQkOAF4EAjg");
	this.shape.setTransform(529.5,151.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.bf(img.road, null, new cjs.Matrix2D(1,0,0,1,-75,-75)).s().p("EhSuAIhIFegBQM0AHMTAFQYYAIEugUQLkgyJwiXQMIi9MzmEQDmhsFqi9QGajVFHi6QClhfDChMQBrgqClg6QDyhbEDhKQGGhvDbgEIG5gUIEsgNQj3A8ktBZQpZCzkFCYQjpCImJErQneFtj3ClQnlFDptEfQptEfqFDBQqDDAuOBnQuNBmoHAcQm0AZjmAEQkNAF4EAjg");
	this.shape_1.setTransform(529.5,151.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,1061,305);


(lib.replay_btn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AgFBWIAAg+IhAhtIAOAAIAxBWIAHAOIAGgOIAyhWIANAAIhABuIAAA9g");
	this.shape.setTransform(35.6,0.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AA/BWIgZg7IhMAAIgZA7IgMAAIBIirIAGAAIBJCrgAgBg/IgGARIgbA/IBEAAIgbg/QgHgRAAgDIgBADg");
	this.shape_1.setTransform(20.3,0);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AgsBWIAAirIALAAIAACgIBOAAIAAALg");
	this.shape_2.setTransform(7.2,0.1);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AguBWIAAipQAUgCATAAQAYAAAPALQAPAMAAAYQAAAYgVAOQgUAPgcAAIgDAAIAAgIIACAAQAXAAARgLQASgNAAgUQAAgUgMgJQgNgJgTAAIgaABIAACgg");
	this.shape_3.setTransform(-6.5,0);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFFFFF").s().p("AgoBWIAAirIBPAAIAAAKIhEAAIAAA/IA9AAIAAAKIg9AAIAABOIBGAAIAAAKg");
	this.shape_4.setTransform(-20,0.1);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("AAsBTQgIgEgJgJQgIgJgggtQgYAAgTgBIAABGIgLAAIAAiqIAmgBQAZAAAOAMQAQANAAAXQAAAQgJANQgJAMgKAIIAUAdIARAWQAPAPATADIAAAHQgPAAgKgEgAg4hLIAABQIAkACQALAAAKgNQAMgOABgTQAAgSgNgKQgLgJgUAAIgaABg");
	this.shape_5.setTransform(-33,0.1);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#DD4C29").s().p("AuhFAQhkAAAAhkIAAm3QAAhkBkAAIdDAAQBkAAAABkIAAG3QAABkhkAAg");
	this.shape_6.setTransform(0,0,0.616,0.665);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#F15934").s().p("AuhFAQhkAAAAhkIAAm3QAAhkBkAAIdDAAQBkAAAABkIAAG3QAABkhkAAg");
	this.shape_7.setTransform(0,0,0.616,0.665);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_7},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]},1).to({state:[{t:this.shape_7},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]},1).to({state:[{t:this.shape_7}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-63.5,-21.3,127,42.6);


(lib.redmaple_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.redmaple();
	this.instance.parent = this;
	this.instance.setTransform(0,0,0.401,0.401);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,272,242.7);


(lib.red_bg = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#EE6726").s().p("Ehj/A4QMAAAhwfMDH/AAAMAAABwfg");
	this.shape.setTransform(640,360);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,1280,720);


(lib.question_bubble = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Am3mjIQ3gUIz/Nvg");
	this.shape.setTransform(221.7,370.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#EE6726").s().p("AipStQgygUgnglQgnglgXg1QgWg0AAg8QAAg9AXg0QAWg0AngmQAmgkAzgWQAygWA8ABQA5AAAyATQAzAWAnAkQAoAmAWA0QAVAzAAA9QAAA9gVAzQgWA2gnAmQgnAlg0AVQgyAVg6gBQg8AAgxgUgAh0MjQgaALgUAUQgTASgMAbQgLAaAAAhQAAAhALAaQAKAYATAUQAWATAZAKQAZAKAgAAQAfAAAbgKQAYgKAVgUQATgSALgbQALgcAAggQAAgfgLgcQgLgagTgRQgSgTgbgLQgbgLgeAAQggABgZAKgAirIwIgNg0QgbhpAAheQAAhZAXhNQAVhGAlg/QAlg8AqgwQAogvApgrQAzg5AkgqQAlgsAbg0QAagwARg/QAPg+AAhQQAAhfgVg+QgUg7gigkQgigigugPQg1gShBAAQhSAAhGAaQgiALgeAWQAWAfARAiQAhBEAABGQAAAygUAvQgTAsgiAgQgiAhgsASQguATg0AAQgvgBgsgQQgugQgjgfQglghgWgwQgWguAAg/QAAhXAvhcQAthaBYhLQBWhJB+gwQB+gvCiAAQCgAAB9AvQB+AxBYBRQBYBQAwBsQAuBqAABzQAADhiyDDQhFBKhXBFQhRBBhDBBQhCBDgsBLQgoBFAABaQAAAWACAXQADAeAEAZIAIA3Ig0AUQgeALgmAGQghAEgfAAgAB/wsQBPAbA5A6QA3A5AeBZQAcBVAAB0QAABkgUBNQgTBMgiBBQgjBBguA2QgjAqg4A+IgCACQgtAvggAmQgiAlgdAzQgdAwgRA4IgJAkQANgqAYgqQA0hbBPhOQBNhMBThBQBPg/A8hDQCOiaAAisQAAhWgihQQgjhQhEg+QhFhAhlgmQg4gVg9gJgAmbuwQhCA5ghBCQghA/AAA2QAAAeAKAWQAJAVAQANQAQAPAUAIQAWAHAXAAQAaAAAUgIQATgHAQgQQAOgNAJgTQAIgTAAgXQAAglgUgpQgWgtgkgmIgpgsIAmguQANgRAQgPQgWAPgWARg");
	this.shape_1.setTransform(221.7,174.4);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#EE6726").s().p("AiPRtQgmgPgegcQgdgbgRgoQgQgmAAgvQAAgvARgnQAQgnAegdQAdgcAmgQQAogQAsAAQAsAAAlAPQAmAQAfAcQAeAcAPAmQARAnAAAvQAAAugRAoQgOAmgfAeQgeAdgnAPQglAQgtAAQguAAglgQgAiPE1QAAhPAVhCQATg/Agg4QAig2AlgsQAsgzAkglQAwg1AqgxQAqgzAeg4QAfg6ARhFQAShFAAhaQAAhqgZhJQgahLgrgtQgugvg/gVQg/gVhMAAQheAAhRAeQhTAdgyBAQApAtAcA3QAaA1AAA3QAAAlgOAgQgNAfgZAYQgYAXggANQgfANgpAAQgkAAgfgLQgigMgagXQgagYgPgiQgQghAAgvQAAhHAnhNQAnhOBOhCQBNhBBygsQB0grCUAAQCSAABzArQByAsBOBIQBOBIApBdQAoBeAABkQAADHigCuQhCBIhRBAQhSBChJBGQhIBIgxBUQgvBUAABtQgBATADAfQACAaAFAiQgYAJgeAEQgaAEgcAAQgahjAAhTg");
	this.shape_2.setTransform(221.7,174.4);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("A7mbaQi6AAiEiEQiEiEAAi5MAAAgoxQAAi5CEiEQCEiEC6AAMA3NAAAQC6AACECEQCECEAAC5MAAAAoxQAAC5iECEQiECEi6AAg");
	this.shape_3.setTransform(221.7,175.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,443.5,414.9);


(lib.phone_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.phone();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,316,600);


(lib.pen_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.pen();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,100,500);


(lib.mc_text = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.title = new cjs.Text("Firstname Surname", "normal 400 22px 'Julius Sans One'");
	this.title.name = "title";
	this.title.textAlign = "center";
	this.title.lineHeight = 26;
	this.title.lineWidth = 233;
	this.title.parent = this;
	this.title.setTransform(118.5,2);
	if(!lib.properties.webfonts['Julius Sans One']) {
		lib.webFontTxtInst['Julius Sans One'] = lib.webFontTxtInst['Julius Sans One'] || [];
		lib.webFontTxtInst['Julius Sans One'].push(this.title);
	}

	this.timeline.addTween(cjs.Tween.get(this.title).wait(1));

}).prototype = getMCSymbolPrototype(lib.mc_text, new cjs.Rectangle(0,0,237,29.1), null);


(lib.mc_logo = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

}).prototype = getMCSymbolPrototype(lib.mc_logo, null, null);


(lib.mc_customer = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.title = new cjs.Text("Customer", "16px 'Arial Narrow'");
	this.title.name = "title";
	this.title.textAlign = "center";
	this.title.lineHeight = 20;
	this.title.lineWidth = 85;
	this.title.parent = this;
	this.title.setTransform(44.5,2);

	this.timeline.addTween(cjs.Tween.get(this.title).wait(1));

}).prototype = getMCSymbolPrototype(lib.mc_customer, new cjs.Rectangle(0,0,89,24.7), null);


(lib.manila_envelope_flap_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.manila_envelope_flap();
	this.instance.parent = this;
	this.instance.setTransform(-3,-4,1.003,1.003);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.manila_envelope_flap_1, new cjs.Rectangle(-3,-4,537.8,117.4), null);


(lib.magnifying_lens_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.magnifying_lens();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.magnifying_lens_1, new cjs.Rectangle(0,0,2000,2000), null);


(lib.logo = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("EgmvAYJMAAAgwRMBNfAAAMAAAAwRg");
	this.shape.setTransform(250,150,1.008,0.971);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.logo, new cjs.Rectangle(0,0,500,300), null);


(lib.letusknow = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.text = new cjs.Text("LET US KNOW", "normal 400 70px 'Julius Sans One'", "#FFFFFF");
	this.text.lineHeight = 78;
	this.text.lineWidth = 546;
	this.text.parent = this;
	this.text.setTransform(2,2);
	if(!lib.properties.webfonts['Julius Sans One']) {
		lib.webFontTxtInst['Julius Sans One'] = lib.webFontTxtInst['Julius Sans One'] || [];
		lib.webFontTxtInst['Julius Sans One'].push(this.text);
	}

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,549.9,90);


(lib.japanesemaple_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.japanesemaple();
	this.instance.parent = this;
	this.instance.setTransform(0,0,0.226,0.226);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,153,136.5);


(lib._img = function(mode,startPosition,loop) {
if (loop == null) { loop = false; }	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Ay+XcMAAAgu3MAl9AAAMAAAAu3g");
	this.shape.setTransform(121.5,150);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib._img, new cjs.Rectangle(0,0,243,300), null);


(lib.ifyouhave = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.text = new cjs.Text("IF YOU HAVE", "normal 400 70px 'Julius Sans One'", "#FFFFFF");
	this.text.lineHeight = 78;
	this.text.lineWidth = 546;
	this.text.parent = this;
	this.text.setTransform(2,2);
	if(!lib.properties.webfonts['Julius Sans One']) {
		lib.webFontTxtInst['Julius Sans One'] = lib.webFontTxtInst['Julius Sans One'] || [];
		lib.webFontTxtInst['Julius Sans One'].push(this.text);
	}

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,549.9,90);


(lib.grass = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.bf(img.grassBitmap, null, new cjs.Matrix2D(1,0,0,1,-640,-361)).s().p("EhkAAcOMAAAgwSMDIBgIJMAAAA4bg");
	this.shape.setTransform(640.1,180.6);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,1280.3,361.2);


(lib.gambleoak = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.gambeloak();
	this.instance.parent = this;
	this.instance.setTransform(0,0,0.646,0.646);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,438.2,391);


(lib.total = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.text = new cjs.Text("TOTAL", "normal 400 50px 'Julius Sans One'", "#333333");
	this.text.textAlign = "center";
	this.text.lineHeight = 57;
	this.text.lineWidth = 287;
	this.text.parent = this;
	this.text.setTransform(145.7,2);
	if(!lib.properties.webfonts['Julius Sans One']) {
		lib.webFontTxtInst['Julius Sans One'] = lib.webFontTxtInst['Julius Sans One'] || [];
		lib.webFontTxtInst['Julius Sans One'].push(this.text);
	}

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,291.4,65.6);


(lib.term = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.text = new cjs.Text("TERM", "normal 400 50px 'Julius Sans One'", "#333333");
	this.text.lineHeight = 57;
	this.text.lineWidth = 182;
	this.text.parent = this;
	this.text.setTransform(2,2);
	if(!lib.properties.webfonts['Julius Sans One']) {
		lib.webFontTxtInst['Julius Sans One'] = lib.webFontTxtInst['Julius Sans One'] || [];
		lib.webFontTxtInst['Julius Sans One'].push(this.text);
	}

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,185.7,65.6);


(lib.seller = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.text = new cjs.Text("SELLER", "normal 400 50px 'Julius Sans One'", "#333333");
	this.text.textAlign = "center";
	this.text.lineHeight = 57;
	this.text.lineWidth = 263;
	this.text.parent = this;
	this.text.setTransform(133.7,2);
	if(!lib.properties.webfonts['Julius Sans One']) {
		lib.webFontTxtInst['Julius Sans One'] = lib.webFontTxtInst['Julius Sans One'] || [];
		lib.webFontTxtInst['Julius Sans One'].push(this.text);
	}

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,267.4,64.8);


(lib.monthly_principal = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.text = new cjs.Text("MONTHLY\nPRINCIPAL", "normal 400 50px 'Julius Sans One'", "#333333");
	this.text.lineHeight = 57;
	this.text.lineWidth = 342;
	this.text.parent = this;
	this.text.setTransform(2,2);
	if(!lib.properties.webfonts['Julius Sans One']) {
		lib.webFontTxtInst['Julius Sans One'] = lib.webFontTxtInst['Julius Sans One'] || [];
		lib.webFontTxtInst['Julius Sans One'].push(this.text);
	}

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,345.7,115.1);


(lib.lender = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.text = new cjs.Text("LENDER", "normal 400 50px 'Julius Sans One'", "#333333");
	this.text.textAlign = "center";
	this.text.lineHeight = 57;
	this.text.lineWidth = 263;
	this.text.parent = this;
	this.text.setTransform(133.7,2);
	if(!lib.properties.webfonts['Julius Sans One']) {
		lib.webFontTxtInst['Julius Sans One'] = lib.webFontTxtInst['Julius Sans One'] || [];
		lib.webFontTxtInst['Julius Sans One'].push(this.text);
	}

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,267.4,64.8);


(lib.key = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#F2AD38").s().p("AhOD7IAAnIICdgtIAAEFIg1AmIAjA8IgrA0IARAtIg/Atg");
	this.shape.setTransform(22.3,58.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AgmAoQgRgQAAgYQAAgWARgRQAQgQAWAAQAXAAAQAQQARARAAAWQAAAXgRARQgQAQgXAAQgWAAgQgQg");
	this.shape_1.setTransform(22.3,11.6);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#F2AD38").s().p("AidCiQhBhDAAhfQAAheBBhDQBChDBbAAQBdAABBBDQBBBDAABeQAABfhBBDQhBBDhdAAQhbAAhChDg");
	this.shape_2.setTransform(22.3,22.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,44.7,84.1);


(lib.interest = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.text = new cjs.Text("INTEREST", "normal 400 50px 'Julius Sans One'", "#333333");
	this.text.lineHeight = 57;
	this.text.lineWidth = 262;
	this.text.parent = this;
	this.text.setTransform(2,2);
	if(!lib.properties.webfonts['Julius Sans One']) {
		lib.webFontTxtInst['Julius Sans One'] = lib.webFontTxtInst['Julius Sans One'] || [];
		lib.webFontTxtInst['Julius Sans One'].push(this.text);
	}

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,265.7,58.6);


(lib.dollar_bill = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AhXAYQgjgQADgPQACgPAkgJQAggIAxAAQAyAAAgAIQAjAJADAPQADAPgjAQQglAQgzAAQgxAAgmgQg");
	this.shape.setTransform(64.9,27.4);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("Ak6CuQibgliIhIIgngUIAYglQA6hYA2hfIAUgjIAjAVQBqA+B1AhQB0AgB2AAQB1AAB0ggQByghBog+IAjgVIAUAjQA5BlA2BSIAYAkIgmAVQiEBIiZAlQiaAmijAAQikAAibgmgApLAeQCFBGCaAkQCVAjCcAAQCcAACUgjQCXgkCAhGQg4hWg5hjQhtBDh4AhQh3Aih7AAQh6AAh5giQh7ghhvhDQg5Bjg5BWg");
	this.shape_1.setTransform(64.5,21.2);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#349276").s().p("Ak1CXQiagkiFhHIgTgKIALgTQA5hUA4hkIAKgRIARAKQBtBAB3AhQB3AiB4AAQB5AAB2giQB1ghBqhAIARgLIAKASQA4BjA4BVIAMASIgTALQiBBHiXAkQiXAliiAAQigAAiZglg");
	this.shape_2.setTransform(64.5,21.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,129,42.3);


(lib.coin2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AhNBDIAMgEQAngDAmgIQAhgFApgKIhJgWIgfAGIg6AJQgbAEgdABQgXABgegDQgYgCgdgJQgngMAHgSQAJgTA6gVIg+gTIAugOIA+ATIBAgPQAqgJAYgDIBMAXIgMAEQgeACgfAFQggAGgfAIIBEAUIAYgFQBKgPAzgBQA2gBApAMQAtAOgGAUQgGAVg6AUIBIAVIgvAOIhGgVQgbAIgxALQgwAKgfADgABlgBIgmAEIBCAUQAPgGAFgGQAFgGgQgFQgLgCgOAAIgMABgAiYgRQgGAHAOAEQAMAEAQgBQAQAAAhgHIg+gTQgRAGgGAGg");
	this.shape.setTransform(56.9,16.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F2AD38").s().p("AmSB5QingzAAhGQAAhFCngzQCngyDrAAQDsAACnAyQCnAzAABFQAABGinAzQinAxjsAAQjrAAingxg");
	this.shape_1.setTransform(57,17.1);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AhwB8IAAkHIDhAAIAAEWQh2AAhrgPg");
	this.shape_2.setTransform(44.3,33.1);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AgRBsIAAjfIAjAAIAADng");
	this.shape_3.setTransform(23.9,32.7);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFFFFF").s().p("AgjBjIAAjfIBHAAIAAD6QgngNgggOg");
	this.shape_4.setTransform(13.3,29.6);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#F2AD38").s().p("AmSBkQingyAAhFIAAiCIRzAAIAACCQAABFinAyQinAyjsAAQjrAAingyg");
	this.shape_5.setTransform(57,32.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = getMCSymbolPrototype(lib.coin2, new cjs.Rectangle(0,0,114,47.1), null);


(lib.coin = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AgoGiIAAh3Qg0gBhBgMQhDgKgmgTIAAiFIAVAAQAsAYA0ANQA3AOA0ADIAAh7IgsgKQgrgLghgMQgkgNgZgUQgagVgOgeQgOggAAgsQAAhDA+gxQA+gwBtgJIAAhqIBOAAIAABpQAqABA4AKQA2AKAiAOIAACCIgUAAQghgSgqgMQgqgNgxgDIAAB0IAlAHQBnAUAvAoQAxAoAABIQAABOhBA2QhBA4hqAGIAAB6gAAkCxQAfgFAVgNQAVgOAAgZQAAgagYgNQgXgNgagEgAhWiyQgYANAAAYQAAAUAPANQARALAtAKIAAhqQgdACgYANg");
	this.shape.setTransform(57.9,57.3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F2AD38").s().p("AmSGTQinimAAjtQAAjrCninQCninDrAAQDsAACnCnQCnCnAADrQAADsinCnQinCnjsAAQjrAAining");
	this.shape_1.setTransform(57,57);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = getMCSymbolPrototype(lib.coin, new cjs.Rectangle(0,0,114,114), null);


(lib.closingcosts = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.text = new cjs.Text("CLOSTING COSTS", "normal 400 50px 'Julius Sans One'", "#333333");
	this.text.textAlign = "center";
	this.text.lineHeight = 57;
	this.text.lineWidth = 458;
	this.text.parent = this;
	this.text.setTransform(231.2,2);
	if(!lib.properties.webfonts['Julius Sans One']) {
		lib.webFontTxtInst['Julius Sans One'] = lib.webFontTxtInst['Julius Sans One'] || [];
		lib.webFontTxtInst['Julius Sans One'].push(this.text);
	}

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,462.4,72);


(lib.closing_lines3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#999999").s().p("AmoAcIAAg3INRAAIAAA3g");
	this.shape.setTransform(221.8,7.7,0.66,2.73);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("AkbAcIAAg3II3AAIAAA3g");
	this.shape_1.setTransform(48.2,38.7,1.7,2.73);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#999999").s().p("AmoAcIAAg3INRAAIAAA3g");
	this.shape_2.setTransform(90.4,7.7,2.127,2.73);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,249.9,46.4);


(lib.closing_lines2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#999999").s().p("AmoAcIAAg3INRAAIAAA3g");
	this.shape.setTransform(200.6,7.7,1.705,2.73);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("AkbAcIAAg3II3AAIAAA3g");
	this.shape_1.setTransform(99,38.7,3.489,2.73);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#999999").s().p("AmoAcIAAg3INRAAIAAA3g");
	this.shape_2.setTransform(56.9,7.7,1.338,2.73);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,273.1,46.4);


(lib.closing_lines1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#999999").s().p("AkbAcIAAg3II3AAIAAA3g");
	this.shape.setTransform(77.5,38.7,2.73,2.73);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("AmoAcIAAg3INRAAIAAA3g");
	this.shape_1.setTransform(116.1,7.7,2.73,2.73);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,232.2,46.4);


(lib.calendar = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#197EE3").s().p("AhyBvIAAjdIDlAAIAADdg");
	this.shape.setTransform(93,147.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#197EE3").s().p("AhyBvIAAjdIDlAAIAADdg");
	this.shape_1.setTransform(65.7,147.1);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#197EE3").s().p("AhxBvIAAjdIDjAAIAADdg");
	this.shape_2.setTransform(38.5,147.1);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#197EE3").s().p("AhyBvIAAjdIDlAAIAADdg");
	this.shape_3.setTransform(147.5,120.1);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#197EE3").s().p("AhxBvIAAjdIDjAAIAADdg");
	this.shape_4.setTransform(120.3,120.1);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#197EE3").s().p("AhyBvIAAjdIDlAAIAADdg");
	this.shape_5.setTransform(93,120.1);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#197EE3").s().p("AhyBvIAAjdIDlAAIAADdg");
	this.shape_6.setTransform(65.7,120.1);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#197EE3").s().p("AhxBvIAAjdIDjAAIAADdg");
	this.shape_7.setTransform(38.5,120.1);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#197EE3").s().p("AhyBvIAAjdIDlAAIAADdg");
	this.shape_8.setTransform(147.5,93.1);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#197EE3").s().p("AhxBvIAAjdIDjAAIAADdg");
	this.shape_9.setTransform(120.3,93.1);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#197EE3").s().p("AhyBvIAAjdIDlAAIAADdg");
	this.shape_10.setTransform(93,93.1);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#197EE3").s().p("AhyBvIAAjdIDlAAIAADdg");
	this.shape_11.setTransform(65.7,93.1);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#197EE3").s().p("AhxBvIAAjdIDjAAIAADdg");
	this.shape_12.setTransform(38.5,93.1);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#197EE3").s().p("AhFDZQgegdAAgpIAAklQAAgpAegdQAdgeAoAAQApAAAdAeQAeAdAAApIAAElQAAApgeAdQgdAegpAAQgoAAgdgeg");
	this.shape_13.setTransform(48,24.7);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#FFFFFF").s().p("AhbBcQgmgnAAg1QAAg1AmgmQAmgmA1AAQA1AAAnAmQAmAmAAA1QAAA1gmAnQgnAmg1AAQg1AAgmgmg");
	this.shape_14.setTransform(48,42.4);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#197EE3").s().p("AhFDZQgegdAAgpIAAklQAAgpAegdQAdgeAoAAQApAAAdAeQAeAdAAApIAAElQAAApgeAdQgdAegpAAQgoAAgdgeg");
	this.shape_15.setTransform(138,24.7);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#FFFFFF").s().p("AhbBcQgmgnAAg1QAAg1AmgmQAmgmA1AAQA1AAAnAmQAmAmAAA1QAAA1gmAnQgnAmg1AAQg1AAgmgmg");
	this.shape_16.setTransform(138,42.4);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#FFFFFF").s().p("ArLIDQgSAAgNgNQgNgNAAgSIAAuuQAAgSANgMQANgNASAAIWXAAQASAAANANQANAMAAASIAAOuQAAASgNANQgNANgSAAg");
	this.shape_17.setTransform(93,120.2);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#197EE3").s().p("AspMvQgxAAgjgjQgkgjAAgyIAA1tQAAgyAkgiQAjgkAxAAIZTAAQAxAAAkAkQAjAiAAAyIAAVtQAAAygjAjQgkAjgxAAg");
	this.shape_18.setTransform(93,105.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = getMCSymbolPrototype(lib.calendar, new cjs.Rectangle(0,0,186,187), null);


(lib.borrower = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.text = new cjs.Text("BORROWER", "normal 400 50px 'Julius Sans One'", "#333333");
	this.text.textAlign = "center";
	this.text.lineHeight = 57;
	this.text.lineWidth = 343;
	this.text.parent = this;
	this.text.setTransform(173.7,2);
	if(!lib.properties.webfonts['Julius Sans One']) {
		lib.webFontTxtInst['Julius Sans One'] = lib.webFontTxtInst['Julius Sans One'] || [];
		lib.webFontTxtInst['Julius Sans One'].push(this.text);
	}

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,347.4,64.8);


(lib.bank = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#197EE3").s().p("AgTDNIAAg6QgZAAghgGQgigHgRgIIAAhBIAKAAQAUALAbAHQAYAGAdADIAAg9IgWgFQgVgFgRgGQgRgGgMgKQgNgJgGgQQgIgPABgWQAAgiAegXQAegYA2gEIAAg0IAmAAIAAAzQAUABAbAFQAaAEASAHIAABBIgKAAQgPgKgVgGQgWgGgXgBIAAA4IASAEQAyAKAXAUQAZATAAAjQAAAlghAcQgfAbg0ADIAAA8gAASBXQAOgCALgHQALgGAAgNQgBgNgMgGQgNgHgKgBgAgqhXQgLAHAAALQgBALAIAGQAIAFAXAFIAAg0QgPABgMAGg");
	this.shape.setTransform(111,46.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#197EE3").s().p("AirGHIAAsNIFXAAIAAMNg");
	this.shape_1.setTransform(183.5,141.1);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#197EE3").s().p("AirGHIAAsNIFXAAIAAMNg");
	this.shape_2.setTransform(111.1,141.1);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#197EE3").s().p("AirGHIAAsNIFXAAIAAMNg");
	this.shape_3.setTransform(38.6,141.1);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#197EE3").s().p("AxWBHIAAiNMAitAAAIAACNg");
	this.shape_4.setTransform(111.1,201.4);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#197EE3").s().p("AvvBHIAAiNIffAAIAACNg");
	this.shape_5.setTransform(111.1,181.2);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#197EE3").s().p("AvvBHIAAiNIffAAIAACNg");
	this.shape_6.setTransform(111.1,100.3);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFFFF").s().p("ArhEBILhoBILiIBg");
	this.shape_7.setTransform(111.1,44.8);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#197EE3").s().p("AxWG3IAAhoIRWsFIRXMFIAABog");
	this.shape_8.setTransform(111.1,43.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = getMCSymbolPrototype(lib.bank, new cjs.Rectangle(0,0,222.2,208.5), null);


(lib._30yr_text = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AAvCNIhMhnIghAAIAABnIhIAAIAAkZIB5AAQAYAAASADQASADAQAJQAQAKAJAPQAJAPAAAXQAAAfgOATQgOATgbANIBdB5gAg+gMIAWAAQARAAAMgCQALgBAIgHQAHgFAEgHQADgIAAgLQAAgLgEgIQgEgHgLgEQgHgEgKAAIgWgBIgaAAg");
	this.shape.setTransform(108.4,26.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AgjCNIAAhqIhpivIBTAAIA7BtIA7htIBQAAIhoCsIAABtg");
	this.shape_1.setTransform(78.9,26.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("Ag1CJQgWgJgOgTQgOgTgGgbQgGgcgBgjQABgkAGgbQAHgbANgSQAOgTAXgJQAWgJAeAAQAggBAWAKQAWAJAOAUQAOASAGAbQAGAbAAAjQAAAjgGAcQgHAcgNASQgOASgWAKQgWAJggAAQgfAAgWgJgAgghIQgKAWAAAyQAAAyAKAXQAKAWAWgBQAXABAKgWQALgXAAgyQAAgygKgWQgLgWgXAAQgWAAgKAWg");
	this.shape_2.setTransform(41.5,26.9);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AhFCNQgagFgPgIIAAg9IAHAAQARAJAWAIQAXAHATAAIAXgBQAMgDAJgFQAHgFAEgHQAEgHABgNQAAgLgHgIQgFgGgKgDQgIgDgMAAIgZAAIgPAAIAAgyIAQAAIAagBQAKgBAIgDQAIgEAFgFQAEgHAAgLQAAgIgEgGQgFgFgGgDQgIgDgKgBIgQgBQgSAAgVAFQgUAHgUALIgHAAIAAg9QAPgGAbgGQAbgGAcABQAZgBAUAFQAUAFANAHQAPAJAIAOQAHANAAASQAAAXgOASQgOATgZAFIAAADQAKABALAEQALADAJAIQAJAIAFAKQAGALAAARQAAAUgIARQgIARgQANQgQALgVAHQgVAGgfAAQgiAAgZgFg");
	this.shape_3.setTransform(15.9,26.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,121.7,51.1);


(lib._30yr_box = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#EE6726").s().p("AspKjQgyAAgigjQgkgjAAgyIAAxVQAAgyAkgiQAigkAyAAIZTAAQAxAAAkAkQAjAiAAAyIAARVQAAAygjAjQgkAjgxAAg");
	this.shape.setTransform(93,67.5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,186,135);


(lib.Symbol = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#F2AD38").s().p("AD2G0QhMhRAAiiQAAilBOhPQBOhPCUAAQCXAABKBPQBMBPAACjQAACmhNBQQhNBRiTAAQiYAAhMhSgAGHAwQgYAlAABsQAABsAYAlQAZAmA4AAQA5AAAYgmQAZglAAhtQAAhrgZglQgYgmg5AAQg4AAgZAmgAlcHxIIJviICzAAIoIPigAq6AyQhMhQAAiiQAAilBOhQQBPhQCUAAQCWAABLBQQBMBPAACjQAACnhNBPQhNBQiTAAQiYAAhNhRgAoolSQgYAlAABtQAABsAYAlQAZAmA4AAQA4AAAZgmQAZglAAhtQAAhsgZglQgZglg4AAQg4AAgZAlg");
	this.shape.setTransform(77.5,51.8);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.Symbol, new cjs.Rectangle(0,0,155,103.6), null);


(lib.disclosures_page3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.disclosures_page03();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.disclosures_page3, new cjs.Rectangle(0,0,768,1020), null);


(lib.disclosures_page2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.disclosures_page02();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.disclosures_page2, new cjs.Rectangle(0,0,768,1020), null);


(lib.disclosures_page1_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.disclosures_page1();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.disclosures_page1_1, new cjs.Rectangle(0,0,768,1020), null);


(lib.coffee = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.coffeecup();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.coffee, new cjs.Rectangle(0,0,412,331), null);


(lib.cloud05 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.cloud14x8();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.cloud05, new cjs.Rectangle(0,0,335,87), null);


(lib.cloud04 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.cloud24x8();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.cloud04, new cjs.Rectangle(0,0,205,74), null);


(lib.cloud03 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.cloud44x8();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.cloud03, new cjs.Rectangle(0,0,174,74), null);


(lib.cloud02 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.cloud54x8();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.cloud02, new cjs.Rectangle(0,0,114,69), null);


(lib.cloud01 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.cloud34x8();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.cloud01, new cjs.Rectangle(0,0,251,92), null);


(lib.aptbldg_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.aptbldg();
	this.instance.parent = this;
	this.instance.setTransform(0,0,0.737,0.737);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,360.3,450.9);


(lib.anyquestion = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.text = new cjs.Text("ANY QUESTIONS", "70px 'Courgette'", "#FFFFFF");
	this.text.lineHeight = 90;
	this.text.lineWidth = 541;
	this.text.parent = this;
	this.text.setTransform(2,2);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,545.1,115.6);


(lib.mc_logo_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.logoClip = new lib.logo();
	this.logoClip.name = "logoClip";
	this.logoClip.parent = this;
	this.logoClip.setTransform(250,150,1,1,0,0,0,250,150);

	this.timeline.addTween(cjs.Tween.get(this.logoClip).wait(1));

}).prototype = getMCSymbolPrototype(lib.mc_logo_1, new cjs.Rectangle(0,0,500,300), null);


(lib.mc_image = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.imageClip = new lib._img();
	this.imageClip.name = "imageClip";
	this.imageClip.parent = this;
	this.imageClip.setTransform(60,60,1,1,0,0,0,60,60);

	this.timeline.addTween(cjs.Tween.get(this.imageClip).wait(1));

}).prototype = getMCSymbolPrototype(lib.mc_image, new cjs.Rectangle(0,0,243,300), null);


(lib.manila_envelope_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// customer
	this.instance = new lib.mc_customer();
	this.instance.parent = this;
	this.instance.setTransform(-986.6,-466.8,1.102,1.102,-1.2,0,0,44.5,12.3);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// logo
	this.instance_1 = new lib.mc_logo();
	this.instance_1.parent = this;
	this.instance_1.setTransform(-1246.5,-702.7,0.197,0.197,0,0,0,249.6,150.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AskFlQhuAAAAhuIAAntQAAhuBuAAIZJAAQBuAAAABuIAAHtQAABuhuAAg");
	this.shape.setTransform(-1245.2,-702.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F8F5E7").s().p("AxWHcIAAu3MAitAAAIAAO3g");
	this.shape_1.setTransform(-982.7,-464.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_1
	this.instance_2 = new lib.manila_envelope();
	this.instance_2.parent = this;
	this.instance_2.setTransform(-1384,-783,1.006,1.006);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));

}).prototype = getMCSymbolPrototype(lib.manila_envelope_1, new cjs.Rectangle(-1384,-783,1184.5,798.4), null);


(lib.hand_money = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// bill
	this.instance = new lib.dollar_bill("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(166.7,-40.2,1,1,0,0,0,64.5,21.2);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(7).to({_off:false},0).to({y:21.2},6).wait(2));

	// Layer_3
	this.instance_1 = new lib.dollar_bill("synched",0);
	this.instance_1.parent = this;
	this.instance_1.setTransform(166.7,-24.8,1,1,0,0,0,64.5,21.2);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(4).to({_off:false},0).to({y:36.6},6).wait(5));

	// Layer_4
	this.instance_2 = new lib.dollar_bill("synched",0);
	this.instance_2.parent = this;
	this.instance_2.setTransform(166.7,-9.5,1,1,0,0,0,64.5,21.2);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1).to({_off:false},0).to({y:51.9},6).wait(8));

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#EE6726").s().p("AkglaIJQAAIAAKYIpfAdg");
	this.shape.setTransform(30.4,119.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#EE6726").s().p("ABsGFQg1gBhlgtQiHg8j9hEQhZgYiMgEQhygFiyAJIAAm2QAOgLBbAAQBwAAA2gLQAYgFB4gfQBTgXAugBQBXgBBQAdQBgAkAiAEQAoAFBGgDIBggFQCdgGBBALQB2AVABBPQACBDhpAuQhjAriFAAQhGgFgtAAQhUgChjAWQA9gCBdAVQB6AbAXADQBhAIBsghQBMgWBHgnQAkgTBbhBQBghFAigUQBUgxArgLQA8gPApAjQAhAdgWAuQgYAxhaBMIhSBCQg1AqhdBGQgmAdhaAyQiPBQg2AgQhhA6hHAAIgEAAgAHojcQC5hsArgGQAagFAZAKQAaALAKAVQg3ANhPAtQgnAWg1AjIhSA3QALg0gSgpgAGJkuIB0g5QA3gaAVgCQAUgDATAGQAUAGANAMQg7AYiQBMQgZgVgkgPg");
	this.shape_1.setTransform(162.5,110.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(15));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,71.6,258.1,82.9);


(lib.hand_key = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#EE6726").s().p("AjvDNQgfgcgJgyQgHgvAOgvQAPgvAfgZQCPh8A3hCIE3BoQiBBFiEBzQhKBDhgBmQgMACgKAAQgqAAgbgZg");
	this.shape.setTransform(63.3,134.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F2AD38").s().p("Ah8DJQgzhSAAh3QAAh2AzhSQAzhSBJAAQBKAAAzBSQAzBSAAB2QAAB4gzBRQgzBShKAAQhJAAgzhSgAhOihQglBCAABfQAABgAlBCQAjA9ArAAQAtAAAig9QAlhCAAhgQAAhfglhCQgig9gtAAQgrAAgjA9g");
	this.shape_1.setTransform(31.8,165.6);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#EE6726").s().p("Ao6I0QgVgugXgrIgSgiQgLgdgLguQgWhcAAhUIAFidICHi7QCLi8AXAAQBggeC2gvQCngsB7gpQAagIBphdIFgE3QgJASg0BAQgzA/gHAMQhGCEhRBWQhMBRhcAxQiBBEiDB1QhLBChgBmQg4AIgjgfQgfgbgJgyQgHgvAOgvQAPgxAfgYQCPh9A3hBQAYhbg0g9QAVAbhCgJQg8gJg5gXIi1DFIgIBeQgIBlAAAgIAWBzIAHAXQAGAbgHAcQgKAmgzAJIgRABQgqAAgTgqg");
	this.shape_2.setTransform(67.7,101.2);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#EE6726").s().p("AnAgaQCkiWDQjOIINGLQg5A5hQBKQihCVh1Bag");
	this.shape_3.setTransform(148.8,38.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(19));

	// key
	this.instance = new lib.key("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(31.8,190.3,1,1,-41.9,0,0,22.3,11.3);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(4).to({startPosition:0},0).to({regX:22.4,rotation:25.7},4,cjs.Ease.quadOut).to({regX:22.3,rotation:0},7,cjs.Ease.backOut).wait(4));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,193.7,249.6);


(lib.disclosures_breakdown = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_57
	this.instance = new lib.lender("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(560.7,651.5,1,1,0,0,0,133.7,32.4);
	this.instance.alpha = 0.102;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(222).to({_off:false},0).to({y:491.5,alpha:1},8,cjs.Ease.quadOut).to({_off:true},25).wait(27));

	// bank
	this.instance_1 = new lib.bank();
	this.instance_1.parent = this;
	this.instance_1.setTransform(560.7,350.1,0.3,0.3,-90,0,0,111.4,104.3);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(217).to({_off:false},0).to({regX:111.2,scaleX:0.72,scaleY:0.72,rotation:0,x:560.8},7,cjs.Ease.backOut).to({_off:true},31).wait(27));

	// Layer_56
	this.instance_2 = new lib.seller("synched",0);
	this.instance_2.parent = this;
	this.instance_2.setTransform(195.9,651.5,1,1,0,0,0,133.7,32.4);
	this.instance_2.alpha = 0.102;
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(219).to({_off:false},0).to({y:491.5,alpha:1},8,cjs.Ease.quadOut).to({_off:true},28).wait(27));

	// hand_key
	this.instance_3 = new lib.hand_key("synched",0,false);
	this.instance_3.parent = this;
	this.instance_3.setTransform(223.3,347.1,0.3,0.3,-90,0,0,108.5,122.8);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(214).to({_off:false},0).to({regX:108.2,scaleX:0.72,scaleY:0.72,rotation:0,startPosition:7},7,cjs.Ease.backOut).to({_off:true},34).wait(27));

	// Layer_55
	this.instance_4 = new lib.borrower("synched",0);
	this.instance_4.parent = this;
	this.instance_4.setTransform(-152.9,651.5,1,1,0,0,0,173.7,32.4);
	this.instance_4.alpha = 0.102;
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(216).to({_off:false},0).to({y:491.5,alpha:1},8,cjs.Ease.quadOut).to({_off:true},31).wait(27));

	// hand_money
	this.instance_5 = new lib.hand_money("single",0);
	this.instance_5.parent = this;
	this.instance_5.setTransform(-145.5,353.5,0.3,0.3,-90,0,0,129.1,77.3);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(211).to({_off:false},0).to({regY:77.4,scaleX:0.72,scaleY:0.72,rotation:0,mode:"synched",loop:false},7,cjs.Ease.backOut).to({_off:true},37).wait(27));

	// monthly principal
	this.instance_6 = new lib.monthly_principal("synched",0);
	this.instance_6.parent = this;
	this.instance_6.setTransform(881.5,135.3,1,1,0,0,0,172.8,57.6);
	this.instance_6.alpha = 0.102;
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(201).to({_off:false},0).to({x:721.5,alpha:1},9,cjs.Ease.quadOut).to({_off:true},45).wait(27));

	// calendar
	this.instance_7 = new lib.calendar();
	this.instance_7.parent = this;
	this.instance_7.setTransform(445.2,124.7,0.3,0.3,-90,0,0,93,93.8);
	this.instance_7._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(197).to({_off:false},0).to({regY:93.5,scaleX:0.87,scaleY:0.87,rotation:0},7,cjs.Ease.backOut).to({_off:true},51).wait(27));

	// interest
	this.instance_8 = new lib.interest("synched",0);
	this.instance_8.parent = this;
	this.instance_8.setTransform(841.5,-27.4,1,1,0,0,0,132.8,29.3);
	this.instance_8.alpha = 0.102;
	this.instance_8._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(195).to({_off:false},0).to({x:681.5,alpha:1},9,cjs.Ease.quadOut).to({_off:true},51).wait(27));

	// %
	this.instance_9 = new lib.Symbol();
	this.instance_9.parent = this;
	this.instance_9.setTransform(446.2,-24,0.3,0.3,-90,0,0,77.5,51.6);
	this.instance_9._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(191).to({_off:false},0).to({regY:51.7,scaleX:0.87,scaleY:0.87,rotation:0},7,cjs.Ease.backOut).to({_off:true},57).wait(27));

	// term
	this.instance_10 = new lib.term("synched",0);
	this.instance_10.parent = this;
	this.instance_10.setTransform(801.6,-143.9,1,1,0,0,0,92.9,32.8);
	this.instance_10.alpha = 0.102;
	this.instance_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(191).to({_off:false},0).to({x:641.6,alpha:1},9,cjs.Ease.quadOut).to({_off:true},55).wait(27));

	// 30yr_text
	this.instance_11 = new lib._30yr_text("synched",0);
	this.instance_11.parent = this;
	this.instance_11.setTransform(446.4,-83.7,0.871,0.871,0,0,0,60.9,25.5);
	this.instance_11._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(190).to({_off:false},0).to({y:-152.5},4,cjs.Ease.quadOut).to({_off:true},61).wait(27));

	// 30yr_box
	this.instance_12 = new lib._30yr_box("synched",0);
	this.instance_12.parent = this;
	this.instance_12.setTransform(445.8,-150.7,0.3,0.3,-90,0,0,93.2,67.5);
	this.instance_12._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(187).to({_off:false},0).to({regX:93,scaleX:0.87,scaleY:0.87,rotation:0,x:445.7},7,cjs.Ease.backOut).to({_off:true},61).wait(27));

	// vertical line
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#999999").ss(1,1,1).p("AAAkEIAAIJ");
	this.shape.setTransform(324.6,-2.4);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#999999").ss(1,1,1).p("AAASFMAAAgkJ");
	this.shape_1.setTransform(324.6,-2.4);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#999999").ss(1,1,1).p("AAAbUMAAAg2n");
	this.shape_2.setTransform(324.6,-2.3);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#999999").ss(1,1,1).p("EAAAAgpMAAAhBR");
	this.shape_3.setTransform(324.6,-2.3);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#999999").ss(1,1,1).p("EAAAAi/MAAAhF9");
	this.shape_4.setTransform(324.6,-2.3);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("#999999").ss(1,1,1).p("EAAAAjQMAAAhGf");
	this.shape_5.setTransform(324.6,-2.3);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("#999999").ss(1,1,1).p("EAAAAiVMAAAhEp");
	this.shape_6.setTransform(324.6,-2.3);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f().s("#999999").ss(1,1,1).p("EAAAAhHMAAAhCN");
	this.shape_7.setTransform(324.6,-2.3);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("#999999").ss(1,1,1).p("EAAAggfMAAABA/");
	this.shape_8.setTransform(324.6,-2.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},179).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_2}]},1).to({state:[{t:this.shape_3}]},1).to({state:[{t:this.shape_4}]},1).to({state:[{t:this.shape_5}]},1).to({state:[{t:this.shape_6}]},1).to({state:[{t:this.shape_7}]},1).to({state:[{t:this.shape_8}]},1).to({state:[]},68).wait(27));

	// total
	this.instance_13 = new lib.total("synched",0);
	this.instance_13.parent = this;
	this.instance_13.setTransform(155.1,360.1,1,1,0,0,0,145.7,32.8);
	this.instance_13.alpha = 0.102;
	this.instance_13._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(152).to({_off:false},0).to({y:193.7,alpha:1},9,cjs.Ease.quadOut).to({_off:true},94).wait(27));

	// Layer_43
	this.instance_14 = new lib.coin2();
	this.instance_14.parent = this;
	this.instance_14.setTransform(215.6,-50.9,1,1,0,0,0,57,23.6);
	this.instance_14._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(168).to({_off:false},0).to({y:29.1},5,cjs.Ease.bounceOut).to({_off:true},82).wait(27));

	// Layer_44
	this.instance_15 = new lib.coin2();
	this.instance_15.parent = this;
	this.instance_15.setTransform(215.6,-31.7,1,1,0,0,0,57,23.6);
	this.instance_15._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(166).to({_off:false},0).to({y:48.3},5,cjs.Ease.bounceOut).to({_off:true},84).wait(27));

	// Layer_45
	this.instance_16 = new lib.coin2();
	this.instance_16.parent = this;
	this.instance_16.setTransform(215.6,-12.5,1,1,0,0,0,57,23.6);
	this.instance_16._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(164).to({_off:false},0).to({y:67.5},5,cjs.Ease.bounceOut).to({_off:true},86).wait(27));

	// Layer_46
	this.instance_17 = new lib.coin2();
	this.instance_17.parent = this;
	this.instance_17.setTransform(215.6,6.7,1,1,0,0,0,57,23.6);
	this.instance_17._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(162).to({_off:false},0).to({y:86.7},5,cjs.Ease.bounceOut).to({_off:true},88).wait(27));

	// Layer_47
	this.instance_18 = new lib.coin2();
	this.instance_18.parent = this;
	this.instance_18.setTransform(215.6,25.9,1,1,0,0,0,57,23.6);
	this.instance_18._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(160).to({_off:false},0).to({y:105.9},5,cjs.Ease.bounceOut).to({_off:true},90).wait(27));

	// coin2
	this.instance_19 = new lib.coin2();
	this.instance_19.parent = this;
	this.instance_19.setTransform(215.6,45.1,1,1,0,0,0,57,23.6);
	this.instance_19._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(158).to({_off:false},0).to({y:125.1},5,cjs.Ease.bounceOut).to({_off:true},92).wait(27));

	// Layer_30
	this.instance_20 = new lib.coin2();
	this.instance_20.parent = this;
	this.instance_20.setTransform(90.8,-108.5,1,1,0,0,0,57,23.6);
	this.instance_20._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(168).to({_off:false},0).to({y:-28.5},5,cjs.Ease.bounceOut).to({_off:true},82).wait(27));

	// Layer_29
	this.instance_21 = new lib.coin2();
	this.instance_21.parent = this;
	this.instance_21.setTransform(90.8,-89.3,1,1,0,0,0,57,23.6);
	this.instance_21._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_21).wait(166).to({_off:false},0).to({y:-9.3},5,cjs.Ease.bounceOut).to({_off:true},84).wait(27));

	// Layer_28
	this.instance_22 = new lib.coin2();
	this.instance_22.parent = this;
	this.instance_22.setTransform(90.8,-70.1,1,1,0,0,0,57,23.6);
	this.instance_22._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_22).wait(164).to({_off:false},0).to({y:9.9},5,cjs.Ease.bounceOut).to({_off:true},86).wait(27));

	// Layer_27
	this.instance_23 = new lib.coin2();
	this.instance_23.parent = this;
	this.instance_23.setTransform(90.8,-50.9,1,1,0,0,0,57,23.6);
	this.instance_23._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_23).wait(162).to({_off:false},0).to({y:29.1},5,cjs.Ease.bounceOut).to({_off:true},88).wait(27));

	// Layer_26
	this.instance_24 = new lib.coin2();
	this.instance_24.parent = this;
	this.instance_24.setTransform(90.8,-31.7,1,1,0,0,0,57,23.6);
	this.instance_24._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_24).wait(160).to({_off:false},0).to({y:48.3},5,cjs.Ease.bounceOut).to({_off:true},90).wait(27));

	// Layer_25
	this.instance_25 = new lib.coin2();
	this.instance_25.parent = this;
	this.instance_25.setTransform(90.8,-12.5,1,1,0,0,0,57,23.6);
	this.instance_25._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_25).wait(158).to({_off:false},0).to({y:67.5},5,cjs.Ease.bounceOut).to({_off:true},92).wait(27));

	// Layer_24
	this.instance_26 = new lib.coin2();
	this.instance_26.parent = this;
	this.instance_26.setTransform(90.8,6.7,1,1,0,0,0,57,23.6);
	this.instance_26._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_26).wait(156).to({_off:false},0).to({y:86.7},5,cjs.Ease.bounceOut).to({_off:true},94).wait(27));

	// Layer_23
	this.instance_27 = new lib.coin2();
	this.instance_27.parent = this;
	this.instance_27.setTransform(90.8,25.9,1,1,0,0,0,57,23.6);
	this.instance_27._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_27).wait(154).to({_off:false},0).to({y:105.9},5,cjs.Ease.bounceOut).to({_off:true},96).wait(27));

	// coin2
	this.instance_28 = new lib.coin2();
	this.instance_28.parent = this;
	this.instance_28.setTransform(90.8,45.1,1,1,0,0,0,57,23.6);
	this.instance_28._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_28).wait(152).to({_off:false},0).to({y:125.1},5,cjs.Ease.bounceOut).to({_off:true},98).wait(27));

	// Layer_40
	this.instance_29 = new lib.coin2();
	this.instance_29.parent = this;
	this.instance_29.setTransform(167.6,-166.1,1,1,0,0,0,57,23.6);
	this.instance_29._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_29).wait(170).to({_off:false},0).to({y:-86.1},5,cjs.Ease.bounceOut).to({_off:true},80).wait(27));

	// Layer_31
	this.instance_30 = new lib.coin2();
	this.instance_30.parent = this;
	this.instance_30.setTransform(167.6,-146.9,1,1,0,0,0,57,23.6);
	this.instance_30._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_30).wait(168).to({_off:false},0).to({y:-66.9},5,cjs.Ease.bounceOut).to({_off:true},82).wait(27));

	// Layer_32
	this.instance_31 = new lib.coin2();
	this.instance_31.parent = this;
	this.instance_31.setTransform(167.6,-127.7,1,1,0,0,0,57,23.6);
	this.instance_31._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_31).wait(166).to({_off:false},0).to({y:-47.7},5,cjs.Ease.bounceOut).to({_off:true},84).wait(27));

	// Layer_33
	this.instance_32 = new lib.coin2();
	this.instance_32.parent = this;
	this.instance_32.setTransform(167.6,-108.5,1,1,0,0,0,57,23.6);
	this.instance_32._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_32).wait(164).to({_off:false},0).to({y:-28.5},5,cjs.Ease.bounceOut).to({_off:true},86).wait(27));

	// Layer_34
	this.instance_33 = new lib.coin2();
	this.instance_33.parent = this;
	this.instance_33.setTransform(167.6,-89.3,1,1,0,0,0,57,23.6);
	this.instance_33._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_33).wait(162).to({_off:false},0).to({y:-9.3},5,cjs.Ease.bounceOut).to({_off:true},88).wait(27));

	// Layer_35
	this.instance_34 = new lib.coin2();
	this.instance_34.parent = this;
	this.instance_34.setTransform(167.6,-70.1,1,1,0,0,0,57,23.6);
	this.instance_34._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_34).wait(160).to({_off:false},0).to({y:9.9},5,cjs.Ease.bounceOut).to({_off:true},90).wait(27));

	// Layer_36
	this.instance_35 = new lib.coin2();
	this.instance_35.parent = this;
	this.instance_35.setTransform(167.6,-50.9,1,1,0,0,0,57,23.6);
	this.instance_35._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_35).wait(158).to({_off:false},0).to({y:29.1},5,cjs.Ease.bounceOut).to({_off:true},92).wait(27));

	// Layer_37
	this.instance_36 = new lib.coin2();
	this.instance_36.parent = this;
	this.instance_36.setTransform(167.6,-31.7,1,1,0,0,0,57,23.6);
	this.instance_36._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_36).wait(156).to({_off:false},0).to({y:48.3},5,cjs.Ease.bounceOut).to({_off:true},94).wait(27));

	// Layer_38
	this.instance_37 = new lib.coin2();
	this.instance_37.parent = this;
	this.instance_37.setTransform(167.6,-12.5,1,1,0,0,0,57,23.6);
	this.instance_37._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_37).wait(154).to({_off:false},0).to({y:67.5},5,cjs.Ease.bounceOut).to({_off:true},96).wait(27));

	// coin2
	this.instance_38 = new lib.coin2();
	this.instance_38.parent = this;
	this.instance_38.setTransform(167.6,6.7,1,1,0,0,0,57,23.6);
	this.instance_38._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_38).wait(152).to({_off:false},0).to({y:86.7},5,cjs.Ease.bounceOut).to({_off:true},98).wait(27));

	// vertical line
	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f().s("#999999").ss(1,1,1).p("AAAkEIAAIJ");
	this.shape_9.setTransform(-11.4,-2.4);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f().s("#999999").ss(1,1,1).p("AAASFMAAAgkJ");
	this.shape_10.setTransform(-11.4,-2.4);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f().s("#999999").ss(1,1,1).p("AAAbUMAAAg2n");
	this.shape_11.setTransform(-11.4,-2.3);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f().s("#999999").ss(1,1,1).p("EAAAAgpMAAAhBR");
	this.shape_12.setTransform(-11.4,-2.3);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f().s("#999999").ss(1,1,1).p("EAAAAi/MAAAhF9");
	this.shape_13.setTransform(-11.4,-2.3);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f().s("#999999").ss(1,1,1).p("EAAAAjQMAAAhGf");
	this.shape_14.setTransform(-11.4,-2.3);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f().s("#999999").ss(1,1,1).p("EAAAAiVMAAAhEp");
	this.shape_15.setTransform(-11.4,-2.3);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f().s("#999999").ss(1,1,1).p("EAAAAhHMAAAhCN");
	this.shape_16.setTransform(-11.4,-2.3);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f().s("#999999").ss(1,1,1).p("EAAAggfMAAABA/");
	this.shape_17.setTransform(-11.4,-2.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_9}]},144).to({state:[{t:this.shape_10}]},1).to({state:[{t:this.shape_11}]},1).to({state:[{t:this.shape_12}]},1).to({state:[{t:this.shape_13}]},1).to({state:[{t:this.shape_14}]},1).to({state:[{t:this.shape_15}]},1).to({state:[{t:this.shape_16}]},1).to({state:[{t:this.shape_17}]},1).to({state:[]},103).wait(27));

	// line
	this.instance_39 = new lib.closing_lines3("synched",0);
	this.instance_39.parent = this;
	this.instance_39.setTransform(-239.7,158.5,1,1,0,0,0,124.9,23.2);
	this.instance_39.alpha = 0.102;
	this.instance_39._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_39).wait(138).to({_off:false},0).to({alpha:1},6).to({_off:true},111).wait(27));

	// line
	this.instance_40 = new lib.closing_lines2("synched",0);
	this.instance_40.parent = this;
	this.instance_40.setTransform(-228.1,35.3,1,1,0,0,0,136.6,23.2);
	this.instance_40.alpha = 0.102;
	this.instance_40._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_40).wait(135).to({_off:false},0).to({alpha:1},6).to({_off:true},114).wait(27));

	// line
	this.instance_41 = new lib.closing_lines1("synched",0);
	this.instance_41.parent = this;
	this.instance_41.setTransform(-248.6,-87.9,1,1,0,0,0,116.1,23.2);
	this.instance_41.alpha = 0.102;
	this.instance_41._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_41).wait(132).to({_off:false},0).to({alpha:1},6).to({_off:true},117).wait(27));

	// closingcosts
	this.instance_42 = new lib.closingcosts("synched",0);
	this.instance_42.parent = this;
	this.instance_42.setTransform(-285,-358.3,1,1,0,0,0,214.6,32.8);
	this.instance_42.alpha = 0.102;
	this.instance_42._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_42).wait(129).to({_off:false},0).to({y:-178.3,alpha:1},9,cjs.Ease.quadOut).to({_off:true},117).wait(27));

	// coin
	this.instance_43 = new lib.coin();
	this.instance_43.parent = this;
	this.instance_43.setTransform(-437.7,160.2,0.3,0.3,-90,0,0,57,57);
	this.instance_43._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_43).wait(135).to({_off:false},0).to({scaleX:0.78,scaleY:0.78,rotation:0},6,cjs.Ease.backOut).to({_off:true},114).wait(27));

	// coin
	this.instance_44 = new lib.coin();
	this.instance_44.parent = this;
	this.instance_44.setTransform(-437.7,36.2,0.3,0.3,-90,0,0,56.9,57);
	this.instance_44._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_44).wait(132).to({_off:false},0).to({regX:57,regY:57.1,scaleX:0.78,scaleY:0.78,rotation:0},6,cjs.Ease.backOut).to({_off:true},117).wait(27));

	// coin
	this.instance_45 = new lib.coin();
	this.instance_45.parent = this;
	this.instance_45.setTransform(-437.7,-87.9,0.3,0.3,-90,0,0,56.4,57.1);
	this.instance_45._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_45).wait(129).to({_off:false},0).to({regX:57,regY:57,scaleX:0.78,scaleY:0.78,rotation:0},6,cjs.Ease.backOut).to({_off:true},120).wait(27));

	// white bg
	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#FFFFFF").s().p("Ei5wCAEMAAAkAHMFzhAAAMAAAEAHg");
	this.shape_18.setTransform(181.7,145.7);
	this.shape_18._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape_18).wait(129).to({_off:false},0).to({_off:true},126).wait(27));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1007.2,-673.9,2377.9,1639.2);


(lib.clouds = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// cloud
	this.instance = new lib.cloud05();
	this.instance.parent = this;
	this.instance.setTransform(135.5,-303.5,1,1,0,0,0,167.5,43.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:46.6},71).wait(1));

	// cloud
	this.instance_1 = new lib.cloud03();
	this.instance_1.parent = this;
	this.instance_1.setTransform(518,-129,1,1,0,0,0,87,37);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({x:495.8},71).wait(1));

	// cloud
	this.instance_2 = new lib.cloud01();
	this.instance_2.parent = this;
	this.instance_2.setTransform(454.5,-254,1,1,0,0,0,125.5,46);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({x:398.9},71).wait(1));

	// cloud
	this.instance_3 = new lib.cloud02();
	this.instance_3.parent = this;
	this.instance_3.setTransform(171,-173.5,1,1,0,0,0,57,34.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({x:159.9},71).wait(1));

	// cloud
	this.instance_4 = new lib.cloud04();
	this.instance_4.parent = this;
	this.instance_4.setTransform(-467.5,-184.6,1,1,0,0,0,102.5,37);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({x:-511.9},71).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-570,-347,1175,255);


// stage content:
(lib.BPD2v1 = function(mode,startPosition,loop) {
if (loop == null) { loop = false; }	this.initialize(mode,startPosition,loop,{"As we move forward":46,"These disclosures":107,"closing costs":134,"total amount":154,"terms of your loan":209,"everybody involved":233,"Please let us know":258,"We will be here":294});

	// timeline functions:
	this.frame_0 = function() {
		var root = this;
		var infoItems = [];
		
		$.ajax({
			type: 'GET',
			url: 'data/info.json',
			dataType: 'json',
			success: function (json) {
				infoItems = json;
				console.log(infoItems);
				renderImages();
			},
			error: function() {
				console.log("error");
			}
		});
		
		function renderImages() {
			for(var i=0; i<infoItems.length; i++){
				var photoBitmap = new createjs.Bitmap('images/' + infoItems[i].photo);
				var logoBitmap = new createjs.Bitmap('logo/' + infoItems[i].logo);
				infoItems[i].photoBitmap = photoBitmap;
				infoItems[i].logoBitmap = logoBitmap;
			}
			
			root.mc_text.title.text = infoItems[0].name;
			root.mc_customer.title.text = infoItems[0].customer;
			root.mc_customer_copy.title.text = infoItems[0].customer+"'s";
			root.imageContainer.imageClip.addChild(infoItems[0].photoBitmap);
			root.logoContainer.logoClip.addChild(infoItems[0].logoBitmap);
		}
	}
	this.frame_35 = function() {
		playSound("BPD_Animation_Audio_02");
	}
	this.frame_319 = function() {
		var root = this;
		
		root.replay.addEventListener("click", replayAnimation);
		root.replay.cursor = "pointer";
		
		function replayAnimation() {
			root.gotoAndPlay(1);
		}
	}
	this.frame_348 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(35).call(this.frame_35).wait(284).call(this.frame_319).wait(29).call(this.frame_348).wait(3));

	// replay
	this.replay = new lib.replay_btn();
	this.replay.name = "replay";
	this.replay.parent = this;
	this.replay.setTransform(530.2,424.3);
	this.replay._off = true;
	new cjs.ButtonHelper(this.replay, 0, 1, 2, false, new lib.replay_btn(), 3);

	this.timeline.addTween(cjs.Tween.get(this.replay).wait(320).to({_off:false},0).wait(31));

	// Info
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#333333").s().p("AgbBAIAAh8IAQAAIAAATQAGgNAFgEQAEgFAGAAQAIAAAJAHIgFAUQgGgFgHAAQgFAAgEAEQgFAEgBAHQgDAMgBAOIAABAg");
	this.shape.setTransform(300.9,523.2);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#333333").s().p("AggAxQgOgRAAgfQAAgfAOgRQANgRAUAAQATAAANARQAOAQAAAfIAAAFIhMAAQACAVAIALQAJALAMAAQATAAAIgaIASADQgFAUgMAKQgMAKgQAAQgWAAgMgQgAgTglQgHAKgCAQIA5AAQgCgQgGgIQgIgMgMAAQgLAAgJAKg");
	this.shape_1.setTransform(291.3,523.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#333333").s().p("AgfAxQgNgRABggQgBggANgQQAOgQATAAQAQAAALAKQALAKADATIgRADQgDgMgFgGQgHgHgIAAQgMAAgIAMQgIALgBAYQAAAZAJALQAHAMAMAAQAKAAAHgIQAGgHACgQIASACQgDAXgMALQgMAMgRAAQgSAAgOgQg");
	this.shape_2.setTransform(281.2,523.3);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#333333").s().p("AgHBWIAAh7IAQAAIAAB7gAgHg9IAAgYIAQAAIAAAYg");
	this.shape_3.setTransform(273.8,521);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#333333").s().p("AgOBXIAAhrIgPAAIAAgQIAPAAIAAgNQAAgPAEgHQADgIAGgEQAFgDAKAAQAHAAAJACIgCASIgLgBQgHAAgEAEQgDAEAAALIAAAMIATAAIAAAQIgTAAIAABrg");
	this.shape_4.setTransform(269.4,520.8);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#333333").s().p("AgNBXIAAhrIgQAAIAAgQIAQAAIAAgNQAAgPACgHQADgIAHgEQAFgDAKAAQAHAAAJACIgDASIgKgBQgHAAgEAEQgDAEAAALIAAAMIAUAAIAAAQIgUAAIAABrg");
	this.shape_5.setTransform(264,520.8);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#333333").s().p("AgxA+QgRgZAAgjQAAgqATgYQATgYAcAAQATAAAPAKQAQALAJAVQAIATAAAbQAAAmgRAZQgTAagfAAQgeAAgTgbgAghgzQgOASAAAjQAAAgAOASQAOARATABQAUgBAOgRQAOgSAAgiQAAgVgHgSQgFgNgLgJQgMgIgNAAQgUAAgNASg");
	this.shape_6.setTransform(253.2,521);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#333333").s().p("AAYBAIAAhLQAAgOgCgGQgDgGgEgEQgFgDgHAAQgLAAgIAJQgHAJAAAXIAABDIgRAAIAAh8IAPAAIAAASQAGgKAIgFQAIgGAKAAQAIAAAHAEQAHADAEAFQAEAFACAJQACAIAAARIAABMg");
	this.shape_7.setTransform(234.5,523.2);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#333333").s().p("AgkA3QgKgJAAgQQAAgLAEgJQAEgIAIgEQAIgEAQgCQAUgEAKgEIAAgFQAAgNgFgFQgGgIgNAAQgMAAgFAFQgHAFgCAOIgRgDQADgUAMgJQAKgJAUAAQAQAAAKAGQAIAGADAJQACAJAAARIAAAbQAAAeACAHQAAAIAEAHIgTAAQgCgGgBgJQgJAJgJAEQgIAFgLAAQgPAAgJgKgAgEAIQgKACgEACQgFACgCAFQgDAEAAAGQAAAJAFAFQAGAGAKAAQAIAAAIgFQAHgFAEgIQAEgIAAgPIAAgIQgJAEgTAEg");
	this.shape_8.setTransform(223.5,523.3);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#333333").s().p("AghAxQgOgRAAggQAAgfAOgRQANgQAUAAQAUAAAOAQQAOARAAAfQAAAggOARQgNAQgVAAQgUAAgNgQgAgUgjQgJAMAAAXQAAAYAJAMQAIAMAMAAQAMAAAKgMQAIgMAAgYQAAgXgIgMQgKgMgMAAQgMAAgIAMg");
	this.shape_9.setTransform(212.6,523.3);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#333333").s().p("AgrBWIAAirIASAAIAACWIBFAAIAAAVg");
	this.shape_10.setTransform(202,521);

	this.mc_text = new lib.mc_text();
	this.mc_text.name = "mc_text";
	this.mc_text.parent = this;
	this.mc_text.setTransform(201.7,489,1,1,0,0,0,70.5,12.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.mc_text},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]},320).wait(31));

	// Photo
	this.imageContainer = new lib.mc_image();
	this.imageContainer.name = "imageContainer";
	this.imageContainer.parent = this;
	this.imageContainer.setTransform(188.2,222.2,1,1,0,0,0,60,60);
	this.imageContainer._off = true;

	this.timeline.addTween(cjs.Tween.get(this.imageContainer).wait(320).to({_off:false},0).wait(31));

	// Logo
	this.logoContainer = new lib.mc_logo_1();
	this.logoContainer.name = "logoContainer";
	this.logoContainer.parent = this;
	this.logoContainer.setTransform(645.1,355,1,1,0,0,0,250,150);

	this.timeline.addTween(cjs.Tween.get(this.logoContainer).to({_off:true},35).wait(285).to({_off:false,regX:250.1,regY:150.2,scaleX:0.5,scaleY:0.5,x:530.2,y:308.2},0).wait(31));

	// disclosures page 1
	this.instance = new lib.disclosures_page1_1();
	this.instance.parent = this;
	this.instance.setTransform(1584.4,334.8,0.614,0.614,24.4,0,0,374.3,499.9);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(314).to({_off:false},0).to({regY:500,rotation:9.2,x:967.5,y:341.3},9,cjs.Ease.quadOut).wait(28));

	// disclosures page 2
	this.instance_1 = new lib.disclosures_page2();
	this.instance_1.parent = this;
	this.instance_1.setTransform(1578.6,363.3,0.614,0.614,25.3,0,0,374.2,500);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(314).to({_off:false},0).to({regX:374.3,regY:499.9,rotation:12.1,x:1002.5,y:375.5},9,cjs.Ease.quadOut).wait(28));

	// disclosures page 3
	this.instance_2 = new lib.disclosures_page3();
	this.instance_2.parent = this;
	this.instance_2.setTransform(1570.3,389,0.614,0.614,25.7,0,0,374.7,500.6);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(314).to({_off:false},0).to({regX:374.6,regY:500.4,rotation:8.8,x:1035.7,y:413.8},9,cjs.Ease.quadOut).wait(28));

	// white bg
	this.instance_3 = new lib.whitegradient("synched",0);
	this.instance_3.parent = this;
	this.instance_3.setTransform(640.1,361.1,1,1,0,0,0,640.1,361.1);
	this.instance_3.alpha = 0;
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(314).to({_off:false},0).to({alpha:1},5).to({_off:true},1).wait(31));

	// white bg
	this.instance_4 = new lib.whitegradient("synched",0);
	this.instance_4.parent = this;
	this.instance_4.setTransform(640.1,361.1,1,1,0,0,0,640.1,361.1);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(320).to({_off:false},0).wait(31));

	// any question
	this.instance_5 = new lib.anyquestion("synched",0);
	this.instance_5.parent = this;
	this.instance_5.setTransform(426.7,774.3,1,1,0,0,0,272.6,57.8);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(271).to({_off:false},0).to({y:422.3},10,cjs.Ease.quadOut).wait(19).to({startPosition:0},0).to({y:966.3},10,cjs.Ease.backIn).to({_off:true},1).wait(40));

	// if you have
	this.instance_6 = new lib.ifyouhave("synched",0);
	this.instance_6.parent = this;
	this.instance_6.setTransform(429,751.9,1,1,0,0,0,274.9,45);
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(265).to({_off:false},0).to({y:335.9},10,cjs.Ease.quadOut).wait(26).to({startPosition:0},0).to({y:879.9},10,cjs.Ease.backIn).to({_off:true},1).wait(39));

	// let us know
	this.instance_7 = new lib.letusknow("synched",0);
	this.instance_7.parent = this;
	this.instance_7.setTransform(429,774.3,1,1,0,0,0,274.9,45);
	this.instance_7._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(259).to({_off:false},0).to({y:262.3},10,cjs.Ease.quadOut).wait(33).to({startPosition:0},0).to({y:806.3},10,cjs.Ease.backIn).to({_off:true},1).wait(38));

	// question_bubble
	this.instance_8 = new lib.question_bubble("synched",0);
	this.instance_8.parent = this;
	this.instance_8.setTransform(902.6,360,0.2,0.2,-90,0,0,221.8,207.8);
	this.instance_8._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(255).to({_off:false},0).to({regX:221.7,regY:207.5,scaleX:0.82,scaleY:0.82,rotation:0,y:360.1},10,cjs.Ease.backOut).wait(34).to({startPosition:0},0).to({y:904.1},10,cjs.Ease.backIn).to({_off:true},1).wait(41));

	// mask (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_129 = new cjs.Graphics().p("Ehj/A4QMAAAhwfMDH/AAAMAAABwfg");
	var mask_graphics_244 = new cjs.Graphics().p("EhRUBRUUghrghrAAAgvpUAAAgvoAhrghsUAhsghrAvoAAAUAvpAAAAhrAhrUAhsAhsAAAAvoUAAAAvpghsAhrUghrAhsgvpAAAUgvoAAAghsghsg");
	var mask_graphics_245 = new cjs.Graphics().p("EhQiBQiUghXghWAAAgvMUAAAgvLAhXghXUAhYghXAvKAAAUAvMAAAAhWAhXUAhYAhXAAAAvLUAAAAvMghYAhWUghWAhYgvMAAAUgvKAAAghYghYg");
	var mask_graphics_246 = new cjs.Graphics().p("EhOOBOOUggYggZgABgt1UAABgtzAgYggbUAgbggYAtzAAAUAt1AAAAgZAgYUAgaAgbgABAtzUAABAt1ggaAgZUggZAgagt1gABUgtzAABggbggag");
	var mask_graphics_247 = new cjs.Graphics().p("EhKVBKWUgezgezAAAgrjUAAAgriAezgezUAezgezAriAAAUArkAAAAeyAezUAezAezAAAAriUAAAArjgezAezUgeyAezgrkAAAUgriAAAgezgezg");
	var mask_graphics_248 = new cjs.Graphics().p("EhE7BE8UgcjgckAAAgoYUAAAgoXAcjgckUAckgcjAoXAAAUAoYAAAAckAcjUAcjAckAAAAoXUAAAAoYgcjAckUgckAcjgoYAAAUgoXAAAgckgcjg");
	var mask_graphics_249 = new cjs.Graphics().p("Eg99A99UgZqgZqAAAgkTUAAAgkRAZqgZrUAZsgZrAkRAAAUAkTAAAAZqAZrUAZrAZrAAAAkRUAAAAkTgZrAZqUgZqAZrgkTAAAUgkRAAAgZsgZrg");
	var mask_graphics_250 = new cjs.Graphics().p("Eg1bA1dQ2J2KAA/TQAA/SWJ2KQWI2IfTAAQfTAAWKWIQWIWKAAfSQAAfT2IWKQ2KWI/TAAQ/TAA2I2Ig");
	var mask_graphics_251 = new cjs.Graphics().p("EgrYArYQx9x+AA5aQAA5ZR9x+QR/x+ZZAAQZaAAR+R+QR+R+AAZZQAAZax+R+Qx+R+5aAAQ5ZAAx/x+g");
	var mask_graphics_252 = new cjs.Graphics().p("A/wfxQtKtKAAynQAAylNKtKQNLtLSlAAQSnAANKNLQNKNKAASlQAASntKNKQtKNKynAAQylAAtLtKg");
	var mask_graphics_253 = new cjs.Graphics().p("AymSnQnsntAAq6QAAq4HsntQHunuK4AAQK5AAHuHuQHsHtABK4QgBK6nsHtQnuHsq5ABQq4gBnunsg");
	var mask_graphics_254 = new cjs.Graphics().p("Aj4D5QhnhnAAiSQAAiQBnhnQBnhoCRAAQCSAABnBoQBnBnAACQQAACShnBnQhnBniSAAQiRAAhnhng");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(129).to({graphics:mask_graphics_129,x:640,y:360}).wait(115).to({graphics:mask_graphics_244,x:640,y:360}).wait(1).to({graphics:mask_graphics_245,x:640,y:360}).wait(1).to({graphics:mask_graphics_246,x:640,y:360}).wait(1).to({graphics:mask_graphics_247,x:640,y:360}).wait(1).to({graphics:mask_graphics_248,x:640,y:360}).wait(1).to({graphics:mask_graphics_249,x:640,y:360}).wait(1).to({graphics:mask_graphics_250,x:640,y:360}).wait(1).to({graphics:mask_graphics_251,x:640,y:360}).wait(1).to({graphics:mask_graphics_252,x:640,y:360}).wait(1).to({graphics:mask_graphics_253,x:640,y:360}).wait(1).to({graphics:mask_graphics_254,x:640,y:360}).wait(1).to({graphics:null,x:0,y:0}).wait(96));

	// disclosures breakdown
	this.instance_9 = new lib.disclosures_breakdown("synched",129,false);
	this.instance_9.parent = this;
	this.instance_9.setTransform(1216.5,518.3,1,1,0,0,0,317.1,155.9);
	this.instance_9._off = true;

	var maskedShapeInstanceList = [this.instance_9];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(129).to({_off:false},0).wait(16).to({startPosition:145},0).to({x:992.5,startPosition:154},9,cjs.Ease.quadInOut).wait(26).to({startPosition:180},0).to({regX:317.2,scaleX:0.82,scaleY:0.82,x:762.2,y:492.7,startPosition:189},9,cjs.Ease.quadOut).wait(20).to({startPosition:209},0).to({regY:156,scaleX:0.77,scaleY:0.77,x:755.8,y:364.8,startPosition:218},9).to({_off:true},37).wait(96));

	// red bg
	this.instance_10 = new lib.red_bg("synched",0);
	this.instance_10.parent = this;
	this.instance_10.setTransform(640,360,1,1,0,0,0,640,360);
	this.instance_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(244).to({_off:false},0).wait(70).to({startPosition:0},0).to({alpha:0.102},5).to({_off:true},1).wait(31));

	// white bg
	this.instance_11 = new lib.white_bg();
	this.instance_11.parent = this;
	this.instance_11.setTransform(640,360,1,1,0,0,0,640,360);
	this.instance_11.alpha = 0.102;
	this.instance_11._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(121).to({_off:false},0).to({alpha:1},5).to({_off:true},3).wait(222));

	// magnifying lens
	this.instance_12 = new lib.magnifying_lens_1();
	this.instance_12.parent = this;
	this.instance_12.setTransform(-357.9,1460,0.353,0.353,-31.5,0,0,-269.9,2202.5);
	this.instance_12._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(107).to({_off:false},0).to({regY:2202.3,rotation:0,x:203.3,y:878.9},8,cjs.Ease.quadOut).to({regX:-270,scaleX:1.95,scaleY:1.95,x:-2706.1,y:3628.3},11,cjs.Ease.quadIn).to({_off:true},1).wait(224));

	// mask (mask)
	var mask_1 = new cjs.Shape();
	mask_1._off = true;
	var mask_1_graphics_107 = new cjs.Graphics().p("AkyUAQoTiAkcnRQkdnQB/oRQCAoTHRkcQHQkdIRCAQITB/EcHQQEdHRh/ISQiAIRnREdQlBDFlgAAQidAAijgng");
	var mask_1_graphics_108 = new cjs.Graphics().p("AjqUIQoWhhk0m+Qk1m+BioVQBioWG+k0QG+k0IUBhQIWBiE0G+QE0G+hhIVQhiIVm+E0QlTDqmGAAQh5AAiAgXg");
	var mask_1_graphics_109 = new cjs.Graphics().p("AisUQQoZhIlImuQlJmuBHoYQBIoYGvlJQGulJIXBIQIYBHFJGuQFJGvhHIXQhIIZmvFIQlhEOmpAAQhbAAhggMg");
	var mask_1_graphics_110 = new cjs.Graphics().p("Ah3UWQobgylamgQlamhAxoaQAyobGhlaQGglaIaAxQIcAyFZGgQFaGhgxIaQgyIbmhFaQlsEvnKAAQhBAAhDgGg");
	var mask_1_graphics_111 = new cjs.Graphics().p("AhMUbQodgglpmVQlnmVAfodQAgodGVloQGWlpIcAgQIdAgFpGVQFnGWgfIcQggIdmVFoQl0FLnoAAQgqAAgsgCg");
	var mask_1_graphics_112 = new cjs.Graphics().p("AgqUfQofgSl0mNQlzmMASoeQASofGNlzQGNlzIdARQIfASFzGNQF0GMgSIeQgSIfmNF0Ql6FioAAAIgwgBg");
	var mask_1_graphics_113 = new cjs.Graphics().p("AgSUiQoggIl8mGQl7mHAIofQAIogGHl7QGGl7IfAHQIgAIF7GHQF8GHgIIeQgIIgmHF8Ql+FzoSAAIgVAAg");
	var mask_1_graphics_114 = new cjs.Graphics().p("AgEUjQoggCmAmCQmBmDACofQADohGCmBQGEl/IeACQIhABGAGDQGBGEgCIfQgDIgmCGBQmBF+odAAIgFgBg");
	var mask_1_graphics_115 = new cjs.Graphics().p("AuhOiQmCmBAAohQAAogGCmBQGBmCIgAAQIhAAGCGCQGBGBAAIgQAAIhmBGBQmCGCohAAQogAAmBmCg");
	var mask_1_graphics_116 = new cjs.Graphics().p("AvEPFQmQmPAAo2QAAo0GQmQQGQmRI0AAQI1AAGQGRQGQGQAAI0QAAI2mQGPQmQGRo1AAQo0AAmQmRg");
	var mask_1_graphics_117 = new cjs.Graphics().p("AwtQuQm7m7AApzQAApxG7m8QG8m7JxAAQJzAAG7G7QG7G8AAJxQAAJzm7G7Qm7G7pzAAQpxAAm8m7g");
	var mask_1_graphics_118 = new cjs.Graphics().p("AzbTcQoEoDAArZQAArXIEoFQIEoDLXAAQLZAAIDIDQIEIFAALXQAALZoEIDQoDIErZAAQrXAAoEoEg");
	var mask_1_graphics_119 = new cjs.Graphics().p("A3PXRQpqppAAtoQAAtmJqpqQJpppNmAAQNoAAJpJpQJoJqAANmQAANopoJpQppJotoAAQtmAApppog");
	var mask_1_graphics_120 = new cjs.Graphics().p("A8JcLQrrrrAAwgQAAweLrrsQLrrrQeAAQQgAALrLrQLqLsAAQeQAAQgrqLrQrrLrwgAAQweAArrrrg");
	var mask_1_graphics_121 = new cjs.Graphics().p("EgiJAiLQuKuKAA0BQAAz+OKuLQOLuKT+gBQUBABOKOKQOJOLAAT+QAAUBuJOKQuKOJ0BAAQz+AAuLuJg");
	var mask_1_graphics_122 = new cjs.Graphics().p("EgpPApQQxGxGAA4KQAA4IRGxHQRIxGYHAAQYLAARFRGQRGRHAAYIQAAYKxGRGQxFRG4LAAQ4HAAxIxGg");
	var mask_1_graphics_123 = new cjs.Graphics().p("EgxaAxbQ0f0fAA88QAA86Uf0hQUg0ec6AAQc9AAUfUeQUeUhAAc6QAAc80eUfQ0fUf89AAQ86AA0g0fg");
	var mask_1_graphics_124 = new cjs.Graphics().p("Eg6rA6tUgYVgYVAAAgiYUAAAgiVAYVgYWUAYWgYVAiVAAAUAiYAAAAYVAYVUAYUAYWAAAAiVUAAAAiYgYUAYVUgYVAYUgiYAAAUgiVAAAgYWgYUg");
	var mask_1_graphics_125 = new cjs.Graphics().p("EhFCBFEUgcngcoAAAgocUAAAgoZAcngcpUAcqgcoAoYAAAUAodAAAAcmAcoUAcnAcpAAAAoZUAAAAocgcnAcoUgcmAcmgodAAAUgoYAAAgcqgcmg");
	var mask_1_graphics_126 = new cjs.Graphics().p("EhQeBQgUghXghXAAAgvJUAAAgvGAhXghZUAhZghXAvFAAAUAvKAAAAhXAhXUAhVAhZAAAAvGUAAAAvJghVAhXUghXAhXgvKAAAUgvFAAAghZghXg");

	this.timeline.addTween(cjs.Tween.get(mask_1).to({graphics:null,x:0,y:0}).wait(107).to({graphics:mask_1_graphics_107,x:-152.6,y:637.5}).wait(1).to({graphics:mask_1_graphics_108,x:83.7,y:535.6}).wait(1).to({graphics:mask_1_graphics_109,x:285.3,y:457.6}).wait(1).to({graphics:mask_1_graphics_110,x:448.8,y:398.6}).wait(1).to({graphics:mask_1_graphics_111,x:582.3,y:355.4}).wait(1).to({graphics:mask_1_graphics_112,x:684.1,y:324.8}).wait(1).to({graphics:mask_1_graphics_113,x:754.4,y:303.6}).wait(1).to({graphics:mask_1_graphics_114,x:793,y:290.3}).wait(1).to({graphics:mask_1_graphics_115,x:808,y:284.8}).wait(1).to({graphics:mask_1_graphics_116,x:806.6,y:285.3}).wait(1).to({graphics:mask_1_graphics_117,x:802.5,y:286.6}).wait(1).to({graphics:mask_1_graphics_118,x:795.7,y:288.8}).wait(1).to({graphics:mask_1_graphics_119,x:786.1,y:292}).wait(1).to({graphics:mask_1_graphics_120,x:773.7,y:296}).wait(1).to({graphics:mask_1_graphics_121,x:758.6,y:300.9}).wait(1).to({graphics:mask_1_graphics_122,x:740.8,y:306.7}).wait(1).to({graphics:mask_1_graphics_123,x:720.2,y:313.4}).wait(1).to({graphics:mask_1_graphics_124,x:696.9,y:321}).wait(1).to({graphics:mask_1_graphics_125,x:670.9,y:329.5}).wait(1).to({graphics:mask_1_graphics_126,x:642.1,y:338.9}).wait(1).to({graphics:null,x:0,y:0}).wait(224));

	// tabletop zoom
	this.instance_13 = new lib.tabletop_zoom();
	this.instance_13.parent = this;
	this.instance_13.setTransform(622.2,359.8,1,1,0,0,0,755.2,424.8);
	this.instance_13._off = true;

	var maskedShapeInstanceList = [this.instance_13];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask_1;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(107).to({_off:false},0).wait(8).to({regX:755.1,regY:424.7,scaleX:2.59,scaleY:2.59,x:110,y:359.6},11,cjs.Ease.quadIn).to({_off:true},1).wait(224));

	// envelope
	this.instance_14 = new lib.manila_envelope_1();
	this.instance_14.parent = this;
	this.instance_14.setTransform(1719.6,978,1,1,-34.7);
	this.instance_14._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(39).to({_off:false},0).to({rotation:0,x:1630,y:862.8},10,cjs.Ease.backOut).wait(3).to({rotation:90,x:119.6,y:1876.6},20,cjs.Ease.backInOut).wait(4).to({y:2190.2},18,cjs.Ease.quadIn).to({_off:true},1).wait(256));

	// envelope flap
	this.instance_15 = new lib.manila_envelope_flap_1();
	this.instance_15.parent = this;
	this.instance_15.setTransform(613.9,517.5,1,0.066,0,0,0,267.9,58.6);
	this.instance_15._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(72).to({_off:false},0).to({scaleY:1,y:462.6},4,cjs.Ease.quadOut).to({y:776.2},18,cjs.Ease.quadIn).to({_off:true},1).wait(256));

	// disclosures page 1
	this.instance_16 = new lib.disclosures_page1_1();
	this.instance_16.parent = this;
	this.instance_16.setTransform(603.1,796.4,0.647,0.647,0,0,0,374.1,500);
	this.instance_16._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(76).to({_off:false},0).to({y:345.2},18,cjs.Ease.quadOut).to({regX:374.2,regY:499.9,scaleX:0.79,scaleY:0.79,x:600.4,y:342.3},4,cjs.Ease.quadOut).to({regX:374.3,regY:500,scaleX:0.61,scaleY:0.61,rotation:9.2,x:874.7,y:341.3},9,cjs.Ease.quadInOut).to({_off:true},20).wait(224));

	// disclosures page 2
	this.instance_17 = new lib.disclosures_page2();
	this.instance_17.parent = this;
	this.instance_17.setTransform(615.1,808.8,0.647,0.647,0,0,0,374.1,500);
	this.instance_17._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(76).to({_off:false},0).to({y:357.6},18,cjs.Ease.quadOut).to({regY:500.1,scaleX:0.79,scaleY:0.79,x:631.2,y:357.7},4,cjs.Ease.quadOut).to({regX:374.3,regY:499.9,scaleX:0.61,scaleY:0.61,rotation:12.1,x:909.7,y:375.5},9,cjs.Ease.quadInOut).to({_off:true},20).wait(224));

	// disclosures page 3
	this.instance_18 = new lib.disclosures_page3();
	this.instance_18.parent = this;
	this.instance_18.setTransform(626.9,821.9,0.647,0.647,0,0,0,374,500.1);
	this.instance_18._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(76).to({_off:false},0).to({y:370.7},18,cjs.Ease.quadOut).to({regX:374.1,regY:500.2,scaleX:0.79,scaleY:0.79,x:661.7,y:373.7},4,cjs.Ease.quadOut).to({regX:374.6,regY:500.4,scaleX:0.61,scaleY:0.61,rotation:8.8,x:942.9,y:413.8},9,cjs.Ease.quadInOut).to({_off:true},20).wait(224));

	// phone
	this.instance_19 = new lib.phone_1("synched",0);
	this.instance_19.parent = this;
	this.instance_19.setTransform(-189.5,764.9,0.674,0.674,-42.4,0,0,158,300.4);
	this.instance_19._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(94).to({_off:false},0).to({regX:158.2,regY:300.2,rotation:-10.2,x:415.4,y:490.9},10,cjs.Ease.quadOut).to({_off:true},23).wait(224));

	// pen
	this.instance_20 = new lib.pen_1("synched",0);
	this.instance_20.parent = this;
	this.instance_20.setTransform(1380.3,682.4,0.787,0.787,32.4,0,0,50.1,250.2);
	this.instance_20._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(94).to({_off:false},0).to({regY:250.1,rotation:14.2,x:1210.8,y:580},10,cjs.Ease.quadOut).to({_off:true},23).wait(224));

	// coffee
	this.instance_21 = new lib.coffee();
	this.instance_21.parent = this;
	this.instance_21.setTransform(-114,-122.5,1,1,0,0,0,206,165.5);
	this.instance_21._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_21).wait(94).to({_off:false},0).to({x:206,y:165.5},10,cjs.Ease.quadOut).to({_off:true},23).wait(224));

	// table
	this.instance_22 = new lib.table("synched",0);
	this.instance_22.parent = this;
	this.instance_22.setTransform(640.6,360,1,1,0,0,0,641.5,361.9);
	this.instance_22.alpha = 0.102;
	this.instance_22._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_22).wait(94).to({_off:false},0).to({alpha:1},6).to({_off:true},27).wait(187).to({_off:false},0).wait(37));

	// apt_bldg
	this.instance_23 = new lib.aptbldg_1("synched",0);
	this.instance_23.parent = this;
	this.instance_23.setTransform(396.7,292.3,1.171,1.171,0,0,0,180.2,225.5);
	this.instance_23._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_23).wait(35).to({_off:false},0).wait(44).to({startPosition:0},0).to({y:660.3},20,cjs.Ease.quadIn).to({_off:true},1).wait(251));

	// gambel oak
	this.instance_24 = new lib.gambleoak("synched",0);
	this.instance_24.parent = this;
	this.instance_24.setTransform(676,299.6,1.171,1.171,0,0,0,219.1,195.6);
	this.instance_24._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_24).wait(35).to({_off:false},0).wait(44).to({startPosition:0},0).to({y:635.6},20,cjs.Ease.quadIn).to({_off:true},1).wait(251));

	// bush
	this.instance_25 = new lib.japanesemaple_1("synched",0);
	this.instance_25.parent = this;
	this.instance_25.setTransform(1190.5,398.7,1.171,1.171,0,0,0,76.5,68.3);
	this.instance_25._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_25).wait(35).to({_off:false},0).wait(44).to({startPosition:0},0).to({y:830.7},20,cjs.Ease.quadIn).to({_off:true},1).wait(251));

	// trees
	this.instance_26 = new lib.redmaple_1("synched",0);
	this.instance_26.parent = this;
	this.instance_26.setTransform(948.8,257.2,1.171,1.171,0,0,0,136,121.4);
	this.instance_26._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_26).wait(35).to({_off:false},0).wait(44).to({startPosition:0},0).to({y:593.2},20,cjs.Ease.quadIn).to({_off:true},1).wait(251));

	// road
	this.instance_27 = new lib.road_1("synched",0);
	this.instance_27.parent = this;
	this.instance_27.setTransform(640,534.3,1.209,1.129,0,0,0,529.5,151.6);
	this.instance_27._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_27).wait(35).to({_off:false},0).wait(44).to({startPosition:0},0).to({y:902.3},20,cjs.Ease.quadIn).to({_off:true},1).wait(251));

	// grass
	this.instance_28 = new lib.grass("synched",0);
	this.instance_28.parent = this;
	this.instance_28.setTransform(639.9,541.7,1,1,0,0,0,640.1,180.6);
	this.instance_28._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_28).wait(35).to({_off:false},0).wait(44).to({startPosition:0},0).to({y:813.7},20,cjs.Ease.quadIn).to({_off:true},1).wait(251));

	// clouds
	this.instance_29 = new lib.clouds("synched",0);
	this.instance_29.parent = this;
	this.instance_29.setTransform(630.5,140.8,1,1,0,0,0,-4.8,-219.5);
	this.instance_29._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_29).wait(35).to({_off:false},0).wait(44).to({startPosition:44},0).to({y:268.8,startPosition:63},20,cjs.Ease.quadIn).to({_off:true},1).wait(251));

	// sky
	this.instance_30 = new lib.sky("synched",0);
	this.instance_30.parent = this;
	this.instance_30.setTransform(639.9,218.9,1,1,0,0,0,640.1,218.9);
	this.instance_30._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_30).wait(35).to({_off:false},0).to({_off:true},65).wait(251));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(1035.1,565,500,300);
// library properties:
lib.properties = {
	id: '037CEE78C4324093927C5B7B187768CA',
	width: 1280,
	height: 720,
	fps: 18,
	color: "#FFFFFF",
	opacity: 1.00,
	webfonts: {},
	manifest: [
		{src:"images/aptbldg.jpg", id:"aptbldg"},
		{src:"images/cloud14x8.png", id:"cloud14x8"},
		{src:"images/cloud24x8.png", id:"cloud24x8"},
		{src:"images/cloud34x8.png", id:"cloud34x8"},
		{src:"images/cloud44x8.png", id:"cloud44x8"},
		{src:"images/cloud54x8.png", id:"cloud54x8"},
		{src:"images/coffeecup.png", id:"coffeecup"},
		{src:"images/disclosures_page02.png", id:"disclosures_page02"},
		{src:"images/disclosures_page03.png", id:"disclosures_page03"},
		{src:"images/disclosures_page1.png", id:"disclosures_page1"},
		{src:"images/gambeloak.png", id:"gambeloak"},
		{src:"images/grassBitmap.png", id:"grassBitmap"},
		{src:"images/japanesemaple.png", id:"japanesemaple"},
		{src:"images/magnifying_lens.png", id:"magnifying_lens"},
		{src:"images/manila_envelope.png", id:"manila_envelope"},
		{src:"images/manila_envelope_flap.png", id:"manila_envelope_flap"},
		{src:"images/pen.png", id:"pen"},
		{src:"images/phone.png", id:"phone"},
		{src:"images/redmaple.png", id:"redmaple"},
		{src:"images/road.jpg", id:"road"},
		{src:"images/tabletop_scene.jpg", id:"tabletop_scene"},
		{src:"images/wood.jpg", id:"wood"},
		{src:"sounds/BPD_Animation_Audio_02.mp3", id:"BPD_Animation_Audio_02"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['037CEE78C4324093927C5B7B187768CA'] = {
	getStage: function() { return exportRoot.getStage(); },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}



})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;