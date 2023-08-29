import * as THREE from 'three'
import Sizes from "./utils/sizes"
import Time from "./utils/time"
import Camera from './camera'
import Renderer from './renderer'
import World from './world/world'
import Resources from './utils/resources'
import sources from './sources'
import Debug from './utils/debug'
import KeyboardInput from './utils/keyboardInput'

let instance = null

export default class Experience
{
    constructor(canvas)
    {
        if (instance)
        {
            return instance
        }

        instance = this
        //Global access
        window.experience = this

        //Options
        this.canvas = canvas

        //Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.keyboardInput = new KeyboardInput()

        this.scene.background = new THREE.Color(0x09a9ed)
        this.sizes.on('resize', () =>
        {
            this.resize()
            this.renderer.resize()
        })

        this.time.on('tick', () =>
        {
            this.update()
        })

        this.keyboardInput.on('keyPressed', () => 
        {
            if (this.keyboardInput.currentKey == 'a') {
                this.world.cannon.rotateBase(0.05)
            } else if (this.keyboardInput.currentKey == 'd') {
                this.world.cannon.rotateBase(-0.05)
            } else if (this.keyboardInput.currentKey == 'w') {
                this.world.cannon.rotateCannon(0.05) 
            } else if (this.keyboardInput.currentKey == 's') {
                this.world.cannon.rotateCannon(-0.05)
            } else if (this.keyboardInput.currentKey == ' ') {
                this.world.cannonBall.fire()
            } else if (this.keyboardInput.currentKey == 'r') {
                this.world.wall.resetWall()
            }
        })
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        //this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    destroy() 
    {
        this.sizes.off('resize')
        this.time.off('tick')

        //Traverse Scene
        this.scene.traverse((child) => 
        {
            if (child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                for (const key in child.material)
                {
                    const value = child.material[key]

                    if (value && value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active)
        {
            this.debug.ui.destroy()
        }
    }
}