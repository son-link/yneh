let input_name
let result;
let are;
let hash = location.hash.substr(1);
let userLang = navigator.language || navigator.userLanguage;
userLang = userLang.split('-')[0];
let langs = ['en', 'es'];
let lang = 'en';
let translations = {};
if (langs.indexOf(userLang)> -1) lang = userLang;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const canvas_dw = document.getElementById('download_img');
const context_dw = canvas_dw.getContext('2d');

/**
 * Loads the JSON containing the translations in the browser language
 * if it is not English, or if the translation is not available.
 */
loadJSON(`lang/${lang}.json`, function(res) {
	if (!!res) {
		translations = res.lang;

		document.querySelectorAll('*[data-translate]').forEach(function(e) {
			const string = e.getAttribute('data-translate');
			e.innerHTML = __(string);
		});
		
		document.querySelector('.icon-clipboard').setAttribute('title', __('clipboard'));
	}
	else return false;
});

document.addEventListener("DOMContentLoaded", function() {
	input_name = document.querySelector('#name');
	result = document.querySelector('#result');
	are = document.querySelector('#are > select');

	if (hash.length > 0) {
		if (hash.match(/^man|woman|child\-[A-Za-z]/ig)){
			hash = hash.split('-');
			document.querySelector(`#are option[value=${hash[0]}]`).setAttribute('selected', 'selected');
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

/**
 * Show the Hieroglyphics
 */
function show_images() {
	context.canvas.height = 46;
	context_dw.canvas.height = 72;
	let txt = input_name.value;
	txt = txt.toLowerCase();
	txt = txt.replace(/([^a-z]+)/gi, '-');
	let images = [];
	let posx = 0;
	let posx_dw = 0;
	let loadedimages = 0;
	context.clearRect(0, 0, canvas.width, canvas.height);
	context_dw.clearRect(0, 0, canvas_dw.width, canvas_dw.height);

	for (let i = 0; i < txt.length; i++) {
		n = i+1;
		letter = txt[i];
		imgObj = new Image();

		if (n <= txt.length) {
			if(letter == 'k' && txt[n] == 'h') {
				img = 'images/kh.svg';
				i++;
			} else if(letter == 's' && txt[n] == 'h') {
				img = 'images/sh.svg';
				i++;
			} else {
				img = 'images/'+letter+'.svg';
			}
		} else {
			img = 'images/'+letter+'.svg';
		}

		imgObj.src = img;
		images.push(imgObj);
		imgObj.onload = function(){ draw() }
	}

	if (are.value != 'none') {
		let imgObj = new Image();
		img = 'images/'+ are.value + '.svg';
		imgObj.src = img;
		images.push(imgObj);
		imgObj.onload = () => draw();
	}

	/**
	 * Draw the hieroglyphics
	 */
	function draw() {
		loadedimages++;

		if (loadedimages === images.length) {
			context.canvas.width = 46 * images.length;
			context_dw.canvas.width = 72 * images.length;

			images.forEach(function(img) {
				context.drawImage(img, posx, 0, 46, 46);
				posx += 46;
				context_dw.drawImage(img, posx_dw, 0, 72, 72);
				posx_dw += 72;
			});
		}
	}
	
	location.hash = `${are.value}-${txt}`;
}

/**
 * Return the translation
 * @param {String} string 
 * @returns String
 */
const __ = string => translations[string];

async function loadJSON(url, callback) {
	const resp = await fetch(url)
	if (resp.status != 200) return
	const data = await resp.json()
	if (!!data && typeof callback === 'function') callback(data);
}

function share(id) {
	share_urls = {
		fb: 'https://www.facebook.com/sharer.php?u='+encodeURIComponent(location.href),
		tw: 'http://twitter.com/intent/tweet?text='+__('title')+'&url='+encodeURIComponent(location.href),
		tg: 'https://telegram.me/share/url?url='+encodeURIComponent(location.href)+'&text='+__('title'),
		ws: 'whatsapp://send?text='+encodeURIComponent(location.href)
	}
	return share_urls[id];
}

function mastodonShare() {
    const url = encodeURIComponent(location.href);
    const instance = prompt(__('Enter your Mastodon domain'), 'mastodon.social');
	if (!!instance) window.open(`https://${instance}/share?text=${__('title')}+${input_name.value}+${url}`, '_blank');
}

function toClipboard() {
	navigator.clipboard.writeText(location.href);
	alert(__('URL copied to clipboard'));
}