import * as THREE from 'three'
import Experience from "../experience"

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug    
        
        if (this.debug.active) 
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setSunLight()
        this.setEnvironmentMap()
    }

    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 8
        this.sunLight.shadow.camera.scale.set(5,5,5)
        this.sunLight.shadow.mapSize.set(2048, 2048)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 3.85, -10)
        this.scene.add(this.sunLight)

        //Debug
        if (this.debug.active)
        {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunLight Intensity')
                .min(0).max(10).step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLight Position X')
                .min(-10).max(10).step(0.01)
            
            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLight Position Y')
                .min(0).max(10).step(0.01)
                
            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLight Position Z')
                .min(-10).max(10).step(0.01)

            this.debug.showSunLightHelper = false
            this.sunLightHelper = new THREE.CameraHelper(this.sunLight.shadow.camera)
            //this.scene.add(this.sunLightHelper)

            this.debugFolder.add(this.debug, 'showSunLightHelper').onChange(() => {
                if (this.debug.showSunLightHelper)
                {
                    this.scene.add(this.sunLightHelper)
                } else {
                    this.scene.remove(this.sunLightHelper)
                }
            })
        }
    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 1.2
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        //this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () => 
        {
            this.scene.traverse((child) => 
            {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) 
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }

        this.environmentMap.updateMaterials()

        //Debug
        if (this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMap Intensity')
                .min(0).max(4).step(0.001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}