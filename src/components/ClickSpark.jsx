import React, { useState, useCallback } from 'react';
import './ClickSpark.css';

const ClickSpark = ({
    children,
    sparkColor = '#fff',
    sparkSize = 10,
    sparkRadius = 15,
    sparkCount = 8,
    duration = 400
}) => {
    const [sparks, setSparks] = useState([]);

    const handleClick = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newSparks = [];
        const angleStep = (2 * Math.PI) / sparkCount;

        for (let i = 0; i < sparkCount; i++) {
            const angle = i * angleStep;
            const sparkId = Date.now() + i;

            newSparks.push({
                id: sparkId,
                x,
                y,
                angle,
                color: sparkColor,
                size: sparkSize,
                radius: sparkRadius,
                duration
            });
        }

        setSparks(prev => [...prev, ...newSparks]);

        // Remove sparks after animation completes
        setTimeout(() => {
            setSparks(prev => prev.filter(spark => !newSparks.find(s => s.id === spark.id)));
        }, duration);
    }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration]);

    return (
        <div
            onClick={handleClick}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%'
            }}
        >
            {children}

            {sparks.map(spark => (
                <div
                    key={spark.id}
                    className="spark"
                    style={{
                        '--spark-x': `${spark.x}px`,
                        '--spark-y': `${spark.y}px`,
                        '--spark-angle': `${spark.angle}rad`,
                        '--spark-radius': `${spark.radius}px`,
                        '--spark-size': `${spark.size}px`,
                        '--spark-duration': `${spark.duration}ms`,
                        '--spark-color': spark.color,
                        position: 'absolute',
                        left: 'var(--spark-x)',
                        top: 'var(--spark-y)',
                        width: 'var(--spark-size)',
                        height: 'var(--spark-size)',
                        backgroundColor: 'var(--spark-color)',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        animation: `spark-fly var(--spark-duration) ease-out forwards`,
                        zIndex: 9999
                    }}
                />
            ))}
        </div>
    );
};

export default ClickSpark;
