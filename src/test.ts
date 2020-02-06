function Widget() {
	this.widget_status = ''
	this.currentSample = 0
	this.sample_status = 'default'
	this.samples = []
	this.isPlaying = !1
	this.elements = {
		widget: document.querySelector('#demo-widget'),
		select: document.querySelector('#demo-select'),
		text_before: document.querySelector('#demo-sample-text-before'),
		text_after: document.querySelector('#demo-sample-text-after'),
		input: document.querySelector('#demo-sample-input'),
		original: document.querySelector('#demo-sample-original'),
		hint: document.querySelector('#demo-hint'),
		play: document.querySelector('#demo-play'),
		restore: document.querySelector('#demo-restore'),
		audio: document.querySelector('#demo-audio')
	}
	this.setStatus = function(newStatus) {
		if (
			this.widget_status === 'error' &&
			newStatus !== 'default' &&
			newStatus !== 'modified'
		) {
			return
		}
		switch (newStatus) {
			case 'ready': {
				this.elements.widget.classList.remove('widget_' + this.widget_status)
				this.widget_status = newStatus
				this.elements.widget.classList.add('widget_' + this.widget_status)
				this.elements.hint.innerHTML =
					'Click into the outlined section to type a correction.'
				break
			}
			case 'playing': {
				this.isPlaying = !0
				this.elements.widget.classList.add('widget_playing')
				break
			}
			case 'paused': {
				this.isPlaying = !1
				this.elements.widget.classList.remove('widget_playing')
				break
			}
			case 'error': {
				this.elements.widget.classList.remove('widget_' + this.widget_status)
				this.widget_status = newStatus
				this.elements.widget.classList.add('widget_' + this.widget_status)
				this.elements.hint.style.display = 'block'
				this.elements.restore.style.display = 'none'
				this.elements.hint.innerHTML = 'Your browser isn’t supported.'
				break
			}
			case 'default': {
				this.sample_status = newStatus
				this.elements.widget.classList.remove('widget_modified')
				this.elements.widget.classList.add('widget_default')
				if (this.widget_status === 'error') {
					break
				}
				this.elements.hint.style.display = 'block'
				this.elements.restore.style.display = 'none'
				if (this.elements.input.value === '') {
					break
				}
				this.elements.hint.innerHTML =
					'Click into the outlined section to type a correction.'
				break
			}
			case 'modified': {
				this.sample_status = newStatus
				this.elements.widget.classList.remove('widget_default')
				this.elements.widget.classList.add('widget_modified')
				if (this.widget_status === 'error') {
					break
				}
				this.elements.hint.style.display = 'none'
				this.elements.restore.style.display = 'flex'
				break
			}
			default: {
				this.elements.widget.classList.remove('widget_' + this.widget_status)
				this.widget_status = newStatus
				this.elements.widget.classList.add('widget_' + this.widget_status)
				break
			}
		}
	}
	this.loadAudio = function(src, play) {
		this.isPlaying && this.setStatus('paused')
		var source = document.createElement('SOURCE')
		var types = { mp3: 'mpeg', ogg: 'ogg', wav: 'wav' }
		var type = types[src.match(/\w*\d*$/i)[0]]
		if (type === undefined) {
			console.error('Unsupported audio type')
			this.setStatus('ready')
		}
		source.type = 'audio/' + type
		source.src = src
		source.onerror = function() {
			console.error('Error while loading audio at ' + src)
		}
		this.elements.audio.innerHTML = ''
		this.elements.audio.appendChild(source)
		this.elements.audio.load()
		this.sample_status === 'modified' && this.setStatus('generated')
		play && this.elements.audio.play()
	}
	this.stopAudio = function() {
		this.elements.audio.currentTime = 0
		this.setStatus('paused')
	}
	this.errorAudio = function() {
		this.setStatus('error')
		console.error("Browser isn't supported")
	}
	this.createOption = function(id, text) {
		var option = document.createElement('option')
		option.value = id
		if (text.match(/woman\s/)) {
			option.insertAdjacentText(
				'beforeend',
				text.replace(/\bwoman\s/, 'Female Sample #')
			)
		} else if (text.match(/\bman\s/)) {
			option.insertAdjacentText(
				'beforeend',
				text.replace(/\bman\s/, 'Male Sample #')
			)
		}
		return option
	}
	this.restoreSample = function() {
		var inputEvent = document.createEvent('Event')
		inputEvent.initEvent('input', !1, !1)
		this.elements.input.value = this.elements.input.dataset.value
		this.elements.input.dispatchEvent(inputEvent)
		this.elements.input.style.minWidth = this.elements.input.style.width
		this.elements.original.innerHTML = ''
		this.setStatus('default')
		if (this.widget_status === 'error') {
			return
		}
		this.setStatus('ready')
		this.loadAudio(this.samples[this.currentSample].audio_url, !1)
	}
	this.selectSample = function(newSampleID) {
		this.currentSample = newSampleID
		this.elements.text_before.innerHTML = this.samples[
			this.currentSample
		].text_before
		this.samples[this.currentSample].text_after !== undefined
			? (this.elements.text_after.innerHTML = this.samples[
					this.currentSample
			  ].text_after)
			: (this.elements.text_after.innerHTML = '')
		this.elements.input.setAttribute(
			'data-value',
			this.samples[this.currentSample].text_to_change
		)
		this.restoreSample()
	}
	this.init = function() {
		var _this = this
		_this.setStatus('generating')
		var get = new XMLHttpRequest()
		get.withCredentials = !0
		get.open('GET', 'https://public.lyrebird.ai/api/public/sentences', !0)
		get.responseType = 'json'
		get.send()
		get.onload = function() {
			var response = get.response
			if (typeof response === 'string') {
				response = JSON.parse(response)
			}
			response.forEach(function(item) {
				var text = item.text.split(item.text_to_change).map(function(part) {
					if (part !== '') {
						return part.trim()
					}
				})
				_this.samples.push({
					speaker: item.speaker,
					text_before: text[0],
					text_after: text[1],
					text_to_change: item.text_to_change,
					sample_id: item.id,
					audio_url: item.audio_url
				})
				_this.elements.select.appendChild(
					_this.createOption(item.id, item.speaker)
				)
			})
			_this.selectSample(0)
			_this.restoreSample()
		}
		get.onerror = function() {
			console.error('Error while fetching sentences')
		}
	}
	this.inputChange = function() {
		this.widget_status === 'generated' && this.setStatus('ready')
		this.sample_status === 'default' && this.setStatus('modified')
		if (this.elements.input.value === '') {
			this.elements.input.style.width = '0'
			this.setStatus('default')
			return
		}
		var clone = document.createElement('pre')
		clone.id = 'pre-input'
		clone.innerHTML = this.elements.input.value
		this.elements.widget.appendChild(clone)
		this.elements.input.style.width = clone.offsetWidth + 'px'
		this.elements.widget.removeChild(clone)
	}
	this.playSample = function(event) {
		if (
			(event.type === 'click' && event.button !== 0) ||
			(event.type === 'keydown' && event.key !== 'Enter') ||
			this.widget_status === 'generating' ||
			this.widget_status === 'error'
		) {
			return
		}
		this.elements.audio.play()
		this.elements.audio.pause()
		this.elements.input.blur()
		if (this.isPlaying) {
			this.elements.audio.pause()
			return
		} else if (
			this.widget_status === 'generated' ||
			(this.widget_status === 'ready' && this.sample_status === 'default')
		) {
			this.elements.audio.play()
			return
		}
		this.requestAudio(this.currentSample, this.elements.input.value)
	}
	this.requestAudio = function(id, text) {
		var _this = this
		_this.setStatus('generating')
		var post = new XMLHttpRequest()
		post.withCredentials = !0
		post.open('POST', 'https://public.lyrebird.ai/api/public/imputation', !0)
		post.responseType = 'json'
		post.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
		post.send(JSON.stringify({ id: id, text: text }))
		post.onload = function() {
			if (_this.widget_status !== 'generating') {
				return
			}
			var response = post.response
			if (typeof response === 'string') {
				response = JSON.parse(response)
			}
			if (response !== null && response.audio_url !== null) {
				_this.loadAudio(response.audio_url, !0)
			} else {
				console.error('Error while fetching URL of audio')
				_this.setStatus('ready')
			}
		}
		post.onerror = function() {
			console.error('Error while posting text')
			_this.setStatus('ready')
		}
	}
	this.focusOnInput = function() {
		if (this.widget_status !== 'error') {
			this.elements.hint.innerHTML = 'Type whatever you want.'
		}
		if (this.sample_status === 'modified') {
			return
		}
		this.elements.original.innerHTML = this.elements.input.dataset.value
		this.elements.input.value = ''
	}
	this.blurOnInput = function() {
		if (this.widget_status !== 'error') {
			this.elements.hint.innerHTML =
				'Click into the outlined section to type a correction.'
		}
		if (this.sample_status === 'modified') {
			return
		}
		this.elements.input.value = this.elements.input.dataset.value
		this.elements.original.innerHTML = ''
	}
}
var widget = new Widget()
window.onload = widget.init()
