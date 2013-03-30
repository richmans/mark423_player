/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'mark423-player\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-play' : '&#x70;',
			'icon-pause' : '&#x72;',
			'icon-stop' : '&#x73;',
			'icon-backward' : '&#x3c;',
			'icon-forward' : '&#x3e;',
			'icon-first' : '&#x66;',
			'icon-last' : '&#x6c;',
			'icon-eject' : '&#x65;',
			'icon-volume-high' : '&#x2b;',
			'icon-volume-medium' : '&#x2c;',
			'icon-volume-low' : '&#x2d;',
			'icon-volume-mute' : '&#x2e;',
			'icon-volume-mute-2' : '&#x6d;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};