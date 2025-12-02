import React, { useEffect, useRef } from 'react';

const Ribbons = ({
    baseThickness = 30,
    colors = ['#ff0000', '#00ff00', '#0000ff'],
    speedMultiplier = 0.5,
    maxAge = 500,
    enableFade = true,
    enableShaderEffect = false
}) => {
    const canvasRef = useRef(null);
    const ribbonsRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 });
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Ribbon class
        class Ribbon {
            constructor(x, y, color) {
                this.points = [{ x, y, age: 0 }];
                this.color = color;
                this.maxPoints = Math.ceil(maxAge / 16); // Assuming ~60fps
            }

            addPoint(x, y) {
                this.points.push({ x, y, age: 0 });
                if (this.points.length > this.maxPoints) {
                    this.points.shift();
                }
            }

            update() {
                this.points.forEach(point => {
                    point.age += 16; // Approximate frame time
                });
                this.points = this.points.filter(point => point.age < maxAge);
                return this.points.length > 0;
            }

            draw(ctx) {
                if (this.points.length < 2) return;

                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);

                for (let i = 1; i < this.points.length; i++) {
                    const point = this.points[i];
                    const prevPoint = this.points[i - 1];

                    const xc = (point.x + prevPoint.x) / 2;
                    const yc = (point.y + prevPoint.y) / 2;
                    ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, xc, yc);
                }

                // Apply fade effect
                let alpha = 1;
                if (enableFade && this.points.length > 0) {
                    const oldestPoint = this.points[0];
                    alpha = Math.max(0, 1 - (oldestPoint.age / maxAge));
                }

                // Apply thickness with gradient
                const thickness = baseThickness;
                ctx.strokeStyle = this.color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
                ctx.lineWidth = thickness;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                // Add shader effect if enabled
                if (enableShaderEffect) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = this.color;
                }

                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }

        // Mouse move handler
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.lastX = mouseRef.current.x;
            mouseRef.current.lastY = mouseRef.current.y;
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;

            // Create new ribbon if mouse moved
            const dx = mouseRef.current.x - mouseRef.current.lastX;
            const dy = mouseRef.current.y - mouseRef.current.lastY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5 * speedMultiplier) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                const ribbon = new Ribbon(mouseRef.current.x, mouseRef.current.y, color);
                ribbonsRef.current.push(ribbon);
            }

            // Add points to existing ribbons
            ribbonsRef.current.forEach(ribbon => {
                if (ribbon.points.length > 0) {
                    const lastPoint = ribbon.points[ribbon.points.length - 1];
                    const ribbonDx = mouseRef.current.x - lastPoint.x;
                    const ribbonDy = mouseRef.current.y - lastPoint.y;
                    const ribbonDistance = Math.sqrt(ribbonDx * ribbonDx + ribbonDy * ribbonDy);

                    if (ribbonDistance > 3) {
                        ribbon.addPoint(mouseRef.current.x, mouseRef.current.y);
                    }
                }
            });
        };

        canvas.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw ribbons
            ribbonsRef.current = ribbonsRef.current.filter(ribbon => {
                const isAlive = ribbon.update();
                if (isAlive) {
                    ribbon.draw(ctx);
                }
                return isAlive;
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [baseThickness, colors, speedMultiplier, maxAge, enableFade, enableShaderEffect]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1
            }}
        />
    );
};

export default Ribbons;
