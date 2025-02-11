import { createSignal } from "solid-js";


export const [screenSize, setScreenSize] = createSignal({
    height: window.innerHeight,
    width: window.innerWidth
});

export const useScreenSize = () => {
    const handler = () => {
        setScreenSize({ height: window.innerHeight, width: window.innerWidth });
    };

    const mountListener = (() => {
        window.addEventListener('resize', handler);
    });

    const cleanupListener = (() => {
        window.removeEventListener('resize', handler);
    })

    return [mountListener, cleanupListener]
}