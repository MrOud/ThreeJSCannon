import EventEmitter from "./eventemitter"

export default class KeyboardInput extends EventEmitter {
    constructor() {
        super()

        this.currentKey = null
        this.keydownFired = false

        document.addEventListener('keydown', (event) => 
        {
            if (!this.keydownFired)
            {
                this.currentKey = event.key
                this.keydownFired = true
                this.trigger('keyPressed')
                //console.log(`${this.currentKey} down`)
            }
        })

        document.addEventListener('keyup', (event) =>
        {
            if (this.keydownFired) {
                if (event.key == this.currentKey)
                {
                    //console.log(`${this.currentKey} up`)
                    this.currentKey = null
                    this.keydownFired = false
                    
                }
            }
        })
    }
    
}