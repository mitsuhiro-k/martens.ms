
lychee.define('website.entity.Gallery').tags({
	platform: 'css'
}).includes([
	'lychee.game.Entity'
]).exports(function(lychee, global) {

	var _wrapper = document.createElement('div');

	var _preloader = new lychee.Preloader({
		timeout: 20000
	});


	_wrapper.id = 'website-entity-Gallery';
	_wrapper.className = 'default';

	var _content = global.document.createElement('div');
	_content.id = 'website-entity-Gallery-content';

	var _description = global.document.createElement('div');
	_description.id = 'website-entity-Gallery-description';

	_wrapper.appendChild(_content);
	_wrapper.appendChild(_description);

	_wrapper.addEventListener('click', function() {
		_wrapper.className = 'default';
	}, this);

	global.document.body.appendChild(_wrapper);


	var _show = function(asset, map) {

		var description = typeof map.description === 'string' ? map.description : 'No Description';

		// 1. Cleanup
		for (var c = 0, l = _content.childNodes.length; c < l; c++) {
			_content.removeChild(_content.childNodes[c]);
		}

		// 2. Update
		_content.appendChild(asset);
		_description.innerHTML = description;

		// 3. Animation
		setTimeout(function() {
			_wrapper.className = 'active';
		}, 0);


		if (map.notification !== null) {
			map.notification.hide();
		}

	};


	var _listener = function(event) {

		_wrapper.className = 'default';

		var url = this.getAttribute('href');

		if (_preloader.get(url) === null) {

			var notification = new website.ui.Notification('Loading ' + url + ' ...');

			_preloader.load(url, {
				url: url,
				description: this.getAttribute('title'),
				notification: notification
			});

		} else {

			_show(_preloader.get(url), {
				url: url,
				description: this.getAttribute('title'),
				notification: null
			});

		}

		event.preventDefault();

		return false;

	};


	_preloader.bind('ready', function(assets, maps) {

		// Use the last one if multiple were loaded in parallel

		for (var url in assets) {

			var asset = assets[url];
			var map   = maps[url];

			if (asset instanceof Image) {
				_show(asset, map);
				break;
			}

		}

	}, this);


	var Class = function(data, scene) {

		var settings = lychee.extend({}, data);


		this.__element = settings.element || null;
		this.__items   = [];
		this.__parent  = null;
		this.__map     = settings.map || null;


		this.__deserialize(scene);

		lychee.game.Entity.call(this, settings);

		settings = null;

	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */

		__deserialize: function(scene) {

			if (
				this.__element !== null
				&& this.__element.dispatched !== true
			) {

				var elements = this.__element.childNodes;

				for (var e = 0, l = elements.length; e < l; e++) {

					if (elements[e].tagName === 'A') {
						this.__items.push(elements[e]);
					}

				}


				for (var i = 0, l = this.__items.length; i < l; i++) {
					this.__items[i].addEventListener('click', _listener, true);
				}


				this.__element.dispatched = true;

			}

		},



		/*
		 * PUBLIC API
		 */

		getCurrentMap: function() {
			return this.__map[this.getState()] || null;
		},

		getMap: function() {
			return this.__map;
		},

		getId: function() {
			return null;
		},

		getPosition: function() {
			return this.__position;
		},

		setPosition: function(position) {

			if (Object.prototype.toString.call(position) !== '[object Object]') {
				return false;
			}


			this.__position.x = typeof position.x === 'number' ? position.x : this.__position.x;
			this.__position.y = typeof position.y === 'number' ? position.y : this.__position.y;
			this.__position.z = typeof position.z === 'number' ? position.z : this.__position.z;


			if (this.__element !== null) {
//				this.__element.style.setProperty('top',  (this.__position.y - this.height / 2) + 'px');
//				this.__element.style.setProperty('left', (this.__position.x - this.width / 2)  + 'px');
			}


			return true;

		},

		setState: function(id) {

			id = typeof id === 'string' ? id : null;

			if (id !== null && this.__states[id] !== undefined) {

				this.__state = id;

				var map = this.getCurrentMap();
				if (map !== null) {

					this.width  = map.width;
					this.height = map.height;

//					if (this.__element !== null) {
//						this.__element.style.setProperty('width',  this.width  + 'px');
//						this.__element.style.setProperty('height', this.height + 'px');
//					}

//					this.setPosition({
//						x: map.x + this.width / 2,
//						y: map.y + this.height / 2
//					});

				}

				if (this.__element !== null) {
					this.__element.className = 'website-entity-Gallery ' + id;
				}

			}

		}

	};


	return Class;

});

