var name;
let input_name
let result;
let are;
var hash = location.hash.substr(1);
var userLang = navigator.language || navigator.userLanguage;
var userLang = userLang.split('-')[0];
var langs = ['en', 'es'];
var lang = 'en';
var translations = {};
if (langs.indexOf(userLang)> -1) lang = userLang;

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var canvas_dw = document.getElementById('download_img');
var context_dw = canvas_dw.getContext('2d');

loadJSON('lang/'+lang+'.json', function(res){
	if(res){
		res = JSON.parse(res);
		translations = res.lang;
		document.querySelectorAll('*[data-translate]').forEach(function(e){
			string = e.getAttribute('data-translate');
			e.innerHTML = __(string);
		});
	}
	else return false;
});

document.addEventListener("DOMContentLoaded", function(){
	input_name = document.querySelector('#name');
	result = document.querySelector('#result');
	are = document.querySelector('#are > select');

	if (hash.length > 0){
		if (hash.match(/^man|woman|child\-[A-Za-z]/ig)){
			hash = hash.split('-');
			document.querySelector('#are option[value='+hash[0]+']').setAttribute('selected', 'selected');
			input_name.value = hash[1];
			show_images();
		}
	}

	document.querySelector('#gen_img').addEventListener('click', function(){
		show_images();
	});

	document.querySelector('#download').addEventListener('click', function(e){
		this.href = canvas_dw.toDataURL('image/png');
	}, false);
});

function show_images(){
	context.canvas.height = 46;
	context_dw.canvas.height = 72;
	txt = input_name.value;
	txt = txt.toLowerCase();
	txt = txt.replace(/([^a-z]+)/gi, '-');
	images = [];
	posx = 0;
	posx_dw = 0;
	loadedimages=0;
	context.clearRect(0, 0, canvas.width, canvas.height);
	context_dw.clearRect(0, 0, canvas_dw.width, canvas_dw.height);

	for(i=0; i<txt.length; i++){
		n = i+1;
		letter = txt[i];
		imgObj = new Image();
		if(n <= txt.length){
			if(letter == 'k' && txt[n] == 'h'){
				img = 'images/kh.svg';
				i++;
			}else if(letter == 's' && txt[n] == 'h'){
				img = 'images/sh.svg';
				i++;
			}else{
				img = 'images/'+letter+'.svg';
			}
		}else{
			img = 'images/'+letter+'.svg';
		}
		imgObj.src = img;
		images.push(imgObj);
		imgObj.onload = function(){ draw() }
	}

	function draw(){
		loadedimages++;
		if (loadedimages === images.length){
			context.canvas.width = 46*images.length;
			context_dw.canvas.width = 72*images.length;
			images.forEach(function(img){
				context.drawImage(img, posx, 0, 46, 46);
				posx += 46;
				context_dw.drawImage(img, posx_dw, 0, 72, 72);
				posx_dw += 72;
			});
		}
	}
	
	location.hash = are.value+'-'+txt;
}

function __(string){
	// This function is used for translate the string passed
	return translations[string];
}

function loadJSON(url, callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    	xobj.open('GET', url, true);
    	xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);  
}

function share(id){
	share_urls = {
		fb: 'https://www.facebook.com/sharer.php?u='+encodeURIComponent(location.href),
		tw: 'http://twitter.com/intent/tweet?text='+__('title')+'&url='+encodeURIComponent(location.href),
		tg: 'https://telegram.me/share/url?url='+encodeURIComponent(location.href)+'&text='+__('title'),
		ws: 'whatsapp://send?text='+encodeURIComponent(location.href)
	}
	return share_urls[id];
}