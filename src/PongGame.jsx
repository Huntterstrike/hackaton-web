import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const PongGame = ({ onClose }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);

    const gameStateRef = useRef({
        paddle1: { x: 20, y: 150, width: 10, height: 80 },
        paddle2: { x: 570, y: 150, width: 10, height: 80 },
        ball: { x: 300, y: 200, radius: 8, dx: 4, dy: 3 },
        score: { player1: 0, player2: 0 },
        keys: {}
    });

    const draw = (ctx, state) => {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        if (gameOver) {
            // Mostrar mensaje de final de juego
            ctx.fillStyle = '#0f0';
            ctx.font = 'bold 48px "Press Start 2P", monospace';
            ctx.textAlign = 'center';

            if (winner === 'Player 1') {
                ctx.fillText('YOU WIN!', ctx.canvas.width / 2, ctx.canvas.height / 2 - 40);
            } else {
                ctx.fillText('GAME OVER', ctx.canvas.width / 2, ctx.canvas.height / 2 - 40);
            }

            ctx.font = 'bold 32px "Press Start 2P", monospace';
            ctx.fillText(`${winner} WINS!`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 20);

            ctx.font = '16px "Press Start 2P", monospace';
            ctx.fillText('Pressiona ESC per sortir', ctx.canvas.width / 2, ctx.canvas.height / 2 + 60);
            return;
        }

        // Dibujo normal del juego
        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.moveTo(300, 0);
        ctx.lineTo(300, 400);
        ctx.strokeStyle = '#0f0';
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#0f0';
        ctx.fillRect(state.paddle1.x, state.paddle1.y, state.paddle1.width, state.paddle1.height);
        ctx.fillRect(state.paddle2.x, state.paddle2.y, state.paddle2.width, state.paddle2.height);

        ctx.beginPath();
        ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0f0';
        ctx.fill();
        ctx.closePath();

        ctx.font = '24px "Press Start 2P", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(state.score.player1.toString(), 150, 40);
        ctx.fillText(state.score.player2.toString(), 430, 40);
    };

    const update = (state) => {
        if (gameOver) return; // No actualizar si el juego terminó

        if (state.keys['w'] && state.paddle1.y > 0) {
            state.paddle1.y -= 6;
        }
        if (state.keys['s'] && state.paddle1.y < 400 - state.paddle1.height) {
            state.paddle1.y += 6;
        }

        // IA JUGADOR 2
        const paddle2Center = state.paddle2.y + state.paddle2.height / 2;
        if (Math.random() < 0.95) {
            if (paddle2Center < state.ball.y - 15 && state.paddle2.y < 400 - state.paddle2.height) {
                state.paddle2.y += 3;
            } else if (paddle2Center > state.ball.y + 15 && state.paddle2.y > 0) {
                state.paddle2.y -= 3;
            }
        } else {
            if (paddle2Center < state.ball.y - 15 && state.paddle2.y > 0) {
                state.paddle2.y -= 2;  // se aleja hacia arriba
            } else if (paddle2Center > state.ball.y + 15 && state.paddle2.y < 400 - state.paddle2.height) {
                state.paddle2.y += 2;
            }
        }

        state.ball.x += state.ball.dx;
        state.ball.y += state.ball.dy;

        if (state.ball.y - state.ball.radius < 0 || state.ball.y + state.ball.radius > 400) {
            state.ball.dy = -state.ball.dy;
        }

        if (
            state.ball.x - state.ball.radius < state.paddle1.x + state.paddle1.width &&
            state.ball.y > state.paddle1.y &&
            state.ball.y < state.paddle1.y + state.paddle1.height &&
            state.ball.dx < 0
        ) {
            state.ball.dx = -state.ball.dx;
            const hitPosition = (state.ball.y - (state.paddle1.y + state.paddle1.height / 2)) / (state.paddle1.height / 2);
            state.ball.dy = hitPosition * 5;
        }

        if (
            state.ball.x + state.ball.radius > state.paddle2.x &&
            state.ball.y > state.paddle2.y &&
            state.ball.y < state.paddle2.y + state.paddle2.height &&
            state.ball.dx > 0
        ) {
            state.ball.dx = -state.ball.dx;
            const hitPosition = (state.ball.y - (state.paddle2.y + state.paddle2.height / 2)) / (state.paddle2.height / 2);
            state.ball.dy = hitPosition * 5;
        }

        if (state.ball.x - state.ball.radius < 0) {
            state.score.player2++;
            resetBall(state);
        } else if (state.ball.x + state.ball.radius > 600) {
            state.score.player1++;
            resetBall(state);
        }

        // Comprobar si alguien llegó a 7 puntos
        if (state.score.player1 >= 7) {
            setWinner('Player 1');
            setGameOver(true);
        } else if (state.score.player2 >= 7) {
            setWinner('Player 2');
            setGameOver(true);
        }
    };

    const resetBall = (state) => {
        state.ball.x = 300;
        state.ball.y = 200;
        state.ball.dx = -state.ball.dx;
        state.ball.dy = (Math.random() * 4) - 2;
    };

    const gameLoop = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const state = gameStateRef.current;

        update(state);
        draw(ctx, state);

        if (!gameOver) {
            animationRef.current = requestAnimationFrame(gameLoop);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
            gameStateRef.current.keys[e.key] = true;
        };

        const handleKeyUp = (e) => {
            gameStateRef.current.keys[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        animationRef.current = requestAnimationFrame(gameLoop);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [gameOver, onClose]);

    return (
        <div className="pong-game-container">
            <div className="pong-header">
                <h2>EASTER EGG PONG TROBAT!!</h2>
            </div>
            <div className="pong-instructions">
                <p>Controls: W/S per moure't</p>
            </div>
            <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="pong-canvas"
            />
            <div className="pong-footer">
                <button onClick={onClose} className="close-button">Tancar</button>
                <p>Envian's una captura o video a @CodeURV en Instagram!</p>
            </div>
        </div>
    );
};

export default PongGame;