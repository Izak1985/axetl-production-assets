/* AX'ETL mobile AXI renderer: 24fps H.264 colour + true alpha-matte composite.
   The video contains RGB in its left half and alpha in its right half.
   GPU compositing avoids iOS Safari's WebM-alpha and animated-WebP decoder issues. */
(() => {
  'use strict';
  const stage = document.getElementById('mascot-stage');
  const video = document.getElementById('axi-video');
  const canvas = document.getElementById('axi-alpha-canvas');
  const mobile = window.matchMedia('(max-width: 800px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!stage || !video || !canvas || !mobile.matches || reduced.matches) return;

  let gl, program, texture, position, uvLoc, frames = 0;
  let stopped = false, started = false, callbackId = 0;
  const fallbackSource = stage.querySelector('.mascot-picture source');

  function shader(type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(s) || 'AXI shader compile error');
    }
    return s;
  }
  function initialize() {
    gl = canvas.getContext('webgl', {
      alpha: true, premultipliedAlpha: false, antialias: false,
      depth: false, stencil: false, preserveDrawingBuffer: false,
      powerPreference: 'low-power'
    });
    if (!gl) throw new Error('WebGL unavailable');
    const v = shader(gl.VERTEX_SHADER, [
      'attribute vec2 pos;',
      'varying vec2 uv;',
      'void main(){uv=pos*0.5+0.5;gl_Position=vec4(pos,0.0,1.0);}'
    ].join('\n'));
    const f = shader(gl.FRAGMENT_SHADER, [
      'precision mediump float;',
      'varying vec2 uv;',
      'uniform sampler2D frame;',
      'void main(){',
      'vec3 rgb=texture2D(frame,vec2(uv.x*0.5,uv.y)).rgb;',
      'float alpha=texture2D(frame,vec2(0.5+uv.x*0.5,uv.y)).r;',
      'alpha=clamp((alpha-0.015)*1.025,0.0,1.0);',
      'if(alpha<0.01)discard;',
      'gl_FragColor=vec4(clamp(rgb/max(alpha,0.04),0.0,1.0),alpha);',
      '}'
    ].join('\n'));
    program = gl.createProgram();
    gl.attachShader(program, v);
    gl.attachShader(program, f);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'AXI shader link error');
    }
    gl.useProgram(program);
    position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1
    ]), gl.STATIC_DRAW);
    const attribute = gl.getAttribLocation(program, 'pos');
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
    uvLoc = gl.getUniformLocation(program, 'frame');
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    canvas.width = 480;
    canvas.height = 480;
    gl.viewport(0, 0, 480, 480);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
  }
  function fail() {
    stopped = true;
    stage.classList.remove('axi-alpha-active');
    if (fallbackSource) fallbackSource.media = '(max-width: 800px) and (prefers-reduced-motion: no-preference)';
    canvas.style.display = 'none';
  }
  function draw() {
    if (stopped || !mobile.matches || reduced.matches || document.hidden) return;
    if (video.readyState < 2 || video.videoWidth !== 960 || video.videoHeight !== 480) return;
    try {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1i(uvLoc, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (++frames === 1) {
        stage.classList.add('axi-alpha-active');
        if (fallbackSource) fallbackSource.media = 'not all';
      }
    } catch (error) { fail(); }
  }
  function schedule() {
    if (stopped) return;
    if ('requestVideoFrameCallback' in video) {
      const step = () => {
        if (stopped) return;
        draw();
        callbackId = video.requestVideoFrameCallback(step);
      };
      callbackId = video.requestVideoFrameCallback(step);
    } else {
      const step = () => {
        if (stopped) return;
        draw();
        callbackId = requestAnimationFrame(step);
      };
      callbackId = requestAnimationFrame(step);
    }
  }
  try { initialize(); } catch (error) { fail(); return; }
  video.addEventListener('error', fail, {once: true});
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    fail();
  });
  video.addEventListener('playing', () => {
    if (!started) { started = true; schedule(); }
  });
  video.addEventListener('loadeddata', () => {
    if (!started) { started = true; schedule(); }
  });
  if (video.readyState >= 2 && !started) { started = true; schedule(); }
  window.addEventListener('pagehide', () => { stopped = true; });
})();