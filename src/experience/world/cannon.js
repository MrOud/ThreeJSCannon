import * as THREE from 'three'
import Experience from '../experience'

export default class Cannon
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.resource = this.resources.items.cannonModel
        this.setModel()

        //Debug
        if (this.debug.active) 
        {
            this.debugFolder = this.debug.ui.addFolder('cannon')
            const debugObject = {
                rotateLeft: () => { this.rotateBase(0.05) },
                rotateRight: () => { this.rotateBase(-0.05) },
                rotateUp: () => { this.rotateCannon(0.05) },
                rotateDown: () => { this.rotateCannon(-0.05) },
                powerUp: () => { this.changePower(5) },
                powerDown: () => { this.changePower(-5) }
            }

            this.debugFolder.add(debugObject, 'rotateLeft')
            this.debugFolder.add(debugObject, 'rotateRight')
            this.debugFolder.add(debugObject, 'rotateUp')
            this.debugFolder.add(debugObject, 'rotateDown')
            this.debugFolder.add(debugObject, 'powerUp')
            this.debugFolder.add(debugObject, 'powerDown')
        }
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.position.set(5, 0, 20)
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if (child instanceof THREE.Mesh)
            {
                child.castShadow = true
                child.receiveShadow = true
                if (child.name = 'canonBody')
                {
                    this.cannonBody = child
                }
            }
        })
    }

    rotateBase(angle)
    {
        this.model.rotation.y += angle
        if (this.model.rotation.y > 0.75) this.model.rotation.y -= angle
        if (this.model.rotation.y < -1) this.model.rotation.y -= angle
    }

    rotateCannon(angle)
    {
        this.cannonBody.rotation.x += angle
        if (this.cannonBody.rotation.x > 2.2)  this.cannonBody.rotation.x -= angle
        if (this.cannonBody.rotation.x < 1.25)  this.cannonBody.rotation.x -= angle
    }
}