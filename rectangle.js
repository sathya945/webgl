/// <reference path="webgl.d.ts" />
let rect_w = class {
    constructor(gl, pos, l, b, picture,rotation) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        
        this.positions = [
                // Front face
                -l, -b, 0,
                l, -b, 0,
                l, b, 0,
                -l, b, 0,
        ];
        this.rotation = rotation;
        this.pos = pos;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        const indices = [
            0, 1, 2, 0, 2, 3,];
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(indices), gl.STATIC_DRAW);
            
              const textureCoordBuffer = gl.createBuffer();
              gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
              const textureCoordinates = [
                  // Front
                  0.0, 0.0,
                  1.0, 0.0,
                  1.0, 1.0,
                  0.0, 1.0,];
                  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                  gl.STATIC_DRAW);
              
              this.buffer = {
                  position: this.positionBuffer,
                  textureCoord: textureCoordBuffer,
                  indices: indexBuffer,
              };  
      
              this.texture = loadTexture(gl, picture)
      
          }
          draw(gl, projectionMatrix, programInfo, deltaTime,pos) {
            this.pos=pos
            const modelViewMatrix = mat4.create();
            mat4.translate(
                modelViewMatrix,
                modelViewMatrix,
                this.pos
            );
            //this.rotation += Math.PI / (((Math.random()) % 100) + 50);
    
            mat4.rotate(modelViewMatrix,
                modelViewMatrix,
                this.rotation[0],
                [1, 0, 0]);
            mat4.rotate(modelViewMatrix,
                    modelViewMatrix,
                    this.rotation[1],
                    [0, 1, 0]);
            mat4.rotate(modelViewMatrix,
                        modelViewMatrix,
                        this.rotation[2],
                        [0, 0, 1]);    

    
            {
                const numComponents = 3;
                const type = gl.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
                gl.vertexAttribPointer(
                    programInfo.attribLocations.vertexPosition,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
                gl.enableVertexAttribArray(
                    programInfo.attribLocations.vertexPosition);
            }
    
            // Tell WebGL how to pull out the colors from the color buffer
            // into the vertexColor attribute.
            // tell webgl how to pull out the texture coordinates from buffer
            {
                const num = 2; // every coordinate composed of 2 values
                const type = gl.FLOAT; // the data in the buffer is 32 bit float
                const normalize = false; // don't normalize
                const stride = 0; // how many bytes to get from one set to the next
                const offset = 0; // how many bytes inside the buffer to start from
                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.textureCoord);
                gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
                gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
            }
    
            // Tell WebGL which indices to use to index the vertices
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);
    
            // Tell WebGL to use our program when drawing
    
            gl.useProgram(programInfo.program);
    
            // Set the shader uniforms
    
            gl.uniformMatrix4fv(
                programInfo.uniformLocations.projectionMatrix,
                false,
                projectionMatrix);
            gl.uniformMatrix4fv(
                programInfo.uniformLocations.modelViewMatrix,
                false,
                modelViewMatrix);
                // Tell WebGL we want to affect texture unit 0
                gl.activeTexture(gl.TEXTURE0);
                
                // Bind the texture to texture unit 0
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                
                // Tell the shader we bound the texture to texture unit 0
                gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
                
                {
                    const vertexCount = 6;
                    const type = gl.UNSIGNED_SHORT;
                    const offset = 0;
                    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
                }
            }
        }
//let boggie = class {
//    constructor(gl,pos,l,b,h){
//        this.pos=pos
//        this.front = new cube_w(gl,pos,l,b,0,"front.jpeg")
//        this.top = new cube_w(gl,pos,l,0,h,"side.jpeg")
//        this.side = new cube_w(gl,pos,0,b,h,"side.jpeg")
//        this.l=l
//        this.b=b
//        this.h=h
//    }
//    draw(gl, projectionMatrix, programInfo, deltaTime) {
//        var pos=[this.pos[0],this.pos[1],this.pos[2]]
//        this.front.drawCube(gl,projectionMatrix,programInfo,deltaTime,[pos[0],pos[1],pos[2]-this.h/2]);
//        this.top.drawCube(gl,projectionMatrix,programInfo,deltaTime,[pos[0],pos[1]-this.b/2,pos[2]]);
//        this.side.drawCube(gl,projectionMatrix,programInfo,deltaTime,[pos[0]-this.l/2,pos[1],pos[2]]);  
//        this.front.drawCube(gl,projectionMatrix,programInfo,deltaTime,[pos[0],pos[1],pos[2]+this.h/2]);
//        this.top.drawCube(gl,projectionMatrix,programInfo,deltaTime,[pos[0],pos[1]+this.b/2,pos[2]]);
//        this.side.drawCube(gl,projectionMatrix,programInfo,deltaTime,[pos[0]+this.l/2,pos[1],pos[2]]);  
//    }
//}

let boggie = class {
    constructor(gl, pos, l, b, h) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        
        this.positions = [
                // Front face
                -l, -b, h,
                l, -b, h,
                l, b, h,
                -l, b, h,
                //Back Face
                -l, -b, -h,
                l, -b, -h,
                l, b, -h,
                -l, b, -h,
                //Top Face
                -l, b, -h,
                l, b, -h,
                l, b, h,
                -l, b, h,
                //Bottom Face
                -l, -b, -h,
                l, -b, -h,
                l, -b, h,
                -l, -b, h,
                //Left Face
                -l, -b, -h,
                -l, b, -h,
                -l, b, h,
                -l, -b, h,
                //Right Face
                l, -b, -h,
                l, b, -h,
                l, b, h,
                l, -b, h,
        ];
        
        this.rotation = 0;

        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        const indices = [
            0, 1, 2, 0, 2, 3, // front
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23,
        ];

        // Now send the element array to GL

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW);
        
          const textureCoordBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
          const textureCoordinates = [
              // Front
              0.0, 0.0,
              1.0, 0.0,
              1.0, 1.0,
              0.0, 1.0,
              // Back
              0.0, 0.0,
              1.0, 0.0,
              1.0, 1.0,
              0.0, 1.0,
              // Top
              0.0, 0.0,
              1.0, 0.0,
              1.0, 1.0,
              0.0, 1.0,
              // Bottom
              0.0, 0.0,
              1.0, 0.0,
              1.0, 1.0,
              0.0, 1.0,
              // Right
              0.0, 0.0,
              1.0, 0.0,
              1.0, 1.0,
              0.0, 1.0,
              // Left
              0.0, 0.0,
              1.0, 0.0,
              1.0, 1.0,
              0.0, 1.0,
          ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
            gl.STATIC_DRAW);
        
        this.buffer = {
            position: this.positionBuffer,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        };  

        this.texture = loadTexture(gl,"front.jpeg")

    }

    draw(gl, projectionMatrix, programInfo, deltaTime, pos) {
        if (pos == undefined){
        }
        else
            this.pos=pos
        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );

        //this.rotation += Math.PI / (((Math.random()) % 100) + 50);

        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            this.rotation,
            [1, 1, 1]);

        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        // tell webgl how to pull out the texture coordinates from buffer
        {
            const num = 2; // every coordinate composed of 2 values
            const type = gl.FLOAT; // the data in the buffer is 32 bit float
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set to the next
            const offset = 0; // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.textureCoord);
            gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
        }

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

            
            // Tell WebGL we want to affect texture unit 0
            gl.activeTexture(gl.TEXTURE0);
            
            // Bind the texture to texture unit 0
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            
            // Tell the shader we bound the texture to texture unit 0
            gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
            
            {
                const vertexCount = 36;
                const type = gl.UNSIGNED_SHORT;
                const offset = 0;
                gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
            }
        }
    };
