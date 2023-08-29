import * as THREE from 'three'
import * as PHYSICS from 'cannon-es'
import Experience from '../experience'
import Brick from './brick'

export default class Wall
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.physics = this.experience.world.physicsWorld

        this.bricks = []
        this.buildWall()

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('wall')

            this.debugObject = {}
            this.debugObject.applyForce = () => 
            {
                for (const brick of this.bricks)
                {
                    brick.brickBody.applyForce(new PHYSICS.Vec3(0, 1000, -2500), new PHYSICS.Vec3(0, 0, 0))
                }
            }

            this.debugObject.resetWall = () => 
            {
                this.resetWall()
            }
            this.debugFolder.add(this.debugObject, 'applyForce')
            this.debugFolder.add(this.debugObject, 'resetWall')
        }
    }

    buildWall()
    {
        //TODO: Improve this hot mess.
        for (let i = 0; i < 14; i++)
        {
            const getBrick = this.addBrick()
            const getBrick2 = this.addBrick()
            const getBrick3 = this.addBrick()
            if (i < 5) {
                getBrick.setPosition(i * 2 + 0.5, 0.5, 3)
                getBrick2.setPosition(i * 2 - 4.5, 0.5, 6)
                getBrick3.setPosition(i * 2 - 4.5 + 12, 0.5, 6)
            } else if (i < 9) {
                getBrick.setPosition(i * 2 - 8.5, 1.55, 3)
                getBrick2.setPosition(i * 2 - 13.5, 1.55, 6)
                getBrick3.setPosition(i * 2 - 13.5 + 12, 1.55, 6)
            } else if (i < 12) {
                getBrick.setPosition(i * 2 - 15.5, 2.6, 3)
                getBrick2.setPosition(i * 2 - 20.5, 2.6, 6)
                getBrick3.setPosition(i * 2 - 20.5 + 12, 2.6, 6)
            } else if (i < 14) {
                getBrick.setPosition(i * 2 - 20.5, 3.65, 3)
                getBrick2.setPosition(i * 2 - 25.5, 3.65, 6)
                getBrick3.setPosition(i * 2 - 25.5 + 12, 3.65, 6)
            }
        }
    }

    addBrick(positionX, positionY, positionZ) 
    {
        const newBrick = new Brick()
        this.bricks.push(newBrick)
        return newBrick 
    }

    removeBricks()
    {
        while (this.bricks.length != 0)
        {
            let currentBrick = this.bricks.pop()
            currentBrick.destroy()
        }
    }

    resetWall()
    {
        this.removeBricks()
        this.buildWall()
    }

    update()
    {
        for (const brick of this.bricks) {
            brick.update()
        }
    }
}