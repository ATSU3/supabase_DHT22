import '../scss/components/area-map.scss';
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { config, useSpring, animated } from "@react-spring/three";

const Box = (props) => {
    const ref = useRef();
    const [clicked, setClicked] = useState(false)
    const [hovered, setHovered] = useState(false)
    useFrame(() => ref.current.rotation.x += 0.01);

    const { scale } = useSpring({
        scale: clicked ? 2 : 1,
        config: config.wobbly,
    });

    return (
        <animated.mesh
            {...props}
            ref={ref}
            onClick={() => setClicked(!clicked)}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            scale={scale}

        >
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={hovered ? "blue" : "green"} />
        </animated.mesh>
    );
};

const AreaMap = () => {
    return (
        <div className='area-map'>
            <h1>(WIP)</h1>
            <Canvas>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />

                <Box position={[-12, 0, 0]} />
                <Box position={[0, 0, 0]} />
                <Box position={[12, 0, 0]} />
            </Canvas>
        </div>
    );
};

export default AreaMap;
