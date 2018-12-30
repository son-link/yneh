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

	input_name.addEventListener('keyup', function(e){
		code = e.which;
		if (code != 16 || code != 17){
			var character = String.fromCharCode(code);
			if (code == 8 || code == 46 || character.match(/[A-Za-z]/g)){
				show_images();
			}else{
				return false;
			}
		}
	});

	are.addEventListener('change', function(){
		show_images();
	});
});

function show_images(){
	result.innerHTML = '';
	txt = input_name.value;
	txt = txt.toLowerCase();
	images = '';
	for(i=0; i<txt.length; i++){
		n = i+1;
		letter = txt[i];
		if(n <= txt.length){
			if(letter == 'k' && txt[n] == 'h'){
				images += '<img src="images/kh.svg" />';
				i++;
			}else if(letter == 's' && txt[n] == 'h'){
				images += '<img src="images/sh.svg" />';
				i++;
			}else{
				images += '<img src="images/'+letter+'.svg" />';
			}
		}else{
			images += '<img src="images/'+letter+'.svg" />';
		}
	}
	result.innerHTML = images;
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