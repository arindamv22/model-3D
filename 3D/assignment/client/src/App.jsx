import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function ModelViewer({ url }) {
  const [model, setModel] = useState(null);

  useEffect(() => {
    if (!url) return;

    new THREE.GLTFLoader().load(url, (gltf) => {
      setModel(gltf.scene);
    });
  }, [url]);

  return (
    <Canvas camera={{ position: [0, 2, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={1} />
      {model && <primitive object={model} />}
      <OrbitControls />
    </Canvas>
  );
}

export default function App() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/models")
      .then((res) => res.json())
      .then(setModels);
  }, []);

  return (
    <div>
      <h1>3D Model Viewer</h1>
      {models.map((m) => (
        <div key={m.name}>
          <p>{m.name}</p>
          <ModelViewer url={m.url} />
        </div>
      ))}
    </div>
  );
}
