import supabase from '../config/supabaseClient';
import '../scss/components/area-map.scss';
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import modelPath from './../glb_models/sample.glb';


import { Vector2 } from 'three';

const Model = ({ onModelClick }) => {
    const meshRef = useRef();
    const [startPosition, setStartPosition] = useState(new Vector2());
    const [isDragging, setIsDragging] = useState(false);

    const gltf = useGLTF(modelPath);

    const handlePointerDown = (event) => {
        setIsDragging(true);
        setStartPosition(new Vector2(event.clientX, event.clientY));
    };

    const handlePointerUp = () => {
        setIsDragging(false);
    };

    const handlePointerMove = (event) => {
        if (!isDragging) return;

        const currentPosition = new Vector2(event.clientX, event.clientY);
        const delta = currentPosition.sub(startPosition).multiplyScalar(0.0001); // 感度調整

        meshRef.current.rotation.y += delta.x;
        meshRef.current.rotation.x += delta.y;

        setStartPosition(currentPosition);
    };

    return (
        <mesh
            ref={meshRef}
            geometry={gltf.scene.children[0].geometry}
            material={gltf.scene.children[0].material}
            onClick={onModelClick}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
        />
    );
};

const Box = ({ areaId, setDisplayData, ...props }) => {
    const ref = useRef();
    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);

    const fetchAndShowData = async () => {
        let { data: sensorData, error } = await supabase
            .from('test')
            .select('temperature, humidity, created_at')
            .eq('area_id', areaId)
            .limit(1);

        if (error) {
            console.error('Error fetching sensor data', error);
            return;
        }

        if (sensorData && sensorData.length > 0) {
            const { temperature, humidity } = sensorData[0];
            setDisplayData({ areaId, temperature, humidity });
        }
    };

    useFrame(() => ref.current.rotation.x += 0.01);

    return (
        <mesh
            {...props}
            ref={ref}
            onClick={() => {
                setClicked(!clicked);
                fetchAndShowData();
            }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            scale={clicked ? 1.2 : 1}
        >
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={hovered ? "blue" : "green"} />
        </mesh>
    );
};

const SensorDataDisplay = ({ data }) => {
    if (!data) return null;
    return (
        <div className="sensor-data">
            Area ID: {data.areaId} <br />
            Temperature: {data.temperature}°C <br />
            Humidity: {data.humidity}%
        </div>
    );
};

const AreaMap = () => {
    const [displayData, setDisplayData] = useState(null);

    return (
        <div className='area-map'>
            <p>[クリック時に対象のAreaIDで温湿度表示がテキストで表示できるかのテスト]</p>
            <Canvas>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />

                <Box areaId={1} position={[-6, 0, 0]} setDisplayData={setDisplayData} />
                <Box areaId={2} position={[0, 0, 0]} setDisplayData={setDisplayData} />
                <Box areaId={3} position={[6, 0, 0]} setDisplayData={setDisplayData} />
            </Canvas>
            <SensorDataDisplay data={displayData} />

            <p>[GLBモデルのimport&ドラックしてコントロールするテスト[multiplyScalar: 0.0001] ]</p>
            <Canvas>
                <ambientLight intensity={0.5} />
                <Model onModelClick={() => {
                    const fetchData = async () => {
                        let { data: sensorData, error } = await supabase
                            .from('test')
                            .select('temperature, humidity, created_at')
                            .eq('area_id', 1)
                            .limit(1);

                        if (error) {
                            console.error('Error fetching sensor data', error);
                            return;
                        }

                        if (sensorData && sensorData.length > 0) {
                            const { temperature, humidity } = sensorData[0];
                            setDisplayData({ areaId: 1, temperature, humidity });
                        }
                    };
                    fetchData();
                }} />
            </Canvas>
        </div>
    );
};

export default AreaMap;
