

window.Motail = (function() {

	function setup() {

		if(motail.historyEnabled) {
			History.Adapter.bind(window,'statechange',function(){ 
				_historyStateChanged();
			});
			_parseUrl();
		}

		$('[data-motail-open]').each( function(index) {
			var id = $(this).attr('data-motail-open');
			$(this).on('click touchend', function(event) {
				event.preventDefault();
				Motail.open(id);
			});
		});
		$('[data-motail-close]').each( function(index) {
			var id = $(this).attr('data-motail-open');
			$(this).on('click touchend', function(event) {
				event.preventDefault();
				Motail.close(_openedId);
			});
		});
	}

	function onReady() {
		
	}

	var 
		_storedScroll = 0,
		_storedHistoryState,
		_openedId,
		_openedHeight;

	function _parseUrl() {
		var index = window.location.search.indexOf(motail.urlIdentifier + "=");
		if (!index) return;
		var searchBegin = index + motail.urlIdentifier.length + 1;
		id = window.location.search.substring(searchBegin);
		if (!id) return;

		History.replaceState({motail_id: id}, document.title + " - " + id, "?" + motail.urlIdentifier + "=" + id);
		_open(id);
	}

	function _historyStateChanged () {
		var state = History.getState();
		var id = state.data.motail_id;
		console.log('new state: ', state);
		if(id && id != _openedId) {
			_open(id);
		} else if(_openedId) {
			_close();
		}
	}

	function _beforeOpen (id) {
		if(motail.historyEnabled) {
			History.pushState({motail_id:id}, document.title + " - " + id, "?" + motail.urlIdentifier + "=" + id); // logs {state:1}, "State 1", "?state=1"
			_storedHistoryState = History.getState();
		} else {
			_open (id);
		}
	}

	function _open (id) {

		// find targeted modal to open
		var $target = $('[data-motail-id=' + id + ']');
		// store page's scroll position
		_storedScroll = $(document).scrollTop();
		// add active-class to target modal
		$target.addClass('motail-opened');
		// calculate modal content height
		_openedHeight = $target.find('.motail-body').outerHeight();
		// set height of body 
		$('body').height(_openedHeight);
		// add opened-class to html element
		$('html').addClass('motail-opened');
		// scroll page to top
		$(document).scrollTop(0);
		// store id of opened modal
		_openedId = id;
	};

	function _beforeClose (id) {
		if(motail.historyEnabled && _storedHistoryState) {
			History.back();
			_storedHistoryState = false;
		} else if(motail.historyEnabled) {
			_close(id);
			console.log('close!');
			History.replaceState({motail_id: ""}, document.title, "?");
		} else {
			_close(id);
		}
	}

	function _close (id) {

		// if id is not set, use stored id of previously opened modal
		var targetId = id ? id : _openedId;
		// find targeted modal to close
		var $target = $('[data-motail-id=' + targetId + ']');
		// remove active-class from modal
		$target.removeClass('motail-opened');
		// remove active-class from html element
		$('html').removeClass('motail-opened');
		// remove height of body
		$('body').height('');
		// scroll page back to stored position after reflow
		setTimeout( function() {
			$(document).scrollTop(_storedScroll);
		}, 0);
		// clear stored id of opened modal
		_openedId = "";
	};

	var motail = {
		historyEnabled: true,
		urlIdentifier: "motail",
		open: _beforeOpen,
		close: _beforeClose
	};	

	setup();
	$(onReady);

	return motail;
})();

$(function() {


	

});