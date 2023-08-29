import * as THREE from 'three'
import * as PHYSICS from 'cannon-es'
import Experience from "../experience"
import Environment from './environment'
import Floor from './floor'
import Cannon from './cannon'
import Wall from './wall'
import CannonBall from './cannonBall'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.physicsWorld = new PHYSICS.World()
        

        this.resources.on('ready', () =>
        {
            this.floor = new Floor()
            this.cannon = new Cannon()
            this.wall = new Wall()
            this.environment = new Environment()
            this.setupPhysicsWorld()
            this.cannonBall = new CannonBall()
        })

        if (this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('world')
            this.debug.showAxesHelper = true
            this.debug.fireCannon = () => {
                this.cannonBall.fire()
            }
            this.axesHelper = new THREE.AxesHelper()
            this.axesHelper.position.set(5,0,5)
            this.scene.add(this.axesHelper)

            this.debugFolder.add(this.debug, 'showAxesHelper').onChange(() => {
                if (this.debug.showAxesHelper) 
                {
                    this.scene.add(this.axesHelper)
                } else {
                    this.scene.remove(this.axesHelper)
                }
            })
            this.debugFolder.add(this.debug, 'fireCannon')
        }
    }

    update() 
    {
        this.physicsWorld.step(1 / 60, this.time.deltaTime, 3)

        if (this.wall) 
        {
            this.wall.update()
        }
        if (this.cannonBall && this.cannonBall.fired)
        {
            this.cannonBall.update()
        }
    }

    setupPhysicsWorld()
    {
        this.physicsWorld.broadphase = new PHYSICS.SAPBroadphase(this.physicsWorld)
        this.physicsWorld.broadphase.axisIndex = 1
        this.physicsWorld.allowSleep = true
        this.physicsWorld.gravity.set(0.0, -9.8, 0)
        this.physicsWorld.solver.iterations = 10

        const defaultMaterial = new PHYSICS.Material('default')
        const defaultContactMaterial = new PHYSICS.ContactMaterial(
            defaultMaterial,
            defaultMaterial,
            {
                friction: 0.6,
                restitution: 0.1
            }
        )

        this.physicsWorld.addContactMaterial(defaultContactMaterial)
        this.physicsWorld.defaultContactMaterial = defaultContactMaterial
    }
}