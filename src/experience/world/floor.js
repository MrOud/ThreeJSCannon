import * as THREE from 'three'
import * as PHYSICS from 'cannon-es'
import Experience from "../experience"

export default class Floor
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.physics = this.experience.world.physicsWorld

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
        this.setPhysics()

    }

    setGeometry() 
    {
        this.geometry = new THREE.PlaneGeometry(50, 55, 10, 10) 
    }

    setTextures() 
    {
        this.texture = {}

        this.texture.color = this.resources.items.grassColorTexture
        this.texture.color.repeat.set(3.5, 3.5)
        this.texture.color.wrapS = THREE.RepeatWrapping
        this.texture.color.wrapT = THREE.RepeatWrapping

        this.texture.normal = this.resources.items.grassNormalTexture
        this.texture.normal.repeat.set(3.5, 3.5)
        this.texture.normal.wrapS = THREE.RepeatWrapping
        this.texture.normal.wrapT = THREE.RepeatWrapping

    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            map: this.texture.color,
            normalMap: this.texture.normal,
            //wireframe: true
            color: 0xbaa729
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = -Math.PI * 0.5
        this.mesh.receiveShadow = true
        //this.position.set()
        this.scene.add(this.mesh)
    }

    setPhysics()
    {
        const floorPlane = new PHYSICS.Plane()
        const floorBody = new PHYSICS.Body()
        floorBody.mass = 0
        floorBody.addShape(floorPlane)
        floorBody.quaternion.setFromAxisAngle(new PHYSICS.Vec3(-1, 0, 0), Math.PI * 0.5)

        this.physics.addBody(floorBody)
    }
}