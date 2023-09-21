import supabase from '../config/supabaseClient';
import '../scss/components/area-map.scss';
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

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
            scale={clicked ? 2 : 1}
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
            <h1>(WIP)</h1>
            <Canvas>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />

                <Box areaId={1} position={[-12, 0, 0]} setDisplayData={setDisplayData} />
                <Box areaId={2} position={[0, 0, 0]} setDisplayData={setDisplayData} />
                <Box areaId={3} position={[12, 0, 0]} setDisplayData={setDisplayData} />
            </Canvas>
            <SensorDataDisplay data={displayData} />
        </div>
    );
};

export default AreaMap;
