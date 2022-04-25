import html from './index.html'
;(function () {
    function isStylesDisabled() {
        const temp = document.createElement('div')
        temp.style.position = 'absolute'
        document.body.appendChild(temp)

        var currentPosition

        if (temp.currentStyle) {
            currentPosition = temp.currentStyle.position
        } else if (window.getComputedStyle) {
            currentPosition = document.defaultView.getComputedStyle(temp, null).getPropertyValue('position')
        }

        document.body.removeChild(temp)

        return currentPosition === 'static'
    }

    function isVideo(element) {
        return element.tagName === 'VIDEO'
    }

    function haveAudio(element) {
        return (
            element.mozHasAudio ||
            Boolean(element.webkitAudioDecodedByteCount) ||
            Boolean(element.audioTracks && element.audioTracks.length)
        )
    }

    class HTMLSequentialShotsElement extends HTMLElement {
        get _nextIndexInCycle() {
            if (this.index + 1 >= this.children.length) {
                return 0
            } else {
                return this.index + 1
            }
        }

        get _previousIndexInCycle() {
            if (this.index - 1 < 0) {
                return this.children.length - 1
            } else {
                return this.index - 1
            }
        }

        show(index) {
            if (this.children.hasOwnProperty(index)) {
                this._prepareForMoving()
                this.index = index
                this._updateAfterMoving()
            }
        }

        showNext() {
            if (this.children.hasOwnProperty(this.index + 1)) {
                this.show(this.index + 1)
            }
        }

        showPrevious() {
            if (this.children.hasOwnProperty(this.index - 1)) {
                this.show(this.index - 1)
            }
        }

        showNextInCycle() {
            this.show(this._nextIndexInCycle)
        }

        showPreviousInCycle() {
            this.show(this._previousIndexInCycle)
        }

        _prepareForMoving() {
            this._pauseVideo()
            this._updateSoundButton()
        }

        _updateLabel() {
            const current = this.children[this.index]

            if (current.ariaLabel !== null) {
                this.ariaLabel = `${this.index + 1}: ${current.ariaLabel}`
            } else {
                this.ariaLabel = `${this.index + 1}`
            }

            this._label.textContent = `${this.index + 1}/${this.children.length}`
        }

        _pauseVideo() {
            const current = this.children[this.index]

            if (isVideo(current)) {
                current.muted = true
                current.pause()
            }
        }

        _playVideo() {
            const current = this.children[this.index]

            if (isVideo(current)) {
                current.currentTime = 0
                current.play()
            }
        }

        _updateAfterMoving() {
            this._transformView()
            this._playVideo()
            this._updateSoundButton()
            this._updateLabel()
        }

        get isStylesDisabled() {
            return this._root.classList.contains('no-css')
        }

        _transformView() {
            if (this.isStylesDisabled) {
                const current = this.children[this.index]
                Array.from(this.children).forEach(child => {
                    child.hidden = child !== current
                })
            } else {
                this._content.style.transform = `translateX(calc(-100% * ${this.index}))`
            }
        }

        _toggleSound() {
            const current = this.children[this.index]
            current.muted = !current.muted
            this._updateSoundButton()
        }

        _unableSoundButton() {
            this._sound.disabled = false
            this._sound.tabIndex = 0
        }

        _disableSoundButton() {
            this._sound.disabled = true
            this._sound.tabIndex = -1
        }

        _updateSoundButton() {
            const current = this.children[this.index]

            // - mute / unmute
            if (current.muted) {
                this._sound.classList.remove('unmuted')
            } else {
                this._sound.classList.add('unmuted')
            }

            // show / hide sound button
            if (isVideo(current) && haveAudio(current)) {
                this._unableSoundButton()
            } else {
                this._disableSoundButton()

                // if there is no sound, then probably the data just hasn't loaded yet.
                current.onloadeddata = event => {
                    if (current === event.target && haveAudio(event.target)) {
                        this._unableSoundButton()
                    } else {
                        this._disableSoundButton()
                    }
                }
            }
        }

        get _root() {
            return this.shadowRoot.getElementById('wrapper')
        }

        get _content() {
            return this.shadowRoot.getElementById('content')
        }

        get _controls() {
            return this.shadowRoot.getElementById('controls')
        }

        get _sound() {
            return this.shadowRoot.getElementById('sound-button')
        }

        get _label() {
            return this.shadowRoot.getElementById('label')
        }

        // template...

        constructor() {
            super()
            this._render()
            this.index = 0
            this.tabIndex = 0
            this.setAttribute('role', 'button')
            this.ariaLive = 'assertive'
        }

        connectedCallback() {
            this._addEventListeners()
            this.show(this.index)
        }

        _addEventListeners() {
            // - focus on click
            this._root.addEventListener(
                'click',
                event => {
                    this.focus()
                },
                false
            )

            // - show next when clicking on any child
            Array.from(this.children).forEach(child => {
                child.addEventListener(
                    'click',
                    event => {
                        event.preventDefault()
                        this.showNextInCycle()
                    },
                    false
                )
            })

            // - show next/previous with keyboard
            // - mute/unmute sound
            this.addEventListener(
                'keydown',
                event => {
                    if (event.code === 'ArrowLeft') {
                        this.showPrevious()
                    } else if (event.code === 'ArrowRight') {
                        this.showNext()
                    } else if (event.code === 'KeyM') {
                        this._toggleSound()
                    }
                },
                false
            )

            // - mute/unmute sound
            this._sound.addEventListener(
                'click',
                event => {
                    event.preventDefault()
                    this._toggleSound()
                },
                false
            )
        }

        _render() {
            const template = document.createElement('template')
            template.innerHTML = html

            this.attachShadow({mode: 'open'})
            this.shadowRoot.appendChild(template.content.cloneNode(true))

            if (isStylesDisabled()) {
                this._root.classList.add('no-css')
            }

            this._label.hidden = false
            this._controls.hidden = false
        }
    }

    if (!window.customElements.get('sequential-shots')) {
        window.HTMLSequentialShotsElement = HTMLSequentialShotsElement
        window.customElements.define('sequential-shots', HTMLSequentialShotsElement)
    }
})()
