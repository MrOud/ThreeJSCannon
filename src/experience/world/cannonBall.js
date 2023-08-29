import * as THREE from 'three'
import * as PHYSICS from 'cannon-es'
import Experience from '../experience'

export default class CannonBall
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.physics = this.experience.world.physicsWorld
        this.cannon = this.experience.world.cannon

        this.fired = false
        this.timeFired = 0

        this.setupBall()
        this.setupPhysics()
    }

    setupBall()
    {
        this.geometry = new THREE.SphereGeometry(0.4)
        this.material = new THREE.MeshStandardMaterial({
            color: 0x444444
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.castShadow = true
    }

    setupPhysics()
    {
        const cannonBallShape = new PHYSICS.Sphere(0.4)
        this.cannonBallBody = new PHYSICS.Body({
            mass: 2,
            position: new PHYSICS.Vec3(5, 0, 20),
            shape: cannonBallShape
        })
        this.cannonBallBody.allowSleep = true
        this.physics.addBody(this.cannonBallBody)
    }

    fire()
    {
        if (!this.fired) {
            this.fired = true
            this.timeFired = Date.now()
            this.cannonBallBody.position.set(5, 1, 20)
            this.cannonBallBody.velocity.set(0,0,0)
            this.mesh.position.set(this.cannonBallBody.position)
            this.scene.add(this.mesh)
        
            //Push the cannon ball in the direction the cannon is facing
            let impulse = new PHYSICS.Vec3(
                (this.cannon.model.rotation.y) * -Math.PI / 2 * 85, 
                (this.cannon.cannonBody.rotation.x - 1.57) * 100, 
                50 * this.cannonBallBody.mass * -1)
            this.cannonBallBody.applyImpulse(impulse)
        } else {
            if (Date.now() - this.timeFired > 500)
             {
                this.fired = false
                this.fire() //We fire again to avoid a 'misfire' if we could shoot
             }
        }
    }

    update()
    {
        this.mesh.position.copy(this.cannonBallBody.position)
        this.mesh.quaternion.copy(this.cannonBallBody.quaternion)
    }
}