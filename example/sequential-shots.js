'use strict'
const html =
  '<style>\n    :host,\n    :host * {\n        -webkit-user-select: none;\n        user-select: none;\n    }\n\n    :host {\n        display: block;\n\n        width: 100%;\n        height: 100%;\n    }\n\n    #wrapper {\n        position: relative;\n        overflow: hidden;\n\n        width: 100%;\n        height: 100%;\n\n        contain: content;\n        cursor: pointer;\n    }\n\n    #wrapper.no-css {\n        position: unset;\n        overflow: unset;\n        width: unset;\n        height: unset;\n    }\n\n    #wrapper.no-css > #height {\n        padding-bottom: 100%;\n    }\n\n    #content {\n        display: flex;\n        align-items: stretch;\n\n        width: 100%;\n        height: 100%;\n\n        will-change: transform;\n        transition: transform 0.25s ease-out;\n    }\n\n    #wrapper.no-css > #content {\n        position: absolute;\n\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n    }\n\n    @media (prefers-reduced-motion: reduce) {\n        #content {\n            transition: none;\n        }\n    }\n\n    #label {\n        -webkit-font-smoothing: antialiased;\n\n        display: inline;\n        position: absolute;\n        top: 15px;\n        right: 15px;\n\n        margin: 0;\n        padding: 0;\n        background-color: rgba(0, 0, 0, 0.45);\n        border: 0.5px solid rgba(255, 255, 255, 0.15);\n        padding: 0.33em 0.66em;\n        line-height: 1.5;\n        border-radius: 1em;\n        letter-spacing: 0.1em;\n\n        font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\',\n            \'Helvetica Neue\', sans-serif;\n        font-weight: 400;\n        font-size: 10px;\n        color: white;\n\n        z-index: 1;\n\n        pointer-events: none;\n    }\n\n    @media screen and (prefers-contrast: more) {\n        #label {\n            font-weight: 600;\n            background-color: rgba(0, 0, 0, 1);\n            border: 1px solid rgba(255, 255, 255, 1);\n        }\n    }\n\n    #sound-button {\n        -webkit-font-smoothing: antialiased;\n\n        position: absolute;\n        bottom: 15px;\n        left: 15px;\n\n        -webkit-appearance: none;\n        appearance: none;\n        background: 0;\n        border: 0;\n\n        margin: 0;\n        padding: 0;\n        font-size: 10px;\n        color: white;\n        background-color: rgba(0, 0, 0, 0.45);\n        border: 0.5px solid rgba(255, 255, 255, 0.15);\n        padding: 0.33em 0.66em;\n        line-height: 1.5;\n        border-radius: 1em;\n        letter-spacing: 0.05em;\n\n        z-index: 1;\n\n        cursor: pointer;\n    }\n\n    #sound-button:disabled {\n        opacity: 0;\n        pointer-events: none;\n    }\n\n    @media (hover: hover) {\n        #sound-button:hover {\n            background-color: rgba(35, 35, 35, 0.45);\n        }\n    }\n\n    @media screen and (prefers-contrast: more) {\n        #sound-button {\n            font-weight: 600;\n            background-color: rgba(0, 0, 0, 1);\n            border: 0.5px solid rgba(255, 255, 255, 1);\n        }\n    }\n\n    @media screen and (hover: hover) and (prefers-contrast: more) {\n        #sound-button:hover {\n            background-color: rgba(255, 255, 255, 1);\n            color: black;\n            border: 1px solid black;\n        }\n    }\n\n    #sound-button:active {\n        background-color: rgba(15, 15, 15, 0.45);\n    }\n\n    #sound-button::before {\n        display: inline-block;\n        content: \'\';\n\n        width: 6px;\n        height: 6px;\n\n        background-color: #808080;\n        border: 0.5px solid rgba(255, 255, 255, 0.25);\n        border-radius: 100%;\n        margin-right: 0.45em;\n    }\n\n    #sound-button.unmuted::before {\n        background-color: #77b900;\n    }\n\n    @media screen and (prefers-contrast: more) {\n        #sound-button::before {\n            border: 0.5px solid white;\n        }\n    }\n\n    @media screen and (hover: hover) and (prefers-contrast: more) {\n        #sound-button:hover::before {\n            border: 0.5px solid black;\n        }\n    }\n\n    ::slotted(*) {\n        overflow: hidden;\n\n        flex-grow: 0;\n        flex-shrink: 0;\n        flex-basis: 100%;\n\n        height: 100%;\n    }\n\n    ::slotted(video) {\n        display: block;\n        object-fit: cover;\n    }\n\n    ::slotted(img) {\n        display: block;\n        object-fit: cover;\n    }\n\n    ::slotted(article) {\n        position: relative;\n    }\n\n    #wrapper.no-css > ::slotted(video) {\n        display: unset;\n    }\n\n    #wrapper.no-css > ::slotted(img) {\n        display: unset;\n    }\n</style>\n\n<section id="wrapper">\n    <div id="height"></div>\n\n    <h2 id="label" hidden></h2>\n\n    <div id="content">\n        <slot id="slot"></slot>\n    </div>\n\n    <div id="controls" hidden>\n        <button id="sound-button">Sound</button>\n    </div>\n</section>\n'
;(function () {
  function a() {
    const a = document.createElement('div')
    ;(a.style.position = 'absolute'), document.body.appendChild(a)
    var b
    return (
      a.currentStyle
        ? (b = a.currentStyle.position)
        : window.getComputedStyle && (b = document.defaultView.getComputedStyle(a, null).getPropertyValue('position')),
      document.body.removeChild(a),
      'static' === b
    )
  }
  function b(a) {
    return 'VIDEO' === a.tagName
  }
  function c(a) {
    return a.mozHasAudio || !!a.webkitAudioDecodedByteCount || !!(a.audioTracks && a.audioTracks.length)
  }
  class d extends HTMLElement {
    get _nextIndexInCycle() {
      return this.index + 1 >= this.children.length ? 0 : this.index + 1
    }
    get _previousIndexInCycle() {
      return 0 > this.index - 1 ? this.children.length - 1 : this.index - 1
    }
    show(a) {
      this.children.hasOwnProperty(a) && (this._prepareForMoving(), (this.index = a), this._updateAfterMoving())
    }
    showNext() {
      this.children.hasOwnProperty(this.index + 1) && this.show(this.index + 1)
    }
    showPrevious() {
      this.children.hasOwnProperty(this.index - 1) && this.show(this.index - 1)
    }
    showNextInCycle() {
      this.show(this._nextIndexInCycle)
    }
    showPreviousInCycle() {
      this.show(this._previousIndexInCycle)
    }
    _prepareForMoving() {
      this._pauseVideo(), this._updateSoundButton()
    }
    _updateLabel() {
      const a = this.children[this.index]
      ;(this.ariaLabel = null === a.ariaLabel ? `${this.index + 1}` : `${this.index + 1}: ${a.ariaLabel}`),
        (this._label.textContent = `${this.index + 1}/${this.children.length}`)
    }
    _pauseVideo() {
      const a = this.children[this.index]
      b(a) && ((a.muted = !0), a.pause())
    }
    _playVideo() {
      const a = this.children[this.index]
      b(a) && ((a.currentTime = 0), a.play())
    }
    _updateAfterMoving() {
      this._transformView(), this._playVideo(), this._updateSoundButton(), this._updateLabel()
    }
    get isStylesDisabled() {
      return this._root.classList.contains('no-css')
    }
    _transformView() {
      if (this.isStylesDisabled) {
        const a = this.children[this.index]
        Array.from(this.children).forEach(b => {
          b.hidden = b !== a
        })
      } else this._content.style.transform = `translateX(calc(-100% * ${this.index}))`
    }
    _toggleSound() {
      const a = this.children[this.index]
      ;(a.muted = !a.muted), this._updateSoundButton()
    }
    _unableSoundButton() {
      ;(this._sound.disabled = !1), (this._sound.tabIndex = 0)
    }
    _disableSoundButton() {
      ;(this._sound.disabled = !0), (this._sound.tabIndex = -1)
    }
    _updateSoundButton() {
      const a = this.children[this.index] // - mute / unmute
      a.muted ? this._sound.classList.remove('unmuted') : this._sound.classList.add('unmuted'),
        b(a) && c(a)
          ? this._unableSoundButton()
          : (this._disableSoundButton(),
            (a.onloadeddata = b => {
              a === b.target && c(b.target) ? this._unableSoundButton() : this._disableSoundButton()
            }))
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
    } // template...
    constructor() {
      super(),
        this._render(),
        (this.index = 0),
        (this.tabIndex = 0),
        this.setAttribute('role', 'button'),
        (this.ariaLive = 'assertive')
    }
    connectedCallback() {
      this._addEventListeners(), this.show(this.index)
    }
    _addEventListeners() {
      // - focus on click
      // - show next when clicking on any child
      // - show next/previous with keyboard
      // - mute/unmute sound
      // - mute/unmute sound
      this._root.addEventListener(
        'click',
        () => {
          this.focus()
        },
        !1
      ),
        Array.from(this.children).forEach(a => {
          a.addEventListener(
            'click',
            a => {
              a.preventDefault(), this.showNextInCycle()
            },
            !1
          )
        }),
        this.addEventListener(
          'keydown',
          a => {
            'ArrowLeft' === a.code
              ? this.showPrevious()
              : 'ArrowRight' === a.code
              ? this.showNext()
              : 'KeyM' === a.code && this._toggleSound()
          },
          !1
        ),
        this._sound.addEventListener(
          'click',
          a => {
            a.preventDefault(), this._toggleSound()
          },
          !1
        )
    }
    _render() {
      const b = document.createElement('template')
      ;(b.innerHTML = html),
        this.attachShadow({mode: 'open'}),
        this.shadowRoot.appendChild(b.content.cloneNode(!0)),
        a() && this._root.classList.add('no-css'),
        (this._label.hidden = !1),
        (this._controls.hidden = !1)
    }
  }
  window.customElements.get('sequential-shots') ||
    ((window.HTMLSequentialShotsElement = d), window.customElements.define('sequential-shots', d))
})()
