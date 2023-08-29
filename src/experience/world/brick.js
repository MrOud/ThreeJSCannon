import * as THREE from 'three'
import * as PHYSICS from 'cannon-es'
import Experience from '../experience'

export default class Brick
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.physics = this.experience.world.physicsWorld

        this.setBrick()
        this.setPhysics()
    }

    setBrick()
    {
        //Three.js
        this.geometry = new THREE.BoxGeometry(2, 1, 1)
        this.material = new THREE.MeshStandardMaterial({
            color: 0x944b46
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }

    setPhysics()
    {
        const brickShape = new PHYSICS.Box(new PHYSICS.Vec3(1, 0.5, 0.5))
        this.brickBody = new PHYSICS.Body({
            mass: 4,
            position: new PHYSICS.Vec3(10, 10, 0),
            shape: brickShape
        })
        this.brickBody.allowSleep = true
        this.physics.addBody(this.brickBody)
    }

    setPosition(positionX, positionY, positionZ)
    {
        this.mesh.position.set(positionX, positionY, positionZ)
        this.brickBody.position.set(positionX, positionY, positionZ)
    }

    update()
    {
        this.mesh.position.copy(this.brickBody.position)
        this.mesh.quaternion.copy(this.brickBody.quaternion)
    }

    destroy()
    {
        this.physics.removeBody(this.brickBody)
        this.scene.remove(this.mesh)
    }
}