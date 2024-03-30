import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';

const TypingAnimation = ({ text, delay = 50, loop = false, speed = 100 }) => {
    const [typedText, setTypedText] = useState('');
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const animationRef = useRef(null);

    useEffect(() => {
        const type = () => {
            if (currentCharIndex < text.length) {
                setTypedText(text.substring(0, currentCharIndex + 1));
                setCurrentCharIndex(currentCharIndex + 1);
            } else if (loop) {
                setTypedText('');
                setCurrentCharIndex(0);
            }
        };

        const intervalId = setInterval(type, delay);

        return () => clearInterval(intervalId);
    }, [text, delay, loop, currentCharIndex]);

    const animationProps = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        delay: animationRef.current ? 0 : speed, // Avoid initial delay on loop
        config: { duration: speed },
        onRest: () => {
            animationRef.current = true;
        },
    });

    return (
        <animated.span style={animationProps}>{typedText}</animated.span>
    );
};

export default TypingAnimation;
